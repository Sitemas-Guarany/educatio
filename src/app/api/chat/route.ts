import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chave da API não configurada." }, { status: 500 });
  }

  try {
    const { messages, subject, serie, topic } = await req.json();

    const systemPrompt = `Você é um tutor educacional do Educatio, plataforma de recomposição da aprendizagem do Ceará (BNCC e DCRC).
Matéria: ${subject}. Série: ${serie}º ano.${topic ? ` Tópico: ${topic}.` : ""}

Regras:
- Responda em português brasileiro, linguagem acessível para alunos do ${serie}º ano
- Seja didático, use exemplos do cotidiano cearense quando possível
- Respostas curtas e objetivas (máximo 3 parágrafos)
- Use emojis educativos com moderação
- Se o aluno pedir resolução de exercício, explique passo a passo
- Não fuja do tema da matéria/tópico`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Erro da API: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "Sem resposta.";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
