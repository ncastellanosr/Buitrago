import { api } from '@/lib/api';

export function useAccount() {
  const create = async (email:string, accName:string,type:string,currency:string,balance:string) => {
    const resp = await api.create(email,accName,type,currency,balance);
    return resp;
  }
  const activeAccounts = async (email:string) => {
    const resp = await api.getActiveAccounts(email);
    return resp;
  }
  const accountCount = async (email:string) => {
    const resp = await api.count(email);
    return resp;
  }
  const deactivateAccount = async (email:string, accountNumber:string) => {
    const resp = await api.deactivateAccount(email, accountNumber);
    return resp;
  }
  return { create, activeAccounts, accountCount, deactivateAccount }
}