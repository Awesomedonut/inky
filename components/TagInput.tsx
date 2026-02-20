"use client";

import { useState, useRef, useEffect } from "react";

interface TagInputProps {
  label: string;
  type: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({
  label,
  type,
  value,
  onChange,
  placeholder,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    fetch(
      `/api/tags?type=${encodeURIComponent(type)}&q=${encodeURIComponent(input)}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        const tags: string[] = data.tags || [];
        setSuggestions(tags.filter((t) => !value.includes(t)).slice(0, 5));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [input, type, value]);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setSuggestions([]);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div ref={wrapperRef} className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded bg-white min-h-[42px]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-teal-500 hover:text-teal-700 font-bold"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="border border-gray-200 rounded mt-1 bg-white shadow-lg z-10 relative">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                addTag(s);
                setShowSuggestions(false);
              }}
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-teal-50 hover:text-teal-800"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Separate tags with commas or press Enter
      </p>
    </div>
  );
}
