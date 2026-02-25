"use client";

interface FormatToggleProps {
  format: "rich_text" | "html";
  onChange: (format: "rich_text" | "html") => void;
}

export default function FormatToggle({ format, onChange }: FormatToggleProps) {
  return (
    <>
      <div className="mb-2 inline-flex rounded border border-gray-300 p-1 text-sm">
        <button
          type="button"
          onClick={() => onChange("rich_text")}
          className={`rounded px-3 py-1 ${
            format === "rich_text"
              ? "bg-teal-700 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Rich Text
        </button>
        <button
          type="button"
          onClick={() => onChange("html")}
          className={`rounded px-3 py-1 ${
            format === "html"
              ? "bg-teal-700 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          HTML
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {format === "html" ? (
          <>
            HTML mode supports safe tags like{" "}
            <code className="bg-gray-100 px-1 rounded">
              p, em, strong, a, ul, li, h1-h6
            </code>
            .
          </>
        ) : (
          <>
            Use <code className="bg-gray-100 px-1 rounded">*text*</code> for{" "}
            <em>italics</em>.
          </>
        )}
      </p>
    </>
  );
}
