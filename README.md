# Walletera Website

Marketing and interactive demo website for the [Walletera](https://github.com/walletera) Payments-as-a-Service platform.

Built with **Next.js 16**, React 19, Tailwind CSS 4, and TypeScript.

## Local Development

### Prerequisites

- Node.js 20+
- The `local-testing` stack running with nginx (see below)

### Why nginx is required

The demo playground signs requests with HMAC-SHA256 using `crypto.subtle`, which is only available in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). The nginx service in `local-testing` terminates TLS for `walletera.local` and proxies both the website (port 3000) and the API (Envoy, port 3099) under the same HTTPS origin — this satisfies the secure context requirement and eliminates CORS entirely.

### Setup

**1. Start the backend stack** (from the repo root):

```bash
cd local-testing
docker compose up -d
```

**2. Generate a TLS certificate for `walletera.local`** (once):

```bash
mkcert -install                                    # install local CA (once per machine)
cd local-testing/nginx/certs
mkcert walletera.local
```

**3. Restart nginx** to pick up the cert:

```bash
cd local-testing
docker compose restart nginx
```

**4. Start the dev server:**

```bash
npm install
npm run dev
```

**5. Open `https://walletera.local`** — not `localhost:3000`.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_DEMO_API_URL` | `""` | Base URL for demo API calls. Empty string = same-origin (correct when using nginx). Set to `http://walletera.local:3099` only for direct Envoy access without nginx. |

## Demo Section

The `/demo` route guides visitors through the full Walletera onboarding and lets them interact with live payments:

1. **Register** — creates a Barong account
2. **Login** — establishes a session (cookie + CSRF token)
3. **2FA** — scans a QR code and confirms TOTP
4. **API Keys** — generates an HS256 API key
5. **Playground** — creates and queries DinoPay outbound payments using HMAC auth

All API calls are **client-side** (browser → nginx → Envoy → services). The Next.js server is not a proxy.

See `DEMO_PLAN.md` for the full specification including endpoint details and request/response shapes.

## Project Structure

```
app/
├── components/        # Landing page sections (Hero, WhatIs, Capabilities, …)
├── demo/
│   ├── lib/
│   │   ├── api.ts         # All fetch calls; throws ApiError on non-2xx
│   │   ├── barong-errors.ts  # Maps Barong error codes to readable messages
│   │   ├── config.ts      # NEXT_PUBLIC_DEMO_API_URL
│   │   ├── hmac.ts        # HMAC-SHA256 request signing (requires secure context)
│   │   └── session.ts     # sessionStorage helpers for CSRF token and credentials
│   ├── register/
│   ├── login/
│   ├── 2fa/
│   ├── api_keys/
│   └── playground/
├── globals.css
├── layout.tsx
└── page.tsx           # Landing page
```
