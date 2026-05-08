# Interactive Demo — Implementation Plan

## Overview

Add a self-contained demo section to the website where visitors can register for the
Walletera demo environment, go through a guided onboarding (login → 2FA → API key
generation), and then use an interactive playground to create and query DinoPay outbound
payments — all from the browser.

---

## User Journey

1. User lands on the landing page and clicks a **"Try the demo"** CTA.
2. `/demo` shows two options: **Register** and **Log in**.
3. **Register path** → `/demo/register`: fill in email + password.
   On success → redirect to `/demo/login`.
4. **Login path** → `/demo/login`: email + password (+ OTP code if 2FA already enabled).
   On success → browser stores session cookie; read `otp` from response body.
5. If `otp: false` → redirect to `/demo/2fa` to set up 2FA.
   If `otp: true` → redirect to `/demo/api_keys`.
6. `/demo/2fa`: display QR code, user scans with authenticator app, submits TOTP code to
   enable 2FA → redirect to `/demo/api_keys`.
7. `/demo/api_keys`: if user has no keys, show "Generate API key" form (TOTP required).
   On success display `kid` + `secret` once with copy buttons, then link to playground.
   If keys already exist, list them with a "Go to playground" link.
8. `/demo/playground`: user enters `kid` + `secret`, then can:
   - Create a DinoPay outbound payment (pre-filled form → POST → display result)
   - Search for a payment by ID (GET → display status and fields)

---

## Routes

| Route              | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `/demo`            | Entry: register or log in choice                |
| `/demo/register`   | Registration form                               |
| `/demo/login`      | Login form                                      |
| `/demo/2fa`        | Enable 2FA: show QR code, confirm TOTP          |
| `/demo/api_keys`   | List / generate API keys                        |
| `/demo/playground` | Playground: enter credentials, create, search   |

All under `app/demo/` using the Next.js App Router.

---

## Pages & Components

### `/demo` — `app/demo/page.tsx`
Entry page. Two buttons: "Register" → `/demo/register`, "Log in" → `/demo/login`.

---

### `/demo/register` — `app/demo/register/page.tsx`

**Inputs**
- email (required)
- password (required)
- username (optional)

**Behavior**
- `POST /api/v1/auth/identity/users` with `multipart/form-data`.
- On `201`: show the returned `uid`, then redirect to `/demo/login`.
- On `400` / `422`: display validation errors inline.

**Components**
- `RegisterForm`

---

### `/demo/login` — `app/demo/login/page.tsx`

**Inputs**
- email (required)
- password (required)
- otp_code (optional — always show the field; user leaves it blank if 2FA not yet set up)

**Behavior**
- `POST /api/v1/auth/identity/sessions` with `multipart/form-data`.
- On `201`: browser stores session cookie. Store `csrf_token` from the response body in
  `sessionStorage` — it must be sent as a header on subsequent Barong requests.
  Read `otp` from response:
  - `otp: false` → redirect to `/demo/2fa`
  - `otp: true` → redirect to `/demo/api_keys`
- On error: display message.

**Components**
- `LoginForm`

---

### `/demo/2fa` — `app/demo/2fa/page.tsx`

**Step 1 — Generate QR code** (on page load)
- `POST /api/v1/auth/resource/otp/generate_qrcode` (session cookie + CSRF token header).
- On `200`: render `data.barcode` (base64-encoded PNG) as `<img>`.
- On `400` (already enabled): redirect to `/demo/api_keys`.

**Step 2 — Enable 2FA** (user submits TOTP)
- `POST /api/v1/auth/resource/otp/enable` with `code` field (formData).
- On `200`: redirect to `/demo/api_keys`.
- On `400` / `422`: show error.

**Components**
- `QRCodeDisplay` — renders the base64 barcode
- `TotpForm` — 6-digit input + submit

---

### `/demo/api_keys` — `app/demo/api_keys/page.tsx`

**On load**
- `GET /api/v1/auth/resource/api_keys` — list existing keys.
- If empty → show Generate form immediately.
- If non-empty → show list + "Go to playground" link + option to generate another.

**Generate API key form**
- algorithm: hidden, fixed to `HS256`
- totp_code: 6-digit TOTP input (required)
- `POST /api/v1/auth/resource/api_keys` (formData: algorithm, totp_code).
- On `201`: display `kid` and `secret` **once** with copy buttons, then show playground link.
- On `400`: redirect to `/demo/2fa`.

**Key list columns**: `kid`, `state`, `scope`, `created_at`

**Components**
- `ApiKeyList`
- `GenerateKeyForm`
- `ApiKeyReveal` — one-time display of kid + secret with copy buttons

---

### `/demo/playground` — `app/demo/playground/page.tsx`

#### Credentials panel
- `kid` input, `secret` input, "Connect" button
- On connect: send a lightweight authenticated request (e.g. `GET /api/v1/payments?limit=1`)
  to verify credentials are working.
- Show: connected ✓ / error ✗
- Store in `sessionStorage` only

#### Create Payment panel
Pre-filled DinoPay outbound form — all fields editable:
- amount (default: `100`)
- currency (default: `USD`)
- debtor accountNumber (default: `1200079635`)
- beneficiary accountHolder (default: `John Doe`), accountNumber (default: `9876543210`)
- `id`: auto-generated UUID v4, shown read-only

On submit → `POST /api/v1/payments` with HMAC headers.
Display: humanised status + payment ID, collapsible raw JSON.

#### Search Payment panel
- Payment ID input (UUID)
- On submit → `GET /api/v1/payments/{id}` with HMAC headers
- Display payment fields (see schema below) or friendly "not found" message

**Components**
- `CredentialsPanel`
- `CreatePaymentForm`
- `PaymentResult`
- `SearchPaymentForm`

---

## API Integration

### Base URL
`NEXT_PUBLIC_DEMO_API_URL` environment variable.
Default: `http://walletera.local`

The website routes all paths under this base URL through Envoy, which handles auth
translation and service routing.

### Auth — onboarding flow (session cookie)
After login the browser holds the session cookie. Every Barong request
(`/api/v1/auth/resource/*`) must also include:
```
X-CSRF-Token: <csrf_token from login response>
```

### Auth — playground requests (HMAC)
Envoy validates HMAC headers and injects a Bearer JWT before forwarding to the payments
service. The browser never sees the JWT.

```
nonce     = Date.now().toString()               // ms since epoch
signature = HMAC-SHA256(secret, nonce + kid)    // hex-encoded

X-Auth-Apikey:    <kid>
X-Auth-Nonce:     <nonce>
X-Auth-Signature: <signature>
```

---

### Endpoints

#### `POST /api/v1/auth/identity/users` — Register
`multipart/form-data`: `email` (req), `password` (req), `username` (opt)

| Code | Meaning            |
| ---- | ------------------ |
| 201  | User created — show `uid`, redirect to login |
| 400  | Missing required params |
| 422  | Validation errors |

---

#### `POST /api/v1/auth/identity/sessions` — Login
`multipart/form-data`: `email`, `password`, `otp_code` (opt)

| Code | Meaning |
| ---- | ------- |
| 201  | Session created — response is `UserWithFullInfo` |
| 400  | Missing params |
| 404  | User not found |

**`UserWithFullInfo` fields used by the demo**: `otp` (boolean), `csrf_token` (string)

---

#### `POST /api/v1/auth/resource/otp/generate_qrcode` — Get 2FA QR
No body. Requires session cookie + CSRF header.

| Code | Meaning |
| ---- | ------- |
| 200  | `{ data: { barcode: "<base64-png>" } }` |
| 400  | 2FA already enabled |
| 401  | Not authenticated |

---

#### `POST /api/v1/auth/resource/otp/enable` — Enable 2FA
`multipart/form-data`: `code` (6-digit TOTP, required)

| Code | Meaning |
| ---- | ------- |
| 200  | 2FA enabled |
| 400  | Already enabled or code missing |
| 401  | Not authenticated |
| 422  | Validation error |

---

#### `GET /api/v1/auth/resource/api_keys` — List API keys
Returns array of `APIKey`.

| Code | Meaning |
| ---- | ------- |
| 200  | Array of APIKey objects |
| 400  | 2FA required |
| 401  | Not authenticated |

**`APIKey` fields**: `kid`, `algorithm`, `scope`, `state`, `secret`*, `created_at`, `updated_at`
*`secret` is only present in the `201` creation response, not in the list.

---

#### `POST /api/v1/auth/resource/api_keys` — Create API key
`multipart/form-data`: `algorithm` = `HS256` (required), `totp_code` (required), `scope` (omit)

| Code | Meaning |
| ---- | ------- |
| 201  | Key created — response includes `kid` and `secret` (shown once) |
| 400  | 2FA required |
| 401  | Not authenticated |
| 422  | Validation error |

---

#### `POST /api/v1/payments` — Create Payment
`Content-Type: application/json`. Uses HMAC headers.

Request body (`paymentBasicAttributes`):

```json
{
  "id": "<uuid-v4>",
  "amount": 100,
  "currency": "USD",
  "gateway": "dinopay",
  "debtor": {
    "currency": "USD",
    "accountDetails": {
      "accountType": "dinopay",
      "accountHolder": "Richard Roe",
      "accountNumber": "1200079635"
    }
  },
  "beneficiary": {
    "currency": "USD",
    "accountDetails": {
      "accountType": "dinopay",
      "accountHolder": "John Doe",
      "accountNumber": "9876543210"
    }
  }
}
```

`currency` values: `ARS` `USD` `EUR` `BRL` `CLP` `UYI`

| Code | Meaning |
| ---- | ------- |
| 201  | Payment created — returns full `payment` object |
| 400  | Invalid params |
| 401  | Unauthorized |
| 409  | Payment ID already exists |
| 500  | Internal error |

---

#### `GET /api/v1/payments/{paymentId}` — Get Payment
Uses HMAC headers.

| Code | Meaning |
| ---- | ------- |
| 200  | Returns `payment` object |
| 401  | Unauthorized |
| 404  | Not found |

**`payment` response fields to display:**

| Field        | Type     | Notes                                              |
| ------------ | -------- | -------------------------------------------------- |
| `id`         | uuid     |                                                    |
| `status`     | string   | `pending` `delivered` `confirmed` `failed` `rejected` |
| `amount`     | number   |                                                    |
| `currency`   | string   |                                                    |
| `gateway`    | string   | `dinopay` or `bind`                                |
| `direction`  | string   | `inbound` or `outbound`                            |
| `externalId` | string   | ID from DinoPay, available after processing        |
| `createdAt`  | datetime |                                                    |
| `updatedAt`  | datetime |                                                    |

---

## State & Data Flow

- **Session cookie**: set by Barong on login, managed by the browser for same-origin requests.
- **`csrf_token`**: read from login response, stored in `sessionStorage`, sent as
  `X-CSRF-Token` header on all Barong resource requests.
- **`kid` + `secret`**: entered in the playground credentials panel, stored in
  `sessionStorage` only — never sent to the Next.js server.
- All API calls are **client-side** (browser → demo API). Next.js is not a proxy.

> **CORS note**: currently assumed the demo backend accepts requests from any origin.
> Revisit when the production domain is known.

---

## Post-launch TODO

- Add rate limiting / registration gating once the demo is live.

---

## Implementation Order

1. Scaffold all routes (`app/demo/**`)
2. Build onboarding flow: Register → Login → 2FA → API Keys
3. Build HMAC signing utility
4. Build `CredentialsPanel` + connect flow
5. Build `CreatePaymentForm` + `PaymentResult`
6. Build `SearchPaymentForm`
7. Wire "Try the demo" CTA on the landing page → `/demo`
