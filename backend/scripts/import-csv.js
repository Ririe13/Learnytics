const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_FILE = process.argv[2] || path.join(__dirname, 'sample.csv');
const OUTPUT_FILE = path.join(__dirname, '../src/data/dummy.json');

console.log('📂 Importing CSV:', CSV_FILE);

const results = [];

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on('data', (data) => {
    // Transform CSV row to expected format
    results.push({
      studentId: data.studentId || data.student_id,
      studentName: data.studentName || data.student_name,
      cohort: data.cohort,
      module: data.module,
      date: data.date,
      durationMinutes: parseInt(data.durationMinutes || data.duration_minutes),
      score: parseInt(data.score),
      completed: data.completed === 'true' || data.completed === '1'
    });
  })
  .on('end', () => {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log('✅ Import complete!');
    console.log(`📊 Imported ${results.length} records to ${OUTPUT_FILE}`);
  })
  .on('error', (error) => {
    console.error('❌ Error importing CSV:', error);
  });
