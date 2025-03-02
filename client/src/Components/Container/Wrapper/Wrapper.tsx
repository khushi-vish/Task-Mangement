import "./Wrapper.css";
import Slider from "./Slider/Slider";
import TaskList from "./TaskList/TaskList";
import { useState } from "react";

export default function Wrapper() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todo");

  return (
    <div className="wrapper">
      <Slider setSelectedCategory={setSelectedCategory} />
      <TaskList selectedCategory={selectedCategory} />
    </div>
  );
}
