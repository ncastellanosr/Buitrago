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
    <div className="max-w-md mx-auto space-y-4">
      <Button className="w-full" onClick={() => setView('linea')}>Calcular líneas de crédito</Button>
      <Button className="w-full" variant="outline" onClick={() => setView('cdt')}>Calcular CDT's</Button>
    </div>
  );
};

export default Calculadora;

export function resolveCalculadoraTarget(action: 'linea' | 'cdt' | string) {
  if (action === 'linea') return 'linea';
  if (action === 'cdt') return 'cdt';
  return 'none';
}