// Perfis de usuário
export type UserRole = "aluno" | "professor" | "administrador";
export type Sexo = "M" | "F";

// Escola
export interface Escola {
  id: string;
  nome: string;
  codigo?: string;       // código INEP ou identificador
  cidade?: string;
  salas?: string[];      // ex: ["A", "B", "C"] ou ["1", "2", "3"]
  createdAt: string;
}

export interface User {
  id: string;
  nome: string;              // nome curto / apelido
  nomeCompleto: string;      // nome completo
  nomeMae?: string;          // nome da mãe
  dataNascimento?: string;   // formato dd/mm/aaaa
  sexo?: Sexo;
  email: string;
  cpf: string;               // CPF (11 dígitos, sem máscara)
  matricula: string;         // matrícula escolar (obrigatória)
  role: UserRole;
  serie?: Serie;             // série do aluno (opcional para professor/admin)
  sala?: string;             // sala/turma (ex: "A", "1")
  materia?: string;          // matéria principal (professor)
  escolaId: string;          // ID da escola vinculada
  professorId?: string;      // ID do professor responsável (aluno)
  createdAt: string;
}

// Séries disponíveis
export type Serie = "6" | "7" | "8" | "9";

// Status de um tópico
export type TopicStatus = "done" | "prog" | "todo";

// Nível de dificuldade
export type TopicLevel = "basico" | "intermediario" | "avancado";

// Tópico de uma matéria
export interface Topic {
  id: string;
  title: string;
  status: TopicStatus;
  level: TopicLevel;
  bnccCode?: string;   // ex: EF06MA01
  dcrcRef?: string;    // referência DCRC Ceará
}

// Matéria
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;       // classe tailwind de cor
  progress: number;    // 0-100
  topics: Topic[];
}

// Plano de Aula
export interface PlanoAula {
  id: string;
  professorId: string;
  escolaId: string;
  data: string;              // dd/mm/aaaa
  titulo: string;
  serie: Serie;
  materia: string;
  objetivos?: string;        // HTML
  conteudo: string;          // HTML (corpo principal)
  notas?: string;            // HTML
  createdAt: string;
  updatedAt: string;
}

// === PROVAS ===

export type TipoQuestao = "multipla_escolha" | "dissertativa" | "calculo";
export type ProvaStatus = "rascunho" | "publicada" | "encerrada";
export type SubmissaoStatus = "em_andamento" | "enviada" | "corrigida";

export interface QuestaoProva {
  id: string;
  tipo: TipoQuestao;
  enunciado: string;
  pontos: number;
  alternativas?: string[];
  respostaCorretaIndex?: number;
  descricaoCalculo?: string;
}

export interface Prova {
  id: string;
  professorId: string;
  escolaId: string;
  titulo: string;
  materia: string;
  serie: Serie;
  sala?: string;
  descricao?: string;
  questoes: QuestaoProva[];
  status: ProvaStatus;
  dataAplicacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RespostaQuestao {
  questaoId: string;
  tipo: TipoQuestao;
  alternativaSelecionada?: number;
  textoResposta?: string;
  respostaCalculo?: string;
  descricaoPassos?: string;
  nota?: number;
  comentario?: string;
  autoCorrigida?: boolean;
}

export interface SubmissaoProva {
  id: string;
  provaId: string;
  alunoId: string;
  respostas: RespostaQuestao[];
  status: SubmissaoStatus;
  notaTotal?: number;
  notaMaxima?: number;
  enviadoEm?: string;
  corrigidoEm?: string;
  createdAt: string;
  updatedAt: string;
}

// === NOTIFICAÇÕES ===

export interface Notificacao {
  id: string;
  userId: string;
  tipo: "prova_publicada" | "prova_enviada" | "prova_corrigida" | "mensagem" | "post";
  titulo: string;
  descricao: string;
  lida: boolean;
  link?: string;
  createdAt: string;
}

// === MURAL / FEED SOCIAL ===

export interface Post {
  id: string;
  autorId: string;
  autorNome: string;
  autorRole: UserRole;
  escolaId: string;
  canal: "professores" | "turma";   // professores = só profs, turma = prof+alunos
  professorId?: string;              // se canal=turma, qual professor/turma
  serie?: Serie;
  sala?: string;
  conteudo: string;
  createdAt: string;
}

export interface Comentario {
  id: string;
  postId: string;
  autorId: string;
  autorNome: string;
  conteudo: string;
  createdAt: string;
}

// Questão de quiz
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectId: string;
  serie: Serie;
  bnccSkill?: string;
}

// Estatísticas do aluno
export interface StudentStats {
  activitiesDone: number;
  points: number;
  streak: number;
  totalCorrect: number;
}

// Resposta do quiz
export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timestamp: number;
}
