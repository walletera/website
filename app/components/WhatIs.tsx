"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function WhatIs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="what-is-it" className="py-24 px-6 border-t border-neutral-100 dark:border-neutral-900">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
              What is Walletera
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-6 leading-tight">
              A platform built for how payments actually work.
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mb-6">
              Walletera is an open-source Payments-as-a-Service platform. It handles payment
              lifecycle, gateway integrations, and transaction processing — available as a managed
              service or self-hosted, depending on what works for your team.
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
              It&apos;s already running. Try the demo and interact with a live instance deployed on the cloud.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <a
              href="/demo"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
            >
              Try the demo
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
