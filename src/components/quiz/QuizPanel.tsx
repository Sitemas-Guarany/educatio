"use client";

import { useState, useCallback, useMemo } from "react";
import type { Serie } from "@/types";
import { QUIZ_QUESTIONS } from "@/lib/data";
import { cn, shuffle } from "@/lib/utils";
import AiButton from "@/components/ai/AiButton";

interface QuizPanelProps {
  subjectId: string;
  subjectName?: string;
  serie: Serie;
  onCorrect: () => void;
}

type AnswerState = "idle" | "correct" | "wrong";

export default function QuizPanel({ subjectId, subjectName, serie, onCorrect }: QuizPanelProps) {
  const pool = useMemo(
    () => shuffle(QUIZ_QUESTIONS.filter((q) => q.subjectId === subjectId && q.serie === serie)),
    [subjectId, serie]
  );

  const [qIndex, setQIndex]         = useState(0);
  const [selected, setSelected]     = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");

  const question = pool[qIndex % pool.length];

  const handleAnswer = useCallback(
    (idx: number) => {
      if (answerState !== "idle") return;
      setSelected(idx);
      const correct = idx === question.correctIndex;
      setAnswerState(correct ? "correct" : "wrong");
      if (correct) onCorrect();
    },
    [answerState, question, onCorrect]
  );

  function next() {
    setQIndex((i) => i + 1);
    setSelected(null);
    setAnswerState("idle");
  }

  if (!question) return (
    <div className="card p-4 animate-scale-in">
      <p className="text-sm text-gray-400 text-center py-4">Nenhuma questão disponível para esta matéria</p>
    </div>
  );

  return (
    <div className="card p-4 animate-scale-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-ceara-azul">
          Questão rápida
        </p>
        {question.bnccSkill && (
          <span className="badge-bncc">{question.bnccSkill}</span>
        )}
      </div>

      {/* Pergunta */}
      <p className="text-base font-medium text-gray-800 leading-relaxed mb-4">
        {question.question}
      </p>

      {/* Opções */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect  = i === question.correctIndex;

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answerState !== "idle"}
              className={cn(
                "text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150",
                "disabled:cursor-default",
                // idle
                answerState === "idle" &&
                  "bg-white border-gray-200 text-gray-700 hover:border-ceara-verde/40 hover:bg-ceara-verde-light/40 active:scale-95",
                // correto
                answerState !== "idle" && isCorrect &&
                  "bg-ceara-verde-light border-ceara-verde text-ceara-verde font-semibold",
                // errado — apenas o selecionado fica vermelho
                answerState !== "idle" && isSelected && !isCorrect &&
                  "bg-red-50 border-red-400 text-red-700",
                // outras opções após resposta
                answerState !== "idle" && !isSelected && !isCorrect &&
                  "opacity-40"
              )}
            >
              <span className="mr-2 text-xs text-gray-400">
                {String.fromCharCode(65 + i)})
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answerState !== "idle" && (
        <div
          className={cn(
            "mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed animate-fade-up",
            answerState === "correct"
              ? "bg-ceara-verde-light text-ceara-verde border border-ceara-verde/20"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
        >
          <span className="font-semibold mr-1">
            {answerState === "correct" ? "✓ Correto!" : "✗ Não foi dessa vez."}
          </span>
          {question.explanation}
        </div>
      )}

      {/* Ação */}
      {answerState !== "idle" && (
        <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
          {answerState === "correct" ? (
            <span className="text-sm font-semibold text-ceara-amarelo">
              +20 pontos ⭐
            </span>
          ) : (
            <AiButton
              subject={subjectName || subjectId}
              serie={serie}
              topic={question.question}
              className="text-[11px]"
            />
          )}
          <button onClick={next} className="btn-primary ml-auto">
            Próxima questão →
          </button>
        </div>
      )}
    </div>
  );
}
