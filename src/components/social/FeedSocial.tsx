"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { getPostsProfessores, getPostsTurma, criarPost, deletarPost, getComentariosByPost, criarComentario } from "@/lib/social";
import { notificarPost } from "@/lib/notificacoes";
import type { Post, Comentario } from "@/types";

const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

interface FeedSocialProps {
  canal: "professores" | "turma";
}

export default function FeedSocial({ canal }: FeedSocialProps) {
  const { user, professoresByEscola, alunosByProfessor } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [novoPost, setNovoPost] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comentario[]>>({});
  const [novoComment, setNovoComment] = useState<Record<string, string>>({});

  const reload = useCallback(() => {
    if (!user) return;
    if (canal === "professores") {
      setPosts(getPostsProfessores(user.escolaId));
    } else {
      const profId = user.role === "aluno" ? user.professorId || "" : user.id;
      setPosts(getPostsTurma(profId));
    }
  }, [user, canal]);

  useEffect(reload, [reload]);

  const handlePost = () => {
    if (!user || !novoPost.trim()) return;
    const post = criarPost({
      autorId: user.id,
      autorNome: user.nomeCompleto || user.nome,
      autorRole: user.role,
      escolaId: user.escolaId,
      canal,
      professorId: canal === "turma" ? (user.role === "aluno" ? user.professorId : user.id) : undefined,
      serie: user.serie,
      sala: user.sala,
      conteudo: novoPost.trim(),
    });

    // Notificar membros do canal
    if (canal === "professores") {
      const profs = professoresByEscola(user.escolaId);
      profs.filter((p) => p.id !== user.id).forEach((p) => notificarPost(p.id, user.nome, "professores"));
    } else {
      if (user.role !== "aluno") {
        const alunos = alunosByProfessor(user.id);
        alunos.forEach((a) => notificarPost(a.id, user.nome, "turma"));
      } else if (user.professorId) {
        notificarPost(user.professorId, user.nome, "turma");
      }
    }

    setNovoPost("");
    reload();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir publicação?")) return;
    deletarPost(id);
    reload();
  };

  const loadComments = (postId: string) => {
    if (expandedPost === postId) { setExpandedPost(null); return; }
    setExpandedPost(postId);
    setComments((prev) => ({ ...prev, [postId]: getComentariosByPost(postId) }));
  };

  const handleComment = (postId: string) => {
    if (!user || !novoComment[postId]?.trim()) return;
    criarComentario({ postId, autorId: user.id, autorNome: user.nome, conteudo: novoComment[postId].trim() });
    setNovoComment((prev) => ({ ...prev, [postId]: "" }));
    setComments((prev) => ({ ...prev, [postId]: getComentariosByPost(postId) }));
  };

  if (!user) return null;

  const canPost = canal === "professores" ? user.role !== "aluno" : true;
  const title = canal === "professores" ? "Mural dos Professores" : "Mural da Turma";
  const icon = canal === "professores" ? "👩‍🏫" : "🎓";
  const color = canal === "professores" ? "ceara-azul" : "ceara-verde";

  return (
    <div className="card overflow-hidden animate-scale-in">
      <div className={`bg-${color} text-white px-4 py-3 flex items-center gap-3`}>
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <h2 className="font-bold text-sm">{title}</h2>
          <p className="text-white/70 text-[11px]">{posts.length} publicação(ões)</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Novo post */}
        {canPost && (
          <div className="flex gap-2">
            <textarea
              value={novoPost}
              onChange={(e) => setNovoPost(e.target.value)}
              placeholder={canal === "professores" ? "Compartilhe com os colegas..." : "Escreva para a turma..."}
              rows={2}
              className={`${inputClass} resize-none flex-1`}
            />
            <button
              onClick={handlePost}
              disabled={!novoPost.trim()}
              className={`px-4 rounded-xl bg-${color} text-white font-bold text-xs hover:opacity-90 disabled:opacity-40 transition-all self-end py-2.5`}
            >
              Publicar
            </button>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhuma publicação ainda. Seja o primeiro!</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => {
              const isAutor = p.autorId === user.id;
              const postComments = comments[p.id] || [];
              return (
                <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full bg-${color}/10 flex items-center justify-center text-xs font-bold text-${color}`}>
                        {p.autorNome.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">{p.autorNome}</p>
                        <p className="text-[10px] text-gray-400">
                          {p.autorRole === "professor" ? "Professor" : p.autorRole === "administrador" ? "Admin" : "Aluno"}
                          {" · "}
                          {new Date(p.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {isAutor && (
                        <button onClick={() => handleDelete(p.id)} className="text-[10px] text-red-400 hover:text-red-600 font-semibold">Excluir</button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{p.conteudo}</p>
                  </div>

                  {/* Comentários */}
                  <div className="border-t border-gray-50">
                    <button onClick={() => loadComments(p.id)} className="w-full px-4 py-2 text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-left font-semibold">
                      💬 {expandedPost === p.id ? "Fechar" : "Comentários"}
                    </button>

                    {expandedPost === p.id && (
                      <div className="px-4 pb-3 space-y-2 animate-fade-in">
                        {postComments.map((c) => (
                          <div key={c.id} className="flex gap-2">
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{c.autorNome.charAt(0)}</span>
                            <div>
                              <p className="text-[11px]"><span className="font-semibold text-gray-700">{c.autorNome}</span> <span className="text-gray-400">{new Date(c.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></p>
                              <p className="text-xs text-gray-600">{c.conteudo}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={novoComment[p.id] || ""}
                            onChange={(e) => setNovoComment({ ...novoComment, [p.id]: e.target.value })}
                            onKeyDown={(e) => { if (e.key === "Enter") handleComment(p.id); }}
                            placeholder="Comentar..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-ceara-verde/30"
                          />
                          <button onClick={() => handleComment(p.id)} disabled={!novoComment[p.id]?.trim()} className="px-3 py-1.5 rounded-lg bg-ceara-verde text-white text-xs font-bold disabled:opacity-40">Enviar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
