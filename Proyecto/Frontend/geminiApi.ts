
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface CompanyAnalysis {
  riskLevel: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  recommendation?: string;
}

async function postJson<T>(path: string, body: any): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    console.error(
      `Error en POST ${url}: status ${resp.status}, body:`,
      text || "<vacío>"
    );
    throw new Error(`Error del servidor (${resp.status}) al llamar a ${path}`);
  }

  return resp.json() as Promise<T>;
}

export async function analyzeCompany(
  companyName: string,
  industry: string,
  price: number,
  extraData?: {
    symbol?: string;
    volume?: number | string;
    high?: number;
    low?: number;
    usdToCop?: number;
    marketCap?: number | string;
  },
  userFinancials?: {
    ingresos?: number;
    gastos?: number;
    ahorro?: number;
    perfilRiesgo?: string;
  }
): Promise<CompanyAnalysis> {
  const payload = {
    companyName,
    industry,
    price,
    extraData,
    userFinancials,
  };

  const data = await postJson<{ result: CompanyAnalysis }>(
    "/api/financial-news/analyze-company",
    payload
  );

  return data.result;
}

export async function analyzeNewsEffect(
  stock: {
    name: string;
    symbol: string;
    sector?: string;
  },
  news: {
    headline: string;
    summary: string;
    source: string;
    datetime: number;
    url: string;
  }
): Promise<string> {
  const payload = {
    ...news,
    stock,
  };

  const data = await postJson<{ result: string }>(
    "/api/financial-news/news-effect",
    payload
  );

  return data.result;
}

export async function analyzeMarketNewsEffect(news: {
  headline: string;
  summary: string;
  source: string;
  datetime: number;
  url: string;
  related?: string;
  category?: string;
}): Promise<string> {
  const data = await postJson<{ result: string }>(
    "/api/financial-news/news-effect",
    news
  );

  return data.result;
}
