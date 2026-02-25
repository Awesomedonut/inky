"use client";

interface TokenPromptProps {
  title: string;
  onSubmit: (token: string) => void;
}

export default function TokenPrompt({ title, onSubmit }: TokenPromptProps) {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600 mb-4">
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
