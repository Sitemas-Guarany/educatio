"use client";

import { useState, useCallback } from "react";
import type { Prova, SubmissaoProva, RespostaQuestao } from "@/types";
import { useAuth } from "@/lib/auth";
import { getStoredSubmissoes, saveSubmissoes } from "@/lib/provas";

const inputClass = "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

interface CorrecaoPanelProps {
  prova: Prova;
  submissoes: SubmissaoProva[];
  onBack: () => void;
}

export default function CorrecaoPanel({ prova, submissoes, onBack }: CorrecaoPanelProps) {
  const { allUsers } = useAuth();
  const [selectedSub, setSelectedSub] = useState<SubmissaoProva | null>(null);
  const [notas, setNotas] = useState<Record<string, number>>({});
  const [comentarios, setComentarios] = useState<Record<string, string>>({});
  const users = allUsers();

  const getAluno = (id: string) => users.find((u) => u.id === id);

  const openSubmissao = (sub: SubmissaoProva) => {
    setSelectedSub(sub);
    const n: Record<string, number> = {};
    const c: Record<string, string> = {};
    sub.respostas.forEach((r) => { if (r.nota !== undefined) n[r.questaoId] = r.nota; if (r.comentario) c[r.questaoId] = r.comentario; });
    setNotas(n);
    setComentarios(c);
  };

  const handleFinalizarCorrecao = useCallback(() => {
    if (!selectedSub) return;
    const all = getStoredSubmissoes();
    const idx = all.findIndex((s) => s.id === selectedSub.id);
    if (idx < 0) return;
    const respostas = all[idx].respostas.map((r) => ({
      ...r,
      nota: notas[r.questaoId] ?? r.nota ?? 0,
      comentario: comentarios[r.questaoId] || r.comentario,
    }));
    const notaTotal = respostas.reduce((s, r) => s + (r.nota || 0), 0);
    const notaMaxima = prova.questoes.reduce((s, q) => s + q.pontos, 0);
    all[idx] = { ...all[idx], respostas, notaTotal, notaMaxima, status: "corrigida", corrigidoEm: new Date().toISOString(), updatedAt: new Date().toISOString() };
    saveSubmissoes(all);
    setSelectedSub(null);
  }, [selectedSub, notas, comentarios, prova]);

  // Corrigindo uma submissão individual
  if (selectedSub) {
    const aluno = getAluno(selectedSub.alunoId);
    return (
      <div className="card overflow-hidden animate-scale-in">
        <div className="bg-ceara-sol text-white px-4 py-3 flex items-center gap-3">
          <span className="text-xl">✏️</span>
          <div className="flex-1">
            <h2 className="font-bold text-sm">Correção — {aluno?.nomeCompleto || aluno?.nome || "Aluno"}</h2>
            <p className="text-white/80 text-[11px]">{prova.titulo} · {prova.materia}</p>
          </div>
          <button onClick={() => setSelectedSub(null)} className="text-white/70 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <div className="p-4 space-y-4">
          {prova.questoes.map((q, i) => {
            const resp = selectedSub.respostas.find((r) => r.questaoId === q.id);
            const isAuto = resp?.autoCorrigida;
            return (
              <div key={q.id} className="border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500">Questão {i + 1} · {q.tipo === "multipla_escolha" ? "Múltipla escolha" : q.tipo === "calculo" ? "Cálculo" : "Dissertativa"} · {q.pontos} pts</p>
                  {isAuto && <span className="text-[10px] bg-ceara-verde-light text-ceara-verde px-2 py-0.5 rounded-lg font-bold">Auto-corrigida</span>}
                </div>
                <p className="text-sm text-gray-700">{q.enunciado}</p>

                {/* Resposta do aluno */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Resposta do aluno</p>
                  {q.tipo === "multipla_escolha" && (
                    <div className="space-y-1">
                      {(q.alternativas || []).map((alt, j) => (
                        <div key={j} className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                          j === q.respostaCorretaIndex ? "bg-ceara-verde-light text-ceara-verde font-semibold" :
                          j === resp?.alternativaSelecionada && j !== q.respostaCorretaIndex ? "bg-red-50 text-red-600" : "text-gray-600"
                        }`}>
                          <span>{j === resp?.alternativaSelecionada ? "●" : "○"}</span>
                          <span>{String.fromCharCode(65 + j)}) {alt}</span>
                          {j === q.respostaCorretaIndex && <span className="ml-auto text-[10px]">✓ correta</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.tipo === "dissertativa" && (
                    <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: resp?.textoResposta || "<em>Sem resposta</em>" }} />
                  )}
                  {q.tipo === "calculo" && (
                    <>
                      <p className="text-sm font-semibold text-gray-700">Resposta: {resp?.respostaCalculo || "—"}</p>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cálculos / raciocínio do aluno</p>
                        <div className="text-sm text-gray-700 prose prose-sm max-w-none bg-white rounded-lg p-2 border border-gray-100" dangerouslySetInnerHTML={{ __html: resp?.descricaoPassos || "<em>Nenhum cálculo descrito</em>" }} />
                      </div>
                    </>
                  )}
                </div>

                {/* Nota + Comentário do professor */}
                {!isAuto && (
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Nota (0-{q.pontos})</label>
                      <input type="number" min={0} max={q.pontos} value={notas[q.id] ?? ""} onChange={(e) => setNotas({ ...notas, [q.id]: Math.min(q.pontos, Math.max(0, parseInt(e.target.value) || 0)) })} className={inputClass} />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Comentário</label>
                      <input type="text" value={comentarios[q.id] || ""} onChange={(e) => setComentarios({ ...comentarios, [q.id]: e.target.value })} placeholder="Feedback para o aluno..." className={inputClass} />
                    </div>
                  </div>
                )}
                {isAuto && (
                  <p className="text-xs text-ceara-verde font-semibold">Nota: {resp?.nota}/{q.pontos}</p>
                )}
              </div>
            );
          })}
          <div className="flex gap-2 pt-2">
            <button onClick={() => setSelectedSub(null)} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">Voltar</button>
            <button onClick={handleFinalizarCorrecao} className="flex-1 py-2.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-[0.98] transition-all">
              Finalizar correção
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lista de submissões
  return (
    <div className="card p-4 space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-sm">{prova.titulo}</h2>
          <p className="text-xs text-gray-400">{prova.materia} · {prova.serie}º ano · {submissoes.length} resposta{submissoes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={onBack} className="text-xs font-semibold text-gray-500 hover:text-gray-700">← Voltar</button>
      </div>

      {submissoes.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-6">Nenhum aluno respondeu ainda.</p>
      ) : (
        <div className="space-y-2">
          {submissoes.map((sub) => {
            const aluno = getAluno(sub.alunoId);
            return (
              <button key={sub.id} onClick={() => openSubmissao(sub)} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-xl text-left hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{aluno?.nomeCompleto || aluno?.nome || "Aluno"}</p>
                  <p className="text-[11px] text-gray-400">{aluno?.matricula || ""}</p>
                </div>
                {sub.status === "corrigida" ? (
                  <span className="text-xs font-bold text-ceara-verde bg-ceara-verde-light px-2 py-1 rounded-lg">{sub.notaTotal}/{sub.notaMaxima}</span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">{sub.status === "enviada" ? "Aguardando correção" : "Em andamento"}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
