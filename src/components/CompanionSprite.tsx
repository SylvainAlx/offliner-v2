import { generateCompanionSprite } from "../utils/companionSprite";

export default function CompanionSprite({
  id,
  className = "companion-sprite",
}: {
  id: string;
  className?: string;
}) {
  const sprite = generateCompanionSprite(id);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${sprite.size} ${sprite.size}`}
      aria-hidden="true"
    >
      {sprite.pixels.map((pixel) => (
        <rect
          key={`${pixel.x}-${pixel.y}`}
          x={pixel.x}
          y={pixel.y}
          width="1"
          height="1"
          fill={pixel.color}
        />
      ))}
    </svg>
  );
}
