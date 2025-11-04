import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Shield, 
  Home, 
  Building, 
  Percent,
  Clock,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CDT, Bond, RealEstate, Stock } from '../types';

interface InvestmentData {
  cdts: CDT[];
  bonds: Bond[];
  realEstate: RealEstate[];
  stocks: Stock[];
}

const Investments: React.FC = () => {
  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    cdts: [],
    bonds: [],
    realEstate: [],
    stocks: []
  });

  useEffect(() => {
    fetch('/data/financial-instruments.json')
      .then(response => response.json())
      .then(data => setInvestmentData(data))
      .catch(error => console.error('Error loading investment data:', error));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50 border-green-200';
      case 'medio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'alto': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opciones de Inversión</h1>
          <p className="text-gray-600 mt-1">
            Explora diferentes instrumentos financieros para hacer crecer tu dinero
          </p>
        </div>
      </div>

      {/* Información Educativa */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Consejos para Invertir</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Diversifica:</strong> No pongas todo tu dinero en un solo tipo de inversión</p>
                <p>• <strong>Conoce tu perfil:</strong> Mayor riesgo = mayor rentabilidad potencial, pero también mayor posibilidad de pérdidas</p>
                <p>• <strong>Invierte a largo plazo:</strong> La paciencia es clave en el mundo de las inversiones</p>
                <p>• <strong>Edúcate constantemente:</strong> Selecciona términos en esta página para aprender más</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cdts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cdts" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            CDTs
          </TabsTrigger>
          <TabsTrigger value="bonds" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Bonos
          </TabsTrigger>
          <TabsTrigger value="stocks" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Acciones
          </TabsTrigger>
          <TabsTrigger value="realestate" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Finca Raíz
          </TabsTrigger>
        </TabsList>

        {/* CDTs */}
        <TabsContent value="cdts" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Certificados de Depósito a Término (CDT)</h2>
            <p className="text-gray-600">
              Los <strong>CDTs</strong> son una de las inversiones más seguras en Colombia. Depositas dinero por un período fijo 
              y recibes una tasa de interés garantizada.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentData.cdts.map((cdt) => (
              <Card key={cdt.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cdt.bank}</CardTitle>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {cdt.interestRate}% anual
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{cdt.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Plazo:
                      </span>
                      <span className="font-medium">{cdt.term} días</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Monto mínimo:</span>
                      <span className="font-medium">{formatCurrency(cdt.minimumAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Ventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {cdt.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Desventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {cdt.disadvantages.map((disadvantage, index) => (
                          <li key={index}>• {disadvantage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Simular Inversión
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bonos */}
        <TabsContent value="bonds" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bonos</h2>
            <p className="text-gray-600">
              Los <strong>bonos</strong> son instrumentos de deuda donde prestas dinero al gobierno o empresas 
              a cambio de pagos de intereses regulares.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentData.bonds.map((bond) => (
              <Card key={bond.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bond.name}</CardTitle>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {bond.yield}% rendimiento
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{bond.type}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{bond.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Vencimiento:</span>
                      <span className="font-medium">{formatDate(bond.maturity)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Monto mínimo:</span>
                      <span className="font-medium">{formatCurrency(bond.minimumAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Ventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {bond.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Desventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {bond.disadvantages.map((disadvantage, index) => (
                          <li key={index}>• {disadvantage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Acciones */}
        <TabsContent value="stocks" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acciones</h2>
            <p className="text-gray-600">
              Las <strong>acciones</strong> representan una parte de la propiedad de una empresa. 
              Puedes ganar por dividendos y valorización, pero también hay riesgo de pérdidas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentData.stocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stock.name}</CardTitle>
                    <Badge className={getRiskColor(stock.riskLevel)}>
                      {stock.riskLevel} riesgo
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{stock.sector}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{stock.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Símbolo:</span>
                      <span className="font-mono font-medium">{stock.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Sector:</span>
                      <span className="font-medium">{stock.sector}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Ventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {stock.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Desventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {stock.disadvantages.map((disadvantage, index) => (
                          <li key={index}>• {disadvantage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Ver Cotización
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Finca Raíz */}
        <TabsContent value="realestate" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Finca Raíz</h2>
            <p className="text-gray-600">
              La inversión en <strong>finca raíz</strong> consiste en comprar propiedades para generar ingresos 
              por arriendo o ganancia por valorización.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentData.realEstate.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{property.type}</CardTitle>
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                      {property.expectedReturn}% rentabilidad
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{property.location}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{property.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Precio promedio:</span>
                      <span className="font-medium">{formatCurrency(property.averagePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Precio por m²:</span>
                      <span className="font-medium">{formatCurrency(property.pricePerM2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Ventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {property.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Desventajas
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {property.disadvantages.map((disadvantage, index) => (
                          <li key={index}>• {disadvantage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Calcular Rentabilidad
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Investments;
