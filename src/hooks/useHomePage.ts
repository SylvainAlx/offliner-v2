import { useState } from "react";

export function useHomePage() {
  const [companionIds] = useState(() =>
    Array.from({ length: 3 }, () => crypto.randomUUID()),
  );
  return { companionIds };
}
