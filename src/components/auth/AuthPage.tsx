"use client";

import { useState, useEffect } from "react";
import { useAuth, type CadastroData } from "@/lib/auth";
import { maskCpf, unmaskCpf, isValidCpf, maskDate, isValidDateBR, calcAge } from "@/lib/utils";
import type { UserRole, Serie, Sexo, Escola, User } from "@/types";
import EscolaCadastro from "./EscolaCadastro";

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: "aluno", label: "Aluno", icon: "🎓", desc: "Acessa conteúdo da sua série" },
  { value: "professor", label: "Professor", icon: "👩‍🏫", desc: "Gerencia alunos e conteúdo" },
  { value: "administrador", label: "Administrador", icon: "🔑", desc: "Gerencia escolas e professores" },
];

const SERIES: Serie[] = ["6", "7", "8", "9"];
const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ceara-verde/30 focus:border-ceara-verde transition-colors";

export default function AuthPage() {
  const { login, cadastro, escolas, addEscola, professoresByEscola } = useAuth();
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [error, setError] = useState("");

  // Login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Cadastro
  const [role, setRole] = useState<UserRole>("aluno");
  const [nome, setNome] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState<Sexo | "">("");
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [serie, setSerie] = useState<Serie>("6");

  // Escola
  const [escolaId, setEscolaId] = useState("");

  // Sala + Matéria
  const [sala, setSala] = useState("");
  const [materiaProf, setMateriaProf] = useState("");

  // Professor (para aluno)
  const [professorId, setProfessorId] = useState("");

  const [escolasList, setEscolasList] = useState<Escola[]>([]);
  const [professoresList, setProfessoresList] = useState<User[]>([]);
  const selectedEscola = escolasList.find((e) => e.id === escolaId);

  useEffect(() => { setEscolasList(escolas()); }, [mode]);
  useEffect(() => {
    if (escolaId) setProfessoresList(professoresByEscola(escolaId));
    else setProfessoresList([]);
    setProfessorId("");
  }, [escolaId]);

  const cpfDigits = unmaskCpf(cpf);
  const cpfComplete = cpfDigits.length === 11;
  const cpfValid = cpfComplete && isValidCpf(cpfDigits);
  const dateComplete = dataNascimento.length === 10;
  const dateValid = dateComplete && isValidDateBR(dataNascimento);
  const age = dateValid ? calcAge(dataNascimento) : null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !senha.trim()) { setError("Preencha todos os campos."); return; }
    const err = login(email.trim(), senha);
    if (err) setError(err);
  };


  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nome.trim() || !nomeCompleto.trim() || !email.trim() || !senha.trim() || !matricula.trim()) {
      setError("Preencha todos os campos obrigatórios (*)."); return;
    }
    if (!escolaId) { setError("Selecione uma escola."); return; }
    if (role === "aluno" && !professorId) { setError("Selecione o professor responsável."); return; }
    if (role === "aluno" && !sala) { setError("Selecione a sala/turma."); return; }
    if (cpfDigits.length > 0 && !cpfComplete) { setError("CPF incompleto."); return; }
    if (cpfComplete && !cpfValid) { setError("CPF inválido."); return; }
    if (dataNascimento && !dateValid) { setError("Data de nascimento inválida."); return; }
    if (senha.length < 4) { setError("Senha deve ter pelo menos 4 caracteres."); return; }

    const data: CadastroData = {
      nome: nome.trim(),
      nomeCompleto: nomeCompleto.trim(),
      nomeMae: nomeMae.trim() || undefined,
      dataNascimento: dateValid ? dataNascimento : undefined,
      sexo: sexo || undefined,
      email: email.trim(),
      senha,
      cpf: cpfDigits || "",
      matricula: matricula.trim(),
      role,
      serie: role === "aluno" ? serie : undefined,
      sala: sala || undefined,
      materia: materiaProf || undefined,
      escolaId,
      professorId: role === "aluno" ? professorId : undefined,
    };
    const err = cadastro(data);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex flex-col">
      {/* Header */}
      <div className="bg-ceara-verde text-white">
        <div className="h-1 bg-ceara-amarelo" />
        <div className="max-w-md mx-auto px-4 py-6 text-center">
          <h1 className="text-display text-3xl font-bold">Educatio</h1>
          <p className="text-white/70 text-sm mt-1">Recomposição da aprendizagem · BNCC & DCRC Ceará</p>
        </div>
        <div className="h-1 bg-ceara-azul" />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6 border border-gray-200">
            <button onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === "login" ? "bg-ceara-verde text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              Entrar
            </button>
            <button onClick={() => { setMode("cadastro"); setError(""); }} className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === "cadastro" ? "bg-ceara-verde text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              Cadastrar
            </button>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleCadastro} className="card p-6 space-y-4">
            {mode === "cadastro" && (
              <>
                {/* 1. Perfil */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">1. Perfil *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                      <button key={r.value} type="button" onClick={() => { setRole(r.value); setEscolaId(""); setProfessorId(""); }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center transition-all ${role === r.value ? "bg-ceara-verde text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                        <span className="text-lg block mb-0.5">{r.icon}</span>{r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Escola — busca INEP + manual */}
                <EscolaCadastro
                  escolasList={escolasList}
                  escolaId={escolaId}
                  onSelectEscola={(id) => { setEscolaId(id); setEscolasList(escolas()); }}
                  onCriarEscola={(nome, codigo, cidade, salas) => {
                    const result = addEscola(nome, codigo, cidade, salas);
                    if (typeof result !== "string") setEscolasList(escolas());
                    return result;
                  }}
                />

                {/* 3. Professor (só para aluno) */}
                {role === "aluno" && escolaId && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">3. Professor responsável *</label>
                    {professoresList.length > 0 ? (
                      <select value={professorId} onChange={(e) => setProfessorId(e.target.value)} className={inputClass}>
                        <option value="">Selecione o professor...</option>
                        {professoresList.map((p) => (
                          <option key={p.id} value={p.id}>{p.nomeCompleto || p.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded-xl px-4 py-3 border border-amber-200">
                        Nenhum professor cadastrado nesta escola. O professor deve se cadastrar primeiro.
                      </p>
                    )}
                  </div>
                )}

                {/* 4. Sala + Matéria */}
                {escolaId && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">{role === "aluno" ? "4. Sala/Turma *" : "Sala/Turma"}</label>
                      {selectedEscola?.salas && selectedEscola.salas.length > 0 ? (
                        <select value={sala} onChange={(e) => setSala(e.target.value)} className={inputClass}>
                          <option value="">Selecione...</option>
                          {selectedEscola.salas.map((s) => (
                            <option key={s} value={s}>Sala {s}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Ex: A, B, 1, 2..." className={inputClass} />
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">{role === "professor" ? "Matéria principal *" : "Matéria"}</label>
                      <select value={materiaProf} onChange={(e) => setMateriaProf(e.target.value)} className={inputClass}>
                        <option value="">Selecione...</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Língua Portuguesa">Língua Portuguesa</option>
                        <option value="Ciências">Ciências</option>
                        <option value="Geografia">Geografia</option>
                        <option value="História">História</option>
                        <option value="Inglês">Inglês</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Dados pessoais */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dados pessoais</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nome (apelido) *</label>
                      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nome completo *</label>
                      <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Maria da Silva Santos" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nome da mãe <span className="font-normal text-gray-400">(opcional)</span></label>
                      <input type="text" value={nomeMae} onChange={(e) => setNomeMae(e.target.value)} placeholder="Ana da Silva" className={inputClass} />
                    </div>

                    {/* Data nascimento + Sexo */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nascimento <span className="font-normal text-gray-400">(opcional)</span></label>
                        <input type="text" inputMode="numeric" value={dataNascimento} onChange={(e) => setDataNascimento(maskDate(e.target.value))} placeholder="dd/mm/aaaa" maxLength={10}
                          className={`${inputClass} ${dateComplete ? dateValid ? "border-emerald-400 ring-1 ring-emerald-200" : "border-red-400 ring-1 ring-red-200" : ""}`} />
                        {dateValid && age !== null && <p className="text-[11px] text-emerald-600 font-semibold mt-1">{age} anos</p>}
                        {dateComplete && !dateValid && <p className="text-[11px] text-red-500 font-semibold mt-1">Inválida</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Sexo <span className="font-normal text-gray-400">(opcional)</span></label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setSexo(sexo === "M" ? "" : "M")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${sexo === "M" ? "bg-ceara-azul text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>M</button>
                          <button type="button" onClick={() => setSexo(sexo === "F" ? "" : "F")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${sexo === "F" ? "bg-ceara-sol text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>F</button>
                        </div>
                      </div>
                    </div>

                    {/* CPF + Matrícula */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">CPF <span className="font-normal text-gray-400">(opcional)</span></label>
                        <input type="text" inputMode="numeric" value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} placeholder="000.000.000-00" maxLength={14}
                          className={`${inputClass} ${cpfComplete ? cpfValid ? "border-emerald-400 ring-1 ring-emerald-200" : "border-red-400 ring-1 ring-red-200" : ""}`} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Matrícula *</label>
                        <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="2026001234" className={inputClass} />
                      </div>
                    </div>

                    {/* Série (aluno) */}
                    {role === "aluno" && (
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Série *</label>
                        <div className="flex gap-2">
                          {SERIES.map((s) => (
                            <button key={s} type="button" onClick={() => setSerie(s)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${serie === s ? "bg-ceara-amarelo text-gray-800 shadow-sm" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                              {s}º
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Email + Senha */}
            <div className={mode === "cadastro" ? "border-t border-gray-100 pt-4 space-y-3" : "space-y-4"}>
              {mode === "cadastro" && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Acesso</p>}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">E-mail *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Senha *</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" className={inputClass} />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-200">{error}</div>}

            <button type="submit" className="w-full py-3.5 rounded-xl bg-ceara-verde text-white font-bold text-sm hover:bg-ceara-verde-mid active:scale-[0.98] transition-all shadow-sm">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          {/* Hierarquia info */}
          {mode === "cadastro" && (
            <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hierarquia do cadastro</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-ceara-verde-light text-ceara-verde font-bold px-2 py-1 rounded-lg">Escola</span>
                <span>→</span>
                <span className="bg-ceara-azul-light text-ceara-azul font-bold px-2 py-1 rounded-lg">Professor</span>
                <span>→</span>
                <span className="bg-ceara-amarelo-light text-amber-800 font-bold px-2 py-1 rounded-lg">Aluno</span>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-[11px] text-gray-400">&copy; 2026 Educatio · Sistemas Guarany · (85) 99649-6064</p>
          </div>
        </div>
      </div>
    </div>
  );
}
