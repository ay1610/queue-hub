import { useState, useEffect } from "react";
import { getRandomItems } from "@/lib/utils";

/**
 * Generic hook to select a random hero item from a list.
 * Returns the selected item or null if the list is empty.
 */
export function useHeroItem<T extends { id: number }>(items: T[]): T | null {
  const [heroItem, setHeroItem] = useState<T | null>(null);

  useEffect(() => {
    if (items.length) {
      const [randomItem] = getRandomItems(items, 1);
      setHeroItem(randomItem);
    } else {
      setHeroItem(null);
    }
  }, [items]);

  return heroItem;
}
