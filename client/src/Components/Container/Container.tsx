import QuickCards from "./quick-cards/quickCards";
import "./Container.css";
import Wrapper from "./Wrapper/Wrapper";

export default function Container() {
  return (
    <div className="mega-Container">
      <QuickCards />
      <Wrapper />
    </div>
  );
}
