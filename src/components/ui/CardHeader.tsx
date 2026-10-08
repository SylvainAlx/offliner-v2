interface CardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function CardHeader({
  title,
  subtitle,
  className = "",
}: CardHeaderProps) {
  return (
    <div
      className={`w-full flex flex-col justify-between items-start gap-1.5 pt-5.5 px-5 pb-5 border-b border-gray-100 ${className}`.trim()}
    >
      <h2 className="m-0 mb-1.25 text-gray-900 text-[1.28rem] font-extrabold">
        {title}
      </h2>
      {subtitle && (
        <p className="m-0 text-gray-600 text-[0.82rem] leading-[1.4]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
