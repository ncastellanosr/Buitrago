import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Badge } from '../ui/badge';

interface AnalysisResult {
  description: string;
  riskLevel: string;
  advantages: string[];
  disadvantages: string[];
  recommendation?: string;
}

interface StockPrice {
  name: string;
  symbol: string;
}

interface StockModalInfo {
  name: string;
  symbol: string;
  sector?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: StockModalInfo | null;
  analysis: AnalysisResult | null;
  analysisLoading: boolean;
  analysisError: string | null;
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel?.toLowerCase()) {
    case 'bajo': return 'text-green-600 bg-green-50 border-green-200';
    case 'medio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'alto': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

const AnalysisModal: React.FC<Props> = ({
  open,
  onOpenChange,
  stock,
  analysis,
  analysisLoading,
  analysisError,
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
            {stock?.name} ({stock?.symbol})
          </Dialog.Title>
          <Dialog.Description className="mb-0 text-gray-600">
            Análisis de la empresa
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
          {analysisLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-400 rounded w-1/3"></div>
            </div>
          ) : analysisError ? (
            <div className="text-red-600">{analysisError}</div>
          ) : analysis ? (
            <div className="space-y-3">
              {/* Badge generado con IA */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5l1.09 3.36a1 1 0 00.95.69h3.54a.5.5 0 01.29.91l-2.87 2.09a1 1 0 00-.36 1.12l1.09 3.36a.5.5 0 01-.77.56L10 13.77l-2.87 2.09a.5.5 0 01-.77-.56l1.09-3.36a1 1 0 00-.36-1.12l-2.87-2.09a.5.5 0 01.29-.91h3.54a1 1 0 00.95-.69L10 2.5z"/>
                  </svg>
                  Generado con IA
                </span>
              </div>
              <div>
                <span className="font-semibold">Descripción: </span>
                <span>{analysis.description}</span>
              </div>
              <div>
                <span className="font-semibold">Riesgo: </span>
                <Badge className={`ml-2 text-xs ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskLevel}
                </Badge>
              </div>
              <div>
                <span className="font-semibold">Ventajas:</span>
                <ul className="text-xs text-gray-600 space-y-0.5 ml-2 mt-1">
                  {analysis.advantages.map((adv, idx) => (
                    <li key={idx}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Consideraciones:</span>
                <ul className="text-xs text-gray-600 space-y-0.5 ml-2 mt-1">
                  {analysis.disadvantages.map((dis, idx) => (
                    <li key={idx}>• {dis}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Recomendación personalizada:</span>
                <div className="text-blue-700 mt-1 ml-2">
                  {analysis.recommendation || "No hay recomendación personalizada."}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default AnalysisModal;
