from fastapi import FastAPI
from app.routes import cloud
import sys, argparse

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