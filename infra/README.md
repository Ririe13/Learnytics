# Infrastructure - ML Dummy Service

This folder contains infrastructure configuration for running the Learnytics services locally.

## Services

1. **Backend** (Port 9000)
   - Node.js/Express API
   - Serves learning data and insights

2. **ML Service** (Port 8000)
   - Python/FastAPI
   - Provides learning style classification
   - Returns recommendations

3. **Frontend** (Port 8080)
   - Vite/React application
   - Learning Insight Dashboard

## Quick Start

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

```bash
# Backend
cd backend
npm install
npm run dev

# ML Service
cd ml-service
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000

# Frontend
npm run dev
```

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 9000 |
| NODE_ENV | Environment | development |
| ML_SERVICE_URL | ML service URL | http://localhost:8000 |
| CORS_ORIGIN | Allowed origins | * |

### ML Service
| Variable | Description | Default |
|----------|-------------|---------|
| MODEL_PATH | Path to ML model | - |

## Swapping to Production

1. Update `ML_SERVICE_URL` to point to your production ML service
2. Replace dummy ML logic with actual model inference
3. Configure proper CORS origins
4. Use production database instead of JSON files
