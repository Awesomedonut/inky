import Link from "next/link";
import { TagType, TAG_TYPES, TAG_COLORS, RATING_COLORS } from "@/lib/types";

interface TagListProps {
  rating: string;
  fandoms: string[];
  relationships: string[];
  characters: string[];
  freeforms: string[];
}

export default function TagList({ rating, fandoms, relationships, characters, freeforms }: TagListProps) {
  const tagsByType: Record<TagType, string[]> = { fandoms, relationships, characters, freeforms };

  return (
    <div className="flex flex-wrap gap-1 text-sm">
      <span
        className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${RATING_COLORS[rating] || "bg-gray-500"}`}
      >
        {rating}
      </span>
      {TAG_TYPES.map((type) =>
        tagsByType[type].map((tag) => (
          <Link
            key={`${type}-${tag}`}
            href={`/works?tag=${encodeURIComponent(tag)}`}
            className={`px-2 py-0.5 rounded ${TAG_COLORS[type].bg} ${TAG_COLORS[type].text} ${TAG_COLORS[type].hover}`}
          >
            {tag}
          </Link>
        ))
      )}
    </div>
  );
}
