import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TopicStatus, TopicLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusLabel(status: TopicStatus): string {
  const map: Record<TopicStatus, string> = {
    done: "Concluído",
    prog: "Em andamento",
    todo: "A fazer",
  };
  return map[status];
}

export function getStatusColor(status: TopicStatus): string {
  const map: Record<TopicStatus, string> = {
    done: "bg-ceara-verde-light text-ceara-verde",
    prog: "bg-ceara-amarelo-light text-amber-800",
    todo: "bg-gray-100 text-gray-500",
  };
  return map[status];
}

export function getStatusDot(status: TopicStatus): string {
  const map: Record<TopicStatus, string> = {
    done: "bg-ceara-verde",
    prog: "bg-ceara-amarelo",
    todo: "bg-gray-300",
  };
  return map[status];
}

export function calcOverallProgress(subjects: { progress: number }[]): number {
  if (!subjects.length) return 0;
  return Math.round(subjects.reduce((s, m) => s + m.progress, 0) / subjects.length);
}

export function getLevelLabel(level: TopicLevel): string {
  const map: Record<TopicLevel, string> = {
    basico: "Básico",
    intermediario: "Intermediário",
    avancado: "Avançado",
  };
  return map[level];
}

export function getLevelIcon(level: TopicLevel): string {
  const map: Record<TopicLevel, string> = {
    basico: "🟢",
    intermediario: "🟡",
    avancado: "🔴",
  };
  return map[level];
}

export function getLevelColor(level: TopicLevel): string {
  const map: Record<TopicLevel, string> = {
    basico: "bg-emerald-50 text-emerald-700 border-emerald-200",
    intermediario: "bg-amber-50 text-amber-700 border-amber-200",
    avancado: "bg-red-50 text-red-700 border-red-200",
  };
  return map[level];
}

/** Aplica máscara de data brasileira: dd/mm/aaaa */
export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Valida data brasileira dd/mm/aaaa */
export function isValidDateBR(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const d = parseInt(dd), m = parseInt(mm), y = parseInt(yyyy);
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1920 || y > new Date().getFullYear()) return false;
  const date = new Date(y, m - 1, d);
  return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y;
}

/** Calcula idade a partir de dd/mm/aaaa */
export function calcAge(dataNascimento: string): number | null {
  const match = dataNascimento.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const birth = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Aplica máscara de CPF: 000.000.000-00 */
export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/** Extrai apenas dígitos do CPF */
export function unmaskCpf(value: string): string {
  return value.replace(/\D/g, "");
}

/** Valida CPF com dígitos verificadores */
export function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // todos iguais
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
}
