"use client";

import { useState, useEffect } from "react";
import type { Serie } from "@/types";
import { SUBJECTS_BY_SERIE } from "@/lib/data";
import { calcOverallProgress } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import AuthPage from "@/components/auth/AuthPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StatsBar from "@/components/dashboard/StatsBar";
import SerieSelector from "@/components/dashboard/SerieSelector";
import SubjectGrid from "@/components/dashboard/SubjectGrid";
import TopicsPanel from "@/components/dashboard/TopicsPanel";
import QuizPanel from "@/components/quiz/QuizPanel";
import ImportAlunos from "@/components/admin/ImportAlunos";
import PlanosAulaPanel from "@/components/planoaula/PlanosAulaPanel";
import ProvasPanel from "@/components/prova/ProvasPanel";
import ProvasAlunoPanel from "@/components/prova/ProvasAlunoPanel";
import AjudaPanel from "@/components/layout/AjudaPanel";

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const [serie, setSerie]         = useState<Serie>("6");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [showAjuda, setShowAjuda] = useState(false);
  const [points, setPoints]       = useState(0);
  const [done, setDone]           = useState(0);
  const [streak]                  = useState(0);

  // Set initial serie from user profile
  useEffect(() => {
    if (user?.serie) setSerie(user.serie);
  }, [user?.serie]);

  // Load stats from localStorage on mount
  useEffect(() => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(`educatio_stats_${user.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.points === "number") setPoints(parsed.points);
        if (typeof parsed.done === "number") setDone(parsed.done);
      }
    } catch {}
  }, [user]);

  // Save stats to localStorage when points/done change
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`educatio_stats_${user.id}`, JSON.stringify({ points, done }));
  }, [user, points, done]);

  const subjects = SUBJECTS_BY_SERIE[serie];
  const activeSubject = subjects.find((s) => s.id === subjectId) ?? null;
  const overallProgress = calcOverallProgress(subjects);

  function handleSerieChange(s: Serie) {
    setSerie(s);
    setSubjectId(null);
  }

  function handleCorrectAnswer() {
    setPoints((p) => p + 20);
    setDone((d) => d + 1);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header overallProgress={overallProgress} serie={serie} user={user} onLogout={logout} onHelp={() => setShowAjuda(true)} />

      <main className="max-w-2xl mx-auto px-4 pb-16 pt-4 space-y-5">
        {/* Ajuda */}
        {showAjuda && (
          <AjudaPanel onClose={() => setShowAjuda(false)} />
        )}

        {/* Stats */}
        <StatsBar points={points} done={done} streak={streak} />

        {/* Seletor de série — professor/admin veem todas, aluno vê só a sua */}
        {user.role !== "aluno" || !user.serie ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Selecione a série
            </p>
            <SerieSelector value={serie} onChange={handleSerieChange} />
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-ceara-verde-light rounded-xl px-4 py-2.5">
            <span className="text-lg font-bold text-ceara-verde">{serie}º ano</span>
            <span className="text-xs text-ceara-verde/70">Sua série</span>
          </div>
        )}

        {/* Grade de matérias */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Matérias — {serie}º ano
          </p>
          <SubjectGrid
            subjects={subjects}
            activeId={subjectId}
            onSelect={setSubjectId}
          />
        </div>

        {/* Tópicos */}
        {activeSubject && (
          <TopicsPanel subject={activeSubject} serie={serie} />
        )}

        {/* Quiz */}
        {activeSubject && (
          <QuizPanel
            subjectId={activeSubject.id}
            subjectName={activeSubject.name}
            serie={serie}
            onCorrect={handleCorrectAnswer}
          />
        )}
        {/* Provas — professor/admin */}
        {(user.role === "professor" || user.role === "administrador") && (
          <ProvasPanel />
        )}

        {/* Provas — aluno */}
        {user.role === "aluno" && (
          <ProvasAlunoPanel serie={serie} />
        )}

        {/* Planos de aula — professor/admin */}
        {(user.role === "professor" || user.role === "administrador") && (
          <PlanosAulaPanel />
        )}

        {/* Importar alunos — professor/admin */}
        {(user.role === "professor" || user.role === "administrador") && (
          <ImportAlunos />
        )}
      </main>

      <Footer />
    </div>
  );
}
