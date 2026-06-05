import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from omr_processor import process_omr_image

app = FastAPI(title="Shikhonary OMR Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/omr/verify")
async def verify_omr(file: UploadFile = File(...)):
    """
    Receives an image of an OMR sheet, processes it entirely in memory, 
    extracts the data, and returns the raw JSON payload.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        # Read the image bytes directly into memory (NO writing to disk!)
        image_bytes = await file.read()
        
        # Process the image with our OpenCV logic
        result = process_omr_image(image_bytes)
        
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        print(f"Error processing OMR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
