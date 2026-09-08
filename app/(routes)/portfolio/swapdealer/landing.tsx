"use client"

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowLeft,
    ArrowLeftRight,
    ArrowRight,
    Banknote,
    Bell,
    Boxes,
    Car,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Inbox,
    LayoutDashboard,
    MapPin,
    Plus,
    Printer,
    Radar,
    RefreshCcw,
    Search,
    Star,
    Store,
    User,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SampleDataNote, SectionHead } from "@/components/projects/bits";
import { AutoVideo, BrowserFrame, DragRail, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

/**
 * Redondea un numero destinado a un atributo SVG. El navegador reserializa los
 * atributos numericos de SVG con menos precision que el renderizador del
 * servidor, y la diferencia dispara un fallo de hidratacion de React.
 */
const svgNum = (n: number) => Number(n.toFixed(3));

const p = getProject("swapdealer")!;
const nxt = nextProject("swapdealer");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Rótulos cortos derivados del dato largo (el catálogo trae los *Short de otro proyecto). */
const CAT_SHORT = p.category.split("·")[0].trim();
const STATE_SHORT = p.status.split(";")[0].split(" y ")[0].trim();

/* ── Paleta del producto (redesign.css) ─────────────────────────────────── */
const INK = "#0E0F0C";
const PAPER = "#FBFAF7";
const SURFACE = "#FFFFFF";
const GREEN = "#61C568";
const GREEN_DEEP = "#1E6626";
const AMBER = "#ECA851";
const AMBER_DEEP = "#784900";
const LINE = "rgba(14,15,12,0.10)";
const LINE_2 = "rgba(14,15,12,0.06)";
const SOFT_GREEN = "#E9F6EA";
const SOFT_AMBER = "#FBF1DF";
const WARM = "#F4F2ED";

/* Formateo determinista: nada de toLocaleString (rompería la hidratación). */
const money = (n: number) => {
    const abs = Math.abs(Math.round(n));
    const body = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${n < 0 ? "−" : ""}$${body}`;
};

/* ── Datos de ejemplo de los mockups (recreaciones de la interfaz) ─────── */

type Veh = { marca: string; modelo: string; anio: string; km: string; precio: number; tone: string };

const PAIRS: { mine: Veh; theirs: Veh; diff: number }[] = [
    {
        mine: { marca: "Toyota", modelo: "Corolla LE", anio: "2019", km: "68.400 km", precio: 14200, tone: "#2E4A73" },
        theirs: { marca: "Ford", modelo: "Ranger XLT", anio: "2018", km: "91.200 km", precio: 18600, tone: "#4A4F52" },
        diff: -4400,
    },
    {
        mine: { marca: "Chevrolet", modelo: "Tahoe LT", anio: "2016", km: "132.500 km", precio: 21500, tone: "#1F5F4E" },
        theirs: { marca: "Hyundai", modelo: "Tucson GLS", anio: "2020", km: "44.900 km", precio: 19300, tone: "#5A4A6B" },
        diff: 2200,
    },
    {
        mine: { marca: "Jeep", modelo: "Grand Cherokee", anio: "2017", km: "104.700 km", precio: 17800, tone: "#6B4A2E" },
        theirs: { marca: "Mazda", modelo: "CX-5 Touring", anio: "2019", km: "57.300 km", precio: 17800, tone: "#3E5563" },
        diff: 0,
    },
];

const MATCHES = [
    {
        score: 92,
        mine: { t: "Toyota Corolla 2019", precio: 14200, tone: "#2E4A73" },
        theirs: { t: "Ford Ranger 2018", precio: 18600, tone: "#4A4F52" },
        diff: -4400,
        dealer: "Autos del Este",
    },
    {
        score: 81,
        mine: { t: "Chevrolet Tahoe 2016", precio: 21500, tone: "#1F5F4E" },
        theirs: { t: "Hyundai Tucson 2020", precio: 19300, tone: "#5A4A6B" },
        diff: 2200,
        dealer: "Motores Caribe",
    },
    {
        score: 64,
        mine: { t: "Jeep Cherokee 2017", precio: 17800, tone: "#6B4A2E" },
        theirs: { t: "Mazda CX-5 2019", precio: 17800, tone: "#3E5563" },
        diff: 0,
        dealer: "Dealer Anzoátegui",
    },
];

const SCORE_BARS = [
    { label: "Criterios", value: 96 },
    { label: "Financiero", value: 88 },
    { label: "Reputación", value: 74 },
    { label: "Geografía", value: 61 },
];

const KPIS = [
    { label: "Vehículos activos", value: "24", delta: "+3", up: true },
    { label: "Matches hoy", value: "12", delta: "+5", up: true },
    { label: "Cambios mes", value: "6", delta: "+2", up: true },
    { label: "Prom. cierre", value: "9 d", delta: "−2", up: true },
];

const FUNNEL = [
    { label: "Ingresados", value: 32, pct: 100, amber: false },
    { label: "Con match", value: 21, pct: 66, amber: false },
    { label: "Propuestos", value: 11, pct: 34, amber: false },
    { label: "Cerrados", value: 6, pct: 19, amber: true },
];

const URGENTES = [
    { veh: "Ford Ranger XLT 2018", dealer: "Autos del Este", diff: -4400, tone: "#4A4F52" },
    { veh: "Hyundai Tucson GLS 2020", dealer: "Motores Caribe", diff: 2200, tone: "#5A4A6B" },
    { veh: "Kia Sportage 2019", dealer: "Dealer Anzoátegui", diff: 900, tone: "#3E5563" },
];

const ACTIVIDAD = [
    { t: "09:14", text: "Autos del Este aceptó tu propuesta", tone: GREEN_DEEP, bg: SOFT_GREEN },
    { t: "08:47", text: "Nueva contraoferta en Chevrolet Tahoe", tone: AMBER_DEEP, bg: SOFT_AMBER },
    { t: "08:02", text: "3 matches nuevos para Toyota Corolla", tone: INK, bg: WARM },
];

const NAV = [
    { label: "Inicio", icon: LayoutDashboard, active: true },
    { label: "Mercado", icon: Store, active: false },
    { label: "Matches", icon: Radar, active: false },
    { label: "Bandeja", icon: Inbox, active: false, badge: "4" },
    { label: "Inventario", icon: Boxes, active: false },
    { label: "Perfil", icon: User, active: false },
];

const HISTORIAL = [
    { autor: "Autos del Este", monto: "−$4.400", msg: "Diferencial calculado por la plataforma", turno: "ellos" },
    { autor: "Tú", monto: "−$3.900", msg: "Puedo llegar hasta ahí si incluyes el traspaso", turno: "tu" },
    { autor: "Autos del Este", monto: "−$4.150", msg: "Traspaso incluido. Cerramos en esa cifra", turno: "ellos" },
];

const CHAT = [
    { side: "l", who: "Autos del Este", time: "09:02", monto: "−$4.400", text: "Te propongo la Ranger por tu Corolla. El diferencial lo calculó la plataforma." },
    { side: "r", who: "Tú", time: "09:11", monto: "−$3.900", text: "Contraoferto. Puedo llegar ahí si el traspaso corre por tu cuenta." },
    { side: "l", who: "Autos del Este", time: "09:24", monto: "−$4.150", text: "Traspaso incluido y cerramos en esa cifra." },
    { side: "r", who: "Tú", time: "09:26", monto: "−$4.150", text: "Aceptada. Coordinamos la entrega el jueves." },
];

const MARCAS = ["Toyota", "Chevrolet", "Ford", "Jeep", "Hyundai", "Kia", "Mazda", "Nissan", "Renault", "Mitsubishi"];

const PASOS = ["Datos base", "Valoración", "Modalidad de venta", "Revisión"];

const MODALIDADES = [
    { title: "Solo efectivo", desc: "El vehículo se vende únicamente por dinero.", icon: Banknote },
    { title: "Solo cambio", desc: "Se acepta exclusivamente intercambio por otra unidad.", icon: ArrowLeftRight },
    { title: "Cambio + efectivo", desc: "Cambio con diferencial en dólares a favor o a compensar.", icon: RefreshCcw },
];

/* ── CSS propio de esta landing ─────────────────────────────────────────── */

const css = `
.sd-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.sd-serif {
  font-family: "Instrument Serif", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
}
.sd-caps {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 10px;
}
.sd-card {
  background: ${SURFACE};
  border: 1px solid ${LINE};
  border-radius: 14px;
}
.sd-hair { border-color: ${LINE}; }

/* ---- Héroe: el cruce de las dos tarjetas ---- */
.sd-stage { position: relative; }
.sd-veh { width: 100%; }
.sd-veh + .sd-veh { margin-top: 14px; }
.sd-arrows { display: none; }
@media (min-width: 768px) {
  .sd-stage { height: 236px; }
  .sd-veh { position: absolute; top: 0; width: 43%; margin: 0 !important; }
  .sd-veh-l { left: 0; z-index: 20; animation: sd-cross-l 5.2s cubic-bezier(0.32, 0.72, 0, 1) infinite both; }
  .sd-veh-r { right: 0; z-index: 10; animation: sd-cross-r 5.2s cubic-bezier(0.32, 0.72, 0, 1) infinite both; }
  .sd-arrows { display: block; }
}
@keyframes sd-cross-l {
  0%   { transform: translate(-155%, 0) rotate(-3deg); opacity: 0; }
  13%  { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  30%  { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  38%  { transform: translate(33%, -18px) rotate(3deg); opacity: 1; }
  47%  { transform: translate(132%, 0) rotate(0deg); opacity: 1; }
  92%  { transform: translate(132%, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(132%, 0) rotate(0deg); opacity: 0; }
}
@keyframes sd-cross-r {
  0%   { transform: translate(155%, 0) rotate(3deg); opacity: 0; }
  13%  { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  30%  { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  38%  { transform: translate(-33%, 18px) rotate(-3deg); opacity: 1; }
  47%  { transform: translate(-132%, 0) rotate(0deg); opacity: 1; }
  92%  { transform: translate(-132%, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(-132%, 0) rotate(0deg); opacity: 0; }
}
.sd-arrow { stroke-dasharray: 300; stroke-dashoffset: 0; }
.sd-arrow-a { animation: sd-draw 5.2s ease-out infinite both; }
.sd-arrow-b { animation: sd-draw 5.2s ease-out 0.12s infinite both; }
@keyframes sd-draw {
  0%, 24%  { stroke-dashoffset: 300; opacity: 0.9; }
  42%      { stroke-dashoffset: 0; opacity: 0.9; }
  92%      { stroke-dashoffset: 0; opacity: 0.9; }
  100%     { stroke-dashoffset: 0; opacity: 0; }
}
.sd-pill-diff { animation: sd-pill 5.2s ease-out infinite both; }
@keyframes sd-pill {
  0%, 46%  { opacity: 0; transform: scale(0.9); }
  56%      { opacity: 1; transform: scale(1); }
  92%      { opacity: 1; transform: scale(1); }
  100%     { opacity: 0; transform: scale(1); }
}

/* ---- Punto de turno / latido ---- */
.sd-dot { position: relative; }
.sd-dot::after {
  content: "";
  position: absolute;
  inset: -5px;
  border-radius: 999px;
  border: 1px solid currentColor;
  animation: brand-pulse-ring 1.9s ease-out infinite;
}
.sd-beat { animation: sd-beat 2.6s ease-out 1 both; }
@keyframes sd-beat {
  0%   { transform: scale(0.6); opacity: 0; }
  22%  { transform: scale(1.25); opacity: 1; }
  40%  { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* ---- Balanza del diferencial ---- */
.sd-beam { transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1); transform-origin: 50% 50%; }
.sd-pan { transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1); }

/* ---- Rejilla y textura de papel ---- */
.sd-paper {
  background-image:
    linear-gradient(to right, rgba(14, 15, 12, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(14, 15, 12, 0.035) 1px, transparent 1px);
  background-size: 72px 72px;
}
.sd-row { transition: background-color 200ms ease, transform 200ms ease; }
.sd-row:hover { background-color: rgba(97, 197, 104, 0.09); }
.sd-tab { transition: all 180ms cubic-bezier(0.32, 0.72, 0, 1); }
.sd-chipsel { transition: all 160ms ease; }
.sd-scale { animation: none; }

/* Por debajo de md no hay cruce: la píldora no debe parpadear sola. */
@media (max-width: 767px) {
  .sd-pill-diff { animation: none !important; opacity: 1 !important; transform: none !important; }
}

@media (prefers-reduced-motion: reduce) {
  .sd-veh-l, .sd-veh-r, .sd-arrow-a, .sd-arrow-b, .sd-pill-diff,
  .sd-dot::after, .sd-beat {
    animation: none !important;
  }
  .sd-veh-l, .sd-veh-r { opacity: 1 !important; }
  .sd-arrow { stroke-dashoffset: 0 !important; }
  .sd-pill-diff { opacity: 1 !important; transform: none !important; }
  .sd-beam, .sd-pan { transition: none !important; }
}
/* El estado final ya cruzado sólo tiene sentido donde las tarjetas van a los lados. */
@media (prefers-reduced-motion: reduce) and (min-width: 768px) {
  .sd-veh-l { transform: translate(132%, 0) !important; }
  .sd-veh-r { transform: translate(-132%, 0) !important; }
}
`;

/* ── Piezas reutilizables de la landing ─────────────────────────────────── */

/** Rótulo monoespaciado en versalitas, el mismo de las etiquetas del producto. */
const Label = ({ children, className, color }: { children: React.ReactNode; className?: string; color?: string }) => (
    <span className={`sd-mono sd-caps ${className ?? ""}`} style={{ color: color ?? "rgba(14,15,12,0.42)" }}>
        {children}
    </span>
);

/** Cifra monetaria que cuenta desde cero al montarse. */
const MoneyTick = ({ amount, className }: { amount: number; className?: string }) => {
    const [shown, setShown] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        if (reduce) {
            setShown(amount);
            return;
        }
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 700);
            setShown(amount * (1 - Math.pow(1 - t, 3)));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [amount, reduce]);

    return <span className={`sd-mono ${className ?? ""}`}>{money(shown)}</span>;
};

/** Anillo de score idéntico al del producto: se dibuja de 0 a `value` al entrar en pantalla. */
const ScoreRing = ({ value, size = 132, stroke = 10 }: { value: number; size?: number; stroke?: number }) => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.4);
    const [shown, setShown] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        if (!inView) return;
        if (reduce) {
            setShown(value);
            return;
        }
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 900);
            setShown(value * (1 - Math.pow(1 - t, 3)));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value, reduce]);

    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const color = shown >= 85 ? GREEN_DEEP : shown >= 70 ? AMBER_DEEP : "rgba(14,15,12,0.35)";
    const track = shown >= 85 ? SOFT_GREEN : shown >= 70 ? SOFT_AMBER : "rgba(14,15,12,0.07)";

    return (
        <div ref={ref} className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={svgNum(c)}
                    strokeDashoffset={svgNum(c - (c * shown) / 100)}
                    style={{ transition: "stroke 220ms ease" }}
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
                <span className="sd-mono text-[26px] font-semibold leading-none" style={{ color }}>
                    {Math.round(shown)}
                </span>
                <span className="sd-mono sd-caps absolute bottom-6" style={{ color: "rgba(14,15,12,0.35)" }}>
                    score
                </span>
            </div>
        </div>
    );
};

/** Cuatro barras de 6 px que crecen escalonadas. */
const CriteriaBars = () => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.35);
    return (
        <div ref={ref} className="w-full space-y-4">
            {SCORE_BARS.map((b, i) => (
                <div key={b.label}>
                    <div className="flex items-baseline justify-between">
                        <Label>{b.label}</Label>
                        <span className="sd-mono text-[12px]" style={{ color: "rgba(14,15,12,0.62)" }}>
                            {b.value}
                        </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(14,15,12,0.07)" }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: inView ? `${b.value}%` : "0%",
                                background: b.value >= 85 ? GREEN_DEEP : b.value >= 70 ? AMBER : "rgba(14,15,12,0.28)",
                                transition: `width 620ms cubic-bezier(0.32,0.72,0,1) ${i * 90}ms`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

/** Miniatura plana de vehículo: el producto usa un rectángulo de color cuando no hay foto. */
const Thumb = ({
    tone,
    label,
    w = 56,
    h = 56,
    radius = 8,
}: {
    tone: string;
    label?: string;
    w?: number;
    h?: number;
    radius?: number;
}) => (
    <span
        className="grid shrink-0 place-items-center overflow-hidden text-center text-[8px] font-semibold leading-tight text-white"
        style={{
            width: w,
            height: h,
            borderRadius: radius,
            background: `linear-gradient(140deg, ${tone}, ${tone}b3)`,
        }}
    >
        {label}
    </span>
);

/** Banda de diferencial tintada según el signo. */
const DiffBand = ({ amount, compact = false }: { amount: number; compact?: boolean }) => {
    const favor = amount > 0;
    const par = amount === 0;
    const bg = par ? "rgba(14,15,12,0.05)" : favor ? SOFT_GREEN : SOFT_AMBER;
    const fg = par ? "rgba(14,15,12,0.55)" : favor ? GREEN_DEEP : AMBER_DEEP;
    const texto = par ? "cambio par" : favor ? "a tu favor" : "a compensar";

    return (
        <div
            className={`flex items-center justify-between rounded-lg ${compact ? "px-2.5 py-1.5" : "px-3.5 py-2.5"}`}
            style={{ background: bg }}
        >
            <span className="sd-mono sd-caps" style={{ color: fg }}>
                Diferencial · {texto}
            </span>
            <span className={`sd-mono font-semibold ${compact ? "text-[12px]" : "text-[15px]"}`} style={{ color: fg }}>
                {money(amount)}
            </span>
        </div>
    );
};

/* ── Mockup A · Inicio del dealer ───────────────────────────────────────── */

const MockDashboard = () => (
    <div className="overflow-x-auto">
        <div className="flex min-w-[760px]" style={{ background: PAPER, color: INK }}>
            {/* Barra lateral fija de 264 px del producto */}
            <aside className="w-[168px] shrink-0 p-3" style={{ background: WARM, borderRight: `1px solid ${LINE}` }}>
                <div className="flex items-center gap-2">
                    <span
                        className="grid h-8 w-8 place-items-center rounded-[7px] text-[11px] font-bold text-white"
                        style={{ background: INK }}
                    >
                        SD
                    </span>
                    <div className="leading-tight">
                        <p className="text-[10px] font-semibold">Autos Sojo</p>
                        <p className="sd-mono text-[8px]" style={{ color: "rgba(14,15,12,0.45)" }}>
                            Caracas · verificado
                        </p>
                    </div>
                </div>

                <div
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[10px] font-semibold text-white"
                    style={{ background: INK }}
                >
                    <Plus size={11} /> Publicar vehículo
                </div>

                <nav className="mt-4 space-y-0.5">
                    {NAV.map((n) => (
                        <div
                            key={n.label}
                            className="flex items-center gap-2 rounded-lg px-2 py-[7px] text-[10px]"
                            style={{
                                background: n.active ? SURFACE : "transparent",
                                border: `1px solid ${n.active ? LINE : "transparent"}`,
                                color: n.active ? INK : "rgba(14,15,12,0.55)",
                                fontWeight: n.active ? 600 : 400,
                            }}
                        >
                            <n.icon size={12} />
                            <span className="flex-1">{n.label}</span>
                            {n.badge && (
                                <span
                                    className="sd-mono rounded-full px-1.5 text-[8px] font-semibold"
                                    style={{ background: GREEN, color: INK }}
                                >
                                    {n.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Área principal */}
            <div className="min-w-0 flex-1 p-4">
                <Label>Martes 12 de mayo de 2026</Label>
                <p className="mt-1 text-[17px] font-semibold leading-none">
                    Hola, <span className="sd-serif text-[21px]">Arturo</span>
                </p>

                {/* Tarjeta hero de tinta con halo verde */}
                <div className="relative mt-3 overflow-hidden rounded-xl p-4" style={{ background: INK }}>
                    <span
                        aria-hidden
                        className="absolute inset-0"
                        style={{ background: `radial-gradient(60% 90% at 100% 0%, ${GREEN}40, transparent 68%)` }}
                    />
                    <div className="relative">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="sd-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: GREEN, color: GREEN }} />
                            <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.6)" }}>
                                Tu radar · en vivo
                            </span>
                        </span>
                        <p className="mt-2 text-[15px] font-medium leading-snug" style={{ color: PAPER }}>
                            Hay <span className="sd-serif text-[24px]" style={{ color: GREEN }}>12</span> matches esperando tu revisión
                        </p>
                        <div className="mt-3 flex gap-2">
                            <span className="rounded-full px-3 py-1.5 text-[10px] font-semibold" style={{ background: GREEN, color: INK }}>
                                Ver cambios posibles
                            </span>
                            <span
                                className="rounded-full px-3 py-1.5 text-[10px]"
                                style={{ background: "rgba(251,250,247,0.12)", color: PAPER }}
                            >
                                Ir a la bandeja
                            </span>
                        </div>
                    </div>
                </div>

                {/* KPIs */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                    {KPIS.map((k) => (
                        <div key={k.label} className="sd-card p-2.5">
                            <Label>{k.label}</Label>
                            <p className="mt-1 text-[20px] font-semibold leading-none">{k.value}</p>
                            <p className="sd-mono mt-1 text-[9px]" style={{ color: GREEN_DEEP }}>
                                ↑ {k.delta}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Dos columnas: urgentes + embudo */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="sd-card p-3">
                        <p className="text-[11px] font-semibold">Matches urgentes</p>
                        <div className="mt-2 space-y-1.5">
                            {URGENTES.map((u) => (
                                <div key={u.veh} className="flex items-center gap-2">
                                    <Thumb tone={u.tone} w={30} h={24} radius={5} />
                                    <div className="min-w-0 flex-1 leading-tight">
                                        <p className="truncate text-[9.5px] font-medium">{u.veh}</p>
                                        <p className="text-[8px]" style={{ color: "rgba(14,15,12,0.45)" }}>
                                            {u.dealer}
                                        </p>
                                    </div>
                                    <span
                                        className="sd-mono text-[10px] font-semibold"
                                        style={{ color: u.diff > 0 ? GREEN_DEEP : AMBER_DEEP }}
                                    >
                                        {money(u.diff)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sd-card p-3">
                        <p className="text-[11px] font-semibold">Embudo del mes</p>
                        <div className="mt-2 space-y-2">
                            {FUNNEL.map((f) => (
                                <div key={f.label}>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-[8.5px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                                            {f.label}
                                        </span>
                                        <span className="sd-mono text-[9px]">{f.value}</span>
                                    </div>
                                    <div className="mt-1 h-1.5 rounded-full" style={{ background: "rgba(14,15,12,0.07)" }}>
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: `${f.pct}%`, background: f.amber ? AMBER : INK }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed de actividad */}
                <div className="mt-3 space-y-1.5">
                    {ACTIVIDAD.map((a) => (
                        <div key={a.t} className="sd-card flex items-center gap-2 p-2">
                            <span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: a.bg, color: a.tone }}>
                                <Bell size={11} />
                            </span>
                            <span className="flex-1 text-[9.5px]">{a.text}</span>
                            <span className="sd-mono text-[8.5px]" style={{ color: "rgba(14,15,12,0.4)" }}>
                                {a.t}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ── Mockup B · Cambios posibles (motor de matches) ─────────────────────── */

const MockMatches = () => (
    <div className="overflow-x-auto">
        <div className="min-w-[740px] p-4" style={{ background: PAPER, color: INK }}>
            <div className="flex items-end justify-between">
                <div>
                    <Label>Motor de matches</Label>
                    <p className="text-[24px] font-semibold leading-none tracking-[-0.03em]">Cambios posibles</p>
                    <p className="mt-1 text-[10px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                        32 vehículos de la red son compatibles con tu inventario
                    </p>
                </div>
                <span className="sd-card inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium">
                    <Printer size={11} /> Imprimir
                </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                    { l: "Encontrados", v: "32", soft: false },
                    { l: "A tu favor", v: "14", soft: false },
                    { l: "Score 80+", v: "9", soft: true },
                ].map((s) => (
                    <div
                        key={s.l}
                        className="rounded-xl p-2.5"
                        style={{
                            background: s.soft ? SOFT_GREEN : SURFACE,
                            border: `1px solid ${s.soft ? "rgba(97,197,104,0.35)" : LINE}`,
                        }}
                    >
                        <Label color={s.soft ? GREEN_DEEP : undefined}>{s.l}</Label>
                        <p className="text-[20px] font-semibold leading-none" style={{ color: s.soft ? GREEN_DEEP : INK }}>
                            {s.v}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {["Marca", "Año", "Km máximo", "Mi vehículo"].map((f) => (
                    <span
                        key={f}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[9.5px]"
                        style={{ background: SURFACE, border: `1px solid ${LINE}`, color: "rgba(14,15,12,0.62)" }}
                    >
                        {f} <ChevronDown size={9} />
                    </span>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[9.5px]" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                    Orden: score <ChevronDown size={9} />
                </span>
                <span className="sd-mono text-[9px]" style={{ color: "rgba(14,15,12,0.42)" }}>
                    14 de 32
                </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
                {MATCHES.map((m, i) => {
                    const col = m.score >= 85 ? GREEN_DEEP : m.score >= 70 ? AMBER_DEEP : "rgba(14,15,12,0.35)";
                    const trk = m.score >= 85 ? SOFT_GREEN : m.score >= 70 ? SOFT_AMBER : "rgba(14,15,12,0.08)";
                    const dash = 2 * Math.PI * 16;
                    return (
                        <div key={i} className="sd-card overflow-hidden">
                            <div className="flex items-center gap-2 p-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                                <span className="relative grid h-10 w-10 place-items-center">
                                    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
                                        <circle cx="20" cy="20" r="16" fill="none" stroke={trk} strokeWidth="4" />
                                        <circle
                                            cx="20"
                                            cy="20"
                                            r="16"
                                            fill="none"
                                            stroke={col}
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeDasharray={svgNum(dash)}
                                            strokeDashoffset={svgNum(dash - (dash * m.score) / 100)}
                                        />
                                    </svg>
                                    <span className="sd-mono absolute text-[10px] font-semibold" style={{ color: col }}>
                                        {m.score}
                                    </span>
                                </span>
                                <div className="min-w-0 leading-tight">
                                    <p className="truncate text-[10px] font-semibold">{m.dealer}</p>
                                    <p className="sd-mono text-[8px]" style={{ color: "rgba(14,15,12,0.42)" }}>
                                        compatibilidad
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-2.5">
                                <div className="min-w-0 flex-1">
                                    <Label>Tú entregas</Label>
                                    <Thumb tone={m.mine.tone} w={56} h={40} radius={7} />
                                    <p className="mt-1 truncate text-[8.5px]" style={{ color: "rgba(14,15,12,0.55)" }}>
                                        {m.mine.t}
                                    </p>
                                    <p className="sd-mono text-[10px] font-semibold">{money(m.mine.precio)}</p>
                                </div>
                                <span
                                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                                    style={{ background: "rgba(14,15,12,0.06)", color: "rgba(14,15,12,0.5)" }}
                                >
                                    <RefreshCcw size={12} />
                                </span>
                                <div className="min-w-0 flex-1 text-right">
                                    <Label>Tú recibes</Label>
                                    <div className="flex justify-end">
                                        <Thumb tone={m.theirs.tone} w={56} h={40} radius={7} />
                                    </div>
                                    <p className="mt-1 truncate text-[8.5px]" style={{ color: "rgba(14,15,12,0.55)" }}>
                                        {m.theirs.t}
                                    </p>
                                    <p className="sd-mono text-[10px] font-semibold">{money(m.theirs.precio)}</p>
                                </div>
                            </div>

                            <div className="px-2.5">
                                <DiffBand amount={m.diff} compact />
                            </div>

                            <div className="flex gap-1.5 p-2.5">
                                <span className="flex-1 rounded-lg py-1.5 text-center text-[9.5px] font-semibold text-white" style={{ background: INK }}>
                                    Proponer cambio
                                </span>
                                <span
                                    className="rounded-lg px-2.5 py-1.5 text-center text-[9.5px]"
                                    style={{ background: SURFACE, border: `1px solid ${LINE}` }}
                                >
                                    Detalles
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full" style={{ border: `1px solid ${LINE}` }}>
                    <ChevronLeft size={11} />
                </span>
                <span className="sd-mono text-[9px]" style={{ color: "rgba(14,15,12,0.45)" }}>
                    página 1 de 3
                </span>
                <span className="grid h-6 w-6 place-items-center rounded-full" style={{ border: `1px solid ${LINE}` }}>
                    <ChevronRight size={11} />
                </span>
            </div>

            <div className="mt-2 rounded-xl p-2.5" style={{ background: WARM }}>
                <Label>Cómo se calcula el score</Label>
                <p className="mt-1 text-[9px] leading-relaxed" style={{ color: "rgba(14,15,12,0.6)" }}>
                    Cruce de criterios declarados, cercanía de valor entre las dos unidades, reputación del concesionario y
                    distancia geográfica. Cada factor aporta su parte al total de 100.
                </p>
            </div>
        </div>
    </div>
);

/* ── Mockup C · Propuesta de cambio (con oferta manual interactiva) ─────── */

const MockProposal = () => {
    const [cash, setCash] = useState("");
    const manual = cash.trim() !== "" && Number(cash) > 0;
    const auto = -4400;
    const neto = manual ? -Number(cash) : auto;

    return (
        <div className="p-4 md:p-6" style={{ background: PAPER, color: INK }}>
            <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full" style={{ border: `1px solid ${LINE}` }}>
                    <ArrowLeft size={13} />
                </span>
                <div>
                    <p className="text-[16px] font-semibold leading-none">Propuesta de cambio</p>
                    <p className="mt-1 text-[10px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                        Revise los detalles y términos del intercambio
                    </p>
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                    {
                        rot: "Lo que ofrezco",
                        veh: "Toyota Corolla LE 2019",
                        sub: "68.400 km · Gris plata",
                        precio: 14200,
                        grad: "linear-gradient(135deg,#2E4A73,#1F5F4E)",
                        marca: "Toyota Corolla",
                    },
                    {
                        rot: "Lo que recibo",
                        veh: "Ford Ranger XLT 2018",
                        sub: "91.200 km · Blanco",
                        precio: 18600,
                        grad: "linear-gradient(135deg,#4A4F52,#2B2F31)",
                        marca: "Ford Ranger",
                    },
                ].map((c) => (
                    <div key={c.rot} className="sd-card p-3">
                        <Label>{c.rot}</Label>
                        <div
                            className="mt-2 grid h-[112px] place-items-center rounded-lg text-[12px] font-semibold text-white"
                            style={{ background: c.grad }}
                        >
                            {c.marca}
                        </div>
                        <p className="mt-2 text-[12px] font-semibold">{c.veh}</p>
                        <p className="text-[10px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                            {c.sub}
                        </p>
                        <div className="mt-2 flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${LINE}` }}>
                            <span className="text-[10px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                                Valor
                            </span>
                            <span className="sd-mono text-[13px] font-semibold">{money(c.precio)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 rounded-xl p-3" style={{ background: WARM }}>
                <Label>Cálculo financiero</Label>

                <div className="mt-2">
                    <p className="text-[10px]" style={{ color: "rgba(14,15,12,0.55)" }}>
                        Oferta en efectivo (opcional)
                    </p>
                    <div
                        className="mt-1 flex items-center gap-1 rounded-lg px-2.5 py-2"
                        style={{ background: SURFACE, border: `1px solid ${manual ? GREEN : LINE}` }}
                    >
                        <span className="sd-mono text-[13px]" style={{ color: "rgba(14,15,12,0.4)" }}>
                            $
                        </span>
                        <input
                            value={cash}
                            onChange={(e) => setCash(e.target.value.replace(/[^\d]/g, ""))}
                            inputMode="numeric"
                            placeholder="Escribe un monto y sustituye el cálculo"
                            aria-label="Oferta en efectivo en dólares"
                            className="sd-mono w-full bg-transparent text-[13px] outline-none placeholder:text-[10px] placeholder:font-sans"
                            style={{ color: INK }}
                        />
                    </div>
                </div>

                <div
                    className="mt-3 space-y-1.5"
                    style={{ opacity: manual ? 0.5 : 1, transition: "opacity 220ms ease" }}
                >
                    {[
                        ["Valor de mi vehículo", money(14200)],
                        ["Valor de la contraparte", money(-18600)],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-[11px]">
                            <span style={{ color: "rgba(14,15,12,0.6)" }}>{k}</span>
                            <span className="sd-mono">{v}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between text-[9px]" style={{ color: "rgba(14,15,12,0.45)" }}>
                        <span>Comisión de plataforma (0,8 %)</span>
                        <span className="sd-mono">{money(-149)}</span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${LINE}` }}>
                    <span className="text-[11px] font-medium">Diferencial neto</span>
                    <span
                        className="sd-mono text-[20px] font-semibold"
                        style={{ color: neto > 0 ? GREEN_DEEP : neto === 0 ? "rgba(14,15,12,0.6)" : AMBER_DEEP }}
                    >
                        {money(neto)}
                    </span>
                </div>
                <p className="sd-mono mt-1 text-right text-[9px]" style={{ color: "rgba(14,15,12,0.45)" }}>
                    {manual ? "monto manual · sustituye el cálculo" : neto > 0 ? "a tu favor" : "a compensar"}
                </p>
            </div>

            <div className="mt-3 space-y-2">
                <div className="rounded-lg py-2.5 text-center text-[12px] font-semibold" style={{ background: GREEN, color: INK }}>
                    Enviar propuesta
                </div>
                <div
                    className="rounded-lg py-2.5 text-center text-[12px]"
                    style={{ background: SURFACE, border: `1px solid ${LINE}`, color: "rgba(14,15,12,0.6)" }}
                >
                    Volver a matches
                </div>
            </div>
        </div>
    );
};

/* ── Mockup D · Bandeja de propuestas (pestañas y turno) ────────────────── */

const MockInbox = () => {
    const [tab, setTab] = useState(0);
    const tabs = [
        { name: "Recibidas", count: "4" },
        { name: "Enviadas", count: "7" },
        { name: "Historial", count: "21" },
    ];
    const miTurno = tab !== 1;

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px] p-4" style={{ background: PAPER, color: INK }}>
                <Label>Bandeja</Label>
                <p className="text-[22px] font-semibold leading-none tracking-[-0.03em]">Propuestas</p>

                <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex gap-0.5 rounded-full p-0.5" style={{ background: "rgba(14,15,12,0.06)" }}>
                        {tabs.map((t, i) => (
                            <button
                                key={t.name}
                                type="button"
                                onClick={() => setTab(i)}
                                className="sd-tab inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px]"
                                style={{
                                    background: tab === i ? SURFACE : "transparent",
                                    fontWeight: tab === i ? 600 : 400,
                                    boxShadow: tab === i ? "0 1px 2px rgba(14,15,12,0.10)" : "none",
                                    color: INK,
                                }}
                            >
                                {t.name}
                                <span className="sd-mono text-[9px]" style={{ color: "rgba(14,15,12,0.4)" }}>
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9.5px]" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                        Estado <ChevronDown size={9} />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9.5px]" style={{ background: SURFACE, border: `1px solid ${LINE}`, color: "rgba(14,15,12,0.45)" }}>
                        <Search size={10} /> Buscar
                    </span>
                </div>

                <div className="sd-card mt-3 p-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="inline-flex items-center gap-1 text-[11px] font-semibold underline decoration-dotted underline-offset-2">
                                <MapPin size={10} /> Autos del Este
                            </p>
                            <p className="mt-0.5 inline-flex items-center gap-1.5 text-[9px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                                <Star size={9} fill={AMBER} color={AMBER} /> 4,8 · Barcelona, Anzoátegui
                                <span className="rounded-full px-1.5 py-[1px] text-[8px]" style={{ background: SOFT_GREEN, color: GREEN_DEEP }}>
                                    verificado
                                </span>
                            </p>
                        </div>
                        <div className="text-right">
                            <span
                                className="sd-mono sd-caps inline-flex items-center gap-1 rounded-full px-2 py-1"
                                style={{
                                    background: miTurno ? SOFT_AMBER : SOFT_GREEN,
                                    color: miTurno ? AMBER_DEEP : GREEN_DEEP,
                                }}
                            >
                                <span
                                    className={`inline-block h-1.5 w-1.5 rounded-full ${miTurno ? "" : "sd-dot"}`}
                                    style={{ background: miTurno ? AMBER : GREEN, color: GREEN }}
                                />
                                {miTurno ? "Contraoferta" : "Aceptada"}
                            </span>
                            <p className="sd-mono mt-1 text-[8.5px]" style={{ color: "rgba(14,15,12,0.4)" }}>
                                12/05/2026 · 09:24
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                            <Label>Ofrezco</Label>
                            <div className="mt-1 flex items-center gap-2">
                                <Thumb tone="#2E4A73" w={72} h={54} radius={7} label="Toyota" />
                                <div className="min-w-0 leading-tight">
                                    <p className="truncate text-[10px] font-medium">Toyota Corolla LE</p>
                                    <p className="text-[8.5px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                                        2019 · 68.400 km
                                    </p>
                                    <p className="sd-mono text-[10px] font-semibold">{money(14200)}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Solicito</Label>
                            <div className="mt-1 flex items-center gap-2">
                                <Thumb tone="#4A4F52" w={72} h={54} radius={7} label="Ford" />
                                <div className="min-w-0 leading-tight">
                                    <p className="truncate text-[10px] font-medium">Ford Ranger XLT</p>
                                    <p className="text-[8.5px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                                        2018 · 91.200 km
                                    </p>
                                    <p className="sd-mono text-[10px] font-semibold">{money(18600)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-y-1.5 pl-2.5" style={{ borderLeft: `3px solid ${LINE}` }}>
                        {HISTORIAL.map((h, i) => (
                            <div key={i} className="leading-tight">
                                <p className="text-[9px]">
                                    <span className="font-semibold">{h.autor}</span>
                                    <span className="sd-mono ml-1.5" style={{ color: h.turno === "tu" ? GREEN_DEEP : AMBER_DEEP }}>
                                        {h.monto}
                                    </span>
                                </p>
                                <p className="text-[8.5px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                                    {h.msg}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5" style={{ borderTop: `1px solid ${LINE}` }}>
                        {miTurno ? (
                            <>
                                <span className="rounded-lg px-3 py-1.5 text-[10px] font-semibold" style={{ background: GREEN, color: INK }}>
                                    Aceptar propuesta
                                </span>
                                <span className="rounded-lg px-3 py-1.5 text-[10px]" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                                    Contraofertar
                                </span>
                                <span className="rounded-lg px-3 py-1.5 text-[10px]" style={{ background: "#FBECEC", color: "#8C2F2F" }}>
                                    Rechazar
                                </span>
                            </>
                        ) : (
                            <span
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px]"
                                style={{ background: "rgba(14,15,12,0.05)", color: "rgba(14,15,12,0.55)" }}
                            >
                                <Clock size={11} /> Esperando respuesta de Autos del Este
                            </span>
                        )}
                    </div>
                </div>

                <div className="sd-card mt-2 flex items-center gap-3 p-3">
                    <span className="grid h-[54px] w-[72px] shrink-0 place-items-center rounded-md" style={{ background: WARM, color: "rgba(14,15,12,0.45)" }}>
                        <Banknote size={18} />
                    </span>
                    <div className="min-w-0 flex-1 leading-tight">
                        <p className="text-[10px] font-medium">Motores Caribe · solo efectivo</p>
                        <p className="text-[8.5px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                            Oferta directa por tu Chevrolet Tahoe 2016
                        </p>
                    </div>
                    <span className="sd-mono text-[12px] font-semibold" style={{ color: GREEN_DEEP }}>
                        {money(20800)}
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ── Mockup E · Asistente de publicación (paso de modalidad) ────────────── */

const MockWizard = () => {
    const [mod, setMod] = useState(2);
    const [marcas, setMarcas] = useState<string[]>(["Toyota", "Ford", "Jeep"]);
    const toggle = (m: string) =>
        setMarcas((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

    return (
        <div className="p-4 md:p-5" style={{ background: PAPER, color: INK }}>
            <div className="grid grid-cols-4 gap-1.5">
                {PASOS.map((s, i) => {
                    const done = i < 2;
                    const active = i === 2;
                    return (
                        <div
                            key={s}
                            className="rounded-lg p-2"
                            style={{
                                background: active ? SURFACE : WARM,
                                border: active ? `1px solid ${INK}` : "1px solid transparent",
                            }}
                        >
                            <span
                                className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold"
                                style={{
                                    background: done || active ? INK : "rgba(14,15,12,0.08)",
                                    color: done || active ? PAPER : "rgba(14,15,12,0.45)",
                                }}
                            >
                                {done ? <Check size={11} /> : <span className="sd-mono">{i + 1}</span>}
                            </span>
                            <p className="mt-1.5 text-[9.5px] font-medium leading-tight">{s}</p>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 text-[13px] font-semibold">¿Cómo quieres vender esta unidad?</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {MODALIDADES.map((m, i) => {
                    const sel = mod === i;
                    return (
                        <button
                            key={m.title}
                            type="button"
                            onClick={() => setMod(i)}
                            className="sd-chipsel relative rounded-xl p-3 text-left"
                            style={{
                                background: SURFACE,
                                border: sel ? `2px solid ${INK}` : `1px solid ${LINE}`,
                                boxShadow: sel ? "0 6px 18px -10px rgba(14,15,12,0.45)" : "none",
                                color: INK,
                            }}
                        >
                            {i === 2 && (
                                <span
                                    className="sd-mono sd-caps absolute -right-1.5 -top-2 rounded-full px-2 py-0.5"
                                    style={{ background: GREEN, color: INK }}
                                >
                                    Recomendado
                                </span>
                            )}
                            <m.icon size={15} />
                            <p className="mt-1.5 text-[11px] font-semibold">{m.title}</p>
                            <p className="mt-0.5 text-[9px] leading-snug" style={{ color: "rgba(14,15,12,0.55)" }}>
                                {m.desc}
                            </p>
                        </button>
                    );
                })}
            </div>

            {mod !== 0 && (
                <div className="mt-3 rounded-xl p-3" style={{ background: WARM }}>
                    <Label>Criterios de intercambio</Label>
                    <p className="mt-1 text-[9.5px]" style={{ color: "rgba(14,15,12,0.55)" }}>
                        Marcas que aceptas a cambio
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {MARCAS.map((m) => {
                            const on = marcas.includes(m);
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => toggle(m)}
                                    className="sd-chipsel rounded-full px-2.5 py-1 text-[9.5px]"
                                    style={{
                                        background: on ? GREEN_DEEP : SURFACE,
                                        color: on ? "#FFFFFF" : "rgba(14,15,12,0.6)",
                                        border: `1px solid ${on ? GREEN_DEEP : LINE}`,
                                    }}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {[
                            ["Rango de año", "2015 — 2024"],
                            ["Kilometraje máximo", "120.000 km"],
                            ["Condición mínima", "Buena"],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-lg p-2" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                                <Label>{k}</Label>
                                <p className="sd-mono mt-0.5 text-[11px]">{v}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "rgba(14,15,12,0.5)" }}>
                    ← Paso anterior
                </span>
                <span className="rounded-lg px-3.5 py-2 text-[10px] font-semibold text-white" style={{ background: INK }}>
                    Continuar a revisión →
                </span>
            </div>
        </div>
    );
};

/* ── Héroe: el cruce ────────────────────────────────────────────────────── */

const HeroCard = ({ v, side }: { v: Veh; side: "l" | "r" }) => (
    <div
        className={`sd-veh sd-veh-${side} rounded-2xl p-3`}
        style={{ background: "rgba(251,250,247,0.05)", border: "1px solid rgba(251,250,247,0.14)" }}
    >
        <div className="flex items-center justify-between">
            <span className="sd-mono sd-caps" style={{ color: side === "l" ? GREEN : "rgba(251,250,247,0.5)" }}>
                {side === "l" ? "Tú entregas" : "Tú recibes"}
            </span>
            <span className="sd-mono text-[10px]" style={{ color: "rgba(251,250,247,0.4)" }}>
                {v.anio}
            </span>
        </div>
        <div className="mt-2.5 flex items-center gap-3">
            <Thumb tone={v.tone} w={62} h={48} radius={9} />
            <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold" style={{ color: PAPER }}>
                    {v.marca} {v.modelo}
                </p>
                <p className="sd-mono text-[10px]" style={{ color: "rgba(251,250,247,0.45)" }}>
                    {v.km}
                </p>
            </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between border-t pt-2" style={{ borderColor: "rgba(251,250,247,0.12)" }}>
            <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.4)" }}>
                Valor
            </span>
            <span className="sd-mono text-[15px] font-semibold" style={{ color: PAPER }}>
                {money(v.precio)}
            </span>
        </div>
    </div>
);

const HeroSwap = () => {
    const reduce = useReducedMotion();
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (reduce) return;
        const id = window.setInterval(() => setCycle((c) => c + 1), 5200);
        return () => window.clearInterval(id);
    }, [reduce]);

    const pair = PAIRS[cycle % PAIRS.length];
    const favor = pair.diff > 0;
    const par = pair.diff === 0;

    return (
        <div key={cycle} className="relative mx-auto w-full max-w-[620px]">
            <div className="sd-stage">
                <svg
                    aria-hidden
                    viewBox="0 0 400 160"
                    className="sd-arrows absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                >
                    <path
                        className="sd-arrow sd-arrow-a"
                        d="M120 44 C 180 6, 220 6, 280 44"
                        fill="none"
                        stroke={GREEN}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        className="sd-arrow sd-arrow-b"
                        d="M280 116 C 220 154, 180 154, 120 116"
                        fill="none"
                        stroke="rgba(251,250,247,0.45)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>

                <HeroCard v={pair.mine} side="l" />
                <HeroCard v={pair.theirs} side="r" />
            </div>

            <div className="mt-5 flex justify-center md:mt-3">
                <span
                    className="sd-pill-diff inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{
                        background: par ? "rgba(251,250,247,0.08)" : favor ? "rgba(97,197,104,0.16)" : "rgba(236,168,81,0.16)",
                        border: `1px solid ${par ? "rgba(251,250,247,0.18)" : favor ? "rgba(97,197,104,0.4)" : "rgba(236,168,81,0.4)"}`,
                    }}
                >
                    <span className="sd-mono sd-caps" style={{ color: par ? "rgba(251,250,247,0.6)" : favor ? GREEN : AMBER }}>
                        {par ? "Cambio par" : favor ? "A tu favor" : "A compensar"}
                    </span>
                    <MoneyTick
                        amount={pair.diff}
                        className="text-[18px] font-semibold"
                    />
                </span>
            </div>
        </div>
    );
};

/* ── Balanza del diferencial (controlada por scroll) ────────────────────── */

const Balanza = () => {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 35%"] });
    const [state, setState] = useState(1);

    useEffect(() => {
        if (reduce) return;
        return scrollYProgress.on("change", (v) => setState(v < 0.36 ? 0 : v < 0.66 ? 1 : 2));
    }, [scrollYProgress, reduce]);

    const STATES = [
        { rot: -7, label: "a tu favor", amount: 2200, bg: SOFT_GREEN, fg: GREEN_DEEP },
        { rot: 0, label: "cambio par", amount: 0, bg: "rgba(14,15,12,0.05)", fg: "rgba(14,15,12,0.55)" },
        { rot: 7, label: "a compensar", amount: -4400, bg: SOFT_AMBER, fg: AMBER_DEEP },
    ];

    const Beam = ({ s, small = false }: { s: (typeof STATES)[number]; small?: boolean }) => (
        <div className={small ? "w-full" : "mx-auto w-full max-w-[560px]"}>
            <div className="relative h-[120px]">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: LINE }} />
                <div
                    className="sd-beam absolute left-1/2 top-[46px] h-[3px] w-[86%] -translate-x-1/2 rounded-full"
                    style={{ background: INK, transform: `translateX(-50%) rotate(${s.rot}deg)` }}
                />
                <div
                    className="sd-pan absolute left-[7%] top-[46px] -translate-x-1/2"
                    style={{ transform: `translate(-50%, ${-Math.tan((s.rot * Math.PI) / 180) * 220}px)` }}
                >
                    <span className="grid h-14 w-14 place-items-center rounded-xl text-[9px] font-semibold text-white" style={{ background: "#2E4A73" }}>
                        Tu unidad
                    </span>
                </div>
                <div
                    className="sd-pan absolute right-[7%] top-[46px] translate-x-1/2"
                    style={{ transform: `translate(50%, ${Math.tan((s.rot * Math.PI) / 180) * 220}px)` }}
                >
                    <span className="grid h-14 w-14 place-items-center rounded-xl text-[9px] font-semibold text-white" style={{ background: "#4A4F52" }}>
                        La suya
                    </span>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: s.bg }}>
                <span className="sd-mono sd-caps" style={{ color: s.fg }}>
                    Diferencial · {s.label}
                </span>
                <span className="sd-mono text-[20px] font-semibold" style={{ color: s.fg }}>
                    {money(s.amount)}
                </span>
            </div>
        </div>
    );

    if (reduce) {
        return (
            <div ref={ref} className="grid gap-6 md:grid-cols-3">
                {STATES.map((s) => (
                    <Beam key={s.label} s={s} small />
                ))}
            </div>
        );
    }

    return (
        <div ref={ref} className="py-4">
            <Beam s={STATES[state]} />
            <div className="mt-6 flex items-center justify-center gap-2">
                {STATES.map((s, i) => (
                    <span
                        key={s.label}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{ width: i === state ? 34 : 14, background: i === state ? INK : "rgba(14,15,12,0.18)" }}
                    />
                ))}
            </div>
        </div>
    );
};

/* ── El eje vertical de «Cómo funciona» ─────────────────────────────────── */

const HOW = [
    {
        side: "l" as const,
        k: "Publicas",
        title: "Una unidad, una sola vez",
        text: "Datos base, valoración y modalidad de venta. Si admite cambio, los criterios de intercambio quedan escritos: marcas, rango de año, kilometraje máximo y condición mínima.",
        node: "wizard",
    },
    {
        side: "r" as const,
        k: "La red responde",
        title: "El motor cruza toda la red",
        text: "Los criterios de tu ficha se comparan contra el inventario del resto de concesionarios. Cada coincidencia vuelve con un score de 0 a 100 y con el diferencial ya calculado.",
        node: "match",
    },
    {
        side: "c" as const,
        k: "Cierran",
        title: "La conversación empieza con la cifra puesta",
        text: "La propuesta viaja a la bandeja del otro dealer con el cálculo desglosado. A partir de ahí, negociación por turnos: contraofertas, historial y estados explícitos de quién debe responder.",
        node: "close",
    },
];

const Landing = () => {
    const reduce = useReducedMotion();
    const axisRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: axisRef, offset: ["start 75%", "end 60%"] });
    const axis = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ═══════════════════ HÉROE ═══════════════════ */}
            <section className="relative overflow-hidden px-4 pt-24 pb-16 md:px-6 md:pt-32 md:pb-24" style={{ background: INK }}>
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(70% 80% at 100% 0%, ${GREEN}40, transparent 62%)` }}
                />
                <span aria-hidden className="absolute inset-0 opacity-[0.06] noise-layer" />

                <div className="relative mx-auto max-w-5xl" style={{ color: PAPER }}>
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className="sd-mono sd-caps inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                            style={{ border: `1px solid ${GREEN}55`, color: GREEN, background: "rgba(97,197,104,0.10)" }}
                        >
                            <span className="sd-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: GREEN, color: GREEN }} />
                            {CAT_SHORT} · {p.year}
                        </span>
                        <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.42)" }}>
                            {p.name}
                        </span>
                    </div>

                    <h1 className="mt-7 max-w-4xl text-[34px] font-semibold leading-[1.06] tracking-[-0.03em] md:text-[64px]">
                        <span className="block">Tu inventario parado</span>
                        <span className="sd-serif block" style={{ color: GREEN }}>
                            es el inventario que otro dealer busca
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-[15px] leading-relaxed md:text-[19px]" style={{ color: "rgba(251,250,247,0.68)" }}>
                        {p.tagline}
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {[
                            ["Categoría", p.category],
                            ["Rol", p.role],
                            ["Estado", p.status],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-xl p-3" style={{ background: "rgba(251,250,247,0.05)", border: "1px solid rgba(251,250,247,0.10)" }}>
                                <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.42)" }}>
                                    {k}
                                </span>
                                <p className="mt-1.5 text-[12px] leading-snug" style={{ color: "rgba(251,250,247,0.85)" }}>
                                    {v}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {p.links.web && (
                            <BrandButton href={p.links.web}>
                                <ArrowRight size={16} /> Abrir la plataforma
                            </BrandButton>
                        )}
                        {p.links.demo && !p.links.web && (
                            <BrandButton href={p.links.demo}>
                                <ArrowRight size={16} /> Ver la demo
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <BrandButton href={p.links.github} variant="outline">
                                Ver el código
                            </BrandButton>
                        )}
                        <a
                            href="#motor"
                            className="sd-mono sd-caps inline-flex items-center gap-2 rounded-full px-4 py-2.5"
                            style={{ border: "1px solid rgba(251,250,247,0.2)", color: "rgba(251,250,247,0.8)" }}
                        >
                            Ver el motor de matches <ArrowRight size={13} />
                        </a>
                        {!p.links.web && !p.links.demo && !p.links.github && (
                            <span className="sd-mono text-[11px]" style={{ color: "rgba(251,250,247,0.4)" }}>
                                Acceso restringido a concesionarios registrados
                            </span>
                        )}
                    </div>

                    {/* El cruce */}
                    <div className="mt-14 md:mt-20">
                        <HeroSwap />
                    </div>
                </div>
            </section>

            {/* ═══════════════════ PROBLEMA / SOLUCIÓN ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <span aria-hidden className="sd-paper absolute inset-0" />
                <div className="relative mx-auto max-w-6xl">
                    <SectionHead
                        index="01 / El punto de partida"
                        title={
                            <>
                                Dos concesionarios con <span className="sd-serif" style={{ color: GREEN_DEEP }}>el vehículo del otro</span> y ninguna forma de saberlo
                            </>
                        }
                    />

                    <div className="relative mt-12 grid gap-8 md:grid-cols-2 md:gap-0">
                        <span
                            aria-hidden
                            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
                            style={{ background: LINE }}
                        />

                        <Reveal direction="right" className="md:pr-10">
                            <div className="rounded-2xl p-6 md:p-8" style={{ background: SOFT_AMBER }}>
                                <Label color={AMBER_DEEP}>Antes · a ciegas</Label>
                                <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.02em] md:text-[26px]">
                                    El cambio ocurría por WhatsApp
                                </h3>
                                <p className="mt-4 text-[14px] leading-relaxed md:text-[15px]" style={{ color: "rgba(14,15,12,0.72)" }}>
                                    {p.problem}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.1} className="md:pl-10">
                            <div className="rounded-2xl p-6 md:p-8" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                                <Label color={GREEN_DEEP}>Después · con la cifra sobre la mesa</Label>
                                <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.02em] md:text-[26px]">
                                    Publicar una vez y dejar que la red cruce
                                </h3>
                                <p className="mt-4 text-[14px] leading-relaxed md:text-[15px]" style={{ color: "rgba(14,15,12,0.72)" }}>
                                    {p.solution}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ CÓMO FUNCIONA · EL EJE ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead index="02 / Cómo funciona" title="Tres movimientos y un eje que no se rompe" />

                    <div ref={axisRef} className="relative mt-14">
                        {/* Eje central */}
                        <span
                            aria-hidden
                            className="absolute left-5 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2"
                            style={{ background: LINE_2 }}
                        />
                        <motion.span
                            aria-hidden
                            className="absolute left-5 top-0 w-px origin-top md:left-1/2 md:-translate-x-1/2"
                            style={{ height: "100%", background: INK, scaleY: reduce ? 1 : axis }}
                        />

                        <div className="space-y-16 md:space-y-24">
                            {HOW.map((h, i) => (
                                <div
                                    key={h.k}
                                    className="relative pl-12 md:grid md:grid-cols-2 md:items-center md:gap-14 md:pl-0"
                                >
                                    <span
                                        aria-hidden
                                        className="absolute left-5 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full md:left-1/2"
                                        style={{ background: h.side === "c" ? GREEN : INK }}
                                    />

                                    <Reveal
                                        direction={h.side === "r" ? "left" : "right"}
                                        className={
                                            h.side === "c"
                                                ? "md:col-span-2 md:text-center"
                                                : h.side === "r"
                                                ? "md:order-2"
                                                : ""
                                        }
                                    >
                                        <div className={h.side === "c" ? "mx-auto max-w-xl" : ""}>
                                            <Label color={h.side === "c" ? GREEN_DEEP : undefined}>
                                                {String(i + 1).padStart(2, "0")} · {h.k}
                                            </Label>
                                            <h3 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em] md:text-[30px]">
                                                {h.title}
                                            </h3>
                                            <p className="mt-3 text-[14px] leading-relaxed md:text-[15px]" style={{ color: "rgba(14,15,12,0.68)" }}>
                                                {h.text}
                                            </p>
                                        </div>
                                    </Reveal>

                                    {h.side !== "c" && (
                                        <Reveal direction={h.side === "r" ? "right" : "left"} delay={0.08}>
                                            {h.node === "wizard" ? (
                                                <div className="sd-card overflow-hidden">
                                                    <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: `1px solid ${LINE}`, background: WARM }}>
                                                        <Car size={12} />
                                                        <span className="sd-mono sd-caps">Asistente de publicación · paso 3</span>
                                                    </div>
                                                    <MockWizard />
                                                </div>
                                            ) : (
                                                <div className="sd-card p-5">
                                                    <div className="flex items-center gap-5">
                                                        <ScoreRing value={92} size={104} stroke={9} />
                                                        <div className="min-w-0 flex-1">
                                                            <CriteriaBars />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <DiffBand amount={-4400} />
                                                    </div>
                                                </div>
                                            )}
                                        </Reveal>
                                    )}

                                    {h.side === "c" && (
                                        <div className="md:col-span-2">
                                            <Reveal className="mt-8 flex justify-center">
                                                <span
                                                    className="sd-beat grid h-16 w-16 place-items-center rounded-full"
                                                    style={{ background: SOFT_GREEN, color: GREEN_DEEP, border: `1px solid ${GREEN}66` }}
                                                >
                                                    <ArrowLeftRight size={22} />
                                                </span>
                                            </Reveal>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ HIGHLIGHTS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: INK, color: PAPER }}>
                <div className="mx-auto max-w-6xl">
                    <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.4)" }}>
                        03 / Lo que sostiene el producto
                    </span>
                    <h2 className="mt-3 max-w-2xl text-[30px] font-semibold leading-tight tracking-[-0.03em] md:text-[46px]">
                        Cinco decisiones que <span className="sd-serif" style={{ color: GREEN }}>hacen confiable</span> el número
                    </h2>

                    <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" stagger={0.07}>
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title} className={i === 4 ? "md:col-span-2" : ""}>
                                    <div
                                        className="group h-full p-6 transition-colors duration-300 md:p-8"
                                        style={{ background: "rgba(251,250,247,0.035)", border: "1px solid rgba(251,250,247,0.09)" }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span
                                                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                                                style={{ background: "rgba(97,197,104,0.14)", color: GREEN }}
                                            >
                                                <Icon size={18} />
                                            </span>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="sd-mono text-[11px]" style={{ color: "rgba(251,250,247,0.3)" }}>
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <h3 className="text-[17px] font-semibold leading-snug md:text-[19px]">{h.title}</h3>
                                                </div>
                                                <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "rgba(251,250,247,0.6)" }}>
                                                    {h.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════════ MOTOR DE MATCHES ═══════════════════ */}
            <section id="motor" className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <span aria-hidden className="sd-paper absolute inset-0" />
                <div className="relative mx-auto max-w-6xl">
                    <SectionHead
                        index="04 / Motor de matches"
                        title={
                            <>
                                El score se dibuja <span className="sd-serif" style={{ color: GREEN_DEEP }}>y se explica</span>
                            </>
                        }
                        lead="Un anillo de 0 a 100, cuatro criterios con su peso y una lista ordenada por probabilidad de cierre. El mismo componente que ve el dealer dentro de la aplicación."
                    />

                    <Reveal className="mt-12">
                        <div className="sd-card grid items-center gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10">
                            <ScoreRing value={92} />
                            <div className="w-full">
                                <CriteriaBars />
                                <p className="mt-5 text-[13px] leading-relaxed" style={{ color: "rgba(14,15,12,0.6)" }}>
                                    El anillo pasa de gris a ámbar al cruzar 70 y de ámbar a verde al cruzar 85. El orden de la
                                    lista se justifica con el desglose: nada de una cifra sin explicación.
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal className="mt-8" delay={0.06}>
                        <BrowserFrame dark={false} url="SwapDealer · Coincidencias">
                            <MockMatches />
                        </BrowserFrame>
                        <p className="sd-mono sd-caps mt-3" style={{ color: "rgba(14,15,12,0.42)" }}>
                            {p.uiScreens[1]?.name}
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════ LA PROPUESTA ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="05 / La propuesta"
                        title="Lo que ofrezco, lo que recibo y lo que falta por pagar"
                        lead="Dos tarjetas idénticas enfrentadas y, debajo, el cálculo abierto. Escribe un monto en efectivo y el desglose automático se atenúa: sigue ahí, como referencia, pero ya no manda."
                    />

                    <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                        <Reveal>
                            <BrowserFrame dark={false} url="SwapDealer · Propuesta">
                                <MockProposal />
                            </BrowserFrame>
                            <p className="sd-mono sd-caps mt-3" style={{ color: "rgba(14,15,12,0.42)" }}>
                                {p.uiScreens[2]?.name} · prueba a escribir un monto
                            </p>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <div className="space-y-4">
                                {[
                                    {
                                        t: "Un mismo número, dos lecturas",
                                        d: "El diferencial que devuelve la API está siempre en la perspectiva de quien propuso. La contraparte lo ve firmado con −1, con su etiqueta y su color: verde a favor, ámbar a compensar.",
                                    },
                                    {
                                        t: "El neto no es el negociado",
                                        d: "El diferencial negociado y el neto —que ya incluye comisión de plataforma del 0,8 % y costo de traspaso— viven en campos distintos y se resuelven en un módulo con pruebas propias.",
                                    },
                                    {
                                        t: "El efectivo manda cuando existe",
                                        d: "Si el dealer escribe un monto, ese importe sustituye por completo al cálculo. Las líneas originales quedan al 50 % de opacidad en lugar de desaparecer.",
                                    },
                                ].map((c) => (
                                    <div key={c.t} className="sd-card p-5">
                                        <h4 className="text-[15px] font-semibold">{c.t}</h4>
                                        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(14,15,12,0.62)" }}>
                                            {c.d}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ LA BALANZA ═══════════════════ */}
            <section className="relative px-4 py-24 md:px-6 md:py-32" style={{ background: WARM, color: INK }}>
                <div className="mx-auto max-w-4xl">
                    <SectionHead
                        index="06 / El diferencial"
                        title={
                            <>
                                Tres estados y <span className="sd-serif" style={{ color: GREEN_DEEP }}>un solo número</span>
                            </>
                        }
                        lead="Baja despacio: la barra bascula según de qué lado cae el valor."
                        align="center"
                    />
                    <div className="mt-14">
                        <Balanza />
                    </div>
                </div>
            </section>

            {/* ═══════════════════ NEGOCIACIÓN POR TURNOS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="07 / Negociación"
                        title="Los botones solo aparecen cuando te toca"
                        lead="Un indicador de turno derivado del dealer que la API marca como pendiente de respuesta. Si le toca al otro, aceptar, contraofertar y rechazar desaparecen y queda un estado de espera con el historial completo debajo."
                    />

                    <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <Reveal>
                            <div className="sd-card p-5 md:p-6">
                                <Stagger className="space-y-3" stagger={0.14}>
                                    {CHAT.map((c, i) => (
                                        <StaggerItem key={i} y={10}>
                                            <div className={`flex ${c.side === "r" ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className="max-w-[85%] rounded-2xl px-3.5 py-2.5"
                                                    style={{
                                                        background: c.side === "r" ? SOFT_GREEN : WARM,
                                                        borderBottomRightRadius: c.side === "r" ? 6 : undefined,
                                                        borderBottomLeftRadius: c.side === "l" ? 6 : undefined,
                                                    }}
                                                >
                                                    <div className="flex items-baseline justify-between gap-4">
                                                        <span className="text-[10px] font-semibold">{c.who}</span>
                                                        <span className="sd-mono text-[9px]" style={{ color: "rgba(14,15,12,0.4)" }}>
                                                            {c.time}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-[12.5px] leading-snug" style={{ color: "rgba(14,15,12,0.75)" }}>
                                                        {c.text}
                                                    </p>
                                                    <p
                                                        className="sd-mono mt-1.5 text-[13px] font-semibold"
                                                        style={{ color: c.side === "r" ? GREEN_DEEP : AMBER_DEEP }}
                                                    >
                                                        {c.monto}
                                                    </p>
                                                </div>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </Stagger>

                                <Reveal delay={0.2} className="mt-4">
                                    <div
                                        className="flex items-center justify-center gap-2 rounded-xl py-3"
                                        style={{ background: SOFT_GREEN, color: GREEN_DEEP }}
                                    >
                                        <span className="inline-block h-2 w-2 rounded-full" style={{ background: GREEN_DEEP }} />
                                        <span className="sd-mono sd-caps">Cambio confirmado</span>
                                    </div>
                                </Reveal>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.08}>
                            <BrowserFrame dark={false} url="SwapDealer · Bandeja">
                                <MockInbox />
                            </BrowserFrame>
                            <p className="sd-mono sd-caps mt-3" style={{ color: "rgba(14,15,12,0.42)" }}>
                                {p.uiScreens[3]?.name} · cambia de pestaña para ver el turno
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ EL PANEL DEL DEALER ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <span aria-hidden className="sd-paper absolute inset-0" />
                <div className="relative mx-auto max-w-6xl">
                    <SectionHead
                        index="08 / El panel"
                        title={
                            <>
                                Todo empieza en <span className="sd-serif" style={{ color: GREEN_DEEP }}>el radar</span>
                            </>
                        }
                        lead="Nueve vistas renderizadas condicionalmente desde un estado currentView, sin rutas de URL. Ésta es la primera."
                    />

                    <Reveal className="mt-12">
                        <BrowserFrame dark={false} url="SwapDealer · Panel">
                            <MockDashboard />
                        </BrowserFrame>
                        <p className="sd-mono sd-caps mt-3" style={{ color: "rgba(14,15,12,0.42)" }}>
                            {p.uiScreens[0]?.name}
                        </p>
                    </Reveal>

                    {p.media.length > 0 && (
                        <div className="mt-12">
                            <Label>Capturas del producto</Label>
                            <DragRail className="mt-4">
                                {p.media.map((m) =>
                                    m.src.endsWith(".mp4") ? (
                                        <AutoVideo key={m.src} src={m.src} className="w-[280px]" />
                                    ) : (
                                        <ShotCard key={m.src} src={m.src} alt={m.caption} caption={m.caption} className="w-[280px]" />
                                    )
                                )}
                            </DragRail>
                        </div>
                    )}
                </div>
            
                    <SampleDataNote className="mt-8" />
                </section>

            {/* ═══════════════════ MARQUESINA ═══════════════════ */}
            <div
                className="sd-mono sd-caps py-5"
                style={{ background: PAPER, color: "rgba(14,15,12,0.4)", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
            >
                <Marquee
                    items={["Solo efectivo", "Solo cambio", "Cambio + efectivo", "Score 0-100", "Diferencial neto", "Comisión 0,8 %", "Negociación por turnos", "Red de concesionarios"]}
                    speed={38}
                    separator="↔"
                />
            </div>

            {/* ═══════════════════ FUNCIONALIDADES ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="09 / Funcionalidades"
                        title={<RevealWords text="Lo que ya está construido, a un lado y otro del eje" />}
                    />

                    <div className="relative mt-12">
                        <span
                            aria-hidden
                            className="absolute left-3 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2"
                            style={{ background: LINE }}
                        />
                        <Stagger className="space-y-2" stagger={0.04}>
                            {p.features.map((f, i) => {
                                const right = i % 2 === 1;
                                return (
                                    <StaggerItem key={f} y={10}>
                                        <div className={`flex ${right ? "md:justify-end" : "md:justify-start"}`}>
                                            <div className={`relative w-full pl-8 md:w-[calc(50%_-_26px)] md:pl-0 ${right ? "md:pl-8" : "md:pr-8 md:text-right"}`}>
                                                <span
                                                    aria-hidden
                                                    className={`absolute top-1/2 hidden h-px w-6 -translate-y-1/2 md:block ${right ? "-left-6" : "-right-6"}`}
                                                    style={{ background: LINE }}
                                                />
                                                <span
                                                    aria-hidden
                                                    className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full md:hidden"
                                                    style={{ background: "rgba(14,15,12,0.25)" }}
                                                />
                                                <div
                                                    className={`sd-row flex items-baseline gap-3 rounded-xl px-4 py-3 ${right ? "" : "md:flex-row-reverse"}`}
                                                    style={{ background: SURFACE, border: `1px solid ${LINE}` }}
                                                >
                                                    <span className="sd-mono shrink-0 text-[10px]" style={{ color: GREEN_DEEP }}>
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="text-[13.5px] leading-snug" style={{ color: "rgba(14,15,12,0.78)" }}>
                                                        {f}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </Stagger>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ ARQUITECTURA ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: INK, color: PAPER }}>
                <div className="mx-auto max-w-5xl">
                    <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.4)" }}>
                        10 / Arquitectura
                    </span>
                    <h2 className="mt-3 max-w-3xl text-[30px] font-semibold leading-tight tracking-[-0.03em] md:text-[44px]">
                        Una capa de integración <span className="sd-serif" style={{ color: GREEN }}>entre el prototipo y la API</span>
                    </h2>

                    <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto]">
                        <Reveal>
                            <p className="text-[14px] leading-[1.85] md:text-[16px]" style={{ color: "rgba(251,250,247,0.72)" }}>
                                {p.architecture}
                            </p>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <div className="space-y-2 md:w-[260px]">
                                {[
                                    { k: "src/app/App.tsx", v: "9 vistas por estado" },
                                    { k: "src/lib/api.ts", v: "fetch tipado + JWT" },
                                    { k: "src/lib/types.ts", v: "espejo de Pydantic" },
                                    { k: "src/lib/proposals.ts", v: "signo del diferencial" },
                                    { k: "src/lib/datetime.ts", v: "UTC → Caracas" },
                                    { k: "src/styles/redesign.css", v: "tokens y clases ds-*" },
                                    { k: "src/app/AdminPanel.tsx", v: "panel de plataforma" },
                                ].map((r, i) => (
                                    <div
                                        key={r.k}
                                        className="rounded-lg px-3 py-2"
                                        style={{
                                            background: "rgba(251,250,247,0.05)",
                                            border: "1px solid rgba(251,250,247,0.09)",
                                            borderLeft: `2px solid ${i < 5 ? GREEN : "rgba(251,250,247,0.2)"}`,
                                        }}
                                    >
                                        <p className="sd-mono text-[11px]" style={{ color: PAPER }}>
                                            {r.k}
                                        </p>
                                        <p className="text-[10px]" style={{ color: "rgba(251,250,247,0.5)" }}>
                                            {r.v}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ RETOS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <span aria-hidden className="sd-paper absolute inset-0" />
                <div className="relative mx-auto max-w-6xl">
                    <SectionHead
                        index="11 / Retos"
                        title={
                            <>
                                Cinco cosas que <span className="sd-serif" style={{ color: GREEN_DEEP }}>hubo que arreglar</span>
                            </>
                        }
                        lead="A la izquierda el problema, a la derecha lo que se hizo. El eje se mantiene."
                    />

                    <div className="mt-12 space-y-4">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="grid overflow-hidden rounded-2xl md:grid-cols-2" style={{ border: `1px solid ${LINE}` }}>
                                    <div className="p-6 md:p-8" style={{ background: SOFT_AMBER }}>
                                        <div className="flex items-center gap-2">
                                            <span className="sd-mono text-[11px]" style={{ color: AMBER_DEEP }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <Label color={AMBER_DEEP}>Problema</Label>
                                        </div>
                                        <p className="mt-3 text-[13.5px] leading-relaxed md:text-[14.5px]" style={{ color: "rgba(14,15,12,0.78)" }}>
                                            {c.problem}
                                        </p>
                                    </div>
                                    <div className="p-6 md:p-8" style={{ background: SURFACE, borderLeft: `1px solid ${LINE}` }}>
                                        <div className="flex items-center gap-2">
                                            <ArrowRight size={13} style={{ color: GREEN_DEEP }} />
                                            <Label color={GREEN_DEEP}>Solución</Label>
                                        </div>
                                        <p className="mt-3 text-[13.5px] leading-relaxed md:text-[14.5px]" style={{ color: "rgba(14,15,12,0.78)" }}>
                                            {c.solution}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ MÉTRICAS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ background: WARM, color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead index="12 / Números" title="El tamaño real del trabajo" />
                    <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
                        {p.metrics.map((m) => (
                            <StaggerItem key={m.label}>
                                <div className="sd-card h-full p-6">
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════════ STACK ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead index="13 / Stack" title="Con qué está construido" />

                    <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
                        {p.stack.map((g) => (
                            <StaggerItem key={g.group}>
                                <div className="sd-card h-full p-5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN_DEEP }} />
                                        <Label>{g.group}</Label>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {g.items.map((it) => (
                                            <span
                                                key={it}
                                                className="rounded-full px-2.5 py-1 text-[11.5px]"
                                                style={{ background: WARM, border: `1px solid ${LINE_2}`, color: "rgba(14,15,12,0.7)" }}
                                            >
                                                {it}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-8 flex flex-wrap gap-2">
                        <Chip>{CAT_SHORT}</Chip>
                        <Chip>{STATE_SHORT}</Chip>
                        <Chip>{p.year}</Chip>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════ RESUMEN ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: PAPER, color: INK }}>
                <div className="mx-auto max-w-3xl">
                    <Label>En resumen</Label>
                    <Stagger className="mt-6 space-y-5" stagger={0.1}>
                        {p.summary.map((s, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={
                                        i === 0
                                            ? "text-[19px] leading-relaxed md:text-[24px] tracking-[-0.01em]"
                                            : "text-[14px] leading-relaxed md:text-[15.5px]"
                                    }
                                    style={{ color: i === 0 ? INK : "rgba(14,15,12,0.66)" }}
                                >
                                    {s}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-10">
                        <div className="rounded-2xl p-5" style={{ background: WARM }}>
                            <Label>Nota de marca</Label>
                            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(14,15,12,0.65)" }}>
                                {p.brand.mood}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════ CIERRE ═══════════════════ */}
            <div
                style={
                    {
                        background: INK,
                        color: PAPER,
                        "--brand-primary": GREEN,
                        "--brand-bg": "#0B0C0A",
                        "--brand-gradient": `linear-gradient(135deg, ${GREEN} 0%, #9BE0A0 100%)`,
                    } as React.CSSProperties & Record<string, string>
                }
            >
                <section className="px-4 pt-24 md:px-6 md:pt-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <Reveal>
                            <span className="sd-mono sd-caps" style={{ color: "rgba(251,250,247,0.4)" }}>
                                El eje se cierra
                            </span>
                            <h2 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.03em] md:text-[46px]">
                                Dos columnas que terminan siendo <span className="sd-serif" style={{ color: GREEN }}>una sola tarjeta</span>
                            </h2>
                            <div
                                className="mx-auto mt-10 max-w-md rounded-2xl p-6"
                                style={{ background: "rgba(97,197,104,0.12)", border: `1px solid ${GREEN}55` }}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <Thumb tone="#2E4A73" w={54} h={40} radius={8} />
                                    <ArrowLeftRight size={16} style={{ color: GREEN }} />
                                    <Thumb tone="#4A4F52" w={54} h={40} radius={8} />
                                </div>
                                <p className="sd-mono sd-caps mt-4" style={{ color: GREEN }}>
                                    Cambio confirmado
                                </p>
                                <p className="sd-mono mt-1 text-[22px] font-semibold" style={{ color: PAPER }}>
                                    {money(-4150)}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                <div className="pb-32">
                    <ProjectOutro
                        name={p.name}
                        links={p.links}
                        nextSlug={nxt.slug}
                        nextName={nxt.name}
                        note="Una plataforma B2B cerrada donde el número que abre la negociación tiene que ser correcto en las dos direcciones. Si necesitas una SPA que hable en serio con una API —sesión resistente, errores traducidos y reglas de negocio con pruebas—, es exactamente el terreno que conozco."
                    />
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
