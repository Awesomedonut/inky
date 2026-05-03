"use client";

import { useEffect, useRef } from "react";

export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className="reading-progress" aria-hidden="true" />;
}
