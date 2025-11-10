import { GoogleGenAI } from "@google/genai";

// Usa import.meta.env para Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const model = "gemini-2.5-flash-lite-preview-06-17";

if (!apiKey) {
  throw new Error("Gemini API key no definida en las variables de entorno");
}

const ai = new GoogleGenAI({ apiKey });

interface CompanyAnalysis {
  riskLevel: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  recommendation?: string; // <-- Asegura que el campo esté en la interfaz
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
    // Puedes agregar más campos si los tienes disponibles
  },
  userFinancials?: {
    ingresos?: number;
    gastos?: number;
    ahorro?: number;
    perfilRiesgo?: string;
    // Puedes agregar más campos si los tienes disponibles
  }
): Promise<CompanyAnalysis> {
  // Construye una sección adicional con los datos de finnhub si están presentes
  let extraInfo = "";
  if (extraData) {
    extraInfo = `
  Símbolo: ${extraData.symbol ?? ""}
  Volumen: ${typeof extraData.volume === "number" ? extraData.volume : extraData.volume || ""}
  Precio máximo: ${typeof extraData.high === "number" ? extraData.high : ""}
  Precio mínimo: ${typeof extraData.low === "number" ? extraData.low : ""}
  Capitalización bursátil: ${typeof extraData.marketCap === "number" ? extraData.marketCap : extraData.marketCap || ""}
  ${extraData.usdToCop ? `Tasa de cambio actual USD a COP: ${extraData.usdToCop}` : ""}
  `;
  }

  // Construye una sección adicional con los datos financieros del usuario si están presentes
  let userInfo = "";
  if (userFinancials) {
    userInfo = `
  Datos financieros del usuario (valores en pesos colombianos - COP):
  Ingresos mensuales: ${typeof userFinancials.ingresos === "number" ? userFinancials.ingresos : ""}
  Gastos mensuales: ${typeof userFinancials.gastos === "number" ? userFinancials.gastos : ""}
  Ahorro mensual: ${typeof userFinancials.ahorro === "number" ? userFinancials.ahorro : ""}
  Perfil de riesgo: ${userFinancials.perfilRiesgo ?? ""}
  `;
  }

  const prompt = `Actúa como un experto en mercados financieros e inversiones. Analiza la siguiente empresa con base en los datos proporcionados:
  Nombre: ${companyName}
  Industria: ${industry}
  Precio actual: ${price} USD
  ${extraInfo}
  ${userInfo}

  Ten en cuenta que el dinero del usuario está en pesos colombianos (COP) y el precio de la acción está en dólares estadounidenses (USD). Si das recomendaciones personalizadas, utiliza la tasa de cambio proporcionada para hacer los cálculos y recomendaciones.

  Proporciona:
  1. Una descripción concisa de la empresa y su situación actual según los datos.
  2. Nivel de riesgo (ALTO, MEDIO o BAJO)
  3. 3 ventajas principales de invertir
  4. 2 desventajas o riesgos
  5. Si los datos financieros del usuario están presentes, da SIEMPRE una recomendación personalizada de inversión para ese usuario (considerando la diferencia de monedas y su perfil financiero). 
  En la recomendación personalizada no saludes, háblale directamente y de forma amigable al usuario, usando "tú" y dándole consejos claros y cercanos.

  Responde SOLO en formato JSON con la siguiente estructura, sin ningún texto adicional:
  {
    "description": "descripción",
    "riskLevel": "ALTO/MEDIO/BAJO",
    "advantages": ["ventaja1", "ventaja2", "ventaja3"],
    "disadvantages": ["desventaja1", "desventaja2"],
    "recommendation": "recomendación personalizada para el usuario"
  }`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  let text = response.text.trim();

  // Elimina delimitadores de bloque de código si existen
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
  }

  // Extrae el primer bloque JSON válido
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No se encontró un bloque JSON en la respuesta de Gemini");
  const jsonStr = match[0];

  return JSON.parse(jsonStr);
}

/**
 * Analiza los posibles efectos de una noticia sobre el precio de las acciones de una empresa.
 * @param stock Información de la empresa (StockPrice)
 * @param news Objeto de noticia (de la API de Finnhub)
 * @returns string con el análisis de efectos
 */
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
  const prompt = `
Actúa como un experto en mercados financieros e inversiones. Analiza el siguiente evento de noticia para la empresa ${stock.name} (${stock.symbol}), sector: ${stock.sector ?? ""}.
Noticia:
Título: ${news.headline}
Resumen: ${news.summary}
Fuente: ${news.source}
Fecha: ${new Date(news.datetime * 1000).toLocaleDateString('es-CO')}
URL: ${news.url}

Pregunta: ¿Qué efectos podría tener esta noticia en el precio de las acciones de la empresa? Responde de forma clara, breve y en español para un inversionista.
Devuelve solo el análisis, sin saludos ni despedidas.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  let text = response.text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
  }
  return text;
}

/**
 * Analiza los posibles efectos de una noticia general sobre el mercado y empresas relacionadas.
 * @param news Objeto de noticia general (de la API de Finnhub)
 * @returns string con el análisis de efectos
 */
export async function analyzeMarketNewsEffect(news: {
  headline: string;
  summary: string;
  source: string;
  datetime: number;
  url: string;
  related?: string;
  category?: string;
}): Promise<string> {
  const prompt = `
Actúa como un experto en mercados financieros e inversiones. Analiza la siguiente noticia general y explica qué efectos podría tener este evento en el mercado en general y en las empresas relacionadas mencionadas (si las hay).

Noticia:
Título: ${news.headline}
Resumen: ${news.summary}
Fuente: ${news.source}
Fecha: ${new Date(news.datetime * 1000).toLocaleDateString('es-CO')}
URL: ${news.url}
Categoría: ${news.category ?? ""}
Empresas relacionadas: ${news.related ?? ""}

Pregunta: ¿Qué efectos podría tener esta noticia en el mercado y en las empresas relacionadas? Responde de forma clara, breve y en español para un inversionista.
Devuelve solo el análisis, sin saludos ni despedidas.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  let text = response.text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
  }
  return text;
}
