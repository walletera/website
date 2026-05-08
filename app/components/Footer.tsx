import { GitFork } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-neutral-100 dark:border-neutral-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-neutral-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-neutral-900 text-[9px] font-bold">W</span>
          </div>
          <span className="text-sm text-neutral-500 dark:text-neutral-500">
            Walletera · Open source · MIT License
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/walletera"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors"
          >
            <GitFork size={14} />
            GitHub
          </a>
          <a
            href="mailto:federicoamoya@gmail.com"
            className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
