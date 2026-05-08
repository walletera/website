"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GitFork, Package, RefreshCw } from "lucide-react";

const snippet = `# Start the full local stack
cd local-testing && make start

# Run tests (no pre-running infra needed)
make test_all

# Add a new payment gateway
# Implement the gateway interface,
# register with RabbitMQ routing,
# done.`;

export default function DeveloperExperience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-100 dark:border-neutral-900"
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
              Developer experience
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-6 leading-tight">
              Own the code.
              <br />
              <span className="text-neutral-400 dark:text-neutral-500">Ship on your terms.</span>
            </h2>

            <div className="space-y-5">
              {[
                {
                  icon: GitFork,
                  title: "Fully open source",
                  desc: "No hidden code, no licensing gotchas. Fork it, modify it, run it anywhere.",
                },
                {
                  icon: Package,
                  title: "Modular services",
                  desc: "Each service is independent. Use what you need, leave what you don't.",
                },
                {
                  icon: RefreshCw,
                  title: "Fast iteration",
                  desc: "Local Docker Compose stack, testcontainers-based tests, and hot-reload development.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={14} className="text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-neutral-800">
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <span className="ml-2 text-xs text-neutral-500 font-mono">terminal</span>
            </div>
            <pre className="p-5 text-xs font-mono leading-relaxed text-neutral-300 overflow-x-auto">
              {snippet.split("\n").map((line, i) => (
                <div key={i}>
                  {line.startsWith("#") ? (
                    <span className="text-neutral-600">{line}</span>
                  ) : line === "" ? (
                    <span>&nbsp;</span>
                  ) : (
                    <span>
                      {line.startsWith("cd") || line.startsWith("make") ? (
                        <>
                          <span className="text-violet-400">$ </span>
                          <span className="text-neutral-200">{line}</span>
                        </>
                      ) : (
                        <span className="text-neutral-400 pl-2">{line}</span>
                      )}
                    </span>
                  )}
                </div>
              ))}
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
