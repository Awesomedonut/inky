"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import WorkForm from "@/components/WorkForm";

function EditWorkInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [workData, setWorkData] = useState<{
    id: string;
    title: string;
    author: string;
    summary: string;
    rating: string;
    fandoms: string[];
    relationships: string[];
    characters: string[];
    freeforms: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/works/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Work not found");
        return res.json();
      })
      .then((data) => {
        setWorkData({
          id,
          title: data.work.title,
          author: data.work.author,
          summary: data.work.summary,
          rating: data.work.rating,
          fandoms: data.work.fandoms,
          relationships: data.work.relationships,
          characters: data.work.characters,
          freeforms: data.work.freeforms,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-800 rounded p-4">
        {error}
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Work</h1>
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Work</h1>
      {workData && (
        <WorkForm mode="edit" editToken={token} initialData={workData} />
      )}
    </div>
  );
}

export default function EditWorkPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
      <EditWorkInner />
    </Suspense>
  );
}
