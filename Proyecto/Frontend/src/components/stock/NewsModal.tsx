import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';

interface StockModalInfo {
  name: string;
  symbol: string;
  sector?: string;
}

interface NewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: StockModalInfo | null;
  newsList: any[];
  newsLoading: boolean;
  newsError: string | null;
  effectsLoading: { [newsId: string]: boolean };
  effectsError: { [newsId: string]: string | null };
  effectsResult: { [newsId: string]: string };
  fetchNewsEffects: (news: any, stock: StockModalInfo) => Promise<void>;
  parseBold: (text: string) => string;
}

const NewsModal: React.FC<NewsModalProps> = ({
  open,
  onOpenChange,
  stock,
  newsList,
  newsLoading,
  newsError,
  effectsLoading,
  effectsError,
  effectsResult,
  fetchNewsEffects,
  parseBold,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
      <Dialog.Content
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white rounded-lg shadow-lg max-w-2xl w-full p-0
          max-h-[90vh] flex flex-col"
        style={{ minHeight: 300 }}
      >
        {/* Header fijo */}
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
            Noticias de {stock?.name} ({stock?.symbol})
          </Dialog.Title>
          <Dialog.Description className="mb-0 text-gray-600">
            Noticias relevantes de hoy
          </Dialog.Description>
        </div>
        {/* Contenido scrollable */}
        <div
          className="overflow-y-auto px-6 pb-6 pt-4 flex-1 rounded-b-lg"
          style={{
            maxHeight: 'calc(90vh - 90px)',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
          }}
        >
          {newsLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ) : newsError ? (
            <div className="text-red-600">{newsError}</div>
          ) : newsList.length === 0 ? (
            <div className="text-gray-600 text-center py-8">
              No hay noticias recientes para esta empresa hoy.
            </div>
          ) : (
            <div className="space-y-4">
              {newsList.map((news, idx) => {
                const newsId = news.id || news.url || news.headline;
                return (
                  <div key={newsId} className="block border rounded-lg p-3 hover:bg-gray-50 transition">
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex gap-3">
                        {news.image && (
                          <img src={news.image} alt="" className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{news.headline}</div>
                          <div className="text-xs text-gray-500 mb-1">{news.source} • {new Date(news.datetime * 1000).toLocaleDateString('es-CO')}</div>
                          <div className="text-xs text-gray-700 line-clamp-3">{news.summary}</div>
                        </div>
                      </div>
                    </a>
                    {/* Accordion para efectos */}
                    <Accordion type="single" collapsible className="mt-3">
                      <AccordionItem value="efectos">
                        <AccordionTrigger
                          onClick={async () => {
                            if (!effectsResult[newsId] && !effectsLoading[newsId] && stock) {
                              await fetchNewsEffects(news, stock);
                            }
                          }}
                        >
                          Efectos
                        </AccordionTrigger>
                        <AccordionContent>
                          {effectsLoading[newsId] ? (
                            <div className="text-gray-500 text-sm">Analizando efectos...</div>
                          ) : effectsError[newsId] ? (
                            <div className="text-red-600 text-sm">{effectsError[newsId]}</div>
                          ) : effectsResult[newsId] ? (
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
                              <div
                                className="text-sm text-gray-800 whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: parseBold(effectsResult[newsId]) }}
                              />
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">Haz clic para analizar los efectos de esta noticia.</div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default NewsModal;
