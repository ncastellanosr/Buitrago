import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  Clock,
  ExternalLink,
  RefreshCw,
  LineChart // <-- Agrega este icono para el botón de efectos
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { analyzeNewsEffect } from '../../geminiApi'; // Asegúrate de que la ruta sea correcta
import { analyzeMarketNewsEffect } from '../../geminiApi'; // Nueva función para efecto de noticias generales
import * as Dialog from '@radix-ui/react-dialog';
import { parseBold } from '../utils/parseBold';

// Finnhub API categories: general, forex, crypto, merger
const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'forex', label: 'Forex' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'merger', label: 'Fusiones' }
];

interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const PAGE_SIZE = 10;

const FinancialNews: React.FC = () => {
  const [news, setNews] = useState<{ [category: string]: FinnhubNews[] }>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  const [page, setPage] = useState<{ [category: string]: number }>({
    general: 1,
    forex: 1,
    crypto: 1,
    merger: 1,
  });
  const [effectModalOpen, setEffectModalOpen] = useState(false);
  const [effectNews, setEffectNews] = useState<FinnhubNews | null>(null);
  const [effectLoading, setEffectLoading] = useState(false);
  const [effectError, setEffectError] = useState<string | null>(null);
  const [effectResult, setEffectResult] = useState<string | null>(null);

  // Para evitar race conditions si abres/cambias rápido
  const effectNewsIdRef = useRef<number | null>(null);

  const fetchNews = async (category: string) => {
    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
      const res = await fetch(
        `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`
      );
      const data: FinnhubNews[] = await res.json();
      setNews(prev => ({ ...prev, [category]: data }));
      setLastUpdate(new Date());
    } catch (e) {
      setNews(prev => ({ ...prev, [category]: [] }));
    }
    setIsLoading(false);
  };

  // Reset page to 1 when category changes
  useEffect(() => {
    setPage(prev => ({ ...prev, [activeCategory]: 1 }));
    fetchNews(activeCategory);
    // eslint-disable-next-line
  }, [activeCategory]);

  const getTimeAgo = (unix: number) => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - unix * 1000) / (1000 * 60));
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `hace ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `hace ${Math.floor(diffInMinutes / 1440)} d`;
    }
  };

  const handleOpenEffectModal = async (news: FinnhubNews) => {
    setEffectNews(news);
    setEffectResult(null);
    setEffectError(null);
    setEffectLoading(true);
    setEffectModalOpen(true);
    effectNewsIdRef.current = news.id;
    try {
      // Usar la función específica para noticias generales
      const result = await analyzeMarketNewsEffect({
        headline: news.headline,
        summary: news.summary,
        source: news.source,
        datetime: news.datetime,
        url: news.url,
        related: news.related,
        category: news.category,
      });
      // Solo actualiza si sigue siendo la misma noticia
      if (effectNewsIdRef.current === news.id) {
        setEffectResult(result);
      }
    } catch (e) {
      setEffectError('No se pudo obtener el análisis de efectos.');
    }
    setEffectLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Noticias Financieras</h1>
          <p className="text-gray-600 mt-1">
            Últimas noticias de mercados globales, forex, cripto y fusiones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="text-gray-500">Última actualización</p>
            <p className="font-medium text-gray-900">
              {lastUpdate.toLocaleTimeString('es-CO')}
            </p>
          </div>
          <Button
            onClick={() => fetchNews(activeCategory)}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map(cat => {
          const currentPage = page[cat.value] || 1;
          const allNews = news[cat.value] || [];
          const totalPages = Math.ceil(allNews.length / PAGE_SIZE);
          const paginatedNews = allNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

          return (
            <TabsContent key={cat.value} value={cat.value} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading && (!news[cat.value] || news[cat.value].length === 0) ? (
                  [...Array(PAGE_SIZE)].map((_, idx) => (
                    <Card key={idx} className="animate-pulse">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                          <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : paginatedNews.length > 0 ? (
                  paginatedNews.map(article => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>
                                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight">
                              {article.headline}
                            </CardTitle>
                          </div>
                          {article.image && (
                            <img
                              src={article.image}
                              alt=""
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 text-gray-500">
                            <span className="font-medium">{article.source}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeAgo(article.datetime)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={article.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Leer más
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEffectModal(article)}
                            >
                              <LineChart className="w-4 h-4 mr-1" />
                              Efectos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No hay noticias en esta categoría
                      </h3>
                      <p className="text-gray-600">
                        Intenta con otra categoría o actualiza las noticias.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              {/* Paginación */}
              {paginatedNews.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage(prev => ({
                        ...prev,
                        [cat.value]: Math.max(1, (prev[cat.value] || 1) - 1),
                      }))
                    }
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage(prev => ({
                        ...prev,
                        [cat.value]: Math.min(totalPages, (prev[cat.value] || 1) + 1),
                      }))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Modal de efectos de noticia */}
      <Dialog.Root open={effectModalOpen} onOpenChange={setEffectModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-lg shadow-lg max-w-2xl w-full p-0
              max-h-[90vh] flex flex-col"
            style={{ minHeight: 300 }}
          >
            <div className="relative px-6 pt-6 pb-4 border-b bg-white z-10 rounded-t-lg">
              <Dialog.Close asChild>
                <button
                  className="absolute right-6 top-6 z-50 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Cerrar"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </Dialog.Close>
              <Dialog.Title className="text-lg font-bold mb-2 pr-10">
                {effectNews?.headline}
              </Dialog.Title>
              <Dialog.Description className="mb-0 text-gray-600">
                {effectNews?.source} • {effectNews?.datetime && new Date(effectNews.datetime * 1000).toLocaleDateString('es-CO')}
              </Dialog.Description>
            </div>
            <div
              className="overflow-y-auto px-6 pb-6 pt-4 flex-1 rounded-b-lg"
              style={{
                maxHeight: 'calc(90vh - 90px)',
                borderBottomLeftRadius: '0.5rem',
                borderBottomRightRadius: '0.5rem',
              }}
            >
              {effectNews && (
                <>
                  {/* Imagen eliminada */}
                  <div className="text-gray-700 mb-4">{effectNews.summary}</div>
                  {effectNews.url && (
                    <div className="mb-4">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={effectNews.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Leer más
                        </a>
                      </Button>
                    </div>
                  )}
                </>
              )}
              <div className="mt-4">
                <div className="font-semibold mb-2">Efectos en el mercado:</div>
                {effectLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ) : effectError ? (
                  <div className="text-red-600 text-sm">{effectError}</div>
                ) : effectResult ? (
                  <div>
                    {/* Badge generado con IA */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5l1.09 3.36a1 1 0 00.95.69h3.54a.5.5 0 01.29.91l-2.87 2.09a1 1 0 00-.36 1.12l1.09 3.36a.5.5 0 01-.77.56L10 13.77l-2.87 2.09a.5.5 0 01-.77-.56l1.09-3.36a1 1 0 00-.36-1.12l-2.87-2.09a.5.5 0 01.29-.91h3.54a1 1 0 00.95-.69L10 2.5z"/>
                        </svg>
                        Generado con IA
                      </span>
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: parseBold(effectResult) }} />
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Haz clic en "Efectos" en una noticia para analizar los efectos de la noticia en el mercado.</div>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default FinancialNews;
