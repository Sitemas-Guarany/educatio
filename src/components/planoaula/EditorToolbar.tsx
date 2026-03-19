"use client";

import type { Editor } from "@tiptap/react";

const FONTS = [
  "Plus Jakarta Sans",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Comic Sans MS",
];

interface ToolbarProps {
  editor: Editor | null;
}

function Btn({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
        active ? "bg-ceara-verde text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-6 bg-gray-200 shrink-0 mx-0.5" />;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("URL do link:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50/50 rounded-t-xl overflow-x-auto">
      {/* Font family */}
      <select
        value={editor.getAttributes("textStyle").fontFamily || "Plus Jakarta Sans"}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="h-8 text-[11px] font-medium bg-white border border-gray-200 rounded-lg px-2 focus:outline-none focus:ring-1 focus:ring-ceara-verde/30 shrink-0"
        title="Fonte"
      >
        {FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>

      <Sep />

      {/* Bold, Italic, Underline, Strikethrough */}
      <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrito (Ctrl+B)">
        <b>N</b>
      </Btn>
      <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Itálico (Ctrl+I)">
        <i>I</i>
      </Btn>
      <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Sublinhado (Ctrl+U)">
        <u>S</u>
      </Btn>
      <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Tachado">
        <s>T</s>
      </Btn>
      <Btn active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Sobrescrito">
        x<sup className="text-[8px]">2</sup>
      </Btn>

      <Sep />

      {/* Highlight */}
      <Btn active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Destaque">
        <span className="bg-yellow-200 px-1 rounded text-[10px]">A</span>
      </Btn>

      <Sep />

      {/* Lists */}
      <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista com marcadores">
        &#8226;
      </Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">
        1.
      </Btn>
      <Btn active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Lista de verificação">
        &#9745;
      </Btn>

      <Sep />

      {/* Alignment */}
      <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Alinhar à esquerda">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="1.5"/><rect x="1" y="6" width="10" height="1.5"/><rect x="1" y="10" width="14" height="1.5"/><rect x="1" y="14" width="8" height="1.5"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centralizar">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="1.5"/><rect x="3" y="6" width="10" height="1.5"/><rect x="1" y="10" width="14" height="1.5"/><rect x="4" y="14" width="8" height="1.5"/></svg>
      </Btn>
      <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Alinhar à direita">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="1.5"/><rect x="5" y="6" width="10" height="1.5"/><rect x="1" y="10" width="14" height="1.5"/><rect x="7" y="14" width="8" height="1.5"/></svg>
      </Btn>

      <Sep />

      {/* Indent */}
      <Btn onClick={() => editor.chain().focus().sinkListItem("listItem").run()} title="Recuo à direita">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h14v1.5H1zM5 7h10v1.5H5zM5 11h10v1.5H5zM1 15h14v1.5H1zM1 6l3 2.5L1 11z"/></svg>
      </Btn>
      <Btn onClick={() => editor.chain().focus().liftListItem("listItem").run()} title="Recuo à esquerda">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h14v1.5H1zM5 7h10v1.5H5zM5 11h10v1.5H5zM1 15h14v1.5H1zM4 6L1 8.5 4 11z"/></svg>
      </Btn>

      <Sep />

      {/* Link */}
      <Btn active={editor.isActive("link")} onClick={setLink} title="Inserir link">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M6.354 5.354l-2 2a2.5 2.5 0 003.536 3.536l.707-.707-1.414-1.414-.707.707a.5.5 0 01-.708-.708l2-2a.5.5 0 01.708.708l-.708.707 1.415 1.414.707-.707a2.5 2.5 0 00-3.536-3.536zM9.646 10.646l2-2a2.5 2.5 0 00-3.536-3.536l-.707.707 1.414 1.414.707-.707a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708-.708l.708-.707-1.415-1.414-.707.707a2.5 2.5 0 003.536 3.536z"/></svg>
      </Btn>
      {editor.isActive("link") && (
        <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Remover link">
          <span className="text-red-500 text-[10px]">&#10005;</span>
        </Btn>
      )}
    </div>
  );
}
