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

      if (!isSignedIn) {
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
    <div id="comments" className="comments module">
      <h3 className="heading">Comments ({comments.length})</h3>

      {comments.length === 0 ? (
        <p className="notice">No comments yet.</p>
      ) : (
        <ol className="thread">
          {comments.map((comment) => (
            <li key={comment.id} className="comment odd">
              <h4 className="heading byline">{comment.name}</h4>
              <p className="datetime">{new Date(comment.createdAt).toLocaleString()}</p>
              <blockquote className="userstuff">
                <p className="whitespace-pre-wrap">{comment.body}</p>
              </blockquote>
            </li>
          ))}
        </ol>
      )}

      <div className="comment-form">
        <h4 className="heading">Add Comment</h4>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isSignedIn && (
            <p>
              <label htmlFor="comment-name">Name</label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
              />
            </p>
          )}

          <p>
            <label htmlFor="comment-body">Comment</label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
            />
          </p>

          {!isSignedIn && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken("")}
              onExpire={() => setTurnstileToken("")}
            />
          )}

          <p className="actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
