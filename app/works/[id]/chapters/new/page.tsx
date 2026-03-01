"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import TokenPrompt from "@/components/TokenPrompt";
import FormatToggle from "@/components/FormatToggle";
import { getErrorMessage } from "@/lib/types";

function NewChapterInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [format, setFormat] = useState<"rich_text" | "html">("rich_text");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return <TokenPrompt title="Add Chapter" onSubmit={setToken} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/works/${id}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editToken: token, title, body, format }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add chapter");
      }

      router.push(`/works/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl text-teal-900 mb-4">Add Chapter</h1>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="archive-panel p-5">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Chapter Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="archive-input"
            placeholder="Optional chapter title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Content <span className="text-teal-600">*</span>
          </label>
          <FormatToggle format={format} onChange={setFormat} />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={15}
            className="archive-textarea font-mono"
            placeholder={
              format === "html"
                ? "Write your chapter using HTML tags..."
                : "Write your chapter here..."
            }
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="archive-button disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Chapter"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="archive-button-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewChapterPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
      <NewChapterInner />
    </Suspense>
  );
}
