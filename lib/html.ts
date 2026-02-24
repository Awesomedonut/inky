const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "u",
  "ul",
]);

function sanitizeHref(href: string): string | null {
  const trimmed = href.trim();
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }
  return null;
}

export function sanitizeHtml(input: string): string {
  let output = input;

  // Remove high-risk blocks entirely.
  output = output
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<(iframe|object|embed|svg|math|form|input|button|textarea|select|meta|link|base)[\s\S]*?>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(iframe|object|embed|svg|math|form|input|button|textarea|select|meta|link|base)\b[^>]*\/?>/gi, "");

  output = output.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (full, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) return "";
    if (isClosing) return `</${tag}>`;

    if (tag !== "a") return `<${tag}>`;

    const hrefMatch = rawAttrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const hrefRaw = hrefMatch?.[2] || hrefMatch?.[3] || hrefMatch?.[4] || "";
    const safeHref = sanitizeHref(hrefRaw);

    if (!safeHref) return "<a>";
    return `<a href="${safeHref.replace(/"/g, "&quot;")}">`;
  });

  return output;
}
