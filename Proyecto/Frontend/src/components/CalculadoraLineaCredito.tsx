import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const CalculadoraLineaCredito: React.FC = () => {
  const { state, userFinancials } = useApp();
  const ingresos = state.budgetData.totalIncome;
  const gastos = state.budgetData.totalExpenses;
  const disponible = state.budgetData.availableMoney;
  const perfilRiesgo = userFinancials?.perfilRiesgo || '';

  const [monto, setMonto] = useState<number>(10000000);
  const [tasaEA, setTasaEA] = useState<number>(24);
  const [plazoMeses, setPlazoMeses] = useState<number>(36);
  const [cargosMensuales, setCargosMensuales] = useState<number>(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(isFinite(amount) ? amount : 0);
  };

  const tasaMensual = useMemo(() => Math.pow(1 + (tasaEA / 100), 1 / 12) - 1, [tasaEA]);

  const cuota = useMemo(() => {
    if (plazoMeses <= 0 || tasaMensual <= 0) return 0 + cargosMensuales;
    const pmt = monto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazoMeses)));
    return pmt + cargosMensuales;
  }, [monto, plazoMeses, tasaMensual, cargosMensuales]);

  const dti = useMemo(() => (ingresos > 0 ? (cuota / ingresos) : 0), [cuota, ingresos]);

  const maxPct = useMemo(() => {
    if (perfilRiesgo === 'conservador') return 0.25;
    if (perfilRiesgo === 'moderado') return 0.35;
    if (perfilRiesgo === 'arriesgado') return 0.45;
    return 0.3;
  }, [perfilRiesgo]);

  const cuotaSostenible = ingresos * maxPct;
  const esSostenible = cuota <= cuotaSostenible && cuota <= disponible;

  const schedule = useMemo(() => {
    const rows: { periodo: number; saldoInicial: number; interes: number; abonoCapital: number; saldoFinal: number; cuota: number; cargos: number }[] = [];
    let saldo = monto;
    const pmtSinCargos = cuota - cargosMensuales;
    for (let i = 1; i <= plazoMeses; i++) {
      const interes = saldo * tasaMensual;
      const abonoCapital = Math.max(pmtSinCargos - interes, 0);
      const nuevoSaldo = Math.max(saldo - abonoCapital, 0);
      rows.push({ periodo: i, saldoInicial: saldo, interes, abonoCapital, saldoFinal: nuevoSaldo, cuota, cargos: cargosMensuales });
      saldo = nuevoSaldo;
    }
    return rows;
  }, [monto, tasaMensual, plazoMeses, cuota, cargosMensuales]);

  const totales = useMemo(() => {
    const totalInteres = schedule.reduce((s, r) => s + r.interes, 0);
    const totalCargos = schedule.reduce((s, r) => s + r.cargos, 0);
    const totalPagado = schedule.reduce((s, r) => s + r.cuota, 0);
    return { totalInteres, totalCargos, totalPagado };
  }, [schedule]);

  const escenarios = useMemo(() => {
    const calcCuota = (m: number, ea: number, pl: number, c: number) => {
      const tm = Math.pow(1 + (ea / 100), 1 / 12) - 1;
      if (pl <= 0 || tm <= 0) return 0 + c;
      const p = m * (tm / (1 - Math.pow(1 + tm, -pl)));
      return p + c;
    };
    const base = { nombre: 'Base', m: monto, ea: tasaEA, pl: plazoMeses, c: cargosMensuales };
    const altaTasa = { nombre: 'Tasa +2pp', m: monto, ea: tasaEA + 2, pl: plazoMeses, c: cargosMensuales };
    const plazoCorto = { nombre: 'Plazo -6', m: monto, ea: tasaEA, pl: Math.max(plazoMeses - 6, 6), c: cargosMensuales };
    const montoMenor = { nombre: 'Monto -20%', m: Math.max(monto * 0.8, 0), ea: tasaEA, pl: plazoMeses, c: cargosMensuales };
    const arr = [base, altaTasa, plazoCorto, montoMenor].map(e => {
      const q = calcCuota(e.m, e.ea, e.pl, e.c);
      const tm = Math.pow(1 + (e.ea / 100), 1 / 12) - 1;
      let saldo = e.m;
      const pmt = q - e.c;
      let ti = 0;
      for (let i = 1; i <= e.pl; i++) {
        const intM = saldo * tm;
        const ab = Math.max(pmt - intM, 0);
        saldo = Math.max(saldo - ab, 0);
        ti += intM;
      }
      const tp = q * e.pl;
      const ok = q <= ingresos * maxPct && q <= disponible;
      return { nombre: e.nombre, cuota: q, interes: ti, total: tp, sostenible: ok };
    });
    return arr;
  }, [monto, tasaEA, plazoMeses, cargosMensuales, ingresos, maxPct, disponible]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Calculadora de Líneas de Crédito</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parámetros del crédito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="monto">Monto del crédito</Label>
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
            <div>
              <Label htmlFor="cargos">Seguros y cargos mensuales</Label>
              <Input id="cargos" type="number" value={cargosMensuales || ''} onChange={(e) => setCargosMensuales(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full" onClick={() => {}}>
                Calcular
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { setMonto(10000000); setTasaEA(24); setPlazoMeses(36); setCargosMensuales(0); }}>
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
              <span>Cuota estimada</span>
              <Badge variant="secondary">{formatCurrency(cuota)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Tasa mensual</span>
              <span className="font-medium">{(tasaMensual * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>DTI (cuota / ingresos)</span>
              <span className="font-medium">{(dti * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Cuota sostenible según perfil</span>
              <span className="font-medium">{formatCurrency(cuotaSostenible)}</span>
            </div>
            <div className={`p-3 rounded ${esSostenible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {esSostenible ? 'La cuota es sostenible con tu presupuesto actual.' : 'La cuota excede tu capacidad estimada. Ajusta monto, tasa o plazo.'}
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {escenarios.map((e, idx) => (
                <div key={idx} className={`p-3 border rounded ${e.sostenible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="font-medium">{e.nombre}</div>
                  <div className="text-sm">Cuota: {formatCurrency(e.cuota)}</div>
                  <div className="text-sm">Interés: {formatCurrency(e.interes)}</div>
                  <div className="text-sm">Total: {formatCurrency(e.total)}</div>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => {
                    if (e.nombre === 'Tasa +2pp') setTasaEA(tasaEA + 2);
                    if (e.nombre === 'Plazo -6') setPlazoMeses(Math.max(plazoMeses - 6, 6));
                    if (e.nombre === 'Monto -20%') setMonto(Math.max(monto * 0.8, 0));
                  }}>Aplicar</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contexto del presupuesto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 rounded">
            <div className="text-sm">Ingresos</div>
            <div className="font-bold text-green-700">{formatCurrency(ingresos)}</div>
          </div>
          <div className="p-3 bg-red-50 rounded">
            <div className="text-sm">Gastos</div>
            <div className="font-bold text-red-700">{formatCurrency(gastos)}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-sm">Disponible</div>
            <div className="font-bold text-blue-700">{formatCurrency(disponible)}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabla de amortización</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead>Saldo inicial</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Abono a capital</TableHead>
                <TableHead>Cuota</TableHead>
                <TableHead>Saldo final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((r) => (
                <TableRow key={r.periodo}>
                  <TableCell>{r.periodo}</TableCell>
                  <TableCell>{formatCurrency(r.saldoInicial)}</TableCell>
                  <TableCell>{formatCurrency(r.interes)}</TableCell>
                  <TableCell>{formatCurrency(r.abonoCapital)}</TableCell>
                  <TableCell>{formatCurrency(r.cuota)}</TableCell>
                  <TableCell>{formatCurrency(r.saldoFinal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Interés total {formatCurrency(totales.totalInteres)} · Cargos {formatCurrency(totales.totalCargos)} · Total pagado {formatCurrency(totales.totalPagado)}
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export function calcularCuotaCredito(monto: number, tasaEA: number, plazoMeses: number, cargosMensuales: number) {
  const tasaMensual = Math.pow(1 + (tasaEA / 100), 1 / 12) - 1;
  if (plazoMeses <= 0 || tasaMensual <= 0) return 0 + (cargosMensuales || 0);
  const pmt = monto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazoMeses)));
  return pmt + (cargosMensuales || 0);
}

export function generarAmortizacionCredito(monto: number, tasaEA: number, plazoMeses: number, cuota: number, cargosMensuales: number) {
  const tasaMensual = Math.pow(1 + (tasaEA / 100), 1 / 12) - 1;
  const rows: { periodo: number; saldoInicial: number; interes: number; abonoCapital: number; saldoFinal: number }[] = [];
  let saldo = monto;
  const pmtSinCargos = cuota - (cargosMensuales || 0);
  for (let i = 1; i <= plazoMeses; i++) {
    const interes = saldo * tasaMensual;
    const abonoCapital = Math.max(pmtSinCargos - interes, 0);
    const nuevoSaldo = Math.max(saldo - abonoCapital, 0);
    rows.push({ periodo: i, saldoInicial: saldo, interes, abonoCapital, saldoFinal: nuevoSaldo });
    saldo = nuevoSaldo;
  }
  return rows;
}

export default CalculadoraLineaCredito;