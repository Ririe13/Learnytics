# Learning Insight Dashboard - Backend API

Backend REST API untuk Learning Insight Dashboard menggunakan Node.js + Express.js.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan (default PORT=9000)
```

### 3. Import Data (Opsional)
```bash
# Import sample CSV
npm run import-csv

# Atau import CSV custom
node scripts/import-csv.js /path/to/your/data.csv
```

### 4. Start Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server akan berjalan di `http://localhost:9000`

## 📋 API Endpoints

### Health Check
```
GET /health
Response: { status: "ok", time: "2025-11-27T..." }
```

### Data Endpoints

#### Get Sample Data
```
GET /api/v1/data/sample
Response: { status, count, data: [...] }
```

#### Import Data
```
POST /api/v1/data/import
Content-Type: multipart/form-data (CSV file)
atau
Content-Type: application/json
Body: { data: [...] }

Response: { status: "success", imported: 100 }
```

#### Get Records (Paginated)
```
GET /api/v1/records?start=2025-10-01&end=2025-11-01&cohort=A25&module=Algorithms&limit=100&offset=0
Response: { status, total, limit, offset, data: [...] }
```

### Insights Endpoints

#### Get Summary Insights
```
GET /api/v1/insights/summary?start=YYYY-MM-DD&end=YYYY-MM-DD&cohort=&module=
Response: {
  kpi: { totalStudents, avgScore, completionRate, avgTimeSpent },
  trend: [{ date, avgScore }],
  modulePerformance: [{ module, avgScore, count }],
  completionStatus: [{ status, count, percentage }],
  engagement: [{ day, hour, count }],
  scoreTimeCorrelation: [{ studentId, totalMinutes, avgScore }]
}
```

#### Get Student Detail
```
GET /api/v1/insights/student/:studentId
Response: {
  studentId, studentName, cohort,
  totalSessions, avgScore, totalTimeSpent, completionRate,
  moduleProgress: [...],
  recentActivity: [...]
}
```

### ML Recommendation Endpoint

```
GET /api/v1/ml/recommendation/:studentId
Response: {
  studentId,
  recommendations: [{ type, module, reason, priority }],
  strengths: [...],
  totalRecommendations
}
```

## 🗄️ Data Schema

Format JSON/CSV yang digunakan:

```json
{
  "studentId": "s001",
  "studentName": "Andi",
  "cohort": "A25",
  "module": "Intro to Algorithms",
  "date": "2025-10-01T09:30:00Z",
  "durationMinutes": 45,
  "score": 78,
  "completed": true
}
```

## 📝 Cara Mengganti Data Dummy

### Opsi 1: Import CSV
1. Siapkan file CSV dengan kolom sesuai schema di atas
2. Jalankan: `node scripts/import-csv.js /path/to/data.csv`
3. Data akan tersimpan di `src/data/dummy.json`

### Opsi 2: Import via API
```bash
curl -X POST http://localhost:9000/api/v1/data/import \
  -F "file=@/path/to/data.csv"
```

### Opsi 3: Manual Replace
Ganti file `src/data/dummy.json` dengan data JSON Anda.

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 9000 | Port server |
| NODE_ENV | development | Environment mode |
| ML_SERVICE_URL | http://localhost:5000 | URL ML service (jika ada) |
| CORS_ORIGIN | * | CORS allowed origin |

## 📦 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main Express app
│   ├── routes/
│   │   └── index.js          # API routes
│   ├── controllers/
│   │   ├── dataController.js # Data endpoints logic
│   │   └── insightsController.js # Insights logic
│   └── data/
│       └── dummy.json        # Data storage
├── scripts/
│   ├── import-csv.js         # CSV import script
│   └── sample.csv            # Sample CSV data
├── .env.example              # Environment template
├── package.json
└── README.md
```

## 🧪 Testing

Test endpoints dengan curl atau Postman:

```bash
# Health check
curl http://localhost:9000/health

# Get insights
curl "http://localhost:9000/api/v1/insights/summary?start=2025-10-01&end=2025-11-01"

# Get student detail
curl http://localhost:9000/api/v1/insights/student/s001
```

## 🚢 Deployment

1. Set environment variables di server
2. Install dependencies: `npm install --production`
3. Start: `npm start`
4. Gunakan process manager seperti PM2 untuk production:
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name learning-api
   ```

## 📄 License

MIT
