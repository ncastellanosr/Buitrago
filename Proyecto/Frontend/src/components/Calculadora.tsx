import React, { useState } from 'react';
import { Button } from './ui/button';
import CalculadoraLineaCredito from './CalculadoraLineaCredito';
import CalculadoraCDT from './CalculadoraCDT';

const Calculadora: React.FC = () => {
  const [view, setView] = useState<'none' | 'linea' | 'cdt'>('none');

  if (view === 'linea') {
    return <CalculadoraLineaCredito />;
  }

  if (view === 'cdt') {
    return <CalculadoraCDT />;
  }

  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="grid grid-cols-2 gap-6">
        <Button
          className="h-48 text-xl font-semibold hover:scale-105 transition-transform"
          onClick={() => setView('linea')}
        >
          Calcular líneas de crédito
        </Button>
        <Button
          className="h-48 text-xl font-semibold hover:scale-105 transition-transform"
          variant="outline"
          onClick={() => setView('cdt')}
        >
          Calcular CDT's
        </Button>
      </div>
    </div>
  );
};

export default Calculadora;

export function resolveCalculadoraTarget(action: 'linea' | 'cdt' | string) {
  if (action === 'linea') return 'linea';
  if (action === 'cdt') return 'cdt';
  return 'none';
}