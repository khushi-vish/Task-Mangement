import { useEffect, useState } from "react";
import QuickCard from "./QuickCard/QuickCard";
import "./quick-cards.css";

interface Task {
  id: number;
  title: string;
  desc: string;
  deadline: string;
  startDate: string;
  status: "timeout" | "inprogress" | "done" | "todo";
}

export default function QuickCards() {
  const [taskCounts, setTaskCounts] = useState({
    timeout: 0,
    inprogress: 0,
    done: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((tasks: Task[]) => {
        console.log("Fetched tasks:", tasks);

        const timeoutCount = tasks.filter(
          (task) => task.status === "timeout"
        ).length;
        const inprogressCount = tasks.filter(
          (task) => task.status === "inprogress"
        ).length;
        const doneCount = tasks.filter((task) => task.status === "done").length;

        setTaskCounts({
          timeout: timeoutCount,
          inprogress: inprogressCount,
          done: doneCount,
        });
      })
      .catch((err) => console.error("Error fetching tasks:", err));

    const today = new Date().toISOString().split("T")[0]; //change PLEASE
    setStartDate(today);
  }, []);

  return (
    <div className="quick-cards">
      <QuickCard
        color="red"
        icon="fa-clock"
        text="Expired tasks"
        value={taskCounts.timeout}
      />
      <QuickCard
        color="#E89271"
        icon="fa-spinner"
        text="All active tasks"
        value={taskCounts.inprogress}
      />
      <QuickCard
        color="#70A1E5"
        icon="fa-check-circle"
        text="Completed tasks"
        value={taskCounts.done}
      />

      <button className="addButton" onClick={() => setShowForm(!showForm)}>
        + Add Task
      </button>

      {/* 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        desc TEXT,
        deadline TEXT NOT NULL,
        startDate TEXT NOT NULL,
        status TEXT CHECK( status IN ('todo', 'inprogress', 'done', 'timeout') ) NOT NULL DEFAULT 'todo'
      */}

      {showForm && (
        <div className="task-form grey shadow">
          <form
            onSubmit={async (event) => {
              event.preventDefault(); // Prevent default form submission

              const formData = new FormData(event.currentTarget);
              const data = Object.fromEntries(formData.entries());

              try {
                const response = await fetch("http://localhost:5000/tasks", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });

                if (!response.ok) {
                  throw new Error("Failed to add task");
                }

                setShowForm(false); // Close form after submission
                window.location.reload(); // Refresh page to reflect new task
              } catch (error) {
                console.error("Error adding task:", error);
              }
            }}
          >
            <div className="flex">
              <h2>New Task</h2>
              <span className="flex-align">
                <select name="status" id="flex-status">
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="timeout">Timeout</option>
                </select>
              </span>
            </div>
            <hr className="form-hr" />
            <strong>
              <input
                type="text"
                placeholder="Title"
                required
                className="title-form"
                name="title"
              />
            </strong>
            <br />
            <br />
            <textarea
              name="desc"
              placeholder="Description"
              required
              className="desc-form"
              cols={43}
              rows={12}
            ></textarea>
            <br />
            <br />
            <input name="deadline" type="date" required />
            <input type="hidden" name="startDate" value={startDate} />
            <button type="submit">Add Task</button>
            <br />
            <br />
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
