import { generateCompanionSprite } from "../utils/companionSprite";

interface CompanionSpriteProps {
  id: string;
  className?: string;
}

export default function CompanionSprite({
  id,
  className,
}: CompanionSpriteProps) {
  const sprite = generateCompanionSprite(id);
  const spriteClassName =
    className ??
    "block size-[90px] [image-rendering:pixelated] [shape-rendering:crispEdges]";

  return (
    <svg
      className={spriteClassName}
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
