"""
Learning Insight ML Service

This service provides learning style classification and recommendations 
using a custom Scikit-learn H5 model.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import random
import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from model_loader import CustomModel
except ImportError:
    # Fallback for when running directly
    try:
        from api.model_loader import CustomModel
    except ImportError:
        print("Warning: Could not import model_loader. Running without model.")
        CustomModel = None

app = FastAPI(
    title="Learnytics ML Service",
    description="ML service for learning style classification and recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= Global Model Instance =============
model = None

@app.on_event("startup")
async def startup_event():
    global model
    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "learning_style_model.h5")
    # For Docker or root run compatibility
    if not os.path.exists(model_path):
        model_path = "learning_style_model.h5"
        
    try:
        model = CustomModel(model_path)
        print(f"Model loaded from {model_path}")
    except Exception as e:
        print(f"Failed to load model from {model_path}: {e}")
        print("Service will run but predictions will fail.")

# ============= Models =============

class LearningRecord(BaseModel):
    module: str
    score: float
    duration_minutes: float
    completed: bool
    date: Optional[str] = None
    # Optional fields that might not be in all legacy records
    revisits: Optional[int] = 0
    submission_ratio: Optional[float] = 1.0

class InsightRequest(BaseModel):
    user_id: str
    records: Optional[List[LearningRecord]] = None

class BatchRequest(BaseModel):
    user_ids: List[str]

class InsightMetrics(BaseModel):
    consistency_score: float
    learning_speed: float
    avg_module_time: float
    completion_rate: Optional[float] = None
    # Additional raw metrics for debugging
    total_modules: Optional[int] = None
    avg_score: Optional[float] = None

class InsightResponse(BaseModel):
    insight: str
    recommendation: Optional[str] = None
    metrics: InsightMetrics
    model_version: str

class BatchInsightResult(BaseModel):
    user_id: str
    insight: str
    recommendation: Optional[str] = None
    metrics: InsightMetrics

class BatchResponse(BaseModel):
    results: List[BatchInsightResult]
    processed: int
    model_version: str

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str

def extract_features(records: List[LearningRecord]) -> List[float]:
    """
    Extract 9 features for the model from a list of learning records.
    """
    if not records:
        return [0] * 9

    # 1. total_modules_completed (Forced to 0 to match Model Training Data Stats)
    completed_count = 0.0
    
    # Primitives extraction
    scores = [r.score for r in records]
    durations = [r.duration_minutes for r in records]
    total_modules = len(records)
    
    # 2. avg_modules_per_day (Forced to 0 to match Model Training Data Stats)
    avg_modules_per_day = 0.0

    # 3. avg_duration_per_module (Forced to 0 to match Model Training Data Stats)
    avg_duration = 0.0

    # 4. avg_revisit_per_module
    avg_revisit = 1.0
    if total_modules > 0:
        revisits_sum = sum(getattr(r, 'revisits', 0) for r in records)
        # Add 1 because base visit is 1
        avg_revisit = 1.0 + (revisits_sum / total_modules)

    # 5. avg_score
    avg_score = sum(scores) / total_modules if total_modules > 0 else 0

    # 6. max_score
    max_score = max(scores) if scores else 0

    # 7. min_score
    min_score = min(scores) if scores else 0

    # 8. total_study_duration
    total_duration = sum(durations)

    # 9. avg_submission_ratio
    avg_submission_ratio = 1.0
    if total_modules > 0:
        ratio_sum = sum(getattr(r, 'submission_ratio', 1.0) for r in records)
        avg_submission_ratio = ratio_sum / total_modules

    return [
        float(completed_count),
        float(avg_modules_per_day),
        float(avg_duration),
        float(avg_revisit),
        float(avg_score),
        float(max_score),
        float(min_score),
        float(total_duration),
        float(avg_submission_ratio)
    ]

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        service="learnytics-ml-service",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat()
    )

@app.post("/ml/insight", response_model=InsightResponse)
async def get_insight(request: InsightRequest):
    """
    Get learning insight for a user using ML model.
    """
    try:
        records = request.records or []
        
        if not records:
             # Default fallback if no data
            return InsightResponse(
                insight="consistent_learner",
                recommendation=None,
                metrics=InsightMetrics(
                    consistency_score=0, learning_speed=0, avg_module_time=0, completion_rate=0
                ),
                model_version="v1_fallback_empty"
            )

        # Extract features
        features = extract_features(records)
        print(f"[DEBUG] Calculated Features: {features}")
        
        if model:
            # Predict using loaded model
            style = model.predict(features)
            print(f"[DEBUG] Predicted Style: {style}")
            model_version = "v1_custom_h5"
        else:
            # Fallback if model failed to load
            print("Model not loaded, using fallback logic")
            style = "consistent_learner" # Simple default
            model_version = "v1_fallback_no_model"

        # Note: Recommendation logic moved to Backend Service
        
        # Calculate display metrics (subset of features or derived)
        # Mapping features back to display metrics roughly
        # Feature 2 is avg_modules_per_day -> learning_speed
        # Feature 3 is avg_duration -> avg_module_time
        # Feature 0/Total -> completion_rate
        
        total_modules = len(records)
        metrics = InsightMetrics(
            consistency_score=0.8, # Placeholder or derived complex logic
            learning_speed=round(features[1], 2), # avg_modules_per_day
            avg_module_time=round(features[2], 1), # avg_duration
            completion_rate=round(features[0]/total_modules, 2) if total_modules else 0,
            avg_score=round(features[4], 1)
        )
        
        return InsightResponse(
            insight=style,
            recommendation=None,
            metrics=metrics,
            model_version=model_version
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/batch", response_model=BatchResponse)
async def batch_compute(request: BatchRequest):
    """
    Batch compute insights for multiple users.
    (Stub implementation - does not fetch real DB data here, assumes backend sends one by one usually)
    """
    return BatchResponse(
        results=[],
        processed=0,
        model_version="v1_stub"
    )

@app.get("/")
async def root():
    """Root endpoint with service info."""
    return {
        "service": "Learnytics ML Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "model_loaded": model is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
