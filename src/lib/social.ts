import type { Post, Comentario } from "@/types";

const POSTS_KEY = "educatio_posts";
const COMMENTS_KEY = "educatio_comentarios";

function getPosts(): Post[] {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]"); }
  catch { return []; }
}
function savePosts(list: Post[]) { localStorage.setItem(POSTS_KEY, JSON.stringify(list)); }

function getComments(): Comentario[] {
  try { return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]"); }
  catch { return []; }
}
function saveComments(list: Comentario[]) { localStorage.setItem(COMMENTS_KEY, JSON.stringify(list)); }

// Feed de professores (só professores/admins da mesma escola)
export function getPostsProfessores(escolaId: string): Post[] {
  return getPosts().filter((p) => p.canal === "professores" && p.escolaId === escolaId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Feed da turma (professor + seus alunos)
export function getPostsTurma(professorId: string): Post[] {
  return getPosts().filter((p) => p.canal === "turma" && p.professorId === professorId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function criarPost(post: Omit<Post, "id" | "createdAt">): Post {
  const all = getPosts();
  const novo: Post = { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  all.push(novo);
  savePosts(all);
  return novo;
}

export function deletarPost(id: string) {
  savePosts(getPosts().filter((p) => p.id !== id));
  saveComments(getComments().filter((c) => c.postId !== id));
}

export function getComentariosByPost(postId: string): Comentario[] {
  return getComments().filter((c) => c.postId === postId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function criarComentario(comment: Omit<Comentario, "id" | "createdAt">): Comentario {
  const all = getComments();
  const novo: Comentario = { ...comment, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  all.push(novo);
  saveComments(all);
  return novo;
}
