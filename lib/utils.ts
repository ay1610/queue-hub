import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * @param inputs - The class values to merge.
 * @returns The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a random selection of items from an array.
 * @param array The array to select from.
 * @param count The number of random items to return.
 * @returns An array of randomly selected items (no duplicates).
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  if (count <= 0) return [];
  if (count >= array.length) return [...array];
  const result: T[] = [];
  const usedIndices = new Set<number>();
  while (result.length < count) {
    const idx = Math.floor(Math.random() * array.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      result.push(array[idx]);
    }
  }
  return result;
}
