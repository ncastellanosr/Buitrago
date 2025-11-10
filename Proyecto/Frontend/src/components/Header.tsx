import React from 'react';
import { Bell, User, Search, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo y nombre */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              UBudget
            </h1>
            <p className="text-sm text-gray-500">Tu plataforma financiera personal</p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar instrumentos financieros, noticias..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
          
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900">Usuario Demo</p>
            <p className="text-xs text-gray-500">Inversionista</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
