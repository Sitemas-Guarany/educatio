// Perfis de usuário
export type UserRole = "aluno" | "professor" | "administrador";
export type Sexo = "M" | "F";

// Escola
export interface Escola {
  id: string;
  nome: string;
  codigo?: string;       // código INEP ou identificador
  cidade?: string;
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
