from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse, StreamingResponse
from starlette.background import BackgroundTask
from utils.roles import require_roles
import os
from services import cloud_service
import io, mimetypes

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), claims = Depends(require_roles(["admin"]))):
    content = await file.read()
    try:
        cloud_service.save_encrypted_file(file.filename, content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"filename": file.filename}

@router.get("/files/")
def list_files(claims = Depends(require_roles(["admin"]))):
    try:
        files = cloud_service.list_encrypted_files()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"files": files}

@router.get("/files/{filename}")
def serve_file(filename: str, claims = Depends(require_roles(["admin"]))):
    try:
        decrypted = cloud_service.get_decrypted_file(filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if decrypted is None:
        raise HTTPException(status_code=404, detail="File not found")

    mime_type, _ = mimetypes.guess_type(filename)
    if not mime_type:
        mime_type = "application/octet-stream"

    return StreamingResponse(io.BytesIO(decrypted), media_type=mime_type)

