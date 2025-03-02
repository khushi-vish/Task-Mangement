import express, { Request, Response } from "express";
import cors from "cors";
import db from "./db";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/tasks", (req: Request, res: Response) => {
  try {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/tasks/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = db.prepare("SELECT * FROM tasks WHERE id = ?");
    const task = query.get(id);

    if (!task) {
      res.status(404).json({ error: "task not found" });
    } else {
      res.json(task);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

app.post("/tasks", (req: Request, res: Response) => {
  try {
    const { title, desc, deadline, startDate, status } = req.body;

    if (!title || !deadline || !startDate || !status) {
      res.status(404).json({ error: "missing required fields" });
      res.end();
    } else {
      const insertTask = db.prepare(`
        INSERT INTO tasks (title, desc, deadline, startDate, status)
        VALUES (?,?,?,?,?)  
      `);

      const result = insertTask.run(title, desc, deadline, startDate, status);

      res.status(201).json({
        id: result.lastInsertRowid,
        title,
        desc,
        deadline,
        startDate,
        status,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, desc, deadline, status } = req.body;

    const query = db.prepare(`
      UPDATE tasks 
      SET 
        title = COALESCE(?, title), 
        desc = COALESCE(?, desc), 
        deadline = COALESCE(?, deadline), 
        status = COALESCE(?, status) 
      WHERE id = ?
    `);

    const result = query.run(title, desc, deadline, status, id);

    if (result.changes === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json({ message: "Task updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = db.prepare("DELETE FROM tasks WHERE id = ?");
    const result = query.run(id);

    if (result.changes === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json({ message: "Task deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// "todo", "inprogress", "done", "timeout"

app.get("/todo", (req: Request, res: Response) => {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks WHERE status = ?")
      .all("todo");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/inprogress", (req: Request, res: Response) => {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks WHERE status = ?")
      .all("inprogress");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/done", (req: Request, res: Response) => {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks WHERE status = ?")
      .all("done");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/timeout", (req: Request, res: Response) => {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks WHERE status = ?")
      .all("timeout");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
