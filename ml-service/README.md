# ML Service for Learning Insight Dashboard

Dummy ML service untuk memberikan insight dan rekomendasi belajar.

## Quick Start

### Prerequisites
- Python 3.9+
- pip

### Installation

```bash
cd ml-service
pip install -r requirements.txt
```

### Running Locally

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

### Running with Docker

```bash
docker build -t learnytics-ml-service .
docker run -p 8000:8000 learnytics-ml-service
```

## API Endpoints

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "learnytics-ml-service",
  "version": "1.0.0"
}
```

### Get Learning Insight
```http
POST /ml/insight
Content-Type: application/json

{
  "user_id": "s001",
  "records": [
    {
      "module": "Intro to Algorithms",
      "score": 85,
      "duration_minutes": 45,
      "completed": true,
      "date": "2025-09-05"
    }
  ]
}
```

Response:
```json
{
  "insight": "consistent_learner",
  "recommendation": "Pertahankan ritme belajar, naikkan target 10%",
  "metrics": {
    "consistency_score": 0.78,
    "learning_speed": 0.65,
    "avg_module_time": 52.5
  },
  "model_version": "v1_dummy"
}
```

### Batch Compute
```http
POST /ml/batch
Content-Type: application/json

{
  "user_ids": ["s001", "s002", "s003"]
}
```

Response:
```json
{
  "results": [
    {
      "user_id": "s001",
      "insight": "consistent_learner",
      "recommendation": "..."
    }
  ],
  "processed": 3,
  "model_version": "v1_dummy"
}
```

## Learning Style Types

The ML service identifies three learning styles:

1. **Consistent Learner** (`consistent_learner`)
   - Completes modules at a steady pace
   - Regular daily/weekly activity pattern
   - Recommendation: Maintain rhythm, increase targets gradually

2. **Fast Learner** (`fast_learner`)
   - Completes 5+ modules per day
   - High completion rate in short time
   - Recommendation: Challenge with advanced topics

3. **Reflective Learner** (`reflective_learner`)
   - Spends significant time on each module
   - Reviews previously completed materials
   - Recommendation: Provide deeper exploration resources

## Swapping with Real ML Model

To replace with a real ML model:

1. Update `api/main.py` with actual model loading
2. Replace dummy logic in `determine_learning_style()` with ML inference
3. Update Docker image to include model files
4. Set `MODEL_PATH` environment variable if needed
