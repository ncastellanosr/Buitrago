import React, { useState, useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Lightbulb,
  MessageCircle,
  Send,
  Bot,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useApp } from '../contexts/AppContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EducationalAssistantProps {
  selectedText: string;
  onClose: () => void;
}

const EducationalAssistant: React.FC<EducationalAssistantProps> = ({ selectedText, onClose }) => {
  const { state } = useApp();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (selectedText && state.educationalContent) {
      const term = selectedText.toLowerCase();
      const termData = state.educationalContent.terms[term];
      
      if (termData) {
        const initialMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `Te explico sobre "${selectedText}":\n\n**Definición:** ${termData.definition}\n\n**Explicación:** ${termData.explanation}\n\n**Ejemplo:** ${termData.example}`,
          timestamp: new Date()
        };
        setChatMessages([initialMessage]);
      } else {
        // Respuesta genérica si no encuentra el término
        const genericMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `No tengo información específica sobre "${selectedText}", pero puedo ayudarte con conceptos financieros como:\n\n• CDT\n• Acciones\n• Bonos\n• Diversificación\n• Inflación\n• Rentabilidad\n\n¿Sobre cuál te gustaría aprender?`,
          timestamp: new Date()
        };
        setChatMessages([genericMessage]);
      }
    } else {
      // Mensaje de bienvenida
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `¡Hola! Soy tu asistente financiero educativo. Puedo ayudarte a entender conceptos como:\n\n• **CDT**: Certificados de Depósito a Término\n• **Acciones**: Participación en empresas\n• **Bonos**: Instrumentos de deuda\n• **Diversificación**: Repartir riesgo\n• **Inflación**: Aumento de precios\n\n¿Qué concepto te gustaría que te explique?`,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  }, [selectedText, state.educationalContent]);

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const { educationalContent } = state;
    
    if (!educationalContent) {
      return "Lo siento, no tengo acceso a la información educativa en este momento.";
    }

    // Buscar coincidencias exactas
    for (const [term, data] of Object.entries(educationalContent.terms)) {
      if (input.includes(term)) {
        return `**${term.toUpperCase()}**\n\n**Definición:** ${data.definition}\n\n**Explicación:** ${data.explanation}\n\n**Ejemplo:** ${data.example}`;
      }
    }

    // Respuestas contextuales
    if (input.includes('riesgo') || input.includes('peligro')) {
      return "En finanzas, el **riesgo** es la posibilidad de perder dinero o no obtener la rentabilidad esperada. Mayor riesgo generalmente significa mayor rentabilidad potencial. Los CDTs tienen bajo riesgo, las acciones tienen mayor riesgo.";
    }
    
    if (input.includes('invertir') || input.includes('inversión')) {
      return "Para **invertir** exitosamente:\n\n1. **Define tus objetivos**: ¿A corto o largo plazo?\n2. **Conoce tu perfil de riesgo**: ¿Conservador o agresivo?\n3. **Diversifica**: No pongas todo en un solo lugar\n4. **Edúcate**: Entiende lo que compras\n5. **Ten paciencia**: Las mejores inversiones toman tiempo";
    }
    
    if (input.includes('empezar') || input.includes('comenzar')) {
      return "Para **empezar a invertir**:\n\n1. **Construye un fondo de emergencia** (3-6 meses de gastos)\n2. **Define cuánto puedes invertir** mensualmente\n3. **Comienza con CDTs** (bajo riesgo)\n4. **Aprende sobre acciones** gradualmente\n5. **Considera la diversificación** cuando tengas más experiencia";
    }
    
    if (input.includes('cuánto') || input.includes('monto')) {
      return "**¿Cuánto invertir?**\n\nRegla básica: Nunca inviertas dinero que necesites en los próximos 2 años.\n\n• **CDTs**: Desde $300,000\n• **Acciones**: Puedes empezar con $50,000\n• **Bonos**: Desde $100,000\n• **Finca raíz**: Requiere montos mucho mayores\n\nLo importante es empezar, aunque sea con poco.";
    }

    // Respuesta por defecto
    return `Interesante pregunta sobre "${userInput}". Puedo ayudarte con conceptos como:\n\n• **CDT**: Inversión segura a plazo fijo\n• **Acciones**: Participación en empresas\n• **Bonos**: Préstamos a gobierno/empresas\n• **Diversificación**: Repartir el riesgo\n• **Inflación**: Pérdida del poder adquisitivo\n\n¿Cuál te interesa más?`;
  };

  const sendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simular tiempo de respuesta
    setTimeout(() => {
      const assistantResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(currentInput),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Convertir markdown simple a JSX
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-blue-700">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Asistente Educativo Financiero</CardTitle>
              <p className="text-sm text-gray-500">Te ayudo a entender conceptos financieros</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {selectedText && (
          <div className="px-6 pb-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <BookOpen className="w-3 h-3 mr-1" />
              Consultando: "{selectedText}"
            </Badge>
          </div>
        )}

        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="text-sm whitespace-pre-line">
                        {message.type === 'assistant' ? formatMessage(message.content) : message.content}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Input
              placeholder="Pregúntame sobre conceptos financieros..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <Button onClick={sendMessage} disabled={isTyping || !currentInput.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500 text-center">
              Selecciona cualquier término financiero en la aplicación para obtener explicaciones detalladas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalAssistant;
