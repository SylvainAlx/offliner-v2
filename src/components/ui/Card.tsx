import "../../styles/Card.css";
import CardHeader from "./CardHeader";

export default function Card({
  children,
  ariaLabel,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="card" aria-label={ariaLabel}>
      <CardHeader title={title} subtitle={subtitle} />
      {children}
    </section>
  );
}
