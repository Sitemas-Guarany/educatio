"use client";

import { useState, useCallback } from "react";
import type { Prova, QuestaoProva, Serie } from "@/types";
import { maskDate, isValidDateBR } from "@/lib/utils";
import QuestaoEditor from "./QuestaoEditor";

const MATERIAS = ["Matemática", "Língua Portuguesa", "Ciências", "Geografia", "História", "Inglês"];
const SERIES: Serie[] = ["6", "7", "8", "9"];
const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

interface ProvaEditorProps {
  prova?: Prova | null;
  onSave: (data: Pick<Prova, "titulo" | "materia" | "serie" | "sala" | "descricao" | "questoes" | "dataAplicacao" | "status">) => void;
  onCancel: () => void;
}

function criarQuestao(): QuestaoProva {
  return { id: crypto.randomUUID(), tipo: "multipla_escolha", enunciado: "", pontos: 10, alternativas: ["", "", "", ""], respostaCorretaIndex: 0 };
}

export default function ProvaEditor({ prova, onSave, onCancel }: ProvaEditorProps) {
  const [titulo, setTitulo] = useState(prova?.titulo || "");
  const [materia, setMateria] = useState(prova?.materia || MATERIAS[0]);
  const [serie, setSerie] = useState<Serie>(prova?.serie || "6");
  const [dataAplicacao, setDataAplicacao] = useState(prova?.dataAplicacao || "");
  const [sala, setSala] = useState(prova?.sala || "");
  const [descricao, setDescricao] = useState(prova?.descricao || "");
  const [questoes, setQuestoes] = useState<QuestaoProva[]>(prova?.questoes?.length ? prova.questoes : [criarQuestao()]);

  const totalPontos = questoes.reduce((s, q) => s + q.pontos, 0);

  const updateQuestao = useCallback((idx: number, q: QuestaoProva) => {
    setQuestoes((prev) => prev.map((p, i) => (i === idx ? q : p)));
  }, []);

  const removeQuestao = useCallback((idx: number) => {
    setQuestoes((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSave = (status: "rascunho" | "publicada") => {
    if (!titulo.trim() || questoes.length === 0) {
      alert("A prova precisa ter um título e pelo menos 1 questão.");
      return;
    }
    // Validate each question
    for (let i = 0; i < questoes.length; i++) {
      const q = questoes[i];
      if (!q.enunciado.trim()) {
        alert(`Questão ${i + 1}: o enunciado não pode estar vazio.`);
        return;
      }
      if (q.tipo === "multipla_escolha") {
        const nonEmpty = (q.alternativas || []).filter((a) => a.trim().length > 0);
        if (nonEmpty.length < 2) {
          alert(`Questão ${i + 1}: precisa ter pelo menos 2 alternativas preenchidas.`);
          return;
        }
        if (q.respostaCorretaIndex == null || q.respostaCorretaIndex < 0 || q.respostaCorretaIndex >= (q.alternativas || []).length || !(q.alternativas || [])[q.respostaCorretaIndex]?.trim()) {
          alert(`Questão ${i + 1}: marque uma alternativa correta válida.`);
          return;
        }
      }
    }
    onSave({
      titulo: titulo.trim(),
      materia,
      serie,
      sala: sala || undefined,
      descricao: descricao.trim() || undefined,
      dataAplicacao: dataAplicacao && isValidDateBR(dataAplicacao) ? dataAplicacao : undefined,
      questoes,
      status,
    });
  };

  return (
    <div className="card overflow-hidden animate-scale-in">
      <div className="bg-ceara-azul text-white px-4 py-3 flex items-center gap-3">
        <span className="text-xl">📝</span>
        <div className="flex-1">
          <h2 className="font-bold text-sm">{prova ? "Editar Prova" : "Nova Prova"}</h2>
          <p className="text-white/70 text-[11px]">{questoes.length} questão(ões) · {totalPontos} pontos</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Metadados */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Data</label>
            <input type="text" inputMode="numeric" value={dataAplicacao} onChange={(e) => setDataAplicacao(maskDate(e.target.value))} placeholder="dd/mm/aaaa" maxLength={10} className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Série *</label>
            <select value={serie} onChange={(e) => setSerie(e.target.value as Serie)} className={inputClass}>
              {SERIES.map((s) => <option key={s} value={s}>{s}º ano</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Sala</label>
            <input type="text" value={sala} onChange={(e) => setSala(e.target.value)} placeholder="A, B, 1..." className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Matéria *</label>
            <select value={materia} onChange={(e) => setMateria(e.target.value)} className={inputClass}>
              {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Título da prova *</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Avaliação de frações — 1º bimestre" className={inputClass} />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Instruções <span className="font-normal text-gray-400">(opcional)</span></label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Instruções gerais para o aluno..." rows={2} className={`${inputClass} resize-none`} />
        </div>

        {/* Questões */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Questões</p>
          <div className="space-y-3">
            {questoes.map((q, i) => (
              <QuestaoEditor key={q.id} questao={q} index={i} onChange={(updated) => updateQuestao(i, updated)} onRemove={() => removeQuestao(i)} />
            ))}
          </div>
          <button type="button" onClick={() => setQuestoes([...questoes, criarQuestao()])} className="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-ceara-verde hover:text-ceara-verde transition-colors">
            + Adicionar questão
          </button>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={() => handleSave("rascunho")} disabled={!titulo.trim() || questoes.length === 0} className="px-4 py-2.5 rounded-xl bg-gray-600 text-white font-semibold text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors">
            Salvar rascunho
          </button>
          <button type="button" onClick={() => handleSave("publicada")} disabled={!titulo.trim() || questoes.length === 0} className="flex-1 py-2.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-[0.98] disabled:opacity-40 transition-all">
            Publicar prova
          </button>
        </div>
      </div>
    </div>
  );
}
