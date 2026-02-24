"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TagInput from "./TagInput";
import { RATINGS } from "@/lib/types";

interface WorkFormProps {
  mode: "create" | "edit";
  editToken?: string;
  initialData?: {
    id?: string;
    title: string;
    author: string;
    summary: string;
    rating: string;
    fandoms: string[];
    relationships: string[];
    characters: string[];
    freeforms: string[];
    chapterBody?: string;
    chapterTitle?: string;
    chapterFormat?: "rich_text" | "html";
  };
}

export default function WorkForm({ mode, editToken, initialData }: WorkFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [rating, setRating] = useState(initialData?.rating || "Not Rated");
  const [fandoms, setFandoms] = useState<string[]>(initialData?.fandoms || []);
  const [relationships, setRelationships] = useState<string[]>(
    initialData?.relationships || []
  );
  const [characters, setCharacters] = useState<string[]>(
    initialData?.characters || []
  );
  const [freeforms, setFreeforms] = useState<string[]>(
    initialData?.freeforms || []
  );
  const [chapterTitle, setChapterTitle] = useState(
    initialData?.chapterTitle || ""
  );
  const [chapterBody, setChapterBody] = useState(
    initialData?.chapterBody || ""
  );
  const [chapterFormat, setChapterFormat] = useState<"rich_text" | "html">(
    initialData?.chapterFormat || "rich_text"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdToken, setCreatedToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "create") {
        const res = await fetch("/api/works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            author,
            summary,
            rating,
            fandoms,
            relationships,
            characters,
            freeforms,
            chapterBody,
            chapterTitle,
            chapterFormat,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create work");
        }

        const data = await res.json();
        setCreatedToken(data.editToken);
      } else {
        const res = await fetch(`/api/works/${initialData?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            editToken,
            title,
            author,
            summary,
            rating,
            fandoms,
            relationships,
            characters,
            freeforms,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update work");
        }

        router.push(`/works/${initialData?.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // Show the edit token modal after creating
  if (createdToken) {
    return (
      <div className="bg-yellow-50 border border-yellow-400 rounded p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-yellow-800 mb-3">
          Work Created Successfully!
        </h2>
        <p className="text-yellow-800 mb-4">
          Save this edit token — it&apos;s the <strong>only way</strong> to edit
          or delete your work later. This will not be shown again.
        </p>
        <div className="bg-white border border-yellow-300 rounded p-3 mb-4 font-mono text-sm break-all">
          {createdToken}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(createdToken)}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Copy Token
          </button>
          <button
            onClick={() => {
              const workId = title; // We need the work ID; let's fetch it
              router.push("/");
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 rounded p-3 mb-4">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Title <span className="text-teal-600">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Work title"
        />
      </div>

      {/* Author */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Author
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Anonymous"
        />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {RATINGS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="A brief summary of your work"
        />
      </div>

      {/* Tags */}
      <TagInput
        label="Fandoms"
        type="fandoms"
        value={fandoms}
        onChange={setFandoms}
        placeholder="e.g. Original Work"
      />
      <TagInput
        label="Relationships"
        type="relationships"
        value={relationships}
        onChange={setRelationships}
        placeholder="e.g. Daien Zheng | Dayan Uzun/Ludi Sand"
      />
      <TagInput
        label="Characters"
        type="characters"
        value={characters}
        onChange={setCharacters}
        placeholder="e.g. Daien Zheng | Dayan Uzun"
      />
      <TagInput
        label="Additional Tags"
        type="freeforms"
        value={freeforms}
        onChange={setFreeforms}
        placeholder="e.g. Fluff, Angst"
      />

      {/* Chapter (only for create mode) */}
      {mode === "create" && (
        <>
          <hr className="my-6 border-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Chapter 1
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Chapter Title
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Optional chapter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Content <span className="text-teal-600">*</span>
            </label>
            <div className="mb-2 inline-flex rounded border border-gray-300 p-1 text-sm">
              <button
                type="button"
                onClick={() => setChapterFormat("rich_text")}
                className={`rounded px-3 py-1 ${
                  chapterFormat === "rich_text"
                    ? "bg-teal-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Rich Text
              </button>
              <button
                type="button"
                onClick={() => setChapterFormat("html")}
                className={`rounded px-3 py-1 ${
                  chapterFormat === "html"
                    ? "bg-teal-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                HTML
              </button>
            </div>
            <textarea
              value={chapterBody}
              onChange={(e) => setChapterBody(e.target.value)}
              required
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              placeholder={
                chapterFormat === "html"
                  ? "Write your story using HTML tags..."
                  : "Write your story here..."
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              {chapterFormat === "html" ? (
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
          </div>
        </>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
              ? "Post Work"
              : "Update Work"}
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
  );
}
