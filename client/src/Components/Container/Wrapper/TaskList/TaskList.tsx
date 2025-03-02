import "./TaskList.css";
import TaskItem from "./TaskItem/TaskItem";

interface TaskListProps {
  selectedCategory: string;
}

export default function TaskList({ selectedCategory }: TaskListProps) {
  const categoryMap: Record<string, string> = {
    todo: "To Do",
    inprogress: "On Progress",
    done: "Done",
    streaming: "Streaming",
  };
  const category = categoryMap[selectedCategory] || "Select a category";

  const getDotButtonColor = () => {
    if (category === "To Do") return "#5030e5";
    if (category === "On Progress") return "#ffa500";
    if (category === "Done") return "#8bc48a";
    if (category === "Streaming") return "#FF69B4"; // Temporary color for Streaming
    return "gray";
  };

  return (
    <div className="lists grey shadow">
      <div className="grey list">
        <h3>
          <button
            className="dot-button"
            style={{ backgroundColor: getDotButtonColor() }}
          ></button>
          {category}
        </h3>
        <hr style={{ backgroundColor: getDotButtonColor() }} />
        <TaskItem category={category} />
      </div>
    </div>
  );
}
