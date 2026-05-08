"use client";

import { motion } from "framer-motion";
import { ArrowRight, GitFork } from "lucide-react";
import PaymentFlowAnimation from "./PaymentFlowAnimation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(0 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="dark:hidden absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgb(0 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Radial fade at edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(124_58_237_/_0.06),transparent)]" />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Open source · Payments-as-a-Service
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] text-neutral-900 dark:text-neutral-50 mb-6"
        >
          Stop rebuilding
          <br />
          <span className="text-neutral-400 dark:text-neutral-500">payments from scratch</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Walletera gives you a production-ready foundation to build, extend, and operate
          payment systems—without months of trial and error.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
        >
          <a
            href="/demo"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            Try the demo
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="mailto:federicoamoya@gmail.com?subject=Walletera%20conversation"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
          >
            Start a conversation
          </a>
          <a
            href="https://github.com/walletera"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <GitFork size={14} />
            View on GitHub
          </a>
        </motion.div>

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-xs text-neutral-400 dark:text-neutral-600"
        >
          Open source · Cloud-agnostic · Built for high availability
        </motion.p>

        {/* Animation panel */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-16 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-6 mx-auto max-w-xl"
        >
          <PaymentFlowAnimation />
        </motion.div>
      </div>
    </section>
  );
}
