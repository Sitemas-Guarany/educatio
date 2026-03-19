# Educatio

Plataforma de **recomposicao da aprendizagem** para alunos do **6o ao 9o ano**, alinhada a **BNCC** e **DCRC do Ceara**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

**Producao**: https://educatio.digital

---

## Funcionalidades

### Sistema de cadastro hierarquico
- **Escola**: busca automatica no Censo Escolar INEP por municipio do Ceara (API IBGE) ou cadastro manual
- **Professor**: vinculado a escola, com materia e sala
- **Aluno**: vinculado a escola + professor, com serie, sala e matricula obrigatoria
- **Importacao em lote**: professores e alunos via CSV/Excel com modelo para download

### Conteudo pedagogico
- **6 materias** por serie: Matematica, Portugues, Ciencias, Geografia, Historia, Ingles
- **3 niveis** por topico: Basico, Intermediario, Avancado
- **Rastreamento BNCC/DCRC**: cada topico vinculado ao codigo da habilidade
- **Quiz gamificado**: pontuacao, feedback explicativo, IA no erro

### Sistema de provas
- **3 tipos de questao**: multipla escolha (auto-corrigida), dissertativa, calculo
- **Calculo detalhado**: aluno descreve passos da resolucao em editor rich text
- **Auto-save**: progresso salvo automaticamente durante a prova
- **Correcao**: professor ve respostas, atribui notas e comentarios
- **Resultado**: aluno ve nota total e feedback por questao

### Plano de aula
- **Editor completo** (Tiptap): negrito, italico, sublinhado, tachado, sobrescrito, destaque, listas (marcadores, numerada, verificacao), alinhamento, recuo, links, fontes
- **Metadados**: data, serie, materia, objetivos, notas
- **IA integrada**: Claude ajuda a elaborar o plano

### IA educacional
- **Tutor por materia/topico**: respostas didaticas, linguagem acessivel, exemplos cearenses
- **Ajuda no quiz**: quando aluno erra, pode perguntar a IA
- **Ajuda no plano de aula**: professor pede sugestoes a IA
- **API**: Claude Haiku via `/api/chat`

### PWA
- Instalavel em celular e desktop
- Icone com identidade do Ceara (verde + E amarelo)
- Service worker com cache offline
- Safe areas para notch/barra

---

## Arquitetura

```
Escola (INEP/manual)
  +-- Professor (escola + materia + sala)
  |     +-- Aluno (escola + professor + serie + sala + matricula)
  |     +-- PlanoAula (editor Tiptap)
  |     +-- Prova (multipla escolha / dissertativa / calculo)
  |           +-- SubmissaoProva (respostas + notas + comentarios)
```

### Dependencias principais

| Pacote | Versao | Uso |
|--------|--------|-----|
| next | 14.2.5 | Framework React (App Router) |
| react | 18.3.1 | UI |
| tailwindcss | 3.4.6 | Estilizacao |
| @tiptap/* | 2.x | Editor rich text (13 extensoes) |
| framer-motion | 11.3.8 | Animacoes |
| lucide-react | 0.414.0 | Icones |
| next-pwa | 5.6.0 | PWA service worker |

### APIs externas

| API | Endpoint | Uso |
|-----|----------|-----|
| IBGE Localidades | `servicodados.ibge.gov.br/api/v1/localidades/estados/23/municipios` | Municipios do Ceara |
| Anthropic Claude | `api.anthropic.com/v1/messages` | Tutor IA (via API route) |

### Persistencia (localStorage)

| Chave | Conteudo |
|-------|---------|
| `educatio_users` | Usuarios (alunos, professores, admins) |
| `educatio_escolas` | Escolas cadastradas |
| `educatio_session` | ID do usuario logado |
| `educatio_provas` | Provas criadas |
| `educatio_submissoes` | Submissoes de provas |
| `educatio_planos` | Planos de aula |

---

## Desenvolvimento local

```bash
git clone https://github.com/Sitemas-Guarany/educatio.git
cd educatio
npm install
cp .env.example .env.local
npm run dev
```

Variaveis de ambiente (`.env.local`):
```
NEXT_PUBLIC_SITE_URL=https://educatio.digital
ANTHROPIC_API_KEY=sk-ant-...   # para IA funcionar
```

---

## Deploy

```bash
npx vercel --prod --yes --name educatio
```

**GitHub**: https://github.com/Sitemas-Guarany/educatio
**Vercel**: auto-deploy ao push para `main`
**Dominio**: educatio.digital (DNS na IONOS: A @ -> 76.76.21.21, CNAME www -> cname.vercel-dns.com)

---

## Manual da Escola

### 1. Cadastrar a escola
1. Acesse **educatio.digital**
2. Clique em **Cadastrar**
3. Selecione perfil **Administrador**
4. Na secao **Escola**, escolha:
   - **Buscar no INEP**: selecione o municipio do Ceara, as escolas aparecem automaticamente do Censo Escolar. Clique na sua escola.
   - **Manual**: digite o nome, cidade e salas (A, B, C ou 1, 2, 3)
5. Preencha os dados pessoais, email e senha
6. Clique **Criar conta**

### 2. Cadastrar professores
**Opcao A — Um por vez:**
- O professor acessa educatio.digital, clica em Cadastrar, seleciona perfil Professor, escolhe a escola (que ja aparece na lista) e preenche seus dados.

**Opcao B — Importacao em lote (Excel):**
1. Faca login como administrador
2. Role ate **Importar Alunos** (funciona tambem para professores no CSV)
3. Clique **Baixar modelo** para obter o CSV com as colunas corretas
4. Preencha o CSV no Excel/Google Sheets
5. Faca upload e clique **Importar**

### 3. Gerenciar salas
As salas sao definidas no cadastro da escola (padrao: A, B, C). Professores e alunos selecionam a sala ao se cadastrar.

---

## Manual do Professor

### 1. Cadastrar-se
1. Acesse **educatio.digital** → **Cadastrar**
2. Selecione perfil **Professor**
3. Escolha a escola (deve estar cadastrada)
4. Selecione sala e materia principal
5. Preencha dados pessoais, email e senha

### 2. Cadastrar alunos
**Opcao A — Aluno se cadastra sozinho:**
O aluno acessa educatio.digital, escolhe a escola, seleciona o professor responsavel e se cadastra.

**Opcao B — Importacao via Excel:**
1. Faca login
2. Role ate **Importar Alunos**
3. Clique **Baixar modelo** — colunas: nome, nome_completo, nome_mae, data_nascimento, sexo, cpf, matricula, serie, sala, email, senha
4. Preencha no Excel (separador: ponto e virgula)
5. Faca upload → pre-visualizacao → **Importar**
6. Alunos ficam vinculados a voce e sua escola automaticamente

### 3. Criar prova
1. Role ate **Provas** → **+ Nova prova**
2. Preencha: titulo, data, serie, sala, materia
3. Adicione questoes:
   - **Multipla escolha**: alternativas + marque a correta (auto-corrigida)
   - **Dissertativa**: aluno responde com texto formatado
   - **Calculo**: aluno informa resposta final + descreve os passos da resolucao
4. Clique **Publicar prova** (ou Salvar rascunho)

### 4. Corrigir provas
1. Em **Provas**, clique na prova → **Ver respostas**
2. Clique no aluno para abrir a correcao
3. Multipla escolha: ja esta corrigida automaticamente
4. Dissertativa/Calculo: veja a resposta, os calculos do aluno, atribua nota e comentario
5. Clique **Finalizar correcao**

### 5. Plano de aula
1. Role ate **Planos de Aula** → **+ Novo plano**
2. Preencha data, serie, materia, titulo
3. Use o editor completo para o conteudo (toolbar com negrito, italico, listas, fontes, links, etc)
4. Clique **IA ajudar** para pedir sugestoes ao tutor IA
5. Salve o plano

### 6. Usar a IA
- Em cada materia/topico ha um botao **Perguntar a IA**
- No quiz, quando o aluno erra, aparece o botao IA para explicar
- No plano de aula, o botao **IA ajudar** gera sugestoes

---

## Manual do Aluno

### 1. Cadastrar-se
1. Acesse **educatio.digital** → **Cadastrar**
2. Selecione perfil **Aluno**
3. Escolha a escola (deve estar cadastrada)
4. Selecione o professor responsavel
5. Escolha sala e serie (6o ao 9o ano)
6. Preencha: nome, nome completo, matricula (obrigatoria), email e senha
7. CPF, nome da mae, data de nascimento e sexo sao opcionais

### 2. Estudar
1. Faca login com email e senha
2. Voce vera as **materias da sua serie** (Matematica, Portugues, etc)
3. Clique em uma materia para ver os **topicos** organizados em:
   - Basico (verde)
   - Intermediario (amarelo)
   - Avancado (vermelho)
4. Cada topico mostra o codigo BNCC/DCRC

### 3. Responder quiz
1. Selecione uma materia
2. O quiz aparece abaixo dos topicos
3. Escolha a alternativa correta
4. Se acertar: +20 pontos
5. Se errar: veja a explicacao + botao **Perguntar a IA** para tirar duvidas

### 4. Fazer prova
1. Role ate **Provas disponiveis**
2. Clique **Iniciar** na prova
3. Responda cada questao:
   - **Multipla escolha**: selecione a alternativa
   - **Dissertativa**: escreva no editor de texto (pode usar negrito, listas, etc)
   - **Calculo**: escreva a resposta final + descreva todos os passos da resolucao no editor
4. Seu progresso e salvo automaticamente (pode sair e voltar)
5. Quando terminar, clique **Enviar prova**
6. Apos o professor corrigir, voce vera a nota em **Ver nota**

### 5. Perguntar a IA
- Em qualquer materia ou topico, clique em **Perguntar a IA**
- Digite sua duvida e a IA responde de forma didatica
- Exemplos: "Me explica fracoes", "Como resolver equacao do 2o grau", "O que e fotossintese"

---

## Paleta de cores (Bandeira do Ceara)

| Token | Hex | Uso |
|-------|-----|-----|
| ceara-verde | #006847 | Primaria, botoes, header |
| ceara-amarelo | #F5C800 | Destaques, progresso |
| ceara-azul | #003082 | Institucional, badges BNCC |
| ceara-sol | #F0A500 | Ciencias, Ingles |

---

## Licenca

Projeto privado. Todos os direitos reservados.

(c) 2026 Educatio — Por **Sistemas Guarany** — (85) 99649-6064
