const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

async function request(path: string, opts: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(opts.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    headers,
    credentials: "include", // <<-- importante: enviar cookies httpOnly
    ...opts,
  });

  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const errMsg = body && (body.message || body.error) ? (body.message || body.error) : res.statusText;
    const error: any = new Error(`HTTP ${res.status} - ${errMsg}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

export const api = {
  //Manejo de usuario
  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name: string) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) }),
  me: () => request("/auth/me", { method: "GET" }),
  logout: () => request("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string, password: string) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email, password }) }),
  //Manejo de la cuenta
  createAccount: (email:string, accName:string,type:string,currency:string,balance:string) => 
    request("/account/create", {method: "POST", body:JSON.stringify({email,accName,type,currency,balance})}),
  countAccounts: (email:string) =>
    request("/account/count", {method: "POST", body:JSON.stringify({email})}),
  getActiveAccounts: (email:string) =>
    request("/account/active-accounts", {method: "POST", body:JSON.stringify({email})}),
  deactivateAccount: (email:string, accountNumber:string) =>
    request("/account/deactivate", {method: "POST", body:JSON.stringify({email, accountNumber})}),
  //Manejo de transacciones 
  // "email","accountOne","accountTwo","category","amountOne","amountTwo","currency","description"
  makeTransaction: (
    email:string,
    accountOne:string,
    accountTwo:string,
    category:string,
    amountOne:string,
    amountTwo:string,
    currency:string,
    description:string
  ) =>
    request("/transaction/new", {method: "POST", body:JSON.stringify({email,accountOne,accountTwo,category,amountOne,amountTwo,currency,description})}
  ),
  countTransactions: (email:string) =>
    request("/transaction/count", {method: "POST", body:JSON.stringify({email})}),
  getTransactions: (email:string) =>
    request("/transaction/get", {method: "POST", body: JSON.stringify({email})}),
};