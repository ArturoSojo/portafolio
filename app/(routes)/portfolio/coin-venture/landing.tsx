"use client"

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    BarChart3,
    ChevronDown,
    CircleDollarSign,
    Coins,
    Eye,
    Github,
    LineChart,
    Lock,
    LogIn,
    LogOut,
    Mail,
    Percent,
    RefreshCw,
    Search,
    Settings,
    ShoppingCart,
    Tags,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import {
    BrandButton,
    Chip,
    CountMetric,
    Magnetic,
    Marquee,
    ProjectOutro,
    SectionHead,
    TiltCard,
} from "@/components/projects/bits";
import { BrowserFrame, DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("coin-venture")!;
const nxt = nextProject("coin-venture");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* ─────────────────────────── Paleta real del proyecto ───────────────────────────
   AppColors: bgPrimary #0B1220 · bgCard #16294F · field #1B315C · primary #27B3FF
   primaryDark #0052FF · success #2ECC71 · danger #FF5B6A · textPrimary #E6ECFF
   textMuted #9BA6C6 · gradiente primaryButton #1BD3FF → #005CFF
   El verde y el rojo NO decoran: sólo marcan la dirección del mercado.
--------------------------------------------------------------------------------- */
const C = {
    bg: "#0B1220",
    card: "#16294F",
    field: "#1B315C",
    bar: "#101C36",
    cyan: "#27B3FF",
    blue: "#0052FF",
    up: "#2ECC71",
    down: "#FF5B6A",
    text: "#E6ECFF",
    muted: "#9BA6C6",
    grad: "linear-gradient(135deg, #1BD3FF 0%, #005CFF 100%)",
};

/* Onda del hero: la misma silueta redondeada que dibuja MiniSparkline.
   Trazada a mano con curvas de periodo 360 para poder desplazarla -720 sin costura. */
const WAVE_UP = "q90,-70 180,0 q90,70 180,0 ";
const WAVE_DOWN = "q90,58 180,0 q90,-58 180,0 ";
const WAVE_A = `M0,196 ${WAVE_UP.repeat(6)}`;
const WAVE_A_FILL = `${WAVE_A} L2160,320 L0,320 Z`;
const WAVE_B = `M0,232 ${WAVE_DOWN.repeat(6)}`;

/* Cinta de precios: los pares que el repositorio filtra como cotización soportada. */
const TAPE = [
    { pair: "BTC/USDT", price: "67.482,10", chg: "+2,41 %", up: true },
    { pair: "ETH/USDT", price: "3.284,55", chg: "+1,08 %", up: true },
    { pair: "BNB/USDT", price: "604,12", chg: "-0,74 %", up: false },
    { pair: "SOL/USDT", price: "172,39", chg: "+4,62 %", up: true },
    { pair: "XRP/USDT", price: "0,5218", chg: "-1,35 %", up: false },
    { pair: "ADA/USDT", price: "0,4471", chg: "+0,92 %", up: true },
    { pair: "DOGE/USDT", price: "0,1284", chg: "-2,18 %", up: false },
    { pair: "AVAX/USDT", price: "34,17", chg: "+3,05 %", up: true },
    { pair: "LINK/USDT", price: "17,62", chg: "+0,46 %", up: true },
    { pair: "TRX/BUSD", price: "0,1622", chg: "-0,31 %", up: false },
    { pair: "DOT/USDC", price: "6,84", chg: "+1,74 %", up: true },
    { pair: "MATIC/FDUSD", price: "0,7031", chg: "-0,88 %", up: false },
];

/* Filas de la tabla de mercados, con la serie de 7 días recortada a 16 puntos. */
const ROWS = [
    { i: 1, sym: "BTC", pair: "BTCUSDT", price: "$67.482,10", chg: "+2,41 %", up: true, cap: "$1,33 B", vol: "$28,4 B", s: [42, 47, 44, 52, 58, 55, 63, 61, 68, 72, 69, 78, 74, 83, 88, 94] },
    { i: 2, sym: "ETH", pair: "ETHUSDT", price: "$3.284,55", chg: "+1,08 %", up: true, cap: "$394,7 M", vol: "$12,9 B", s: [58, 55, 60, 57, 62, 66, 61, 67, 70, 66, 72, 69, 75, 73, 79, 82] },
    { i: 3, sym: "BNB", pair: "BNBUSDT", price: "$604,12", chg: "-0,74 %", up: false, cap: "$88,1 M", vol: "$1,7 B", s: [78, 82, 76, 80, 71, 74, 68, 70, 63, 66, 59, 62, 55, 58, 51, 49] },
    { i: 4, sym: "SOL", pair: "SOLUSDT", price: "$172,39", chg: "+4,62 %", up: true, cap: "$79,4 M", vol: "$3,2 B", s: [30, 36, 33, 41, 38, 47, 44, 55, 51, 62, 58, 70, 66, 79, 86, 96] },
    { i: 5, sym: "XRP", pair: "XRPUSDT", price: "$0,5218", chg: "-1,35 %", up: false, cap: "$29,0 M", vol: "$1,1 B", s: [72, 69, 74, 66, 70, 63, 67, 60, 64, 57, 61, 54, 58, 50, 53, 46] },
    { i: 6, sym: "ADA", pair: "ADAUSDT", price: "$0,4471", chg: "+0,92 %", up: true, cap: "$15,8 M", vol: "$486,2 M", s: [46, 44, 49, 47, 53, 50, 56, 54, 59, 57, 63, 60, 66, 64, 70, 73] },
    { i: 7, sym: "DOGE", pair: "DOGEUSDT", price: "$0,1284", chg: "-2,18 %", up: false, cap: "$18,4 M", vol: "$912,7 M", s: [88, 84, 86, 78, 81, 73, 76, 68, 71, 62, 65, 57, 60, 51, 47, 41] },
    { i: 8, sym: "AVAX", pair: "AVAXUSDT", price: "$34,17", chg: "+3,05 %", up: true, cap: "$13,1 M", vol: "$374,9 M", s: [38, 42, 40, 48, 45, 53, 57, 52, 61, 66, 62, 71, 76, 72, 83, 90] },
];

/* Muro de velas: una vela por dato contable del repositorio. */
const CANDLES = [
    { body: 148, wick: 16 },
    { body: 196, wick: 22 },
    { body: 58, wick: 12 },
    { body: 76, wick: 14 },
    { body: 126, wick: 18 },
    { body: 76, wick: 12 },
    { body: 126, wick: 16 },
    { body: 102, wick: 14 },
    { body: 58, wick: 10 },
    { body: 94, wick: 20 },
    { body: 172, wick: 18 },
];

/* Los seis módulos de features y los tres cortes que los atraviesan. */
const MODULES = ["auth", "markets", "wallet", "trade", "history", "settings"];
const LANES = [
    {
        key: "presentation",
        title: "presentation",
        detail: "bloc · cubit · eventos · estados · páginas",
        cell: "Bloc",
    },
    {
        key: "domain",
        title: "domain",
        detail: "entidades puras · repositorio abstracto · casos de uso invocables",
        cell: "UseCase",
    },
    {
        key: "data",
        title: "data",
        detail: "modelos de mapeo · data sources · impl. que devuelve Either<Failure, T>",
        cell: "DataSrc",
    },
];

const css = `
@keyframes cv-wave-drift {
  from { transform: translateX(0); }
  to { transform: translateX(-720px); }
}
.cv-wave-a { animation: cv-wave-drift 18s linear infinite; }
.cv-wave-b { animation: cv-wave-drift 26s linear infinite reverse; }

@keyframes cv-tape-run {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.cv-tape-track { animation: cv-tape-run 40s linear infinite; }
.cv-tape:hover .cv-tape-track { animation-play-state: paused; }

@keyframes cv-candle-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
.cv-candle {
  transform-origin: bottom center;
  animation: cv-candle-grow 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes cv-pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.7); }
}
.cv-live { animation: cv-pulse-dot 1.6s ease-in-out infinite; }

.cv-num {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.cv-card {
  background: rgba(22, 41, 79, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 28px 70px -30px rgba(0, 0, 0, 0.9);
}
.cv-hair { border: 1px solid rgba(255, 255, 255, 0.12); }
.cv-chip {
  border-radius: 16px;
  background: rgba(27, 49, 92, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 260ms ease;
}
.cv-chip:hover {
  background-image: linear-gradient(135deg, #1BD3FF 0%, #005CFF 100%);
  border-color: rgba(39, 179, 255, 0.6);
  color: #ffffff;
  transform: translateY(-2px);
}
.cv-lane-cell { transition: background 220ms ease, border-color 220ms ease, color 220ms ease; }
.cv-grid-faint {
  background-image:
    linear-gradient(to right, rgba(39, 179, 255, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(39, 179, 255, 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
}
.cv-book-row { transition: background 200ms ease; }
.cv-book-row:hover { background: rgba(39, 179, 255, 0.06); }

@media (prefers-reduced-motion: reduce) {
  .cv-wave-a,
  .cv-wave-b,
  .cv-tape-track,
  .cv-candle,
  .cv-live {
    animation: none !important;
  }
}
`;

/* ─────────────────────────── Utilidades de dibujo ─────────────────────────── */

/** Trazo de la sparkline: mismo criterio que el CustomPainter del proyecto. */
const sparkPath = (vals: number[], w: number, h: number) => {
    let max = vals[0];
    let min = vals[0];
    for (const v of vals) {
        if (v > max) max = v;
        if (v < min) min = v;
    }
    const span = max - min || 1;
    return vals
        .map((v, i) => {
            const x = (i / (vals.length - 1)) * w;
            const y = h - ((v - min) / span) * h;
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
};

const Spark = ({ vals, up, id, w = 96, h = 34 }: { vals: number[]; up: boolean; id: string; w?: number; h?: number }) => {
    const line = sparkPath(vals, w, h);
    const color = up ? C.up : C.down;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="overflow-visible shrink-0">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

/* ─────────────────── Mockups recreados a partir de p.uiScreens ─────────────────── */

const Field = ({
    icon: Icon,
    placeholder,
    trailing,
}: {
    icon: LucideIcon;
    placeholder: string;
    trailing?: React.ReactNode;
}) => (
    <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ background: C.field, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}
    >
        <Icon size={13} style={{ color: C.muted }} />
        <span className="flex-1 text-[10px]" style={{ color: C.muted }}>
            {placeholder}
        </span>
        {trailing}
    </div>
);

/** uiScreens[0] — Login */
const MockLogin = () => (
    <div
        className="flex h-full flex-col items-center justify-center px-4 pt-8 pb-4"
        style={{ background: "linear-gradient(160deg,#0B1220 0%,#0E1F3C 55%,#091225 100%)" }}
    >
        <span
            className="grid place-items-center"
            style={{
                height: 64,
                width: 64,
                borderRadius: 20,
                backgroundImage: C.grad,
                boxShadow: "0 18px 32px -8px rgba(39,179,255,0.55)",
            }}
        >
            <LineChart size={30} color="#fff" />
        </span>
        <p className="mt-4 text-[15px] font-semibold" style={{ color: C.text }}>
            Coin Venture
        </p>
        <p className="mt-1 text-[10px]" style={{ color: C.muted }}>
            Inicia sesión en tu cuenta
        </p>

        <div className="w-full mt-5 cv-card" style={{ borderRadius: 20, padding: 14 }}>
            <div className="space-y-2.5">
                <Field icon={Mail} placeholder="tu@email.com" />
                <Field
                    icon={Lock}
                    placeholder="••••••••"
                    trailing={<Eye size={13} style={{ color: C.muted }} />}
                />
            </div>

            <div
                className="flex items-center justify-center gap-1.5 mt-3.5 py-2.5 text-[11px] font-semibold text-white"
                style={{ backgroundImage: C.grad, borderRadius: 14 }}
            >
                <LogIn size={13} /> Iniciar sesión
            </div>

            <div className="flex items-center gap-2 my-3.5">
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
                <span className="text-[8px]" style={{ color: C.muted }}>
                    O continúa con
                </span>
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>

            <div
                className="py-2.5 text-center text-[11px] font-medium"
                style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 14, color: C.text }}
            >
                Google
            </div>
        </div>

        <p className="mt-4 text-[9px]" style={{ color: C.muted }}>
            ¿No tienes cuenta? <span style={{ color: C.cyan }}>Regístrate</span>
        </p>
    </div>
);

/** uiScreens[1] — Mercados (la pantalla principal, en ventana de navegador) */
const MockMarkets = () => (
    <div className="overflow-x-auto scrollbar-none" style={{ background: C.bg }}>
        <div className="min-w-[760px] p-4">
            {/* barra flotante */}
            <div
                className="flex items-center gap-3 px-3 py-2"
                style={{
                    background: "rgba(16,28,54,0.9)",
                    borderRadius: 28,
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 18px 40px -22px rgba(0,0,0,0.9)",
                }}
            >
                <span className="grid place-items-center shrink-0" style={{ height: 30, width: 30, borderRadius: 10, backgroundImage: C.grad }}>
                    <LineChart size={15} color="#fff" />
                </span>
                <span className="text-[11px] font-semibold shrink-0" style={{ color: C.text }}>
                    Coin Venture
                </span>

                <div className="flex items-center gap-1.5 ml-2">
                    {["Mercados", "Portafolio", "Historial", "Ajustes"].map((tab, i) => (
                        <span
                            key={tab}
                            className="rounded-full px-2.5 py-1 text-[9px] font-medium"
                            style={
                                i === 0
                                    ? { backgroundImage: C.grad, color: "#fff" }
                                    : { background: "rgba(27,49,92,0.5)", color: C.muted }
                            }
                        >
                            {tab}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-auto shrink-0">
                    <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px]"
                        style={{ border: "1px solid rgba(255,255,255,0.16)", color: C.muted }}
                    >
                        <Settings size={10} /> Ajustes
                    </span>
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5"
                        style={{ background: "rgba(27,49,92,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        <span
                            className="grid h-5 w-5 place-items-center rounded-full text-[8px] font-bold text-white"
                            style={{ backgroundImage: C.grad }}
                        >
                            AS
                        </span>
                        <span className="leading-tight">
                            <span className="block text-[8px] font-semibold" style={{ color: C.text }}>
                                Arturo Sojo
                            </span>
                            <span className="block text-[7px]" style={{ color: C.muted }}>
                                dev@epale.chat
                            </span>
                        </span>
                    </span>
                    <span
                        className="grid h-6 w-6 place-items-center rounded-lg"
                        style={{ background: "rgba(27,49,92,0.6)", color: C.muted }}
                    >
                        <LogOut size={11} />
                    </span>
                </div>
            </div>

            {/* encabezado de sección */}
            <div className="flex items-end justify-between gap-3 mt-4">
                <div>
                    <p className="text-[15px] font-semibold" style={{ color: C.text }}>
                        Mercados de Criptomonedas
                    </p>
                    <p className="text-[9px] mt-0.5" style={{ color: C.muted }}>
                        Actualización automática cada 30 segundos
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[9px]"
                    style={{ border: "1px solid rgba(255,255,255,0.16)", color: C.text }}
                >
                    <RefreshCw size={11} style={{ color: C.cyan }} /> Actualizar
                </span>
            </div>

            {/* métricas agregadas */}
            <div className="grid grid-cols-4 gap-2.5 mt-3">
                {[
                    { Icon: CircleDollarSign, label: "Cap. Total", value: "$2,41 B" },
                    { Icon: BarChart3, label: "Vol. 24h", value: "$98,4 B" },
                    { Icon: Percent, label: "BTC Dom.", value: "54,2 %" },
                    { Icon: Coins, label: "Monedas", value: "10" },
                ].map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5 p-2.5 cv-card" style={{ borderRadius: 18 }}>
                        <span
                            className="grid shrink-0 place-items-center"
                            style={{ height: 30, width: 30, borderRadius: 10, background: "rgba(39,179,255,0.15)" }}
                        >
                            <Icon size={14} style={{ color: C.cyan }} />
                        </span>
                        <span>
                            <span className="block text-[8px]" style={{ color: C.muted }}>
                                {label}
                            </span>
                            <span className="cv-num block text-[13px] font-semibold" style={{ color: C.text }}>
                                {value}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            {/* filtros */}
            <div className="flex items-center gap-3 p-2.5 mt-3 cv-card" style={{ borderRadius: 18 }}>
                <span
                    className="flex items-center flex-1 gap-2 px-3 py-2"
                    style={{ background: C.field, borderRadius: 14 }}
                >
                    <Search size={12} style={{ color: C.muted }} />
                    <span className="text-[9px]" style={{ color: C.muted }}>
                        Buscar por nombre o símbolo
                    </span>
                </span>
                <span className="flex gap-1.5">
                    {["Nombre", "Precio", "% 24h", "Volumen 24h"].map((s, i) => (
                        <span
                            key={s}
                            className="px-2.5 py-1.5 text-[9px] font-medium"
                            style={
                                i === 3
                                    ? { backgroundImage: C.grad, borderRadius: 16, border: "1px solid rgba(39,179,255,0.7)", color: "#fff" }
                                    : { background: "rgba(27,49,92,0.6)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", color: C.muted }
                            }
                        >
                            {s}
                        </span>
                    ))}
                </span>
            </div>

            {/* tabla */}
            <div className="p-3 mt-3 cv-card" style={{ borderRadius: 20 }}>
                <div
                    className="grid items-center gap-2 pb-2 text-[8px] uppercase tracking-[0.12em]"
                    style={{ gridTemplateColumns: "20px 1.4fr 1fr 0.8fr 1fr 1fr 110px", color: C.muted }}
                >
                    <span>#</span>
                    <span>Moneda</span>
                    <span className="text-right">Precio</span>
                    <span className="text-right">24h %</span>
                    <span className="text-right">Cap. Mercado</span>
                    <span className="text-right">Volumen</span>
                    <span className="text-right">Últimos 7 días</span>
                </div>

                {ROWS.map((r) => (
                    <div
                        key={r.pair}
                        className="grid items-center gap-2 py-2"
                        style={{
                            gridTemplateColumns: "20px 1.4fr 1fr 0.8fr 1fr 1fr 110px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span className="cv-num text-[9px]" style={{ color: C.muted }}>
                            {r.i}
                        </span>
                        <span className="leading-tight">
                            <span className="block text-[11px] font-semibold" style={{ color: C.text }}>
                                {r.sym}
                            </span>
                            <span className="block text-[8px]" style={{ color: C.muted }}>
                                {r.pair}
                            </span>
                        </span>
                        <span className="cv-num text-right text-[10px] font-semibold" style={{ color: C.text }}>
                            {r.price}
                        </span>
                        <span className="flex justify-end">
                            <span
                                className="cv-num rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
                                style={{
                                    background: r.up ? "rgba(46,204,113,0.12)" : "rgba(255,91,106,0.12)",
                                    color: r.up ? C.up : C.down,
                                }}
                            >
                                {r.chg}
                            </span>
                        </span>
                        <span className="cv-num text-right text-[9px]" style={{ color: C.muted }}>
                            {r.cap}
                        </span>
                        <span className="cv-num text-right text-[9px]" style={{ color: C.muted }}>
                            {r.vol}
                        </span>
                        <span className="flex justify-end">
                            <Spark vals={r.s} up={r.up} id={`cv-spark-${r.sym}`} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** uiScreens[2] — Detalle de activo y trading */
const MockAsset = () => {
    const line = sparkPath([28, 34, 31, 39, 45, 41, 50, 56, 52, 61, 68, 64, 73, 80, 76, 88], 240, 74);
    return (
        <div
            className="flex h-full flex-col gap-1 overflow-hidden px-3 pt-8 pb-2"
            style={{ background: "linear-gradient(165deg,#0B1220 0%,#0E1F3C 60%,#091225 100%)" }}
        >
            {/* cabecera del activo */}
            <div className="flex items-center gap-2.5 p-2.5 cv-card" style={{ borderRadius: 18 }}>
                <span
                    className="grid place-items-center text-[10px] font-bold text-white shrink-0"
                    style={{ height: 38, width: 38, borderRadius: 13, backgroundImage: C.grad }}
                >
                    BTC
                </span>
                <span className="leading-tight">
                    <span className="block text-[14px] font-semibold" style={{ color: C.text }}>
                        BTCUSDT
                    </span>
                    <span className="block text-[9px]" style={{ color: C.muted }}>
                        Datos en vivo y trading
                    </span>
                </span>
            </div>

            {/* precio */}
            <div className="p-2.5 cv-card" style={{ borderRadius: 18 }}>
                <p className="text-[9px]" style={{ color: C.muted }}>
                    Precio actual
                </p>
                <p className="cv-num text-[19px] font-semibold leading-tight" style={{ color: C.text }}>
                    $67.482,10
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span
                        className="cv-num rounded-full px-2 py-0.5 text-[9px] font-semibold"
                        style={{ background: "rgba(46,204,113,0.18)", color: C.up }}
                    >
                        +2,41 %
                    </span>
                    <span className="cv-num text-[8px]" style={{ color: C.muted }}>
                        Rango 24h: $65.910,00 — $68.204,55
                    </span>
                </div>
            </div>

            {/* gráfico 1 h */}
            <div className="p-2.5 cv-card" style={{ borderRadius: 18 }}>
                <p className="text-[10px] font-semibold" style={{ color: C.text }}>
                    Gráfico de precio (1h)
                </p>
                <div
                    className="mt-1.5 overflow-hidden"
                    style={{ height: 54, borderRadius: 16, background: "rgba(27,49,92,0.6)" }}
                >
                    <svg viewBox="0 0 240 74" preserveAspectRatio="none" className="w-full" style={{ height: 54 }}>
                        <defs>
                            <linearGradient id="cv-asset-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={C.up} stopOpacity="0.35" />
                                <stop offset="100%" stopColor={C.up} stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        <path d={`${line} L240,74 L0,74 Z`} fill="url(#cv-asset-fill)" />
                        <path d={line} fill="none" stroke={C.up} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* estadísticas */}
            <div className="p-2.5 cv-card" style={{ borderRadius: 18 }}>
                <p className="text-[10px] font-semibold" style={{ color: C.text }}>
                    Estadísticas del activo
                </p>
                <div className="mt-1">
                    {[
                        ["Cap. Mercado", "$1,33 B"],
                        ["Volumen 24h", "$28,4 B"],
                        ["Precio Apertura", "$65.894,20"],
                        ["Dominio estimado", "54,2 %"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between py-px">
                            <span className="text-[9px]" style={{ color: C.muted }}>
                                {k}
                            </span>
                            <span className="cv-num text-[9px] font-semibold" style={{ color: C.text }}>
                                {v}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* trading */}
            <div className="p-2.5 cv-card" style={{ borderRadius: 18 }}>
                <p className="text-[10px] font-semibold" style={{ color: C.text }}>
                    Trading
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <span
                        className="py-1.5 text-center text-[10px] font-semibold text-white"
                        style={{ borderRadius: 14, backgroundImage: "linear-gradient(135deg,#2ECC71,#1E8F52)" }}
                    >
                        Comprar
                    </span>
                    <span
                        className="py-1.5 text-center text-[10px] font-medium"
                        style={{ borderRadius: 14, background: "rgba(27,49,92,0.6)", color: C.muted }}
                    >
                        Vender
                    </span>
                </div>
                <div
                    className="mt-1.5 px-3 py-1.5 text-[10px]"
                    style={{ background: C.field, borderRadius: 14, color: C.text }}
                >
                    <span className="cv-num">0,0125</span>
                    <span className="ml-1 text-[8px]" style={{ color: C.muted }}>
                        BTC
                    </span>
                </div>
                <div className="mt-1">
                    {[
                        ["Precio", "$67.482,10"],
                        ["Total", "$843,53"],
                        ["Disponible", "$4.120,00 USDT"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between py-px">
                            <span className="text-[9px]" style={{ color: C.muted }}>
                                {k}
                            </span>
                            <span className="cv-num text-[9px] font-semibold" style={{ color: C.text }}>
                                {v}
                            </span>
                        </div>
                    ))}
                </div>
                <div
                    className="mt-1.5 flex items-center justify-center gap-1.5 py-2 text-[10px] font-semibold text-white"
                    style={{ borderRadius: 14, backgroundImage: C.grad }}
                >
                    <ShoppingCart size={12} /> Comprar
                </div>
            </div>
        </div>
    );
};

/** uiScreens[3] — Portafolio */
const MockPortfolio = () => (
    <div
        className="flex h-full flex-col gap-2.5 overflow-hidden px-3 pt-8 pb-3"
        style={{ background: "linear-gradient(165deg,#0B1220 0%,#0E1F3C 60%,#091225 100%)" }}
    >
        <div
            className="p-3.5"
            style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "linear-gradient(135deg, rgba(39,179,255,0.18) 0%, rgba(22,41,79,0.9) 70%)",
                boxShadow: "0 26px 60px -30px rgba(0,0,0,0.9)",
            }}
        >
            <p className="text-[15px] font-semibold" style={{ color: C.text }}>
                Mi Portafolio
            </p>
            <p className="text-[9px] mt-0.5" style={{ color: C.muted }}>
                Resumen de tus activos y balance
            </p>
            <p className="cv-num mt-3 text-[24px] font-semibold leading-none" style={{ color: "#fff" }}>
                $12.480,35
            </p>

            <div className="grid grid-cols-3 gap-1.5 mt-3">
                {[
                    { Icon: Coins, label: "Activos", value: "4" },
                    { Icon: CircleDollarSign, label: "Activo mayor", value: "BTC" },
                    { Icon: BarChart3, label: "Diversificación", value: "Diversificado" },
                ].map(({ Icon, label, value }) => (
                    <span
                        key={label}
                        className="flex flex-col gap-1.5 p-2"
                        style={{ borderRadius: 18, background: "rgba(27,49,92,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        <span
                            className="grid place-items-center"
                            style={{ height: 26, width: 26, borderRadius: 9, background: "rgba(39,179,255,0.12)" }}
                        >
                            <Icon size={12} style={{ color: C.cyan }} />
                        </span>
                        <span className="block text-[7px] leading-tight" style={{ color: C.muted }}>
                            {label}
                        </span>
                        <span className="block text-[9px] font-semibold leading-tight" style={{ color: C.text }}>
                            {value}
                        </span>
                    </span>
                ))}
            </div>
        </div>

        <div className="flex-1 p-3 cv-card" style={{ borderRadius: 20 }}>
            <p className="text-[10px] font-semibold" style={{ color: C.text }}>
                Balances
            </p>
            <div className="mt-2 space-y-2.5">
                {[
                    { sym: "BTC", qty: "0,14203", pct: 62.4 },
                    { sym: "ETH", qty: "1,85040", pct: 21.1 },
                    { sym: "USDT", qty: "1.240,00", pct: 9.9 },
                    { sym: "SOL", qty: "12,4010", pct: 6.6 },
                ].map((b) => (
                    <div key={b.sym}>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span
                                    className="grid place-items-center text-[8px] font-bold text-white"
                                    style={{ height: 22, width: 22, borderRadius: 8, backgroundImage: C.grad }}
                                >
                                    {b.sym.slice(0, 1)}
                                </span>
                                <span className="text-[10px] font-semibold" style={{ color: C.text }}>
                                    {b.sym}
                                </span>
                            </span>
                            <span className="text-right leading-tight">
                                <span className="cv-num block text-[10px] font-semibold" style={{ color: C.text }}>
                                    {b.qty}
                                </span>
                                <span className="cv-num block text-[8px]" style={{ color: C.muted }}>
                                    {String(b.pct).replace(".", ",")} %
                                </span>
                            </span>
                        </div>
                        <span
                            className="block mt-1.5 h-1 w-full overflow-hidden"
                            style={{ borderRadius: 99, background: "rgba(27,49,92,0.8)" }}
                        >
                            <span
                                className="block h-full"
                                style={{ width: `${b.pct}%`, backgroundImage: C.grad, borderRadius: 99 }}
                            />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** uiScreens[4] — Historial de operaciones */
const MockHistory = () => (
    <div
        className="flex h-full flex-col gap-2.5 overflow-hidden px-3 pt-8 pb-3"
        style={{ background: "linear-gradient(165deg,#0B1220 0%,#0E1F3C 60%,#091225 100%)" }}
    >
        <div className="p-3 cv-card" style={{ borderRadius: 20 }}>
            <p className="text-[13px] font-semibold" style={{ color: C.text }}>
                Historial de operaciones
            </p>
            <p className="text-[9px] mt-0.5" style={{ color: C.muted }}>
                Registro completo de tus transacciones
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                    { label: "Operaciones", value: "18", Icon: Icons.History },
                    { label: "Compras", value: "11", Icon: Icons.ArrowDownLeft },
                    { label: "Ventas", value: "7", Icon: Icons.ArrowUpRight },
                ].map(({ label, value, Icon }) => (
                    <span key={label} className="flex flex-col items-center gap-1">
                        <span
                            className="grid place-items-center rounded-full"
                            style={{ height: 26, width: 26, background: "rgba(39,179,255,0.14)" }}
                        >
                            <Icon size={12} style={{ color: C.cyan }} />
                        </span>
                        <span className="cv-num text-[12px] font-semibold" style={{ color: C.text }}>
                            {value}
                        </span>
                        <span className="text-[7px]" style={{ color: C.muted }}>
                            {label}
                        </span>
                    </span>
                ))}
            </div>
        </div>

        <div className="p-3 cv-card" style={{ borderRadius: 20 }}>
            {[
                { pair: "BTCUSDT", side: "Compra", qty: "0,01250", price: "$67.482,10", total: "$843,53", up: true },
                { pair: "SOLUSDT", side: "Compra", qty: "4,20000", price: "$172,39", total: "$724,04", up: true },
                { pair: "ETHUSDT", side: "Venta", qty: "0,40000", price: "$3.284,55", total: "$1.313,82", up: false },
                { pair: "ADAUSDT", side: "Compra", qty: "820,0000", price: "$0,4471", total: "$366,62", up: true },
                { pair: "XRPUSDT", side: "Venta", qty: "500,0000", price: "$0,5218", total: "$260,90", up: false },
            ].map((t, i) => (
                <div
                    key={t.pair}
                    className="flex items-center justify-between py-2"
                    style={i === 0 ? undefined : { borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <span className="leading-tight">
                        <span className="block text-[10px] font-semibold" style={{ color: C.text }}>
                            {t.pair}
                        </span>
                        <span className="block text-[8px] font-semibold" style={{ color: t.up ? C.up : C.down }}>
                            {t.side} · <span className="cv-num">{t.qty}</span>
                        </span>
                    </span>
                    <span className="text-right leading-tight">
                        <span className="cv-num block text-[10px] font-semibold" style={{ color: C.text }}>
                            {t.total}
                        </span>
                        <span className="cv-num block text-[8px]" style={{ color: C.muted }}>
                            {t.price}
                        </span>
                    </span>
                </div>
            ))}
        </div>

        <div
            className="flex flex-col items-center justify-center flex-1 gap-1.5 px-4 py-5 text-center"
            style={{ borderRadius: 20, border: "1px dashed rgba(255,255,255,0.12)", background: "rgba(22,41,79,0.4)" }}
        >
            <Icons.ClockAlert size={26} style={{ color: C.muted }} />
            <p className="text-[10px] font-semibold" style={{ color: C.text }}>
                Sin transacciones aún
            </p>
            <p className="text-[8px]" style={{ color: C.muted }}>
                Comienza a operar para ver tu historial aquí
            </p>
        </div>
    </div>
);

/* ─────────────────────────── Piezas de la landing ─────────────────────────── */

/** La cinta de precios: 56 px, duplicada en el DOM, se pausa al pasar el cursor. */
const PriceTape = () => (
    <div
        className="cv-tape relative flex h-14 items-center overflow-hidden select-none"
        style={{
            background: "rgba(16,28,54,0.9)",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
    >
        <div className="cv-tape-track flex w-max shrink-0">
            {[...TAPE, ...TAPE].map((t, i) => (
                <span key={`${t.pair}-${i}`} className="flex items-center gap-2 px-5 whitespace-nowrap">
                    <span className="text-[11px] font-semibold tracking-wide" style={{ color: C.text }}>
                        {t.pair}
                    </span>
                    <span className="cv-num text-[11px]" style={{ color: C.muted }}>
                        {t.price}
                    </span>
                    <span
                        className="cv-num rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                            background: t.up ? "rgba(46,204,113,0.12)" : "rgba(255,91,106,0.12)",
                            color: t.up ? C.up : C.down,
                        }}
                    >
                        {t.chg}
                    </span>
                </span>
            ))}
        </div>
    </div>
);

/** Muro de velas: cada dato contable del repositorio es una vela que crece al entrar. */
const CandleWall = () => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.25);

    return (
        <div ref={ref} className="overflow-x-auto scrollbar-none">
            <div className="min-w-[880px] px-1">
                <div className="flex items-end gap-3" style={{ height: 240 }}>
                    {p.metrics.map((m, i) => {
                        const c = CANDLES[i] ?? CANDLES[0];
                        return (
                            <div key={m.label} className="flex flex-col items-center justify-end flex-1">
                                <span className="cv-num mb-2 text-[13px] font-semibold" style={{ color: C.text }}>
                                    {m.value}
                                </span>
                                <span
                                    className={`flex w-full flex-col items-center ${inView ? "cv-candle" : ""}`}
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <span style={{ width: 2, height: c.wick, background: "rgba(39,179,255,0.55)" }} />
                                    <span
                                        className="w-full"
                                        style={{
                                            height: c.body,
                                            borderRadius: 6,
                                            backgroundImage: "linear-gradient(180deg, #1BD3FF 0%, #005CFF 100%)",
                                            boxShadow: "0 0 24px -6px rgba(39,179,255,0.7)",
                                        }}
                                    />
                                    <span style={{ width: 2, height: Math.round(c.wick * 0.6), background: "rgba(39,179,255,0.35)" }} />
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3 pt-3 mt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    {p.metrics.map((m) => (
                        <span key={m.label} className="flex-1 text-[9px] leading-snug" style={{ color: C.muted }}>
                            {m.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

/** Diagrama de carriles: presentation → domain → data, atravesados por seis módulos. */
const LaneDiagram = () => {
    const [lane, setLane] = useState<number | null>(null);
    const [mod, setMod] = useState<number | null>(null);

    return (
        <div className="overflow-x-auto scrollbar-none">
            <div className="min-w-[660px]">
                <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: "132px repeat(6, minmax(0, 1fr))" }}
                >
                    <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: C.muted }}>
                        features/
                    </span>
                    {MODULES.map((m, mi) => (
                        <button
                            key={m}
                            type="button"
                            onMouseEnter={() => setMod(mi)}
                            onMouseLeave={() => setMod(null)}
                            className="cv-lane-cell py-1.5 text-center text-[11px] font-semibold"
                            style={{
                                borderRadius: 12,
                                color: mod === mi ? "#fff" : C.text,
                                background: mod === mi ? "rgba(39,179,255,0.22)" : "transparent",
                            }}
                        >
                            {m}
                        </button>
                    ))}

                    {LANES.map((l, li) => (
                        <div key={l.key} className="contents">
                            <button
                                type="button"
                                onMouseEnter={() => setLane(li)}
                                onMouseLeave={() => setLane(null)}
                                className="cv-lane-cell mt-2 px-3 py-3 text-left"
                                style={{
                                    borderRadius: 16,
                                    border: `1px solid ${lane === li ? "rgba(39,179,255,0.7)" : "rgba(255,255,255,0.12)"}`,
                                    background: lane === li ? "rgba(39,179,255,0.14)" : "rgba(27,49,92,0.45)",
                                }}
                            >
                                <span
                                    className="block text-[12px] font-semibold"
                                    style={{ color: lane === li ? C.cyan : C.text }}
                                >
                                    {l.title}
                                </span>
                            </button>

                            {MODULES.map((m, mi) => {
                                const hot = lane === li || mod === mi;
                                return (
                                    <span
                                        key={`${l.key}-${m}`}
                                        className="cv-lane-cell mt-2 grid place-items-center py-3 text-[10px] font-medium"
                                        style={{
                                            borderRadius: 14,
                                            border: `1px solid ${hot ? "rgba(39,179,255,0.55)" : "rgba(255,255,255,0.08)"}`,
                                            background: hot ? "rgba(39,179,255,0.16)" : "rgba(22,41,79,0.55)",
                                            color: hot ? C.cyan : C.muted,
                                        }}
                                    >
                                        {l.cell}
                                    </span>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <p className="mt-4 text-[11px] leading-relaxed" style={{ color: C.muted }}>
                    {LANES[lane ?? 1].detail}
                </p>
            </div>
        </div>
    );
};

/** Reto técnico: el problema en gris, la solución revelada en blanco al expandir. */
const ChallengeRow = ({
    index,
    problem,
    solution,
    open,
    onToggle,
}: {
    index: number;
    problem: string;
    solution: string;
    open: boolean;
    onToggle: () => void;
}) => (
    <div
        className="overflow-hidden"
        style={{
            borderRadius: 20,
            border: `1px solid ${open ? "rgba(39,179,255,0.45)" : "rgba(255,255,255,0.12)"}`,
            background: open ? "rgba(22,41,79,0.85)" : "rgba(22,41,79,0.45)",
            transition: "border-color 300ms ease, background 300ms ease",
        }}
    >
        <button type="button" onClick={onToggle} className="flex w-full items-start gap-3 p-5 text-left md:p-6">
            <span
                className="cv-num shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold"
                style={{ background: "rgba(39,179,255,0.14)", color: C.cyan }}
            >
                {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm leading-relaxed md:text-base" style={{ color: open ? C.text : C.muted }}>
                {problem}
            </span>
            <ChevronDown
                size={18}
                className="shrink-0 mt-0.5 transition-transform duration-300"
                style={{ color: C.cyan, transform: open ? "rotate(180deg)" : "none" }}
            />
        </button>

        {open && (
            <div
                className="px-5 pb-5 md:px-6 md:pb-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 }}
            >
                <p className="mb-2 text-[10px] uppercase tracking-[0.24em]" style={{ color: C.cyan }}>
                    Solución
                </p>
                <p className="text-sm leading-relaxed md:text-base" style={{ color: "#fff" }}>
                    {solution}
                </p>
            </div>
        )}
    </div>
);

/* ─────────────────────────────── La landing ─────────────────────────────── */

const Landing = () => {
    const reduce = useReducedMotion();
    const [openChallenge, setOpenChallenge] = useState(0);

    const screens = [
        { name: p.uiScreens[0]?.name ?? "Login", node: <MockLogin /> },
        { name: p.uiScreens[2]?.name ?? "Detalle", node: <MockAsset /> },
        { name: p.uiScreens[3]?.name ?? "Portafolio", node: <MockPortfolio /> },
        { name: p.uiScreens[4]?.name ?? "Historial", node: <MockHistory /> },
    ];

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ══════════════════════════ HERO ══════════════════════════ */}
            <section
                className="relative overflow-hidden px-4 pt-28 pb-16 md:px-6 md:pt-36 md:pb-20"
                style={{ background: "linear-gradient(150deg,#0B1220 0%,#0E1F3C 52%,#091225 100%)" }}
            >
                <div aria-hidden className="absolute inset-0 cv-grid-faint opacity-60" />
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[560px]"
                    style={{
                        background:
                            "radial-gradient(58% 60% at 50% 0%, rgba(39,179,255,0.22), transparent 72%), radial-gradient(40% 46% at 88% 12%, rgba(0,82,255,0.20), transparent 72%)",
                    }}
                />

                {/* la onda: mismo trazo redondeado y relleno 35 %→5 % del MiniSparkline */}
                <svg
                    aria-hidden
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 w-full h-[300px] md:h-[360px]"
                >
                    <defs>
                        <linearGradient id="cv-hero-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    <g className="cv-wave-b">
                        <path d={WAVE_B} fill="none" stroke="#1BD3FF" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    <g className="cv-wave-a">
                        <path d={WAVE_A_FILL} fill="url(#cv-hero-fill)" />
                        <path d={WAVE_A} fill="none" stroke={C.cyan} strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                </svg>

                <div className="relative max-w-5xl mx-auto">
                    <span
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em]"
                        style={{ background: "rgba(39,179,255,0.12)", border: "1px solid rgba(39,179,255,0.35)", color: C.cyan }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full cv-live" style={{ background: C.up }} />
                        Binance · ticker/24hr en vivo
                    </span>

                    <h1
                        className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight md:text-8xl"
                        style={{
                            backgroundImage: C.grad,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        {p.name}
                    </h1>

                    <p className="max-w-2xl mt-6 text-base leading-relaxed md:text-xl" style={{ color: C.muted }}>
                        {p.tagline}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-8">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                        <Chip>{p.status}</Chip>
                    </div>

                    <p className="max-w-2xl mt-5 text-[13px] leading-relaxed" style={{ color: C.muted }}>
                        <span style={{ color: C.cyan }}>Rol · </span>
                        {p.role}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-9">
                        {p.links.github && (
                            <Magnetic>
                                <BrandButton href={p.links.github}>
                                    <Github size={16} /> Ver el repositorio
                                </BrandButton>
                            </Magnetic>
                        )}
                        <BrandButton href="#cv-arquitectura" variant="outline">
                            <Icons.Layers size={16} /> Cómo está montado
                        </BrandButton>
                    </div>
                </div>
            </section>

            {/* ══════════════════ CINTA DE PRECIOS ══════════════════ */}
            <PriceTape />

            {/* ══════════════════════ RESUMEN ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-4xl mx-auto">
                    <span className="block mb-4 text-xs font-mono uppercase tracking-[0.4em]" style={{ color: C.muted }}>
                        00 / La sesión
                    </span>
                    <RevealWords
                        text={p.summary[0]}
                        className="block text-xl font-medium leading-relaxed md:text-3xl"
                    />

                    <Stagger className="mt-10 space-y-5">
                        {p.summary.slice(1).map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className="pl-5 text-sm leading-relaxed md:text-base"
                                    style={{ borderLeft: "2px solid rgba(39,179,255,0.35)", color: C.muted }}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════ PROBLEMA / SOLUCIÓN ═══════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="01 / El descuadre"
                        title={
                            <>
                                Tres frentes que <span className="brand-gradient-text">rara vez conviven</span>
                            </>
                        }
                    />

                    <div className="grid gap-6 mt-12 lg:grid-cols-2">
                        <Reveal direction="right">
                            <div
                                className="h-full p-6 md:p-9"
                                style={{
                                    borderRadius: 24,
                                    border: "1px solid rgba(255,91,106,0.28)",
                                    background: "rgba(22,41,79,0.55)",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full" style={{ background: C.down }} />
                                    <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: C.down }}>
                                        El problema
                                    </p>
                                </div>
                                <p className="mt-5 text-sm leading-relaxed md:text-base" style={{ color: C.muted }}>
                                    {p.problem}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <div
                                className="h-full p-6 md:p-9"
                                style={{
                                    borderRadius: 24,
                                    border: "1px solid rgba(39,179,255,0.4)",
                                    background: "linear-gradient(150deg, rgba(39,179,255,0.12) 0%, rgba(22,41,79,0.85) 65%)",
                                    boxShadow: "0 34px 80px -40px rgba(39,179,255,0.6)",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full" style={{ background: C.up }} />
                                    <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: C.cyan }}>
                                        La solución
                                    </p>
                                </div>
                                <p className="mt-5 text-sm leading-relaxed md:text-base" style={{ color: C.text }}>
                                    {p.solution}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ HIGHLIGHTS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / El motor"
                        title={
                            <>
                                Seis piezas que sostienen <span className="brand-gradient-text">el precio</span>
                            </>
                        }
                        lead="Datos que llegan solos, saldos que no se descuadran y una única base de código para seis plataformas."
                    />

                    <Stagger className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <TiltCard intensity={5} className="h-full">
                                        <div
                                            className="relative h-full p-6 overflow-hidden group"
                                            style={{
                                                borderRadius: 24,
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                background: "rgba(22,41,79,0.6)",
                                            }}
                                        >
                                            <span
                                                aria-hidden
                                                className="absolute inset-x-0 top-0 h-px transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                                style={{ background: "linear-gradient(90deg, transparent, #27B3FF, transparent)" }}
                                            />
                                            <span
                                                className="inline-grid place-items-center"
                                                style={{ height: 44, width: 44, borderRadius: 14, background: "rgba(39,179,255,0.15)" }}
                                            >
                                                <Icon size={19} style={{ color: C.cyan }} />
                                            </span>
                                            <h3 className="mt-5 text-base font-semibold" style={{ color: C.text }}>
                                                {h.title}
                                            </h3>
                                            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: C.muted }}>
                                                {h.description}
                                            </p>
                                        </div>
                                    </TiltCard>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ═════════════════ MURO DE VELAS (métricas) ═════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-0 cv-grid-faint opacity-40" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / El muro de velas"
                        title={
                            <>
                                El repositorio, <span className="brand-gradient-text">cotizado</span>
                            </>
                        }
                        lead="Cada cifra contable del proyecto dibujada como una vela: cuerpo, mecha y una escala que sólo mide código."
                    />

                    <Reveal className="mt-12">
                        <div className="p-5 cv-card md:p-8">
                            <div className="grid grid-cols-2 gap-6 pb-8 mb-8 md:grid-cols-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                {p.metrics.slice(0, 4).map((m) => (
                                    <CountMetric key={m.label} value={m.value} label={m.label} />
                                ))}
                            </div>
                            <CandleWall />
                        </div>
                    </Reveal>

                    <p className="mt-6 text-[11px]" style={{ color: C.muted }}>
                        Arrastra en horizontal para recorrer las once velas.
                    </p>
                </div>
            </section>

            {/* ═══════════════════ PANTALLAS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / Las pantallas"
                        title={
                            <>
                                La sala de trading, <span className="brand-gradient-text">recreada</span>
                            </>
                        }
                        lead="Reconstrucción en HTML y CSS de las pantallas reales: mismos colores, misma disposición, mismos textos."
                    />

                    <Reveal className="mt-12">
                        <BrowserFrame url="coin-venture · /home/markets">
                            <MockMarkets />
                        </BrowserFrame>
                        <p className="mt-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: C.muted }}>
                            {p.uiScreens[1]?.name} — tabla en vivo con sparkline de 168 velas por par
                        </p>
                    </Reveal>

                    <div className="mt-16">
                        <DragRail className="px-1 py-4">
                            {screens.map((s) => (
                                <div key={s.name} className="w-[300px] shrink-0">
                                    <PhoneFrame glow={false}>{s.node}</PhoneFrame>
                                    <p
                                        className="mt-4 text-[11px] uppercase tracking-[0.18em] text-center"
                                        style={{ color: C.muted }}
                                    >
                                        {s.name}
                                    </p>
                                </div>
                            ))}
                        </DragRail>
                        <p className="mt-2 text-[11px]" style={{ color: C.muted }}>
                            {reduce ? "Desliza" : "Arrastra"} para ver las cuatro pantallas móviles.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═════════════════ FUNCIONALIDADES (libro de órdenes) ═════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="05 / Funcionalidades"
                        title={
                            <>
                                El libro de <span className="brand-gradient-text">lo que ya funciona</span>
                            </>
                        }
                        lead="Dieciséis niveles de profundidad, listados como los pinta la app: índice, peso y descripción."
                    />

                    <div className="mt-12 overflow-hidden cv-card">
                        <div
                            className="grid gap-3 px-4 py-3 text-[9px] uppercase tracking-[0.16em] md:px-6"
                            style={{ gridTemplateColumns: "34px 1fr 64px", color: C.muted, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                        >
                            <span>#</span>
                            <span>Función</span>
                            <span className="text-right">Peso</span>
                        </div>

                        <Stagger stagger={0.04}>
                            {p.features.map((f, i) => {
                                const depth = ((i * 37) % 58) + 34;
                                return (
                                    <StaggerItem key={f} y={10}>
                                        <div
                                            className="cv-book-row relative grid items-center gap-3 px-4 py-3 md:px-6"
                                            style={{
                                                gridTemplateColumns: "34px 1fr 64px",
                                                borderBottom: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            <span
                                                aria-hidden
                                                className="absolute inset-y-0 right-0 pointer-events-none"
                                                style={{
                                                    width: `${depth}%`,
                                                    background: "linear-gradient(90deg, transparent, rgba(39,179,255,0.12))",
                                                }}
                                            />
                                            <span className="cv-num relative text-[11px]" style={{ color: C.cyan }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="relative text-[13px] leading-relaxed md:text-sm" style={{ color: C.text }}>
                                                {f}
                                            </span>
                                            <span className="cv-num relative text-right text-[10px]" style={{ color: C.muted }}>
                                                {depth},0
                                            </span>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </Stagger>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ ARQUITECTURA ═══════════════════ */}
            <section id="cv-arquitectura" className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / Arquitectura"
                        title={
                            <>
                                Tres carriles, <span className="brand-gradient-text">seis módulos</span>
                            </>
                        }
                        lead="Pasa el cursor por un carril o por un módulo: la intersección es exactamente el archivo que existe en el repositorio."
                    />

                    <Reveal className="mt-12">
                        <div className="p-5 cv-card md:p-8">
                            <LaneDiagram />
                        </div>
                    </Reveal>

                    <div className="grid gap-6 mt-8 lg:grid-cols-[1.6fr_1fr]">
                        <Reveal>
                            <div
                                className="h-full p-6 md:p-8"
                                style={{ borderRadius: 24, background: "rgba(22,41,79,0.5)", borderLeft: `2px solid ${C.cyan}` }}
                            >
                                <p className="text-[10px] uppercase tracking-[0.28em] mb-4" style={{ color: C.cyan }}>
                                    lib/ al completo
                                </p>
                                <p className="text-sm leading-relaxed md:text-[15px]" style={{ color: C.muted }}>
                                    {p.architecture}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <div className="h-full p-6 cv-card md:p-7">
                                <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: C.cyan }}>
                                    Firestore
                                </p>
                                <pre
                                    className="mt-4 overflow-x-auto text-[11px] leading-relaxed"
                                    style={{ color: C.text, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
                                >
{`users/{uid}
├─ balances { BTC, ETH, USDT… }
├─ settings { perfil, idioma… }
├─ transactions/
│    └─ {orderId}
└─ orders/
     └─ {orderId}`}
                                </pre>
                                <p className="mt-5 text-[12px] leading-relaxed" style={{ color: C.muted }}>
                                    Balance, transacción y orden se escriben en el mismo commit de
                                    <span style={{ color: C.cyan }}> runTransaction</span>. Si algo falla, nada se aplica.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ RETOS ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="07 / Retos técnicos"
                        title={
                            <>
                                Seis cosas que <span className="brand-gradient-text">costaron</span>
                            </>
                        }
                        lead="Toca cada fila para ver cómo se resolvió."
                    />

                    <div className="mt-12 space-y-3">
                        {p.challenges.map((c, i) => (
                            <Reveal key={c.problem.slice(0, 24)} delay={i * 0.05}>
                                <ChallengeRow
                                    index={i}
                                    problem={c.problem}
                                    solution={c.solution}
                                    open={openChallenge === i}
                                    onToggle={() => setOpenChallenge(openChallenge === i ? -1 : i)}
                                />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ STACK ═══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="08 / Stack"
                        title={
                            <>
                                Los chips de <span className="brand-gradient-text">la barra de orden</span>
                            </>
                        }
                        lead="Cada dependencia con la misma forma que los filtros de la tabla de mercados."
                    />

                    <div className="grid gap-5 mt-12 md:grid-cols-2">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.05}>
                                <div className="h-full p-6 cv-card">
                                    <div className="flex items-center gap-2">
                                        <Tags size={14} style={{ color: C.cyan }} />
                                        <p className="text-[10px] uppercase tracking-[0.26em]" style={{ color: C.cyan }}>
                                            {group.group}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="cv-chip px-3 py-1.5 text-[12px]"
                                                style={{ color: C.text }}
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

            {/* ═══════════════ CINTA DE PLATAFORMAS ═══════════════ */}
            <div
                className="py-5 text-[11px] uppercase tracking-[0.24em]"
                style={{
                    color: C.muted,
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(16,28,54,0.6)",
                }}
            >
                <Marquee
                    items={["Android", "iOS", "Web", "macOS", "Windows", "Linux", "Un solo código"]}
                    speed={30}
                    separator="◆"
                />
            </div>

            {/* ═══════════════════ CIERRE ═══════════════════ */}
            <div className="relative pb-32 overflow-hidden">
                <svg
                    aria-hidden
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 top-0 w-full h-[280px]"
                    style={{ transform: "scaleY(-1)", opacity: 0.7 }}
                >
                    <defs>
                        <linearGradient id="cv-outro-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.28" />
                            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.04" />
                        </linearGradient>
                    </defs>
                    <g className="cv-wave-a">
                        <path d={WAVE_A_FILL} fill="url(#cv-outro-fill)" />
                        <path d={WAVE_A} fill="none" stroke={C.cyan} strokeOpacity="0.32" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                    <g className="cv-wave-b">
                        <path d={WAVE_B} fill="none" stroke="#1BD3FF" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
                    </g>
                </svg>

                <div className="relative">
                    <ProjectOutro
                        name={p.name}
                        links={p.links}
                        nextSlug={nxt.slug}
                        nextName={nxt.name}
                        note="Precios reales de Binance, saldos que se mueven sólo dentro de una transacción y un mismo código corriendo en seis plataformas. Si tu producto necesita datos de mercado en vivo o un motor de saldos que no se descuadre, es terreno conocido."
                    />

                    <div className="flex justify-center">
                        <a
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] transition-opacity"
                            style={{ color: C.muted }}
                        >
                            Cerrar la sesión de mercado <ArrowRight size={13} />
                        </a>
                    </div>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
