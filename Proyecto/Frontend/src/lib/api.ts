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
  create: (email:string, accName:string,type:string,currency:string,balance:string) => 
    request("/account/create", {method: "POST", body:JSON.stringify({email,accName,type,currency,balance})}),
  count: (email:string) =>
    request("/account/count", {method: "POST", body:JSON.stringify({email})}),
  getActiveAccounts: (email:string) =>
    request("/account/active-accounts", {method: "POST", body:JSON.stringify({email})}),
  deactivateAccount: (email:string, accountNumber:string) =>
    request("/account/deactivate", {method: "POST", body:JSON.stringify({email, accountNumber})}),
};

export async function login(credentials: { email: string; password: string }) {
  // This function would send credentials to your backend's login endpoint.
  // On successful login, the backend should set an httpOnly cookie.
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return response; // Returns user data or success message
}

export async function me() {
  return request("/auth/me");
}