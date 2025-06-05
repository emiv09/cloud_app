from fastapi import FastAPI
from routes import cloud
from fastapi.middleware.cors import CORSMiddleware
import sys, argparse, os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Cloud App API",
    description="API for managing cloud resources and file uploads",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "cloud",
            "description": "Operations related to cloud resources and file management"
        }
    ]
)

app.include_router(cloud.router, prefix="/cloud", tags=["cloud"])

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Cloud App API"}


if __name__ == "__main__":
    import uvicorn
    # Check if arguments are passed (length > 1 means there are additional arguments besides the script name)
    if len(sys.argv) > 1:
        parser = argparse.ArgumentParser(description="Run the FastAPI app.")
        parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to run the app on")
        parser.add_argument("--port", type=int, default=8000, help="Port to run the app on")
        parser.add_argument("--workers", type=int, default=1, help="Number of Worker services")
        args = parser.parse_args()
        uvicorn.run("main:app", host=args.host, port=args.port, workers=args.workers)
    else:
        # Default behavior for right-clicking and running
        uvicorn.run("main:app", host="0.0.0.0", port=8091, workers=1, reload=True)