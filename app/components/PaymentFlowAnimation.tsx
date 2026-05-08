"use client";

import { useEffect, useRef } from "react";

const NODES = [
  { id: "create", label: "Create Payment", x: 80, y: 120 },
  { id: "process", label: "Process", x: 280, y: 120 },
  { id: "reconcile", label: "Reconcile", x: 480, y: 120 },
];

const EDGES = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
];

export default function PaymentFlowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 560;
    const H = 240;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Particle state: one per edge, staggered
    const particles = EDGES.map((_, i) => ({
      progress: -i * 0.5,
    }));

    function draw(ts: number) {
      ctx!.clearRect(0, 0, W, H);
      timeRef.current = ts / 1000;

      const isDark = document.documentElement.classList.contains("dark");
      const nodeBg = isDark ? "#1a1a1a" : "#f8f8f8";
      const nodeBorder = isDark ? "#2e2e2e" : "#e2e2e2";
      const nodeText = isDark ? "#d4d4d4" : "#404040";
      const edgeColor = isDark ? "#2a2a2a" : "#e5e5e5";
      const particleColor = isDark ? "#a78bfa" : "#7c3aed";
      const dotColor = isDark ? "#6d28d9" : "#7c3aed";

      // Draw edges
      EDGES.forEach((edge) => {
        const from = NODES[edge.from];
        const to = NODES[edge.to];
        const x1 = from.x + 60;
        const y1 = from.y;
        const x2 = to.x - 60;
        const y2 = to.y;

        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.strokeStyle = edgeColor;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Arrow
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const ax = x2 - 6 * Math.cos(angle);
        const ay = y2 - 6 * Math.sin(angle);
        ctx!.beginPath();
        ctx!.moveTo(x2, y2);
        ctx!.lineTo(ax - 5 * Math.cos(angle - 0.4), ay - 5 * Math.sin(angle - 0.4));
        ctx!.lineTo(ax - 5 * Math.cos(angle + 0.4), ay - 5 * Math.sin(angle + 0.4));
        ctx!.closePath();
        ctx!.fillStyle = edgeColor;
        ctx!.fill();
      });

      // Draw nodes
      NODES.forEach((node, i) => {
        const rx = node.x - 60;
        const ry = node.y - 22;
        const rw = 120;
        const rh = 44;
        const r = 8;

        ctx!.beginPath();
        ctx!.moveTo(rx + r, ry);
        ctx!.lineTo(rx + rw - r, ry);
        ctx!.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
        ctx!.lineTo(rx + rw, ry + rh - r);
        ctx!.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
        ctx!.lineTo(rx + r, ry + rh);
        ctx!.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
        ctx!.lineTo(rx, ry + r);
        ctx!.quadraticCurveTo(rx, ry, rx + r, ry);
        ctx!.closePath();
        ctx!.fillStyle = nodeBg;
        ctx!.fill();
        ctx!.strokeStyle = nodeBorder;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Status dot
        const dotPhase = (timeRef.current * 0.8 + i * 0.6) % 1;
        const dotPulse = Math.sin(dotPhase * Math.PI * 2) * 0.3 + 0.7;
        ctx!.beginPath();
        ctx!.arc(rx + 14, ry + rh / 2, 3.5, 0, Math.PI * 2);
        ctx!.fillStyle = dotColor;
        ctx!.globalAlpha = dotPulse;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        ctx!.font = "500 12px var(--font-geist-sans, system-ui)";
        ctx!.fillStyle = nodeText;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(node.label, node.x, node.y + 1);
      });

      // Animate particles along edges
      particles.forEach((p, i) => {
        p.progress += 0.004;
        if (p.progress > 1.3) p.progress = -0.1;

        const t = Math.max(0, Math.min(1, p.progress));
        if (t <= 0 || t >= 1) return;

        const edge = EDGES[i];
        const from = NODES[edge.from];
        const to = NODES[edge.to];
        const x1 = from.x + 60;
        const y1 = from.y;
        const x2 = to.x - 60;
        const y2 = to.y;

        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;

        // Glow
        const grd = ctx!.createRadialGradient(px, py, 0, px, py, 10);
        grd.addColorStop(0, particleColor + "60");
        grd.addColorStop(1, particleColor + "00");
        ctx!.beginPath();
        ctx!.arc(px, py, 10, 0, Math.PI * 2);
        ctx!.fillStyle = grd;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx!.fillStyle = particleColor;
        ctx!.fill();
      });

      // Event labels below edges
      ctx!.font = "11px var(--font-geist-mono, monospace)";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";
      ctx!.fillStyle = isDark ? "#525252" : "#a3a3a3";
      ctx!.fillText("payment.created", 180, 134);
      ctx!.fillText("payment.processed", 380, 134);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="opacity-90"
        aria-label="Payment flow animation: Create Payment → Process → Reconcile"
      />
    </div>
  );
}
