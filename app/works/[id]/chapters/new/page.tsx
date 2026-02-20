"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

function NewChapterInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Add Chapter
        </h1>
        <p className="text-gray-600 mb-4">
          Enter the edit token you received when you created this work.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (
              e.currentTarget.elements.namedItem("token") as HTMLInputElement
            ).value;
            setToken(input);
          }}
        >
          <input
            name="token"
            type="text"
            placeholder="Edit token"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            Continue
          </button>
        </form>
      </div>
    );
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
        body: JSON.stringify({ editToken: token, title, body }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add chapter");
      }

      router.push(`/works/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Chapter</h1>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 rounded p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Chapter Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Optional chapter title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Content <span className="text-teal-600">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            placeholder="Write your chapter here..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Chapter"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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
