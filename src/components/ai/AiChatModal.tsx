"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import type { Serie } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiChatModalProps {
  open: boolean;
  onClose: () => void;
  subject: string;
  serie: Serie;
  topic?: string;
}

export default function AiChatModal({ open, onClose, subject, serie, topic }: AiChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Oi! Sou o tutor IA de **${subject}** (${serie}º ano)${topic ? ` — ${topic}` : ""}. Me pergunte qualquer dúvida!`,
      }]);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          subject,
          serie,
          topic,
          role: user?.role,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessages([...updated, { role: "assistant", content: data.text }]);
      }
    } catch {
      setError("Erro ao conectar com a IA.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="bg-ceara-verde text-white px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight">Tutor IA · {subject}</p>
            <p className="text-[11px] text-white/70">{serie}º ano{topic ? ` · ${topic}` : ""}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl font-bold px-1">
            &times;
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`relative group max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-ceara-verde text-white rounded-br-md"
                  : "bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm"
              }`}>
                {m.content}
                {m.role === "assistant" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(m.content);
                      setCopiedIdx(i);
                      setTimeout(() => setCopiedIdx(null), 1500);
                    }}
                    className="absolute -bottom-1 right-1 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 hover:text-ceara-verde bg-white border border-gray-200 rounded-md px-1.5 py-0.5 shadow-sm"
                    title="Copiar"
                  >
                    {copiedIdx === i ? "Copiado!" : "Copiar"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-400 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm shadow-sm">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center">
              <p className="text-xs text-red-500 font-semibold bg-red-50 inline-block px-3 py-1.5 rounded-lg">{error}</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 border-t border-gray-100 bg-white shrink-0 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Digite sua dúvida..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-95 transition-all disabled:opacity-40 shrink-0"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
