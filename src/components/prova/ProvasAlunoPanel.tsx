"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import type { Prova, SubmissaoProva, RespostaQuestao, Serie } from "@/types";
import { useAuth } from "@/lib/auth";
import { getProvasPublicadas, getSubmissaoAluno, getStoredSubmissoes, saveSubmissoes, calcularNotaAutomatica, getStoredProvas } from "@/lib/provas";
import EditorToolbar from "@/components/planoaula/EditorToolbar";

const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

// Mini editor for dissertativa/calculo answers
function MiniEditor({ content, onChange, placeholder }: { content: string; onChange: (html: string) => void; placeholder: string }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Placeholder.configure({ placeholder })],
    content,
    editorProps: { attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2 text-gray-700 text-sm", spellcheck: "true" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-ceara-verde/30">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

interface ProvasAlunoPanelProps {
  serie: Serie;
}

export default function ProvasAlunoPanel({ serie }: ProvasAlunoPanelProps) {
  const { user } = useAuth();
  const [provas, setProvas] = useState<Prova[]>([]);
  const [realizando, setRealizando] = useState<Prova | null>(null);
  const [respostas, setRespostas] = useState<RespostaQuestao[]>([]);
  const [resultado, setResultado] = useState<SubmissaoProva | null>(null);

  useEffect(() => {
    if (user) setProvas(getProvasPublicadas(serie, user.escolaId, user.sala));
  }, [serie, user, realizando, resultado]);

  const getStatus = (provaId: string): string => {
    if (!user) return "";
    const sub = getSubmissaoAluno(provaId, user.id);
    if (!sub) return "pendente";
    return sub.status;
  };

  const iniciarProva = (prova: Prova) => {
    if (!user) return;
    const existente = getSubmissaoAluno(prova.id, user.id);
    if (existente && existente.status !== "em_andamento") return;
    const resp = existente?.respostas || prova.questoes.map((q) => ({
      questaoId: q.id, tipo: q.tipo,
    }));
    setRespostas(resp);
    setRealizando(prova);
  };

  const verResultado = (prova: Prova) => {
    if (!user) return;
    const sub = getSubmissaoAluno(prova.id, user.id);
    if (sub?.status === "corrigida") setResultado(sub);
  };

  const updateResposta = useCallback((questaoId: string, partial: Partial<RespostaQuestao>) => {
    setRespostas((prev) => prev.map((r) => r.questaoId === questaoId ? { ...r, ...partial } : r));
  }, []);

  const enviarProva = useCallback(() => {
    if (!user || !realizando || !confirm("Enviar a prova? Não poderá alterar depois.")) return;
    const all = getStoredSubmissoes();
    const existente = all.findIndex((s) => s.provaId === realizando.id && s.alunoId === user.id);
    const now = new Date().toISOString();
    let sub: SubmissaoProva = {
      id: existente >= 0 ? all[existente].id : crypto.randomUUID(),
      provaId: realizando.id,
      alunoId: user.id,
      respostas,
      status: "enviada",
      enviadoEm: now,
      notaMaxima: realizando.questoes.reduce((s, q) => s + q.pontos, 0),
      createdAt: existente >= 0 ? all[existente].createdAt : now,
      updatedAt: now,
    };
    sub = calcularNotaAutomatica(realizando, sub);
    if (existente >= 0) all[existente] = sub;
    else all.push(sub);
    saveSubmissoes(all);
    setRealizando(null);
  }, [user, realizando, respostas]);

  // Auto-save with 2-second debounce
  useEffect(() => {
    if (!realizando || !user) return;
    const timer = setTimeout(() => {
      const all = getStoredSubmissoes();
      const now = new Date().toISOString();
      const existente = all.findIndex((s) => s.provaId === realizando.id && s.alunoId === user.id);
      const sub: SubmissaoProva = {
        id: existente >= 0 ? all[existente].id : crypto.randomUUID(),
        provaId: realizando.id, alunoId: user.id, respostas, status: "em_andamento",
        notaMaxima: realizando.questoes.reduce((s, q) => s + q.pontos, 0),
        createdAt: existente >= 0 ? all[existente].createdAt : now, updatedAt: now,
      };
      if (existente >= 0) all[existente] = sub; else all.push(sub);
      saveSubmissoes(all);
    }, 2000);
    return () => clearTimeout(timer);
  }, [respostas]);

  if (!user || user.role !== "aluno") return null;

  // Resultado
  if (resultado) {
    const prova = getStoredProvas().find((p) => p.id === resultado.provaId);
    return (
      <div className="card p-4 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800 text-sm">{prova?.titulo || "Prova"}</h2>
            <p className="text-xs text-gray-400">Nota: <span className="font-bold text-ceara-verde">{resultado.notaTotal}/{resultado.notaMaxima}</span></p>
          </div>
          <button onClick={() => setResultado(null)} className="text-xs font-semibold text-gray-500">← Voltar</button>
        </div>
        {prova?.questoes.map((q, i) => {
          const r = resultado.respostas.find((r) => r.questaoId === q.id);
          return (
            <div key={q.id} className="border border-gray-100 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-gray-500">Questão {i + 1} · {r?.nota ?? 0}/{q.pontos} pts</p>
              <p className="text-sm text-gray-700">{q.enunciado}</p>
              {r?.comentario && <p className="text-xs text-ceara-azul bg-ceara-azul-light px-3 py-1.5 rounded-lg">💬 {r.comentario}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  // Realizando prova
  if (realizando) {
    return (
      <div className="card overflow-hidden animate-scale-in">
        <div className="bg-ceara-azul text-white px-4 py-3">
          <h2 className="font-bold text-sm">{realizando.titulo}</h2>
          <p className="text-white/70 text-[11px]">{realizando.materia} · {realizando.questoes.length} questões</p>
        </div>
        {realizando.descricao && <p className="px-4 pt-3 text-xs text-gray-500 italic">{realizando.descricao}</p>}
        <div className="p-4 space-y-4">
          {realizando.questoes.map((q, i) => {
            const resp = respostas.find((r) => r.questaoId === q.id);
            return (
              <div key={q.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500">Questão {i + 1} · {q.pontos} pts</p>
                  <span className="text-[10px] font-semibold text-gray-400">{q.tipo === "multipla_escolha" ? "Múltipla escolha" : q.tipo === "calculo" ? "Cálculo" : "Dissertativa"}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{q.enunciado}</p>

                {q.tipo === "multipla_escolha" && (
                  <div className="space-y-1.5">
                    {(q.alternativas || []).map((alt, j) => (
                      <button key={j} onClick={() => updateResposta(q.id, { alternativaSelecionada: j })}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                          resp?.alternativaSelecionada === j ? "border-ceara-verde bg-ceara-verde-light font-semibold text-ceara-verde" : "border-gray-200 text-gray-700 hover:border-ceara-verde/40"
                        }`}>
                        <span className="text-xs text-gray-400 mr-2">{String.fromCharCode(65 + j)})</span>{alt}
                      </button>
                    ))}
                  </div>
                )}

                {q.tipo === "dissertativa" && (
                  <MiniEditor content={resp?.textoResposta || ""} onChange={(html) => updateResposta(q.id, { textoResposta: html })} placeholder="Escreva sua resposta..." />
                )}

                {q.tipo === "calculo" && (
                  <div className="space-y-2">
                    {q.descricaoCalculo && <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">📐 {q.descricaoCalculo}</p>}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Resposta final</label>
                      <input type="text" value={resp?.respostaCalculo || ""} onChange={(e) => updateResposta(q.id, { respostaCalculo: e.target.value })} placeholder="Ex: x = 42" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Mostre seus cálculos / raciocínio</label>
                      <MiniEditor content={resp?.descricaoPassos || ""} onChange={(html) => updateResposta(q.id, { descricaoPassos: html })} placeholder="Descreva os passos da resolução..." />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex gap-2 pt-2">
            <button onClick={() => setRealizando(null)} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">Sair (salva progresso)</button>
            <button onClick={enviarProva} className="flex-1 py-2.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-[0.98] transition-all">
              Enviar prova
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lista de provas
  return (
    <div className="card p-4 space-y-4 animate-scale-in">
      <div className="flex items-center gap-2">
        <span className="text-xl">📝</span>
        <h2 className="font-bold text-gray-800 text-sm">Provas disponíveis</h2>
      </div>
      {provas.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-6">Nenhuma prova disponível.</p>
      ) : (
        <div className="space-y-2">
          {provas.map((p) => {
            const status = getStatus(p.id);
            return (
              <div key={p.id} className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.titulo}</p>
                  <p className="text-[11px] text-gray-400">{p.materia} · {p.questoes.length} questões{p.dataAplicacao ? ` · ${p.dataAplicacao}` : ""}</p>
                </div>
                {status === "corrigida" ? (
                  <button onClick={() => verResultado(p)} className="text-xs font-bold text-ceara-verde bg-ceara-verde-light px-3 py-1.5 rounded-lg">Ver nota</button>
                ) : status === "enviada" ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">Enviada</span>
                ) : (
                  <button onClick={() => iniciarProva(p)} className="text-xs font-bold text-white bg-ceara-verde px-3 py-1.5 rounded-lg hover:bg-ceara-verde-mid active:scale-95 transition-all">
                    {status === "em_andamento" ? "Continuar" : "Iniciar"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
