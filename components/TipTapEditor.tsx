"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      data-active={active ? "true" : undefined}
      aria-pressed={active}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({ value, onChange, placeholder, autoFocus }: Props) {
  const [savedAt, setSavedAt] = useState<string>("");
  const [words, setWords] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Begin your story…",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "tt-editor",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      const text = editor.getText().trim();
      setWords(text ? text.split(/\s+/).length : 0);
      // Cheap autosave indicator (parent owns persistence)
      const t = new Date();
      setSavedAt(`${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`);
    },
    autofocus: autoFocus,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (value && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
      const text = editor.getText().trim();
      setWords(text ? text.split(/\s+/).length : 0);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="tt-wrap">
      <div className="tt-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <span className="tt-toolbar-sep" />
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Strike"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </ToolbarButton>
        <span className="tt-toolbar-sep" />
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “”
        </ToolbarButton>
        <ToolbarButton
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </ToolbarButton>
        <span className="tt-toolbar-sep" />
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          ↗
        </ToolbarButton>
        <span className="tt-toolbar-sep" />
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>

        <span className="tt-toolbar-status" aria-live="polite">
          {words.toLocaleString()} words{savedAt ? ` · ${savedAt}` : ""}
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
