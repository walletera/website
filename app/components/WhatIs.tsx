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
              A foundation you build on.
              <br />
              <span className="text-neutral-400 dark:text-neutral-500">Not a plug-and-play product.</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base mb-6">
              Walletera is an open-source Payments-as-a-Service platform. It gives engineers a
              modular, production-ready starting point for building payment systems—covering
              workflows, wallets, transaction processing, and external integrations.
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
              It&apos;s not a hosted service you subscribe to. It&apos;s a platform you own and extend, designed
              to save you months of foundational work so you can focus on what makes your product unique.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { label: "Cloud-agnostic", desc: "Deploy on any cloud or on-premise" },
              { label: "High availability", desc: "Designed for production from day one" },
              { label: "Event-driven", desc: "Async, resilient, and scalable by default" },
              { label: "Extensible", desc: "Add new payment gateways in hours, not weeks" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
