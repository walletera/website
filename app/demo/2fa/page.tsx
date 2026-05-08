"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateQrCode, enableOtp, ApiError } from "../lib/api";

export default function TwoFAPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enableError, setEnableError] = useState<string | null>(null);

  useEffect(() => {
    generateQrCode()
      .then((res) => setBarcode(res.data.barcode))
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 400) {
            router.push("/demo/api_keys");
            return;
          }
          if (err.status === 401) {
            router.push("/demo/login");
            return;
          }
          setLoadError("Failed to generate QR code. Please try again.");
        } else {
          setLoadError("Could not reach the demo API. Check the base URL.");
        }
      });
  }, [router]);

  async function handleEnable(e: React.FormEvent) {
    e.preventDefault();
    setEnableError(null);
    setSubmitting(true);
    try {
      await enableOtp(code);
      router.push("/demo/api_keys");
    } catch (err) {
      if (err instanceof ApiError) {
        setEnableError(
          err.status === 400
            ? "Invalid or missing code. Try again."
            : "Failed to enable 2FA. Please try again."
        );
      } else {
        setEnableError("Could not reach the demo API. Check the base URL.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          Enable two-factor authentication
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Scan the QR code with your authenticator app, then enter the 6-digit code to confirm.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm space-y-6">
        {loadError && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {loadError}
          </p>
        )}

        {!barcode && !loadError && (
          <div className="flex items-center justify-center h-48 text-sm text-neutral-400">
            Loading QR code…
          </div>
        )}

        {barcode && (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white rounded-lg border border-neutral-200 dark:border-neutral-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${barcode}`}
                alt="2FA QR code"
                width={180}
                height={180}
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
              Scan with Google Authenticator, Authy, or any TOTP app.
            </p>
          </div>
        )}

        <form onSubmit={handleEnable} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              6-digit code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-neutral-400 tracking-widest text-center text-base"
            />
          </div>

          {enableError && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {enableError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !barcode || code.length !== 6}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Enabling…" : "Enable 2FA"}
          </button>
        </form>
      </div>
    </div>
  );
}
