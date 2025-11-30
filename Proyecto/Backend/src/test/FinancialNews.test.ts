import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

beforeEach(function () {
  vi.resetModules();
  vi.doMock('@google/genai', () => ({ GoogleGenAI: class {} }));
});
const dbModuleId = require('path').join(process.cwd(), 'src/database');

describe('news-save handler', () => {
  it('falta url', async function () {
    vi.doMock(dbModuleId, function () {
      return {
        AppDataSource: {
          isInitialized: true,
          initialize: vi.fn(),
          getRepository: vi.fn(function () { return { findOneBy: vi.fn(), save: vi.fn() }; })
        }
      };
    });

    const __mod = await import('../newsFeed/FinancialNews');
    const router = (__mod && (__mod.default ?? __mod)) as any;
    const app = express();
    app.use(express.json());
    app.use('/api/ai', router);

    const res = await request(app).post('/api/ai/news-save').send({});
    console.log('RESP1', res.status, res.body);
    expect(res.status).toBe(400);
    expect(Boolean((res.body as any).error || (res.body as any).mensaje)).toBe(true);
  });

  it('nueva noticia', async function () {
    const mockRepo = {
      findOneBy: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockImplementation(async function (ent: any) { return { ...ent, id: 42 }; })
    };

    vi.doMock(dbModuleId, function () {
      return {
        AppDataSource: {
          isInitialized: true,
          initialize: vi.fn(),
          getRepository: vi.fn(function () { return mockRepo; })
        }
      };
    });

    const __mod = await import('../newsFeed/FinancialNews');
    const router = (__mod && (__mod.default ?? __mod)) as any;
    const app = express();
    app.use(express.json());
    app.use('/api/ai', router);

    const payload = { url: 'https://ejemplo.test/noticia', headline: 'T', summary: 'S' };
    const res = await request(app).post('/api/ai/news-save').send(payload);
    console.log('RESP2', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('saved', true);
    expect(res.body).toHaveProperty('id', 42);
  });

  it('actualiza noticia existente', async function () {
    const existente = { id: 99, title: 'old', content: 'old', source: 'x', category: 'general', publishedAt: new Date() };
    const mockRepo = {
      findOneBy: vi.fn().mockResolvedValue(existente),
      save: vi.fn().mockImplementation(async function (ent: any) { return { ...ent, id: existente.id }; })
    };

    vi.doMock(dbModuleId, function () {
      return {
        AppDataSource: {
          isInitialized: true,
          initialize: vi.fn(),
          getRepository: vi.fn(function () { return mockRepo; })
        }
      };
    });

    const __mod = await import('../newsFeed/FinancialNews');
    const router = (__mod && (__mod.default ?? __mod)) as any;
    const app = express();
    app.use(express.json());
    app.use('/api/ai', router);

    const payload = { url: 'https://ejemplo.test/noticia', headline: 'Nuevo', summary: 'Nuevo' };
    const res = await request(app).post('/api/ai/news-save').send(payload);
    console.log('RESP3', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', existente.id);
    expect(typeof (res.body as any).saved).toBe('boolean');
  });

  it('forex', async function () {
    const mockRepo = {
      findOneBy: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockImplementation(async function (ent: any) { return { ...ent, id: 201 }; })
    };

    vi.doMock(dbModuleId, function () {
      return {
        AppDataSource: {
          isInitialized: true,
          initialize: vi.fn(),
          getRepository: vi.fn(function () { return mockRepo; })
        }
      };
    });

    const __mod = await import('../newsFeed/FinancialNews');
    const router = (__mod && (__mod.default ?? __mod)) as any;
    const app = express();
    app.use(express.json());
    app.use('/api/ai', router);

    const payload = { url: 'https://ejemplo.test/divisa', headline: 'FX', summary: 'Cambio', category: 'forex' };
    const res = await request(app).post('/api/ai/news-save').send(payload);
    console.log('RESP-FOREX', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('saved', true);
    expect(res.body).toHaveProperty('id', 201);
  });

  it('noticias', async function () {
    const mockRepo = {
      findOneBy: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockImplementation(async function (ent: any) { return { ...ent, id: 202 }; })
    };

    vi.doMock(dbModuleId, function () {
      return {
        AppDataSource: {
          isInitialized: true,
          initialize: vi.fn(),
          getRepository: vi.fn(function () { return mockRepo; })
        }
      };
    });

    const __mod = await import('../newsFeed/FinancialNews');
    const router = (__mod && (__mod.default ?? __mod)) as any;
    const app = express();
    app.use(express.json());
    app.use('/api/ai', router);

    const payload = { url: 'https://ejemplo.test/noticia', headline: 'News', summary: 'General news', category: 'general' };
    const res = await request(app).post('/api/ai/news-save').send(payload);
    console.log('RESP-NEWS', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('saved', true);
    expect(res.body).toHaveProperty('id', 202);
  });

  it('noticia2', async function () {
    const mockRepo = {
      findOneBy: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockImplementation(async function (ent: any) { return { ...ent, id: 203 }; })
    };

    vi.doMock(dbModuleId, function () {
      return {
        AppDataSource: {
          isInitialized: true,
          initialize: vi.fn(),
          getRepository: vi.fn(function () { return mockRepo; })
        }
      };
    });

    const __mod = await import('../newsFeed/FinancialNews');
    const router = (__mod && (__mod.default ?? __mod)) as any;
    const app = express();
    app.use(express.json());
    app.use('/api/ai', router);

    const payload = { url: 'https://ejemplo.test/accion', headline: 'Stock move', summary: 'Earnings', category: 'stocks' };
    const res = await request(app).post('/api/ai/news-save').send(payload);
    console.log('RESP-STOCK', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('saved', true);
    expect(res.body).toHaveProperty('id', 203);
  });
});
