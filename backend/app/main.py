"""FastAPI application entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import auth, tasks

# Create tables on startup. For a real migration workflow use Alembic,
# but this keeps the assignment self-contained.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/", tags=["health"])
def health():
    return {"status": "ok", "service": "task-manager-api"}
