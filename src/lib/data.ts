import type { Subject, QuizQuestion, Serie } from "@/types";

export const SUBJECTS_BY_SERIE: Record<Serie, Subject[]> = {
  "6": [
    {
      id: "mat6", name: "Matemática", icon: "🔢", color: "ceara-verde",
      progress: 40,
      topics: [
        { id: "mat6-1", title: "Números inteiros e frações",       status: "prog", level: "basico",        bnccCode: "EF06MA07", dcrcRef: "DCRC-CE-MAT-6-01" },
        { id: "mat6-2", title: "Potenciação e radiciação",          status: "todo", level: "intermediario", bnccCode: "EF06MA12", dcrcRef: "DCRC-CE-MAT-6-02" },
        { id: "mat6-3", title: "Geometria básica — figuras planas", status: "done", level: "intermediario", bnccCode: "EF06MA18", dcrcRef: "DCRC-CE-MAT-6-03" },
        { id: "mat6-4", title: "Porcentagem e razão",               status: "todo", level: "avancado",      bnccCode: "EF06MA11", dcrcRef: "DCRC-CE-MAT-6-04" },
      ],
    },
    {
      id: "por6", name: "Língua Portuguesa", icon: "📝", color: "ceara-azul",
      progress: 60,
      topics: [
        { id: "por6-1", title: "Ortografia e acentuação",       status: "done", level: "basico",        bnccCode: "EF06LP01" },
        { id: "por6-2", title: "Tipos de texto — narração",     status: "done", level: "basico",        bnccCode: "EF06LP05" },
        { id: "por6-3", title: "Substantivos e adjetivos",      status: "prog", level: "intermediario", bnccCode: "EF06LP09" },
        { id: "por6-4", title: "Leitura e interpretação",       status: "todo", level: "avancado",      bnccCode: "EF06LP02" },
      ],
    },
    {
      id: "cie6", name: "Ciências", icon: "🔬", color: "ceara-sol",
      progress: 25,
      topics: [
        { id: "cie6-1", title: "Célula — unidade da vida",     status: "prog", level: "basico",        bnccCode: "EF06CI05" },
        { id: "cie6-2", title: "Sistemas do corpo humano",     status: "todo", level: "intermediario", bnccCode: "EF06CI07" },
        { id: "cie6-3", title: "Seres vivos e ecossistemas",   status: "done", level: "avancado",      bnccCode: "EF06CI04" },
      ],
    },
    {
      id: "geo6", name: "Geografia", icon: "🌍", color: "ceara-verde",
      progress: 50,
      topics: [
        { id: "geo6-1", title: "Localização e orientação",  status: "done", level: "basico",        bnccCode: "EF06GE01" },
        { id: "geo6-2", title: "Cartografia — mapas",       status: "done", level: "basico",        bnccCode: "EF06GE04" },
        { id: "geo6-3", title: "Paisagem e território",     status: "prog", level: "intermediario", bnccCode: "EF06GE02" },
        { id: "geo6-4", title: "Regiões brasileiras",       status: "todo", level: "avancado",      bnccCode: "EF06GE08" },
      ],
    },
    {
      id: "his6", name: "História", icon: "🏛️", color: "ceara-azul",
      progress: 35,
      topics: [
        { id: "his6-1", title: "Pré-história e antiguidade", status: "done", level: "basico",        bnccCode: "EF06HI01" },
        { id: "his6-2", title: "Civilizações antigas",       status: "prog", level: "intermediario", bnccCode: "EF06HI03" },
        { id: "his6-3", title: "Brasil indígena",            status: "todo", level: "avancado",      bnccCode: "EF06HI06" },
      ],
    },
    {
      id: "ing6", name: "Inglês", icon: "🌐", color: "ceara-sol",
      progress: 20,
      topics: [
        { id: "ing6-1", title: "Alfabeto e pronúncia",       status: "done", level: "basico",        bnccCode: "EF06LI01" },
        { id: "ing6-2", title: "Vocabulário cotidiano",      status: "prog", level: "intermediario", bnccCode: "EF06LI03" },
        { id: "ing6-3", title: "Present Simple",             status: "todo", level: "avancado",      bnccCode: "EF06LI05" },
      ],
    },
  ],
  "7": [
    {
      id: "mat7", name: "Matemática", icon: "🔢", color: "ceara-verde",
      progress: 50,
      topics: [
        { id: "mat7-1", title: "Números racionais e equações", status: "done", level: "basico",        bnccCode: "EF07MA06" },
        { id: "mat7-2", title: "Proporção e porcentagem",      status: "prog", level: "intermediario", bnccCode: "EF07MA11" },
        { id: "mat7-3", title: "Ângulos e triângulos",         status: "todo", level: "avancado",      bnccCode: "EF07MA22" },
      ],
    },
    {
      id: "por7", name: "Língua Portuguesa", icon: "📝", color: "ceara-azul",
      progress: 55,
      topics: [
        { id: "por7-1", title: "Verbos — conjugação",      status: "done", level: "basico",        bnccCode: "EF07LP09" },
        { id: "por7-2", title: "Texto argumentativo",      status: "prog", level: "intermediario", bnccCode: "EF07LP05" },
        { id: "por7-3", title: "Figuras de linguagem",     status: "todo", level: "avancado",      bnccCode: "EF07LP12" },
      ],
    },
    {
      id: "cie7", name: "Ciências", icon: "🔬", color: "ceara-sol",
      progress: 45,
      topics: [
        { id: "cie7-1", title: "Fotossíntese e respiração", status: "done", level: "basico",        bnccCode: "EF07CI07" },
        { id: "cie7-2", title: "Solo e água",               status: "prog", level: "intermediario", bnccCode: "EF07CI09" },
        { id: "cie7-3", title: "Saúde e alimentação",       status: "todo", level: "avancado",      bnccCode: "EF07CI10" },
      ],
    },
    {
      id: "geo7", name: "Geografia", icon: "🌍", color: "ceara-verde",
      progress: 60,
      topics: [
        { id: "geo7-1", title: "Globalização",                status: "done", level: "basico",        bnccCode: "EF07GE01" },
        { id: "geo7-2", title: "Industrialização brasileira", status: "prog", level: "intermediario", bnccCode: "EF07GE06" },
        { id: "geo7-3", title: "Nordeste — Ceará",            status: "todo", level: "avancado",      bnccCode: "EF07GE08", dcrcRef: "DCRC-CE-GEO-7-03" },
      ],
    },
    {
      id: "his7", name: "História", icon: "🏛️", color: "ceara-azul",
      progress: 40,
      topics: [
        { id: "his7-1", title: "Feudalismo",                  status: "done", level: "basico",        bnccCode: "EF07HI01" },
        { id: "his7-2", title: "Cruzadas e Renascimento",     status: "prog", level: "intermediario", bnccCode: "EF07HI04" },
        { id: "his7-3", title: "Colonização do Brasil",       status: "todo", level: "avancado",      bnccCode: "EF07HI06" },
      ],
    },
    {
      id: "ing7", name: "Inglês", icon: "🌐", color: "ceara-sol",
      progress: 30,
      topics: [
        { id: "ing7-1", title: "Past Simple",            status: "done", level: "basico",        bnccCode: "EF07LI02" },
        { id: "ing7-2", title: "Wh-questions",           status: "prog", level: "intermediario", bnccCode: "EF07LI04" },
        { id: "ing7-3", title: "Reading comprehension",  status: "todo", level: "avancado",      bnccCode: "EF07LI06" },
      ],
    },
  ],
  "8": [
    {
      id: "mat8", name: "Matemática", icon: "🔢", color: "ceara-verde",
      progress: 35,
      topics: [
        { id: "mat8-1", title: "Potências e raízes",      status: "done", level: "basico",        bnccCode: "EF08MA01" },
        { id: "mat8-2", title: "Equações do 2º grau",     status: "prog", level: "intermediario", bnccCode: "EF08MA06" },
        { id: "mat8-3", title: "Funções e gráficos",      status: "todo", level: "avancado",      bnccCode: "EF08MA13" },
      ],
    },
    {
      id: "por8", name: "Língua Portuguesa", icon: "📝", color: "ceara-azul",
      progress: 65,
      topics: [
        { id: "por8-1", title: "Orações subordinadas",  status: "done", level: "basico",        bnccCode: "EF08LP09" },
        { id: "por8-2", title: "Redação dissertativa",  status: "done", level: "intermediario", bnccCode: "EF08LP05" },
        { id: "por8-3", title: "Variação linguística",  status: "prog", level: "avancado",      bnccCode: "EF08LP12" },
      ],
    },
    {
      id: "cie8", name: "Ciências", icon: "🔬", color: "ceara-sol",
      progress: 55,
      topics: [
        { id: "cie8-1", title: "Átomo e tabela periódica", status: "done", level: "basico",        bnccCode: "EF08CI01" },
        { id: "cie8-2", title: "Reações químicas",         status: "prog", level: "intermediario", bnccCode: "EF08CI03" },
        { id: "cie8-3", title: "Ondas e luz",              status: "todo", level: "avancado",      bnccCode: "EF08CI05" },
      ],
    },
    {
      id: "geo8", name: "Geografia", icon: "🌍", color: "ceara-verde",
      progress: 70,
      topics: [
        { id: "geo8-1", title: "Urbanização",                      status: "done", level: "basico",        bnccCode: "EF08GE05" },
        { id: "geo8-2", title: "Desigualdade social",              status: "done", level: "intermediario", bnccCode: "EF08GE07" },
        { id: "geo8-3", title: "Meio ambiente e sustentabilidade", status: "prog", level: "avancado",      bnccCode: "EF08GE10" },
      ],
    },
    {
      id: "his8", name: "História", icon: "🏛️", color: "ceara-azul",
      progress: 45,
      topics: [
        { id: "his8-1", title: "Revolução Industrial", status: "done", level: "basico",        bnccCode: "EF08HI03" },
        { id: "his8-2", title: "Imperialismo",         status: "prog", level: "intermediario", bnccCode: "EF08HI06" },
        { id: "his8-3", title: "Brasil Império",       status: "todo", level: "avancado",      bnccCode: "EF08HI08" },
      ],
    },
    {
      id: "ing8", name: "Inglês", icon: "🌐", color: "ceara-sol",
      progress: 40,
      topics: [
        { id: "ing8-1", title: "Future tense",           status: "done", level: "basico",        bnccCode: "EF08LI02" },
        { id: "ing8-2", title: "Conditional sentences",  status: "prog", level: "intermediario", bnccCode: "EF08LI04" },
        { id: "ing8-3", title: "Academic vocabulary",    status: "todo", level: "avancado",      bnccCode: "EF08LI06" },
      ],
    },
  ],
  "9": [
    {
      id: "mat9", name: "Matemática", icon: "🔢", color: "ceara-verde",
      progress: 50,
      topics: [
        { id: "mat9-1", title: "Trigonometria básica",          status: "done", level: "basico",        bnccCode: "EF09MA14" },
        { id: "mat9-2", title: "Estatística e probabilidade",   status: "prog", level: "intermediario", bnccCode: "EF09MA20" },
        { id: "mat9-3", title: "Geometria espacial",            status: "todo", level: "avancado",      bnccCode: "EF09MA18" },
      ],
    },
    {
      id: "por9", name: "Língua Portuguesa", icon: "📝", color: "ceara-azul",
      progress: 75,
      topics: [
        { id: "por9-1", title: "Período composto",               status: "done", level: "basico",        bnccCode: "EF09LP09" },
        { id: "por9-2", title: "Redação para o ENEM",            status: "done", level: "intermediario", bnccCode: "EF09LP05" },
        { id: "por9-3", title: "Análise de textos literários",   status: "prog", level: "avancado",      bnccCode: "EF09LP12" },
      ],
    },
    {
      id: "cie9", name: "Ciências", icon: "🔬", color: "ceara-sol",
      progress: 60,
      topics: [
        { id: "cie9-1", title: "Genética básica",            status: "done", level: "basico",        bnccCode: "EF09CI08" },
        { id: "cie9-2", title: "Evolução das espécies",      status: "prog", level: "intermediario", bnccCode: "EF09CI10" },
        { id: "cie9-3", title: "Ecologia e biomas do Ceará", status: "todo", level: "avancado",      bnccCode: "EF09CI12", dcrcRef: "DCRC-CE-CIE-9-03" },
      ],
    },
    {
      id: "geo9", name: "Geografia", icon: "🌍", color: "ceara-verde",
      progress: 65,
      topics: [
        { id: "geo9-1", title: "Geopolítica mundial",            status: "done", level: "basico",        bnccCode: "EF09GE01" },
        { id: "geo9-2", title: "Questões ambientais globais",    status: "prog", level: "intermediario", bnccCode: "EF09GE08" },
        { id: "geo9-3", title: "Brasil no mundo",               status: "todo", level: "avancado",      bnccCode: "EF09GE10" },
      ],
    },
    {
      id: "his9", name: "História", icon: "🏛️", color: "ceara-azul",
      progress: 55,
      topics: [
        { id: "his9-1", title: "Guerras Mundiais",               status: "done", level: "basico",        bnccCode: "EF09HI03" },
        { id: "his9-2", title: "Era Vargas",                     status: "prog", level: "intermediario", bnccCode: "EF09HI07" },
        { id: "his9-3", title: "Ditadura e redemocratização",    status: "todo", level: "avancado",      bnccCode: "EF09HI09" },
      ],
    },
    {
      id: "ing9", name: "Inglês", icon: "🌐", color: "ceara-sol",
      progress: 50,
      topics: [
        { id: "ing9-1", title: "Present perfect",  status: "done", level: "basico",        bnccCode: "EF09LI02" },
        { id: "ing9-2", title: "Passive voice",    status: "prog", level: "intermediario", bnccCode: "EF09LI04" },
        { id: "ing9-3", title: "Essay writing",    status: "todo", level: "avancado",      bnccCode: "EF09LI06" },
      ],
    },
  ],
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Matemática
  { id: "q1", subjectId: "mat6", serie: "6", bnccSkill: "EF06MA07",
    question: "Quanto é 3/4 + 1/2?",
    options: ["5/4", "4/6", "1/4", "2/4"], correctIndex: 0,
    explanation: "Igualamos os denominadores: 3/4 + 2/4 = 5/4." },
  { id: "q2", subjectId: "mat6", serie: "6", bnccSkill: "EF06MA12",
    question: "Qual é o resultado de 2³?",
    options: ["6", "8", "9", "5"], correctIndex: 1,
    explanation: "2³ = 2 × 2 × 2 = 8." },
  { id: "q3", subjectId: "mat7", serie: "7", bnccSkill: "EF07MA11",
    question: "Se 30% de um número é 15, qual é esse número?",
    options: ["45", "50", "60", "30"], correctIndex: 1,
    explanation: "30% × x = 15 → x = 15 ÷ 0,3 = 50." },
  { id: "q4", subjectId: "mat8", serie: "8", bnccSkill: "EF08MA06",
    question: "Quais são as raízes de x² - 5x + 6 = 0?",
    options: ["2 e 3", "1 e 6", "-2 e -3", "3 e 4"], correctIndex: 0,
    explanation: "x² - 5x + 6 = (x-2)(x-3) = 0 → x = 2 ou x = 3." },
  { id: "q5", subjectId: "mat9", serie: "9", bnccSkill: "EF09MA14",
    question: "Em um triângulo retângulo, sen(30°) é igual a:",
    options: ["√3/2", "1/2", "√2/2", "1"], correctIndex: 1,
    explanation: "sen(30°) = 1/2 é um valor trigonométrico fundamental." },

  // Língua Portuguesa
  { id: "q6", subjectId: "por6", serie: "6", bnccSkill: "EF06LP09",
    question: "Qual alternativa contém apenas substantivos?",
    options: ["casa, carro, árvore", "bonito, rápido, alto", "correr, pular, andar", "muito, sempre, aqui"],
    correctIndex: 0,
    explanation: "Substantivos nomeiam seres, objetos e lugares: casa, carro, árvore." },
  { id: "q7", subjectId: "por6", serie: "6", bnccSkill: "EF06LP09",
    question: "Na frase 'O sol brilha forte', 'forte' é um:",
    options: ["Substantivo", "Verbo", "Advérbio", "Pronome"], correctIndex: 2,
    explanation: "Modifica o verbo 'brilha', por isso é advérbio de modo." },
  { id: "q8", subjectId: "por7", serie: "7", bnccSkill: "EF07LP09",
    question: "Qual é o modo verbal de 'Estude todos os dias!'?",
    options: ["Indicativo", "Subjuntivo", "Imperativo", "Infinitivo"], correctIndex: 2,
    explanation: "Ordens e pedidos são expressos pelo modo Imperativo." },
  { id: "q9", subjectId: "por9", serie: "9", bnccSkill: "EF09LP09",
    question: "'Quando chegar em casa, ligue para mim.' A oração sublinhada é:",
    options: ["Adverbial temporal", "Adverbial causal", "Substantiva", "Adjetiva"], correctIndex: 0,
    explanation: "Indica tempo, portanto é oração adverbial temporal." },

  // Ciências
  { id: "q10", subjectId: "cie6", serie: "6", bnccSkill: "EF06CI05",
    question: "Qual organela realiza a fotossíntese nas células vegetais?",
    options: ["Mitocôndria", "Cloroplasto", "Núcleo", "Vacúolo"], correctIndex: 1,
    explanation: "O cloroplasto possui clorofila, pigmento que capta a luz solar." },
  { id: "q11", subjectId: "cie8", serie: "8", bnccSkill: "EF08CI01",
    question: "O número atômico de um elemento indica:",
    options: ["Número de nêutrons", "Número de prótons", "Massa atômica", "Número de elétrons na camada externa"],
    correctIndex: 1,
    explanation: "O número atômico (Z) indica o número de prótons no núcleo." },
  { id: "q12", subjectId: "cie9", serie: "9", bnccSkill: "EF09CI08",
    question: "Dois alelos dominantes (AA) no mesmo gene resultam em um indivíduo:",
    options: ["Heterozigoto recessivo", "Heterozigoto dominante", "Homozigoto dominante", "Homozigoto recessivo"],
    correctIndex: 2,
    explanation: "AA = dois alelos iguais e dominantes → homozigoto dominante." },

  // Geografia
  { id: "q13", subjectId: "geo6", serie: "6", bnccSkill: "EF06GE08",
    question: "Qual é a maior região do Brasil em extensão territorial?",
    options: ["Nordeste", "Sudeste", "Norte", "Centro-Oeste"], correctIndex: 2,
    explanation: "A Região Norte ocupa cerca de 45% do território brasileiro." },
  { id: "q14", subjectId: "geo7", serie: "7", bnccSkill: "DCRC-CE-GEO-7-03",
    question: "O Ceará está localizado em qual região do Brasil?",
    options: ["Norte", "Nordeste", "Centro-Oeste", "Sudeste"], correctIndex: 1,
    explanation: "O Ceará integra a Região Nordeste, com capital Fortaleza." },

  // História
  { id: "q15", subjectId: "his6", serie: "6", bnccSkill: "EF06HI01",
    question: "Em que ano o Brasil se tornou independente de Portugal?",
    options: ["1500", "1822", "1889", "1808"], correctIndex: 1,
    explanation: "A Independência foi proclamada por Dom Pedro I em 7 de setembro de 1822." },
  { id: "q16", subjectId: "his9", serie: "9", bnccSkill: "EF09HI03",
    question: "A Primeira Guerra Mundial terminou em:",
    options: ["1914", "1918", "1939", "1945"], correctIndex: 1,
    explanation: "O armistício foi assinado em 11 de novembro de 1918." },

  // Inglês
  { id: "q17", subjectId: "ing6", serie: "6", bnccSkill: "EF06LI05",
    question: "What is the correct sentence in Present Simple (3rd person)?",
    options: ["She go to school", "She goes to school", "She going to school", "She goed to school"],
    correctIndex: 1,
    explanation: "In Present Simple, 3rd person singular adds -s or -es to the verb." },
  { id: "q18", subjectId: "ing8", serie: "8", bnccSkill: "EF08LI04",
    question: "Which sentence is in the Passive Voice?",
    options: ["She wrote the letter", "The letter was written by her", "She is writing the letter", "She will write the letter"],
    correctIndex: 1,
    explanation: "'The letter was written by her' uses the passive structure: to be + past participle." },

  // Novas questões
  { id: "q19", subjectId: "cie7", serie: "7", bnccSkill: "EF07CI07",
    question: "Qual gás é liberado pelas plantas durante a fotossíntese?",
    options: ["Gás carbônico", "Nitrogênio", "Oxigênio", "Hidrogênio"], correctIndex: 2,
    explanation: "Na fotossíntese, as plantas absorvem CO₂ e liberam O₂ (oxigênio) como subproduto." },
  { id: "q20", subjectId: "geo7", serie: "7", bnccSkill: "EF07GE06",
    question: "Qual região do Brasil concentra a maior parte da atividade industrial?",
    options: ["Norte", "Nordeste", "Sudeste", "Centro-Oeste"], correctIndex: 2,
    explanation: "O Sudeste, especialmente São Paulo, concentra o maior parque industrial do país." },
  { id: "q21", subjectId: "cie8", serie: "8", bnccSkill: "EF08CI03",
    question: "Em uma reação química, o que se conserva de acordo com a Lei de Lavoisier?",
    options: ["O volume total", "A temperatura", "A massa total", "O número de substâncias"], correctIndex: 2,
    explanation: "A Lei de Lavoisier (conservação da massa) afirma que a massa total dos reagentes é igual à dos produtos." },
  { id: "q22", subjectId: "his8", serie: "8", bnccSkill: "EF08HI06",
    question: "O Imperialismo do século XIX caracterizou-se principalmente pela:",
    options: ["União dos países europeus", "Dominação de territórios na África e Ásia", "Independência das colônias americanas", "Expansão do feudalismo"],
    correctIndex: 1,
    explanation: "O Imperialismo foi marcado pela partilha e dominação de territórios africanos e asiáticos pelas potências europeias." },
  { id: "q23", subjectId: "cie9", serie: "9", bnccSkill: "EF09CI10",
    question: "Segundo a teoria da evolução de Darwin, o mecanismo principal da evolução é:",
    options: ["Uso e desuso", "Herança de caracteres adquiridos", "Seleção natural", "Geração espontânea"], correctIndex: 2,
    explanation: "Darwin propôs que a seleção natural favorece indivíduos mais adaptados ao ambiente, promovendo a evolução." },
  { id: "q24", subjectId: "geo9", serie: "9", bnccSkill: "EF09GE08",
    question: "Qual é a principal causa do aquecimento global?",
    options: ["Desmatamento oceânico", "Aumento da emissão de gases de efeito estufa", "Diminuição da camada de ozônio", "Excesso de chuvas"],
    correctIndex: 1,
    explanation: "O aumento da emissão de gases como CO₂ e metano intensifica o efeito estufa, elevando a temperatura média do planeta." },
  { id: "q25", subjectId: "his6", serie: "6", bnccSkill: "EF06HI03",
    question: "Qual civilização antiga construiu as pirâmides de Gizé?",
    options: ["Mesopotâmia", "Grécia", "Egito", "Roma"], correctIndex: 2,
    explanation: "As pirâmides de Gizé foram construídas no Egito Antigo como túmulos para os faraós." },
  { id: "q26", subjectId: "mat8", serie: "8", bnccSkill: "EF08MA01",
    question: "Qual é o resultado de √144?",
    options: ["11", "12", "13", "14"], correctIndex: 1,
    explanation: "√144 = 12, pois 12 × 12 = 144." },
];
