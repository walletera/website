"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GitBranch, Wallet, Radio, Link2, BarChart2, Layers } from "lucide-react";

const capabilities = [
  {
    icon: GitBranch,
    title: "Payment workflows",
    desc: "Full lifecycle management from initiation to settlement, with state machine semantics and auditability.",
    tag: "Core",
  },
  {
    icon: Wallet,
    title: "Wallet infrastructure",
    desc: "Account and balance management with ledger-style transaction history and consistency guarantees.",
    tag: "Core",
  },
  {
    icon: Radio,
    title: "Event-driven core",
    desc: "Built on EventStoreDB and RabbitMQ. Every state change is an event—replayable, auditable, and observable.",
    tag: "Architecture",
  },
  {
    icon: Link2,
    title: "Gateway integrations",
    desc: "Connect to external payment processors by implementing a clean interface. DinoPay and Banco Industrial included as references.",
    tag: "Extensibility",
  },
  {
    icon: BarChart2,
    title: "Observability & testing",
    desc: "Structured logging, testcontainers-based integration tests, and load testing tooling built in.",
    tag: "Operations",
  },
  {
    icon: Layers,
    title: "Scalable architecture",
    desc: "CQRS read/write separation, horizontal scaling, and Kubernetes-native deployment via GitOps.",
    tag: "Infrastructure",
  },
];

export default function Capabilities() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="capabilities"
      className="py-24 px-6 border-t border-neutral-100 dark:border-neutral-900"
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
            Core capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Everything a payment platform needs
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white dark:bg-neutral-950 p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                  <cap.icon size={16} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-600 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800">
                  {cap.tag}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
