import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowRight,
  Calculator,
  Newspaper,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { state, dispatch, showChat, setShowChat } = useApp();
  const { budgetData } = state;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financiero</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido a UBudget - Tu centro de control financiero personal
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Última actualización</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(budgetData.totalIncome)}
            </div>
            <p className="text-xs text-gray-500">
              Ingresos registrados este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(budgetData.totalExpenses)}
            </div>
            <p className="text-xs text-gray-500">
              Gastos registrados este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dinero Disponible</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(budgetData.availableMoney)}
            </div>
            <p className="text-xs text-gray-500">
              Disponible para ahorro e inversión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Disponible</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {budgetData.availablePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Del total de ingresos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Presupuesto */}
      {budgetData.totalIncome > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Estado de tu Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ingresos</span>
                <span className="font-medium text-green-600">{formatCurrency(budgetData.totalIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gastos</span>
                <span className="font-medium text-red-600">-{formatCurrency(budgetData.totalExpenses)}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="font-medium">Disponible para inversión</span>
                <Badge variant={budgetData.availableMoney > 0 ? "default" : "destructive"}>
                  {formatCurrency(budgetData.availableMoney)}
                </Badge>
              </div>
              {budgetData.availablePercentage > 20 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ¡Excelente! Tienes más del 20% disponible para ahorro e inversión.
                    Considera diversificar en CDTs, acciones y bonos.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banner de Educación Financiera */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Educación Financiera</h3>
              <p className="text-blue-100">
                Selecciona cualquier término financiero en la aplicación para obtener una explicación detallada. O utiliza las habilidades del asistente para analizar empresas.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowChat(!showChat)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Abrir Asistente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de bienvenida si no hay datos */}
      {budgetData.totalIncome === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Comienza a administrar tus finanzas!
            </h3>
            <p className="text-gray-600 mb-4">
              Agrega tus ingresos y gastos para obtener un análisis detallado de tu situación financiera
            </p>
            <Button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'budget' })}>
              Configurar mi Presupuesto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
