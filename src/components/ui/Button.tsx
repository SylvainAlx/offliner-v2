import "../../styles/Button.css";

interface ButtonProps {
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  onClick: () => void;
}

export default function Button({
  children,
  color = "var(--accent)",
  onClick,
  disabled = false,
  ariaLabel,
  type = "button",
}: ButtonProps) {
  return (
    <button
      className="button"
      style={{ background: color }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </button>
  );
}
