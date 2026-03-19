# Educatio — Guia para Claude Code

## Visao geral

Plataforma de **recomposicao da aprendizagem** para alunos do **6o ao 9o ano**, alinhada a **BNCC** e **DCRC do Ceara**.

- **Producao**: https://educatio.digital
- **GitHub**: https://github.com/Sitemas-Guarany/educatio
- **Hosting**: Vercel (deploy via `npx vercel --prod --yes --name educatio`)
- **Dominio**: educatio.digital (DNS na IONOS)
- **Versao**: 2.2.0

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Estilizacao | Tailwind CSS 3 |
| Editor rich text | Tiptap (starter-kit + 10 extensoes) |
| Animacoes | Framer Motion 11 |
| Icones | Lucide React |
| PWA | next-pwa (service worker, manifest) |
| IA | Claude Haiku via API Anthropic |
| Dados externos | API IBGE (municipios), INEP Censo Escolar (escolas) |
| Persistencia | localStorage (sem backend) |

---

## Estrutura do projeto

```
src/
  app/
    layout.tsx              # Root layout + AuthProvider + metadata PWA
    page.tsx                # Pagina principal (dashboard protegido)
    api/
      chat/route.ts         # API IA Claude (tutor educacional)
      ibge/municipios/route.ts  # Proxy IBGE municipios do Ceara
      escolas/route.ts      # Busca escolas INEP por municipio

  components/
    layout/
      Header.tsx            # Header verde Ceara + nome usuario + logout
      Footer.tsx            # Rodape com copyright Sistemas Guarany
    dashboard/
      StatsBar.tsx          # Pontos, atividades, sequencia
      SerieSelector.tsx     # Seletor 6o-9o ano
      SubjectGrid.tsx       # Grid de materias
      TopicsPanel.tsx       # Topicos agrupados por nivel (basico/intermediario/avancado)
    quiz/
      QuizPanel.tsx         # Quiz gamificado com IA no erro
    auth/
      AuthPage.tsx          # Login + cadastro hierarquico (Escola > Professor > Aluno)
      EscolaCadastro.tsx    # Busca escola INEP por municipio ou cadastro manual
    planoaula/
      PlanosAulaPanel.tsx   # CRUD planos de aula
      PlanoAulaEditor.tsx   # Editor com Tiptap + metadados
      EditorToolbar.tsx     # Toolbar: negrito, italico, listas, fontes, alinhamento, etc
    prova/
      ProvasPanel.tsx       # Professor: lista + gerencia provas
      ProvaEditor.tsx       # Criar/editar prova com questoes
      QuestaoEditor.tsx     # Editor de questao (multipla escolha / dissertativa / calculo)
      ProvasAlunoPanel.tsx  # Aluno: lista provas + realizar + ver resultado
      CorrecaoPanel.tsx     # Professor: corrigir submissoes com notas e comentarios
    ai/
      AiButton.tsx          # Botao "Perguntar a IA" reutilizavel
      AiChatModal.tsx       # Modal de chat com Claude
    social/
      FeedSocial.tsx        # Mural: professores (entre profs) e turma (prof+alunos)
    admin/
      ImportAlunos.tsx      # Importacao CSV/Excel de alunos (professor/admin)

  lib/
    auth.tsx                # AuthProvider + useAuth (localStorage, roles, escolas, hierarquia)
    data.ts                 # Conteudos BNCC/DCRC por serie (6o-9o, 6 materias, 3 niveis)
    provas.ts               # CRUD provas + submissoes + auto-correcao (localStorage)
    social.ts               # Posts e comentarios (mural professores + turma)
    notificacoes.ts         # Sistema de notificacoes (prova, mensagem, post)
    utils.ts                # cn(), masks (CPF, data), validacao CPF, calculo idade, niveis

  types/
    index.ts                # Todos os tipos: User, Escola, Serie, Prova, Submissao, etc

  styles/
    globals.css             # Tailwind + Tiptap styles + PWA safe areas

public/
    manifest.json           # PWA manifest
    icon-192.png            # Icone PWA 192px
    icon-512.png            # Icone PWA 512px (maskable)
    favicon.png             # Favicon 48px
    icon.svg                # Icone vetorial
```

---

## Hierarquia e vinculos

```
Escola (INEP ou manual)
  escolaId, nome, codigo INEP, cidade, salas[]
    |
    +-- Professor (vinculado a escolaId)
    |     professorId, materia, sala
    |     |
    |     +-- Aluno (vinculado a escolaId + professorId)
    |           serie, sala, matricula (obrigatoria)
    |
    +-- Prova (criada pelo professor, vinculada a escolaId + serie + sala)
    |     questoes[]: multipla_escolha | dissertativa | calculo
    |     |
    |     +-- SubmissaoProva (aluno responde)
    |           respostas[], notas[], comentarios[]
    |
    +-- PlanoAula (criado pelo professor)
          data, materia, serie, conteudo (HTML Tiptap)
```

---

## Comandos

```bash
npm run dev          # http://localhost:3000
npm run build        # Build producao
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Deploy

```bash
npx vercel --prod --yes --name educatio   # Deploy producao
git push origin main                       # Push para GitHub
```

## Convencoes

- Componentes em PascalCase, arquivos .tsx
- Textos em portugues brasileiro
- BNCC: EF{serie}{disciplina}{numero} (ex: EF06MA07)
- DCRC: DCRC-CE-{MAT|POR|...}-{serie}-{num}
- Cores: paleta bandeira do Ceara (verde #006847, amarelo #F5C800, azul #003082)
- Persistencia: localStorage (chaves educatio_*)
  - educatio_users, educatio_escolas, educatio_session
  - educatio_provas, educatio_submissoes, educatio_planos
  - educatio_posts, educatio_comentarios, educatio_notificacoes
  - educatio_stats_{userId}
