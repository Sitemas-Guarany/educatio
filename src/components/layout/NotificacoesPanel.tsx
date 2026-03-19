"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getNotificacoes, marcarLida, marcarTodasLidas, contarNaoLidas } from "@/lib/notificacoes";
import type { Notificacao } from "@/types";

const TIPO_ICONS: Record<string, string> = {
  prova_publicada: "📝",
  prova_enviada: "📨",
  prova_corrigida: "✅",
  mensagem: "💬",
  post: "📢",
};

interface NotificacoesBtnProps {
  onClick: () => void;
}

export function NotificacoesBadge({ onClick }: NotificacoesBtnProps) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const check = () => setCount(contarNaoLidas(user.id));
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <button onClick={onClick} className="relative text-[10px] text-white/50 hover:text-white/90 transition-colors uppercase tracking-wider font-semibold">
      Avisos
      {count > 0 && (
        <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-scale-in">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

interface NotificacoesPanelProps {
  onClose: () => void;
}

export default function NotificacoesPanel({ onClose }: NotificacoesPanelProps) {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notificacao[]>([]);

  useEffect(() => {
    if (user) setNotifs(getNotificacoes(user.id));
  }, [user]);

  const handleMarcarTodas = () => {
    if (!user) return;
    marcarTodasLidas(user.id);
    setNotifs(getNotificacoes(user.id));
  };

  const handleClick = (n: Notificacao) => {
    if (!n.lida) {
      marcarLida(n.id);
      setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, lida: true } : x));
    }
  };

  return (
    <div className="card overflow-hidden animate-scale-in">
      <div className="bg-ceara-sol text-white px-4 py-3 flex items-center gap-3">
        <span className="text-xl">🔔</span>
        <div className="flex-1">
          <h2 className="font-bold text-sm">Notificações</h2>
          <p className="text-white/70 text-[11px]">{notifs.filter((n) => !n.lida).length} não lida(s)</p>
        </div>
        <button onClick={handleMarcarTodas} className="text-[10px] text-white/70 hover:text-white font-semibold">Marcar todas como lidas</button>
        <button onClick={onClose} className="text-white/60 hover:text-white text-xl font-bold ml-2">&times;</button>
      </div>

      <div className="max-h-[50vh] overflow-y-auto divide-y divide-gray-50">
        {notifs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhuma notificação</p>
        ) : (
          notifs.slice(0, 30).map((n) => (
            <button key={n.id} onClick={() => handleClick(n)} className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${n.lida ? "bg-white" : "bg-ceara-amarelo-light/30"}`}>
              <span className="text-lg shrink-0 mt-0.5">{TIPO_ICONS[n.tipo] || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${n.lida ? "text-gray-600" : "text-gray-800 font-semibold"}`}>{n.titulo}</p>
                <p className="text-[11px] text-gray-400 truncate">{n.descricao}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{new Date(n.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              {!n.lida && <span className="w-2 h-2 rounded-full bg-ceara-sol shrink-0 mt-2" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
