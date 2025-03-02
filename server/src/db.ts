import Database from "better-sqlite3";

const db = new Database(":memory:", { verbose: console.log });

db.exec(`
    CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        desc TEXT,
        deadline TEXT NOT NULL,
        startDate TEXT NOT NULL,
        status TEXT CHECK( status IN ('todo', 'inprogress', 'done', 'timeout') ) NOT NULL DEFAULT 'todo'
    )    
`);

const insertTask = db.prepare(`
    INSERT INTO tasks (title, desc, deadline, startDate, status)
    VALUES (?,?,?,?,?)
`);

insertTask.run(
  "Sample Task",
  "This is a description",
  "2025-01-01",
  "2024-02-28",
  "todo"
);

insertTask.run(
  "Complete React Project",
  "Work on the frontend and backend integration",
  "2025-03-15",
  "2024-03-01",
  "inprogress"
);

insertTask.run(
  "Prepare for Exam",
  "Revise all topics and solve practice questions",
  "2025-04-10",
  "2024-03-20",
  "todo"
);

insertTask.run(
  "Buy Groceries",
  "Get milk, eggs, and vegetables",
  "2024-02-29",
  "2024-02-28",
  "done"
);

insertTask.run(
  "Submit Assignment",
  "Complete and submit the ML assignment",
  "2024-03-05",
  "2024-03-01",
  "timeout"
);

export default db;
