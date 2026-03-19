"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/types";

const TABS: { role: UserRole | "todos"; label: string; icon: string }[] = [
  { role: "todos", label: "Geral", icon: "📖" },
  { role: "administrador", label: "Escola", icon: "🏫" },
  { role: "professor", label: "Professor", icon: "👩‍🏫" },
  { role: "aluno", label: "Aluno", icon: "🎓" },
];

interface FaqItem { q: string; a: string }

const FAQ_GERAL: FaqItem[] = [
  { q: "O que é o Educatio?", a: "O Educatio é uma plataforma de recomposição da aprendizagem para alunos do 6º ao 9º ano, alinhada à BNCC e à DCRC do Ceará. Oferece conteúdo pedagógico, quiz gamificado, provas, planos de aula e tutor de IA." },
  { q: "Como funciona a hierarquia?", a: "O sistema segue a ordem: Escola → Professor → Aluno. A escola se cadastra primeiro, depois os professores se vinculam à escola, e por fim os alunos se vinculam ao professor." },
  { q: "O app funciona no celular?", a: "Sim! O Educatio é um PWA (Progressive Web App). Você pode instalar no celular acessando educatio.digital e usando 'Adicionar à tela inicial' no navegador." },
  { q: "Precisa de internet?", a: "Para o primeiro acesso e login, sim. Depois, parte do conteúdo fica em cache para uso offline." },
  { q: "Como usar a IA?", a: "Em qualquer matéria ou tópico, clique no botão 'Perguntar à IA'. Digite sua dúvida e o tutor IA responde de forma didática, com exemplos do cotidiano cearense." },
  { q: "Quais matérias estão disponíveis?", a: "Matemática, Língua Portuguesa, Ciências, Geografia, História e Inglês — do 6º ao 9º ano, com tópicos divididos em Básico, Intermediário e Avançado." },
];

const FAQ_ESCOLA: FaqItem[] = [
  { q: "Como cadastrar minha escola?", a: "Acesse educatio.digital → Cadastrar → perfil Administrador → na seção Escola, use 'Buscar no INEP' para encontrar sua escola pelo município do Ceará, ou cadastre manualmente." },
  { q: "Como a busca INEP funciona?", a: "Selecione o município do Ceará na lista (184 municípios). O sistema consulta o Censo Escolar e lista as escolas daquele município. Clique na sua escola para cadastrá-la automaticamente com código INEP." },
  { q: "Como cadastrar professores?", a: "O professor pode se cadastrar sozinho em educatio.digital escolhendo a escola na lista. Ou você pode importar vários professores de uma vez via arquivo CSV/Excel — clique em 'Baixar modelo' na seção Importar Alunos." },
  { q: "Como definir as salas?", a: "As salas são definidas no cadastro da escola (padrão: A, B, C). Professores e alunos selecionam a sala ao se cadastrar. Para alterar, recadastre a escola com as novas salas." },
  { q: "Posso ter vários professores na mesma escola?", a: "Sim! Cada professor se vincula à escola e seleciona sua matéria e sala. O aluno escolhe qual professor é seu responsável." },
];

const FAQ_PROFESSOR: FaqItem[] = [
  { q: "Como me cadastrar como professor?", a: "Acesse educatio.digital → Cadastrar → perfil Professor → selecione a escola (já deve estar cadastrada) → escolha sala e matéria → preencha seus dados." },
  { q: "Como cadastrar alunos em lote?", a: "Faça login → role até 'Importar Alunos' → clique 'Baixar modelo' para obter o CSV → preencha no Excel (colunas: nome, nome_completo, nome_mae, data_nascimento, sexo, cpf, matricula, serie, sala, email, senha) → faça upload. Os alunos ficam vinculados a você e sua escola automaticamente." },
  { q: "Como criar uma prova?", a: "Em Provas → + Nova prova → preencha título, data, série, sala, matéria → adicione questões (múltipla escolha, dissertativa ou cálculo) → Publicar. Alunos da série/sala verão a prova." },
  { q: "Como corrigir provas?", a: "Em Provas → clique na prova → Ver respostas → clique no aluno. Múltipla escolha já está auto-corrigida. Para dissertativa e cálculo, veja a resposta e os cálculos do aluno, atribua nota (0 a X pontos) e comentário → Finalizar correção." },
  { q: "Como criar um plano de aula?", a: "Em Planos de Aula → + Novo plano → preencha data, série, matéria, título → use o editor completo (negrito, itálico, listas, fontes, links) para o conteúdo → clique 'IA ajudar' para sugestões → Salvar." },
  { q: "O aluno pode descrever os cálculos?", a: "Sim! Na questão tipo 'Cálculo', o aluno tem um campo para a resposta final e um editor rich text para descrever todos os passos do raciocínio. Você verá os cálculos detalhados na correção." },
  { q: "Qual o formato do arquivo de importação?", a: "CSV com separador ponto e vírgula (;). Codificação UTF-8. Colunas: nome;nome_completo;nome_mae;data_nascimento;sexo;cpf;matricula;serie;sala;email;senha. Se email/senha vazios, o sistema usa matrícula como padrão." },
];

const FAQ_ALUNO: FaqItem[] = [
  { q: "Como me cadastrar?", a: "Acesse educatio.digital → Cadastrar → perfil Aluno → selecione a escola → selecione o professor responsável → escolha sala e série → preencha nome, matrícula (obrigatória), email e senha." },
  { q: "Como estudar?", a: "Faça login → você verá as matérias da sua série. Clique em uma matéria para ver os tópicos organizados em Básico (verde), Intermediário (amarelo) e Avançado (vermelho). Cada tópico mostra o código BNCC/DCRC." },
  { q: "Como funciona o quiz?", a: "Selecione uma matéria e o quiz aparece abaixo. Escolha a alternativa correta. Se acertar: +20 pontos. Se errar: veja a explicação e use o botão 'Perguntar à IA' para tirar dúvidas." },
  { q: "Como fazer uma prova?", a: "Em 'Provas disponíveis', clique Iniciar. Responda cada questão — múltipla escolha (selecione), dissertativa (escreva no editor), cálculo (resposta final + descreva os passos). Seu progresso é salvo automaticamente. Quando terminar, clique 'Enviar prova'." },
  { q: "Posso sair e voltar para a prova?", a: "Sim! O progresso é salvo automaticamente. Quando voltar, clique 'Continuar' na prova." },
  { q: "Como ver minha nota?", a: "Após o professor corrigir, o botão 'Ver nota' aparece na prova. Você verá a nota total e feedback por questão." },
  { q: "O que mostrar no cálculo?", a: "Descreva todos os passos: operações intermediárias, fórmulas usadas, raciocínio. Use o editor para formatar — negrito para destacar resultados, listas para organizar passos." },
];

const FAQS: Record<string, FaqItem[]> = {
  todos: FAQ_GERAL,
  administrador: FAQ_ESCOLA,
  professor: FAQ_PROFESSOR,
  aluno: FAQ_ALUNO,
};

interface AjudaPanelProps {
  onClose: () => void;
}

export default function AjudaPanel({ onClose }: AjudaPanelProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<string>(user?.role || "todos");

  const faq = FAQS[tab] || FAQ_GERAL;

  return (
    <div className="card overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="bg-ceara-azul text-white px-4 py-3 flex items-center gap-3">
        <span className="text-xl">❓</span>
        <div className="flex-1">
          <h2 className="font-bold text-sm">Central de Ajuda</h2>
          <p className="text-white/70 text-[11px]">Manuais e perguntas frequentes</p>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white text-xl font-bold">&times;</button>
      </div>

      {/* Tabs por perfil */}
      <div className="flex border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.role}
            onClick={() => setTab(t.role)}
            className={`flex-1 py-2.5 text-center text-[11px] font-bold transition-colors ${
              tab === t.role ? "text-ceara-azul border-b-2 border-ceara-azul bg-ceara-azul-light/30" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="block text-base mb-0.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
        {faq.map((item, i) => (
          <FaqAccordion key={i} q={item.q} a={item.a} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <p className="text-[10px] text-gray-400 text-center">
          Educatio v2.2.0 — Recomposição da aprendizagem · BNCC & DCRC Ceará
        </p>
        <p className="text-[10px] text-gray-400 text-center mt-0.5">
          © 2026 Sistemas Guarany · (85) 99649-6064
        </p>
      </div>
    </div>
  );
}

function FaqAccordion({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
        <span className={`text-gray-400 transition-transform text-xs ${open ? "rotate-90" : ""}`}>▶</span>
        <span className="text-sm font-semibold text-gray-800 flex-1">{q}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-0 animate-fade-up">
          <p className="text-xs text-gray-600 leading-relaxed pl-5">{a}</p>
        </div>
      )}
    </div>
  );
}
