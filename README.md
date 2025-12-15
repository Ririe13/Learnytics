# Learning Insight Dashboard
A full-stack web application to visualize student learning insights with interactive charts, KPIs, and drill-down capabilities.

Judul Proyek		: Learnytics - Grow Faster, Learn Smarter

Case yang dipilih	: DC-08 AI Learning Insight 

List Anggota: 
M891D5X1655 - Rasti Agustina Maharani - Machine Learning - Aktif
M891D5X1622 - Rahma Putri Prabowo- Machine Learning - Aktif
R525D5X1538 - Nur Ramadhani Putri Wulandari- React & Back-End with AI - Aktif
R891D5Y0711 - Hadyan Nafis Fakhira - React & Back-End with AI - Aktif
R891D5Y0371 - Carel Alberto Karma- React & Back-End with AI - Aktif


## 🎯 Features

- **Interactive Dashboard**: Real-time visualization of learning data
- **KPI Cards**: Total students, average scores, completion rates, study time
- **Multiple Chart Types**:
  - Line chart: Score trends over time
  - Bar chart: Module performance distribution
  - Donut chart: Completion status breakdown
  - Heatmap: Daily engagement patterns
  - Scatter plot: Score vs. time correlation
- **Advanced Filtering**: Date range, cohort, module, student search
- **Drill-Down**: Click on students to see detailed performance
- **CSV Export**: Export filtered data for external analysis
- **AI Recommendations**: ML-powered suggestions (stub included)

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) - Fast, modern UI framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Recharts** - Beautiful, responsive charts
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **date-fns** - Date manipulation
- **shadcn/ui** - High-quality UI components

### Backend (To Be Implemented)
- **Node.js + Express** - RESTful API server
- **SQLite / JSON** - Lightweight data storage
- **Python/Flask (optional)** - ML service stub

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔌 Backend Setup (Required for Production)

This frontend is designed to work with a backend API. Currently, it uses mock data.

### Expected API Endpoints

Create a backend server (Node.js/Express recommended) with these endpoints:

```
GET  /health
     Response: { status: "ok", time: "2025-11-27T..." }

GET  /api/v1/data/sample
     Returns: StudentRecord[]

POST /api/v1/data/import
     Accepts: CSV file (multipart/form-data)
     Returns: { status: "success", imported: n }

GET  /api/v1/insights/summary?start=YYYY-MM-DD&end=YYYY-MM-DD&cohort=&module=
     Returns: InsightSummary (see types/learning.ts)

GET  /api/v1/insights/student/:studentId
     Returns: StudentDetail

GET  /api/v1/records?start=&end=&cohort=&module=&limit=&offset=
     Returns: StudentRecord[] (paginated)

GET  /api/v1/ml/recommendation/:studentId
     Returns: MLRecommendation[]
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:9000
```

## 📊 Data Schema

### StudentRecord
```typescript
{
  studentId: string;        // e.g., "s001"
  studentName: string;      // e.g., "Andi"
  cohort: string;           // e.g., "A25"
  module: string;           // e.g., "Intro to Algorithms"
  date: string;             // ISO format
  durationMinutes: number;  // Study time
  score: number;            // 0-100
  completed: boolean;       // Module completion status
}
```

## 🔄 Replacing Dummy Data

### Method 1: API Integration (Recommended)

1. Set `VITE_API_BASE_URL` in `.env`
2. The app will automatically use real API endpoints

### Method 2: Direct Data Replacement

Edit `src/data/dummyData.ts`:

```typescript
// Replace this function
export function loadRecords(): StudentRecord[] {
  // Option A: Load from JSON file
  return require('./your-data.json');
  
  // Option B: Fetch from API
  // return fetch('/api/data').then(r => r.json());
}
```

### Method 3: CSV Import

Use the backend endpoint:

```bash
curl -X POST http://localhost:9000/api/v1/data/import \
  -F "file=@your-data.csv"
```

CSV format:
```csv
studentId,studentName,cohort,module,date,durationMinutes,score,completed
s001,Andi,A25,Intro to Algorithms,2025-10-01T09:30:00Z,45,78,true
```

## 🧪 Testing

### API Testing
Use the provided Postman collection (to be created) or test manually:

```bash
# Health check
curl http://localhost:9000/health

# Get insights
curl "http://localhost:9000/api/v1/insights/summary?start=2025-09-01&end=2025-11-27"
```

## 🚀 Deployment

### Frontend Only (Static)
```bash
npm run build
# Deploy 'dist' folder to any static host (Vercel, Netlify, etc.)
```

### Full-Stack
1. Deploy backend to a Node.js host (e.g., Railway, Render)
2. Set `VITE_API_BASE_URL` to your backend URL
3. Build and deploy frontend

## 📁 Project Structure

```
/src
  /components
    /dashboard       # Dashboard UI components
    /ui             # shadcn UI components
  /data
    dummyData.ts    # Sample data generator
  /pages
    Index.tsx       # Main dashboard page
  /services
    api.ts          # API service layer (mock + contract)
  /store
    dashboardStore.ts # Zustand state management
  /types
    learning.ts     # TypeScript type definitions
  index.css         # Design system (colors, tokens)
```

## 🎨 Design System

The app uses a **retro-pastel theme** with semantic tokens:

- **Primary**: Pastel Pink (#FADADD)
- **Secondary**: Pastel Green (#B6E3C0)
- **Muted**: Pastel Yellow (#F7D8A8)
- **Accent**: Pastel Blue (#A6C8FF)

All colors are defined in `src/index.css` using HSL values.

## 🔐 Security Notes

- No authentication (as per requirements)
- Add CORS configuration in backend
- Sanitize CSV/JSON inputs before storing
- Don't commit sensitive data to Git

## 🐛 Troubleshooting

**Charts not displaying?**
- Check browser console for errors
- Ensure data format matches TypeScript types

**API calls failing?**
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend is running on correct port
- Inspect network tab in browser DevTools

**Filters not working?**
- Clear browser cache
- Check date format (YYYY-MM-DD)

## 📚 Resources

- [React Documentation](https://react.dev)
- [Recharts Guide](https://recharts.org)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Zustand Guide](https://zustand.surge.sh)

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request

---

**Ready to connect to your ML team's backend!** 🚀

For questions or issues, please open a GitHub issue or contact the development team.
