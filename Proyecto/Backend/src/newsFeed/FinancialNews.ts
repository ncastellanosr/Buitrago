import express, { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Noticia } from '../entities/Noticia';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

const MAX_REQUEST_BYTES = 200000;
const MAX_RAW_PAYLOAD_BYTES = 100000;
const MAX_URL_LENGTH = 2048;

function analisisFallback(noticia: any): string {
  const titulo = noticia?.headline || 'Noticia';
  const resumen = noticia?.summary || '';
  const texto = (titulo + ' ' + resumen).toLowerCase();
  let impacto = 'Neutral';
  if (texto.includes('quiebra') || (texto.includes('banco') && texto.includes('problema'))) impacto = 'Alto impacto negativo';
  else if (texto.includes('cae') || texto.includes('declina') || texto.includes('recorte')) impacto = 'Medio/alto impacto negativo';
  else if (texto.includes('sube') || texto.includes('aumenta') || texto.includes('crece')) impacto = 'Posible impacto positivo';
  return `Análisis (mock): Título: ${titulo}\nImpacto estimado: ${impacto}\nResumen: ${resumen}`;
}

async function obtenerClienteIA(apiKey?: string) {
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch {
    return null;
  }
}

router.post('/news-effect', async (req: Request, res: Response) => {
  const noticia = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_SERVER;
  if (apiKey) {
    try {
      const ai = await obtenerClienteIA(apiKey);
      if (!ai) throw new Error('no ai client');
      const prompt = `Actúa como un experto en mercados financieros e inversiones. Analiza la siguiente noticia y explica qué efectos podría tener en el mercado y en las empresas relacionadas.\n\nTítulo: ${noticia.headline ?? ''}\nResumen: ${noticia.summary ?? ''}\nFuente: ${noticia.source ?? ''}\nFecha: ${noticia.datetime ? new Date(noticia.datetime * 1000).toLocaleDateString('es-CO') : ''}\nURL: ${noticia.url ?? ''}\nCategoría: ${noticia.category ?? ''}\nEmpresas relacionadas: ${noticia.related ?? ''}\n\nResponde de forma clara, breve y en español para un inversionista. Devuelve solo el análisis, sin saludos ni despedidas.`;
      const modelo = 'models/gemini-2.5-flash-lite';
      const respuesta = await ai.models.generateContent({
        model: modelo,
        contents: prompt
});

      let texto = (respuesta as any)?.text ?? '';
      if (typeof texto === 'string') texto = texto.trim();
      if (texto.startsWith('```')) {
        texto = texto.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
      }
      return res.json({ result: texto });
    } catch (err) {
      console.warn('Falló Gemini, usando fallback:', err instanceof Error ? err.message : err);
      const texto = analisisFallback(noticia);
      return res.json({ result: texto });
    }
  }
  const texto = analisisFallback(noticia);
  return res.json({ result: texto });
});

function validarYNormalizarUrl(valor: any): { ok: true; url: string } | { ok: false; mensaje: string } {
  const raw = valor;
  if (typeof raw !== 'string') {
    console.warn('falta o no es string', { muestra: typeof raw === 'string' ? raw.slice(0, 200) : String(raw) });
    return { ok: false, mensaje: 'Falta o es inválida la URL' };
  }
  const url = raw.trim();
  if (url.length === 0) {
    console.warn('url vacía', { muestra: url.slice(0, 200) });
    return { ok: false, mensaje: 'La URL está vacía' };
  }
  if (url.length > MAX_URL_LENGTH) {
    console.warn('url demasiado larga', { length: url.length });
    return { ok: false, mensaje: `La URL excede la longitud máxima de ${MAX_URL_LENGTH} caracteres` };
  }
  try {
    new URL(url);
  } catch {
    console.warn('formato inválido', { muestra: url.slice(0, 200) });
    return { ok: false, mensaje: 'Formato de URL inválido' };
  }
  return { ok: true, url };
}

function convertirEpochADate(epoch: any): Date {
  const n = Number(epoch);
  if (Number.isNaN(n)) return new Date();
  return new Date(n * 1000);
}

function sanitizarCarga(carga: any, maxChars = 200000) {
  try {
    const s = JSON.stringify(carga);
    if (s.length <= maxChars) return carga;
    return {
      headline: carga.headline ?? carga.title ?? '',
      summary: carga.summary ?? carga.content ?? '',
      source: carga.source ?? carga.source_name ?? '',
      url: carga.url ?? ''
    };
  } catch {
    return {};
  }
}

async function obtenerRepositorioNoticia() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  return AppDataSource.getRepository(Noticia);
}

router.post('/news-save', async (req: Request, res: Response) => {
  try {
    const carga = req.body || {};
    const validacion = validarYNormalizarUrl(carga.url);
    if (!validacion.ok) return res.status(400).json({ mensaje: validacion.mensaje });
    const urlStr = validacion.url;
    const payloadStr = JSON.stringify(carga || {});
    const tamañoBytes = Buffer.byteLength(payloadStr, 'utf8');
    if (tamañoBytes > MAX_REQUEST_BYTES) {
      console.warn('payload demasiado grande', { tamañoBytes });
      return res.status(400).json({ mensaje: 'payload demasiado grande' });
    }
    const repo = await obtenerRepositorioNoticia();
    const cargaSanitizada = sanitizarCarga(carga);
    let rawSanitizado = cargaSanitizada;
    const rawStr = JSON.stringify(cargaSanitizada);
    if (Buffer.byteLength(rawStr, 'utf8') > MAX_RAW_PAYLOAD_BYTES) {
      rawSanitizado = {
        headline: cargaSanitizada.headline ?? '',
        summary: cargaSanitizada.summary ?? '',
        source: cargaSanitizada.source ?? '',
        url: cargaSanitizada.url ?? ''
      };
    }
    const existente = await repo.findOneBy({ url: urlStr });
    if (existente) {
      existente.title = String(carga.headline ?? carga.title ?? existente.title).trim();
      existente.content = String(carga.summary ?? carga.content ?? existente.content).trim();
      existente.source = String(carga.source ?? carga.source_name ?? existente.source).trim();
      existente.category = String(carga.category ?? existente.category).trim();
      existente.publishedAt = carga.datetime ? convertirEpochADate(carga.datetime) : existente.publishedAt;
      existente.rawPayload = { ...(existente.rawPayload || {}), ...rawSanitizado, raw_saved_at: new Date().toISOString() };
      const actualizado = await repo.save(existente);
      return res.status(200).json({ saved: true, id: actualizado.id, updated: true, mensaje: 'Noticia actualizada' });
    }
    const entidad = new Noticia();
    entidad.source = String(carga.source ?? carga.source_name ?? '').trim();
    entidad.title = String(carga.headline ?? carga.title ?? '').trim();
    entidad.content = String(carga.summary ?? carga.content ?? '').trim();
    entidad.category = String(carga.category ?? 'general').trim();
    entidad.url = urlStr;
    entidad.publishedAt = carga.datetime ? convertirEpochADate(carga.datetime) : new Date();
    entidad.rawPayload = { ...rawSanitizado, raw_saved_at: new Date().toISOString() };
    try {
      const guardado = await repo.save(entidad as any);
      return res.status(201).json({ saved: true, id: guardado.id, mensaje: 'Noticia guardada' });
    } catch (err) {
      console.warn('Error al guardar entidad, intentando recuperar existente', err instanceof Error ? err.message : err);
      const posible = await repo.findOneBy({ url: urlStr });
      if (posible) return res.status(200).json({ saved: true, id: posible.id, updated: false, mensaje: 'Ya existía (resuelto por concurrente)' });
      return res.status(500).json({ mensaje: 'error interno' });
    }
  } catch (err) {
    console.warn('news-save error', err instanceof Error ? err.message : err);
    return res.status(500).json({ mensaje: 'error interno' });
  }
});

router.post('/analyze-company', async (req: Request, res: Response) => {
  try {
    const carga = req.body || {};
    console.log('analyze-company called, body:', JSON.stringify(carga).slice(0,1000));
    console.log('GEMINI_API_KEY present?', !!(process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_SERVER));
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_SERVER;
    const companyName = String(carga.companyName ?? carga.name ?? '').trim();
    const industry = String(carga.industry ?? carga.sector ?? '').trim();
    const price = Number(carga.price ?? 0);
    const extraData = carga.extraData ?? {};
    const userFinancials = carga.userFinancials ?? null;

    if (!apiKey) {
      const riskLevel = price > 100 ? 'ALTO' : price > 20 ? 'MEDIO' : 'BAJO';
      const advantages = ['Diversificación', 'Crecimiento potencial', 'Equipo directivo sólido'];
      const disadvantages = ['Volatilidad del mercado', 'Riesgo sectorial'];
      const recommendation = userFinancials
        ? `Con tu perfil (${userFinancials.perfilRiesgo ?? 'no definido'}) y ahorro mensual, considera una inversión proporcional a tu colchón de emergencia.`
        : 'Considera diversificar y revisar tu horizonte de inversión.';
      const description = `Mock: análisis rápido para ${companyName || 'la empresa'}. Industria: ${industry}. Precio referencial: ${price} USD.`;
      return res.status(200).json({ result: { description, riskLevel, advantages, disadvantages, recommendation }, source: 'fallback' });
    }

    const ai = await obtenerClienteIA(apiKey);
    if (!ai) return res.status(500).json({ mensaje: 'No se pudo inicializar el cliente de IA' });

    const prompt = `Actúa como un experto en mercados financieros e inversiones. Analiza la siguiente empresa con base en los datos proporcionados:
        Nombre: ${companyName}
        Industria: ${industry}
        Precio actual: ${price} USD
        Datos adicionales: ${JSON.stringify(extraData)}
        Datos financieros del usuario: ${JSON.stringify(userFinancials)}

        Proporciona la respuesta SOLO en JSON con la estructura:
        { "description": "...", "riskLevel": "ALTO|MEDIO|BAJO", "advantages": [".."], "disadvantages": [".."], "recommendation": "..." }
        `;

    const modelo = 'models/gemini-2.5-flash-lite';
    let texto = '';
    try {
      const respuesta = await (ai as any).models.generateContent({ model: modelo, contents: prompt });
      texto = (respuesta as any)?.text ?? '';
      if (typeof texto === 'string') texto = texto.trim();
      if (texto.startsWith('```')) {
        texto = texto.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
      }
      const match = texto.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ mensaje: 'No se recibió JSON válido desde Gemini', raw: texto });
      try {
        const parsed = JSON.parse(match[0]);
        return res.status(200).json({ result: parsed, source: 'gemini' });
      } catch (err) {
        return res.status(500).json({ mensaje: 'Error parseando JSON de Gemini', error: String(err), raw: texto });
      }
    } catch (err) {
      console.warn('Gemini generateContent error:', err instanceof Error ? err.message : err);
      const fallbackParsed = {
        description: `Mock: análisis rápido para ${companyName || 'la empresa'}. Industria: ${industry}. Precio referencial: ${price} USD.`,
        riskLevel: price > 100 ? 'ALTO' : price > 20 ? 'MEDIO' : 'BAJO',
        advantages: ['Diversificación', 'Crecimiento potencial', 'Equipo directivo sólido'],
        disadvantages: ['Volatilidad del mercado', 'Riesgo sectorial'],
        recommendation: userFinancials
          ? `Con tu perfil (${userFinancials.perfilRiesgo ?? 'no definido'}) y ahorro mensual, considera una inversión proporcional a tu colchón de emergencia.`
          : 'Considera diversificar y revisar tu horizonte de inversión.'
      };
      return res.status(200).json({ result: fallbackParsed, source: 'fallback' });
    }
  } catch (err) {
    console.warn('analyze-company error', err instanceof Error ? err.message : err);
    return res.status(500).json({ mensaje: 'error interno' });
  }
});

export default router;