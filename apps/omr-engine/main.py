"""
main_v2.py — FastAPI server for enterprise OMR processing with v2 hardened pipeline.
"""

import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from omr_processor import process_omr_image

app = FastAPI(
    title="Shikhonary OMR Engine v2",
    description="Hardened enterprise-grade OMR processing for poor-quality sheets.",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {
        "status": "ok",
        "service": "Shikhonary OMR Engine v2",
        "features": [
            "Multi-strategy fiducial detection",
            "Adaptive image enhancement",
            "Robust bubble detection with Hough fallback",
            "Crease-immune divider detection",
            "Handles: skewed, crumpled, yellowed, low-contrast sheets"
        ]
    }


@app.post("/api/omr/verify")
async def verify_omr(
    file: UploadFile = File(...),
    paper_id: Optional[str] = Form(None),
    num_columns: Optional[int] = Form(None),
    manual_corners: Optional[str] = Form(None),
):
    """
    Process an OMR sheet image and return extracted answers.
    
    **Robustness improvements in v2:**
    - Handles severely skewed/rotated images
    - Deskews automatically when needed
    - Multi-level fiducial detection (4 strategies)
    - Adaptive preprocessing based on image quality
    - Morphological post-processing for bubble detection
    - Hough circle fallback when contours fail
    - Crease-immune divider line detection
    
    Args:
        file: Image file (JPG, PNG, WEBP — any resolution, any condition)
        paper_id: Optional fallback paper ID
        num_columns: Optional MCQ column groups (overridden by QR)
    
    Returns:
        {
            "success": true,
            "data": {
                "paperId": string,
                "rollNumber": string,
                "answers": {question_num: answer_option},
                "processed_image_base64": annotated image,
                "confidence": {
                    "overall": 0.0-1.0,
                    "fiducials_found": bool,
                    "qr_detected": bool,
                    ...
                },
                "warnings": [quality/parsing warnings]
            }
        }
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"File must be an image. Got: {file.content_type}"
        )
    
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    parsed_corners = None
    if manual_corners:
        try:
            import json
            parsed_corners = json.loads(manual_corners)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid manual_corners JSON: {e}")

    result = process_omr_image(
        image_bytes,
        num_columns=num_columns or 3,
        fallback_paper_id=paper_id,
        manual_corners=parsed_corners,
    )
    
    return {
        "success": True,
        "data": result,
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)