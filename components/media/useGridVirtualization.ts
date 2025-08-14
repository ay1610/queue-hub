import { useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

/**
 * Generic hook for grid virtualization setup using @tanstack/react-virtual.
 * Returns the virtualizer instance, virtualRows, and rowCount.
 */
export function useGridVirtualization<T>({
  media,
  cardsPerRow,
  rowHeight,
  overscan = 6,
}: {
  media: T[];
  cardsPerRow: number;
  rowHeight: number;
  overscan?: number;
}) {
  const rowCount = useMemo(
    () => Math.ceil(media.length / cardsPerRow),
    [media.length, cardsPerRow]
  );

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => rowHeight,
    overscan,
    // measureElement is handled by ref in the component
  });

  const virtualRows = virtualizer.getVirtualItems();

  return { virtualizer, virtualRows, rowCount };
}
