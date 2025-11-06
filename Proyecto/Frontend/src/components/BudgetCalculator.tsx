import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, PieChart, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { ExpenseCategory, IncomeCategory, BudgetEntry } from '../types';

const BudgetCalculator: React.FC = () => {
  const { state, dispatch } = useApp();
  const [categories, setCategories] = useState<{ expenseCategories: ExpenseCategory[], incomeCategories: IncomeCategory[] }>({
    expenseCategories: [],
    incomeCategories: []
  });
  const [newIncome, setNewIncome] = useState<Partial<BudgetEntry>>({ categoryId: '', amount: 0, description: '' });
  const [newExpense, setNewExpense] = useState<Partial<BudgetEntry>>({ categoryId: '', amount: 0, description: '' });
  const [riskProfile, setRiskProfile] = useState(state.userFinancials?.perfilRiesgo || '');
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/budget-categories.json')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error loading categories:', error));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addIncome = () => {
    setIncomeError(null);
    if (!newIncome.categoryId) {
      setIncomeError('Selecciona una fuente de ingreso.');
      return;
    }
    if (!newIncome.amount || newIncome.amount <= 0) {
      setIncomeError('El monto debe ser mayor a 0.');
      return;
    }
    dispatch({
      type: 'ADD_INCOME',
      payload: {
        categoryId: newIncome.categoryId,
        amount: newIncome.amount,
        description: newIncome.description || ''
      }
    });
    setNewIncome({ categoryId: '', amount: 0, description: '' });
  };

  const addExpense = () => {
    setExpenseError(null);
    if (!newExpense.categoryId) {
      setExpenseError('Selecciona una categoría de gasto.');
      return;
    }
    if (!newExpense.amount || newExpense.amount <= 0) {
      setExpenseError('El monto debe ser mayor a 0.');
      return;
    }
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        categoryId: newExpense.categoryId,
        amount: newExpense.amount,
        description: newExpense.description || ''
      }
    });
    setNewExpense({ categoryId: '', amount: 0, description: '' });
  };

  const getCategoryName = (categoryId: string, type: 'income' | 'expense') => {
    const categoryList = type === 'income' ? categories.incomeCategories : categories.expenseCategories;
    const category = categoryList.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getExpensesPercentage = () => {
    if (state.budgetData.totalIncome === 0) return 0;
    return (state.budgetData.totalExpenses / state.budgetData.totalIncome) * 100;
  };

  const getAvailableStatus = () => {
    const percentage = state.budgetData.availablePercentage;
    if (percentage >= 20) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 10) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 0) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'danger', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleRiskProfileChange = (value: string) => {
    setRiskProfile(value);
    dispatch({ type: 'SET_RISK_PROFILE', payload: value });
  };

  const statusInfo = getAvailableStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculadora de Presupuesto</h1>
          <p className="text-gray-600 mt-1">
            Administra tus ingresos y gastos para alcanzar tus metas financieras
          </p>
        </div>
      </div>

      {/* Perfil de riesgo - UI mejorada y arriba de ingresos totales */}
      <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <span className="font-semibold text-blue-900">Perfil de riesgo:</span>
        <select
          value={riskProfile}
          onChange={e => handleRiskProfileChange(e.target.value)}
          className="border border-blue-300 rounded px-3 py-1 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Selecciona tu perfil</option>
          <option value="conservador">Conservador</option>
          <option value="moderado">Moderado</option>
          <option value="arriesgado">Arriesgado</option>
        </select>
        {riskProfile && (
          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium
            bg-blue-100 text-blue-700 border border-blue-200 capitalize">
            {riskProfile}
          </span>
        )}
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(state.budgetData.totalIncome)}
            </div>
            <p className="text-xs text-gray-500">
              {state.budgetData.income.length} fuente(s) de ingresos
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
              {formatCurrency(state.budgetData.totalExpenses)}
            </div>
            <p className="text-xs text-gray-500">
              {getExpensesPercentage().toFixed(1)}% de tus ingresos
            </p>
          </CardContent>
        </Card>

        <Card className={statusInfo.bg}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible para Inversión</CardTitle>
            <DollarSign className={`h-4 w-4 ${statusInfo.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusInfo.color}`}>
              {formatCurrency(state.budgetData.availableMoney)}
            </div>
            <p className="text-xs text-gray-500">
              {state.budgetData.availablePercentage.toFixed(1)}% de tus ingresos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Ingresos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulario para agregar ingresos */}
            <div className="space-y-3 p-4 bg-green-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="income-category">Fuente de Ingreso</Label>
                  <Select 
                    value={newIncome.categoryId} 
                    onValueChange={(value) => setNewIncome({...newIncome, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.incomeCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="income-amount">Monto</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newIncome.amount || ''}
                    onChange={(e) => setNewIncome({...newIncome, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="income-description">Descripción (opcional)</Label>
                <Input
                  placeholder="Ej: Salario empresa XYZ"
                  value={newIncome.description || ''}
                  onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                />
              </div>
              <Button onClick={addIncome} className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Ingreso
              </Button>
              {incomeError && (
                <div className="text-red-600 text-sm mt-2">{incomeError}</div>
              )}
            </div>

            {/* Lista de ingresos */}
            <div className="space-y-2">
              {state.budgetData.income.map((income, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div>
                    <p className="font-medium">{getCategoryName(income.categoryId, 'income')}</p>
                    {income.description && (
                      <p className="text-sm text-gray-500">{income.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-green-700">
                      {formatCurrency(income.amount)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dispatch({ type: 'REMOVE_INCOME', payload: index })}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {state.budgetData.income.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No has agregado ingresos aún
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección de Gastos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="w-5 h-5" />
              Gastos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulario para agregar gastos */}
            <div className="space-y-3 p-4 bg-red-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expense-category">Categoría de Gasto</Label>
                  <Select 
                    value={newExpense.categoryId} 
                    onValueChange={(value) => setNewExpense({...newExpense, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.expenseCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expense-amount">Monto</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="expense-description">Descripción (opcional)</Label>
                <Input
                  placeholder="Ej: Arriendo apartamento"
                  value={newExpense.description || ''}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <Button onClick={addExpense} className="w-full bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Gasto
              </Button>
              {expenseError && (
                <div className="text-red-600 text-sm mt-2">{expenseError}</div>
              )}
            </div>

            {/* Lista de gastos */}
            <div className="space-y-2">
              {state.budgetData.expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div>
                    <p className="font-medium">{getCategoryName(expense.categoryId, 'expense')}</p>
                    {expense.description && (
                      <p className="text-sm text-gray-500">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-red-700">
                      {formatCurrency(expense.amount)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dispatch({ type: 'REMOVE_EXPENSE', payload: index })}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {state.budgetData.expenses.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No has agregado gastos aún
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis y Recomendaciones */}
      {state.budgetData.totalIncome > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Análisis y Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Estado Actual</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Ingresos:</span>
                    <span className="font-medium text-green-600">{formatCurrency(state.budgetData.totalIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Gastos:</span>
                    <span className="font-medium text-red-600">{formatCurrency(state.budgetData.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Disponible:</span>
                    <span className={`font-bold ${statusInfo.color}`}>
                      {formatCurrency(state.budgetData.availableMoney)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recomendaciones</h4>
                <div className="space-y-2 text-sm">
                  {state.budgetData.availablePercentage >= 20 && (
                    <div className="p-3 bg-green-50 text-green-700 rounded">
                      ¡Excelente! Tienes más del 20% disponible. Considera invertir en CDTs o acciones.
                    </div>
                  )}
                  {state.budgetData.availablePercentage >= 10 && state.budgetData.availablePercentage < 20 && (
                    <div className="p-3 bg-blue-50 text-blue-700 rounded">
                      Buen manejo financiero. Podrías optimizar algunos gastos para aumentar tu capacidad de inversión.
                    </div>
                  )}
                  {state.budgetData.availablePercentage < 10 && state.budgetData.availablePercentage >= 0 && (
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded">
                      Considera revisar tus gastos. Idealmente deberías tener al menos 10% disponible para emergencias.
                    </div>
                  )}
                  {state.budgetData.availablePercentage < 0 && (
                    <div className="p-3 bg-red-50 text-red-700 rounded">
                      ⚠️ Tus gastos superan tus ingresos. Es urgente reducir gastos o aumentar ingresos.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetCalculator;
