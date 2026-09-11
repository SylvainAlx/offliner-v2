export interface CompanionSpritePixel {
  x: number;
  y: number;
  color: string;
}

export interface CompanionSprite {
  size: number;
  pixels: CompanionSpritePixel[];
}

interface SpritePalette {
  outline: string;
  body: string;
  highlight: string;
  eye: string;
  accent: string;
  shadow: string;
}

const SPRITE_SIZE = 16;

const PALETTES: SpritePalette[] = [
  { outline: "#33204f", body: "#a855f7", highlight: "#d8b4fe", eye: "#fefce8", accent: "#f472b6", shadow: "#7e22ce" },
  { outline: "#123c4a", body: "#22d3ee", highlight: "#a5f3fc", eye: "#fff7ed", accent: "#facc15", shadow: "#0891b2" },
  { outline: "#3f2a14", body: "#f97316", highlight: "#fed7aa", eye: "#fffbeb", accent: "#84cc16", shadow: "#c2410c" },
  { outline: "#173b2a", body: "#34d399", highlight: "#bbf7d0", eye: "#f0fdf4", accent: "#60a5fa", shadow: "#059669" },
  { outline: "#4a1d2f", body: "#fb7185", highlight: "#fecdd3", eye: "#fff1f2", accent: "#c084fc", shadow: "#e11d48" },
  { outline: "#24324a", body: "#818cf8", highlight: "#c7d2fe", eye: "#eef2ff", accent: "#fbbf24", shadow: "#4f46e5" },
  { outline: "#3e2723", body: "#a16207", highlight: "#fde68a", eye: "#fffbeb", accent: "#f43f5e", shadow: "#713f12" },
  { outline: "#263238", body: "#90a4ae", highlight: "#cfd8dc", eye: "#f8fafc", accent: "#f59e0b", shadow: "#546e7a" },
];

const SILHOUETTES: number[][] = [
  [2, 3, 4, 4, 4, 4, 4, 4, 3, 3, 2],
  [3, 4, 5, 5, 5, 5, 5, 4, 4, 3, 2],
  [2, 3, 3, 3, 4, 5, 5, 5, 4, 3, 3],
  [4, 5, 5, 5, 4, 4, 4, 3, 3, 2, 2],
  [2, 3, 4, 5, 5, 5, 4, 4, 4, 3, 2],
  [3, 3, 4, 4, 5, 5, 4, 4, 3, 3, 3],
];

function hashId(id: string): number {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/** Creates a stable, varied 16x16 pixel monster from the companion id. */
export function generateCompanionSprite(id: string): CompanionSprite {
  const random = createRandom(hashId(id));
  const palette = PALETTES[randomInt(random, 0, PALETTES.length - 1)];
  const silhouette = SILHOUETTES[randomInt(random, 0, SILHOUETTES.length - 1)];
  const pixels: Array<Array<string | null>> = Array.from(
    { length: SPRITE_SIZE },
    () => Array.from({ length: SPRITE_SIZE }, () => null),
  );

  const setPixel = (x: number, y: number, color: string) => {
    if (x >= 0 && x < SPRITE_SIZE && y >= 0 && y < SPRITE_SIZE) {
      pixels[y][x] = color;
    }
  };

  const drawLine = (x: number, y: number, length: number, color: string) => {
    for (let offset = 0; offset < length; offset += 1) {
      setPixel(x + offset, y, color);
    }
  };

  const drawPoints = (points: Array<[number, number]>, color: string) => {
    points.forEach(([x, y]) => setPixel(x, y, color));
  };

  const center = 7.5;
  const bodyTop = randomInt(random, 3, 4);
  const bodyShift = randomInt(random, -1, 1);
  const bodyRows = silhouette.slice(0, randomInt(random, 9, 11));

  bodyRows.forEach((halfWidth, row) => {
    const y = bodyTop + row;
    const left = Math.floor(center - halfWidth / 2) + bodyShift;
    const right = Math.ceil(center + halfWidth / 2) + bodyShift;

    for (let x = left; x <= right; x += 1) {
      const isEdge = x === left || x === right || row === 0 || row === bodyRows.length - 1;
      const fill = isEdge
        ? palette.outline
        : row > bodyRows.length - 3
          ? palette.shadow
          : palette.body;
      setPixel(x, y, fill);
    }
  });

  const firstHalfWidth = bodyRows[0];
  const leftEdge = Math.floor(center - firstHalfWidth / 2) + bodyShift;
  const rightEdge = Math.ceil(center + firstHalfWidth / 2) + bodyShift;
  const appendage = randomInt(random, 0, 6);

  if (appendage === 0) {
    drawPoints([[leftEdge, bodyTop], [leftEdge - 1, bodyTop - 1], [leftEdge - 1, bodyTop - 2], [rightEdge, bodyTop], [rightEdge + 1, bodyTop - 1], [rightEdge + 1, bodyTop - 2]], palette.outline);
  } else if (appendage === 1) {
    drawPoints([[leftEdge - 1, bodyTop], [leftEdge - 2, bodyTop - 1], [leftEdge - 2, bodyTop - 2], [rightEdge + 1, bodyTop], [rightEdge + 2, bodyTop - 1], [rightEdge + 2, bodyTop - 2]], palette.accent);
  } else if (appendage === 2) {
    drawPoints([[leftEdge, bodyTop], [leftEdge + 1, bodyTop - 1], [leftEdge + 1, bodyTop - 2], [rightEdge, bodyTop], [rightEdge - 1, bodyTop - 1], [rightEdge - 1, bodyTop - 2]], palette.outline);
  } else if (appendage === 3) {
    drawPoints([[7, bodyTop - 1], [7, bodyTop - 2], [6, bodyTop - 3], [8, bodyTop - 3]], palette.accent);
  } else if (appendage === 4) {
    drawPoints([[leftEdge, bodyTop], [leftEdge - 1, bodyTop - 1], [leftEdge - 2, bodyTop - 1], [rightEdge, bodyTop], [rightEdge + 1, bodyTop - 1], [rightEdge + 2, bodyTop - 1]], palette.highlight);
  } else if (appendage === 5) {
    drawPoints([[6, bodyTop - 1], [6, bodyTop - 2], [7, bodyTop - 3], [8, bodyTop - 2], [8, bodyTop - 1]], palette.outline);
  }

  const faceY = bodyTop + randomInt(random, 2, 4);
  const faceCenter = 8 + bodyShift;
  const eyeStyle = randomInt(random, 0, 4);

  if (eyeStyle === 0) {
    setPixel(faceCenter - 3, faceY, palette.eye);
    setPixel(faceCenter - 2, faceY, palette.outline);
    setPixel(faceCenter + 2, faceY, palette.outline);
    setPixel(faceCenter + 3, faceY, palette.eye);
  } else if (eyeStyle === 1) {
    setPixel(faceCenter - 1, faceY, palette.eye);
    setPixel(faceCenter, faceY, palette.outline);
    setPixel(faceCenter + 1, faceY, palette.eye);
    setPixel(faceCenter, faceY + 1, palette.outline);
  } else if (eyeStyle === 2) {
    drawLine(faceCenter - 3, faceY, 2, palette.outline);
    drawLine(faceCenter + 2, faceY, 2, palette.outline);
  } else if (eyeStyle === 3) {
    drawPoints([[faceCenter - 3, faceY], [faceCenter - 2, faceY], [faceCenter - 3, faceY + 1], [faceCenter + 2, faceY], [faceCenter + 3, faceY], [faceCenter + 3, faceY + 1]], palette.eye);
    setPixel(faceCenter - 2, faceY + 1, palette.outline);
    setPixel(faceCenter + 2, faceY + 1, palette.outline);
  } else {
    setPixel(faceCenter - 3, faceY, palette.accent);
    setPixel(faceCenter - 2, faceY, palette.outline);
    setPixel(faceCenter + 2, faceY, palette.eye);
    setPixel(faceCenter + 3, faceY, palette.outline);
  }

  const mouthY = faceY + 3;
  const mouthStyle = randomInt(random, 0, 3);
  if (mouthStyle === 0) {
    drawPoints([[faceCenter - 1, mouthY], [faceCenter, mouthY + 1], [faceCenter + 1, mouthY]], palette.outline);
  } else if (mouthStyle === 1) {
    drawLine(faceCenter - 1, mouthY, 3, palette.outline);
    setPixel(faceCenter, mouthY + 1, palette.accent);
  } else if (mouthStyle === 2) {
    setPixel(faceCenter, mouthY, palette.outline);
    setPixel(faceCenter, mouthY + 1, palette.highlight);
  } else {
    setPixel(faceCenter - 1, mouthY, palette.outline);
    setPixel(faceCenter + 1, mouthY, palette.outline);
  }

  const pattern = randomInt(random, 0, 4);
  const patternY = bodyTop + 6;
  if (pattern === 0) {
    drawLine(faceCenter - 2, patternY, 5, palette.highlight);
    drawLine(faceCenter - 2, patternY + 1, 5, palette.highlight);
  } else if (pattern === 1) {
    drawPoints([[faceCenter - 3, patternY], [faceCenter + 2, patternY], [faceCenter - 2, patternY + 2], [faceCenter + 1, patternY + 2]], palette.accent);
  } else if (pattern === 2) {
    drawLine(faceCenter - 3, patternY, 7, palette.shadow);
    drawLine(faceCenter - 2, patternY + 2, 5, palette.shadow);
  } else if (pattern === 3) {
    setPixel(faceCenter, patternY, palette.highlight);
    setPixel(faceCenter - 1, patternY + 1, palette.highlight);
    setPixel(faceCenter + 1, patternY + 1, palette.highlight);
    setPixel(faceCenter, patternY + 2, palette.highlight);
  }

  const armY = bodyTop + randomInt(random, 5, 7);
  setPixel(leftEdge - 1, armY, palette.outline);
  setPixel(leftEdge - 2, armY + (random() > 0.5 ? 1 : 0), palette.accent);
  setPixel(rightEdge + 1, armY, palette.outline);
  setPixel(rightEdge + 2, armY + (random() > 0.5 ? 1 : 0), palette.accent);

  const footY = Math.min(15, bodyTop + bodyRows.length);
  if (random() > 0.35) {
    drawLine(leftEdge + 1, footY, 2, palette.outline);
    drawLine(rightEdge - 2, footY, 2, palette.outline);
  } else {
    drawLine(leftEdge + 2, footY, 3, palette.outline);
  }

  if (random() > 0.45) {
    const tailSide = random() > 0.5 ? 1 : -1;
    const tailX = tailSide === 1 ? rightEdge + 2 : leftEdge - 2;
    setPixel(tailX, bodyTop + 7, palette.accent);
    setPixel(tailX + tailSide, bodyTop + 6, palette.accent);
    setPixel(tailX + tailSide * 2, bodyTop + 6, palette.accent);
  }

  return {
    size: SPRITE_SIZE,
    pixels: pixels.flatMap((row, y) =>
      row.flatMap((color, x) => (color ? [{ x, y, color }] : [])),
    ),
  };
}
