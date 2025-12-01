import { api } from '@/lib/api';

export function useObligation() {
    const makeObligation = async (
    email:string,
    title:string,
    amountTotal:string,
    amountRemaining:string,
    currency:string,
    dueDate:string,
    frequency:string,
    state:string
  ) => {
    const resp = await api.createObligation(email,title,amountTotal,amountRemaining,currency,dueDate,frequency,state);
    return resp;
  }
  const obligationCounter = async (email: string) => {
    const resp = await api.countObligations(email);
    return resp;
  }
  const getAllObligations = async (email: string) => {
    const resp = await api.getObligations(email);
    return resp;
  }
  return { makeObligation, obligationCounter, getAllObligations }
}