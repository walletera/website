"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CreditCard, ShoppingCart, Server, FlaskConical } from "lucide-react";

const cases = [
  {
    icon: CreditCard,
    title: "Fintech products",
    desc: "Wallets, transfers, and payment rails for consumer or B2B financial products.",
  },
  {
    icon: ShoppingCart,
    title: "Marketplaces",
    desc: "Payment orchestration, splits, and settlement flows for multi-party platforms.",
  },
  {
    icon: Server,
    title: "Internal systems",
    desc: "Treasury management, intercompany transfers, and back-office payment tooling.",
  },
  {
    icon: FlaskConical,
    title: "Experimentation",
    desc: "A production-grade playground for exploring payment architecture without starting from zero.",
  },
];

export default function UseCases() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6 border-t border-neutral-100 dark:border-neutral-900">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
            Built for many contexts
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Where Walletera fits
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-base">
            The platform is intentionally open-ended. It&apos;s not tied to one industry—it&apos;s a
            foundation for anywhere payments need to flow reliably.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/40 transition-colors">
                <c.icon size={16} className="text-neutral-500 dark:text-neutral-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
