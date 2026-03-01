"use client";

interface TokenPromptProps {
  title: string;
  onSubmit: (token: string) => void;
}

export default function TokenPrompt({ title, onSubmit }: TokenPromptProps) {
  return (
    <div className="archive-panel max-w-xl mx-auto p-5">
      <h1 className="text-3xl text-teal-900 mb-3">{title}</h1>
      <p className="text-slate-600 mb-4">
        Enter the edit token you received when you created this work.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (
            e.currentTarget.elements.namedItem("token") as HTMLInputElement
          ).value;
          onSubmit(input);
        }}
      >
        <input
          name="token"
          type="text"
          placeholder="Edit token"
          className="archive-input mb-3"
        />
        <button
          type="submit"
          className="archive-button"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
