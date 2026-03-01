"use client";

import { useState, useEffect } from "react";

interface KudosButtonProps {
  workId: string;
  initialCount: number;
}

export default function KudosButton({ workId, initialCount }: KudosButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasKudosed, setHasKudosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHasKudosed(localStorage.getItem(`kudos:${workId}`) === "1");
  }, [workId]);

  async function handleClick() {
    if (hasKudosed || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/works/${workId}/kudos`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.kudosCount);
        setHasKudosed(true);
        localStorage.setItem(`kudos:${workId}`, "1");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={hasKudosed || isSubmitting}
      className="kudos"
      title={hasKudosed ? "You already left kudos!" : "Leave kudos"}
    >
      <span>{hasKudosed ? "\u2764\uFE0F" : "\u2661"}</span>
      <span>Kudos ({count})</span>
    </button>
  );
}
