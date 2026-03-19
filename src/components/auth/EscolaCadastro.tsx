"use client";

import { useState, useEffect } from "react";
import type { Escola } from "@/types";

const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

interface Municipio {
  id: number;
  nome: string;
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
  const [escolasINEP, setEscolasINEP] = useState<EscolaINEP[]>([]);
  const [loadingMun, setLoadingMun] = useState(false);
  const [loadingEsc, setLoadingEsc] = useState(false);
  const [busca, setBusca] = useState("");
  const [error, setError] = useState("");

  // Manual
  const [nomeManual, setNomeManual] = useState("");
  const [cidadeManual, setCidadeManual] = useState("");
  const [salasManual, setSalasManual] = useState("A, B, C");

  // Load Ceará municipalities
  useEffect(() => {
    setLoadingMun(true);
    fetch("/api/ibge/municipios?uf=23")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMunicipios(data); })
      .catch(() => {})
      .finally(() => setLoadingMun(false));
  }, []);

  // Fetch schools when municipality changes
  useEffect(() => {
    if (!municipio) { setEscolasINEP([]); return; }
    setLoadingEsc(true);
    fetch(`/api/escolas?municipio=${encodeURIComponent(municipio)}&uf=CE`)
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
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Município do Ceará *</label>
            <select value={municipio} onChange={(e) => { setMunicipio(e.target.value); setBusca(""); }} className={inputClass} disabled={loadingMun}>
              <option value="">{loadingMun ? "Carregando municípios..." : "Selecione o município..."}</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.nome}>{m.nome}</option>
              ))}
            </select>
          </div>

          {municipio && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                {loadingEsc ? "Buscando escolas..." : `${escolasINEP.length} escola(s) encontrada(s)`}
              </label>
              {escolasINEP.length > 5 && (
                <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Filtrar por nome..." className={`${inputClass} mb-2`} />
              )}
              <div className="max-h-48 overflow-y-auto space-y-1 bg-white rounded-xl border border-gray-200">
                {loadingEsc ? (
                  <p className="text-xs text-gray-400 text-center py-4">Buscando no Censo Escolar...</p>
                ) : filteredINEP.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400">Nenhuma escola encontrada.</p>
                    <button type="button" onClick={() => setMode("manual")} className="text-[11px] text-ceara-verde font-semibold mt-1 hover:underline">Cadastrar manualmente</button>
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
