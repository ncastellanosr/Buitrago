import React, { useState } from 'react';
import { Plus, Trash2, PieChart, Wallet, PersonStanding, WalletCardsIcon, DollarSign, CreditCard, Calendar, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAccount } from '@/hooks/useAccount';
import { useApp } from '@/contexts/AppContext';

const UserWallet: React.FC = () => {
  const { state, setAccountCount, setAccounts } = useApp();
  const { create, accountCount, activeAccounts, deactivateAccount } = useAccount();
  // Cuentas
  const [accountType, setAccountType] = useState<string>('');
  const [accountCurrency, setAccountCurrency] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');

  const [obligationDate, setObligationDate] = useState<Date | null>(null);
  
  const [reminderDate, setReminderDate] = useState<Date | null>(null);

const refreshAccountData = async () => {
  try {
    if (!state.user?.email) {
      throw new Error('Usuario no autenticado');
    }
    const [countData, accountsData] = await Promise.all([
      accountCount(state.user.email),
      activeAccounts(state.user.email)
    ]);
    setAccountCount(countData.message || 0);
    setAccounts(accountsData.message || []);
    refreshAccountData(); // no pregunten por qué está aquí, pero no lo quiten ni le pongan await
  } catch (err) {
    console.error('Error actualizando datos:', err);
    throw err; 
  }
};

  const handleCreateAccount = async () => {
    if (!state.user?.email) {
      throw new Error('Usuario no autenticado');
    }
    const newAccount = {
      email: state.user?.email || '',
      name: accountName,
      type: accountType,
      currency: accountCurrency,
      balance: accountBalance,
    };
    try{
      console.log('Creando cuenta con:', newAccount);
      await create(newAccount.email,
        newAccount.name,
        newAccount.type,
        newAccount.currency,
        newAccount.balance
      );
      alert('Cuenta creada existosamente')
      await refreshAccountData();
      console.log('Cuentas activas después de crear una nueva:', state.accounts);
    }catch(err){
      alert('Error al crear la cuenta. Revisa los datos e intenta nuevamente.');
    } finally {
      setAccountName('');
      setAccountType('');
      setAccountCurrency('');
      setAccountBalance('');
    }
  };
  const handleDeactivateAccount = async (accountNumber: string) => {
    if (!state.user?.email) {
      alert('Usuario no autenticado');
      return;
    }
    try {
      console.log('Eliminando cuenta con número:', accountNumber);
      await deactivateAccount(state.user.email, accountNumber);
      await refreshAccountData();
      alert('Cuenta eliminada exitosamente');
      console.log('Cuentas activas después de eliminar una cuenta:', state.accounts);
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      alert(`Error al eliminar la cuenta: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billetera del Usuario</h1>
          <p className="text-gray-600 mt-1">
            Monitorea tus cuentas y transacciones.
          </p>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Cuentas</CardTitle>
            <WalletCardsIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{state.accountCount}</div>
            <p className="text-sm text-gray-500">cuentas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Transacciones</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-500">transacciones realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Obligaciones</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-500">obligaciones pendientes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Crear Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CreditCard className="w-5 h-5" />
              Crear Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label htmlFor="account-name">Nombre de la cuenta</Label>
                <Input
                  id="account-name"
                  placeholder="Ej: Cuenta de ahorros del banco LibraCrypto SAS"
                  value = {accountName}
                  onChange={e => setAccountName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="account-type">Tipo de cuenta</Label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger id="account-type">
                      <SelectValue placeholder="Selecciona un tipo" />  
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">CASH</SelectItem>
                      <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                      <SelectItem value="CHECKING">CHECKING</SelectItem>
                      <SelectItem value="CREDIT_CART">CREDIT_CART</SelectItem>
                      <SelectItem value="INVESTMENT">INVESTMENT</SelectItem>
                      <SelectItem value="OTHER">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="account-currency">Tipo de Moneda</Label>
                  <Select value={accountCurrency} onValueChange={setAccountCurrency}>
                    <SelectTrigger id="account-currency">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="COP">COP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="account-balance">Monto</Label>
                <Input 
                id="account-balance" 
                type="number" 
                placeholder="0.00" 
                value={accountBalance}
                onChange={(e)=>setAccountBalance(e.target.value)}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCreateAccount}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Cuenta
              </Button>
            </div>
            {/* Lista de cuentas */}
            <div className="space-y-2">
              {state.accounts && state.accounts.length > 0 ? (
                state.accounts.map((account) => (
                  <div key={account.accountNumber} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div>
                      <p className="font-medium">{account.accountName || 'Cuenta sin nombre'} </p>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                      <p className="text-sm text-gray-500">Tipo: {account.accountType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-green-700">{account.cachedBalance ? `$${account.cachedBalance}` : '$0.00'}</Badge>
                      <Button size="sm" 
                      variant="ghost"
                      onClick={async () => {
                        if (window.confirm(`¿Eliminar la cuenta "${account.accountName}"?`)) {
                          await handleDeactivateAccount(account.accountNumber);
                        }
                      }}
                      // onClick={() => handleDeactivateAccount(account.accountNumber)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Aún no has agregado cuentas</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección de Transacciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Receipt className="w-5 h-5" />
              Realizar Transacción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label htmlFor="transaction-account1">Cuenta #1</Label>
                <Input
                  id="transaction-account1"
                  placeholder="Ej: 5502-2b0c743c-7e1c-4e88-a6d4-f37adf5579b9"
                />
              </div>
              <div>
                <Label htmlFor="transaction-account2">Cuenta #2 (opcional)</Label>
                <Input
                  id="transaction-account2"
                  placeholder="Ej: 5501-1a0b643b-6d1b-3d77-b5c3-e26bcf4468a8"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="transaction-category">Categoría</Label>
                  <Select>
                    <SelectTrigger id="transaction-category">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOOD">Comida</SelectItem>
                      <SelectItem value="TRANSPORT">Transporte</SelectItem>
                      <SelectItem value="UTILITIES">Servicios</SelectItem>
                      <SelectItem value="ENTERTAINMENT">Entretenimiento</SelectItem>
                      <SelectItem value="HEALTH">Salud</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction-currency">Moneda</Label>
                  <Select>
                    <SelectTrigger id="transaction-currency">
                      <SelectValue placeholder="Selecciona moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="COP">COP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="transaction-amount1">Monto #1</Label>
                  <Input id="transaction-amount1" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="transaction-amount2">Monto #2 (opcional)</Label>
                  <Input id="transaction-amount2" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="transaction-description">Descripción (opcional)</Label>
                <Input
                  id="transaction-description"
                  placeholder="Ej: Almuerzo en el trabajo"
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Transacción
              </Button>
            </div>

            {/* Lista de transacciones */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div>
                  <p className="font-medium">Comida</p>
                  <p className="text-sm text-gray-500">Almuerzo en el trabajo</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-red-700">$25,000</Badge>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-gray-500 py-4">No has agregado transacciones aún</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Crear Obligaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PersonStanding className="w-5 h-5" />
              Crear Obligación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label htmlFor="obligation-title">Nombre de la obligación</Label>
                <Input
                  id="obligation-title"
                  placeholder="Ej: Préstamo gota a gota"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="obligation-amount">Monto Total</Label>
                  <Input id="obligation-amount" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="obligation-currency">Moneda</Label>
                  <Select>
                    <SelectTrigger id="obligation-currency">
                      <SelectValue placeholder="Selecciona moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="COP">COP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="obligation-date">Fecha de Vencimiento</Label>
                  <DatePicker
                    selected={obligationDate}
                    onChange={(date: Date) => setObligationDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Selecciona una fecha"
                    minDate={new Date()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="obligation-frequency">Frecuencia de Pago</Label>
                  <Select>
                    <SelectTrigger id="obligation-frequency">
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_TIME">Una sola vez</SelectItem>
                      <SelectItem value="DAILY">Diario</SelectItem>
                      <SelectItem value="WEEKLY">Semanal</SelectItem>
                      <SelectItem value="MONTHLY">Mensual</SelectItem>
                      <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                      <SelectItem value="YEARLY">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Obligación
              </Button>
            </div>

            {/* Lista de obligaciones */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div>
                  <p className="font-medium">Préstamo gota a gota</p>
                  <p className="text-sm text-gray-500">Vence en 30 días</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-yellow-700">$5,000</Badge>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-gray-500 py-4">Aún no has agregado obligaciones</p>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Recordatorios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PersonStanding className="w-5 h-5" />
              Crear Recordatorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label htmlFor="reminder-title">Título del Recordatorio</Label>
                <Input
                  id="reminder-title"
                  placeholder="Ej: Pagar servicios"
                />
              </div>
              <div>
                <Label htmlFor="reminder-date">Fecha del Recordatorio</Label>
                <DatePicker
                  selected={reminderDate}
                  onChange={(date: Date) => setReminderDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="reminder-description">Descripción (opcional)</Label>
                <Input
                  id="reminder-description"
                  placeholder="Ej: Pagar agua, luz e internet"
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Recordatorio
              </Button>
            </div>

            {/* Lista de recordatorios */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div>
                  <p className="font-medium">Pagar servicios</p>
                  <p className="text-sm text-gray-500">2025-12-05</p>
                </div>
                <Button size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <p className="text-center text-gray-500 py-4">No has agregado recordatorios aún</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserWallet;