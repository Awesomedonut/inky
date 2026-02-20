"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface TagsByType {
  fandoms: string[];
  relationships: string[];
  characters: string[];
  freeforms: string[];
}

const tagLabels: Record<string, string> = {
  fandoms: "Fandoms",
  relationships: "Relationships",
  characters: "Characters",
  freeforms: "Additional Tags",
};

export default function TagFilter() {
  const [tags, setTags] = useState<TagsByType | null>(null);
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch(() => {});
  }, []);

  if (!tags) return null;

  const hasAnyTags = Object.values(tags).some((arr) => arr.length > 0);
  if (!hasAnyTags) return null;

  return (
    <div className="bg-white border border-gray-300 rounded p-4">
      <h3 className="font-bold text-gray-800 mb-3">Filter by Tag</h3>
      {activeTag && (
        <div className="mb-3">
          <Link
            href="/works"
            className="text-sm text-teal-700 hover:underline"
          >
            Clear filter
          </Link>
        </div>
      )}
      {(Object.keys(tagLabels) as Array<keyof TagsByType>).map((type) => {
        if (tags[type].length === 0) return null;
        return (
          <div key={type} className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              {tagLabels[type]}
            </h4>
            <div className="flex flex-wrap gap-1">
              {tags[type].slice(0, 10).map((tag) => (
                <Link
                  key={tag}
                  href={`/works?tag=${encodeURIComponent(tag)}`}
                  className={`px-2 py-0.5 rounded text-xs ${
                    activeTag === tag
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
