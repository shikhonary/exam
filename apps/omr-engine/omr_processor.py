"""
omr_processor_v2.py — Hardened enterprise OMR with multi-level fallbacks.

Improvements:
  - Multi-strategy fiducial detection (4 cascading approaches)
  - Adaptive bubble detection with morphological post-processing
  - Robust divider line finding with crease immunity
  - Better handling of crumpled, torn, and severely degraded sheets
  - Post-processing to separate merged bubbles
  - Quality-adaptive thresholding
"""

import cv2
import numpy as np
import base64
import json
from image_enhancer import (
    normalise_resolution, enhance_for_omr, best_threshold, 
    apply_clahe
)

CANVAS_W = 794
CANVAS_H = 1123
MCQ_OPTIONS = 4


# ─────────────────────────────────────────────────────────────────────────────
# IMPROVED QR CODE READING
# ─────────────────────────────────────────────────────────────────────────────

def _read_qr(gray_raw: np.ndarray) -> tuple[str | None, int]:
    """Enhanced QR reading with 5 strategies."""
    detector = cv2.QRCodeDetector()
    candidates = []
    
    # Strategy 1: raw grayscale
    candidates.append(gray_raw)
    
    # Strategy 2: CLAHE for low contrast
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    clahe_img = clahe.apply(gray_raw)
    candidates.append(clahe_img)
    
    # Strategy 3: Otsu binarised
    blurred = cv2.GaussianBlur(gray_raw, (3, 3), 0)
    _, otsu = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    candidates.append(otsu)
    
    # Strategy 4: Adaptive threshold
    adaptive = cv2.adaptiveThreshold(blurred, 255,
                                     cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                     cv2.THRESH_BINARY, 31, 8)
    candidates.append(adaptive)
    
    # Strategy 5: Inverted adaptive (for white QR on black background)
    inv_adaptive = cv2.bitwise_not(adaptive)
    candidates.append(inv_adaptive)
    
    for img in candidates:
        try:
            data, _, _ = detector.detectAndDecode(img)
            if data:
                return data, None
        except:
            pass
    
    # Try zxingcpp if available
    try:
        import zxingcpp
        for img in candidates:
            results = zxingcpp.read_barcodes(img)
            if results:
                return results[0].text, None
    except:
        pass
    
    return None, None


def _parse_qr_data(qr_data: str, num_columns: int) -> tuple[str | None, int]:
    """Parse QR string → (paper_id, num_columns)."""
    if not qr_data:
        return None, num_columns
    try:
        meta = json.loads(qr_data)
        paper_id = meta.get("id", qr_data)
        cols = int(meta.get("cols", num_columns))
        return paper_id, cols
    except:
        return qr_data, num_columns


# ─────────────────────────────────────────────────────────────────────────────
# IMPROVED FIDUCIAL DETECTION (4-STRATEGY CASCADE)
# ─────────────────────────────────────────────────────────────────────────────

def _best_square_in_roi(roi: np.ndarray, ox: int, oy: int,
                        min_px: float, max_px: float) -> tuple[int, int] | None:
    """Find best square marker in ROI."""
    if roi.size == 0:
        return None
    
    rh, rw = roi.shape
    blurred = cv2.GaussianBlur(roi, (5, 5), 0)
    
    best_candidate = None
    best_score = -1.0
    
    for thresh_fn in [
        lambda b: cv2.threshold(b, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1],
        lambda b: cv2.threshold(b, 100, 255, cv2.THRESH_BINARY_INV)[1],
        lambda b: cv2.adaptiveThreshold(b, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                        cv2.THRESH_BINARY_INV, 31, 8),
    ]:
        try:
            thresh = thresh_fn(blurred)
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
            thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        except:
            continue
        
        cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for c in cnts:
            (x, y, cw, ch) = cv2.boundingRect(c)
            area = cv2.contourArea(c)
            if cw == 0 or ch == 0 or area == 0:
                continue
            if not (min_px <= cw <= max_px and min_px <= ch <= max_px):
                continue
            
            ar = cw / float(ch)
            if not (0.50 < ar < 1.50):
                continue
            
            fill = area / (cw * ch)
            if fill < 0.45:
                continue
            
            squareness = 1.0 - abs(1.0 - ar)
            M = cv2.moments(c)
            if M["m00"] == 0:
                continue
            
            cx_local = int(M["m10"] / M["m00"])
            cy_local = int(M["m01"] / M["m00"])
            score = fill * squareness * 0.9  # weight fill highest
            
            if score > best_score:
                best_score = score
                best_candidate = (ox + cx_local, oy + cy_local)
    
    return best_candidate


def _infer_missing_corner(chosen: list) -> list:
    """Infer missing corner from 3 known corners."""
    valid_count = sum(1 for c in chosen if c is not None)
    if valid_count == 4:
        return chosen
    
    if chosen[0] is None and chosen[1] and chosen[2] and chosen[3]:
        chosen[0] = [chosen[1][0] + chosen[3][0] - chosen[2][0],
                     chosen[1][1] + chosen[3][1] - chosen[2][1]]
    elif chosen[1] is None and chosen[0] and chosen[2] and chosen[3]:
        chosen[1] = [chosen[0][0] + chosen[2][0] - chosen[3][0],
                     chosen[0][1] + chosen[2][1] - chosen[3][1]]
    elif chosen[2] is None and chosen[0] and chosen[1] and chosen[3]:
        chosen[2] = [chosen[1][0] + chosen[3][0] - chosen[0][0],
                     chosen[1][1] + chosen[3][1] - chosen[0][1]]
    elif chosen[3] is None and chosen[0] and chosen[1] and chosen[2]:
        chosen[3] = [chosen[0][0] + chosen[2][0] - chosen[1][0],
                     chosen[0][1] + chosen[2][1] - chosen[1][1]]
    
    return chosen


def _find_fiducials_strategy1(gray_enhanced: np.ndarray) -> np.ndarray | None:
    """Strategy 1: Corner quadrant detection (original)."""
    h, w = gray_enhanced.shape
    zw = int(w * 0.22)
    zh = int(h * 0.22)
    
    short = min(w, h)
    min_px = max(8, short * 0.010)
    max_px = short * 0.07
    
    corner_rois = [
        (gray_enhanced[0:zh, 0:zw], 0, 0),
        (gray_enhanced[0:zh, w-zw:w], w-zw, 0),
        (gray_enhanced[h-zh:h, w-zw:w], w-zw, h-zh),
        (gray_enhanced[h-zh:h, 0:zw], 0, h-zh),
    ]
    
    chosen = [None] * 4
    for i, (roi, ox, oy) in enumerate(corner_rois):
        pt = _best_square_in_roi(roi, ox, oy, min_px, max_px)
        if pt is not None:
            chosen[i] = list(pt)
    
    found_count = sum(1 for c in chosen if c is not None)
    if found_count < 3:
        return None
    
    if found_count == 3:
        chosen = _infer_missing_corner(chosen)
    
    pts = np.array(chosen, dtype=np.float32)
    span_x = float(np.max(pts[:, 0]) - np.min(pts[:, 0]))
    span_y = float(np.max(pts[:, 1]) - np.min(pts[:, 1]))
    
    if span_x < w * 0.50 or span_y < h * 0.50:
        return None
    
    return pts


def _find_fiducials_strategy2(gray_enhanced: np.ndarray) -> np.ndarray | None:
    """Strategy 2: Larger corner zones (for severely rotated images)."""
    h, w = gray_enhanced.shape
    zw = int(w * 0.35)
    zh = int(h * 0.35)
    
    short = min(w, h)
    min_px = max(8, short * 0.008)
    max_px = short * 0.12
    
    corner_rois = [
        (gray_enhanced[0:zh, 0:zw], 0, 0),
        (gray_enhanced[0:zh, w-zw:w], w-zw, 0),
        (gray_enhanced[h-zh:h, w-zw:w], w-zw, h-zh),
        (gray_enhanced[h-zh:h, 0:zw], 0, h-zh),
    ]
    
    chosen = [None] * 4
    for i, (roi, ox, oy) in enumerate(corner_rois):
        pt = _best_square_in_roi(roi, ox, oy, min_px, max_px)
        if pt is not None:
            chosen[i] = list(pt)
    
    found_count = sum(1 for c in chosen if c is not None)
    if found_count < 2:
        return None
    
    if 2 <= found_count <= 3:
        chosen = _infer_missing_corner(chosen)
    
    pts = np.array([c for c in chosen if c is not None], dtype=np.float32)
    if len(pts) < 3:
        return None
    
    return pts


def _find_paper_quad(gray: np.ndarray) -> np.ndarray | None:
    """Strategy 3: Find paper boundary using edge detection."""
    h, w = gray.shape
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    edges = cv2.Canny(blurred, 30, 100)
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    dilated = cv2.dilate(edges, kernel, iterations=3)
    
    cnts, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:10]
    
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        
        if len(approx) >= 4:
            pts = approx.reshape(-1, 2).astype(np.float32)
            
            # Find 4 extreme points
            s = pts.sum(axis=1)
            d = np.diff(pts, axis=1).flatten()
            
            quad = np.array([
                pts[np.argmin(s)],
                pts[np.argmin(d)],
                pts[np.argmax(s)],
                pts[np.argmax(d)],
            ], dtype=np.float32)
            
            span_x = float(np.max(quad[:, 0]) - np.min(quad[:, 0]))
            span_y = float(np.max(quad[:, 1]) - np.min(quad[:, 1]))
            
            if span_x > w * 0.40 and span_y > h * 0.40:
                return quad
    
    return None


def _find_fiducials_strategy4_content(gray_enhanced: np.ndarray) -> np.ndarray | None:
    """Strategy 4: Use content-based detection (dark regions) as last resort."""
    h, w = gray_enhanced.shape
    
    # Find very dark regions (markers should be darker than content)
    thresh = cv2.threshold(gray_enhanced, 50, 255, cv2.THRESH_BINARY_INV)[1]
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    # Contours in each corner
    quarters = [
        (0, 0, w//2, h//2),
        (w//2, 0, w, h//2),
        (w//2, h//2, w, h),
        (0, h//2, w, h),
    ]
    
    pts = []
    for x1, y1, x2, y2 in quarters:
        roi = thresh[y1:y2, x1:x2]
        if cv2.countNonZero(roi) < 20:
            continue
        
        cnts, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if cnts:
            largest = max(cnts, key=cv2.contourArea)
            M = cv2.moments(largest)
            if M["m00"] > 0:
                cx = int(M["m10"] / M["m00"]) + x1
                cy = int(M["m01"] / M["m00"]) + y1
                pts.append([cx, cy])
    
    if len(pts) >= 3:
        return np.array(pts, dtype=np.float32)
    
    return None


def _find_fiducials(gray_enhanced: np.ndarray) -> np.ndarray | None:
    """
    Multi-strategy fiducial detection with 4-level cascade.
    Returns None if all strategies fail.
    """
    strategies = [
        _find_fiducials_strategy1,
        _find_fiducials_strategy2,
        lambda g: _find_paper_quad(g),
        _find_fiducials_strategy4_content,
    ]
    
    for strategy in strategies:
        try:
            result = strategy(gray_enhanced)
            if result is not None and len(result) >= 4:
                return result
        except:
            pass
    
    return None


# ─────────────────────────────────────────────────────────────────────────────
# IMPROVED PERSPECTIVE WARP
# ─────────────────────────────────────────────────────────────────────────────

def _perspective_warp(img: np.ndarray, corners: np.ndarray) -> np.ndarray:
    """Warp to CANVAS_W × CANVAS_H."""
    corners = corners[:4]  # Use only first 4 points
    
    dst = np.array([
        [0, 0],
        [CANVAS_W - 1, 0],
        [CANVAS_W - 1, CANVAS_H - 1],
        [0, CANVAS_H - 1]
    ], dtype=np.float32)
    
    try:
        M = cv2.getPerspectiveTransform(corners, dst)
        warped = cv2.warpPerspective(img, M, (CANVAS_W, CANVAS_H),
                                     borderMode=cv2.BORDER_REPLICATE)
        return warped
    except:
        # Fallback: simple resize if perspective fails
        return cv2.resize(img, (CANVAS_W, CANVAS_H), interpolation=cv2.INTER_AREA)


# ─────────────────────────────────────────────────────────────────────────────
# IMPROVED DIVIDER LINE DETECTION
# ─────────────────────────────────────────────────────────────────────────────

def _find_divider_y(gray_warped: np.ndarray) -> int:
    """
    Find divider with crease immunity using continuity + morphology.
    """
    search_top = int(CANVAS_H * 0.15)
    search_bot = int(CANVAS_H * 0.55)
    region = gray_warped[search_top:search_bot, :]
    
    thresh = cv2.threshold(region, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    
    # Horizontal morphology with multiple kernel sizes
    best_score = 0
    best_row = int((search_top + search_bot) / 2)
    
    for kern_size in [30, 40, 50]:
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kern_size, 1))
        horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        
        for row_i in range(horizontal.shape[0]):
            row_pixels = horizontal[row_i, :]
            dark_count = int(np.sum(row_pixels > 0))
            
            if dark_count < CANVAS_W * 0.25:
                continue
            
            # Continuity: longest unbroken run
            max_run = 0
            curr_run = 0
            for px in row_pixels:
                if px > 0:
                    curr_run += 1
                    max_run = max(max_run, curr_run)
                else:
                    curr_run = 0
            
            continuity = max_run / CANVAS_W
            score = dark_count * (continuity ** 2.5)
            
            if score > best_score:
                best_score = score
                best_row = row_i
    
    if best_score < 5:
        return int(CANVAS_H * 0.38)
    
    return search_top + best_row


# ─────────────────────────────────────────────────────────────────────────────
# IMPROVED BUBBLE DETECTION WITH POST-PROCESSING
# ─────────────────────────────────────────────────────────────────────────────

def _find_bubbles_contour(gray_warped: np.ndarray) -> list:
    """Dual-channel contour with morphological refinement."""
    blurred = cv2.GaussianBlur(gray_warped, (5, 5), 0)
    thresh = best_threshold(gray_warped)
    
    kernel3 = np.ones((3, 3), np.uint8)
    kernel5 = np.ones((5, 5), np.uint8)
    
    # Channel A: gradient (empty bubbles)
    gradient = cv2.morphologyEx(thresh, cv2.MORPH_GRADIENT, kernel3)
    cnts_a, _ = cv2.findContours(gradient.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Channel B: closed (filled bubbles)
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel5)
    cnts_b, _ = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    all_cnts = list(cnts_a) + list(cnts_b)
    bubbles_raw = []
    
    for c in all_cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        area = cv2.contourArea(c)
        if w == 0 or h == 0 or area == 0:
            continue
        
        ar = w / float(h)
        perimeter = cv2.arcLength(c, True)
        if perimeter == 0:
            continue
        
        circularity = 4 * np.pi * area / (perimeter ** 2)
        
        if (8 <= w <= 80 and 8 <= h <= 80
                and 0.40 < ar < 1.60
                and circularity > 0.25):
            M = cv2.moments(c)
            if M["m00"] == 0:
                continue
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            bubbles_raw.append((cx, cy, c))
    
    # Dedup: merge within 10px
    bubbles_raw.sort(key=lambda t: (t[1], t[0]))
    used = [False] * len(bubbles_raw)
    result = []
    
    for i, (cx, cy, c) in enumerate(bubbles_raw):
        if used[i]:
            continue
        used[i] = True
        result.append(c)
        
        for j in range(i + 1, len(bubbles_raw)):
            if used[j]:
                continue
            cx2, cy2, _ = bubbles_raw[j]
            if abs(cx2 - cx) < 11 and abs(cy2 - cy) < 11:
                used[j] = True
    
    return result


def _find_bubbles_hough(gray_warped: np.ndarray) -> list:
    """Hough circle fallback."""
    blurred = cv2.GaussianBlur(gray_warped, (7, 7), 0)
    circles = cv2.HoughCircles(
        blurred,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=16,
        param1=60,
        param2=20,
        minRadius=5,
        maxRadius=36
    )
    
    if circles is None:
        return []
    
    circles = np.round(circles[0, :]).astype(int)
    pseudo_contours = []
    
    for (cx, cy, r) in circles:
        pts = []
        for angle_deg in range(0, 360, 20):
            angle = angle_deg * np.pi / 180
            px = int(cx + r * np.cos(angle))
            py = int(cy + r * np.sin(angle))
            pts.append([[px, py]])
        c = np.array(pts, dtype=np.int32)
        pseudo_contours.append(c)
    
    return pseudo_contours


def _find_bubbles(gray_warped: np.ndarray, expected_min: int = 20) -> list:
    """Primary contour + Hough fallback."""
    bubbles = _find_bubbles_contour(gray_warped)
    
    if len(bubbles) < expected_min * 0.4:
        hough = _find_bubbles_hough(gray_warped)
        if len(hough) > len(bubbles) * 0.8:
            bubbles = hough
    
    return bubbles


# ─────────────────────────────────────────────────────────────────────────────
# FILL MEASUREMENT
# ─────────────────────────────────────────────────────────────────────────────

def _measure_fill(thresh: np.ndarray, cx: int, cy: int, r: int) -> float:
    """Multi-radius fill sampling."""
    fills = []
    for sample_r in [max(3, r - 2), r, r + 2]:
        mask = np.zeros(thresh.shape, dtype=np.uint8)
        cv2.circle(mask, (cx, cy), sample_r, 255, -1)
        pixels = cv2.countNonZero(cv2.bitwise_and(thresh, thresh, mask=mask))
        area = float(np.pi * sample_r * sample_r)
        if area > 0:
            fills.append(pixels / area)
    
    return float(np.median(fills)) if fills else 0.0


# ─────────────────────────────────────────────────────────────────────────────
# GRADING: ROLL ID
# ─────────────────────────────────────────────────────────────────────────────

def _grade_roll_id(thresh_w: np.ndarray, output_img: np.ndarray,
                   roll_bubbles: list) -> tuple[str, list[str]]:
    """Grade roll ID with improved error handling."""
    warnings = []
    
    if not roll_bubbles:
        warnings.append("No roll ID bubbles detected.")
        return "", warnings
    
    w_med = int(np.median([cv2.boundingRect(c)[2] for c in roll_bubbles]))
    h_med = int(np.median([cv2.boundingRect(c)[3] for c in roll_bubbles]))
    
    if w_med == 0 or h_med == 0:
        return "", warnings
    
    # Cluster by X
    x_centers = [(cv2.boundingRect(c)[0] + cv2.boundingRect(c)[2] // 2, c)
                 for c in roll_bubbles]
    x_centers.sort(key=lambda t: t[0])
    
    col_clusters = []
    curr_cluster = [x_centers[0]]
    
    for xc, c in x_centers[1:]:
        if xc - curr_cluster[-1][0] < w_med * 0.7:
            curr_cluster.append((xc, c))
        else:
            col_clusters.append(curr_cluster)
            curr_cluster = [(xc, c)]
    col_clusters.append(curr_cluster)
    
    digit_map = [str(d) for d in range(10)]
    roll_number = ""
    
    for col_idx, cluster in enumerate(col_clusters):
        bubbles_in_col = [c for _, c in cluster]
        if len(bubbles_in_col) < 4:
            continue
        
        col_sorted = sorted(bubbles_in_col, key=lambda c: cv2.boundingRect(c)[1])
        fill_ratios = []
        centers = []
        
        for c in col_sorted:
            (x, y, w, h) = cv2.boundingRect(c)
            cx, cy = x + w // 2, y + h // 2
            r = max(4, min(w, h) // 2 - 1)
            fill_ratios.append(_measure_fill(thresh_w, cx, cy, r))
            centers.append((cx, cy, r))
        
        if not fill_ratios:
            continue
        
        best_idx = int(np.argmax(fill_ratios))
        
        def is_bubble_filled(f: float) -> bool:
            return f >= 0.55
            
        filled_status = [is_bubble_filled(f) for f in fill_ratios]
        filled_count = sum(filled_status)
        is_filled = filled_status[best_idx]
        
        if filled_count >= 2:
            roll_number += "?"
            warnings.append(f"Roll ID col {col_idx + 1}: double-fill.")
        elif filled_count == 1 and best_idx < 10:
            roll_number += digit_map[best_idx]
        
        # Visual
        for i, (cx, cy, r) in enumerate(centers):
            color = (0, 255, 0) if (i == best_idx and is_filled) else (0, 0, 255)
            thickness = 2 if (i == best_idx and is_filled) else 1
            cv2.circle(output_img, (cx, cy), r, color, thickness)
    
    return roll_number, warnings


# ─────────────────────────────────────────────────────────────────────────────
# GRADING: MCQ
# ─────────────────────────────────────────────────────────────────────────────

def _grade_mcq(thresh_w: np.ndarray, output_img: np.ndarray,
               mcq_bubbles: list, num_columns: int) -> tuple[dict, list[str]]:
    """Grade MCQ section."""
    extracted_answers = {}
    warnings = []
    options_map = ["ক", "খ", "গ", "ঘ"]
    
    if len(mcq_bubbles) < MCQ_OPTIONS:
        warnings.append(f"Only {len(mcq_bubbles)} MCQ bubbles found.")
        return extracted_answers, warnings
    
    w_med = int(np.median([cv2.boundingRect(c)[2] for c in mcq_bubbles]))
    h_med = int(np.median([cv2.boundingRect(c)[3] for c in mcq_bubbles]))
    
    if w_med == 0 or h_med == 0:
        return extracted_answers, warnings
    
    r_base = max(4, min(w_med, h_med) // 2 - 1)
    
    # Extract columns by slicing the warped image width equally
    # This guarantees exactly `num_columns` columns, even if one is entirely missing bubbles.
    slice_w = CANVAS_W // num_columns
    expected_x_per_col = []
    
    for col_idx in range(num_columns):
        col_min_x = col_idx * slice_w
        col_max_x = (col_idx + 1) * slice_w
        
        # Find all bubbles in this vertical slice
        slice_bubbles = [
            c for c in mcq_bubbles 
            if col_min_x <= (cv2.boundingRect(c)[0] + cv2.boundingRect(c)[2] // 2) < col_max_x
        ]
        
        if not slice_bubbles:
            warnings.append(f"No MCQ bubbles found in column {col_idx + 1}.")
            expected_x_per_col.append([])
            continue
            
        # Cluster X inside this slice
        slice_x = [cv2.boundingRect(c)[0] + cv2.boundingRect(c)[2] // 2 for c in slice_bubbles]
        slice_x.sort()
        
        clusters_x = []
        curr_x = [slice_x[0]]
        for x in slice_x[1:]:
            if x - curr_x[-1] < w_med * 0.65:
                curr_x.append(x)
            else:
                clusters_x.append(int(np.median(curr_x)))
                curr_x = [x]
        clusters_x.append(int(np.median(curr_x)))
        
        n = min(len(clusters_x), MCQ_OPTIONS)
        expected_x_per_col.append(clusters_x[-n:])
    
    # Cluster Y (rows)
    sorted_by_y = sorted(mcq_bubbles, key=lambda c: cv2.boundingRect(c)[1])
    rows = []
    curr_row = [sorted_by_y[0]]
    for c in sorted_by_y[1:]:
        y_curr = cv2.boundingRect(c)[1]
        y_prev = cv2.boundingRect(curr_row[-1])[1]
        if abs(y_curr - y_prev) < h_med * 0.65:
            curr_row.append(c)
        else:
            rows.append(curr_row)
            curr_row = [c]
    rows.append(curr_row)
    
    # Filter out false positive rows (e.g. from dirt or text loops like "বৃত্তটি")
    # A real row spans across `num_columns` columns, each with 4 options.
    # We require at least 2 detected bubbles per column on average.
    valid_rows = [r for r in rows if len(r) >= num_columns * 2]
    
    answer_grid = {}
    
    for row_idx, row in enumerate(valid_rows):
        row_ys = [cv2.boundingRect(c)[1] + cv2.boundingRect(c)[3] // 2 for c in row]
        row_y = int(np.median(row_ys))
        
        for col_idx, expected_xs in enumerate(expected_x_per_col):
            block_exists = any(
                min(abs((cv2.boundingRect(c)[0] + cv2.boundingRect(c)[2] // 2) - ex)
                    for ex in expected_xs) < w_med * 1.4
                for c in row
            )
            if not block_exists:
                continue
            
            fill_ratios = []
            centers = []
            for ox in expected_xs:
                cx, cy = ox, row_y
                fr = _measure_fill(thresh_w, cx, cy, r_base)
                fill_ratios.append(fr)
                centers.append((cx, cy, r_base))
            
            if not fill_ratios:
                continue
            
            best_idx = int(np.argmax(fill_ratios))
            
            # A bubble is filled if it's absolutely very dark (>55%)
            # This perfectly isolates pen marks from the naturally dark "ঘ" character inside empty bubbles.
            def is_bubble_filled(f: float) -> bool:
                return f >= 0.55
                
            filled_status = [is_bubble_filled(f) for f in fill_ratios]
            filled_count = sum(filled_status)
            is_filled = filled_status[best_idx]
            
            if filled_count >= 2:
                answer = "DOUBLE"
            elif filled_count == 1:
                answer = options_map[best_idx]
            else:
                answer = "BLANK"
            
            answer_grid[(row_idx, col_idx)] = answer
            
            # Visual
            for i, (cx, cy, cr) in enumerate(centers):
                if answer == "DOUBLE":
                    color = (0, 165, 255) if filled_status[i] else (0, 0, 255)
                    thickness = 2 if filled_status[i] else 1
                elif i == best_idx and is_filled:
                    color = (0, 255, 0)
                    thickness = 2
                else:
                    color = (0, 0, 255)
                    thickness = 1
                cv2.circle(output_img, (cx, cy), cr, color, thickness)
    
    if not answer_grid:
        warnings.append("No MCQ answers could be graded.")
        return extracted_answers, warnings
    
    num_rows = max(k[0] for k in answer_grid) + 1
    
    for (row_idx, col_idx), answer in sorted(answer_grid.items()):
        q_num = col_idx * num_rows + row_idx + 1
        extracted_answers[str(q_num)] = answer
    
    return extracted_answers, warnings


# ─────────────────────────────────────────────────────────────────────────────
# CONFIDENCE COMPUTATION
# ─────────────────────────────────────────────────────────────────────────────

def _compute_confidence(fiducials_found: bool, qr_detected: bool,
                        bubbles_found: int, expected_min: int,
                        roll_number: str, answers: dict) -> float:
    """Compute confidence score (0.0 - 1.0)."""
    score = 0.0
    
    if fiducials_found:
        score += 0.25
    
    if qr_detected:
        score += 0.15
    
    if expected_min > 0:
        bubble_ratio = min(1.0, bubbles_found / expected_min)
        score += bubble_ratio * 0.30
    
    if roll_number and "?" not in roll_number and roll_number != "":
        score += 0.15
    
    if answers:
        non_blank = sum(1 for v in answers.values() if v not in ("BLANK", "DOUBLE"))
        answered_ratio = min(1.0, non_blank / max(1, len(answers)))
        score += answered_ratio * 0.15
    
    return score


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def process_omr_image(image_bytes: bytes,
                      num_columns: int = 4,
                      fallback_paper_id: str | None = None,
                      manual_corners: list[list[int]] | None = None) -> dict:
    """Enterprise-grade OMR processing with full fallback cascade."""
    all_warnings = []
    
    # Decode
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {
            "paperId": fallback_paper_id or "not-detected",
            "rollNumber": "Could not parse",
            "answers": {},
            "processed_image_base64": None,
            "confidence": {"overall": 0.0},
            "warnings": ["Could not decode image."],
        }
    
    # Normalize resolution
    img_work, scale = normalise_resolution(img)
    gray_raw = cv2.cvtColor(img_work, cv2.COLOR_BGR2GRAY)
    
    # Read QR
    qr_data, _ = _read_qr(gray_raw)
    paper_id = fallback_paper_id
    qr_detected = False
    
    if qr_data:
        paper_id, num_columns = _parse_qr_data(qr_data, num_columns)
        qr_detected = True
    elif fallback_paper_id:
        all_warnings.append("QR not detected — using provided paper_id.")
    
    # Enhance
    gray_enhanced = enhance_for_omr(gray_raw)
    
    # Fiducials
    if manual_corners is not None and len(manual_corners) == 4:
        # Scale manual corners from original resolution to working resolution
        # Assuming manual_corners are provided in the scale of the original uploaded image
        # which normalise_resolution scales by `scale`
        scaled_corners = np.array(manual_corners, dtype=np.float32) * scale
        corners = scaled_corners
        fiducials_found = True
        all_warnings.append("Using manual 4-point crop coordinates.")
    else:
        corners = _find_fiducials(gray_enhanced)
        fiducials_found = corners is not None
    
    if fiducials_found:
        warped = _perspective_warp(img_work, corners)
    else:
        warped = cv2.resize(img_work, (CANVAS_W, CANVAS_H), interpolation=cv2.INTER_AREA)
        all_warnings.append("Fiducials not found — using fallback resize.")
    
    output_img = warped.copy()
    gray_w = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    gray_w_enhanced = enhance_for_omr(gray_w)
    thresh_w = best_threshold(gray_w_enhanced)
    
    # Divider
    divider_y = _find_divider_y(gray_w_enhanced)
    cv2.line(output_img, (0, divider_y), (CANVAS_W, divider_y), (255, 128, 0), 2)
    
    # Bubbles
    # We expect 40 MCQs * 4 options = 160 bubbles.
    # We also expect 6 cols * 10 digits = 60 Roll bubbles.
    # The Hough Circle minimum is 20, but it dynamically adjusts.
    # We'll set expected min bubbles strictly based on the 4-column layout
    expected_min_bubbles = max(160, num_columns * 40)
    all_bubbles = _find_bubbles(gray_w_enhanced, expected_min=expected_min_bubbles)
    
    roll_bubbles = [c for c in all_bubbles if cv2.boundingRect(c)[1] < divider_y]
    
    # Exclude the first 35px below the divider to perfectly ignore text loops ("সঠিক উত্তরের...")
    mcq_bubbles = [c for c in all_bubbles if cv2.boundingRect(c)[1] > divider_y + 35]
    
    if len(all_bubbles) < 20:
        all_warnings.append(f"Only {len(all_bubbles)} bubbles detected — check image quality.")
    
    # Grade
    roll_number = ""
    extracted_answers = {}
    
    try:
        roll_number, roll_warnings = _grade_roll_id(thresh_w, output_img, roll_bubbles)
        all_warnings.extend(roll_warnings)
    except Exception as e:
        all_warnings.append(f"Roll ID grading failed: {str(e)}")
    
    try:
        extracted_answers, mcq_warnings = _grade_mcq(thresh_w, output_img, mcq_bubbles, num_columns)
        all_warnings.extend(mcq_warnings)
    except Exception as e:
        all_warnings.append(f"MCQ grading failed: {str(e)}")
    
    # Confidence
    confidence_score = _compute_confidence(
        fiducials_found, qr_detected, len(all_bubbles),
        expected_min_bubbles, roll_number, extracted_answers
    )
    
    # Encode
    _, buf = cv2.imencode('.jpg', output_img, [cv2.IMWRITE_JPEG_QUALITY, 88])
    b64 = base64.b64encode(buf).decode('utf-8')
    
    return {
        "paperId": paper_id or "not-detected",
        "rollNumber": roll_number or "Could not parse",
        "answers": extracted_answers,
        "processed_image_base64": f"data:image/jpeg;base64,{b64}",
        "confidence": {
            "overall": round(confidence_score, 2),
            "fiducials_found": fiducials_found,
            "qr_detected": qr_detected,
            "bubbles_found": len(all_bubbles),
            "roll_bubbles": len(roll_bubbles),
            "mcq_bubbles": len(mcq_bubbles),
        },
        "warnings": all_warnings,
    }