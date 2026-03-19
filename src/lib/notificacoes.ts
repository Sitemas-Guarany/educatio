import type { Notificacao } from "@/types";

const KEY = "educatio_notificacoes";

export function getNotificacoes(userId: string): Notificacao[] {
  try {
    const all: Notificacao[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    return all.filter((n) => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch { return []; }
}

export function addNotificacao(n: Omit<Notificacao, "id" | "lida" | "createdAt">) {
  try {
    const all: Notificacao[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    all.push({ ...n, id: crypto.randomUUID(), lida: false, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function marcarLida(id: string) {
  try {
    const all: Notificacao[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const idx = all.findIndex((n) => n.id === id);
    if (idx >= 0) { all[idx].lida = true; localStorage.setItem(KEY, JSON.stringify(all)); }
  } catch {}
}

export function marcarTodasLidas(userId: string) {
  try {
    const all: Notificacao[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    all.forEach((n) => { if (n.userId === userId) n.lida = true; });
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function contarNaoLidas(userId: string): number {
  return getNotificacoes(userId).filter((n) => !n.lida).length;
}

// Helpers para disparar notificações específicas
export function notificarProvaPublicada(alunoIds: string[], provaTitle: string) {
  alunoIds.forEach((id) => addNotificacao({ userId: id, tipo: "prova_publicada", titulo: "Nova prova!", descricao: provaTitle }));
}

export function notificarProvaEnviada(professorId: string, alunoNome: string, provaTitle: string) {
  addNotificacao({ userId: professorId, tipo: "prova_enviada", titulo: "Prova respondida", descricao: `${alunoNome} enviou: ${provaTitle}` });
}

export function notificarProvaCorrigida(alunoId: string, provaTitle: string, nota: string) {
  addNotificacao({ userId: alunoId, tipo: "prova_corrigida", titulo: "Prova corrigida!", descricao: `${provaTitle} — Nota: ${nota}` });
}

export function notificarProvaIncompleta(alunoId: string, provaTitle: string, respondidas: number, total: number) {
  addNotificacao({ userId: alunoId, tipo: "prova_publicada", titulo: "Prova incompleta", descricao: `${provaTitle} — ${respondidas}/${total} respondidas. Continue!` });
}

export function notificarMensagem(userId: string, autorNome: string) {
  addNotificacao({ userId, tipo: "mensagem", titulo: "Nova mensagem", descricao: `${autorNome} enviou uma mensagem` });
}

export function notificarPost(userId: string, autorNome: string, canal: string) {
  addNotificacao({ userId, tipo: "post", titulo: "Nova publicação", descricao: `${autorNome} publicou no mural ${canal}` });
}
