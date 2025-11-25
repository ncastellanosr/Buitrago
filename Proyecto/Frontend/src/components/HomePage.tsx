import React from 'react';
import { Calculator, TrendingUp, GraduationCap, DollarSign, Users, Target } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  const { dispatch } = useApp();

  const handleRegister = () => {
    dispatch({ type: 'SET_AUTH_VIEW', payload: 'register' });
  };

  const handleLogin = () => {
    dispatch({ type: 'SET_AUTH_VIEW', payload: 'login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <img src="../../public/images/logo_UBudget2.png" className="h-10 w-auto" alt="Logo" />
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleLogin}
                className="border-green-700 text-green-700 hover:bg-green-50"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={handleRegister}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Toma el control de tus
              <span className="text-green-700"> finanzas</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              UBudget es una herramienta para gestionar presupuestos, calcular inversiones y educarte financieramente.
              Comienza tu viaje hacia la libertad financiera hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleRegister}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg"
              >
                Comenzar Gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLogin}
                className="border-green-700 text-green-700 hover:bg-green-50 px-8 py-3 text-lg"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas para gestionar tu dinero
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Herramientas poderosas diseñadas para ayudarte a tomar mejores decisiones financieras
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Calculadora de Presupuesto</h3>
                <p className="text-gray-600">
                  Crea y gestiona tu presupuesto mensual con nuestra calculadora intuitiva.
                  Visualiza tus gastos y ahorra más cada mes.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Inversiones</h3>
                <p className="text-gray-600">
                  Analiza y gestiona tus inversiones. Calcula rendimientos,
                  diversifica tu portafolio y alcanza tus metas financieras.
                </p>
              </div>

              <div className="bg-purple-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center mb-6">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Asistente Educativo</h3>
                <p className="text-gray-600">
                  Aprende sobre finanzas personales con nuestros recursos educativos.
                  Conviértete en un experto en gestión financiera.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Únete a miles de personas que ya controlan sus finanzas
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Comienza gratis y descubre todo el potencial de UBudget
            </p>
            <Button
              size="lg"
              onClick={handleRegister}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg"
            >
              Crear Cuenta Gratis
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="../../public/images/logo_UBudget2.png" className="h-10 w-auto" alt="Logo" />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white">Contacto</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 UBudget. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;