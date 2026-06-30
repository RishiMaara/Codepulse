from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api import recommend, roadmap, readiness, rating

load_dotenv()

app = FastAPI(
    title="CodePulse AI Service",
    description="ML-powered analytics engine for CodePulse",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:5173"),
                   os.getenv("BACKEND_URL", "http://localhost:5000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(recommend.router, prefix="/recommend",     tags=["Recommendations"])
app.include_router(roadmap.router,   prefix="/roadmap",       tags=["Roadmap"])
app.include_router(readiness.router, prefix="/readiness",     tags=["Readiness"])
app.include_router(rating.router,    prefix="/predict-rating",tags=["Rating Prediction"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "CodePulse AI"}
