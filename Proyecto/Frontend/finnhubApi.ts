const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

if (!API_KEY) {
  throw new Error("Finnhub API key no definida en las variables de entorno");
} // Usa variable de entorno

const BASE_URL = 'https://finnhub.io/api/v1';

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

interface StockData {
  symbol: string;
  companyName?: string;
  industry?: string;
  price?: number;
  high?: number;
  low?: number;
  volume?: number | string;
  previousClose?: number;
  marketCap?: number | string;
}

// Función que obtiene las acciones en "páginas"
export async function getStockDataPaginated({
  exchange = 'US',
  pageSize = 10,
  page = 1
} = {}) {
  try {
    // Lista expandida de símbolos (50 acciones populares)
    const defaultSymbols = [
      // Empresas estadounidenses (ya tenías)
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'BAC', 'WMT',
      'PG', 'XOM', 'JNJ', 'V', 'UNH', 'MA', 'HD', 'CVX', 'PFE', 'KO',
      'DIS', 'NFLX', 'CSCO', 'VZ', 'ADBE', 'ORCL', 'ACN', 'INTC', 'CRM', 'IBM',
      'AMD', 'QCOM', 'TXN', 'PYPL', 'SBUX', 'NKE', 'MCD', 'BA', 'CAT', 'GE',
      'MMM', 'HON', 'UPS', 'FDX', 'GM', 'F', 'DAL', 'AAL', 'CCL', 'MAR',

      // Empresas Colombianas (ADR)
      'EC', 'CIB', 'AVAL', 'CMTOY', 'GCHOY', 'GEBKY',

      // Empresas Internacionales
      'BABA', 'TSM', 'TM', 'SONY', 'SSNLF', 'NSRGY', 'RHHBY', 'NVS',
      'HSBC', 'UL', 'BP', 'SHEL', 'VWAGY', 'SAP', 'ASML'
    ];


    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageSymbols = defaultSymbols.slice(start, end);

    const pageData = await Promise.all(
      pageSymbols.map(async (symbol) => {
        try {
          const [quote, profile] = await Promise.all([
            fetchJson(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`),
            fetchJson(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
          ]);

          return {
            symbol,
            companyName: profile?.name || 'No disponible',
            industry: profile?.finnhubIndustry || 'No disponible',
            price: quote?.c || 'No disponible',
            high: quote?.h || 'No disponible',
            low: quote?.l || 'No disponible',
            volume: typeof quote?.v === 'number' && quote.v > 0 ? quote.v : 'No disponible',
            previousClose: quote?.pc,
            marketCap: typeof profile?.marketCapitalization === 'number' && profile.marketCapitalization > 0
              ? profile.marketCapitalization
              : 'No disponible'
          };
        } catch (err) {
          console.error(`Error loading data for ${symbol}:`, err);
          return null;
        }
      })
    );

    const filteredData = pageData.filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      data: filteredData,
      total: defaultSymbols.length,
      hasNextPage: end < defaultSymbols.length
    };
  } catch (error) {
    console.error('Error in getStockDataPaginated:', error);
    return {
      data: [],
      total: 0,
      hasNextPage: false
    };
  }
}

// Obtener noticias de una empresa por símbolo y rango de fechas
export async function getCompanyNews(symbol: string, from: string, to: string) {
  try {
    const url = `${BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`;
    return await fetchJson(url);
  } catch (error) {
    console.error('Error al obtener noticias de la empresa:', error);
    throw error;
  }
}
