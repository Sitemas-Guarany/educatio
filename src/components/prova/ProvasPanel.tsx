"use client";

import { useState, useCallback, useEffect } from "react";
import type { Prova, SubmissaoProva } from "@/types";
import { useAuth } from "@/lib/auth";
import { getProvasByProfessor, getStoredProvas, saveProvas, getSubmissoesByProva, getStoredSubmissoes, saveSubmissoes, calcularNotaAutomatica } from "@/lib/provas";
import { notificarProvaPublicada } from "@/lib/notificacoes";
import ProvaEditor from "./ProvaEditor";
import CorrecaoPanel from "./CorrecaoPanel";

const STATUS_BADGE: Record<string, string> = {
  rascunho: "bg-gray-100 text-gray-600",
  publicada: "bg-ceara-verde-light text-ceara-verde",
  encerrada: "bg-red-50 text-red-600",
};

export default function ProvasPanel() {
  const { user, alunosByProfessor } = useAuth();
  const [provas, setProvas] = useState<Prova[]>([]);
  const [editing, setEditing] = useState<Prova | null | "new">(null);
  const [viewingSubs, setViewingSubs] = useState<{ prova: Prova; subs: SubmissaoProva[] } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (user) setProvas(getProvasByProfessor(user.id));
  }, [user]);

  useEffect(reload, [reload, editing, viewingSubs]);

  const handleSave = useCallback((data: Pick<Prova, "titulo" | "materia" | "serie" | "sala" | "descricao" | "questoes" | "dataAplicacao" | "status">) => {
    if (!user) return;
    const all = getStoredProvas();
    const now = new Date().toISOString();
    if (editing && editing !== "new") {
      const idx = all.findIndex((p) => p.id === editing.id);
      if (idx >= 0) all[idx] = { ...all[idx], ...data, updatedAt: now };
    } else {
      all.push({ id: crypto.randomUUID(), professorId: user.id, escolaId: user.escolaId, ...data, createdAt: now, updatedAt: now });
    }
    saveProvas(all);
    // Notificar alunos quando prova é publicada
    if (data.status === "publicada") {
      const alunos = alunosByProfessor(user.id).filter((a) => a.serie === data.serie && (!data.sala || a.sala === data.sala));
      notificarProvaPublicada(alunos.map((a) => a.id), data.titulo);
    }
    setEditing(null);
  }, [user, editing]);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Excluir esta prova e todas as submissões?")) return;
    saveProvas(getStoredProvas().filter((p) => p.id !== id));
    saveSubmissoes(getStoredSubmissoes().filter((s) => s.provaId !== id));
    reload();
  }, [reload]);

  const handleToggleStatus = useCallback((p: Prova) => {
    const all = getStoredProvas();
    const idx = all.findIndex((x) => x.id === p.id);
    if (idx < 0) return;
    all[idx].status = p.status === "publicada" ? "encerrada" : "publicada";
    all[idx].updatedAt = new Date().toISOString();
    saveProvas(all);
    reload();
  }, [reload]);

  const handleViewSubs = useCallback((prova: Prova) => {
    const subs = getSubmissoesByProva(prova.id);
    setViewingSubs({ prova, subs });
  }, []);

  if (!user || (user.role !== "professor" && user.role !== "administrador")) return null;

  if (viewingSubs) {
    return <CorrecaoPanel prova={viewingSubs.prova} submissoes={viewingSubs.subs} onBack={() => setViewingSubs(null)} />;
  }

  if (editing) {
    return <ProvaEditor prova={editing === "new" ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="card p-4 space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <div>
            <h2 className="font-bold text-gray-800 text-sm">Provas</h2>
            <p className="text-xs text-gray-400">{provas.length} prova{provas.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={() => setEditing("new")} className="btn-primary text-xs px-4 py-2">
          + Nova prova
        </button>
      </div>

      {provas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-gray-500">Nenhuma prova criada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {provas.map((p) => {
            const subs = getSubmissoesByProva(p.id);
            return (
              <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.titulo}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                      <span>{p.materia}</span><span>·</span><span>{p.serie}º ano</span><span>·</span><span>{p.questoes.length} questões</span>
                      {subs.length > 0 && <><span>·</span><span className="text-ceara-verde font-semibold">{subs.length} resposta{subs.length > 1 ? "s" : ""}</span></>}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                </button>
                {expandedId === p.id && (
                  <div className="px-4 pb-3 border-t border-gray-100 pt-3 flex flex-wrap gap-2 animate-fade-up">
                    <button onClick={() => setEditing(p)} className="text-xs font-semibold text-ceara-verde bg-ceara-verde-light px-3 py-1.5 rounded-lg hover:bg-ceara-verde/20">Editar</button>
                    <button onClick={() => handleToggleStatus(p)} className="text-xs font-semibold text-ceara-azul bg-ceara-azul-light px-3 py-1.5 rounded-lg hover:bg-ceara-azul/20">
                      {p.status === "publicada" ? "Encerrar" : "Publicar"}
                    </button>
                    <button onClick={() => handleViewSubs(p)} className="text-xs font-semibold text-ceara-sol bg-ceara-amarelo-light px-3 py-1.5 rounded-lg hover:bg-ceara-amarelo/30">
                      Ver respostas ({subs.length})
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 ml-auto">Excluir</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
