export async function getUsdToCopRate(): Promise<number> {
  const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
  if (!API_KEY) {
    throw new Error("Exchange Rate API key no definida en las variables de entorno");
  }
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener la tasa de cambio');
  const data = await res.json();
  if (data.result !== 'success' || !data.conversion_rates?.COP) {
    throw new Error('Respuesta inválida de la API de tasa de cambio');
  }
  return data.conversion_rates.COP;
}
