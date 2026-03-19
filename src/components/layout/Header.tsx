"use client";

import type { Serie, User } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  aluno: "Aluno",
  professor: "Professor",
  administrador: "Admin",
};

interface HeaderProps {
  overallProgress: number;
  serie: Serie;
  user?: User | null;
  onLogout?: () => void;
  onHelp?: () => void;
}

export default function Header({ overallProgress, serie, user, onLogout, onHelp }: HeaderProps) {
  return (
    <header className="bg-ceara-verde text-white">
      {/* Faixa decorativa amarela fina */}
      <div className="h-1 bg-ceara-amarelo" />

      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="flex items-start justify-between gap-4">
          {/* Título */}
          <div>
            <h1 className="text-display text-2xl font-bold leading-tight">
              Educatio
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              Recomposição da aprendizagem · {serie}º ano · BNCC & DCRC Ceará
            </p>
          </div>

          {/* User info + Logout */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold leading-tight">{user.nome.split(" ")[0]}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">{ROLE_LABELS[user.role] || user.role}</p>
                </div>
                <div className="flex gap-2">
                  {onHelp && (
                    <button
                      onClick={onHelp}
                      className="text-[10px] text-white/50 hover:text-white/90 transition-colors uppercase tracking-wider font-semibold"
                    >
                      Ajuda
                    </button>
                  )}
                  <span className="text-white/20">|</span>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-white/50 hover:text-white/90 transition-colors uppercase tracking-wider font-semibold"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="w-10 h-10 rounded-full bg-ceara-amarelo flex items-center justify-center text-ceara-verde font-bold text-lg shadow">
                CE
              </div>
            )}
          </div>
        </div>

        {/* Barra de progresso geral */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>Progresso geral</span>
            <span className="font-semibold text-white">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-ceara-amarelo rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Faixa decorativa azul fina */}
      <div className="h-1 bg-ceara-azul" />
    </header>
  );
}
