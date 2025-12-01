import React, { useState } from 'react';
import { Plus, Trash2, PieChart, Wallet, PersonStanding, WalletCardsIcon, DollarSign, CreditCard, Calendar, Receipt, Maximize2, X } from 'lucide-react';
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
import * as Dialog from '@radix-ui/react-dialog';
import { useTransaction } from '@/hooks/useTransaction';

const UserWallet: React.FC = () => {
  const { state, setAccountCount, setAccounts, setTransactionCount, setTransactions } = useApp();
  const { createAccount, accountCount, activeAccounts, deactivateAccount} = useAccount();
  const { makeTransaction, countAllTransactions, getAllTransactinons } = useTransaction();
  // Cuentas
  const [accountType, setAccountType] = useState<string>('');
  const [accountCurrency, setAccountCurrency] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);  
  const [obligationDate, setObligationDate] = useState<Date | null>(null);
  //Transacctiones
  const [transactionAccount1, setTransactionAccount1] = useState<string>('');
  const [transactionAccount2, setTransactionAccount2] = useState<string>('');
  const [transactionAmount1, setTransactionAmount1] = useState<string>('');
  const [transactionAmount2, setTransactionAmount2] = useState<string>('0.00');
  const [transactionDescription, setTransactionDescription] = useState<string>('');
  const [transactionCategory, setTransactionCategory] = useState<string>('');
  const [transactionCurrency, setTransactionCurrency] = useState<string>('');
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction ] = useState<any>(null);  

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
    console.log('Datos de cuenta actualizados:', { count: countData, accounts: accountsData });

  } catch (err) {
    console.error('Error actualizando datos:', err);
  }
};
const refreshTransactionData = async () => {
  try {
    if (!state.user?.email) {
      throw new Error('Usuario no autenticado');
    }
    const [countData, transactionsData] = await Promise.all([
      countAllTransactions(state.user.email),
      getAllTransactinons(state.user.email)
    ]);
    setTransactionCount(countData.message || 0);
    setTransactions(transactionsData.message || []);
  } catch (err) {
    console.error('Error actualizando datos:', err);
  }
};
  const handleCreateTransaction = async () => {
    if (!state.user?.email) {
      throw new Error('Usuario no autenticado');
    }
    //"email","accountOne","accountTwo","category","amountOne","amountTwo","currency","description"
    const newTransaction = {
      email: state.user?.email,
      accountOne: transactionAccount1,
      accountTwo: transactionAccount2,
      category: transactionCategory,
      amountOne: parseFloat(transactionAmount1).toString(),
      amountTwo: parseFloat(transactionAmount2).toString(),
      currency: transactionCurrency,
      description: transactionDescription,
    };
    console.log('Creando transacción con:', newTransaction);
    try{
      await makeTransaction(
        newTransaction.email,
        newTransaction.accountOne,
        newTransaction.accountTwo,
        newTransaction.category,
        newTransaction.amountOne,
        newTransaction.amountTwo,
        newTransaction.currency,
        newTransaction.description
      );
      await refreshTransactionData();
      alert('Transacción creada existosamente')
    } catch(err){
      alert('Error al crear la cuenta. Revisa los datos e intenta nuevamente.');
    } finally {
      refreshAccountData();
      setTransactionAccount1('');
      setTransactionAccount2('');
      setTransactionAmount1('');
      setTransactionAmount2('0.00');
      setTransactionCategory('');
      setTransactionCurrency('');
      setTransactionDescription('');
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
      await createAccount(newAccount.email,
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
      // await refreshAccountData();
      alert('Cuenta eliminada exitosamente');
      refreshAccountData();
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
            <div className="text-2xl font-bold text-blue-600">{state.transactionCount}</div>
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
                  <div key={account.accountNumber} className="relative flex items-center justify-between p-3 bg-white border rounded-lg">
                    {/* Botón en esquina superior derecha */}
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedAccount(account);
                        setAccountModalOpen(true);
                      }}
                    > 
                      <Maximize2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <div className="space-y-4">
                      <p className="font-medium">{account.accountName || 'Cuenta sin nombre'}</p>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-green-700">
                        {account.cachedBalance ? `$${account.cachedBalance}` : '$0.00'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={async () => {
                          if (window.confirm(`¿Eliminar la cuenta "${account.accountName}"?`)) {
                            await handleDeactivateAccount(account.accountNumber);
                          }
                        }}
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
                  value = {transactionAccount1}
                  onChange={(e) => setTransactionAccount1(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="transaction-account2">Cuenta #2 (opcional)</Label>
                <Input
                  id="transaction-account2"
                  placeholder="Ej: 5501-1a0b643b-6d1b-3d77-b5c3-e26bcf4468a8"
                  value={transactionAccount2}
                  onChange={(e) => setTransactionAccount2(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="transaction-category">Categoría</Label>
                  <Select value={transactionCategory} onValueChange={setTransactionCategory} >
                    <SelectTrigger id="transaction-category">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">INCOME</SelectItem>
                      <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                      <SelectItem value="TRANSFER">TRANSFER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction-currency">Moneda</Label>
                  <Select value={transactionCurrency} onValueChange={setTransactionCurrency} >
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
                  <Input 
                  id="transaction-amount1" 
                  type="number" 
                  placeholder="0.00"
                  value={transactionAmount1}
                  onChange={(e) => setTransactionAmount1(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="transaction-amount2">Monto #2 (opcional)</Label>
                  <Input id="transaction-amount2" 
                  type="number" 
                  placeholder="0.00" 
                  value={transactionAmount2}
                  onChange={(e) => setTransactionAmount2(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="transaction-description">Descripción (opcional)</Label>
                <Input
                  id="transaction-description"
                  placeholder="Ej: Almuerzo en el trabajo"
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCreateTransaction}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Transacción
              </Button>
            </div>
            {/* Lista de transacciones */}
            <div className="space-y-2">
              {state.transactions && state.transactions.length > 0 ? (
                state.transactions.map((transaction) => (
                  <div key={transaction.createdAt} className="relative flex items-center justify-between p-3 bg-white border rounded-lg">
                    {/* Botón en esquina superior derecha */}
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setTransactionModalOpen(true);
                      }}
                    > 
                      <Maximize2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <div className="space-y-4">
                      <p className="font-medium">{`Transacción realizada en ${
                          transaction?.createdAt 
                            ? new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'No disponible'
                          }` || 'Transacción sin descripción'}</p>
                      <p className="text-sm text-gray-500">{transaction.transactionType}</p>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-red-700">
                        {transaction.amount ? `$${transaction.amount}` : '$0.00'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Aún no has agregado transacciones</p>
              )}
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
      <Dialog.Root open={accountModalOpen} onOpenChange={setAccountModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold">
                Detalles de la Cuenta
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-sm opacity-70 hover:opacity-100">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Información completa de tu cuenta bancaria
            </Dialog.Description>
            <div>
              <Label className="text-sm font-medium text-gray-700">Nombre</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedAccount?.accountName ?? 'No disponible'}
              </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Número</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedAccount?.accountNumber ?? 'No disponible'}
              </Badge> 
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Balance</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-green-700 text-sm px-2.5 py-1">
                {selectedAccount?.cachedBalance ? `$${selectedAccount.cachedBalance}` : '$0.00'}
              </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Tipo</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedAccount?.accountType ?? 'No disponible'}
              </Badge>  
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Moneda</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedAccount?.accountCurrency ?? 'No disponible'}
              </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Fecha de creación</Label>
              <div className="text-base text-gray-900 mt-1"> 
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {
                selectedAccount?.createdAt 
                  ? new Date(selectedAccount.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No disponible'
                }
              </Badge>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
            <Dialog.Root open={transactionModalOpen} onOpenChange={setTransactionModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold">
                Detalles de la transacción
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-sm opacity-70 hover:opacity-100">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Información completa de tu cuenta bancaria
            </Dialog.Description>
            <div>
              <Label className="text-sm font-medium text-gray-700">id</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedTransaction?.id ?? 'No disponible'}
              </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Tipo</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedTransaction?.transactionType ?? 'No disponible'}
              </Badge> 
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Monto</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-red-700 text-sm px-2.5 py-1">
                {selectedTransaction?.amount ? `$${selectedTransaction.amount}` : '$0.00'}
              </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Moneda</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedTransaction?.currency ?? 'No disponible'}
              </Badge>  
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Descripción</Label>
              <div className="text-base text-gray-900 mt-1">
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {selectedTransaction?.description ?? 'No disponible'}
              </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Fecha de creación</Label>
              <div className="text-base text-gray-900 mt-1"> 
              <Badge variant="secondary" className="text-black-700 text-sm px-2.5 py-1">
                {
                selectedTransaction?.createdAt
                  ? new Date(selectedTransaction.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No disponible'
                }
              </Badge>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default UserWallet;