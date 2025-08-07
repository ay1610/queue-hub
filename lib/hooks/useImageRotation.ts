import { useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Custom hook for interactive parallax image movement using Framer Motion.
 * Usage: const { parallax, handlers } = useImageParallax();
 * <motion.div style={parallax} {...handlers} />
 */
export function useImageParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.currentTarget as HTMLDivElement;
      const { left, top, width, height } = target.getBoundingClientRect();
      // Parallax: move max ±20px from center
      let px = ((e.clientX - left - width / 2) / (width / 2)) * 20;
      let py = ((e.clientY - top - height / 2) / (height / 2)) * 20;
      px = Math.max(-20, Math.min(20, px));
      py = Math.max(-20, Math.min(20, py));
      x.set(px);
      y.set(py);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    parallax: { x: springX, y: springY },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
