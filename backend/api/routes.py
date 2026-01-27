from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from pathlib import Path
from backend.core.config import settings
import uuid

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"filename": filename, "path": str(file_path), "message": "Video uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/videos")
async def list_videos():
    try:
        videos = []
        for file_path in UPLOAD_DIR.glob("*"):
            if file_path.is_file() and file_path.suffix.lower() in ['.mp4', '.avi', '.mov']:
                videos.append({
                    "filename": file_path.name,
                    "url": f"http://localhost:8001/uploads/{file_path.name}",
                    "size": file_path.stat().st_size,
                    "created": file_path.stat().st_ctime
                })
        return {"videos": videos, "count": len(videos)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/{filename}")
async def analyze_video(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Run inference
    from ml.inference import detector
    try:
        results = detector.predict(file_path)
        return {"status": "Analysis complete", "filename": filename, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
