# Educatio — Guia para Claude Code

## Visão geral
Plataforma de recomposição da aprendizagem para alunos do **6º ao 9º ano**, alinhada à **BNCC** e **DCRC do Ceará**.
Stack: **Next.js 14 · TypeScript · Tailwind CSS · Framer Motion**

---

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   └── page.tsx            # Página principal (dashboard)
├── components/
│   ├── layout/
│   │   └── Header.tsx      # Header com cores do Ceará
│   ├── dashboard/
│   │   ├── StatsBar.tsx    # Pontos, atividades, sequência
│   │   ├── SerieSelector.tsx
│   │   ├── SubjectGrid.tsx
│   │   └── TopicsPanel.tsx
│   └── quiz/
│       └── QuizPanel.tsx   # Quiz gamificado
├── lib/
│   ├── data.ts             # Conteúdos BNCC/DCRC por série
│   └── utils.ts            # cn(), helpers de status
├── types/
│   └── index.ts            # Tipos TypeScript
└── styles/
    └── globals.css         # Tailwind + fontes + utilitários
```

---

## Paleta de cores (Bandeira do Ceará)

| Token Tailwind              | Hex       | Uso                        |
|-----------------------------|-----------|----------------------------|
| `ceara-verde`               | `#006847` | Cor primária, CTAs         |
| `ceara-verde-mid`           | `#008A5C` | Hover                      |
| `ceara-verde-light`         | `#D4EDE4` | Fundos, badges             |
| `ceara-amarelo`             | `#F5C800` | Destaques, barra progresso |
| `ceara-amarelo-light`       | `#FEF5C3` | Badges DCRC                |
| `ceara-azul`                | `#003082` | Azul institucional         |
| `ceara-azul-mid`            | `#1A4BA0` | —                          |
| `ceara-azul-light`          | `#D6E1F5` | Badges BNCC                |
| `ceara-sol`                 | `#F0A500` | Ciências, Inglês           |

---

## Comandos úteis

```bash
npm run dev          # Servidor local http://localhost:3000
npm run build        # Build de produção
npm run lint         # ESLint
npm run type-check   # TypeScript sem emitir arquivos
```

---

## Como adicionar conteúdo

### Nova questão de quiz
Edite `src/lib/data.ts`, array `QUIZ_QUESTIONS`:

```ts
{
  id: "q99",
  subjectId: "mat6",   // deve existir em SUBJECTS_BY_SERIE["6"]
  serie: "6",
  bnccSkill: "EF06MA07",
  question: "Qual é o MMC de 4 e 6?",
  options: ["8", "12", "24", "6"],
  correctIndex: 1,
  explanation: "O MMC(4,6) = 12, pois 12 é o menor múltiplo comum.",
}
```

### Novo tópico
Dentro do subject em `SUBJECTS_BY_SERIE`, adicione ao array `topics`:

```ts
{ id: "mat6-5", title: "Meu novo tópico", status: "todo", bnccCode: "EF06MA15" }
```

---

## Deploy

### Vercel (recomendado)
```bash
# 1. Instale a CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Produção
vercel --prod
```

### GitHub → Vercel automático
1. Faça push para `main`
2. Vercel detecta o Next.js e faz deploy automaticamente
3. CI do GitHub Actions roda lint + build antes

---

## Convenções

- Componentes em **PascalCase**, arquivos `.tsx`
- Funções utilitárias em **camelCase**, arquivo `utils.ts`
- Todos os textos em **português brasileiro**
- Referências BNCC no formato `EF{serie}{disciplina}{número}` (ex: `EF06MA07`)
- Referências DCRC no formato `DCRC-CE-{MAT|POR|...}-{serie}-{num}`
- Usar `cn()` de `@/lib/utils` para classes condicionais
- Evitar `any` — tipar com os tipos de `@/types/index.ts`
