"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Superscript from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Placeholder } from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";
import { maskDate, isValidDateBR } from "@/lib/utils";
import type { Serie, PlanoAula } from "@/types";

const MATERIAS = ["Matemática", "Língua Portuguesa", "Ciências", "Geografia", "História", "Inglês"];
const SERIES: Serie[] = ["6", "7", "8", "9"];

interface PlanoAulaEditorProps {
  plano?: PlanoAula | null;
  onSave: (plano: Omit<PlanoAula, "id" | "professorId" | "escolaId" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  onAiHelp?: (context: string) => void;
}

const editorExtensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Underline,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Highlight.configure({ multicolor: false }),
  Link.configure({ openOnClick: false }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Superscript,
  TextStyle,
  FontFamily,
  Placeholder.configure({ placeholder: "Escreva o conteúdo da aula..." }),
];

export default function PlanoAulaEditor({ plano, onSave, onCancel, onAiHelp }: PlanoAulaEditorProps) {
  const [titulo, setTitulo] = useState(plano?.titulo || "");
  const [data, setData] = useState(plano?.data || "");
  const [serie, setSerie] = useState<Serie>(plano?.serie || "6");
  const [materia, setMateria] = useState(plano?.materia || MATERIAS[0]);
  const [notas, setNotas] = useState(plano?.notas || "");
  const [objetivos, setObjetivos] = useState(plano?.objetivos || "");

  const editor = useEditor({
    extensions: editorExtensions,
    content: plano?.conteudo || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-gray-700",
        spellcheck: "true",
      },
    },
  });

  const dateValid = data.length === 10 && isValidDateBR(data);

  const handleSave = useCallback(() => {
    if (!titulo.trim() || !data.trim() || !editor) return;
    onSave({
      data,
      titulo: titulo.trim(),
      serie,
      materia,
      objetivos: objetivos.trim() || undefined,
      conteudo: editor.getHTML(),
      notas: notas.trim() || undefined,
    });
  }, [titulo, data, serie, materia, objetivos, notas, editor, onSave]);

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

  return (
    <div className="card overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="bg-ceara-verde text-white px-4 py-3 flex items-center gap-3">
        <span className="text-xl">📋</span>
        <div className="flex-1">
          <h2 className="font-bold text-sm">{plano ? "Editar Plano de Aula" : "Novo Plano de Aula"}</h2>
          <p className="text-white/70 text-[11px]">Planejamento pedagógico detalhado</p>
        </div>
        {onAiHelp && (
          <button
            type="button"
            onClick={() => onAiHelp(`Plano de aula de ${materia} para o ${serie}º ano. Título: ${titulo || "(em branco)"}. Objetivos: ${objetivos || "(não definidos)"}.`)}
            className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            🤖 IA ajudar
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Metadados: Data + Série + Matéria */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Data *</label>
            <input
              type="text"
              inputMode="numeric"
              value={data}
              onChange={(e) => setData(maskDate(e.target.value))}
              placeholder="dd/mm/aaaa"
              maxLength={10}
              className={`${inputClass} ${data.length === 10 ? dateValid ? "border-emerald-400" : "border-red-400" : ""}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Série *</label>
            <select value={serie} onChange={(e) => setSerie(e.target.value as Serie)} className={inputClass}>
              {SERIES.map((s) => <option key={s} value={s}>{s}º ano</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Matéria *</label>
            <select value={materia} onChange={(e) => setMateria(e.target.value)} className={inputClass}>
              {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nome do plano de aula *</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Introdução às frações" className={inputClass} />
        </div>

        {/* Objetivos */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Objetivos <span className="font-normal text-gray-400">(opcional)</span></label>
          <textarea value={objetivos} onChange={(e) => setObjetivos(e.target.value)} placeholder="Objetivos de aprendizagem da aula..." rows={2} className={`${inputClass} resize-none`} />
        </div>

        {/* Editor de conteúdo principal */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Conteúdo da aula *</label>
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-ceara-verde/30 focus-within:border-ceara-verde transition-colors">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Notas / Observações <span className="font-normal text-gray-400">(opcional)</span></label>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Anotações pessoais, recursos necessários, adaptações..." rows={3} className={`${inputClass} resize-none`} />
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!titulo.trim() || !data.trim() || !dateValid || !editor?.getText().trim()}
            className="flex-1 py-2.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-[0.98] transition-all disabled:opacity-40"
          >
            Salvar plano
          </button>
        </div>
      </div>
    </div>
  );
}
