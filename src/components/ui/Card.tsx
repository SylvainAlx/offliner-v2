import "../../styles/Card.css";

export default function Card({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section className="card" aria-label={ariaLabel}>
      {children}
    </section>
  );
}
