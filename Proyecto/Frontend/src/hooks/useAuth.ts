import { api } from '@/lib/api';

export function useAuth() {
  const login = async (email:string, password:string) => {
    const resp = await api.login(email, password); // backend setea cookie
    return resp;
  };
  const register = async (email:string, password:string, name:string) => {
    const resp = await api.register(email, password, name);
    return resp;
  };
  const forgotPassword = async (email:string, password:string) => {
    const resp = await api.forgotPassword(email, password);
    return resp;
  };
  return { login, register, forgotPassword };
}