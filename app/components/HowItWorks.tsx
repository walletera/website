"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    step: "01",
    title: "Create payment",
    desc: "Client submits a payment request via REST API. The payments service validates, creates a domain aggregate, and appends a PaymentCreated event to EventStoreDB.",
    event: "payment.created",
  },
  {
    step: "02",
    title: "Process",
    desc: "RabbitMQ routes the event to the appropriate gateway (DinoPay, BIND, etc.). The gateway calls the external processor and publishes a result event.",
    event: "payment.updated",
  },
  {
    step: "03",
    title: "Reconcile",
    desc: "The read model consumes events and updates MongoDB projections. Every state change is recorded immutably—replay is always possible.",
    event: "payment.reconciled",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-100 dark:border-neutral-900"
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Async, event-driven, by design
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-800 mx-20" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative z-10 w-10 h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed mb-4 pl-13">
                  {step.desc}
                </p>
                <div className="ml-13">
                  <span className="font-mono text-[11px] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-1 rounded border border-violet-100 dark:border-violet-900/50">
                    {step.event}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Architecture diagram hint */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-8 font-mono text-xs text-neutral-400 dark:text-neutral-600 overflow-x-auto"
        >
          <pre className="leading-relaxed whitespace-pre">{`Client ──→ Envoy (3099) ──→ payments service
                                    │
                               EventStoreDB  ← domain events appended
                                    │
                               RabbitMQ ─────────────────────┐
                                    │                         │
                         payments-read-model           dinopay-gateway
                              (MongoDB)               (external HTTP)`}</pre>
        </motion.div>
      </div>
    </section>
  );
}
