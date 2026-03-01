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
    <div className="filters module">
      <h3 className="heading">Sort and Filter</h3>
      {activeTag && (
        <ul className="actions">
          <li><Link href="/works">Clear filter</Link></li>
        </ul>
      )}
      {(Object.keys(tagLabels) as Array<keyof TagsByType>).map((type) => {
        if (tags[type].length === 0) return null;
        return (
          <dl key={type} className="meta group">
            <dt>{tagLabels[type]}:</dt>
            <dd>
              <ul className="commas">
                {tags[type].slice(0, 15).map((tag) => (
                  <li key={tag}>
                    <Link href={`/works?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        );
      })}
    </div>
  );
}
