import React from "react";
import { sanitizeHtml } from "@/lib/html";

/**
 * Renders story text with simple formatting support.
 * Supported: *italic text*
 * Preserves whitespace/newlines.
 */
export default function FormattedText({
  text,
  format = "rich_text",
}: {
  text: string;
  format?: "rich_text" | "html";
}) {
  if (format === "html") {
    return <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
  }

  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<em key={match.index}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
