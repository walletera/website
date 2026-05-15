"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-32 px-6 border-t border-neutral-100 dark:border-neutral-900">
      <div className="max-w-2xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-6 leading-tight">
            Let&apos;s talk about your payment problem
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed mb-10 max-w-md mx-auto">
            If you&apos;re dealing with unreliable payment processing, high aggregator costs, or manual
            workflows — reach out. We&apos;re looking for teams to work with early.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/demo"
              className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
            >
              Try the demo
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <a
              href="mailto:federicoamoya@gmail.com?subject=Walletera%20conversation"
              className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
