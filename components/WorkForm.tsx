"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TagInput from "./TagInput";
import FormatToggle from "./FormatToggle";
import { RATINGS, getErrorMessage } from "@/lib/types";

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
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // Show the edit token modal after creating
  if (createdToken) {
    return (
      <div className="bg-yellow-50 border border-yellow-400 p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl text-yellow-800 mb-3">
          Work Created Successfully!
        </h2>
        <p className="text-yellow-800 mb-4">
          Save this edit token — it&apos;s the <strong>only way</strong> to edit
          or delete your work later. This will not be shown again.
        </p>
        <div className="bg-white border border-yellow-300 p-3 mb-4 font-mono text-sm break-all">
          {createdToken}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(createdToken)}
            className="archive-button"
          >
            Copy Token
          </button>
          <button
            onClick={() => {
              router.push("/");
            }}
            className="archive-button-secondary"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="archive-panel max-w-4xl mx-auto p-5">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-3 mb-4">
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
          className="archive-input"
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
          className="archive-input"
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
          className="archive-select"
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
          className="archive-textarea"
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
              className="archive-input"
              placeholder="Optional chapter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Content <span className="text-teal-600">*</span>
            </label>
            <FormatToggle format={chapterFormat} onChange={setChapterFormat} />
            <textarea
              value={chapterBody}
              onChange={(e) => setChapterBody(e.target.value)}
              required
              rows={15}
              className="archive-textarea font-mono"
              placeholder={
                chapterFormat === "html"
                  ? "Write your story using HTML tags..."
                  : "Write your story here..."
              }
            />
          </div>
        </>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="archive-button disabled:opacity-50"
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
          className="archive-button-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
