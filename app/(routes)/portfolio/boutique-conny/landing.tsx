"use client"

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowRight, Github, Globe, Play } from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { Reveal, Stagger, StaggerItem, RevealWords } from "@/components/projects/reveal";
import { AutoVideo, BrowserFrame, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";

const p = getProject("boutique-conny")!;
const nxt = nextProject("boutique-conny");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* ---------------------------------------------------------------------------
   Paleta literal de src/theme.css del proyecto. La landing es el negativo de la
   app: la tienda opera de día, el escaparate se enseña de noche.
   --------------------------------------------------------------------------- */
const NAVY_D = "#0f0f2a";
const NAVY = "#14142b";
const NAVY_L = "#1d1d3e";
const ROSE = "#d4567a";
const ROSE_D = "#b8385f";
const PINK = "#ec7f9b";
const GOLD = "#c9a35a";
const CREAM = "#f4ead2";
const INK = "#1c1830";
const PAPER = "#fbf2f4";
const MAUVE = "#6b5b66";

const GREEN = "#2e9e6b";
const AMBER = "#e0a12c";
const RED = "#d94b4b";
const BLUE = "#3a6ea5";
const VIOLET = "#7b5cd6";

/* Los siete destellos dorados del panel de marca, en posiciones fijas
   (nada de Math.random: rompería la hidratación). */
const SPARKS = [
    { x: 12, y: 22, s: 9, d: 0 },
    { x: 28, y: 68, s: 6, d: 0.6 },
    { x: 46, y: 14, s: 7, d: 1.2 },
    { x: 63, y: 74, s: 8, d: 0.3 },
    { x: 78, y: 30, s: 6, d: 1.6 },
    { x: 88, y: 60, s: 9, d: 0.9 },
    { x: 36, y: 40, s: 5, d: 2.1 },
];

const HEARTS = [
    { x: 18, d: 0, dur: 6.5 },
    { x: 40, d: 1.8, dur: 7.4 },
    { x: 66, d: 3.2, dur: 6.9 },
    { x: 84, d: 4.6, dur: 7.8 },
];

const GRUPOS = ["Damas", "Caballeros", "Niños", "Niñas", "Unisex", "Accesorios"];

/* Fiados de ejemplo para el semáforo: el orden de registro y el orden por
   urgencia son distintos — eso es exactamente lo que hace semaforoSort. */
type Tono = "late" | "soon" | "ok" | "paid";

const FIADOS: {
    id: string;
    cliente: string;
    emoji: string;
    producto: string;
    tono: Tono;
    badge: string;
    saldo: string;
    total: string;
    fecha: string;
    abonos: [string, string][];
}[] = [
    {
        id: "F-0017",
        cliente: "Yulimar",
        emoji: "👖",
        producto: "Pantalones Jeans Dama · Damas",
        tono: "ok",
        badge: "🟢 Al día",
        saldo: "$18.00",
        total: "de $36.00",
        fecha: "📅 30 jun 2026",
        abonos: [["Abono inicial", "$18.00"]],
    },
    {
        id: "F-0011",
        cliente: "Tía Rosa",
        emoji: "👗",
        producto: "Vestidos Casuales Largos · Damas",
        tono: "late",
        badge: "🔴 ALERTA ROJA · VENCIDO",
        saldo: "$45.00",
        total: "de $75.00",
        fecha: "📅 22 jun 2026",
        abonos: [["Abono inicial", "$30.00"]],
    },
    {
        id: "F-0009",
        cliente: "Marielys",
        emoji: "🧢",
        producto: "Gorras Estampadas · Unisex",
        tono: "soon",
        badge: "🟡 Por vencer",
        saldo: "$12.00",
        total: "de $20.00",
        fecha: "📅 18 jun 2026",
        abonos: [
            ["Abono inicial", "$8.00"],
            ["Abono · 12 jun", "$0.00"],
        ],
    },
    {
        id: "F-0004",
        cliente: "Sra. Belkis",
        emoji: "👕",
        producto: "Blusas Manga Larga · Damas",
        tono: "paid",
        badge: "✓ Liquidado",
        saldo: "$0.00",
        total: "de $46.00",
        fecha: "📅 05 jun 2026",
        abonos: [
            ["Abono inicial", "$20.00"],
            ["Abono · 03 jun", "$26.00"],
        ],
    },
];

const TONO_COLOR: Record<Tono, string> = { late: RED, soon: AMBER, ok: GREEN, paid: "#9a94a6" };
const TONO_RANK: Record<Tono, number> = { late: 0, soon: 1, ok: 2, paid: 3 };

/* El texto literal que la app arma en cashclose.js y manda por WhatsApp. */
const INFORME = [
    "🛍️ CIERRE DE CAJA DIARIO - BOUTIQUE CONNY 🛍️",
    "",
    "📅 lunes, 15 de junio de 2026",
    "",
    "💰 TOTAL FACTURADO: $145.00",
    "",
    "💵 Efectivo: $80.00",
    "📱 Pago Móvil: $45.00",
    "🇺🇸 Zelle: $20.00",
    "",
    "👕 Prendas Vendidas hoy:",
    "• 2× Blusas Manga Larga — $46.00",
    "• 1× Vestidos Playeros Largos — $23.00",
    "• 3× Licras Deportivas — $56.00",
    "• 1× Gorras Estampadas — $20.00",
];

const css = `
.bc-serif {
  font-family: "Fraunces", "Playfair Display", ui-serif, Georgia, "Times New Roman", serif;
  font-optical-sizing: auto;
}
.bc-ui {
  font-family: "Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

/* El lienzo: calle oscura vista desde fuera del escaparate. */
main.bc-shell {
  background: ${NAVY_D};
  color: ${CREAM};
}
/* La barra fija hereda el fondo rosa claro de la marca: su texto vuelve a tinta. */
main.bc-shell > .z-50 { color: ${INK}; }

/* ── La banda de luz: siempre la misma diagonal de -18°, a distintas escalas ── */
.bc-sweep { position: relative; overflow: hidden; isolation: isolate; }
.bc-sweep > .bc-band {
  content: "";
  position: absolute;
  top: -20%;
  bottom: -20%;
  width: 45%;
  pointer-events: none;
  z-index: 6;
  background: linear-gradient(90deg, transparent, rgba(255, 246, 232, 0.5), transparent);
  transform: translateX(-140%) skewX(-18deg);
  opacity: 0;
}
.bc-sweep-auto > .bc-band { animation: bc-sweep 6s ease-out infinite; }
@keyframes bc-sweep {
  0%   { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
  3%   { opacity: 1; }
  15%  { transform: translateX(320%) skewX(-18deg); opacity: 0; }
  100% { transform: translateX(320%) skewX(-18deg); opacity: 0; }
}
.bc-sweep-hover:hover > .bc-band { animation: bc-sweep-once 0.7s ease-out 1; }
@keyframes bc-sweep-once {
  0%   { transform: translateX(-140%) skewX(-18deg); opacity: 1; }
  100% { transform: translateX(320%) skewX(-18deg); opacity: 0; }
}
.bc-sweep-on > .bc-band { animation: bc-sweep-once 0.9s ease-out 1; }

/* Destellos dorados de cuatro puntas: titilan y suben a pleno al pasar la luz. */
.bc-spark { animation: bc-twinkle 2.8s ease-in-out infinite, bc-flash 6s ease-out infinite; }
@keyframes bc-twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.85) rotate(0deg); }
  50%      { opacity: 0.9;  transform: scale(1.05) rotate(45deg); }
}
@keyframes bc-flash {
  0%, 9%, 22%, 100% { filter: none; }
  13%               { filter: drop-shadow(0 0 7px rgba(201, 163, 90, 0.95)); }
}

.bc-heart { animation: bc-heart-rise 7s ease-in infinite; }
@keyframes bc-heart-rise {
  0%   { transform: translateY(0) scale(0.7); opacity: 0; }
  12%  { opacity: 0.85; }
  70%  { opacity: 0.35; }
  100% { transform: translateY(-120px) scale(1.15); opacity: 0; }
}

.bc-beat { animation: bc-beat 1.9s ease-in-out infinite; }
@keyframes bc-beat {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50%      { transform: scale(1.25); opacity: 1; }
}

/* El riel de la vitrina: un hilo dorado que recorre el borde inferior. */
.bc-thread { position: relative; overflow: hidden; }
.bc-thread::after {
  content: "";
  position: absolute;
  inset-block: 0;
  left: -30%;
  width: 30%;
  background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
  animation: bc-thread 8s linear infinite;
}
@keyframes bc-thread {
  0%   { transform: translateX(0); }
  100% { transform: translateX(433%); }
}

/* pulseAlert, tal cual vive en el theme.css de la app. */
.bc-alert { animation: bc-pulse-alert 1.7s ease-out infinite; }
@keyframes bc-pulse-alert {
  0%   { box-shadow: 0 0 0 0 rgba(217, 75, 75, 0.55); }
  70%  { box-shadow: 0 0 0 7px rgba(217, 75, 75, 0); }
  100% { box-shadow: 0 0 0 0 rgba(217, 75, 75, 0); }
}

.bc-caret::after {
  content: "▌";
  color: ${ROSE};
  margin-left: 1px;
  animation: bc-blink 1s steps(1) infinite;
}
@keyframes bc-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

/* Las métricas van en Fraunces, como los KPI reales de la app. */
.bc-metrics .brand-gradient-text {
  font-family: "Fraunces", "Playfair Display", ui-serif, Georgia, serif;
  letter-spacing: -0.02em;
}

.bc-tag { transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease; }
.bc-tag:hover { transform: translateY(-3px) rotate(-0.8deg); box-shadow: 0 16px 34px rgba(120, 40, 70, 0.22); }

.bc-hang { transform-origin: 50% 0%; }

.bc-dot-grid {
  background-image: radial-gradient(rgba(212, 86, 122, 0.16) 1px, transparent 1px);
  background-size: 18px 18px;
}

.bc-scroll-x { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.bc-scroll-x::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .bc-sweep-auto > .bc-band,
  .bc-sweep-hover:hover > .bc-band,
  .bc-sweep-on > .bc-band,
  .bc-spark,
  .bc-heart,
  .bc-beat,
  .bc-thread::after,
  .bc-alert,
  .bc-caret::after { animation: none !important; }
  .bc-heart { opacity: 0.4; }
  .bc-tag:hover { transform: none; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Piezas de la vitrina                                                      */
/* -------------------------------------------------------------------------- */

/** Estrella de cuatro puntas: el destello dorado del panel de marca. */
const Spark = ({ size, className, style }: { size: number; className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden>
        <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill={GOLD} />
    </svg>
);

/** El panel navy del login, recreado: wordmark, corazón, destellos y barrido. */
const BrandPanel = ({ className, compact = false }: { className?: string; compact?: boolean }) => (
    <div
        className={`bc-sweep bc-sweep-auto relative overflow-hidden ${className ?? ""}`}
        style={{
            borderRadius: compact ? 20 : 28,
            border: `2px solid ${PINK}`,
            background: `radial-gradient(120% 120% at 30% 20%, ${NAVY_L} 0%, ${NAVY} 55%, ${NAVY_D} 100%)`,
            boxShadow: compact
                ? "0 18px 34px rgba(20,20,43,0.4)"
                : "0 50px 90px -30px rgba(15,15,42,0.9), 0 0 0 1px rgba(236,127,155,0.16)",
        }}
    >
        <span className="bc-band" aria-hidden />

        {SPARKS.map((s, i) => (
            <Spark
                key={i}
                size={compact ? Math.max(4, s.s - 2) : s.s}
                className="absolute bc-spark"
                style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s, ${s.d}s` }}
            />
        ))}

        {HEARTS.map((h, i) => (
            <span
                key={i}
                aria-hidden
                className="absolute bottom-0 bc-heart"
                style={{
                    left: `${h.x}%`,
                    color: PINK,
                    fontSize: compact ? 8 : 12,
                    animationDelay: `${h.d}s`,
                    animationDuration: `${h.dur}s`,
                }}
            >
                ♥
            </span>
        ))}

        <div className={`relative text-center ${compact ? "px-4 py-5" : "px-6 py-9 md:px-12 md:py-12"}`}>
            <p
                className="bc-serif font-semibold leading-none"
                style={{ fontSize: compact ? 22 : undefined, color: CREAM }}
            >
                <span className={compact ? "" : "text-[32px] md:text-[54px]"} style={{ color: CREAM }}>
                    cute
                </span>
                <span className={compact ? "" : "text-[32px] md:text-[54px]"} style={{ color: PINK }}>
                    <span className="relative inline-block">
                        o
                        <span
                            aria-hidden
                            className="absolute left-1/2 -translate-x-1/2 bc-beat"
                            style={{ top: "-0.52em", fontSize: "0.32em", color: PINK }}
                        >
                            ♥
                        </span>
                    </span>
                    fertas
                </span>
            </p>
            <p
                className="bc-ui font-semibold"
                style={{
                    marginTop: compact ? 6 : 14,
                    color: GOLD,
                    fontSize: compact ? 6.5 : 10.5,
                    letterSpacing: compact ? "2.4px" : "4px",
                }}
            >
                MULTIMARCA · MODA · OFERTAS
            </p>
        </div>
    </div>
);

/** Escribe línea por línea al entrar en pantalla, con cursor de bloque rosa. */
const TypedLines = ({
    lines,
    onDone,
    speed = 16,
    className,
}: {
    lines: string[];
    onDone?: () => void;
    speed?: number;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [chars, setChars] = useState(0);
    const [done, setDone] = useState(false);
    const reduce = useReducedMotion();
    const full = lines.join("\n");

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (reduce) {
            setChars(full.length);
            setDone(true);
            onDone?.();
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let i = 0;
                const id = window.setInterval(() => {
                    i += 2;
                    setChars(i);
                    if (i >= full.length) {
                        window.clearInterval(id);
                        setDone(true);
                        onDone?.();
                    }
                }, speed);
            },
            { threshold: 0.35 }
        );
        observer.observe(node);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [full, speed, reduce]);

    return (
        <div ref={ref} className={className}>
            <pre className="whitespace-pre-wrap break-words font-mono leading-[1.55]" style={{ margin: 0 }}>
                {full.slice(0, chars)}
                {!done && <span className="bc-caret" />}
            </pre>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Mockups: las pantallas reales recreadas en HTML/CSS                        */
/* -------------------------------------------------------------------------- */

const Pill = ({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) => (
    <span
        className="bc-ui inline-flex items-center rounded-full px-1.5 py-[1px] text-[7px] font-semibold leading-[1.5]"
        style={{ color, background: bg }}
    >
        {children}
    </span>
);

const TabBar = ({ tabs, active }: { tabs: [string, string][]; active: number }) => (
    <div
        className="absolute inset-x-0 bottom-0 z-10 flex items-stretch border-t"
        style={{ background: "#ffffff", borderColor: "#f0e1e7", paddingBottom: 6 }}
    >
        {tabs.map(([emoji, label], i) => (
            <div key={label} className="flex flex-col items-center justify-center flex-1 gap-[2px] pt-2">
                <span style={{ fontSize: i === active ? 14 : 12, transform: i === active ? "translateY(-1px)" : "none" }}>
                    {emoji}
                </span>
                <span
                    className="bc-ui text-[6.5px] font-semibold"
                    style={{ color: i === active ? ROSE : "#a89aa2" }}
                >
                    {label}
                </span>
            </div>
        ))}
    </div>
);

const VendedoraTabs: [string, string][] = [
    ["👗", "Inventario"],
    ["➕", "Nueva"],
    ["💵", "Vender"],
    ["📒", "Fiados"],
    ["📲", "Cierre"],
];

const AdminTabs: [string, string][] = [
    ["📊", "Resumen"],
    ["🧾", "SENIAT"],
    ["📒", "Fiados"],
    ["👗", "Inventario"],
    ["📲", "Cierre"],
];

const AppTopBar = ({ who }: { who: string }) => (
    <div
        className="sticky top-0 z-10 flex items-center justify-between px-2.5 py-2 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.86)", borderBottom: "1px solid #f0e1e7" }}
    >
        <span
            className="bc-serif rounded-full px-2 py-[3px] text-[8px] font-semibold"
            style={{ background: NAVY, color: CREAM }}
        >
            cute<span style={{ color: PINK }}>ofertas</span>
        </span>
        <span className="flex items-center gap-1.5">
            <span className="bc-ui text-[7.5px] font-semibold" style={{ color: INK }}>
                {who}
            </span>
            <span
                className="bc-ui rounded-full px-1.5 py-[2px] text-[6.5px] font-semibold"
                style={{ background: "#f7e9ee", color: ROSE_D }}
            >
                Salir
            </span>
        </span>
    </div>
);

/* ── 1. Login con selector de rol ── */
const MockLogin = () => (
    <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 overflow-hidden"
        style={{
            background: `radial-gradient(120% 60% at 50% 0%, #ffffff 0%, #fbe2ea 42%, ${PAPER} 100%)`,
        }}
    >
        <BrandPanel compact className="w-full max-w-[210px]" />

        <p className="bc-ui text-[7.5px]" style={{ color: MAUVE }}>
            Boutique Conny · Sistema de Control
        </p>

        <div
            className="w-full max-w-[220px] p-3"
            style={{ background: "#fff", borderRadius: 16, boxShadow: "0 14px 30px rgba(180,90,120,0.16)" }}
        >
            <div className="grid grid-cols-2 gap-1.5">
                {[
                    { emoji: "👗", name: "Marisabel", role: "Vendedora", on: false },
                    { emoji: "👑", name: "Conny", role: "Administradora", on: true },
                ].map((r) => (
                    <div
                        key={r.name}
                        className="flex flex-col items-center gap-[2px] px-1 py-2 text-center"
                        style={{
                            borderRadius: 11,
                            border: `1.5px solid ${r.on ? ROSE : "#f0e1e7"}`,
                            background: r.on ? "#fff5f8" : "#fff",
                        }}
                    >
                        <span className="text-[15px]">{r.emoji}</span>
                        <span className="bc-ui text-[8px] font-bold" style={{ color: r.on ? ROSE_D : INK }}>
                            {r.name}
                        </span>
                        <span className="bc-ui text-[6.5px]" style={{ color: MAUVE }}>
                            {r.role}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-2.5 space-y-1.5">
                {[
                    ["Correo", "conny@boutiqueconny.com", false],
                    ["Contraseña", "••••••••", true],
                ].map(([label, value, focus]) => (
                    <div key={String(label)}>
                        <p className="bc-ui mb-[3px] text-[6.5px] font-semibold" style={{ color: MAUVE }}>
                            {label}
                        </p>
                        <div
                            className="bc-ui px-2 py-1.5 text-[8px]"
                            style={{
                                borderRadius: 9,
                                border: `1px solid ${focus ? ROSE : "#f0e1e7"}`,
                                color: INK,
                                background: "#fff",
                            }}
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            <p className="bc-ui mt-1.5 h-[8px] text-[6.5px]" style={{ color: RED }} />

            <div
                className="bc-sweep bc-sweep-hover relative mt-1 py-2 text-center"
                style={{ borderRadius: 11, backgroundImage: `linear-gradient(125deg, ${ROSE} 0%, ${ROSE_D} 100%)` }}
            >
                <span className="bc-band" aria-hidden />
                <span className="bc-ui relative text-[9px] font-bold text-white">Entrar</span>
            </div>
        </div>

        <p className="bc-ui text-[6.5px]" style={{ color: MAUVE }}>
            Cada quien usa su propio correo y contraseña.
        </p>
    </div>
);

/* ── 2. Inventario (vendedora) ── */
const PRODUCTOS = [
    { emoji: "👗", name: "Vestidos Playeros Largos", grupo: "Damas", code: "PROD-0007", price: "$23.00", qty: 12, pill: "12 en stock", tone: GREEN, bg: "#e7f5ee" },
    { emoji: "👖", name: "Pantalones Jeans Dama", grupo: "Damas", code: "PROD-0012", price: "$28.00", qty: 3, pill: "Quedan 3", tone: "#a9761a", bg: "#fdf2dd" },
    { emoji: "🧢", name: "Gorras Estampadas", grupo: "Unisex", code: "PROD-0031", price: "$10.00", qty: 0, pill: "Agotado", tone: "#8b8291", bg: "#f0eef2" },
    { emoji: "👕", name: "Blusas Manga Larga", grupo: "Damas", code: "PROD-0004", price: "$23.00", qty: 7, pill: "7 en stock", tone: GREEN, bg: "#e7f5ee" },
];

const MockInventario = () => (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: PAPER }}>
        <AppTopBar who="👗 Marisabel" />

        <div className="flex-1 px-2.5 pb-[52px] pt-2 space-y-2 overflow-hidden">
            <div className="flex items-baseline justify-between">
                <p className="bc-serif text-[15px] font-bold" style={{ color: ROSE_D }}>
                    Inventario
                </p>
                <p className="bc-ui text-[7px]" style={{ color: MAUVE }}>
                    18 productos
                </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
                {[
                    { k: "Productos", v: "18", solid: false },
                    { k: "Unidades", v: "96", solid: false },
                    { k: "Valor en tienda", v: "$1,842", solid: true },
                ].map((kpi) => (
                    <div
                        key={kpi.k}
                        className="px-1.5 py-1.5"
                        style={{
                            borderRadius: 11,
                            background: kpi.solid ? `linear-gradient(125deg, ${ROSE} 0%, ${ROSE_D} 100%)` : "#fff",
                            boxShadow: "0 6px 16px rgba(180,90,120,0.10)",
                        }}
                    >
                        <p className="bc-ui text-[6px] font-semibold" style={{ color: kpi.solid ? "rgba(255,255,255,0.85)" : MAUVE }}>
                            {kpi.k}
                        </p>
                        <p className="bc-serif text-[13px] font-bold leading-tight" style={{ color: kpi.solid ? "#fff" : INK }}>
                            {kpi.v}
                        </p>
                    </div>
                ))}
            </div>

            <div
                className="bc-sweep bc-sweep-hover relative py-1.5 text-center"
                style={{ borderRadius: 11, backgroundImage: `linear-gradient(125deg, ${ROSE} 0%, ${ROSE_D} 100%)` }}
            >
                <span className="bc-band" aria-hidden />
                <span className="bc-ui relative text-[8.5px] font-bold text-white">➕ Agregar producto</span>
            </div>

            <div className="p-1.5 space-y-1.5" style={{ background: "#fff", borderRadius: 12 }}>
                <div className="bc-ui px-2 py-1.5 text-[7.5px]" style={{ border: "1px solid #f0e1e7", borderRadius: 9, color: "#a89aa2" }}>
                    🔎 Buscar producto o grupo...
                </div>
                <div
                    className="bc-ui flex items-center justify-between px-2 py-1.5 text-[7.5px]"
                    style={{ border: "1px solid #f0e1e7", borderRadius: 9, color: INK }}
                >
                    Todos los grupos <span style={{ color: ROSE }}>▾</span>
                </div>
            </div>

            <div className="space-y-1.5">
                {PRODUCTOS.map((prod) => (
                    <div key={prod.code} className="p-1.5" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 16px rgba(180,90,120,0.08)" }}>
                        <div className="flex items-center gap-1.5">
                            <span
                                className="grid place-items-center text-[13px] shrink-0"
                                style={{ width: 26, height: 26, borderRadius: 8, background: "#fbe8ee" }}
                            >
                                {prod.emoji}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <p className="bc-ui truncate text-[8px] font-bold" style={{ color: INK }}>
                                        {prod.name}
                                    </p>
                                    <Pill color={prod.tone} bg={prod.bg}>
                                        {prod.pill}
                                    </Pill>
                                </div>
                                <p className="bc-ui text-[6.5px]" style={{ color: MAUVE }}>
                                    {prod.grupo} · {prod.code}
                                </p>
                            </div>
                            <p className="bc-serif text-[11px] font-bold shrink-0" style={{ color: ROSE_D }}>
                                {prod.price}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-1.5">
                            <div
                                className="flex items-center gap-2 px-1 py-[2px]"
                                style={{ borderRadius: 999, background: "#fbe8ee" }}
                            >
                                <span className="bc-ui grid h-[14px] w-[14px] place-items-center rounded-full text-[9px] font-bold" style={{ background: "#fff", color: ROSE_D }}>
                                    −
                                </span>
                                <span className="bc-ui text-[8px] font-bold" style={{ color: INK }}>
                                    {prod.qty}
                                </span>
                                <span className="bc-ui grid h-[14px] w-[14px] place-items-center rounded-full text-[9px] font-bold" style={{ background: "#fff", color: ROSE_D }}>
                                    +
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="bc-ui text-[7px] font-semibold" style={{ color: ROSE }}>
                                    Editar
                                </span>
                                <span className="bc-ui text-[7px] font-semibold" style={{ color: RED }}>
                                    Borrar
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <TabBar tabs={VendedoraTabs} active={0} />
    </div>
);

/* ── 3. Venta rápida, con el SearchSelect abierto ── */
const MockVenta = () => (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: PAPER }}>
        <AppTopBar who="👗 Marisabel" />

        <div className="flex-1 px-2.5 pb-[52px] pt-2 space-y-2 overflow-hidden">
            <div className="flex items-baseline justify-between">
                <p className="bc-serif text-[15px] font-bold" style={{ color: ROSE_D }}>
                    Venta rápida
                </p>
                <p className="bc-ui text-[7px]" style={{ color: MAUVE }}>
                    18 con stock
                </p>
            </div>

            <div className="relative p-2 space-y-1.5" style={{ background: "#fff", borderRadius: 12 }}>
                <p className="bc-ui text-[6.5px] font-semibold" style={{ color: MAUVE }}>
                    Producto vendido *
                </p>
                <div
                    className="bc-ui px-2 py-1.5 text-[7.5px]"
                    style={{ border: `1px solid ${ROSE}`, borderRadius: 9, color: INK }}
                >
                    Vestidos Playeros Largos
                </div>

                {/* panel flotante del combobox */}
                <div
                    className="absolute left-2 right-2 z-20 p-1.5"
                    style={{
                        top: 52,
                        borderRadius: 14,
                        border: `1px solid ${PINK}`,
                        background: "#fff",
                        boxShadow: "0 18px 34px rgba(120,40,70,0.22)",
                    }}
                >
                    <div className="bc-ui px-1.5 py-1 text-[7px]" style={{ background: "#fdf3f6", borderRadius: 7, color: "#a89aa2" }}>
                        🔍 Buscar producto o grupo…
                    </div>
                    <div className="mt-1 space-y-[2px]">
                        {[
                            { t: "Vestidos Playeros Largos · Damas — $23.00 (12 disp.)", on: true },
                            { t: "Blusas Manga Larga · Damas — $23.00 (7 disp.)", on: false },
                            { t: "Pantalones Jeans Dama · Damas — $28.00 (3 disp.)", on: false },
                            { t: "Licras Deportivas · Damas — $18.00 (9 disp.)", on: false },
                        ].map((o) => (
                            <p
                                key={o.t}
                                className="bc-ui truncate px-1.5 py-[3px] text-[7px]"
                                style={{
                                    borderRadius: 6,
                                    background: o.on ? "#fdeef3" : "transparent",
                                    color: o.on ? ROSE_D : INK,
                                    fontWeight: o.on ? 700 : 400,
                                }}
                            >
                                {o.t}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5" style={{ paddingTop: 92 }}>
                    {[
                        ["Cantidad *", "2"],
                        ["Monto cobrado ($) *", "46.00"],
                    ].map(([k, v]) => (
                        <div key={k}>
                            <p className="bc-ui mb-[3px] text-[6.5px] font-semibold" style={{ color: MAUVE }}>
                                {k}
                            </p>
                            <div className="bc-ui px-2 py-1.5 text-[8px]" style={{ border: "1px solid #f0e1e7", borderRadius: 9, color: INK }}>
                                {v}
                            </div>
                        </div>
                    ))}
                </div>

                <p
                    className="bc-ui px-2 py-1 text-[6.5px]"
                    style={{ background: "#fdf3e2", color: "#8a6516", borderRadius: 8 }}
                >
                    Existencia disponible: 12
                </p>

                <div className="flex gap-[3px] p-[3px]" style={{ background: "#f3e8ed", borderRadius: 9 }}>
                    {["Efectivo", "Pago Móvil", "Zelle"].map((m, i) => (
                        <span
                            key={m}
                            className="bc-ui flex-1 py-1 text-center text-[7px] font-semibold"
                            style={{
                                borderRadius: 7,
                                background: i === 0 ? "#fff" : "transparent",
                                color: i === 0 ? ROSE_D : MAUVE,
                                boxShadow: i === 0 ? "0 2px 6px rgba(120,40,70,0.14)" : "none",
                            }}
                        >
                            {m}
                        </span>
                    ))}
                </div>

                <div
                    className="bc-sweep bc-sweep-hover relative py-1.5 text-center"
                    style={{ borderRadius: 11, backgroundImage: `linear-gradient(125deg, ${ROSE} 0%, ${ROSE_D} 100%)` }}
                >
                    <span className="bc-band" aria-hidden />
                    <span className="bc-ui relative text-[8.5px] font-bold text-white">💵 Registrar venta</span>
                </div>

                <p className="bc-ui px-2 py-1 text-[6.5px]" style={{ background: "#e9f0f8", color: "#2f5b86", borderRadius: 8 }}>
                    Al registrar, se descuenta la cantidad vendida del stock automáticamente.
                </p>
            </div>

            <p className="bc-serif text-[11px] font-bold" style={{ color: ROSE_D }}>
                Ventas registradas
            </p>
            {[
                { e: "👕", t: "2× Blusas Manga Larga", s: "Damas · 2026-06-15 14:32", v: "$46.00", m: "Efectivo", c: GREEN, b: "#e7f5ee" },
                { e: "👗", t: "1× Vestidos Playeros", s: "Damas · 2026-06-15 12:07", v: "$23.00", m: "Pago Móvil", c: BLUE, b: "#e9f0f8" },
            ].map((row) => (
                <div key={row.s} className="flex items-center gap-1.5 p-1.5" style={{ background: "#fff", borderRadius: 11 }}>
                    <span className="grid place-items-center text-[12px]" style={{ width: 24, height: 24, borderRadius: 7, background: "#fbe8ee" }}>
                        {row.e}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="bc-ui truncate text-[7.5px] font-bold" style={{ color: INK }}>
                            {row.t}
                        </p>
                        <p className="bc-ui text-[6.5px]" style={{ color: MAUVE }}>
                            {row.s}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="bc-serif text-[10px] font-bold" style={{ color: ROSE_D }}>
                            {row.v}
                        </p>
                        <Pill color={row.c} bg={row.b}>
                            {row.m}
                        </Pill>
                    </div>
                </div>
            ))}
        </div>

        <TabBar tabs={VendedoraTabs} active={2} />
    </div>
);

/* ── 4. Resumen / Dashboard de la administradora (navegador) ── */
const DONA = [
    { label: "Efectivo", value: 52, color: GREEN, money: "$1,289.60" },
    { label: "Pago Móvil", value: 33, color: BLUE, money: "$818.40" },
    { label: "Zelle", value: 15, color: VIOLET, money: "$372.00" },
];

const BARRAS = [22, 0, 38, 51, 12, 0, 64, 41, 33, 58, 19, 0, 72, 45, 28, 61, 36, 14, 49, 0, 55, 30, 68, 24, 42, 0, 37, 59, 21, 47];

const MockDashboard = () => {
    const R = 34;
    const C = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="p-3 md:p-5" style={{ background: PAPER, color: INK }}>
            <div className="flex items-baseline justify-between">
                <p className="bc-serif text-base font-bold md:text-xl" style={{ color: ROSE_D }}>
                    Resumen
                </p>
                <p className="bc-ui text-[10px] md:text-xs" style={{ color: MAUVE }}>
                    Junio 2026
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 md:grid-cols-4 md:gap-3">
                {[
                    { k: "Ingresos del mes", v: "$2,480.00", solid: true },
                    { k: "Vendido hoy", v: "$145.00", solid: false },
                    { k: "Unidades en stock", v: "96", solid: false },
                    { k: "Valor inventario", v: "$1,842.00", solid: false },
                ].map((kpi) => (
                    <div
                        key={kpi.k}
                        className="px-3 py-2.5"
                        style={{
                            borderRadius: 14,
                            background: kpi.solid ? `linear-gradient(125deg, ${ROSE} 0%, ${ROSE_D} 100%)` : "#fff",
                            boxShadow: "0 8px 22px rgba(180,90,120,0.10)",
                        }}
                    >
                        <p className="bc-ui text-[9px] font-semibold md:text-[10px]" style={{ color: kpi.solid ? "rgba(255,255,255,0.86)" : MAUVE }}>
                            {kpi.k}
                        </p>
                        <p className="bc-serif text-lg font-bold leading-tight md:text-2xl" style={{ color: kpi.solid ? "#fff" : INK }}>
                            {kpi.v}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-2 mt-3 md:grid-cols-2 md:gap-3">
                <div className="p-3" style={{ background: "#fff", borderRadius: 14, boxShadow: "0 8px 22px rgba(180,90,120,0.08)" }}>
                    <p className="bc-serif text-[13px] font-bold" style={{ color: INK }}>
                        Ingresos por método
                    </p>
                    <p className="bc-ui text-[10px]" style={{ color: MAUVE }}>
                        37 ventas este mes
                    </p>
                    <div className="flex items-center justify-center py-2">
                        <svg viewBox="0 0 100 100" className="h-[112px] w-[112px]" aria-hidden>
                            <g transform="rotate(-90 50 50)">
                                {DONA.map((seg) => {
                                    const len = (seg.value / 100) * C - 2;
                                    const dash = `${len} ${C - len}`;
                                    const dashOffset = -offset;
                                    offset += (seg.value / 100) * C;
                                    return (
                                        <circle
                                            key={seg.label}
                                            cx="50"
                                            cy="50"
                                            r={R}
                                            fill="none"
                                            stroke={seg.color}
                                            strokeWidth="14"
                                            strokeDasharray={dash}
                                            strokeDashoffset={dashOffset}
                                        />
                                    );
                                })}
                            </g>
                        </svg>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {DONA.map((seg) => (
                            <span key={seg.label} className="bc-ui inline-flex items-center gap-1 text-[10px]" style={{ color: MAUVE }}>
                                <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                                {seg.label}
                                <b style={{ color: INK }}>{seg.money}</b>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-3" style={{ background: "#fff", borderRadius: 14, boxShadow: "0 8px 22px rgba(180,90,120,0.08)" }}>
                    <p className="bc-serif text-[13px] font-bold" style={{ color: INK }}>
                        Ventas por día
                    </p>
                    <p className="bc-ui text-[10px]" style={{ color: MAUVE }}>
                        Junio 2026 · tooltip «Día 15 · $145.00»
                    </p>
                    <div className="bc-dot-grid mt-2 rounded-lg" style={{ padding: "6px 4px 0" }}>
                        <svg viewBox="0 0 300 90" className="w-full h-[104px]" preserveAspectRatio="none" aria-hidden>
                            {BARRAS.map((v, i) => {
                                const h = (v / 80) * 80;
                                return (
                                    <rect
                                        key={i}
                                        x={i * 10 + 1.5}
                                        y={88 - h}
                                        width="7"
                                        height={Math.max(h, 1.5)}
                                        rx="2.4"
                                        fill={i === 14 ? ROSE_D : ROSE}
                                        opacity={v === 0 ? 0.18 : 1}
                                    />
                                );
                            })}
                        </svg>
                    </div>
                    <div className="bc-ui flex justify-between mt-1 text-[8px]" style={{ color: MAUVE }}>
                        {["1", "6", "11", "16", "21", "26", "30"].map((d) => (
                            <span key={d}>{d}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-3 mt-3" style={{ background: "#fff", borderRadius: 14, boxShadow: "0 8px 22px rgba(180,90,120,0.08)" }}>
                <p className="bc-serif text-[13px] font-bold" style={{ color: INK }}>
                    Cuentas por cobrar
                </p>
                <p className="bc-ui text-[10px]" style={{ color: MAUVE }}>
                    Dinero en la calle
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="px-3 py-2" style={{ borderRadius: 12, border: `1.5px solid ${RED}`, background: "#fdf0f0" }}>
                        <p className="bc-ui text-[9px] font-semibold" style={{ color: MAUVE }}>
                            Deuda total pendiente
                        </p>
                        <p className="bc-serif text-lg font-bold" style={{ color: ROSE_D }}>
                            $312.00
                        </p>
                    </div>
                    <div className="px-3 py-2" style={{ borderRadius: 12, background: PAPER }}>
                        <p className="bc-ui text-[9px] font-semibold" style={{ color: MAUVE }}>
                            🔴 Vencidos (alerta)
                        </p>
                        <p className="bc-serif text-lg font-bold" style={{ color: RED }}>
                            2
                        </p>
                    </div>
                </div>
                <div
                    className="bc-ui mt-2 py-1.5 text-center text-[10px] font-semibold"
                    style={{ borderRadius: 10, border: `1.5px solid ${ROSE}`, color: ROSE_D, background: "#fff" }}
                >
                    Ver fiados vencidos →
                </div>
            </div>

            <div className="flex items-stretch mt-3" style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0e1e7" }}>
                {AdminTabs.map(([emoji, label], i) => (
                    <div key={label} className="flex flex-col items-center justify-center flex-1 gap-[2px] py-2">
                        <span style={{ fontSize: i === 0 ? 15 : 13 }}>{emoji}</span>
                        <span className="bc-ui text-[8px] font-semibold" style={{ color: i === 0 ? ROSE : "#a89aa2" }}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── 5. La primera página del PDF del cierre ── */
const MockPdf = ({ lit }: { lit: boolean }) => (
    <div
        className={`bc-sweep relative w-full overflow-hidden ${lit ? "bc-sweep-on" : ""}`}
        style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 26px 60px -18px rgba(0,0,0,0.6)",
            aspectRatio: "210 / 297",
        }}
    >
        <span className="bc-band" aria-hidden />

        <div className="px-4 py-3" style={{ background: ROSE_D }}>
            <p className="bc-serif text-[13px] font-bold leading-tight" style={{ color: CREAM }}>
                BOUTIQUE CONNY
            </p>
            <div className="flex items-baseline justify-between">
                <p className="bc-ui text-[7.5px]" style={{ color: "rgba(255,255,255,0.82)" }}>
                    Cierre de caja diario
                </p>
                <p className="bc-ui text-[7.5px]" style={{ color: "rgba(255,255,255,0.82)" }}>
                    15/06/2026
                </p>
            </div>
        </div>

        <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
                {[
                    { k: "Total facturado", v: "$145.00", solid: true },
                    { k: "Efectivo", v: "$80.00", solid: false },
                    { k: "Pago Móvil", v: "$45.00", solid: false },
                    { k: "Zelle", v: "$20.00", solid: false },
                ].map((t) => (
                    <div
                        key={t.k}
                        className="px-2 py-1.5"
                        style={{
                            borderRadius: 7,
                            background: t.solid ? `linear-gradient(125deg, ${ROSE} 0%, ${ROSE_D} 100%)` : PAPER,
                            border: t.solid ? "none" : "1px solid #f0e1e7",
                        }}
                    >
                        <p className="bc-ui text-[6px] font-semibold" style={{ color: t.solid ? "rgba(255,255,255,0.85)" : MAUVE }}>
                            {t.k}
                        </p>
                        <p className="bc-serif text-[12px] font-bold" style={{ color: t.solid ? "#fff" : INK }}>
                            {t.v}
                        </p>
                    </div>
                ))}
            </div>

            <p className="bc-serif text-[9px] font-bold" style={{ color: ROSE_D }}>
                Prendas vendidas
            </p>
            <div style={{ border: "1px solid #f0e1e7", borderRadius: 6, overflow: "hidden" }}>
                <div className="bc-ui grid grid-cols-[1fr_28px_46px] px-1.5 py-1 text-[6px] font-bold" style={{ background: "#fbe8ee", color: ROSE_D }}>
                    <span>Producto</span>
                    <span className="text-center">Cant.</span>
                    <span className="text-right">Monto</span>
                </div>
                {[
                    ["Blusas Manga Larga", "2", "$46.00"],
                    ["Vestidos Playeros Largos", "1", "$23.00"],
                    ["Licras Deportivas", "3", "$56.00"],
                    ["Gorras Estampadas", "1", "$20.00"],
                ].map((row, i) => (
                    <div
                        key={row[0]}
                        className="bc-ui grid grid-cols-[1fr_28px_46px] px-1.5 py-[3px] text-[6.5px]"
                        style={{ background: i % 2 ? "#fdf8fa" : "#fff", color: INK }}
                    >
                        <span className="truncate">{row[0]}</span>
                        <span className="text-center">{row[1]}</span>
                        <span className="text-right">{row[2]}</span>
                    </div>
                ))}
                <div className="bc-ui grid grid-cols-[1fr_28px_46px] px-1.5 py-1 text-[6.5px] font-bold" style={{ background: PAPER, color: ROSE_D }}>
                    <span>TOTAL</span>
                    <span className="text-center">7</span>
                    <span className="text-right">$145.00</span>
                </div>
            </div>
        </div>

        <p className="bc-ui absolute inset-x-0 bottom-2 text-center text-[5.5px]" style={{ color: "#b9adb5" }}>
            Generado con jsPDF · autoTable · página 1 de 1
        </p>
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Landing                                                                    */
/* -------------------------------------------------------------------------- */

const Landing = () => {
    const reduce = useReducedMotion();
    const [ordenado, setOrdenado] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const semaforoRef = useRef<HTMLDivElement>(null);

    /* Al entrar la sección de fiados, la lista se reordena sola: es semaforoSort. */
    useEffect(() => {
        const node = semaforoRef.current;
        if (!node) return;
        if (reduce) {
            setOrdenado(true);
            return;
        }
        let timer = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                timer = window.setTimeout(() => setOrdenado(true), 1100);
            },
            { threshold: 0.4 }
        );
        observer.observe(node);
        return () => {
            observer.disconnect();
            window.clearTimeout(timer);
        };
    }, [reduce]);

    const fiados = ordenado ? [...FIADOS].sort((a, b) => TONO_RANK[a.tono] - TONO_RANK[b.tono]) : FIADOS;

    const screenName = (i: number) => p.uiScreens[i]?.name ?? "";

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="bc-shell bc-ui">
            <style>{css}</style>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Poppins:wght@300;400;500;600;700&display=swap"
            />

            {/* ═════════════════════════ HERO · LA VITRINA ═════════════════════════ */}
            <section className="bc-thread relative px-4 pt-28 pb-20 md:px-6 md:pt-32 md:pb-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(110% 80% at 30% 20%, ${NAVY_L} 0%, ${NAVY} 48%, ${NAVY_D} 100%)`,
                    }}
                />
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(60% 45% at 50% 34%, rgba(236,127,155,0.10), transparent 72%)` }}
                />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgba(201,163,90,0.25)" }} />

                <div className="relative max-w-5xl mx-auto">
                    <Reveal direction="scale" duration={1}>
                        <BrandPanel className="mx-auto max-w-[520px]" />
                    </Reveal>

                    <p className="bc-ui mt-6 text-center text-[11px] uppercase tracking-[0.34em]" style={{ color: "rgba(244,234,210,0.5)" }}>
                        Boutique Conny · Sistema de Control
                    </p>

                    <h1 className="bc-serif mx-auto mt-7 max-w-3xl text-center text-[34px] font-bold leading-[1.08] md:text-6xl" style={{ color: CREAM }}>
                        <RevealWords text="La tienda que se llevaba en un cuaderno, ahora con luz encendida" />
                    </h1>

                    <p className="max-w-2xl mx-auto mt-6 text-sm leading-relaxed text-center md:text-lg" style={{ color: PINK }}>
                        {p.tagline}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                    </div>

                    <p className="max-w-2xl mx-auto mt-6 text-xs leading-relaxed text-center md:text-sm" style={{ color: "rgba(244,234,210,0.6)" }}>
                        {p.role}
                    </p>

                    <div
                        className="max-w-xl mx-auto mt-6 px-4 py-3 text-center"
                        style={{
                            borderRadius: 14,
                            border: `1px solid rgba(201,163,90,0.32)`,
                            background: "rgba(201,163,90,0.06)",
                        }}
                    >
                        <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
                            Estado
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed md:text-sm" style={{ color: "rgba(244,234,210,0.82)" }}>
                            {p.status}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-9">
                        {p.links.web && (
                            <BrandButton href={p.links.web}>
                                <Globe size={16} /> Abrir la app
                            </BrandButton>
                        )}
                        {p.links.play && (
                            <BrandButton href={p.links.play}>
                                <Play size={16} /> Google Play
                            </BrandButton>
                        )}
                        {p.links.demo && !p.links.web && (
                            <BrandButton href={p.links.demo}>
                                <ArrowRight size={16} /> Ver demo
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <BrandButton href={p.links.github} variant="outline">
                                <Github size={16} /> Ver el código
                            </BrandButton>
                        )}
                        <BrandButton href="#bc-pantallas" variant={p.links.web || p.links.play ? "outline" : "solid"}>
                            <ArrowDown size={16} /> Ver las pantallas
                        </BrandButton>
                    </div>

                    {!p.links.web && !p.links.play && !p.links.github && !p.links.demo && (
                        <p className="mt-5 text-center text-[11px]" style={{ color: "rgba(244,234,210,0.42)" }}>
                            Herramienta interna de una tienda real: no hay enlace público ni repositorio abierto.
                        </p>
                    )}
                </div>
            </section>

            {/* ═══════════════════ 01 · EL CUADERNO Y LA VITRINA ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="01 / El punto de partida"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Del cuaderno <span className="brand-gradient-text">a la vitrina</span>
                            </span>
                        }
                        lead="Nadie sabía cuántas unidades quedaban, ni quién debía qué. Todo estaba escrito a mano o recordado de memoria."
                    />

                    <div className="grid gap-6 mt-12 lg:grid-cols-2">
                        {/* el cuaderno */}
                        <Reveal direction="right">
                            <div
                                className="relative h-full p-6 overflow-hidden md:p-8"
                                style={{
                                    borderRadius: 18,
                                    background: `repeating-linear-gradient(${CREAM}, ${CREAM} 27px, rgba(120,40,70,0.10) 27px, rgba(120,40,70,0.10) 28px)`,
                                    boxShadow: "0 18px 44px rgba(0,0,0,0.4)",
                                    color: INK,
                                }}
                            >
                                <span aria-hidden className="absolute inset-y-0 left-8 w-px" style={{ background: "rgba(217,75,75,0.3)" }} />
                                <p className="bc-ui text-[10px] uppercase tracking-[0.3em]" style={{ color: ROSE_D }}>
                                    Antes · el cuaderno
                                </p>
                                <h3 className="bc-serif mt-3 text-xl font-bold md:text-2xl" style={{ color: INK }}>
                                    Lo que nadie podía contestar
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "#4a4152" }}>
                                    {p.problem}
                                </p>
                            </div>
                        </Reveal>

                        {/* la vitrina */}
                        <Reveal direction="left" delay={0.12}>
                            <div
                                className="bc-sweep bc-sweep-hover relative h-full p-6 overflow-hidden md:p-8"
                                style={{
                                    borderRadius: 18,
                                    background: "#ffffff",
                                    boxShadow: "0 18px 44px rgba(120,40,70,0.3)",
                                    color: INK,
                                }}
                            >
                                <span className="bc-band" aria-hidden />
                                <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ backgroundImage: `linear-gradient(90deg, ${ROSE}, ${ROSE_D})` }} />
                                <p className="bc-ui text-[10px] uppercase tracking-[0.3em]" style={{ color: ROSE }}>
                                    Después · la app
                                </p>
                                <h3 className="bc-serif mt-3 text-xl font-bold md:text-2xl" style={{ color: ROSE_D }}>
                                    Una sola app, dos maneras de verla
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "#4a4152" }}>
                                    {p.solution}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═════════════════════ 02 · EL PERCHERO (highlights) ═════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(70% 50% at 50% 0%, rgba(236,127,155,0.07), transparent 70%)` }}
                />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / El perchero"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Siete piezas <span className="brand-gradient-text">colgadas del mismo riel</span>
                            </span>
                        }
                        lead="Inventario, ventas atómicas, fiados, cierre, contabilidad, offline y roles. Cada una cuelga del mismo dato en tiempo real."
                    />

                    <div className="grid gap-x-6 gap-y-10 mt-16 sm:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <motion.div
                                    key={h.title}
                                    className="relative pt-8"
                                    initial={reduce ? { opacity: 1 } : { opacity: 0, rotate: -1.6, y: -8 }}
                                    whileInView={reduce ? { opacity: 1 } : { opacity: 1, rotate: [-1.6, 1.2, -0.6, 0.25, 0], y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : (i % 3) * 0.08, ease: "easeOut" }}
                                    style={{ transformOrigin: "50% 0%" }}
                                >
                                    {/* el riel dorado y el gancho */}
                                    <span
                                        aria-hidden
                                        className="absolute -left-3 -right-3 top-[15px] h-[2px]"
                                        style={{ background: `linear-gradient(90deg, rgba(201,163,90,0.25), ${GOLD} 20%, ${GOLD} 80%, rgba(201,163,90,0.25))` }}
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute left-1/2 top-[9px] h-3.5 w-3.5 -translate-x-1/2 rounded-full"
                                        style={{ border: `2px solid ${GOLD}`, background: NAVY_D }}
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute left-1/2 top-[22px] h-[10px] w-px -translate-x-1/2"
                                        style={{ background: "rgba(201,163,90,0.55)" }}
                                    />

                                    <div
                                        className="bc-sweep bc-sweep-hover bc-tag relative h-full p-5 overflow-hidden"
                                        style={{
                                            borderRadius: 18,
                                            background: "#ffffff",
                                            boxShadow: "0 12px 34px rgba(120,40,70,0.14)",
                                        }}
                                    >
                                        <span className="bc-band" aria-hidden />
                                        <span
                                            className="grid rounded-xl h-10 w-10 place-items-center"
                                            style={{ background: "#fbe8ee", color: ROSE_D }}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        <h3 className="bc-serif mt-4 text-[17px] font-bold leading-snug" style={{ color: ROSE_D }}>
                                            {h.title}
                                        </h3>
                                        <p className="bc-ui mt-2 text-[13px] leading-relaxed" style={{ color: MAUVE }}>
                                            {h.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════ 03 · LAS PANTALLAS ══════════════════════ */}
            <section id="bc-pantallas" className="relative px-4 py-20 scroll-mt-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / Las pantallas"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Ocho vistas, <span className="brand-gradient-text">todas del mismo dato</span>
                            </span>
                        }
                        lead="La app se abre desde el navegador del teléfono y se instala en la pantalla de inicio. Estas son sus tres primeras pantallas, recreadas aquí en HTML y CSS."
                    />

                    <div className="grid gap-10 mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {[
                            { node: <MockLogin />, name: screenName(0), note: "Quién entra decide qué se ve" },
                            { node: <MockInventario />, name: screenName(1), note: "Stepper de − / + sobre stock real" },
                            { node: <MockVenta />, name: screenName(2), note: "SearchSelect propio sobre 54 productos" },
                        ].map((m, i) => (
                            <Reveal key={m.name} direction="up" delay={i * 0.1}>
                                <PhoneFrame className="mx-auto max-w-[290px]">{m.node}</PhoneFrame>
                                <p className="bc-serif mt-6 text-center text-base font-bold" style={{ color: CREAM }}>
                                    {m.name}
                                </p>
                                <p className="mt-1 text-center text-xs" style={{ color: "rgba(244,234,210,0.5)" }}>
                                    {m.note}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ 04 · EL SEMÁFORO EN VIVO ═══════════════════ */}
            <section ref={semaforoRef} className="relative px-4 py-20 md:px-6 md:py-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(60% 45% at 20% 30%, rgba(217,75,75,0.08), transparent 70%)` }}
                />
                <div className="relative max-w-4xl mx-auto">
                    <SectionHead
                        index="04 / El semáforo"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Los fiados <span className="brand-gradient-text">se ordenan solos</span>
                            </span>
                        }
                        lead="Cada fiado se pinta por su fecha promesa y la lista se reordena por urgencia sin que nadie toque un filtro. Eso es semaforoSort."
                    />

                    <div className="flex flex-wrap items-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setOrdenado((v) => !v)}
                            className="bc-ui rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-300"
                            style={{
                                border: `1px solid ${ordenado ? ROSE : "rgba(244,234,210,0.28)"}`,
                                color: ordenado ? ROSE : "rgba(244,234,210,0.72)",
                                background: ordenado ? "rgba(212,86,122,0.12)" : "transparent",
                            }}
                        >
                            {ordenado ? "Orden por urgencia · activo" : "Orden de registro"}
                        </button>
                        <span className="text-[11px]" style={{ color: "rgba(244,234,210,0.45)" }}>
                            rojo vencido → ámbar por vencer → verde al día → gris liquidado
                        </span>
                    </div>

                    <div className="mt-8 space-y-3">
                        {fiados.map((f) => {
                            const color = TONO_COLOR[f.tono];
                            const isLate = f.tono === "late";
                            return (
                                <motion.div
                                    key={f.id}
                                    layout
                                    transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative overflow-hidden"
                                    style={{
                                        borderRadius: 16,
                                        background: isLate
                                            ? "linear-gradient(90deg, #fdf0f0 0%, #ffffff 16%)"
                                            : "#ffffff",
                                        opacity: f.tono === "paid" ? 0.75 : 1,
                                        boxShadow: "0 12px 34px rgba(120,40,70,0.18)",
                                        color: INK,
                                    }}
                                >
                                    <span aria-hidden className="absolute inset-y-0 left-0 w-[5px]" style={{ background: color }} />
                                    <div className="p-4 pl-6 md:p-5 md:pl-7">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="bc-ui text-[15.5px] font-bold" style={{ color: INK }}>
                                                    {f.cliente}
                                                </p>
                                                <p className="bc-ui mt-0.5 text-[12px]" style={{ color: MAUVE }}>
                                                    {f.emoji} {f.producto}
                                                </p>
                                                <span
                                                    className={`bc-ui mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                                        isLate ? "bc-alert" : ""
                                                    }`}
                                                    style={
                                                        isLate
                                                            ? { background: "#fff", color: RED, border: `1.5px solid ${RED}` }
                                                            : { background: `${color}1f`, color }
                                                    }
                                                >
                                                    {f.badge}
                                                </span>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="bc-serif text-[19px] font-bold" style={{ color: ROSE_D }}>
                                                    {f.saldo}
                                                </p>
                                                <p className="bc-ui text-[11px]" style={{ color: MAUVE }}>
                                                    {f.total}
                                                </p>
                                                <p className="bc-ui text-[11px]" style={{ color: MAUVE }}>
                                                    {f.fecha}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="grid grid-cols-2 gap-1 pt-3 mt-3"
                                            style={{ borderTop: "1px dashed #e8d7de" }}
                                        >
                                            {f.abonos.map(([k, v]) => (
                                                <p key={k} className="bc-ui text-[11px]" style={{ color: MAUVE }}>
                                                    {k} <b style={{ color: INK }}>{v}</b>
                                                </p>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <span
                                                className="bc-ui rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
                                                style={{ backgroundImage: `linear-gradient(125deg, ${ROSE}, ${ROSE_D})` }}
                                            >
                                                💰 Registrar abono
                                            </span>
                                            <span className="bc-ui rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ border: "1px solid #f0e1e7", color: MAUVE }}>
                                                Detalle
                                            </span>
                                            <span className="bc-ui ml-auto text-[10px]" style={{ color: "#b9adb5" }}>
                                                {f.id}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <p className="mt-6 text-xs leading-relaxed" style={{ color: "rgba(244,234,210,0.5)" }}>
                        {screenName(3)} · el bottom-sheet de abono trae los atajos «Mitad» y «Saldar todo», y valida contra el
                        saldo leído del servidor dentro de la transacción.
                    </p>
                </div>
            </section>

            {/* ═════════════════ 05 · EL TABLERO DE LA ADMINISTRADORA ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="05 / El tablero"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Lo que sólo ve <span className="brand-gradient-text">la dueña</span>
                            </span>
                        }
                        lead="El rol vive en users/{uid} y decide qué pestañas existen. La vendedora nunca llega a esta pantalla, y las reglas de Firestore lo respaldan."
                    />

                    <Reveal className="mt-12" direction="scale">
                        <div className="bc-scroll-x">
                            <div className="min-w-[640px]">
                                <BrowserFrame url="boutique-conny-864ed.web.app/#resumen" dark={false}>
                                    <MockDashboard />
                                </BrowserFrame>
                            </div>
                        </div>
                    </Reveal>

                    <p className="bc-serif mt-6 text-center text-base font-bold" style={{ color: CREAM }}>
                        {screenName(4)}
                    </p>
                    <p className="mt-1 text-center text-xs" style={{ color: "rgba(244,234,210,0.5)" }}>
                        Recharts sobre los mismos onSnapshot que alimentan el inventario
                    </p>
                </div>
            </section>

            {/* ═══════════════════ 06 · EL CIERRE QUE SE VA ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(60% 40% at 80% 40%, rgba(201,163,90,0.07), transparent 70%)` }}
                />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / El cierre"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                El informe <span className="brand-gradient-text">sale hacia el teléfono</span>
                            </span>
                        }
                        lead="Un botón cuadra el día por método de pago, arma el PDF con jsPDF y abre WhatsApp con el mensaje ya redactado. Así es como la información circula de verdad en el negocio."
                    />

                    <div className="grid gap-8 mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                        {/* la maqueta del chat */}
                        <motion.div
                            animate={enviado && !reduce ? { x: 12 } : { x: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                        >
                            {enviado && !reduce && (
                                <span
                                    aria-hidden
                                    className="absolute inset-y-6 -left-4 w-4 rounded-full blur-sm"
                                    style={{ background: `linear-gradient(90deg, transparent, ${PINK})`, opacity: 0.7 }}
                                />
                            )}
                            <div
                                className="p-5 md:p-6"
                                style={{ borderRadius: 18, background: "#ffffff", boxShadow: "0 18px 44px rgba(120,40,70,0.24)", color: INK }}
                            >
                                <p className="bc-serif text-lg font-bold" style={{ color: ROSE_D }}>
                                    Informe para la dueña
                                </p>
                                <p className="bc-ui text-xs" style={{ color: MAUVE }}>
                                    Se envía a Conny · +1 (407) 770-7272
                                </p>

                                <div
                                    className="mt-4 p-3.5 text-[11px] md:text-xs"
                                    style={{ borderRadius: 14, background: "#0b141a", color: "#e6edf1", minHeight: 250 }}
                                >
                                    <TypedLines lines={INFORME} onDone={() => setEnviado(true)} />
                                </div>

                                <div
                                    className="bc-sweep bc-sweep-hover relative mt-4 py-2.5 text-center"
                                    style={{ borderRadius: 12, background: "#1f9d55" }}
                                >
                                    <span className="bc-band" aria-hidden />
                                    <span className="bc-ui relative text-sm font-bold text-white">
                                        📲 Enviar informe (PDF + WhatsApp)
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <span
                                        className="bc-ui py-2 text-center text-xs font-semibold"
                                        style={{ borderRadius: 10, border: `1.5px solid ${ROSE}`, color: ROSE_D }}
                                    >
                                        📄 Solo PDF
                                    </span>
                                    <span className="bc-ui py-2 text-center text-xs font-semibold" style={{ borderRadius: 10, border: "1px solid #f0e1e7", color: MAUVE }}>
                                        📋 Copiar texto
                                    </span>
                                </div>

                                <div className="pt-4 mt-4" style={{ borderTop: "1px dashed #e8d7de" }}>
                                    <p className="bc-serif text-sm font-bold" style={{ color: ROSE_D }}>
                                        📄 Reporte por período · SENIAT
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {["Desde · 01/06/2026", "Hasta · 30/06/2026"].map((d) => (
                                            <span key={d} className="bc-ui px-2.5 py-1.5 text-[11px]" style={{ borderRadius: 9, border: "1px solid #f0e1e7", color: INK }}>
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {GRUPOS.map((g, i) => (
                                            <span
                                                key={g}
                                                className="bc-ui rounded-full px-2.5 py-1 text-[10px] font-semibold"
                                                style={
                                                    i < 3
                                                        ? { background: "#fbe8ee", color: ROSE_D, border: `1px solid ${ROSE}` }
                                                        : { background: "#fff", color: MAUVE, border: "1px solid #f0e1e7" }
                                                }
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="bc-ui mt-2 px-2.5 py-1.5 text-[10.5px]" style={{ background: "#e9f0f8", color: "#2f5b86", borderRadius: 9 }}>
                                        37 ventas en el período seleccionado · $2.480,00
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <span className="bc-ui py-2 text-center text-xs font-bold text-white" style={{ borderRadius: 10, backgroundImage: `linear-gradient(125deg, ${ROSE}, ${ROSE_D})` }}>
                                            Generar reporte PDF
                                        </span>
                                        <span className="bc-ui py-2 text-center text-xs font-semibold" style={{ borderRadius: 10, border: "1px solid #f0e1e7", color: MAUVE }}>
                                            Exportar CSV/Excel
                                        </span>
                                    </div>
                                    <p className="bc-ui mt-2 text-[10.5px] leading-relaxed" style={{ color: "#8a6516" }}>
                                        El CSV lleva BOM UTF-8 para que Excel abra bien los acentos, y el cierre suma sólo
                                        ventas: los fiados viven en su propia cuenta.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* el PDF */}
                        <Reveal direction="left" delay={0.1}>
                            <div className="mx-auto max-w-[360px]">
                                <MockPdf lit={enviado} />
                                <p className="mt-4 text-center text-xs" style={{ color: "rgba(244,234,210,0.5)" }}>
                                    {screenName(5)} · jsPDF + jspdf-autotable, franja de marca y tabla de prendas
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════════ 07 · LAS CIFRAS ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="bc-metrics max-w-6xl mx-auto">
                    <SectionHead
                        index="07 / Las cifras"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                El tamaño real <span className="brand-gradient-text">de la tienda</span>
                            </span>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-3">
                        {p.metrics.map((m) => (
                            <StaggerItem key={m.label}>
                                <div
                                    className="h-full px-5 py-6"
                                    style={{
                                        borderRadius: 16,
                                        border: "1px solid rgba(212,86,122,0.28)",
                                        background: "rgba(29,29,62,0.55)",
                                    }}
                                >
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════ 08 · LAS ETIQUETAS (features) ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="08 / Las etiquetas"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                {p.features.length} cosas <span className="brand-gradient-text">que ya hace</span>
                            </span>
                        }
                        lead="Una etiqueta por función, como las que cuelgan de cada prenda de la tienda."
                    />

                    <Stagger className="grid gap-x-5 gap-y-6 mt-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.035}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={18}>
                                <div className="relative pt-4">
                                    <span
                                        aria-hidden
                                        className="absolute left-6 top-0 h-4 w-px"
                                        style={{ background: "rgba(201,163,90,0.5)" }}
                                    />
                                    <div
                                        className="bc-tag relative h-full py-4 pl-11 pr-4"
                                        style={{
                                            borderRadius: "6px 14px 14px 6px",
                                            background: i % 3 === 1 ? CREAM : "#ffffff",
                                            boxShadow: "0 10px 26px rgba(120,40,70,0.16)",
                                            color: INK,
                                        }}
                                    >
                                        {/* el ojal dorado de la etiqueta */}
                                        <span
                                            aria-hidden
                                            className="absolute left-[13px] top-4 h-3.5 w-3.5 rounded-full"
                                            style={{ border: `2px solid ${GOLD}`, background: NAVY_D }}
                                        />
                                        <span
                                            className="bc-serif absolute left-2.5 bottom-3 text-[11px] font-bold"
                                            style={{ color: ROSE }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span aria-hidden className="absolute inset-y-2 left-[30px] w-px" style={{ background: "#f0e1e7" }} />
                                        <p className="bc-ui text-[13px] leading-relaxed" style={{ color: "#4a4152" }}>
                                            {f}
                                        </p>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════════ 09 · LOS MATERIALES (stack) ═════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="09 / Los materiales"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Con qué <span className="brand-gradient-text">está cosida</span>
                            </span>
                        }
                        lead="Plan Spark, sin Cloud Functions: todo el peso lo llevan el cliente y las reglas de seguridad."
                    />

                    <div className="mt-12 space-y-10">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06}>
                                <div className="relative">
                                    <div className="flex items-baseline gap-3">
                                        <span className="bc-serif text-xs" style={{ color: GOLD }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <p className="bc-serif text-lg font-bold md:text-xl" style={{ color: CREAM }}>
                                            {group.group}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3 pb-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="bc-ui rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors duration-300"
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(244,234,210,0.14)",
                                                    color: "rgba(244,234,210,0.82)",
                                                }}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    {/* el estante */}
                                    <span
                                        aria-hidden
                                        className="block h-[2px] w-full"
                                        style={{ background: `linear-gradient(90deg, ${GOLD}, rgba(201,163,90,0.06))` }}
                                    />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ 10 · BAJO EL MOSTRADOR (arquitectura + retos) ══════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(55% 40% at 25% 20%, rgba(236,127,155,0.06), transparent 70%)` }}
                />
                <div className="relative max-w-5xl mx-auto">
                    <SectionHead
                        index="10 / Bajo el mostrador"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Arquitectura <span className="brand-gradient-text">y lo que costó</span>
                            </span>
                        }
                    />

                    <Reveal className="mt-10">
                        <div
                            className="p-6 md:p-8"
                            style={{
                                borderRadius: 18,
                                background: "rgba(255,255,255,0.04)",
                                borderLeft: `3px solid ${ROSE}`,
                            }}
                        >
                            <p className="text-sm leading-relaxed md:text-base" style={{ color: "rgba(244,234,210,0.78)" }}>
                                {p.architecture}
                            </p>
                        </div>
                    </Reveal>

                    <p className="bc-serif mt-14 text-2xl font-bold md:text-3xl" style={{ color: CREAM }}>
                        Siete cosas que <span className="brand-gradient-text">se rompieron primero</span>
                    </p>

                    <div className="mt-8 space-y-4">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="grid overflow-hidden md:grid-cols-2" style={{ borderRadius: 18 }}>
                                    <div className="p-5 md:p-6" style={{ background: CREAM, color: INK }}>
                                        <p className="bc-ui text-[10px] uppercase tracking-[0.28em]" style={{ color: RED }}>
                                            Se rompía · {String(i + 1).padStart(2, "0")}
                                        </p>
                                        <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "#4a4152" }}>
                                            {c.problem}
                                        </p>
                                    </div>
                                    <div
                                        className="bc-sweep bc-sweep-hover relative p-5 md:p-6"
                                        style={{ background: "#ffffff", color: INK }}
                                    >
                                        <span className="bc-band" aria-hidden />
                                        <p className="bc-ui text-[10px] uppercase tracking-[0.28em]" style={{ color: ROSE }}>
                                            Se resolvió así
                                        </p>
                                        <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "#4a4152" }}>
                                            {c.solution}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════ 11 · LA PALETA ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="11 / La paleta"
                        title={
                            <span className="bc-serif" style={{ color: CREAM }}>
                                Los colores <span className="brand-gradient-text">de la tienda</span>
                            </span>
                        }
                        lead={p.brand.mood}
                    />

                    <div className="grid grid-cols-2 gap-3 mt-10 sm:grid-cols-3 lg:grid-cols-6">
                        {[
                            { k: "primary", v: p.brand.primary },
                            { k: "secondary", v: p.brand.secondary },
                            { k: "accent", v: p.brand.accent },
                            { k: "bg", v: p.brand.bg },
                            { k: "surface", v: p.brand.surface },
                            { k: "text", v: p.brand.text },
                        ].map((c, i) => (
                            <Reveal key={c.k} delay={i * 0.05}>
                                <div
                                    className="overflow-hidden"
                                    style={{ borderRadius: 14, border: "1px solid rgba(244,234,210,0.14)" }}
                                >
                                    <span className="block h-16" style={{ background: c.v }} />
                                    <div className="px-3 py-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                                        <p className="bc-ui text-[11px] font-semibold" style={{ color: CREAM }}>
                                            {c.k}
                                        </p>
                                        <p className="bc-ui text-[10px] uppercase" style={{ color: "rgba(244,234,210,0.5)" }}>
                                            {c.v}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-6">
                        <div
                            className="p-5 md:p-6"
                            style={{ borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,163,90,0.2)" }}
                        >
                            <p className="bc-ui text-[10px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
                                Degradado de marca
                            </p>
                            <span className="block h-8 mt-3" style={{ borderRadius: 8, backgroundImage: p.brand.gradient }} />
                            <p className="mt-3 text-xs leading-relaxed" style={{ color: "rgba(244,234,210,0.55)" }}>
                                {p.brand.source}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════ MEDIA REAL (si algún día la hay) ══════════════ */}
            {p.media.length > 0 ? (
                <section className="relative px-4 py-20 md:px-6 md:py-24">
                    <div className="max-w-6xl mx-auto">
                        <SectionHead
                            index="12 / Capturas"
                            title={
                                <span className="bc-serif" style={{ color: CREAM }}>
                                    De la <span className="brand-gradient-text">tienda real</span>
                                </span>
                            }
                        />
                        <DragRail className="mt-10">
                            {p.media.map((m) =>
                                m.src.endsWith(".mp4") ? (
                                    <div key={m.src} className="w-[280px] shrink-0">
                                        <AutoVideo src={m.src} />
                                        <p className="mt-2 text-xs" style={{ color: "rgba(244,234,210,0.5)" }}>
                                            {m.caption}
                                        </p>
                                    </div>
                                ) : (
                                    <ShotCard key={m.src} src={m.src} alt={m.caption} caption={m.caption} className="w-[280px] shrink-0" />
                                )
                            )}
                        </DragRail>
                    </div>
                </section>
            ) : (
                <section className="relative px-4 py-14 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(244,234,210,0.42)" }}>
                            Sin capturas publicables: es la herramienta interna de una tienda con datos de clientas reales.
                            Todas las pantallas de esta página están recreadas en HTML y CSS a partir de la interfaz real.
                        </p>
                    </div>
                </section>
            )}

            {/* ══════════════════════ 12 · EN RESUMEN ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span aria-hidden className="h-px flex-1" style={{ background: "rgba(201,163,90,0.35)" }} />
                        <Spark size={14} />
                        <span aria-hidden className="h-px flex-1" style={{ background: "rgba(201,163,90,0.35)" }} />
                    </div>

                    <Stagger className="mt-10 space-y-6">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={i === 0 ? "bc-serif text-lg leading-relaxed md:text-2xl" : "text-sm leading-relaxed md:text-base"}
                                    style={{ color: i === 0 ? CREAM : "rgba(244,234,210,0.68)" }}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <div
                className="py-5 text-[11px] uppercase tracking-[0.24em]"
                style={{
                    borderTop: "1px solid rgba(201,163,90,0.22)",
                    borderBottom: "1px solid rgba(201,163,90,0.22)",
                    color: "rgba(244,234,210,0.45)",
                }}
            >
                <Marquee
                    items={[...GRUPOS, "54 productos", "runTransaction", "offline first", "PDF + WhatsApp", "SENIAT", "America/Caracas"]}
                    speed={38}
                    separator="✦"
                />
            </div>

            <div className="pb-32">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una tienda de barrio operando con transacciones atómicas, caché offline y contabilidad anclada a su zona horaria. Si tienes un negocio que todavía vive en un cuaderno, este es exactamente el terreno que conozco."
                />
                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] transition-opacity opacity-40 hover:opacity-90"
                        style={{ color: CREAM }}
                    >
                        Cerrar la vitrina <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
