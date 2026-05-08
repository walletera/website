import { API_BASE } from "./config";
import { signRequest } from "./hmac";
import { session } from "./session";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(`API error ${status}`);
  }
}

export type ApiKey = {
  kid: string;
  algorithm: string;
  scope: string;
  state: string;
  secret?: string;
  created_at: string;
  updated_at: string;
};

export type AccountBody = {
  currency: string;
  accountDetails: {
    accountType: string;
    accountHolder: string;
    accountNumber: string;
  };
};

export type PaymentBody = {
  id: string;
  amount: number;
  currency: string;
  gateway: string;
  debtor: AccountBody;
  beneficiary: AccountBody;
};

export type Payment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  gateway: string;
  direction?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  throw new ApiError(res.status, body);
}

function csrfHeaders(): Record<string, string> {
  const csrf = session.getCsrf();
  return csrf ? { "X-CSRF-Token": csrf } : {};
}

async function fetchWithHmac(
  url: string,
  options: RequestInit,
  kid: string,
  secret: string
): Promise<Response> {
  const { nonce, signature } = await signRequest(secret, kid);
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers as Record<string, string>),
      "X-Auth-Apikey": kid,
      "X-Auth-Nonce": nonce,
      "X-Auth-Signature": signature,
    },
  });
}

export async function register(
  email: string,
  password: string,
  username?: string
): Promise<{ uid: string }> {
  const form = new FormData();
  form.append("email", email);
  form.append("password", password);
  if (username) form.append("username", username);
  const res = await fetch(`${API_BASE}/api/v1/auth/identity/users`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  return handleResponse<{ uid: string }>(res);
}

export async function login(
  email: string,
  password: string,
  otpCode?: string
): Promise<{ uid: string; otp: boolean; csrf_token: string }> {
  const form = new FormData();
  form.append("email", email);
  form.append("password", password);
  if (otpCode) form.append("otp_code", otpCode);
  const res = await fetch(`${API_BASE}/api/v1/auth/identity/sessions`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  return handleResponse<{ uid: string; otp: boolean; csrf_token: string }>(res);
}

export async function generateQrCode(): Promise<{ data: { barcode: string } }> {
  const res = await fetch(
    `${API_BASE}/api/v1/auth/resource/otp/generate_qrcode`,
    {
      method: "POST",
      credentials: "include",
      headers: csrfHeaders(),
    }
  );
  return handleResponse<{ data: { barcode: string } }>(res);
}

export async function enableOtp(code: string): Promise<void> {
  const form = new FormData();
  form.append("code", code);
  const res = await fetch(`${API_BASE}/api/v1/auth/resource/otp/enable`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers: csrfHeaders(),
  });
  return handleResponse<void>(res);
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const res = await fetch(`${API_BASE}/api/v1/auth/resource/api_keys`, {
    credentials: "include",
    headers: csrfHeaders(),
  });
  return handleResponse<ApiKey[]>(res);
}

export async function createApiKey(totpCode: string): Promise<ApiKey> {
  const form = new FormData();
  form.append("algorithm", "HS256");
  form.append("totp_code", totpCode);
  const res = await fetch(`${API_BASE}/api/v1/auth/resource/api_keys`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers: csrfHeaders(),
  });
  return handleResponse<ApiKey>(res);
}

export async function createPayment(
  payment: PaymentBody,
  kid: string,
  secret: string
): Promise<Payment> {
  const res = await fetchWithHmac(
    `${API_BASE}/api/v1/payments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    },
    kid,
    secret
  );
  return handleResponse<Payment>(res);
}

export async function getPayment(
  id: string,
  kid: string,
  secret: string
): Promise<Payment> {
  const res = await fetchWithHmac(
    `${API_BASE}/api/v1/payments/${id}`,
    {},
    kid,
    secret
  );
  return handleResponse<Payment>(res);
}

export async function checkCredentials(
  kid: string,
  secret: string
): Promise<void> {
  const res = await fetchWithHmac(
    `${API_BASE}/api/v1/payments?limit=1`,
    {},
    kid,
    secret
  );
  if (res.status === 401) throw new ApiError(401, null);
}
