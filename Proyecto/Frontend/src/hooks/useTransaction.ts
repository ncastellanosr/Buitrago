import { api } from '@/lib/api';

export function useTransaction() {
    const makeTransaction = async (
    email:string,
    accountOne:string,
    accountTwo:string,
    category:string,
    amountOne:string,
    amountTwo:string,
    currency:string,
    description:string
  ) => {
    const resp = await api.makeTransaction(email,accountOne,accountTwo,category,amountOne,amountTwo,currency,description);
    return resp;
  }
  const countAllTransactions = async (email:string) => {
    const resp = await api.countTransactions(email);
    return resp;
  }
  const getAllTransactinons = async (email:string) => {
    const resp = await api.getTransactions(email);
    return resp;
  }
  return { makeTransaction, countAllTransactions, getAllTransactinons }
}