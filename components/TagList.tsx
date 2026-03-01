import Link from "next/link";

interface TagListProps {
  rating: string;
  fandoms: string[];
  relationships: string[];
  characters: string[];
  freeforms: string[];
}

function renderTagList(tags: string[]) {
  return (
    <ul className="commas">
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/works?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function TagList({ rating, fandoms, relationships, characters, freeforms }: TagListProps) {
  return (
    <>
      <dt className="rating tags">Rating:</dt>
      <dd className="rating tags">
        <ul className="commas"><li>{rating}</li></ul>
      </dd>

      {fandoms.length > 0 && (
        <>
          <dt className="fandom tags">Fandoms:</dt>
          <dd className="fandom tags">{renderTagList(fandoms)}</dd>
        </>
      )}

      {relationships.length > 0 && (
        <>
          <dt className="relationship tags">Relationships:</dt>
          <dd className="relationship tags">{renderTagList(relationships)}</dd>
        </>
      )}

      {characters.length > 0 && (
        <>
          <dt className="character tags">Characters:</dt>
          <dd className="character tags">{renderTagList(characters)}</dd>
        </>
      )}

      {freeforms.length > 0 && (
        <>
          <dt className="freeform tags">Additional Tags:</dt>
          <dd className="freeform tags">{renderTagList(freeforms)}</dd>
        </>
      )}
    </>
  );
}
