# 📚 Educatio

Plataforma lúdica e didática de **recuperação escolar** para alunos do **6º ao 9º ano**, alinhada à **BNCC** (Base Nacional Curricular Comum) e à **DCRC do Ceará** (Diretriz Curricular Referencial do Ceará).

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Funcionalidades

- 🎯 **Seleção por série** — 6º, 7º, 8º e 9º ano
- 📚 **6 matérias por série** — Matemática, Português, Ciências, Geografia, História e Inglês
- 🏷️ **Rastreamento BNCC/DCRC** — cada tópico vinculado ao código da habilidade
- 🎮 **Quiz gamificado** — questões com pontuação e feedback explicativo
- 📊 **Progresso visual** — barras de progresso por matéria e geral
- 🔥 **Sequência de dias** — engajamento contínuo
- 🌐 **Multiplataforma** — responsivo para mobile, tablet e desktop
- 🎨 **Cores do Ceará** — verde, amarelo e azul da bandeira estadual

---

## 🚀 Início rápido

### Pré-requisitos
- Node.js 18+ 
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/educatio.git
cd educatio

# Instale as dependências
npm install

# Copie as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**

---

## 🏗️ Stack tecnológica

| Tecnologia       | Versão  | Uso                            |
|------------------|---------|--------------------------------|
| Next.js          | 14      | Framework React (App Router)   |
| TypeScript       | 5       | Tipagem estática               |
| Tailwind CSS     | 3       | Estilização utilitária         |
| Framer Motion    | 11      | Animações                      |
| Lucide React     | latest  | Ícones                         |

---

## 🎨 Paleta — Bandeira do Ceará

```css
--ceara-verde:        #006847   /* Verde principal */
--ceara-amarelo:      #F5C800   /* Amarelo/ouro */
--ceara-azul:         #003082   /* Azul institucional */
--ceara-sol:          #F0A500   /* Laranja-dourado */
```

---

## 📁 Estrutura

```
educatio/
├── src/
│   ├── app/                  # App Router (Next.js 14)
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── dashboard/        # Stats, Séries, Matérias, Tópicos
│   │   └── quiz/             # Quiz gamificado
│   ├── lib/
│   │   ├── data.ts           # Conteúdo BNCC/DCRC por série
│   │   └── utils.ts          # Utilitários
│   ├── types/                # Tipos TypeScript
│   └── styles/               # CSS global + Tailwind
├── .github/workflows/        # CI/CD GitHub Actions
├── CLAUDE.md                 # Guia para Claude Code
├── vercel.json               # Configuração Vercel
└── README.md
```

---

## 🌐 Deploy na Vercel

### Opção 1 — Interface web (mais fácil)

1. Faça fork deste repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project**
3. Importe o repositório
4. Clique em **Deploy** — a Vercel detecta o Next.js automaticamente

### Opção 2 — CLI

```bash
npm i -g vercel
vercel        # staging
vercel --prod # produção
```

### Opção 3 — GitHub Actions automático

Qualquer push para `main` dispara o workflow de CI e o deploy automático na Vercel.

---

## 🤖 Claude Code

Este projeto inclui `CLAUDE.md` com instruções otimizadas para o **Claude Code**.

```bash
# No terminal, dentro da pasta do projeto:
claude

# Exemplos de comandos para o Claude Code:
# "Adicione 5 novas questões de Matemática para o 7º ano"
# "Crie uma página de relatório de desempenho do aluno"
# "Adicione suporte a tema escuro"
# "Implemente persistência local com localStorage"
```

---

## 📋 Alinhamento curricular

| Série | BNCC       | DCRC Ceará | Matérias |
|-------|------------|------------|----------|
| 6º ano | EF06xx    | DCRC-CE-xx-6 | Mat, Por, Cie, Geo, His, Ing |
| 7º ano | EF07xx    | DCRC-CE-xx-7 | Mat, Por, Cie, Geo, His, Ing |
| 8º ano | EF08xx    | DCRC-CE-xx-8 | Mat, Por, Cie, Geo, His, Ing |
| 9º ano | EF09xx    | DCRC-CE-xx-9 | Mat, Por, Cie, Geo, His, Ing |

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE) para detalhes.

---

Feito com 💚 para os alunos do Ceará 🌵
