import { NextRequest, NextResponse } from "next/server";

// In-memory cache
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

// Try multiple public APIs to find schools
async function fetchEscolas(municipio: string, uf: string): Promise<EscolaINEP[]> {
  // Source 1: FNDE/INEP Escola Search (most reliable for Brazilian schools)
  try {
    const url = `https://www.escol.as/api/v1/schools?city=${encodeURIComponent(municipio)}&state=${uf}&per_page=200`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { "Accept": "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((e: any) => ({
          codigo: String(e.inep_code || e.id || ""),
          nome: e.name || e.nome || "",
          municipio: e.city || municipio,
          rede: e.admin_type || e.rede || "Pública",
          endereco: e.address || "",
          situacao: "Ativa",
        }));
      }
    }
  } catch {}

  // Source 2: QEdu API
  try {
    const url = `https://api.qedu.org.br/v1/escolas?municipio=${encodeURIComponent(municipio)}&uf=${uf}&limit=200`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data) && data.data.length > 0) {
        return data.data.map((e: any) => ({
          codigo: String(e.id || e.codigo_inep || ""),
          nome: e.nome || e.name || "",
          municipio: e.municipio || municipio,
          rede: e.rede || "Pública",
          endereco: e.endereco || "",
          situacao: "Ativa",
        }));
      }
    }
  } catch {}

  // Source 3: INEP Open Data API
  try {
    // Get IBGE code for the municipality
    const ibgeRes = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (ibgeRes.ok) {
      const municipios = await ibgeRes.json();
      const mun = municipios.find((m: any) =>
        m.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
        municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      );
      if (mun) {
        const inepRes = await fetch(
          `http://api.dadosabertosinep.org/v1/ideb/escolas.json?codigo_municipio=${mun.id}`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (inepRes.ok) {
          const data = await inepRes.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map((e: any) => ({
              codigo: String(e.cod_escola || e.codigo || ""),
              nome: e.nome_escola || e.nome || "",
              municipio,
              rede: e.rede || "Pública",
              endereco: "",
              situacao: "Ativa",
            }));
          }
        }
      }
    }
  } catch {}

  // Fallback: empty (user can add school manually)
  return [];
}

export async function GET(req: NextRequest) {
  const municipio = req.nextUrl.searchParams.get("municipio");
  const uf = req.nextUrl.searchParams.get("uf") || "CE";

  if (!municipio) {
    return NextResponse.json({ error: "Parâmetro 'municipio' obrigatório" }, { status: 400 });
  }

  const cacheKey = `${uf}_${municipio}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (escolasCache[cacheKey] && Date.now() - escolasCache[cacheKey].ts < TTL) {
    return NextResponse.json(escolasCache[cacheKey].data);
  }

  const escolas = await fetchEscolas(municipio, uf);
  if (escolas.length > 0) {
    escolasCache[cacheKey] = { data: escolas, ts: Date.now() };
  }
  return NextResponse.json(escolas);
}
