import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calculator,
  TrendingUp,
  LineChart,
  Newspaper,
  HelpCircle,
  Settings,
  PiggyBank,
  LogOut,
  Wallet
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Resumen general de tus finanzas'
  },
  {
    id: 'wallet',
    label: 'Billetera',
    icon: Wallet,
    description: 'Monitorea tus cuentas y transacciones'
  },
  {
    id: 'budget',
    label: 'Calculadora de Presupuesto',
    icon: Calculator,
    description: 'Administra tus ingresos y gastos'
  },
  {
    id: 'calculadora',
    label: 'Calculadora',
    icon: Calculator,
    description: 'Líneas de crédito y CDTs'
  },
  {
    id: 'investments',
    label: 'Opciones de Inversión',
    icon: PiggyBank,
    description: 'CDTs, bonos, finca raíz y más'
  },
  {
    id: 'stocks',
    label: 'Precios de Acciones',
    icon: LineChart,
    description: 'Mercado de valores en tiempo real'
  },
  {
    id: 'news',
    label: 'Noticias Financieras',
    icon: Newspaper,
    description: 'Últimas noticias del mercado'
  }
];

const Sidebar: React.FC = () => {
  const { state, dispatch, showChat, setShowChat } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border shadow-md lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        <span className="sr-only">Abrir menú</span>
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto pb-6
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:top-20 lg:h-[calc(100vh-4rem)]
        `}
        style={{ boxShadow: open ? '0 2px 8px rgba(0,0,0,0.08)' : undefined }}
      >
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left h-auto p-3',
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                      : 'hover:bg-blue-50'
                  )}
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                    <div className={cn(
                      'text-xs truncate mt-1',
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </nav>

          {/* Sección de herramientas adicionales */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Herramientas</h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 hover:text-gray-900"
                onClick={() => setShowChat(!showChat)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Asistente Educativo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 hover:text-gray-900"
                onClick={async () => {
                  dispatch({ type: 'SET_AUTHENTICATED', payload: false });
                  dispatch({ type: 'SET_AUTH_VIEW', payload: 'home' });
                  alert('Sesión finalizada, gracias por utilizar Ubudget.');
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Tip del día */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tip Financiero</h4>
            <p className="text-xs text-blue-700">
              Diversifica tus inversiones: no pongas todos los huevos en la misma canasta.
              Combina CDTs, acciones y bonos según tu perfil de riesgo.
            </p>
          </div>
        </div>
      </aside>
      {/* Fondo oscuro al abrir el menú en móvil */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
};

export default Sidebar;
