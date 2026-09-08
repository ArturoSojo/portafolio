"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChevronRight, Terminal, Zap } from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { Reveal, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("refill-store")!;
const nxt = nextProject("refill-store");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* El recorrido real de una orden, contado como el log del backend. */
const LOG = [
    { t: "12:04:31", line: "POST /orders → RF-9K4BWD", tag: "awaiting_payment", tone: "warn" },
    { t: "12:05:12", line: "paymentRefs.lock ref=004417832", tag: "acquired", tone: "ok" },
    { t: "12:05:58", line: "pabilo.verify amount=3708.60 is_new=true", tag: "paid", tone: "ok" },
    { t: "12:06:00", line: "inefable.recharge pkg=171 ext=RF-9K4BWD-1", tag: "dispatching", tone: "warn" },
    { t: "12:06:01", line: "inefable.recharge pkg=171 timeout", tag: "retry", tone: "err" },
    { t: "12:06:02", line: "inefable.recharge pkg=171 ext=RF-9K4BWD-1", tag: "ok=true", tone: "ok" },
    { t: "12:06:03", line: "orders.update status", tag: "completed", tone: "ok" },
];

const css = `
.rs-crt::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 0, 0, 0.28) 3px,
    rgba(0, 0, 0, 0.28) 4px
  );
  opacity: 0.5;
}
.rs-crt::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  background: radial-gradient(120% 100% at 50% 50%, transparent 58%, rgba(0, 0, 0, 0.75) 100%);
}
.rs-sweep {
  position: absolute;
  left: 0;
  right: 0;
  height: 180px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(240, 48, 48, 0.09), transparent);
  animation: rs-scan 7.5s linear infinite;
}
@keyframes rs-scan {
  0% { transform: translateY(-200px); }
  100% { transform: translateY(105vh); }
}
@keyframes rs-glitch {
  0%, 100% { text-shadow: none; transform: translateX(0); }
  20% { text-shadow: -3px 0 #F03030, 3px 0 #3018F0; transform: translateX(1px); }
  40% { text-shadow: 3px 0 #F03030, -3px 0 #3018F0; transform: translateX(-1px); }
  60% { text-shadow: -2px 0 #F03030, 2px 0 #3018F0; }
}
.rs-title:hover { animation: rs-glitch 0.45s steps(2) 1; }
.rs-caret::after {
  content: "▊";
  color: #F03030;
  animation: rs-blink 1s steps(1) infinite;
}
@keyframes rs-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
.rs-window {
  border: 1px solid rgba(240, 48, 48, 0.32);
  background: #0A0A11;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 30px 70px -30px rgba(240, 48, 48, 0.4);
}
.rs-window-bar {
  background: linear-gradient(to bottom, rgba(240, 48, 48, 0.16), rgba(240, 48, 48, 0.05));
  border-bottom: 1px solid rgba(240, 48, 48, 0.28);
}
.rs-window .rs-scanline {
  position: absolute;
  inset-inline: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, rgba(240, 48, 48, 0.22), transparent);
  transform: translateY(-70px);
  opacity: 0;
  pointer-events: none;
}
.rs-window:hover .rs-scanline { animation: rs-window-scan 0.9s ease-out 1; }
@keyframes rs-window-scan {
  0% { transform: translateY(-70px); opacity: 0.9; }
  100% { transform: translateY(420px); opacity: 0; }
}
.rs-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
.rs-grid {
  background-image:
    linear-gradient(to right, rgba(240, 48, 48, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(240, 48, 48, 0.055) 1px, transparent 1px);
  background-size: 46px 46px;
}
@media (prefers-reduced-motion: reduce) {
  .rs-sweep, .rs-title:hover, .rs-caret::after, .rs-window:hover .rs-scanline { animation: none !important; }
  .rs-sweep { display: none; }
}
`;

/** Escribe un texto carácter a carácter cuando entra en pantalla. */
const Typed = ({ text, className, speed = 38 }: { text: string; className?: string; speed?: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [shown, setShown] = useState("");
    const reduce = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (reduce) {
            setShown(text);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let i = 0;
                const id = window.setInterval(() => {
                    i += 1;
                    setShown(text.slice(0, i));
                    if (i >= text.length) window.clearInterval(id);
                }, speed);
            },
            { threshold: 0.4 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [text, speed, reduce]);

    return (
        <span ref={ref} className={className}>
            {shown}
        </span>
    );
};

/** Ventana con marco de terminal: aquí viven los mockups. */
const TermWindow = ({
    title,
    children,
    className,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`rs-window relative overflow-hidden rounded-lg ${className ?? ""}`}>
        <div className="rs-window-bar flex items-center gap-2 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#F03030]" />
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <span className="rs-mono ml-2 truncate text-[10px] uppercase tracking-[0.2em] text-[#F03030]/80">
                {title}
            </span>
        </div>
        <span className="rs-scanline" />
        <div className="relative">{children}</div>
    </div>
);

/* ---------- Mockups recreados en CSS a partir de p.uiScreens ---------- */

const MockStore = () => (
    <div className="bg-[#07070C] p-4 text-[11px]">
        <div className="rs-mono flex gap-4 overflow-hidden border-y border-white/10 py-1.5 text-[9px] text-white/45">
            <span className="whitespace-nowrap">⚡ Jose R. · recargó 520 + 52 Diamantes · hace 3 min</span>
            <span className="whitespace-nowrap text-white/25">⚡ Andrea M. · 1.060 Gold · hace 7 min</span>
        </div>

        <div className="relative py-6 text-center">
            <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{ background: "radial-gradient(60% 70% at 50% 0%, rgba(240,48,48,0.16), transparent 70%)" }}
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F03030]/30 bg-[#F03030]/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#F03030]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 anim-blink" />
                Entrega automática 24/7
            </span>
            <p className="mt-3 text-xl font-black leading-tight text-white">
                Recarga tus juegos
                <br />
                <span style={{ backgroundImage: "linear-gradient(90deg,#F03030,#FF6A5F)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                    en segundos
                </span>
            </p>

            <div className="flex items-center justify-center gap-2 mt-4">
                <span className="rounded-lg px-3 py-2 text-[10px] font-bold text-black" style={{ backgroundImage: "linear-gradient(135deg,#F03030,#FF6A5F)" }}>
                    Recargar ahora →
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-left">
                    <span className="block text-[7px] uppercase tracking-[0.2em] text-white/40">Tasa del día</span>
                    <span className="rs-mono text-[11px] font-bold text-emerald-400">Bs 145,20</span>
                </span>
            </div>
        </div>

        <p className="mt-2 mb-2 text-[10px] font-bold text-white/80">Elige tu juego</p>
        <div className="grid grid-cols-2 gap-2">
            {[
                { name: "Free Fire", color: "#F03030", packs: "6 paquetes · desde Bs 285,00" },
                { name: "Blood Strike", color: "#5B8CFF", packs: "5 paquetes · desde Bs 310,00" },
            ].map((g) => (
                <div
                    key={g.name}
                    className="relative overflow-hidden rounded-lg border border-white/10 p-2.5 h-[86px] flex flex-col justify-end shine-sweep"
                    style={{ background: `linear-gradient(160deg, ${g.color}30, #101019)` }}
                >
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[7px] text-emerald-400">
                        ⚡ Instantáneo
                    </span>
                    <span className="text-[11px] font-bold text-white">{g.name}</span>
                    <span className="text-[8px] text-white/45">{g.packs}</span>
                </div>
            ))}
        </div>
    </div>
);

const MockPay = () => (
    <div className="bg-[#07070C] p-4 space-y-2.5 text-[11px]">
        <div className="rounded-lg p-3 text-center" style={{ border: "1px solid transparent", backgroundImage: "linear-gradient(#101019,#101019), linear-gradient(135deg,#F03030,#3018F0)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
            <p className="text-[7px] uppercase tracking-[0.2em] text-white/40">Monto exacto a transferir</p>
            <p className="rs-mono mt-1 text-2xl font-black text-white">Bs 1.953,44</p>
            <p className="mt-0.5 text-[9px] text-white/45">$13,45 · Tasa Bs 145,20</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[8px] text-amber-300">
                ⏱ Tiempo para pagar: 27:14
            </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <span className="rounded-lg border border-[#F03030]/50 bg-[#F03030]/10 px-2 py-2 text-center text-[9px] font-semibold text-white">
                Pago Móvil
                <span className="block text-[7px] font-normal text-white/40">Al teléfono</span>
            </span>
            <span className="rounded-lg border border-white/10 px-2 py-2 text-center text-[9px] text-white/60">
                Transferencia
                <span className="block text-[7px] text-white/35">A la cuenta</span>
            </span>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#101019] p-2.5">
            <p className="text-[9px] font-bold text-white">Datos del Pago Móvil</p>
            <p className="text-[7px] text-white/35">Toca cualquier dato para copiarlo</p>
            {[
                ["Banco", "0102 · Banco de Venezuela"],
                ["Cédula", "V-27.845.109"],
                ["Teléfono", "0414-8624450"],
            ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                    <span className="text-[8px] text-white/40">{k}</span>
                    <span className="rs-mono text-[9px] text-white/85">{v}</span>
                </div>
            ))}
        </div>

        <div className="rounded-lg border border-white/10 bg-[#101019] p-2.5">
            <p className="text-[9px] font-bold text-white">Confirma tu pago</p>
            <div className="rs-mono mt-1.5 rounded-md border border-[#F03030]/40 bg-[#0A0A11] px-2 py-1.5 text-[10px] text-white/80">
                004417832
            </div>
            <div className="mt-2 rounded-md py-1.5 text-center text-[10px] font-bold text-black" style={{ backgroundImage: "linear-gradient(135deg,#F03030,#FF6A5F)" }}>
                Ya pagué, verificar
            </div>
        </div>
    </div>
);

const MockAdmin = () => (
    <div className="bg-[#07070C] p-3 text-[11px]">
        <div className="flex gap-1 mb-2">
            {["7 días", "30 días", "90 días"].map((r, i) => (
                <span
                    key={r}
                    className={`rounded px-2 py-0.5 text-[8px] ${i === 1 ? "bg-[#F03030]/20 text-[#F03030]" : "text-white/35"}`}
                >
                    {r}
                </span>
            ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5">
            {[
                ["Ingresos", "$4.128", "#F03030"],
                ["Utilidad", "$1.204", "#22C55E"],
                ["Órdenes", "317", "#5B8CFF"],
                ["Usuarios", "182", "#A855F7"],
            ].map(([label, value, color]) => (
                <div key={label} className="rounded-md border border-white/10 bg-[#101019] p-1.5">
                    <p className="text-[7px] uppercase tracking-wide text-white/35">{label}</p>
                    <p className="rs-mono text-[12px] font-bold" style={{ color }}>{value}</p>
                </div>
            ))}
        </div>

        <div className="mt-2 rounded-md border border-white/10 bg-[#101019] p-2">
            <p className="text-[8px] text-white/50 mb-1">Ingresos y utilidad</p>
            <svg viewBox="0 0 300 70" className="w-full h-16" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="rs-a" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F03030" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#F03030" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[14, 28, 42, 56].map((y) => (
                    <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#ffffff" strokeOpacity="0.05" />
                ))}
                <path d="M0,54 L40,44 L80,50 L120,30 L160,36 L200,18 L240,26 L300,10 L300,70 L0,70 Z" fill="url(#rs-a)" />
                <path d="M0,54 L40,44 L80,50 L120,30 L160,36 L200,18 L240,26 L300,10" fill="none" stroke="#F03030" strokeWidth="1.6" />
                <path d="M0,62 L40,58 L80,60 L120,50 L160,53 L200,44 L240,48 L300,38" fill="none" stroke="#5B8CFF" strokeWidth="1.4" />
            </svg>
        </div>

        <div className="mt-2 space-y-1">
            {[
                ["3 orden(es) pagadas con fallo de entrega", "#F03030"],
                ["2 orden(es) esperando confirmación", "#F59E0B"],
            ].map(([text, color]) => (
                <div
                    key={text}
                    className="flex items-center justify-between rounded-md px-2 py-1 text-[8px]"
                    style={{ background: `${color}18`, color }}
                >
                    <span>{text}</span>
                    <ChevronRight size={10} />
                </div>
            ))}
        </div>
    </div>
);

/* ------------------------------- Landing ------------------------------- */

const Landing = () => {
    const reduce = useReducedMotion();
    const hero = p.media.find((m) => m.src.includes("hero-1920")) ?? p.media.find((m) => m.kind === "image");
    const wordmark = p.media.find((m) => m.src.includes("wordmark"));
    const emblem = p.media.find((m) => m.src.includes("emblem"));
    const coinIcons = p.media.filter((m) => m.src.endsWith(".svg"));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="rs-crt">
            <style>{css}</style>
            {!reduce && <span aria-hidden className="rs-sweep fixed top-0" />}

            {/* ───────────────────────── HERO ───────────────────────── */}
            <section className="relative px-4 pt-28 pb-20 md:px-6 md:pt-36 md:pb-28">
                <div aria-hidden className="absolute inset-0 rs-grid opacity-70" />
                {hero && (
                    <div aria-hidden className="absolute inset-0 overflow-hidden">
                        <Image src={hero.src} alt="" fill priority className="object-cover opacity-[0.14]" />
                    </div>
                )}
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[520px]"
                    style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(240,48,48,0.20), transparent 70%), radial-gradient(40% 50% at 85% 10%, rgba(48,24,240,0.16), transparent 70%)" }}
                />

                <div className="relative max-w-5xl mx-auto">
                    <p className="rs-mono text-[11px] text-[#F03030]/80">refill@store:~$ cat proyecto.md</p>

                    {wordmark && (
                        <Image
                            src={wordmark.src}
                            alt={p.name}
                            width={320}
                            height={80}
                            priority
                            className="w-auto mt-6 h-14 md:h-20 anim-float"
                        />
                    )}

                    <h1 className="rs-title mt-6 max-w-3xl text-4xl font-black leading-[1.05] md:text-7xl">
                        <Typed text="Recargas que se despachan solas" />
                        <span className="rs-caret" />
                    </h1>

                    <p className="max-w-2xl mt-6 text-base leading-relaxed opacity-75 md:text-xl">{p.tagline}</p>

                    <div className="flex flex-wrap gap-2 mt-8">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                        <Chip>{p.status}</Chip>
                    </div>
                    <p className="rs-mono mt-4 text-[11px] opacity-50">{p.role}</p>

                    <div className="flex flex-wrap gap-3 mt-9">
                        {p.links.web && (
                            <BrandButton href={p.links.web}>
                                <Zap size={16} /> Abrir la tienda
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <BrandButton href={p.links.github} variant="outline">
                                <Terminal size={16} /> Ver el código
                            </BrandButton>
                        )}
                    </div>
                </div>
            </section>

            {/* ──────────────────── LOG: el ciclo de una orden ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="01 / El ciclo"
                        title={
                            <>
                                Una compra, <span className="brand-gradient-text">línea a línea</span>
                            </>
                        }
                        lead="Lo que ocurre entre que el jugador pulsa «pagar» y la recarga le llega, sin que nadie mire un teléfono."
                    />

                    <TermWindow title="orders.log · producción" className="mt-10">
                        <div className="rs-mono p-4 text-[11px] leading-relaxed md:p-6 md:text-[13px] overflow-x-auto">
                            <Stagger stagger={0.16}>
                                {LOG.map((row) => (
                                    <StaggerItem key={row.t} y={8}>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1">
                                            <span className="opacity-35">[{row.t}]</span>
                                            <span className="opacity-85">{row.line}</span>
                                            <span
                                                className="rounded px-1.5 py-0.5 text-[10px]"
                                                style={{
                                                    background:
                                                        row.tone === "ok"
                                                            ? "rgba(34,197,94,0.14)"
                                                            : row.tone === "err"
                                                            ? "rgba(48,24,240,0.22)"
                                                            : "rgba(245,158,11,0.14)",
                                                    color:
                                                        row.tone === "ok" ? "#22C55E" : row.tone === "err" ? "#7C8BFF" : "#F59E0B",
                                                }}
                                            >
                                                {row.tag}
                                            </span>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </Stagger>

                            <div className="pt-4 mt-4 border-t border-white/10">
                                <span className="opacity-40">estados de una orden </span>
                                <span className="text-[#F03030]">
                                    {"█".repeat(11)}
                                </span>
                                <span className="opacity-40"> 11/11</span>
                            </div>
                        </div>
                    </TermWindow>
                </div>
            </section>

            {/* ──────────────────── PROBLEMA / SOLUCIÓN ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="grid max-w-5xl gap-6 mx-auto md:grid-cols-2">
                    <Reveal direction="right">
                        <div className="h-full p-6 border rounded-lg md:p-8 border-white/10 bg-white/[0.02]">
                            <p className="rs-mono text-[11px] uppercase tracking-[0.24em] text-white/35">
                                # antes
                            </p>
                            <h3 className="mt-3 text-xl font-bold md:text-2xl">Todo a mano, por WhatsApp</h3>
                            <p className="mt-4 text-sm leading-relaxed opacity-70 md:text-base">{p.problem}</p>
                        </div>
                    </Reveal>

                    <Reveal direction="left" delay={0.12}>
                        <div
                            className="h-full p-6 rounded-lg md:p-8"
                            style={{
                                border: "1px solid rgba(240,48,48,0.35)",
                                background: "linear-gradient(160deg, rgba(240,48,48,0.10), rgba(16,16,25,0.6))",
                            }}
                        >
                            <p className="rs-mono text-[11px] uppercase tracking-[0.24em] text-[#F03030]">
                                # después
                            </p>
                            <h3 className="mt-3 text-xl font-bold md:text-2xl">Una tubería automática y auditable</h3>
                            <p className="mt-4 text-sm leading-relaxed opacity-80 md:text-base">{p.solution}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ──────────────────── HIGHLIGHTS ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / Lo que hace"
                        title={
                            <>
                                Seis piezas que <span className="brand-gradient-text">sostienen la tienda</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="relative h-full p-5 overflow-hidden transition-colors duration-500 border rounded-lg group border-white/10 bg-[#101019]/60 hover:border-[#F03030]/45">
                                        <span
                                            aria-hidden
                                            className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: "linear-gradient(90deg, transparent, #F03030, transparent)" }}
                                        />
                                        <span className="inline-grid rounded-md h-9 w-9 place-items-center bg-[#F03030]/15 text-[#F03030]">
                                            <Icon size={17} />
                                        </span>
                                        <h3 className="mt-4 text-base font-bold">{h.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed opacity-65">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ──────────────────── MOCKUPS ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-0 rs-grid opacity-40" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / La interfaz"
                        title={
                            <>
                                Tres pantallas, <span className="brand-gradient-text">un mismo recorrido</span>
                            </>
                        }
                        lead="Del catálogo al pago y del pago al panel: la tienda que ve el jugador y la consola que ve el equipo."
                    />

                    <div className="grid gap-6 mt-12 md:grid-cols-3">
                        {[
                            { title: "tienda · portada", node: <MockStore />, name: p.uiScreens[0]?.name },
                            { title: "tienda · pago", node: <MockPay />, name: p.uiScreens[2]?.name },
                            { title: "panel · resumen", node: <MockAdmin />, name: p.uiScreens[4]?.name },
                        ].map((m, i) => (
                            <Reveal key={m.title} direction="up" delay={i * 0.1}>
                                <TermWindow title={m.title}>{m.node}</TermWindow>
                                <p className="rs-mono mt-3 text-[10px] uppercase tracking-[0.16em] opacity-45">{m.name}</p>
                            </Reveal>
                        ))}
                    </div>

                    {coinIcons.length > 0 && (
                        <Reveal className="flex flex-wrap items-center justify-center gap-8 mt-14">
                            {coinIcons.map((coin) => (
                                <span key={coin.src} className="flex flex-col items-center gap-2 anim-float">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={coin.src} alt={coin.caption} className="h-10 w-10" />
                                    <span className="rs-mono text-[9px] uppercase tracking-[0.16em] opacity-40">
                                        {coin.caption.replace(/^Icono de moneda:\s*/i, "")}
                                    </span>
                                </span>
                            ))}
                        </Reveal>
                    )}
                </div>
            </section>

            {/* ──────────────────── MÉTRICAS ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <TermWindow title="stats --repo">
                        <div className="p-6 overflow-x-auto md:p-10">
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                                {p.metrics.slice(0, 10).map((m) => (
                                    <CountMetric key={m.label} value={m.value} label={m.label} />
                                ))}
                            </div>
                        </div>
                    </TermWindow>
                </div>
            </section>

            {/* ──────────────────── FEATURES: salida de comando ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="04 / Funcionalidades"
                        title={
                            <>
                                Todo lo que <span className="brand-gradient-text">ya está dentro</span>
                            </>
                        }
                    />

                    <div className="mt-10 rs-mono text-[12px] md:text-[13px]">
                        <Stagger stagger={0.045}>
                            {p.features.map((f, i) => (
                                <StaggerItem key={f} y={12}>
                                    <div className="flex items-start gap-3 py-2 border-b border-white/[0.06] group">
                                        <span className="text-[#F03030]/60 shrink-0 pt-0.5">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-[#F03030] shrink-0 pt-0.5">▸</span>
                                        <span className="leading-relaxed transition-opacity opacity-70 group-hover:opacity-100">
                                            {f}
                                        </span>
                                    </div>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </div>
            </section>

            {/* ──────────────────── STACK ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <SectionHead index="05 / Stack" title="Con qué está hecho" />
                    <div className="grid gap-5 mt-10 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06}>
                                <div className="h-full p-5 border rounded-lg border-white/10 bg-[#101019]/50">
                                    <p className="rs-mono text-[10px] uppercase tracking-[0.24em] text-[#F03030]/80">
                                        {group.group}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] opacity-75"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────────────────── ARQUITECTURA + RETOS ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="06 / Bajo el capó"
                        title={
                            <>
                                Arquitectura y <span className="brand-gradient-text">lo que costó</span>
                            </>
                        }
                    />

                    <Reveal className="mt-10">
                        <div className="p-6 border-l-2 md:p-8 border-[#F03030] bg-white/[0.02]">
                            <p className="text-sm leading-relaxed opacity-75 md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>

                    <div className="mt-12 space-y-5">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.08}>
                                <div className="overflow-hidden border rounded-lg border-white/10">
                                    <div className="p-5 md:p-6 bg-[#3018F0]/[0.07] border-b border-white/10">
                                        <p className="rs-mono text-[10px] uppercase tracking-[0.24em] text-[#7C8BFF]">
                                            error {String(i + 1).padStart(2, "0")}
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed opacity-80 md:text-base">{c.problem}</p>
                                    </div>
                                    <div className="p-5 md:p-6 bg-[#F03030]/[0.05]">
                                        <p className="rs-mono text-[10px] uppercase tracking-[0.24em] text-[#F03030]">
                                            fix
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed opacity-80 md:text-base">{c.solution}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────────────────── RESUMEN ──────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-3xl mx-auto">
                    {emblem && (
                        <Image
                            src={emblem.src}
                            alt={p.name}
                            width={72}
                            height={72}
                            className="mb-8 anim-float"
                        />
                    )}
                    <Stagger className="space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p className={`leading-relaxed ${i === 0 ? "text-lg md:text-xl opacity-90" : "text-sm md:text-base opacity-65"}`}>
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <div className="py-6 border-y border-white/10 rs-mono text-[11px] uppercase tracking-[0.2em] opacity-45">
                <Marquee
                    items={["Free Fire", "Blood Strike", "Mobile Legends", "Honor of Kings", "Marvel Rivals", "Pago Móvil BDV", "Entrega automática"]}
                    speed={34}
                    separator="·"
                />
            </div>

            <div className="pb-24">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una tienda que cobra, verifica contra el banco y despacha sola. Si necesitas algo parecido —pagos verificados, despacho idempotente, panel completo— es exactamente el terreno que conozco."
                />
                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="rs-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-40 hover:opacity-80 transition-opacity"
                    >
                        exit <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
