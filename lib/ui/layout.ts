// Centralized layout constants for media card grids & virtualization.
// Keep these in sync with Tailwind utility classes used in components.
// If you adjust a value here, update any hard-coded h-[...] classes accordingly.

export const CARD_HEIGHT_MOBILE = 560; // matches h-[560px] (extra space for action buttons)
export const CARD_HEIGHT_DESKTOP = 600; // matches h-[600px]

export const CARD_ROW_GAP_MOBILE = 32; // px, used by virtualizer rowGap (increased from 20px for better spacing)
export const CARD_ROW_GAP_DESKTOP = 56; // px (increased from 40px for better spacing)

// Convenience helper for estimating virtual item size (height + gap)
export function estimateCardBlockSize(isDesktop: boolean) {
  return (
    (isDesktop ? CARD_HEIGHT_DESKTOP : CARD_HEIGHT_MOBILE) +
    (isDesktop ? CARD_ROW_GAP_DESKTOP : CARD_ROW_GAP_MOBILE)
  );
}
