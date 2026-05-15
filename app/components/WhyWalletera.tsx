"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Activity, Shield, Clock } from "lucide-react";

const differentiators = [
  {
    icon: Globe,
    title: "Cloud-agnostic",
    desc: "Runs on AWS, GCP, Azure, or any Kubernetes provider. No lock-in.",
  },
  {
    icon: Activity,
    title: "Built to scale",
    desc: "Microservices architecture with CQRS and event sourcing. Scales horizontally as your volume grows.",
  },
  {
    icon: Shield,
    title: "High availability",
    desc: "Critical components (KurrentDB, RabbitMQ, MySQL) deployed in cluster mode. Designed to stay up.",
  },
  {
    icon: Clock,
    title: "Full auditability",
    desc: "Every state change is an event. Nothing is overwritten. Full history, always replayable.",
  },
];

export default function WhyWalletera() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="differentiators"
      className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-100 dark:border-neutral-900"
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Built to run in production from day one
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4">
                <item.icon size={16} className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
