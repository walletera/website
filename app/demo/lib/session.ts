const CSRF_KEY = "walletera_csrf";
const KID_KEY = "walletera_kid";
const SECRET_KEY = "walletera_secret";

export const session = {
  setCsrf(t: string): void {
    sessionStorage.setItem(CSRF_KEY, t);
  },
  getCsrf(): string {
    return sessionStorage.getItem(CSRF_KEY) ?? "";
  },
  setCredentials(kid: string, secret: string): void {
    sessionStorage.setItem(KID_KEY, kid);
    sessionStorage.setItem(SECRET_KEY, secret);
  },
  getCredentials(): { kid: string; secret: string } | null {
    const kid = sessionStorage.getItem(KID_KEY);
    const secret = sessionStorage.getItem(SECRET_KEY);
    if (!kid || !secret) return null;
    return { kid, secret };
  },
};
