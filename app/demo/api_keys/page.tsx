"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listApiKeys, createApiKey, ApiError, type ApiKey } from "../lib/api";
import { session } from "../lib/session";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).then(done);
    } else {
      const el = document.createElement("textarea");
      el.value = value;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      done();
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 text-xs px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function ApiKeyReveal({ apiKey }: { apiKey: ApiKey }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
        ⚠️ Copy your secret now — it won&apos;t be shown again.
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">API Key ID (kid)</p>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <code className="text-xs text-neutral-900 dark:text-neutral-100 font-mono break-all flex-1">
              {apiKey.kid}
            </code>
            <CopyButton value={apiKey.kid} />
          </div>
        </div>

        {apiKey.secret && (
          <div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Secret</p>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <code className="text-xs text-neutral-900 dark:text-neutral-100 font-mono break-all flex-1">
                {apiKey.secret}
              </code>
              <CopyButton value={apiKey.secret} />
            </div>
          </div>
        )}
      </div>

      <Link
        href="/demo/playground"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
      >
        Go to playground →
      </Link>
    </div>
  );
}

function GenerateForm({ onCreated }: { onCreated: (k: ApiKey) => void }) {
  const router = useRouter();
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const key = await createApiKey(totpCode);
      if (key.secret) session.setCredentials(key.kid, key.secret);
      onCreated(key);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) { router.push("/demo/login"); return; }
        if (err.status === 400) { router.push("/demo/2fa"); return; }
        setError("Failed to create API key. Please try again.");
      } else {
        setError("Could not reach the demo API. Check the base URL.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          Authenticator code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-neutral-400 tracking-widest text-center text-base"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || totpCode.length !== 6}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating…" : "Generate API key"}
      </button>
    </form>
  );
}

function KeyTable({ keys }: { keys: ApiKey[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left py-2 pr-4 font-medium text-neutral-500 dark:text-neutral-400">kid</th>
            <th className="text-left py-2 pr-4 font-medium text-neutral-500 dark:text-neutral-400">state</th>
            <th className="text-left py-2 font-medium text-neutral-500 dark:text-neutral-400">created</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k.kid} className="border-b border-neutral-100 dark:border-neutral-900">
              <td className="py-2 pr-4 font-mono text-neutral-900 dark:text-neutral-100 max-w-[160px] truncate">
                {k.kid}
              </td>
              <td className="py-2 pr-4">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  k.state === "active"
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                }`}>
                  {k.state}
                </span>
              </td>
              <td className="py-2 text-neutral-500 dark:text-neutral-400">
                {new Date(k.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);

  useEffect(() => {
    listApiKeys()
      .then(setKeys)
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 401) { router.push("/demo/login"); return; }
          setLoadError("Failed to load API keys. Please try again.");
        } else {
          setLoadError("Could not reach the demo API. Check the base URL.");
        }
      });
  }, [router]);

  return (
    <div className="w-full max-w-md py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          API keys
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Generate a key to authenticate your playground requests.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
        {loadError && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {loadError}
          </p>
        )}

        {keys === null && !loadError && (
          <p className="text-sm text-neutral-400 text-center py-4">Loading…</p>
        )}

        {newKey && <ApiKeyReveal apiKey={newKey} />}

        {!newKey && keys !== null && (
          <div className="space-y-6">
            {keys.length > 0 && (
              <>
                <KeyTable keys={keys} />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/demo/playground"
                    className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
                  >
                    Go to playground →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowGenerate(true)}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Generate another
                  </button>
                </div>
              </>
            )}

            {(keys.length === 0 || showGenerate) && (
              <>
                {keys.length === 0 && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    You don&apos;t have any API keys yet. Generate one to get started.
                  </p>
                )}
                <GenerateForm
                  onCreated={(k) => {
                    setNewKey(k);
                    setShowGenerate(false);
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
