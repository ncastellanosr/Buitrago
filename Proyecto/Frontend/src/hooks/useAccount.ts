import { api } from '@/lib/api';

export function useAccount() {
  const createAccount = async (email:string, accName:string,type:string,currency:string,balance:string) => {
    const resp = await api.createAccount(email,accName,type,currency,balance);
    return resp;
  }
  const activeAccounts = async (email:string) => {
    const resp = await api.getActiveAccounts(email);
    return resp;
  }
  const accountCount = async (email:string) => {
    const resp = await api.countAccounts(email);
    return resp;
  }
  const deactivateAccount = async (email:string, accountNumber:string) => {
    const resp = await api.deactivateAccount(email, accountNumber);
    return resp;
  }
  return { createAccount, activeAccounts, accountCount, deactivateAccount }
}