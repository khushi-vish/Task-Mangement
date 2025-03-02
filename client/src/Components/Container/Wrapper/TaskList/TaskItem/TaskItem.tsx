import { useEffect, useState } from "react";
import "./TaskItem.css";

interface TaskItemProps {
  category: string;
}

interface Task {
  id: number;
  title: string;
  desc: string;
  deadline: string;
  startDate: string;
  status: string;
}

const categoryEndpoints: Record<string, string> = {
  "To Do": "http://localhost:5000/todo",
  "On Progress": "http://localhost:5000/inprogress",
  Done: "http://localhost:5000/done",
  Streaming: "http://localhost:5000/streaming",
};

export default function TaskItem({ category }: TaskItemProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    const endpoint = categoryEndpoints[category];
    if (!endpoint) return;

    setLoading(true);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [category]);

  const handleEditClick = (task: Task) => {
    setEditTask(task);
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTask) return;

    fetch(`http://localhost:5000/tasks/${editTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editTask),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload(); // Reload to reflect changes
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleDelete = (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete");
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length > 0 ? (
        <div className="tasks">
          {tasks.map((task) => (
            <div key={task.id} className="task-card shadow ">
              <div className="status-bar">
                {task.status === "todo" ? (
                  <span className="status blue">{task.status}</span>
                ) : task.status === "inprogress" ? (
                  <span className="status yellow">{task.status}</span>
                ) : (
                  <span className="status green">{task.status}</span>
                )}

                <button
                  className="three-dots"
                  onClick={() => handleEditClick(task)}
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
              </div>

              <h2>{task.title}</h2>
              <span className="desc">{task.desc}</span>
              <p className="deadline">
                <strong>Deadline:</strong> {task.deadline}
                <button
                  className="trash-button"
                  onClick={() => handleDelete(task.id)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks available</p>
      )}

      {editTask && (
        <div className="task-form grey shadow">
          <form onSubmit={handleUpdate}>
            <div className="flex">
              <h2>Edit Task</h2>
              <span className="flex-align">
                <select
                  name="status"
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                >
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
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
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
              value={editTask.desc}
              onChange={(e) =>
                setEditTask({ ...editTask, desc: e.target.value })
              }
            ></textarea>
            <br />
            <br />
            <input
              name="deadline"
              type="date"
              required
              value={editTask.deadline}
              onChange={(e) =>
                setEditTask({ ...editTask, deadline: e.target.value })
              }
            />
            <br />
            <br />
            <button type="submit">Update Task</button>
            <br />
            <br />
            <button type="button" onClick={() => setEditTask(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
