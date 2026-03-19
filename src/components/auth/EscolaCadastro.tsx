"use client";

import { useState, useEffect, useRef } from "react";
import type { Escola } from "@/types";

const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

interface Municipio {
  id: number;
  nome: string;
}

const ESTADOS = [
  { id: "12", sigla: "AC", nome: "Acre" }, { id: "27", sigla: "AL", nome: "Alagoas" },
  { id: "16", sigla: "AP", nome: "Amapá" }, { id: "13", sigla: "AM", nome: "Amazonas" },
  { id: "29", sigla: "BA", nome: "Bahia" }, { id: "23", sigla: "CE", nome: "Ceará" },
  { id: "53", sigla: "DF", nome: "Distrito Federal" }, { id: "32", sigla: "ES", nome: "Espírito Santo" },
  { id: "52", sigla: "GO", nome: "Goiás" }, { id: "21", sigla: "MA", nome: "Maranhão" },
  { id: "51", sigla: "MT", nome: "Mato Grosso" }, { id: "50", sigla: "MS", nome: "Mato Grosso do Sul" },
  { id: "31", sigla: "MG", nome: "Minas Gerais" }, { id: "15", sigla: "PA", nome: "Pará" },
  { id: "25", sigla: "PB", nome: "Paraíba" }, { id: "41", sigla: "PR", nome: "Paraná" },
  { id: "26", sigla: "PE", nome: "Pernambuco" }, { id: "22", sigla: "PI", nome: "Piauí" },
  { id: "33", sigla: "RJ", nome: "Rio de Janeiro" }, { id: "24", sigla: "RN", nome: "Rio Grande do Norte" },
  { id: "43", sigla: "RS", nome: "Rio Grande do Sul" }, { id: "11", sigla: "RO", nome: "Rondônia" },
  { id: "14", sigla: "RR", nome: "Roraima" }, { id: "42", sigla: "SC", nome: "Santa Catarina" },
  { id: "35", sigla: "SP", nome: "São Paulo" }, { id: "28", sigla: "SE", nome: "Sergipe" },
  { id: "17", sigla: "TO", nome: "Tocantins" },
];

/** Remove acentos para busca: "São Gonçalo" → "sao goncalo" */
function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

interface EscolaINEP {
  codigo: string;
  nome: string;
  municipio: string;
  rede: string;
  endereco?: string;
}

interface EscolaCadastroProps {
  escolasList: Escola[];
  escolaId: string;
  onSelectEscola: (id: string) => void;
  onCriarEscola: (nome: string, codigo?: string, cidade?: string, salas?: string[]) => Escola | string;
}

export default function EscolaCadastro({ escolasList, escolaId, onSelectEscola, onCriarEscola }: EscolaCadastroProps) {
  const [mode, setMode] = useState<"selecionar" | "buscar" | "manual">("selecionar");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [municipio, setMunicipio] = useState("");
  const [munInput, setMunInput] = useState("");
  const [munOpen, setMunOpen] = useState(false);
  const [escolasINEP, setEscolasINEP] = useState<EscolaINEP[]>([]);
  const [loadingMun, setLoadingMun] = useState(false);
  const [loadingEsc, setLoadingEsc] = useState(false);
  const [busca, setBusca] = useState("");

  const munRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!munOpen) return;
    const handleClick = (e: MouseEvent) => { if (munRef.current && !munRef.current.contains(e.target as Node)) setMunOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [munOpen]);

  const filteredMunicipios = munInput.length >= 1
    ? municipios.filter((m) => normalize(m.nome).includes(normalize(munInput)))
    : municipios;
  const [error, setError] = useState("");
  const [uf, setUf] = useState("23"); // 23 = Ceará (padrão)

  // Manual
  const [nomeManual, setNomeManual] = useState("");
  const [cidadeManual, setCidadeManual] = useState("");
  const [salasManual, setSalasManual] = useState("A, B, C");

  // Load municipalities when UF changes
  useEffect(() => {
    setLoadingMun(true);
    setMunicipios([]);
    setMunicipio("");
    setMunInput("");
    fetch(`/api/ibge/municipios?uf=${uf}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMunicipios(data); })
      .catch(() => {})
      .finally(() => setLoadingMun(false));
  }, [uf]);

  // Fetch schools when municipality changes
  useEffect(() => {
    if (!municipio) { setEscolasINEP([]); return; }
    setLoadingEsc(true);
    const ufSigla = ESTADOS.find((e) => e.id === uf)?.sigla || "CE";
    fetch(`/api/escolas?municipio=${encodeURIComponent(municipio)}&uf=${ufSigla}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEscolasINEP(data); })
      .catch(() => setEscolasINEP([]))
      .finally(() => setLoadingEsc(false));
  }, [municipio]);

  const filteredINEP = busca.length >= 2
    ? escolasINEP.filter((e) => e.nome.toLowerCase().includes(busca.toLowerCase()))
    : escolasINEP;

  const handleSelectINEP = (e: EscolaINEP) => {
    // Check if already registered
    const existing = escolasList.find((x) => x.codigo === e.codigo || x.nome.toLowerCase() === e.nome.toLowerCase());
    if (existing) {
      onSelectEscola(existing.id);
      setMode("selecionar");
      return;
    }
    // Create new
    const result = onCriarEscola(e.nome, e.codigo, municipio, ["A", "B", "C"]);
    if (typeof result === "string") { setError(result); return; }
    onSelectEscola(result.id);
    setMode("selecionar");
  };

  const handleManual = () => {
    if (!nomeManual.trim()) return;
    const salas = salasManual.split(",").map((s) => s.trim()).filter(Boolean);
    const result = onCriarEscola(nomeManual.trim(), undefined, cidadeManual.trim() || undefined, salas.length > 0 ? salas : ["A", "B", "C"]);
    if (typeof result === "string") { setError(result); return; }
    onSelectEscola(typeof result === "string" ? "" : result.id);
    setMode("selecionar");
    setNomeManual("");
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Escola *</label>

      {/* Mode tabs */}
      <div className="flex gap-1.5">
        <button type="button" onClick={() => setMode("selecionar")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${mode === "selecionar" ? "bg-ceara-verde text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
          Já cadastrada
        </button>
        <button type="button" onClick={() => setMode("buscar")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${mode === "buscar" ? "bg-ceara-verde text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
          Buscar no INEP
        </button>
        <button type="button" onClick={() => setMode("manual")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${mode === "manual" ? "bg-ceara-verde text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
          Manual
        </button>
      </div>

      {/* Selecionar existente */}
      {mode === "selecionar" && (
        escolasList.length > 0 ? (
          <select value={escolaId} onChange={(e) => onSelectEscola(e.target.value)} className={inputClass}>
            <option value="">Selecione a escola...</option>
            {escolasList.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}{e.cidade ? ` — ${e.cidade}` : ""}</option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">Nenhuma escola cadastrada. Use "Buscar no INEP" ou "Manual".</p>
        )
      )}

      {/* Buscar no Censo Escolar */}
      {mode === "buscar" && (
        <div className="bg-ceara-verde-light/30 rounded-xl p-3 space-y-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Estado *</label>
            <select value={uf} onChange={(e) => setUf(e.target.value)} className={inputClass}>
              {ESTADOS.map((e) => <option key={e.id} value={e.id}>{e.sigla} — {e.nome}</option>)}
            </select>
          </div>
          <div className="relative" ref={munRef}>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Município *</label>
            <input
              type="text"
              value={munInput}
              onChange={(e) => { setMunInput(e.target.value); setMunOpen(true); if (!e.target.value) { setMunicipio(""); } }}
              onFocus={() => setMunOpen(true)}
              placeholder={loadingMun ? "Carregando municípios..." : "Digite o município..."}
              disabled={loadingMun}
              className={inputClass}
            />
            {municipio && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-ceara-verde font-semibold bg-ceara-verde-light px-2 py-0.5 rounded-lg">{municipio}</span>
                <button type="button" onClick={() => { setMunicipio(""); setMunInput(""); setBusca(""); }} className="text-[10px] text-red-400 hover:text-red-600">&times;</button>
              </div>
            )}
            {munOpen && !municipio && filteredMunicipios.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredMunicipios.slice(0, 30).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setMunicipio(m.nome); setMunInput(m.nome); setMunOpen(false); setBusca(""); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-ceara-verde-light/50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    {m.nome}
                  </button>
                ))}
                {filteredMunicipios.length > 30 && (
                  <p className="px-3 py-2 text-[10px] text-gray-400 text-center">+{filteredMunicipios.length - 30} municípios. Continue digitando...</p>
                )}
              </div>
            )}
            {munOpen && !municipio && munInput.length >= 1 && filteredMunicipios.length === 0 && !loadingMun && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-3">
                <p className="text-xs text-gray-400 text-center">Nenhum município encontrado para "{munInput}"</p>
              </div>
            )}
          </div>

          {municipio && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-gray-500">
                  {loadingEsc ? "Buscando escolas nas bases do INEP..." : `${escolasINEP.length} escola(s) encontrada(s)`}
                </label>
                {!loadingEsc && escolasINEP.length === 0 && (
                  <button type="button" onClick={() => { setEscolasINEP([]); setMunicipio(""); setTimeout(() => setMunicipio(municipio), 100); }} className="text-[10px] text-ceara-verde font-semibold hover:underline">
                    Tentar novamente
                  </button>
                )}
              </div>
              {escolasINEP.length > 5 && (
                <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Filtrar por nome..." className={`${inputClass} mb-2`} />
              )}
              <div className="max-h-48 overflow-y-auto space-y-1 bg-white rounded-xl border border-gray-200">
                {loadingEsc ? (
                  <p className="text-xs text-gray-400 text-center py-4">Buscando no Censo Escolar...</p>
                ) : filteredINEP.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500">Nenhuma escola encontrada na base online para este município.</p>
                    <p className="text-[10px] text-gray-400 mt-1">As APIs públicas do INEP podem estar indisponíveis. Cadastre manualmente:</p>
                    <button type="button" onClick={() => { setMode("manual"); setCidadeManual(municipio); }} className="mt-2 w-full py-2 rounded-lg bg-ceara-verde text-white text-xs font-bold hover:bg-ceara-verde-mid transition-colors">
                      Cadastrar escola de {municipio} manualmente
                    </button>
                  </div>
                ) : (
                  filteredINEP.map((e) => (
                    <button key={e.codigo || e.nome} type="button" onClick={() => handleSelectINEP(e)}
                      className="w-full text-left px-3 py-2.5 hover:bg-ceara-verde-light/50 transition-colors border-b border-gray-50 last:border-0">
                      <p className="text-xs font-semibold text-gray-800">{e.nome}</p>
                      <p className="text-[10px] text-gray-400">{e.rede}{e.codigo ? ` · INEP ${e.codigo}` : ""}{e.endereco ? ` · ${e.endereco}` : ""}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {!municipio && escolasINEP.length === 0 && (
            <p className="text-[11px] text-gray-400 italic">Selecione um município para buscar escolas do Censo Escolar.</p>
          )}
        </div>
      )}

      {/* Cadastro manual */}
      {mode === "manual" && (
        <div className="bg-ceara-verde-light/30 rounded-xl p-3 space-y-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nome da escola *</label>
            <input type="text" value={nomeManual} onChange={(e) => setNomeManual(e.target.value)} placeholder="EMEF Exemplo" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Cidade</label>
              <input type="text" value={cidadeManual} onChange={(e) => setCidadeManual(e.target.value)} placeholder="Fortaleza" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Salas (separadas por vírgula)</label>
              <input type="text" value={salasManual} onChange={(e) => setSalasManual(e.target.value)} placeholder="A, B, C" className={inputClass} />
            </div>
          </div>
          <button type="button" onClick={handleManual} disabled={!nomeManual.trim()}
            className="w-full py-2.5 rounded-xl bg-ceara-verde text-white text-xs font-bold hover:bg-ceara-verde-mid disabled:opacity-40 transition-colors">
            Cadastrar escola
          </button>
        </div>
      )}

      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
