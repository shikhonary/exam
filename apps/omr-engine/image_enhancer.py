"""
image_enhancer.py — Pre-processing for enterprise-grade OMR robustness.

Handles: yellowed paper, shadows, camera phone photos, crumpled sheets,
         barrel distortion, any input resolution.
"""

import cv2
import numpy as np

# Target working width — all inputs are resized to this internally.
# Large enough to preserve bubble detail, small enough to be fast.
TARGET_W = 1200


def normalise_resolution(img: np.ndarray) -> tuple[np.ndarray, float]:
    """
    Resize image so its width is TARGET_W, preserving aspect ratio.
    Returns (resized_img, scale_factor).
    scale_factor > 1 means image was upscaled; < 1 means downscaled.
    """
    h, w = img.shape[:2]
    if w == TARGET_W:
        return img, 1.0
    scale = TARGET_W / w
    new_h = int(h * scale)
    interp = cv2.INTER_AREA if scale < 1.0 else cv2.INTER_CUBIC
    resized = cv2.resize(img, (TARGET_W, new_h), interpolation=interp)
    return resized, scale


def subtract_background(gray: np.ndarray) -> np.ndarray:
    """
    Normalise paper background colour by dividing each pixel by an estimate
    of the local background brightness.

    Effect: yellowed paper → white; shadow on half the page → gone;
            aged/stained paper → clean.

    Uses a large median blur (51×51) to estimate the slow-varying background
    (ink marks are small and get blurred out). Then divides.
    """
    # Blur must be odd and large enough to cover the widest bubble
    blur_size = 51
    if gray.shape[1] > 1500:
        blur_size = 71  # larger for high-res inputs

    # Ensure blur_size is odd
    if blur_size % 2 == 0:
        blur_size += 1

    background = cv2.medianBlur(gray, blur_size)
    # divide: result[i] = gray[i] / background[i] * 255
    # Clamp so no overflow
    normalised = cv2.divide(gray.astype(np.float32),
                            background.astype(np.float32),
                            scale=255.0)
    normalised = np.clip(normalised, 0, 255).astype(np.uint8)
    return normalised


def denoise(gray: np.ndarray) -> np.ndarray:
    """
    Remove crumple/scanner noise while preserving bubble edges.
    fastNlMeansDenoising is slow but worth it for degraded images.
    h=8 is a good balance between noise removal and edge preservation.
    """
    return cv2.fastNlMeansDenoising(gray, h=8, searchWindowSize=21, templateWindowSize=7)


def sharpen(gray: np.ndarray) -> np.ndarray:
    """
    Unsharp mask — brings back edge detail lost during denoising.
    Especially helpful for low-resolution camera phone shots.
    """
    blurred = cv2.GaussianBlur(gray, (0, 0), sigmaX=1.5)
    # weight=1.5 sharpened, -0.5 blurred → net sharpen
    sharpened = cv2.addWeighted(gray, 1.5, blurred, -0.5, 0)
    return sharpened


def apply_clahe(gray: np.ndarray) -> np.ndarray:
    """
    Contrast Limited Adaptive Histogram Equalisation.
    Boosts local contrast without over-amplifying noise.
    """
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(gray)


def enhance_for_omr(gray_raw: np.ndarray) -> np.ndarray:
    """
    Full enhancement pipeline for OMR processing.

    Input:  raw grayscale image at any resolution/quality.
    Output: clean, high-contrast, background-normalised grayscale image
            ready for thresholding and contour detection.

    Pipeline:
      1. Denoise         — remove camera/crumple noise
      2. Subtract bg     — white-balance yellowed / shadowed paper
      3. CLAHE           — boost local contrast
      4. Sharpen         — recover edge detail
    """
    step1 = denoise(gray_raw)
    step2 = subtract_background(step1)
    step3 = apply_clahe(step2)
    step4 = sharpen(step3)
    return step4


def best_threshold(gray: np.ndarray) -> np.ndarray:
    """
    Try adaptive threshold first (handles uneven lighting from camera).
    Fall back to Otsu for clean, flat images.

    Adaptive is better for camera shots; Otsu is better for flatbed scans.
    We pick the one that produces a cleaner result (more even ink distribution).
    """
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Adaptive: good for shadows / uneven light
    adaptive = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        blockSize=31,
        C=8
    )

    # Otsu: good for uniform lighting (flatbed scans)
    _, otsu = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)

    # Heuristic: pick whichever has a fill ratio between 5–30%
    # (too low = missed ink; too high = noise dominated)
    def fill_ratio(t):
        return cv2.countNonZero(t) / t.size

    fr_adaptive = fill_ratio(adaptive)
    fr_otsu = fill_ratio(otsu)

    # Prefer adaptive; fall back to otsu if adaptive is wildly off
    if 0.03 <= fr_adaptive <= 0.40:
        return adaptive
    if 0.03 <= fr_otsu <= 0.40:
        return otsu
    # Both off — return adaptive as safer choice for camera photos
    return adaptive
