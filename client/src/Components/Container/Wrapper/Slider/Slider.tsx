import "./Slider.css";

interface SliderProps {
  setSelectedCategory: (category: string) => void;
}

export default function Slider({ setSelectedCategory }: SliderProps) {
  return (
    <div>
      <button
        className="sliderButton grey shadow"
        onClick={() => setSelectedCategory("todo")}
      >
        To do
      </button>
      <button
        className="sliderButton grey shadow"
        onClick={() => setSelectedCategory("inprogress")}
      >
        On Progress
      </button>
      <button
        className="sliderButton grey shadow"
        onClick={() => setSelectedCategory("done")}
      >
        Done
      </button>

      <button
        className="sliderButton grey shadow"
        onClick={() => setSelectedCategory("streaming")}
      >
        Streaming
      </button>
    </div>
  );
}
