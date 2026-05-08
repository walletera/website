"use client";

import { useState, useEffect } from "react";
import {
  createPayment,
  getPayment,
  checkCredentials,
  ApiError,
  type Payment,
  type PaymentBody,
} from "../lib/api";
import { session } from "../lib/session";

function randomUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function humaniseError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Invalid credentials. Please check your API key and secret.";
    if (err.status === 404) return "Payment not found.";
    if (err.status === 409) return "A payment with this ID already exists.";
    if (err.status >= 500) return "Something went wrong on the server. Please try again.";
    return `Request failed (${err.status}). Please try again.`;
  }
  return "Could not reach the demo API. Check the base URL.";
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  confirmed: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  delivered: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  failed: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  rejected: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

function PaymentResult({ payment, raw }: { payment: Payment; raw: unknown }) {
  const [open, setOpen] = useState(false);
  const statusStyle = STATUS_STYLES[payment.status] ?? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";

  return (
    <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${statusStyle}`}>
          {payment.status}
        </span>
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {payment.amount} {payment.currency}
        </span>
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
        <p><span className="font-medium">ID:</span> {payment.id}</p>
        {payment.direction && <p><span className="font-medium">Direction:</span> {payment.direction}</p>}
        {payment.externalId && <p><span className="font-medium">External ID:</span> {payment.externalId}</p>}
        <p><span className="font-medium">Created:</span> {new Date(payment.createdAt).toLocaleString()}</p>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
      >
        {open ? "Hide" : "Show"} raw JSON
      </button>
      {open && (
        <pre className="text-[11px] font-mono bg-neutral-950 text-neutral-200 rounded-lg p-4 overflow-x-auto leading-relaxed">
          {JSON.stringify(raw, null, 2)}
        </pre>
      )}
    </div>
  );
}

function CredentialsPanel({
  kid, setKid, secret, setSecret, status, onConnect,
}: {
  kid: string;
  setKid: (v: string) => void;
  secret: string;
  setSecret: (v: string) => void;
  status: "idle" | "checking" | "connected" | "error";
  onConnect: () => void;
}) {
  return (
    <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        API credentials
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            API Key ID (kid)
          </label>
          <input
            type="text"
            value={kid}
            onChange={(e) => setKid(e.target.value)}
            placeholder="Enter your kid"
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-neutral-400 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Secret
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your secret"
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-neutral-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={onConnect}
          disabled={status === "checking" || !kid || !secret}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "checking" ? "Checking…" : "Check credentials"}
        </button>
        {status === "connected" && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Connected</span>
        )}
        {status === "error" && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">✗ Invalid credentials</span>
        )}
      </div>
    </section>
  );
}

function CreatePaymentPanel({ kid, secret, connected }: { kid: string; secret: string; connected: boolean }) {
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("USD");
  const [debtorAccNum, setDebtorAccNum] = useState("1200079635");
  const [beneHolder, setBeneHolder] = useState("John Doe");
  const [beneAccNum, setBeneAccNum] = useState("9876543210");
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ payment: Payment; raw: unknown } | null>(null);

  useEffect(() => {
    setPaymentId(randomUUID());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    const body: PaymentBody = {
      id: paymentId,
      amount: parseFloat(amount),
      currency,
      gateway: "dinopay",
      debtor: {
        currency,
        accountDetails: {
          accountType: "dinopay",
          accountHolder: "Richard Roe",
          accountNumber: debtorAccNum,
        },
      },
      beneficiary: {
        currency,
        accountDetails: {
          accountType: "dinopay",
          accountHolder: beneHolder,
          accountNumber: beneAccNum,
        },
      },
    };
    try {
      const payment = await createPayment(body, kid, secret);
      setResult({ payment, raw: payment });
      setPaymentId(randomUUID());
    } catch (err) {
      setError(humaniseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Create payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {["ARS", "USD", "EUR", "BRL", "CLP", "UYI"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Debtor account number
          </label>
          <input
            type="text"
            required
            value={debtorAccNum}
            onChange={(e) => setDebtorAccNum(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Beneficiary name
            </label>
            <input
              type="text"
              required
              value={beneHolder}
              onChange={(e) => setBeneHolder(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Beneficiary account number
            </label>
            <input
              type="text"
              required
              value={beneAccNum}
              onChange={(e) => setBeneAccNum(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-500 mb-1.5">
            Payment ID (auto-generated)
          </label>
          <input
            type="text"
            readOnly
            suppressHydrationWarning
            value={paymentId}
            className="w-full px-3 py-2 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-400 dark:text-neutral-600 text-xs font-mono"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !connected}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Send payment"}
        </button>
        {!connected && (
          <p className="text-xs text-neutral-400 text-center">Connect your credentials above to send payments.</p>
        )}
      </form>

      {result && <PaymentResult payment={result.payment} raw={result.raw} />}
    </section>
  );
}

function SearchPaymentPanel({ kid, secret, connected }: { kid: string; secret: string; connected: boolean }) {
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ payment: Payment; raw: unknown } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const payment = await getPayment(paymentId.trim(), kid, secret);
      setResult({ payment, raw: payment });
    } catch (err) {
      setError(humaniseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Search payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Payment ID (UUID)
          </label>
          <input
            type="text"
            required
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-neutral-400 font-mono"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !connected}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Searching…" : "Search"}
        </button>
        {!connected && (
          <p className="text-xs text-neutral-400 text-center">Connect your credentials above to search payments.</p>
        )}
      </form>

      {result && <PaymentResult payment={result.payment} raw={result.raw} />}
    </section>
  );
}

export default function PlaygroundPage() {
  const [kid, setKid] = useState("");
  const [secret, setSecret] = useState("");
  const [connStatus, setConnStatus] = useState<"idle" | "checking" | "connected" | "error">("idle");

  useEffect(() => {
    const creds = session.getCredentials();
    if (creds) {
      setKid(creds.kid);
      setSecret(creds.secret);
    }
  }, []);

  async function handleConnect() {
    setConnStatus("checking");
    try {
      await checkCredentials(kid, secret);
      setConnStatus("connected");
      session.setCredentials(kid, secret);
    } catch {
      setConnStatus("error");
    }
  }

  const connected = connStatus === "connected";

  return (
    <div className="w-full max-w-2xl py-16 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          Playground
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter your API credentials, then create or search for payments.
        </p>
      </div>

      <CredentialsPanel
        kid={kid}
        setKid={setKid}
        secret={secret}
        setSecret={setSecret}
        status={connStatus}
        onConnect={handleConnect}
      />

      <CreatePaymentPanel kid={kid} secret={secret} connected={connected} />
      <SearchPaymentPanel kid={kid} secret={secret} connected={connected} />
    </div>
  );
}
