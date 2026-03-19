"use client";

import { useState } from "react";
import type { QuestaoProva, TipoQuestao } from "@/types";

const TIPOS: { value: TipoQuestao; label: string; icon: string }[] = [
  { value: "multipla_escolha", label: "Múltipla escolha", icon: "🔘" },
  { value: "dissertativa", label: "Dissertativa", icon: "📝" },
  { value: "calculo", label: "Cálculo", icon: "🧮" },
];

const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

interface QuestaoEditorProps {
  questao: QuestaoProva;
  index: number;
  onChange: (q: QuestaoProva) => void;
  onRemove: () => void;
}

export default function QuestaoEditor({ questao, index, onChange, onRemove }: QuestaoEditorProps) {
  const update = (partial: Partial<QuestaoProva>) => onChange({ ...questao, ...partial });

  const addAlternativa = () => {
    const alts = [...(questao.alternativas || []), ""];
    update({ alternativas: alts });
  };

  const updateAlternativa = (i: number, text: string) => {
    const alts = [...(questao.alternativas || [])];
    alts[i] = text;
    update({ alternativas: alts });
  };

  const removeAlternativa = (i: number) => {
    const alts = (questao.alternativas || []).filter((_, j) => j !== i);
    const correct = questao.respostaCorretaIndex === i ? undefined : questao.respostaCorretaIndex !== undefined && questao.respostaCorretaIndex > i ? questao.respostaCorretaIndex - 1 : questao.respostaCorretaIndex;
    update({ alternativas: alts, respostaCorretaIndex: correct });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500">Questão {index + 1}</p>
        <button type="button" onClick={onRemove} className="text-[11px] text-red-500 font-semibold hover:underline">
          Remover
        </button>
      </div>

      {/* Tipo + Pontos */}
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-3">
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tipo *</label>
          <div className="flex gap-1.5">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update({ tipo: t.value })}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                  questao.tipo === t.value ? "bg-ceara-verde text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Pontos</label>
          <input
            type="number"
            min={1}
            value={questao.pontos}
            onChange={(e) => update({ pontos: Math.max(1, parseInt(e.target.value) || 1) })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Enunciado */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Enunciado *</label>
        <textarea
          value={questao.enunciado}
          onChange={(e) => update({ enunciado: e.target.value })}
          placeholder="Escreva o enunciado da questão..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Múltipla escolha: alternativas */}
      {questao.tipo === "multipla_escolha" && (
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-gray-500">Alternativas *</label>
          {(questao.alternativas || []).map((alt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update({ respostaCorretaIndex: i })}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  questao.respostaCorretaIndex === i ? "border-ceara-verde bg-ceara-verde text-white" : "border-gray-300 hover:border-ceara-verde"
                }`}
                title="Marcar como correta"
              >
                {questao.respostaCorretaIndex === i && <span className="text-[10px]">✓</span>}
              </button>
              <span className="text-xs font-bold text-gray-400 w-5">{String.fromCharCode(65 + i)})</span>
              <input
                type="text"
                value={alt}
                onChange={(e) => updateAlternativa(i, e.target.value)}
                placeholder={`Alternativa ${String.fromCharCode(65 + i)}`}
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={() => removeAlternativa(i)} className="text-red-400 hover:text-red-600 text-lg px-1">
                &times;
              </button>
            </div>
          ))}
          <button type="button" onClick={addAlternativa} className="text-xs font-semibold text-ceara-verde hover:underline">
            + Adicionar alternativa
          </button>
        </div>
      )}

      {/* Cálculo: instrução sobre o que mostrar */}
      {questao.tipo === "calculo" && (
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1">
            Instruções para o aluno <span className="font-normal text-gray-400">(o que deve ser mostrado no cálculo)</span>
          </label>
          <textarea
            value={questao.descricaoCalculo || ""}
            onChange={(e) => update({ descricaoCalculo: e.target.value })}
            placeholder="Ex: Mostre todos os passos da resolução, incluindo as operações intermediárias."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      )}
    </div>
  );
}
