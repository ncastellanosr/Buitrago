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
          <div>
            <img src="../../public/images/logo_UBudget2.png" className="h-10 w-auto" alt="Logo" />
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
