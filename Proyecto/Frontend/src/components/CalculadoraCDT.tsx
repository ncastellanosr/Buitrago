import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CalculadoraCDT: React.FC = () => {
  const { state } = useApp();
  const ingresos = state.budgetData.totalIncome;
  const disponible = state.budgetData.availableMoney;

  const [monto, setMonto] = useState<number>(5000000);
  const [tasaEA, setTasaEA] = useState<number>(12);
  const [plazoMeses, setPlazoMeses] = useState<number>(12);
  const [retencionPct, setRetencionPct] = useState<number>(4);
  const [modo, setModo] = useState<'vencimiento' | 'periodico'>('vencimiento');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(isFinite(amount) ? amount : 0);
  };

  const tasaMensual = useMemo(() => Math.pow(1 + (tasaEA / 100), 1 / 12) - 1, [tasaEA]);

  const resultados = useMemo(() => {
    if (monto <= 0 || plazoMeses <= 0 || tasaMensual < 0) {
      return { valorFinal: 0, interes: 0, retencion: 0, neto: 0 };
    }
    if (modo === 'vencimiento') {
      const valorFinal = monto * Math.pow(1 + tasaMensual, plazoMeses);
      const interes = valorFinal - monto;
      const retencion = interes * (retencionPct / 100);
      const neto = valorFinal - retencion;
      return { valorFinal, interes, retencion, neto };
    } else {
      const interesMensual = monto * tasaMensual;
      const interes = interesMensual * plazoMeses;
      const retencion = interes * (retencionPct / 100);
      const neto = monto + interes - retencion;
      return { valorFinal: neto, interes, retencion, neto };
    }
  }, [monto, plazoMeses, tasaMensual, retencionPct, modo]);

  const schedule = useMemo(() => {
    const rows: { periodo: number; saldoInicial: number; interes: number; saldoFinal: number; pago: number }[] = [];
    let saldo = monto;
    for (let i = 1; i <= plazoMeses; i++) {
      const interes = saldo * tasaMensual;
      if (modo === 'vencimiento') {
        const nuevoSaldo = saldo + interes;
        rows.push({ periodo: i, saldoInicial: saldo, interes, saldoFinal: nuevoSaldo, pago: 0 });
        saldo = nuevoSaldo;
      } else {
        const pagoInteres = monto * tasaMensual;
        rows.push({ periodo: i, saldoInicial: saldo, interes: pagoInteres, saldoFinal: saldo, pago: pagoInteres });
      }
    }
    return rows;
  }, [monto, plazoMeses, tasaMensual, modo]);

  const escenarios = useMemo(() => {
    const variants = [
      { nombre: 'Base', m: monto, ea: tasaEA, pl: plazoMeses },
      { nombre: 'Tasa +2pp', m: monto, ea: tasaEA + 2, pl: plazoMeses },
      { nombre: 'Plazo +6', m: monto, ea: tasaEA, pl: plazoMeses + 6 },
      { nombre: 'Monto +20%', m: monto * 1.2, ea: tasaEA, pl: plazoMeses },
    ];
    return variants.map(v => {
      const tm = Math.pow(1 + (v.ea / 100), 1 / 12) - 1;
      if (modo === 'vencimiento') {
        const vf = v.m * Math.pow(1 + tm, v.pl);
        const int = vf - v.m;
        const ret = int * (retencionPct / 100);
        const net = vf - ret;
        return { nombre: v.nombre, neto: net, interes: int };
      } else {
        const int = v.m * tm * v.pl;
        const ret = int * (retencionPct / 100);
        const net = v.m + int - ret;
        return { nombre: v.nombre, neto: net, interes: int };
      }
    });
  }, [monto, tasaEA, plazoMeses, retencionPct, modo]);

  const puedeInvertir = disponible >= monto;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Calculadora de CDT's</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parámetros del CDT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="monto">Monto</Label>
              <Input id="monto" type="number" value={monto || ''} onChange={(e) => setMonto(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tasa">Tasa Efectiva Anual (%)</Label>
                <Input id="tasa" type="number" step="0.01" value={tasaEA || ''} onChange={(e) => setTasaEA(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label htmlFor="plazo">Plazo (meses)</Label>
                <Input id="plazo" type="number" value={plazoMeses || ''} onChange={(e) => setPlazoMeses(parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ret">Retención (%)</Label>
                <Input id="ret" type="number" step="0.01" value={retencionPct || ''} onChange={(e) => setRetencionPct(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Modo de pago</Label>
                <Select value={modo} onValueChange={(v) => setModo(v as 'vencimiento' | 'periodico')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vencimiento">Pago al vencimiento (capitaliza)</SelectItem>
                    <SelectItem value="periodico">Pago periódico (interés mensual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full" onClick={() => {}}>
                Calcular
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { setMonto(5000000); setTasaEA(12); setPlazoMeses(12); setRetencionPct(4); setModo('vencimiento'); }}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Tasa mensual</span>
              <span className="font-medium">{(tasaMensual * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Interés ganado</span>
              <Badge variant="secondary">{formatCurrency(resultados.interes)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Retención</span>
              <span className="font-medium">{formatCurrency(resultados.retencion)}</span>
            </div>
            <div className="flex justify-between">
              <span>Neto al finalizar</span>
              <span className="font-bold">{formatCurrency(resultados.neto)}</span>
            </div>
            <div className={`p-3 rounded ${puedeInvertir ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
              {puedeInvertir ? 'Tienes dinero disponible suficiente para este monto.' : 'El monto supera tu disponible actual.'}
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              {escenarios.map((e, idx) => (
                <div key={idx} className="p-3 border rounded bg-blue-50">
                  <div className="font-medium">{e.nombre}</div>
                  <div className="text-sm">Neto: {formatCurrency(e.neto)}</div>
                  <div className="text-sm">Interés: {formatCurrency(e.interes)}</div>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => {
                    if (e.nombre === 'Tasa +2pp') setTasaEA(tasaEA + 2);
                    if (e.nombre === 'Plazo +6') setPlazoMeses(plazoMeses + 6);
                    if (e.nombre === 'Monto +20%') setMonto(Math.max(monto * 1.2, 0));
                  }}>Aplicar</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle por periodo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead>Saldo inicial</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Saldo final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((r) => (
                <TableRow key={r.periodo}>
                  <TableCell>{r.periodo}</TableCell>
                  <TableCell>{formatCurrency(r.saldoInicial)}</TableCell>
                  <TableCell>{formatCurrency(r.interes)}</TableCell>
                  <TableCell>{formatCurrency(r.pago)}</TableCell>
                  <TableCell>{formatCurrency(r.saldoFinal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Simulación con tasa mensual y opción de capitalización/pago periódico
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export function tasaMensualDesdeEA(tasaEA: number) {
  return Math.pow(1 + (tasaEA / 100), 1 / 12) - 1;
}

export function calcularCDTNeto(
  modo: 'vencimiento' | 'periodico',
  monto: number,
  tasaEA: number,
  plazoMeses: number,
  retencionPct: number
) {
  const tasaMensual = tasaMensualDesdeEA(tasaEA);
  if (monto <= 0 || plazoMeses <= 0 || tasaMensual < 0) {
    return { valorFinal: 0, interes: 0, retencion: 0, neto: 0 };
  }
  if (modo === 'vencimiento') {
    const valorFinal = monto * Math.pow(1 + tasaMensual, plazoMeses);
    const interes = valorFinal - monto;
    const retencion = interes * (retencionPct / 100);
    const neto = valorFinal - retencion;
    return { valorFinal, interes, retencion, neto };
  } else {
    const interesMensual = monto * tasaMensual;
    const interes = interesMensual * plazoMeses;
    const retencion = interes * (retencionPct / 100);
    const neto = monto + interes - retencion;
    return { valorFinal: neto, interes, retencion, neto };
  }
}

export default CalculadoraCDT;