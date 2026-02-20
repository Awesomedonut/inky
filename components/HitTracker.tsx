"use client";

import { useEffect } from "react";

export default function HitTracker({ workId }: { workId: string }) {
  useEffect(() => {
    fetch(`/api/works/${workId}/hits`, { method: "POST" }).catch(() => {});
  }, [workId]);

  return null;
}
