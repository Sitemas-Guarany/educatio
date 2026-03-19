import type { Prova, SubmissaoProva, Serie } from "@/types";

const PROVAS_KEY = "educatio_provas";
const SUBMISSOES_KEY = "educatio_submissoes";

export function getStoredProvas(): Prova[] {
  try { return JSON.parse(localStorage.getItem(PROVAS_KEY) || "[]"); }
  catch { return []; }
}
export function saveProvas(list: Prova[]) {
  localStorage.setItem(PROVAS_KEY, JSON.stringify(list));
}
export function getStoredSubmissoes(): SubmissaoProva[] {
  try { return JSON.parse(localStorage.getItem(SUBMISSOES_KEY) || "[]"); }
  catch { return []; }
}
export function saveSubmissoes(list: SubmissaoProva[]) {
  localStorage.setItem(SUBMISSOES_KEY, JSON.stringify(list));
}

export function getProvasByProfessor(professorId: string): Prova[] {
  return getStoredProvas().filter((p) => p.professorId === professorId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProvasPublicadas(serie: Serie, escolaId: string, sala?: string): Prova[] {
  return getStoredProvas().filter((p) => p.status === "publicada" && p.serie === serie && p.escolaId === escolaId && (!p.sala || !sala || p.sala === sala));
}

export function getSubmissoesByProva(provaId: string): SubmissaoProva[] {
  return getStoredSubmissoes().filter((s) => s.provaId === provaId);
}

export function getSubmissaoAluno(provaId: string, alunoId: string): SubmissaoProva | undefined {
  return getStoredSubmissoes().find((s) => s.provaId === provaId && s.alunoId === alunoId);
}

export function calcularNotaAutomatica(prova: Prova, submissao: SubmissaoProva): SubmissaoProva {
  const respostas = submissao.respostas.map((r) => {
    const q = prova.questoes.find((q) => q.id === r.questaoId);
    if (!q || q.tipo !== "multipla_escolha") return r;
    const correct = r.alternativaSelecionada === q.respostaCorretaIndex;
    return { ...r, nota: correct ? q.pontos : 0, autoCorrigida: true };
  });
  return { ...submissao, respostas };
}
