"use client";

import { useState, useRef } from "react";
import { useAuth, type CadastroData } from "@/lib/auth";
import { unmaskCpf } from "@/lib/utils";
import type { Serie, Sexo } from "@/types";

const TEMPLATE_HEADERS = ["nome", "nome_completo", "nome_mae", "data_nascimento", "sexo", "cpf", "matricula", "serie", "sala", "email", "senha"];

function generateTemplate(): string {
  const header = TEMPLATE_HEADERS.join(";");
  const example = "Maria;Maria da Silva Santos;Ana da Silva;15/03/2013;F;12345678901;2026001234;6;A;maria@email.com;1234";
  return `${header}\n${example}`;
}

function downloadTemplate() {
  const csv = generateTemplate();
  const bom = "\uFEFF"; // UTF-8 BOM for Excel
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modelo_importacao_alunos.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep).map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h] = cols[j] || ""; });
    rows.push(row);
  }
  return rows;
}

function rowToCadastroData(row: Record<string, string>, escolaId: string, professorId: string): CadastroData {
  const serieVal = row.serie?.replace(/[^\d]/g, "") || "";
  const validSeries = ["6", "7", "8", "9"];
  return {
    nome: row.nome || "",
    nomeCompleto: row.nome_completo || row.nome || "",
    nomeMae: row.nome_mae || undefined,
    dataNascimento: row.data_nascimento || undefined,
    sexo: (row.sexo?.toUpperCase() === "M" || row.sexo?.toUpperCase() === "F" ? row.sexo.toUpperCase() : undefined) as Sexo | undefined,
    email: row.email || "",
    senha: row.senha || row.matricula || "1234",
    cpf: unmaskCpf(row.cpf || ""),
    matricula: row.matricula || "",
    role: "aluno",
    serie: validSeries.includes(serieVal) ? (serieVal as Serie) : undefined,
    sala: row.sala || undefined,
    escolaId,
    professorId,
  };
}

export default function ImportAlunos() {
  const { importUsers, user } = useAuth();
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(file, "utf-8");
  };

  const handleImport = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      const data = rows.map((r) => rowToCadastroData(r, user?.escolaId || "", user?.id || ""));
      const res = importUsers(data);
      setResult(res);
      setPreview([]);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file, "utf-8");
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Importar Alunos</h3>
          <p className="text-xs text-gray-400">Envie um arquivo CSV/Excel com os dados dos alunos</p>
        </div>
        <button onClick={downloadTemplate} className="text-xs font-bold text-ceara-verde bg-ceara-verde-light px-3 py-1.5 rounded-lg hover:bg-ceara-verde/20 transition-colors">
          Baixar modelo
        </button>
      </div>

      {/* Colunas do modelo */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Colunas do arquivo</p>
        <div className="flex flex-wrap gap-1">
          {TEMPLATE_HEADERS.map((h) => (
            <span key={h} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded font-mono text-gray-600">{h}</span>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Separador: ponto e vírgula (;) ou vírgula (,). Codificação: UTF-8.</p>
        <p className="text-[10px] text-gray-400">Se e-mail ou senha vazios: e-mail = matrícula@educatio.local, senha = matrícula.</p>
      </div>

      {/* Upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,.xls,.xlsx"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-ceara-verde file:text-white hover:file:bg-ceara-verde-mid file:cursor-pointer file:transition-colors"
        />
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500">Pré-visualização ({preview.length} linhas)</p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="text-[11px] w-full">
              <thead>
                <tr className="bg-gray-50">
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-2 py-1.5 text-left font-semibold text-gray-500 whitespace-nowrap">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-2 py-1.5 text-gray-700 whitespace-nowrap">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleImport} className="w-full py-2.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-[0.98] transition-all">
            Importar {preview.length}+ alunos
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${result.imported > 0 ? "bg-ceara-verde-light text-ceara-verde" : "bg-red-50 text-red-700"}`}>
            {result.imported} aluno{result.imported !== 1 ? "s" : ""} importado{result.imported !== 1 ? "s" : ""} com sucesso
          </div>
          {result.errors.length > 0 && (
            <div className="bg-red-50 rounded-xl px-4 py-2.5 space-y-1">
              <p className="text-xs font-bold text-red-700">{result.errors.length} erro{result.errors.length !== 1 ? "s" : ""}:</p>
              <ul className="text-[11px] text-red-600 space-y-0.5 max-h-32 overflow-y-auto">
                {result.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
