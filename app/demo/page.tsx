"use client";

import Link from "next/link";

export default function DemoEntryPage() {
  return (
    <div className="w-full max-w-md py-16 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Interactive demo
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
          Try the Walletera demo
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Create an account, generate an API key, and send your first payment in minutes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/demo/register"
          className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
        >
          Create an account
        </Link>
        <Link
          href="/demo/login"
          className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          I already have an account
        </Link>
      </div>
    </div>
  );
}
