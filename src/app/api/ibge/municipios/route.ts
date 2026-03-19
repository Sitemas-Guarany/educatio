import { NextRequest, NextResponse } from "next/server";

// Cache municipalities in memory (they rarely change)
let cache: Record<string, { data: any; ts: number }> = {};
const TTL = 24 * 60 * 60 * 1000; // 24h

export async function GET(req: NextRequest) {
  const uf = req.nextUrl.searchParams.get("uf") || "23"; // 23 = Ceará

  const cacheKey = `mun_${uf}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].ts < TTL) {
    return NextResponse.json(cache[cacheKey].data);
  }

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error("IBGE API error");
    const raw = await res.json();
    const data = raw.map((m: any) => ({
      id: m.id,
      nome: m.nome,
    }));
    cache[cacheKey] = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar municípios" }, { status: 502 });
  }
}
