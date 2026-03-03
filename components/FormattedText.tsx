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
  const richTextLooksLikeHtml = /<\/?(p|br|div|span|em|strong|blockquote|ul|ol|li|h[1-6]|a)\b/i.test(text);

  if (format === "html") {
    return <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
  }

  if (richTextLooksLikeHtml) {
    return <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
  }

  const italicize = (value: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\*([^*]+)\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        parts.push(value.slice(lastIndex, match.index));
      }
      parts.push(<em key={`${keyPrefix}-em-${match.index}`}>{match[1]}</em>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < value.length) {
      parts.push(value.slice(lastIndex));
    }

    return parts;
  };

  // Legacy rich text stories rely on plain newline spacing.
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <>
      {paragraphs.map((paragraph, pIdx) => {
        const lines = paragraph.split("\n");
        return (
          <p key={`p-${pIdx}`}>
            {lines.map((line, lineIdx) => (
              <React.Fragment key={`p-${pIdx}-l-${lineIdx}`}>
                {italicize(line, `p-${pIdx}-l-${lineIdx}`)}
                {lineIdx < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
