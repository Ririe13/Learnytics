import { StudentRecord } from "@/types/learning";

// Generate 200+ dummy records
const cohorts = ["A25", "B25", "C25", "D25"];
const modules = [
  "Intro to Algorithms",
  "Data Structures",
  "Sorting Algorithms",
  "Graph Theory",
  "Dynamic Programming",
  "Complexity Analysis",
  "Recursion Fundamentals",
  "Tree Traversal",
];

const firstNames = [
  "Andi", "Budi", "Citra", "Dewi", "Eka", "Fajar", "Gita", "Hani",
  "Indra", "Joko", "Kartika", "Lina", "Maya", "Nanda", "Omar", "Putri",
  "Reza", "Sari", "Tono", "Umar", "Vina", "Wati", "Yanti", "Zahra",
];

function generateStudentId(index: number): string {
  return `s${String(index + 1).padStart(3, "0")}`;
}

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
}

function generateDummyRecords(count: number = 200): StudentRecord[] {
  const records: StudentRecord[] = [];
  const startDate = new Date("2025-09-01");
  const endDate = new Date("2025-11-27");

  for (let i = 0; i < count; i++) {
    const studentIndex = Math.floor(i / 8); // ~8 records per student
    const studentId = generateStudentId(studentIndex);
    const studentName = firstNames[studentIndex % firstNames.length];
    const cohort = cohorts[Math.floor(Math.random() * cohorts.length)];
    const module = modules[i % modules.length];
    const date = generateRandomDate(startDate, endDate);
    const durationMinutes = Math.floor(Math.random() * 90) + 15; // 15-105 minutes
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const completed = Math.random() > 0.2; // 80% completion rate

    records.push({
      studentId,
      studentName,
      cohort,
      module,
      date,
      durationMinutes,
      score,
      completed,
    });
  }

  // Sort by date
  return records.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export const dummyRecords: StudentRecord[] = generateDummyRecords();

// Export for easy replacement
export function loadRecords(): StudentRecord[] {
  return dummyRecords;
}
