"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, UserRole, Serie, Sexo, Escola } from "@/types";

const USERS_KEY = "educatio_users";
const ESCOLAS_KEY = "educatio_escolas";
const SESSION_KEY = "educatio_session";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => string | null;
  cadastro: (data: CadastroData) => string | null;
  logout: () => void;
  allUsers: () => User[];
  deleteUser: (id: string) => void;
  importUsers: (rows: CadastroData[]) => { imported: number; errors: string[] };
  // Escolas
  escolas: () => Escola[];
  addEscola: (nome: string, codigo?: string, cidade?: string) => Escola | string;
  removeEscola: (id: string) => void;
  // Hierarquia
  professoresByEscola: (escolaId: string) => User[];
  alunosByProfessor: (professorId: string) => User[];
  alunosByEscola: (escolaId: string) => User[];
}

export interface CadastroData {
  nome: string;
  nomeCompleto: string;
  nomeMae?: string;
  dataNascimento?: string;
  sexo?: Sexo;
  email: string;
  senha: string;
  cpf: string;
  matricula: string;
  role: UserRole;
  serie?: Serie;
  escolaId: string;
  professorId?: string;
}

interface StoredUser extends User {
  senha: string;
}

function getStoredUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getStoredEscolas(): Escola[] {
  try { return JSON.parse(localStorage.getItem(ESCOLAS_KEY) || "[]"); }
  catch { return []; }
}
function saveEscolas(list: Escola[]) {
  localStorage.setItem(ESCOLAS_KEY, JSON.stringify(list));
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const found = getStoredUsers().find((u) => u.id === sessionId);
        if (found) { const { senha: _, ...safe } = found; setUser(safe); }
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback((email: string, senha: string): string | null => {
    const found = getStoredUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return "E-mail não encontrado.";
    if (found.senha !== senha) return "Senha incorreta.";
    const { senha: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem(SESSION_KEY, found.id);
    return null;
  }, []);

  const cadastro = useCallback((data: CadastroData): string | null => {
    const users = getStoredUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) return "Este e-mail já está cadastrado.";
    if (data.cpf && users.find((u) => u.cpf && u.cpf === data.cpf)) return "Este CPF já está cadastrado.";
    if (data.matricula && users.find((u) => u.matricula === data.matricula)) return "Esta matrícula já está cadastrada.";
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      nome: data.nome,
      nomeCompleto: data.nomeCompleto,
      nomeMae: data.nomeMae,
      dataNascimento: data.dataNascimento,
      sexo: data.sexo,
      email: data.email,
      senha: data.senha,
      cpf: data.cpf,
      matricula: data.matricula,
      role: data.role,
      serie: data.serie,
      escolaId: data.escolaId,
      professorId: data.professorId,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    const { senha: _, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const allUsers = useCallback((): User[] => {
    return getStoredUsers().map(({ senha: _, ...u }) => u);
  }, []);

  const deleteUser = useCallback((id: string) => {
    saveUsers(getStoredUsers().filter((u) => u.id !== id));
  }, []);

  const importUsers = useCallback((rows: CadastroData[]): { imported: number; errors: string[] } => {
    const users = getStoredUsers();
    const errors: string[] = [];
    let imported = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const line = i + 2;
      if (!row.nome || !row.matricula) { errors.push(`Linha ${line}: nome ou matrícula vazio`); continue; }
      if (users.find((u) => u.matricula === row.matricula)) { errors.push(`Linha ${line}: matrícula ${row.matricula} já existe`); continue; }
      if (row.cpf && users.find((u) => u.cpf && u.cpf === row.cpf)) { errors.push(`Linha ${line}: CPF ${row.cpf} já existe`); continue; }
      users.push({
        id: crypto.randomUUID(),
        nome: row.nome,
        nomeCompleto: row.nomeCompleto || row.nome,
        nomeMae: row.nomeMae,
        dataNascimento: row.dataNascimento,
        sexo: row.sexo,
        email: row.email || `${row.matricula}@educatio.local`,
        senha: row.senha || row.matricula,
        cpf: row.cpf || "",
        matricula: row.matricula,
        role: row.role || "aluno",
        serie: row.serie,
        escolaId: row.escolaId || "",
        professorId: row.professorId,
        createdAt: new Date().toISOString(),
      });
      imported++;
    }
    saveUsers(users);
    return { imported, errors };
  }, []);

  // Escolas
  const escolas = useCallback((): Escola[] => getStoredEscolas(), []);

  const addEscola = useCallback((nome: string, codigo?: string, cidade?: string): Escola | string => {
    const list = getStoredEscolas();
    if (list.find((e) => e.nome.toLowerCase() === nome.toLowerCase())) return "Escola já cadastrada.";
    const escola: Escola = { id: crypto.randomUUID(), nome, codigo, cidade, createdAt: new Date().toISOString() };
    list.push(escola);
    saveEscolas(list);
    return escola;
  }, []);

  const removeEscola = useCallback((id: string) => {
    saveEscolas(getStoredEscolas().filter((e) => e.id !== id));
  }, []);

  // Hierarquia
  const professoresByEscola = useCallback((escolaId: string): User[] => {
    return getStoredUsers().filter((u) => u.role === "professor" && u.escolaId === escolaId).map(({ senha: _, ...u }) => u);
  }, []);

  const alunosByProfessor = useCallback((professorId: string): User[] => {
    return getStoredUsers().filter((u) => u.role === "aluno" && u.professorId === professorId).map(({ senha: _, ...u }) => u);
  }, []);

  const alunosByEscola = useCallback((escolaId: string): User[] => {
    return getStoredUsers().filter((u) => u.role === "aluno" && u.escolaId === escolaId).map(({ senha: _, ...u }) => u);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, cadastro, logout, allUsers, deleteUser, importUsers,
      escolas, addEscola, removeEscola,
      professoresByEscola, alunosByProfessor, alunosByEscola,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
