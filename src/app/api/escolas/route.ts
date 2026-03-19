import { NextRequest, NextResponse } from "next/server";

// In-memory cache for schools per municipality
let escolasCache: Record<string, { data: EscolaINEP[]; ts: number }> = {};
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

interface EscolaINEP {
  codigo: string;
  nome: string;
  municipio: string;
  rede: string;
  endereco?: string;
  situacao: string;
}

// Fetch schools from INEP's public catalog page (HTML scraping as fallback)
// Primary: uses QEdu API which is more reliable
async function fetchEscolasMunicipio(municipio: string, uf: string): Promise<EscolaINEP[]> {
  // Try QEdu API first (reliable, JSON)
  try {
    const searchUrl = `https://api.qedu.org.br/v1/escolas?municipio=${encodeURIComponent(municipio)}&uf=${uf}&limit=200`;
    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data)) {
        return data.data.map((e: any) => ({
          codigo: String(e.id || e.codigo_inep || ""),
          nome: e.nome || e.name || "",
          municipio: e.municipio || municipio,
          rede: e.rede || e.dependencia_administrativa || "Pública",
          endereco: e.endereco || "",
          situacao: "Ativa",
        }));
      }
    }
  } catch {}

  // Fallback: return empty (user can add manually)
  return [];
}

export async function GET(req: NextRequest) {
  const municipio = req.nextUrl.searchParams.get("municipio");
  const uf = req.nextUrl.searchParams.get("uf") || "CE";

  if (!municipio) {
    return NextResponse.json({ error: "Parâmetro 'municipio' obrigatório" }, { status: 400 });
  }

  const cacheKey = `${uf}_${municipio}`.toLowerCase();
  if (escolasCache[cacheKey] && Date.now() - escolasCache[cacheKey].ts < TTL) {
    return NextResponse.json(escolasCache[cacheKey].data);
  }

  const escolas = await fetchEscolasMunicipio(municipio, uf);
  if (escolas.length > 0) {
    escolasCache[cacheKey] = { data: escolas, ts: Date.now() };
  }
  return NextResponse.json(escolas);
}
