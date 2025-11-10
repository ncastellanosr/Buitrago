import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Search,
  Clock,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  LineChart // <--- Agrega este icono para el botón de análisis
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Stock } from '../types';
import { getStockDataPaginated, getCompanyNews } from '../../finnhubApi';
import { analyzeCompany, analyzeNewsEffect } from '../../geminiApi';
import { useApp } from '../contexts/AppContext';
// Si tienes un Dialog propio, usa ese import. Si no, usa el de Radix UI:
import * as Dialog from '@radix-ui/react-dialog';
import { getUsdToCopRate } from '../../utils/exchangeRate';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'; // Asegúrate de tener un componente Accordion, o usa uno propio o de Radix UI
import { parseBold } from '../utils/parseBold';
import AnalysisModal from './stock/AnalysisModal';
import NewsModal from './stock/NewsModal';

// Define un tipo base para pasar solo los campos requeridos a los modales
type StockModalInfo = {
  name: string;
  symbol: string;
  sector?: string;
};

interface StockPrice extends Stock {
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number | string;
  high: number;
  low: number;
  lastUpdate: Date;
  marketCap?: number | string;
}

interface AnalysisResult {
  description: string;
  riskLevel: string;
  advantages: string[];
  disadvantages: string[];
  recommendation?: string;
}

const StockPrices: React.FC = () => {
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStock, setModalStock] = useState<StockModalInfo | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showInCop, setShowInCop] = useState(false);
  const [usdToCop, setUsdToCop] = useState<number | null>(null);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newsStock, setNewsStock] = useState<StockModalInfo | null>(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsList, setNewsList] = useState<any[]>([]);
  const itemsPerPage = 6;
  const { userFinancials } = useApp();

  // Solo un useEffect para paginación
  useEffect(() => {
    updateStockPrices(currentPage);
  }, [currentPage]);

  // Modifica updateStockPrices para filtrar por searchTerm SOLO cuando currentPage === 1 (búsqueda)
  const updateStockPrices = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await getStockDataPaginated({
        pageSize: itemsPerPage,
        page: page
      });

      if (response.data.length > 0) {
        const initialStocks: StockPrice[] = response.data.map(stock => {
          const currentPrice = typeof stock.price === 'number' ? stock.price : 0;
          const previousClose = typeof stock.previousClose === 'number' ? stock.previousClose : currentPrice;
          const change = currentPrice - previousClose;
          const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

          return {
            id: stock.symbol,
            symbol: stock.symbol,
            name: stock.companyName || 'Empresa desconocida',
            sector: stock.industry || 'Desconocido',
            currentPrice,
            change,
            changePercent,
            volume: stock.volume ?? 'No disponible',
            high: typeof stock.high === 'number' ? stock.high : currentPrice,
            low: typeof stock.low === 'number' ? stock.low : currentPrice,
            lastUpdate: new Date(),
            marketCap: stock.marketCap ?? 'No disponible',
            riskLevel: '',
            description: '',
            advantages: [],
            disadvantages: [],
          };
        });

        setStocks(initialStocks);
        setTotalItems(response.total);
        setHasNextPage(response.hasNextPage);
      } else {
        setStocks([]);
        setHasNextPage(false);
        setTotalItems(0);
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error al cargar datos de acciones:', error);
      setStocks([]);
      setHasNextPage(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUsdToCopRate().then(setUsdToCop).catch(() => setUsdToCop(null));
  }, []);

  const handleOpenAnalysis = async (stock: StockPrice) => {
    // Solo pasa los campos requeridos
    setModalStock({
      name: stock.name,
      symbol: stock.symbol,
      sector: stock.sector,
    });
    setAnalysis(null);
    setAnalysisError(null);
    setAnalysisLoading(true);
    setModalOpen(true);
    try {
      const result = await analyzeCompany(
        stock.name,
        stock.sector,
        stock.currentPrice,
        {
          symbol: stock.symbol,
          volume: stock.volume,
          high: stock.high,
          low: stock.low,
          usdToCop, // pasa la tasa de cambio
          marketCap: stock.marketCap,
        },
        userFinancials
      );
      setAnalysis(result);
    } catch (e) {
      setAnalysisError('No se pudo obtener el análisis.');
      console.log(e)
    }
    setAnalysisLoading(false);
  };

  // Cambia getWeekRange por getTodayRange para noticias diarias
  const getTodayRange = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    return { from: dateStr, to: dateStr };
  };

  // Función para abrir el modal de noticias y cargar noticias (ahora diarias)
  const handleOpenNews = async (stock: StockPrice) => {
    // Solo pasa los campos requeridos
    setNewsStock({
      name: stock.name,
      symbol: stock.symbol,
      sector: stock.sector,
    });
    setNewsList([]);
    setNewsError(null);
    setNewsLoading(true);
    setNewsModalOpen(true);
    try {
      const { from, to } = getTodayRange();
      const data = await getCompanyNews(stock.symbol, from, to);
      if (Array.isArray(data) && data.length > 0) {
        setNewsList(data);
      } else {
        setNewsList([]);
      }
    } catch (e) {
      setNewsError('No se pudieron obtener las noticias.');
    }
    setNewsLoading(false);
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'COP' = 'COP') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatVolume = (volume: number | string) => {
    if (typeof volume === 'string') return volume;
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toString();
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50 border-green-200';
      case 'medio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'alto': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Estado para efectos de noticias
  const [effectsLoading, setEffectsLoading] = useState<{ [newsId: string]: boolean }>({});
  const [effectsError, setEffectsError] = useState<{ [newsId: string]: string | null }>({});
  const [effectsResult, setEffectsResult] = useState<{ [newsId: string]: string }>({});

  // Función para consultar efectos usando Gemini (ahora usando geminiApi)
  const fetchNewsEffects = async (news: any, stock: StockModalInfo) => {
    const newsId = news.id || news.url || news.headline;
    setEffectsLoading(prev => ({ ...prev, [newsId]: true }));
    setEffectsError(prev => ({ ...prev, [newsId]: null }));

    try {
      const result = await analyzeNewsEffect(
        {
          name: stock.name,
          symbol: stock.symbol,
          sector: stock.sector,
        },
        {
          headline: news.headline,
          summary: news.summary,
          source: news.source,
          datetime: news.datetime,
          url: news.url,
        }
      );
      setEffectsResult(prev => ({ ...prev, [newsId]: result }));
    } catch (e: any) {
      setEffectsError(prev => ({ ...prev, [newsId]: "No se pudo obtener el análisis de efectos." }));
    }
    setEffectsLoading(prev => ({ ...prev, [newsId]: false }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Precios de Acciones</h1>
          <p className="text-gray-600 mt-1">
            Cotizaciones del mercado colombiano actualizadas automáticamente
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
            onClick={() => updateStockPrices(currentPage)} 
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y selector de moneda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre, símbolo o sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity className="w-4 h-4" />
          <span>{totalItems} acciones</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Mostrar en:</span>
          <Button
            size="sm"
            variant={showInCop ? "outline" : "default"}
            onClick={() => setShowInCop(false)}
            disabled={!showInCop}
          >
            USD
          </Button>
          <Button
            size="sm"
            variant={showInCop ? "default" : "outline"}
            onClick={() => setShowInCop(true)}
            disabled={showInCop || usdToCop === null}
          >
            COP
          </Button>
        </div>
      </div>

      {/* Lista de Acciones */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(itemsPerPage)].map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 w-20 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-7 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-28 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  <div className="h-4 w-28 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="h-3 w-16 bg-gray-400 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-gray-300 rounded"></div>
                    <div className="h-8 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stocks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stocks
              .filter(stock =>
                !searchTerm.trim() ||
                (stock.symbol && stock.symbol.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
                (stock.name && stock.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
                (stock.sector && stock.sector.toLowerCase().includes(searchTerm.trim().toLowerCase()))
              )
              .map((stock) => (
                <Card key={stock.symbol} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {stock.sector}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                          {showInCop && usdToCop
                            ? formatCurrency(stock.currentPrice * usdToCop, 'COP')
                            : formatCurrency(stock.currentPrice, 'USD')}
                          <span className="text-xs text-gray-500 font-normal ml-1">
                            {showInCop ? 'COP' : 'USD'}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>
                            {stock.change >= 0 ? '+' : ''}
                            {showInCop && usdToCop
                              ? formatCurrency(stock.change * usdToCop, 'COP')
                              : formatCurrency(stock.change, 'USD')}
                          </span>
                          <span>
                            ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Precio de acción en {showInCop ? 'pesos (COP)' : 'dólares (USD)'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Máximo:</span>
                        <span className="font-medium ml-2">
                          {showInCop && usdToCop
                            ? formatCurrency(stock.high * usdToCop, 'COP')
                            : formatCurrency(stock.high, 'USD')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Mínimo:</span>
                        <span className="font-medium ml-2">
                          {showInCop && usdToCop
                            ? formatCurrency(stock.low * usdToCop, 'COP')
                            : formatCurrency(stock.low, 'USD')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Volumen:</span>
                        <span className="font-medium ml-2">{formatVolume(stock.volume)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Capitalización bursátil:</span>
                        <span className="font-medium ml-2">
                          {typeof stock.marketCap === 'number'
                            ? (showInCop && usdToCop
                                ? formatCurrency(stock.marketCap * usdToCop, 'COP')
                                : formatCurrency(stock.marketCap, 'USD'))
                            : stock.marketCap || 'No disponible'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {stock.lastUpdate.toLocaleTimeString('es-CO')}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenAnalysis(stock)}>
                          <LineChart className="w-4 h-4 mr-1" /> Ver Análisis
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleOpenNews(stock)}>
                          <Newspaper className="w-4 h-4 mr-1" /> Noticias
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {/* Paginación */}
          {(hasNextPage || currentPage > 1) && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={isLoading || !hasNextPage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        !isLoading && searchTerm && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600">
                No hay acciones que coincidan con "{searchTerm}". 
                Intenta con otro término de búsqueda.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Modal de análisis */}
      <AnalysisModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        stock={modalStock}
        analysis={analysis}
        analysisLoading={analysisLoading}
        analysisError={analysisError}
      />

      {/* Modal de noticias */}
      <NewsModal
        open={newsModalOpen}
        onOpenChange={setNewsModalOpen}
        stock={newsStock}
        newsList={newsList}
        newsLoading={newsLoading}
        newsError={newsError}
        effectsLoading={effectsLoading}
        effectsError={effectsError}
        effectsResult={effectsResult}
        fetchNewsEffects={fetchNewsEffects}
        parseBold={parseBold}
      />

      {/* Disclaimer */}
    </div>
  );
};

export default StockPrices;