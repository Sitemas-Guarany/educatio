"use client";

import { useState, useCallback, useEffect } from "react";
import type { PlanoAula, Serie } from "@/types";
import { useAuth } from "@/lib/auth";
import { calcAge } from "@/lib/utils";
import PlanoAulaEditor from "./PlanoAulaEditor";
import AiChatModal from "@/components/ai/AiChatModal";

const PLANOS_KEY = "educatio_planos";

function getStoredPlanos(): PlanoAula[] {
  try { return JSON.parse(localStorage.getItem(PLANOS_KEY) || "[]"); }
  catch { return []; }
}

function savePlanos(list: PlanoAula[]) {
  localStorage.setItem(PLANOS_KEY, JSON.stringify(list));
}

export default function PlanosAulaPanel() {
  const { user } = useAuth();
  const [planos, setPlanos] = useState<PlanoAula[]>([]);
  const [editing, setEditing] = useState<PlanoAula | null | "new">(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContext, setAiContext] = useState("");

  useEffect(() => {
    if (!user) return;
    const all = getStoredPlanos().filter((p) => p.professorId === user.id);
    setPlanos(all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }, [user, editing]);

  const handleSave = useCallback((data: Omit<PlanoAula, "id" | "professorId" | "escolaId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    const all = getStoredPlanos();
    const now = new Date().toISOString();

    if (editing && editing !== "new") {
      // Update
      const idx = all.findIndex((p) => p.id === editing.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...data, updatedAt: now };
      }
    } else {
      // Create
      all.push({
        id: crypto.randomUUID(),
        professorId: user.id,
        escolaId: user.escolaId,
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    }

    savePlanos(all);
    setEditing(null);
  }, [user, editing]);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Excluir este plano de aula?")) return;
    const all = getStoredPlanos().filter((p) => p.id !== id);
    savePlanos(all);
    setPlanos(all.filter((p) => p.professorId === user?.id));
    setExpandedId(null);
  }, [user]);

  const handleAiHelp = useCallback((context: string) => {
    setAiContext(context);
    setAiOpen(true);
  }, []);

  if (!user || (user.role !== "professor" && user.role !== "administrador")) return null;

  // Editor mode
  if (editing) {
    return (
      <>
        <PlanoAulaEditor
          plano={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          onAiHelp={handleAiHelp}
        />
        <AiChatModal
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          subject="Plano de Aula"
          serie={(editing !== "new" ? editing?.serie : "6") || "6"}
          topic={aiContext}
        />
      </>
    );
  }

  // List mode
  return (
    <div className="card p-4 space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <div>
            <h2 className="font-bold text-gray-800 text-sm">Planos de Aula</h2>
            <p className="text-xs text-gray-400">{planos.length} plano{planos.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={() => setEditing("new")} className="btn-primary text-xs px-4 py-2">
          + Novo plano
        </button>
      </div>

      {planos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm text-gray-500">Nenhum plano de aula ainda.</p>
          <p className="text-xs text-gray-400 mt-1">Crie seu primeiro plano de aula com ajuda da IA!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {planos.map((p) => (
            <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Card header */}
              <button
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.titulo}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                    <span>{p.data}</span>
                    <span>·</span>
                    <span>{p.materia}</span>
                    <span>·</span>
                    <span>{p.serie}º ano</span>
                  </div>
                </div>
                <span className={`text-gray-400 transition-transform ${expandedId === p.id ? "rotate-180" : ""}`}>
                  &#9662;
                </span>
              </button>

              {/* Expanded content */}
              {expandedId === p.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3 animate-fade-up">
                  {p.objetivos && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Objetivos</p>
                      <p className="text-xs text-gray-600">{p.objetivos}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Conteúdo</p>
                    <div className="prose prose-sm max-w-none text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: p.conteudo }} />
                  </div>
                  {p.notas && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notas</p>
                      <p className="text-xs text-gray-500 italic">{p.notas}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditing(p)} className="text-xs font-semibold text-ceara-verde bg-ceara-verde-light px-3 py-1.5 rounded-lg hover:bg-ceara-verde/20 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      Excluir
                    </button>
                    <button onClick={() => handleAiHelp(`Plano: ${p.titulo}. Matéria: ${p.materia}. Série: ${p.serie}º ano.`)} className="text-xs font-semibold text-ceara-azul bg-ceara-azul-light px-3 py-1.5 rounded-lg hover:bg-ceara-azul/20 transition-colors ml-auto">
                      🤖 IA
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AiChatModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        subject="Plano de Aula"
        serie="6"
        topic={aiContext}
      />
    </div>
  );
}
