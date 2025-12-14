# Database Seed Files

This folder contains seed data for the Learning Insight Dashboard.

## File Structure

- `seed.json` - Sample learning records for 12 students across multiple cohorts and modules
- `seed_db.sh` - Script to populate the database with seed data

## Data Schema

Each record in `seed.json` follows this structure:

```json
{
  "studentId": "string",      // Unique student identifier (e.g., "s001")
  "studentName": "string",    // Student's full name
  "cohort": "string",         // Cohort identifier (e.g., "A25", "B25")
  "module": "string",         // Module name
  "date": "string",           // ISO 8601 datetime
  "durationMinutes": "number", // Time spent on module in minutes
  "score": "number",          // Score out of 100
  "completed": "boolean"      // Whether the module was completed
}
```

## Sample Data Overview

- **12 students** across 4 cohorts (A25, B25, C25, D25)
- **8 modules**: Intro to Algorithms, Data Structures, Sorting Algorithms, Graph Theory, Dynamic Programming, Complexity Analysis, Recursion Fundamentals, Tree Traversal
- Mix of completion rates and score ranges to demonstrate:
  - Fast learners (completing many modules quickly)
  - Consistent learners (steady progress)
  - Reflective learners (more time per module)

## Usage

### File-based Storage (JSON)
```bash
# Copy seed data to backend data folder
cp seed.json ../src/data/dummy.json
```

### Using the shell script
```bash
chmod +x seed_db.sh
./seed_db.sh
```

## Swapping with Real Database

When ready to use a real database:

1. Create the appropriate table schema
2. Import the seed data using the provided SQL or migration scripts
3. Update the backend controllers to read from the database instead of JSON files
