import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../contexts/AppContext';

const RegistrationForm: React.FC = () => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Una minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('Un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Un carácter especial');
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(', ');
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar términos
    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En una aplicación real, aquí se enviarían los datos al servidor
      console.log('Datos de registro:', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      // Mostrar mensaje de éxito
      alert('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');

      // Redirigir al login
      dispatch({ type: 'SET_AUTH_VIEW', payload: 'login' });
    } catch (error) {
      alert('Error al registrar. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToLogin = () => {
    dispatch({ type: 'SET_AUTH_VIEW', payload: 'login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Únete a UBudget y toma control de tus finanzas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="nombre"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`pl-10 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crea una contraseña segura"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">La contraseña debe tener: {errors.password}</p>
            )}
            {formData.password && !errors.password && (
              <div className="mt-2 text-xs text-green-600">
                <div className="flex items-center space-x-1">
                  <Check className="h-3 w-3" />
                  <span>Contraseña segura</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Términos y condiciones */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="aceptaTerminos"
                type="checkbox"
                checked={formData.aceptaTerminos}
                onChange={(e) => handleInputChange('aceptaTerminos', e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="aceptaTerminos" className="font-medium text-gray-700">
                Acepto los términos y condiciones
              </label>
              <p className="text-gray-500">
                Al registrarte, aceptas nuestros{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  términos de servicio
                </a>{' '}
                y{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  política de privacidad
                </a>
              </p>
            </div>
          </div>
          {errors.aceptaTerminos && <p className="mt-1 text-sm text-red-600">{errors.aceptaTerminos}</p>}

          {/* Botón de registro */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>

        {/* Enlace a login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={goToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>

        {/* Volver al inicio */}
        <div className="mt-4 text-center">
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_VIEW', payload: 'home' })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;