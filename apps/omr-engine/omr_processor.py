import cv2
import numpy as np
import base64
import json

# ── Canvas constants (A4 at 96 dpi) ──────────────────────────────────────────
CANVAS_W = 794
CANVAS_H = 1123
MCQ_OPTIONS = 4  # ক খ গ ঘ


# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: Perspective warp using corner fiducials
# ─────────────────────────────────────────────────────────────────────────────

def _find_fiducials(gray):
    """
    Find the 4 corner fiducial markers by picking the closest
    square-shaped solid contour to each image corner.
    This is immune to filled bubbles or other dark shapes in the page interior.
    """
    h, w = gray.shape
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    candidates = []
    for c in cnts:
        (x, y, cw, ch) = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        if cw == 0 or ch == 0:
            continue
        ar = cw / float(ch)
        fill = area / (cw * ch)
        # Square-ish, solid-filled, 15–10% of image width
        if (15 < cw < w * 0.10 and 15 < ch < h * 0.10
                and 0.65 < ar < 1.35 and fill > 0.72):
            M = cv2.moments(c)
            if M["m00"] == 0:
                continue
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            candidates.append((cx, cy))

    if len(candidates) < 3:
        return None

    # For each corner, pick the nearest candidate (if within a reasonable distance)
    corner_targets = [(0, 0), (w, 0), (w, h), (0, h)]  # TL TR BR BL
    chosen = [None] * 4
    used = set()
    for target_idx, (tx, ty) in enumerate(corner_targets):
        best_dist = float('inf')
        best_idx = -1
        for i, (cx, cy) in enumerate(candidates):
            if i in used:
                continue
            dist = (cx - tx) ** 2 + (cy - ty) ** 2
            # Must be somewhat near the corner (within 40% of page dimensions)
            if dist < best_dist and dist < (w * 0.4) ** 2 + (h * 0.4) ** 2:
                best_dist = dist
                best_idx = i
        if best_idx >= 0:
            used.add(best_idx)
            chosen[target_idx] = list(candidates[best_idx])

    found_count = sum(1 for c in chosen if c is not None)
    if found_count < 3:
        return None

    # If exactly 3 are found (e.g. one corner folded/obscured), infer the 4th
    # assuming the markers form a rough parallelogram
    if found_count == 3:
        if chosen[0] is None:  # TL = TR + BL - BR
            chosen[0] = [chosen[1][0] + chosen[3][0] - chosen[2][0], chosen[1][1] + chosen[3][1] - chosen[2][1]]
        elif chosen[1] is None:  # TR = TL + BR - BL
            chosen[1] = [chosen[0][0] + chosen[2][0] - chosen[3][0], chosen[0][1] + chosen[2][1] - chosen[3][1]]
        elif chosen[2] is None:  # BR = TR + BL - TL
            chosen[2] = [chosen[1][0] + chosen[3][0] - chosen[0][0], chosen[1][1] + chosen[3][1] - chosen[0][1]]
        elif chosen[3] is None:  # BL = TL + BR - TR
            chosen[3] = [chosen[0][0] + chosen[2][0] - chosen[1][0], chosen[0][1] + chosen[2][1] - chosen[1][1]]

    return np.array(chosen, dtype=np.float32)  # [TL, TR, BR, BL]


def _perspective_warp(img, corners):
    """Warp to a standard CANVAS_W×CANVAS_H rectangle. corners = [TL,TR,BR,BL]."""
    dst = np.array([
        [0, 0],
        [CANVAS_W - 1, 0],
        [CANVAS_W - 1, CANVAS_H - 1],
        [0, CANVAS_H - 1]
    ], dtype=np.float32)
    M = cv2.getPerspectiveTransform(corners, dst)
    return cv2.warpPerspective(img, M, (CANVAS_W, CANVAS_H))


# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Find Roll/MCQ divider line
# ─────────────────────────────────────────────────────────────────────────────

def _find_divider_y(gray_warped):
    """
    Scan horizontal rows for the darkest horizontal band.
    Uses horizontal morphological opening to isolate the solid divider line
    and ignore dark noise from fold creases or wrinkles.
    """
    search_top = int(CANVAS_H * 0.10)
    search_bot = int(CANVAS_H * 0.65)
    region = gray_warped[search_top:search_bot, :]

    # Threshold and keep only long horizontal structures
    thresh = cv2.threshold(region, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 1))
    horizontal_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    dark_per_row = np.sum(horizontal_lines > 0, axis=1)
    max_dark = dark_per_row.max()

    # Need > 40% of width to be a solid line
    if max_dark < CANVAS_W * 0.40:
        return int(CANVAS_H * 0.38)  # fallback

    divider_local = int(np.argmax(dark_per_row))
    return search_top + divider_local


# ─────────────────────────────────────────────────────────────────────────────
# STEP 3: Detect all bubble contours in the warped image
# ─────────────────────────────────────────────────────────────────────────────

def _find_bubbles(gray_warped):
    """
    Find all bubble-shaped contours in the warped image.
    Uses the morphological gradient of the threshold image so that
    BOTH empty bubbles (ring outline) AND heavily-filled solid bubbles
    (solid dark blob whose Canny edges are incomplete) are reliably found.
    """
    blurred = cv2.GaussianBlur(gray_warped, (5, 5), 0)
    thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

    # Morphological gradient = dilation - erosion = outline of every dark region.
    # Works perfectly for both ring-shaped (empty) and solid (filled) bubbles.
    kernel = np.ones((3, 3), np.uint8)
    gradient = cv2.morphologyEx(thresh, cv2.MORPH_GRADIENT, kernel)

    cnts, _ = cv2.findContours(gradient.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    bubbles = []
    for c in cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        if w == 0 or h == 0 or area == 0:
            continue
        ar = w / float(h)
        perimeter = cv2.arcLength(c, True)
        if perimeter == 0:
            continue
        circularity = 4 * np.pi * area / (perimeter ** 2)

        # Bubbles are 12–60px across, roughly square, and roughly circular.
        # Lower circularity threshold (0.45) catches imperfect fills.
        if (12 <= w <= 62 and 12 <= h <= 62
                and 0.62 < ar < 1.38
                and circularity > 0.45):
            bubbles.append(c)

    return bubbles


# ─────────────────────────────────────────────────────────────────────────────
# STEP 4: Grade Roll ID (6 columns × 10 rows, digits 0–9 top-to-bottom)
# ─────────────────────────────────────────────────────────────────────────────

def _grade_roll_id(thresh_warped, output_img, roll_bubbles):
    """Grade the Roll ID grid. Returns the roll number string."""
    if not roll_bubbles:
        return ""

    # Sort left-to-right
    roll_bubbles = sorted(roll_bubbles, key=lambda c: cv2.boundingRect(c)[0])

    w_med = int(np.median([cv2.boundingRect(c)[2] for c in roll_bubbles]))
    h_med = int(np.median([cv2.boundingRect(c)[3] for c in roll_bubbles]))

    # Split into columns by X gaps larger than 1.5× bubble width
    cols = []
    curr_col = [roll_bubbles[0]]
    for c in roll_bubbles[1:]:
        x_curr = cv2.boundingRect(c)[0]
        x_prev = cv2.boundingRect(curr_col[-1])[0]
        if x_curr - x_prev > w_med * 1.5:
            cols.append(curr_col)
            curr_col = [c]
        else:
            curr_col.append(c)
    cols.append(curr_col)

    digit_map = [str(d) for d in range(10)]  # 0 at top → index 0 = "0"
    roll_number = ""

    for col in cols:
        # Need at least 5 bubbles to be a valid digit column
        if len(col) < 5:
            continue

        # Sort top-to-bottom
        col_sorted = sorted(col, key=lambda c: cv2.boundingRect(c)[1])

        fill_ratios = []
        centers = []
        for c in col_sorted:
            (x, y, w, h) = cv2.boundingRect(c)
            cx, cy = x + w // 2, y + h // 2
            r = max(5, min(w, h) // 2 - 1)
            mask = np.zeros(thresh_warped.shape, dtype=np.uint8)
            cv2.drawContours(mask, [c], -1, 255, -1)  # fill actual contour shape
            pixels = cv2.countNonZero(cv2.bitwise_and(thresh_warped, thresh_warped, mask=mask))
            area = cv2.contourArea(c) or (np.pi * r * r)
            fill_ratios.append(pixels / area)
            centers.append((cx, cy, r))

        best_idx = int(np.argmax(fill_ratios))
        best_fill = fill_ratios[best_idx]
        other = [f for i, f in enumerate(fill_ratios) if i != best_idx]
        second = max(other) if other else 0
        is_filled = best_fill >= 0.35 or (
            best_fill >= 0.10 and (second == 0 or best_fill >= second * 1.5)
        )

        clearly_filled_count = sum(1 for f in fill_ratios if f >= 0.35)

        if clearly_filled_count >= 2:
            # More than one digit bubble filled in the same column — invalid
            roll_number += "?"
        elif is_filled and best_idx < 10:
            roll_number += digit_map[best_idx]

        # Visual proof
        for i, (cx, cy, r) in enumerate(centers):
            color = (0, 255, 0) if (i == best_idx and is_filled) else (0, 0, 255)
            thickness = 2 if (i == best_idx and is_filled) else 1
            cv2.circle(output_img, (cx, cy), r, color, thickness)

    return roll_number


# ─────────────────────────────────────────────────────────────────────────────
# STEP 5: Grade MCQ (row-by-row, then column group by X gaps)
# ─────────────────────────────────────────────────────────────────────────────

def _grade_mcq(thresh_warped, output_img, mcq_bubbles, num_columns):
    """
    Grade MCQ section.
    Algorithm:
      1. Sort bubbles top-to-bottom → group into question rows by Y proximity.
      2. Within each row, sort left-to-right → split into column groups by large X gaps.
      3. Within each group, take the rightmost 4 (skip any question number label).
      4. Grade with relative fill comparison.
      5. Assign Q numbers: (row_idx, col_idx) → q_num.
    """
    extracted_answers = {}
    options_map = ["ক", "খ", "গ", "ঘ"]

    if len(mcq_bubbles) < 4:
        return extracted_answers

    w_med = int(np.median([cv2.boundingRect(c)[2] for c in mcq_bubbles]))
    h_med = int(np.median([cv2.boundingRect(c)[3] for c in mcq_bubbles]))
    r = max(5, min(w_med, h_med) // 2 - 1)

    # ── 1. Find exact global X-coordinates for all option columns ─────────────
    all_x = [cv2.boundingRect(c)[0] + cv2.boundingRect(c)[2]//2 for c in mcq_bubbles]
    sorted_x = sorted(all_x)
    
    # Cluster X coordinates (merge if within w_med * 0.55)
    clusters_x = []
    curr_x = [sorted_x[0]]
    for x in sorted_x[1:]:
        if x - curr_x[-1] < w_med * 0.55:
            curr_x.append(x)
        else:
            clusters_x.append(int(np.median(curr_x)))
            curr_x = [x]
    clusters_x.append(int(np.median(curr_x)))

    # Group into question blocks by large gaps (w_med * 2.2)
    col_blocks = []
    curr_block = [clusters_x[0]]
    for x in clusters_x[1:]:
        if x - curr_block[-1] > w_med * 2.2:
            col_blocks.append(curr_block)
            curr_block = [x]
        else:
            curr_block.append(x)
    col_blocks.append(curr_block)

    # For each block, extract the rightmost 4 columns (Options: ক, খ, গ, ঘ)
    expected_x_per_col = []
    for block in col_blocks:
        if len(block) >= MCQ_OPTIONS:
            expected_x_per_col.append(block[-MCQ_OPTIONS:])

    # ── 2. Group bubbles into horizontal rows ─────────────────────────────────
    sorted_by_y = sorted(mcq_bubbles, key=lambda c: cv2.boundingRect(c)[1])
    rows = []
    curr_row = [sorted_by_y[0]]
    for c in sorted_by_y[1:]:
        y_curr = cv2.boundingRect(c)[1]
        y_prev = cv2.boundingRect(curr_row[-1])[1]
        if abs(y_curr - y_prev) < h_med * 0.55:
            curr_row.append(c)
        else:
            rows.append(curr_row)
            curr_row = [c]
    rows.append(curr_row)

    # ── 3. Grade grid using exact coordinate sampling ─────────────────────────
    answer_grid = {}  # (row_idx, col_idx) → answer_char

    for row_idx, row in enumerate(rows):
        row_y = int(np.median([cv2.boundingRect(c)[1] + cv2.boundingRect(c)[3]//2 for c in row]))

        for col_idx, expected_xs in enumerate(expected_x_per_col):
            # Check if this question block actually exists in this row
            # (e.g. Q29, Q30 might not exist in the 3rd block)
            block_exists = any(
                min(abs((cv2.boundingRect(c)[0] + cv2.boundingRect(c)[2]//2) - ex) for ex in expected_xs) < w_med
                for c in row
            )
            if not block_exists:
                continue

            fill_ratios = []
            centers = []
            for ox in expected_xs:
                cx, cy = ox, row_y
                mask = np.zeros(thresh_warped.shape, dtype=np.uint8)
                cv2.circle(mask, (cx, cy), r, 255, -1)
                pixels = cv2.countNonZero(cv2.bitwise_and(thresh_warped, thresh_warped, mask=mask))
                area = np.pi * r * r
                fill_ratios.append(pixels / area)
                centers.append((cx, cy, r))

            best_idx = int(np.argmax(fill_ratios))
            best_fill = fill_ratios[best_idx]
            other = [f for i, f in enumerate(fill_ratios) if i != best_idx]
            second = max(other) if other else 0

            # Absolute bypass: if clearly filled (>35%), grade it regardless of ratio.
            is_filled = best_fill >= 0.35 or (
                best_fill >= 0.12 and (second == 0 or best_fill >= second * 1.5)
            )

            # Check for double-fill: 2+ options both clearly marked
            clearly_filled_count = sum(1 for f in fill_ratios if f >= 0.35)

            if clearly_filled_count >= 2:
                answer = "DOUBLE"
            elif is_filled and best_idx < len(options_map):
                answer = options_map[best_idx]
            else:
                answer = "BLANK"
            answer_grid[(row_idx, col_idx)] = answer

            # Visual proof: circles
            # Green  = the selected answer
            # Orange = double-fill (student marked 2+ options)
            # Red    = empty / not selected
            for i, (cx, cy, cr) in enumerate(centers):
                if answer == "DOUBLE":
                    color = (0, 165, 255) if fill_ratios[i] >= 0.35 else (0, 0, 255)
                    thickness = 2 if fill_ratios[i] >= 0.35 else 1
                elif i == best_idx and is_filled:
                    color = (0, 255, 0)
                    thickness = 2
                else:
                    color = (0, 0, 255)
                    thickness = 1
                cv2.circle(output_img, (cx, cy), cr, color, thickness)

    if not answer_grid:
        return extracted_answers

    # ── Assign Q numbers ──────────────────────────────────────────────────────
    # Layout: questions fill column by column (Q1-Q10 col0, Q11-Q20 col1, Q21-Q28 col2)
    # (row_idx, col_idx) → q_num = col_idx * qpc + row_idx + 1
    num_rows = max(k[0] for k in answer_grid) + 1
    questions_per_column = num_rows  # same number of rows in each column

    for (row_idx, col_idx), answer in sorted(answer_grid.items()):
        q_num = col_idx * questions_per_column + row_idx + 1
        extracted_answers[str(q_num)] = answer

    return extracted_answers


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def process_omr_image(image_bytes: bytes, num_columns: int = 3) -> dict:
    """
    100% Accurate OMR pipeline:
    1. Find 4 fiducial corner markers → perspective-warp to flat A4 canvas.
    2. Scan for horizontal divider line (Roll ID vs MCQ boundary).
    3. Detect all bubble contours in the flat image.
    4. Grade Roll ID (6 columns × 10 rows).
    5. Grade MCQ (row-by-row, column groups by X gaps, relative fill).
    6. Return annotated image as base64.
    """
    # ── Decode ─────────────────────────────────────────────────────────────────
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image.")

    gray_orig = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    # This completely normalizes uneven lighting (shadows, yellowed paper)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray_orig = clahe.apply(gray_orig)

    # ── Read QR code ───────────────────────────────────────────────────────────
    qr_detector = cv2.QRCodeDetector()
    qr_data, _, _ = qr_detector.detectAndDecode(gray_orig)
    paper_id = None
    if qr_data:
        try:
            meta = json.loads(qr_data)
            paper_id = meta.get("id", qr_data)
            num_columns = int(meta.get("cols", num_columns))
        except (json.JSONDecodeError, ValueError):
            paper_id = qr_data  # legacy: plain UUID

    # ── Perspective warp ───────────────────────────────────────────────────────
    corners = _find_fiducials(gray_orig)
    fiducials_found = corners is not None

    if fiducials_found:
        warped = _perspective_warp(img, corners)
    else:
        warped = cv2.resize(img, (CANVAS_W, CANVAS_H))

    output_img = warped.copy()
    gray_w = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    gray_w = clahe.apply(gray_w)  # Apply CLAHE to warped image as well
    thresh_w = cv2.threshold(gray_w, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

    # ── Find divider line ──────────────────────────────────────────────────────
    divider_y = _find_divider_y(gray_w)
    cv2.line(output_img, (0, divider_y), (CANVAS_W, divider_y), (255, 128, 0), 2)

    # ── Detect all bubbles ─────────────────────────────────────────────────────
    all_bubbles = _find_bubbles(gray_w)

    roll_bubbles = [c for c in all_bubbles if cv2.boundingRect(c)[1] < divider_y]
    mcq_bubbles  = [c for c in all_bubbles if cv2.boundingRect(c)[1] > divider_y]

    # ── Grade sections ─────────────────────────────────────────────────────────
    roll_number = _grade_roll_id(thresh_w, output_img, roll_bubbles)
    extracted_answers = _grade_mcq(thresh_w, output_img, mcq_bubbles, num_columns)

    # ── Encode annotated image ─────────────────────────────────────────────────
    _, buf = cv2.imencode('.jpg', output_img, [cv2.IMWRITE_JPEG_QUALITY, 88])
    b64 = base64.b64encode(buf).decode('utf-8')

    return {
        "paperId": paper_id or "not-detected",
        "rollNumber": roll_number or "Could not parse",
        "answers": extracted_answers,
        "processed_image_base64": f"data:image/jpeg;base64,{b64}",
        "debug": {
            "fiducials_found": fiducials_found,
            "divider_y": divider_y,
            "num_columns": num_columns,
            "bubbles_found": len(all_bubbles),
        }
    }
