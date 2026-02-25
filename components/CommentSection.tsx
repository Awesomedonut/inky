"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Comment, getErrorMessage } from "@/lib/types";

interface CommentSectionProps {
  workId: string;
}

export default function CommentSection({ workId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const isSignedIn = !!session?.user;

  useEffect(() => {
    fetch(`/api/works/${workId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => {});
  }, [workId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    if (!isSignedIn && !turnstileToken) {
      setError("Please complete the captcha");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload: Record<string, string> = { body };

      if (isSignedIn) {
        // Name comes from session on the server
      } else {
        payload.name = name;
        payload.turnstileToken = turnstileToken;
      }

      const res = await fetch(`/api/works/${workId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const data = await res.json();
      setComments([...comments, data.comment]);
      setBody("");
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm mb-6">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 rounded p-3"
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  {comment.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Leave a Comment
        </h4>
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-2 mb-3 text-sm">
            {error}
          </div>
        )}

        {isSignedIn ? (
          <p className="text-sm text-gray-600 mb-3">
            Commenting as <span className="font-semibold">{session.user?.name}</span>
          </p>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (Anonymous)"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </>
        )}

        <div className="mb-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            placeholder="Write your comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {!isSignedIn && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="mb-3">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken("")}
              onExpire={() => setTurnstileToken("")}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800 disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
