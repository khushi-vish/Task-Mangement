import "./QuickCard.css";

type QuickCardProps = {
  color: string;
  icon: string;
  text: string;
  value: string | number;
};

export default function QuickCard({
  color,
  icon,
  text,
  value,
}: QuickCardProps) {
  return (
    <div className="card grey padding radius shadow">
      <i style={{ color: color }} className={`fa-solid ${icon}`}></i>
      <p className="text-grey">{text}</p>
      <p>{value}</p>
    </div>
  );
}
