from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.services.scheduler import start_scheduler, stop_scheduler
from app.db.database import create_tables
from api.routes.user import router as user_router
from api.routes.sync import router as sync_router
from api.routes.genai import router as genai_router
from api.routes.analyze import router as analyze_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    # Start APScheduler
    start_scheduler()
    yield
    print("Shutting down application...")
    stop_scheduler()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(user_router, prefix="/api")
app.include_router(sync_router, prefix="/api")
app.include_router(genai_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "ok"}