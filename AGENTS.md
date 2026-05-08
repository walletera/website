# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Security context requirement

`crypto.subtle` (HMAC signing) and `crypto.randomUUID` require a **secure context**. `http://walletera.local` is not one — only `localhost`/`127.0.0.1` over HTTP and any HTTPS origin qualify. The local dev stack serves `https://walletera.local` via nginx + mkcert. Do not introduce additional `crypto.subtle` or `crypto.randomUUID` calls without a fallback for non-secure contexts, or without ensuring the site is accessed over HTTPS.

## Demo API integration

All demo API calls are **client-side** — the Next.js server is not a proxy. `app/demo/lib/api.ts` owns all `fetch` calls and throws `ApiError` on non-2xx responses.

**Barong error responses** have the shape `{ errors: string[] }`. Use `parseBarongError(err.body)` from `app/demo/lib/barong-errors.ts` to convert them to readable messages before setting error state. Do not add new hardcoded error strings for Barong responses without first checking if the error code belongs in the mapping table.

**HMAC auth** (playground requests to `/api/v1/payments`): `X-Auth-Apikey`, `X-Auth-Nonce`, `X-Auth-Signature` headers are produced by `signRequest` in `app/demo/lib/hmac.ts`. Never expose the secret outside `sessionStorage`.

**Session auth** (Barong resource requests): session cookie is managed by the browser; `X-CSRF-Token` is read from the login response, stored in `sessionStorage` via `session.setCsrf()`, and included on every Barong resource request.

## Local dev topology

```
Browser → https://walletera.local (nginx:443)
  /api/*  →  envoy:3099  →  Barong / payments / accounts
  /*      →  host:3000   →  Next.js dev server
```

`NEXT_PUBLIC_DEMO_API_URL` defaults to `""` (same-origin relative URLs). Only override it if bypassing nginx.
