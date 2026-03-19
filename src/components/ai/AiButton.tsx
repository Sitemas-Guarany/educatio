"use client";

import { useState } from "react";
import type { Serie } from "@/types";
import AiChatModal from "./AiChatModal";

interface AiButtonProps {
  subject: string;
  serie: Serie;
  topic?: string;
  className?: string;
}

export default function AiButton({ subject, serie, topic, className }: AiButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-ceara-azul/10 text-ceara-azul hover:bg-ceara-azul/20 active:scale-95 transition-all ${className || ""}`}
        title={`Perguntar à IA sobre ${subject}${topic ? ` · ${topic}` : ""}`}
      >
        🤖 Perguntar à IA
      </button>
      <AiChatModal
        open={open}
        onClose={() => setOpen(false)}
        subject={subject}
        serie={serie}
        topic={topic}
      />
    </>
  );
}
