"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowDown,
    ArrowRight,
    AtSign,
    Bot,
    CircleAlert,
    ClipboardList,
    Construction,
    Eye,
    FileText,
    Hourglass,
    LayoutDashboard,
    Lock,
    LogOut,
    Package,
    Receipt,
    Snowflake,
    Sun,
    Thermometer,
    Truck,
    UserRound,
    Users,
    Waves,
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
} from "@/components/projects/bits";
import { BrowserFrame, DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("sistema-cavas")!;
const nxt = nextProject("sistema-cavas");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* ─────────────────────────── Datos de escenografía ───────────────────────────
   Rótulos y textos de tránsito; todo el contenido factual sale de `p`.        */

/** Zonas térmicas del recorrido: el termómetro del margen las va marcando. */
const ZONES = [
    { code: "CAVA-1", temp: "−18,0 °C", label: "Núcleo operativo", from: 0 },
    { code: "TUNEL-1", temp: "−35,0 °C", label: "Arquitectura dura", from: 0.17 },
    { code: "CAVA-2", temp: "0 a 4 °C", label: "Pantallas reales", from: 0.45 },
    { code: "ANTESALA", temp: "8 a 12 °C", label: "Métricas y plan", from: 0.66 },
    { code: "MUELLE", temp: "26 °C", label: "Temperatura ambiente", from: 0.89 },
];

/** Las tres fallas concretas del sistema anterior, escritas como partes de avería. */
const FAULTS = [
    {
        code: "AVERÍA 01",
        title: "El PDF que nunca salió",
        line: "La nota de recepción no se emitía en PDF con la dirección completa del cliente.",
        note: "Es la razón por la que el dueño pagó la aplicación anterior.",
    },
    {
        code: "AVERÍA 02",
        title: "La nota de entrega sin IVA",
        line: "No había forma de emitir el documento sin IVA que exige el negocio.",
        note: "Sin ese papel no se despacha mercancía de la cava.",
    },
    {
        code: "AVERÍA 03",
        title: "El estado vivía en una cabeza",
        line: "El avance real de cada trabajo no estaba en el sistema, sino en la memoria de alguien.",
        note: "Nadie podía decir, al kilo, qué tiene cada cliente y desde cuándo.",
    },
];

/** Lo que haría una Cloud Function ↔ lo que lo sustituye en plan Spark. */
const COMPENSATIONS = [
    { from: "Trigger onCreate / onUpdate", to: "Reglas que validan lo que validaría el trigger" },
    { from: "Numeración correlativa en servidor", to: "Transacción y bloques de correlativo reservados" },
    { from: "Custom claims con el rol", to: "Rol en usuarios/{uid}, leído con un solo get()" },
    { from: "Cron nocturno de cómputos", to: "Cómputo en el cliente al abrir la pantalla" },
    { from: "Render de PDF remoto", to: "PDF generado en el propio dispositivo" },
    { from: "Admin SDK corriendo en servidor", to: "Scripts Node ESM ejecutados a mano" },
];

/** Reglas de contraste que el código repite en comentarios. */
const PALETTE = [
    { hex: "#0E4C5A", name: "Teal profundo", use: "Primario · botones y acentos" },
    { hex: "#14707A", name: "Teal medio", use: "Secundario · decorativo" },
    { hex: "#5EC1BC", name: "Cresta de onda", use: "Trazo superior del logo" },
    { hex: "#1B3F4A", name: "Onda profunda", use: "Trazo inferior del logo" },
    { hex: "#F49021", name: "Naranja del sol", use: "Terciario · sólo con texto #2B1400" },
    { hex: "#FFC15E", name: "Centro del sol", use: "Degradado radial del disco" },
];

/** Ondas del logo, tal como las pinta el CustomPainter de la app. */
const WAVES = [
    { y: 100, w: 7.0, color: "#5EC1BC", op: 1, amp: 5.2 },
    { y: 110, w: 6.2, color: "#4BB0B4", op: 0.92, amp: 4.7 },
    { y: 120, w: 5.4, color: "#3C97A6", op: 0.84, amp: 4.2 },
    { y: 130, w: 4.6, color: "#2E7E8C", op: 0.74, amp: 3.7 },
    { y: 140, w: 3.8, color: "#245F71", op: 0.64, amp: 3.2 },
    { y: 150, w: 3.2, color: "#1B3F4A", op: 0.55, amp: 2.8 },
];

/** Trazo de onda determinista: dos senos superpuestos, sin aleatoriedad. */
const wavePath = (baseY: number, amp: number, phase: number) => {
    const points: string[] = [];
    for (let x = 0; x <= 480; x += 8) {
        const y =
            baseY +
            amp * Math.sin((x / 120) * Math.PI * 2 + phase) +
            amp * 0.45 * Math.sin((x / 60) * Math.PI * 2 + phase * 1.7);
        points.push(`${x},${y.toFixed(2)}`);
    }
    return `M${points.join(" L")}`;
};

/** Escarcha: posiciones fijas, nada de Math.random en el render. */
const FROST_SPOTS = [
    { x: 90, y: 210, a: -6, s: 1.25 },
    { x: 280, y: 130, a: 14, s: 0.85 },
    { x: 470, y: 250, a: -22, s: 1.05 },
    { x: 660, y: 150, a: 8, s: 0.7 },
    { x: 840, y: 260, a: -14, s: 1.15 },
    { x: 1030, y: 170, a: 20, s: 0.9 },
    { x: 180, y: 470, a: 168, s: 0.95 },
    { x: 560, y: 520, a: 190, s: 1.1 },
    { x: 950, y: 500, a: 174, s: 0.8 },
];

const css = `
.cav-root { color: var(--brand-text); }
.cav-title { font-family: "Sora", "Urbanist", ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.025em; }
.cav-num { font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }
.cav-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }

/* ── Superficie fría: hielo en las dos esquinas superiores, se funde al pasar el cursor ── */
.cav-card {
  position: relative;
  overflow: hidden;
  background: #16242A;
  border: 1px solid #2B3F46;
  transition: border-color 320ms ease, transform 320ms ease;
}
.cav-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 1;
  transition: opacity 320ms ease;
  background:
    radial-gradient(62% 58% at 0% 0%, rgba(255, 255, 255, 0.08), transparent 64%),
    radial-gradient(62% 58% at 100% 0%, rgba(255, 255, 255, 0.08), transparent 64%);
}
.cav-card:hover { border-color: #6FD3E0; }
.cav-card:hover::before { opacity: 0; }
.cav-drop {
  position: absolute;
  top: 10px;
  right: 16px;
  width: 5px;
  height: 7px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: rgba(111, 211, 224, 0.85);
  opacity: 0;
  pointer-events: none;
}
.cav-card:hover .cav-drop { animation: cav-drip 1100ms ease-in 1 forwards; }
@keyframes cav-drip {
  0% { transform: translateY(0); opacity: 0; }
  18% { opacity: 0.9; }
  100% { transform: translateY(12px); opacity: 0; }
}

/* ── Puerta de cava ── */
.cav-leaf {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.4%;
  background:
    linear-gradient(180deg, #1D3038 0%, #16242A 42%, #101B20 100%);
  border-top: 2px solid #2B3F46;
  border-bottom: 2px solid #2B3F46;
  box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.6);
}
.cav-leaf-l { left: 0; border-right: 3px solid #0A1418; }
.cav-leaf-r { right: 0; border-left: 3px solid #0A1418; }
.cav-gasket {
  position: absolute;
  inset: 10px;
  border: 10px solid rgba(6, 12, 14, 0.85);
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
.cav-rivets {
  position: absolute;
  inset: 26px;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0 1.4px, transparent 1.8px);
  background-size: 46px 46px;
  background-position: 0 0;
  opacity: 0.35;
  mask-image: linear-gradient(90deg, #000 0 14px, transparent 14px calc(100% - 14px), #000 calc(100% - 14px) 100%);
  -webkit-mask-image: linear-gradient(90deg, #000 0 14px, transparent 14px calc(100% - 14px), #000 calc(100% - 14px) 100%);
}
.cav-handle {
  position: absolute;
  top: 50%;
  height: 15px;
  border-radius: 8px;
  background: linear-gradient(180deg, #C8D6D9 0%, #7E9298 38%, #46585E 62%, #A9BBC0 100%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.55);
}
.cav-vapor {
  position: absolute;
  inset-inline: -10%;
  height: 46%;
  filter: blur(18px);
  background: radial-gradient(60% 100% at 50% 40%, rgba(220, 245, 250, 0.55), transparent 72%);
  opacity: 0;
  pointer-events: none;
}
.cav-vapor-a { top: 26%; animation: cav-vapor 1400ms ease-out 820ms 1 both; }
.cav-vapor-b { top: 44%; animation: cav-vapor 1400ms ease-out 980ms 1 both; }
@keyframes cav-vapor {
  0% { opacity: 0; transform: translateY(-16px) scaleY(0.85); }
  45% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(90px) scaleY(1.25); }
}

/* ── Logo animado: el sol sube y las ondas ondulan ── */
.cav-sun-rise { animation: cav-sunrise 1800ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes cav-sunrise {
  from { transform: translateY(73px); }
  to { transform: translateY(0); }
}
.cav-wave { animation: cav-wave 6s linear infinite; }
@keyframes cav-wave {
  from { transform: translateX(0); }
  to { transform: translateX(-120px); }
}

/* ── Diagrama de compensaciones ── */
.cav-flow path.cav-arrow {
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
}
.cav-flow.cav-on path.cav-arrow { animation: cav-draw 900ms ease-out forwards; }
@keyframes cav-draw { to { stroke-dashoffset: 0; } }

/* ── Tubería de la línea de fases ── */
.cav-pipe-done {
  background: linear-gradient(90deg, #6FD3E0, #14707A);
  box-shadow: 0 0 18px rgba(111, 211, 224, 0.35);
}
.cav-pipe-todo { background: #2B3F46; }
.cav-pulse { animation: cav-pulse 2.6s ease-in-out infinite; }
@keyframes cav-pulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.25); }
}

/* ── Termómetro guía ── */
.cav-tube {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.04));
  border: 1px solid #2B3F46;
}
.cav-scale {
  background-image: linear-gradient(to bottom, #2B3F46 0 1px, transparent 1px 100%);
  background-size: 100% 40px;
}

/* ── Cinta de estado del hero ── */
.cav-dot { box-shadow: 0 0 0 0 rgba(111, 211, 224, 0.6); animation: cav-ping 2.2s ease-out infinite; }
@keyframes cav-ping {
  0% { box-shadow: 0 0 0 0 rgba(111, 211, 224, 0.55); }
  70% { box-shadow: 0 0 0 9px rgba(111, 211, 224, 0); }
  100% { box-shadow: 0 0 0 0 rgba(111, 211, 224, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .cav-sun-rise,
  .cav-wave,
  .cav-vapor-a,
  .cav-vapor-b,
  .cav-pulse,
  .cav-dot,
  .cav-card:hover .cav-drop,
  .cav-flow.cav-on path.cav-arrow { animation: none !important; }
  .cav-flow path.cav-arrow { stroke-dashoffset: 0 !important; }
  .cav-vapor-a, .cav-vapor-b { display: none; }
}
`;

/* ───────────────────────────── Piezas de escenografía ───────────────────────────── */

/** La marca de MarSaLe, redibujada como la pinta el CustomPainter de la app. */
const MarSaLeMark = ({ className, still = false }: { className?: string; still?: boolean }) => (
    <svg viewBox="0 0 240 173" className={className} role="img" aria-label="Marca de Inversiones MarSaLe">
        <defs>
            <radialGradient id="cav-sun-fill" cx="50%" cy="42%" r="62%">
                <stop offset="0%" stopColor="#FFC15E" />
                <stop offset="100%" stopColor="#F49021" />
            </radialGradient>
            <clipPath id="cav-horizon">
                <rect x="0" y="0" width="240" height="108" />
            </clipPath>
        </defs>

        <g clipPath="url(#cav-horizon)">
            <g className={still ? undefined : "cav-sun-rise"}>
                <circle cx="120" cy="52" r="73" fill="#F49021" opacity="0.28" />
                <circle cx="120" cy="52" r="57.6" fill="url(#cav-sun-fill)" />
            </g>
        </g>

        {WAVES.map((w, i) => (
            <g key={w.y} className={still ? undefined : "cav-wave"} style={{ animationDelay: `${-i * 0.5}s` }}>
                <path
                    d={wavePath(w.y, w.amp, i * 0.5)}
                    stroke={w.color}
                    strokeWidth={w.w}
                    strokeLinecap="round"
                    fill="none"
                    opacity={w.op}
                />
            </g>
        ))}
    </svg>
);

/** Rama dendrítica de escarcha. */
const FrostBranch = ({ x, y, a, s }: { x: number; y: number; a: number; s: number }) => (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
        <line x1="0" y1="4" x2="0" y2="-64" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
            const yy = -8 - i * 10;
            const len = 19 - i * 2.4;
            return (
                <g key={i}>
                    <line x1="0" y1={yy} x2={len} y2={yy - len * 0.8} stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
                    <line x1="0" y1={yy} x2={-len} y2={yy - len * 0.8} stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
                    <line
                        x1={len * 0.55}
                        y1={yy - len * 0.44}
                        x2={len * 0.55 + 6}
                        y2={yy - len * 0.44 - 5.5}
                        stroke="#FFFFFF"
                        strokeWidth="0.55"
                        strokeLinecap="round"
                    />
                    <line
                        x1={-len * 0.55}
                        y1={yy - len * 0.44}
                        x2={-len * 0.55 - 6}
                        y2={yy - len * 0.44 - 5.5}
                        stroke="#FFFFFF"
                        strokeWidth="0.55"
                        strokeLinecap="round"
                    />
                </g>
            );
        })}
    </g>
);

/** Capa de escarcha completa. La opacidad baja a medida que la página se descongela. */
const FrostLayer = ({ opacity }: { opacity: number }) => (
    <svg
        aria-hidden
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full transition-opacity duration-700"
        style={{ opacity }}
    >
        {FROST_SPOTS.map((f) => (
            <FrostBranch key={`${f.x}-${f.y}`} x={f.x} y={f.y} a={f.a} s={f.s} />
        ))}
    </svg>
);

/** Termómetro fijo del margen: marca en qué zona térmica va el lector. */
const ThermoRail = ({ onZone }: { onZone: (index: number) => void }) => {
    const { scrollYProgress } = useScroll();
    const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
    const height = useTransform(smooth, [0, 1], ["2%", "100%"]);
    const [zone, setZone] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        let next = 0;
        for (let i = 0; i < ZONES.length; i += 1) if (v >= ZONES[i].from) next = i;
        setZone((prev) => (prev === next ? prev : next));
    });

    useEffect(() => {
        onZone(zone);
    }, [zone, onZone]);

    const current = ZONES[zone];

    return (
        <div className="fixed z-40 hidden -translate-y-1/2 left-5 top-1/2 xl:block">
            <div className="flex items-end gap-3">
                <div className="relative">
                    <div className="cav-tube relative h-[280px] w-[6px] overflow-hidden rounded-full">
                        <div aria-hidden className="cav-scale absolute inset-0 opacity-70" />
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 rounded-full"
                            style={{
                                height,
                                backgroundImage: "linear-gradient(to top, #F49021, #14707A 55%, #6FD3E0)",
                            }}
                        />
                    </div>
                    <div className="mx-auto -mt-1 h-4 w-4 rounded-full border border-[#2B3F46] bg-[#F49021]" />
                </div>

                <motion.div
                    key={current.code}
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.28 }}
                    className="mb-4 rounded-md border border-[#2B3F46] bg-[#16242A]/90 px-2.5 py-2 backdrop-blur"
                >
                    <p className="cav-mono text-[9px] uppercase tracking-[0.22em] text-[#6FD3E0]">{current.code}</p>
                    <p className="cav-num mt-0.5 text-[13px] font-semibold">{current.temp}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] opacity-45">{current.label}</p>
                </motion.div>
            </div>
        </div>
    );
};

/** Rótulo de zona al principio de cada bloque. */
const ZoneTag = ({ code, temp, note }: { code: string; temp: string; note?: string }) => (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-[#2B3F46] bg-[#16242A]/70 px-3 py-1.5">
        <Thermometer size={13} className="text-[#6FD3E0]" />
        <span className="cav-mono text-[10px] uppercase tracking-[0.22em] text-[#6FD3E0]">{code}</span>
        <span className="cav-num text-[11px] font-semibold opacity-85">{temp}</span>
        {note && <span className="hidden text-[10px] uppercase tracking-[0.16em] opacity-40 sm:inline">{note}</span>}
    </div>
);

/* ───────────────────────── Mockups recreados en CSS ───────────────────────── */

const MARINE = "linear-gradient(180deg, #2A5A68 0%, #1B3F4A 55%, #0A2029 100%)";

/** Splash: el sol sale detrás de las ondas. */
const MockSplash = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ backgroundImage: MARINE }}>
        <MarSaLeMark className="w-[150px]" />
        <p className="cav-title mt-5 text-[15px] font-semibold text-white">Inversiones MarSaLe</p>
        <div className="mt-7 h-[3px] w-[86px] overflow-hidden rounded-full bg-white/18">
            <div className="h-full w-2/5 rounded-full bg-[#F49021]" />
        </div>
    </div>
);

/** Login: tarjeta blanca sobre el mar. */
const MockLogin = () => (
    <div className="absolute inset-0 overflow-hidden px-4 pt-9 pb-4" style={{ backgroundImage: MARINE }}>
        <div className="flex flex-col items-center">
            <MarSaLeMark className="w-[118px]" />
            <p className="cav-title mt-2 text-[14px] font-bold text-white">Inversiones MarSaLe</p>
            <p className="mt-1 text-[8px] text-white/72" style={{ letterSpacing: "0.09em" }}>
                Sistema de cavas y procesos
            </p>
        </div>

        <div className="mt-4 rounded-[10px] border border-[#D3E3E7] bg-white p-3">
            <p className="cav-title text-[12px] font-bold text-[#0B1F24]">Iniciar sesión</p>

            <div className="mt-2.5 flex items-center gap-1.5 rounded-[8px] border border-[#C7D8DC] bg-white px-2 py-1.5">
                <AtSign size={10} className="text-[#5A7076]" />
                <span className="text-[8px] text-[#0B1F24]">operaciones@marsale.com.ve</span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 rounded-[8px] border-2 border-[#0E4C5A] bg-white px-2 py-1.5">
                <Lock size={10} className="text-[#0E4C5A]" />
                <span className="text-[9px] tracking-[0.28em] text-[#0B1F24]">••••••••</span>
                <Eye size={10} className="ml-auto text-[#5A7076]" />
            </div>

            <div className="mt-2 flex items-start gap-1.5 rounded-[8px] bg-[#F9DEDC] px-2 py-1.5">
                <CircleAlert size={10} className="mt-px shrink-0 text-[#B3261E]" />
                <span className="text-[8px] leading-snug text-[#410E0B]">Correo o contraseña incorrectos.</span>
            </div>

            <div className="mt-2.5 grid h-[26px] place-items-center rounded-[8px] bg-[#0E4C5A]">
                <span className="text-[9px] font-semibold text-white">Entrar</span>
            </div>
            <p className="mt-1.5 text-center text-[8px] text-[#0E4C5A]">Olvidé mi contraseña</p>
        </div>

        <p className="mt-3 text-center text-[7px] text-white/55">
            RIF J-40776405-5 · Empresa Procesadora de Alimentos
        </p>
    </div>
);

interface Palette {
    bg: string;
    card: string;
    border: string;
    text: string;
    muted: string;
    nav: string;
    pill: string;
    onPill: string;
}

const LIGHT: Palette = {
    bg: "#F2F8F9",
    card: "#FFFFFF",
    border: "#D3E3E7",
    text: "#0B1F24",
    muted: "#5A7076",
    nav: "#F1F7F8",
    pill: "#C3EAEF",
    onPill: "#00313B",
};

const DARK: Palette = {
    bg: "#081113",
    card: "#16242A",
    border: "#2B3F46",
    text: "#E2F0F3",
    muted: "#8FA9AF",
    nav: "#0E1A1E",
    pill: "#00313B",
    onPill: "#C3EAEF",
};

const KPIS = [
    { label: "Kilos en cava", color: "#0E4C5A", Icon: Snowflake },
    { label: "Recepciones hoy", color: "#14707A", Icon: Truck },
    { label: "Órdenes en proceso", color: "#8A4A00", Icon: Bot },
    { label: "Por cobrar", color: "#0E4C5A", Icon: Receipt },
];

/** Panel: saludo, cuatro indicadores en guion y una advertencia honesta. */
const MockPanel = ({ t }: { t: Palette }) => (
    <div className="absolute inset-0 overflow-hidden px-3 pt-9 pb-3" style={{ background: t.bg, color: t.text }}>
        <p className="text-[8px]" style={{ color: t.muted }}>
            Buenas tardes,
        </p>
        <p className="cav-title text-[15px] font-bold">Andrés Marcano</p>

        <div className="grid grid-cols-2 gap-2 mt-3">
            {KPIS.map((k) => (
                <div
                    key={k.label}
                    className="rounded-[10px] p-2"
                    style={{ background: t.card, border: `1px solid ${t.border}` }}
                >
                    <span
                        className="grid h-[18px] w-[18px] place-items-center rounded-[5px]"
                        style={{ background: `${k.color}1F`, color: k.color }}
                    >
                        <k.Icon size={11} />
                    </span>
                    <p className="cav-title cav-num mt-2 text-[17px] font-bold leading-none">—</p>
                    <p className="mt-1 text-[7px] leading-tight" style={{ color: t.muted }}>
                        {k.label}
                    </p>
                </div>
            ))}
        </div>

        <div
            className="mt-3 flex items-start gap-2 rounded-[10px] p-2"
            style={{ background: t.card, border: `1px solid ${t.border}` }}
        >
            <Construction size={12} style={{ color: t.muted }} className="mt-px shrink-0" />
            <p className="text-[7px] leading-snug" style={{ color: t.muted }}>
                Los indicadores se llenan a partir de la Fase 1, cuando entren las primeras recepciones.
            </p>
        </div>
    </div>
);

const NAV = [
    { label: "Panel", Icon: LayoutDashboard },
    { label: "Recepción", Icon: Truck },
    { label: "Inventario", Icon: Package },
    { label: "Procesos", Icon: Bot },
    { label: "Clientes", Icon: Users },
];

/** Cascarón adaptativo en el teléfono de planta: barra inferior y menú de usuario. */
const MockShell = ({ t }: { t: Palette }) => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: t.bg, color: t.text }}>
        <div className="flex items-center justify-between px-3 pt-9 pb-2" style={{ background: t.bg }}>
            <p className="cav-title text-[11px] font-semibold">Inversiones MarSaLe</p>
            <span
                className="grid h-[20px] w-[20px] place-items-center rounded-full text-[7px] font-bold"
                style={{ background: "#C3EAEF", color: "#00313B" }}
            >
                AM
            </span>
        </div>

        <div
            className="absolute right-3 top-[62px] w-[112px] rounded-[8px] p-2 shadow-lg"
            style={{ background: t.card, border: `1px solid ${t.border}` }}
        >
            <p className="text-[8px] font-semibold">Andrés Marcano</p>
            <p className="text-[7px]" style={{ color: t.muted }}>
                Gerente de planta
            </p>
            <div className="my-1.5 h-px" style={{ background: t.border }} />
            <p className="flex items-center gap-1 text-[7px]">
                <LogOut size={8} /> Cerrar sesión
            </p>
        </div>

        <div className="absolute inset-x-0 top-[46%] flex -translate-y-1/2 flex-col items-center px-6 text-center">
            <Hourglass size={26} style={{ color: t.muted }} />
            <p className="cav-title mt-2 text-[12px] font-semibold">Inventario</p>
            <p className="mt-1 text-[7px]" style={{ color: t.muted }}>
                Esta sección se construye en la Fase 2.
            </p>
        </div>

        <div
            className="absolute inset-x-0 bottom-0 flex h-[42px] items-center justify-around px-1"
            style={{ background: t.nav, borderTop: `1px solid ${t.border}` }}
        >
            {NAV.map((n, i) => (
                <span key={n.label} className="flex flex-col items-center gap-0.5">
                    <span
                        className="grid h-[15px] w-[26px] place-items-center rounded-full"
                        style={i === 2 ? { background: t.pill, color: t.onPill } : { color: t.muted }}
                    >
                        <n.Icon size={10} />
                    </span>
                    <span className="text-[6px]" style={{ color: i === 2 ? t.text : t.muted }}>
                        {n.label}
                    </span>
                </span>
            ))}
        </div>
    </div>
);

/** Crea tu contraseña: el primer ingreso obligatorio. */
const MockPassword = ({ t }: { t: Palette }) => (
    <div className="absolute inset-0 overflow-hidden px-4 pt-9" style={{ background: t.bg, color: t.text }}>
        <p className="cav-title text-[12px] font-semibold">Crea tu contraseña</p>

        <p className="mt-3 text-[8px] leading-snug" style={{ color: t.muted }}>
            Entraste con una contraseña temporal. Elige una propia para continuar.
        </p>

        <div className="mt-4">
            <div
                className="flex items-center gap-1.5 rounded-[8px] px-2 py-1.5"
                style={{ background: t.card, border: "2px solid #0E4C5A" }}
            >
                <Lock size={10} className="text-[#0E4C5A]" />
                <span className="text-[9px] tracking-[0.28em]">••••••••</span>
            </div>
            <p className="mt-1 text-[7px]" style={{ color: t.muted }}>
                Mínimo 8 caracteres
            </p>
        </div>

        <div className="mt-3">
            <div
                className="flex items-center gap-1.5 rounded-[8px] px-2 py-1.5"
                style={{ background: t.card, border: `1px solid ${t.border}` }}
            >
                <Lock size={10} style={{ color: t.muted }} />
                <span className="text-[9px] tracking-[0.28em]">•••••</span>
            </div>
            <p className="mt-1 text-[7px] text-[#B3261E]">Las contraseñas no coinciden</p>
        </div>

        <div className="mt-5 grid h-[26px] place-items-center rounded-[8px] bg-[#0E4C5A]">
            <span className="text-[9px] font-semibold text-white">Guardar y continuar</span>
        </div>
        <p className="mt-2 text-center text-[8px]" style={{ color: t.muted }}>
            Cerrar sesión
        </p>
    </div>
);

const DESK_NAV = [
    { label: "Panel", Icon: LayoutDashboard },
    { label: "Recepción", Icon: Truck },
    { label: "Inventario", Icon: Package },
    { label: "Procesos", Icon: Bot },
    { label: "Clientes", Icon: Users },
    { label: "Documentos", Icon: FileText },
    { label: "Personal", Icon: ClipboardList },
    { label: "Usuarios", Icon: UserRound },
];

/** El mismo cascarón en la PC de oficina: rail extendido a 208 px con etiquetas. */
const MockDesk = ({ t }: { t: Palette }) => (
    <div className="flex min-h-[300px] text-[11px]" style={{ background: t.bg, color: t.text }}>
        <div className="w-[152px] shrink-0 py-3" style={{ borderRight: `1px solid ${t.border}` }}>
            {DESK_NAV.map((n, i) => (
                <div
                    key={n.label}
                    className="mx-2 mb-1 flex items-center gap-2 rounded-full px-2.5 py-1.5"
                    style={i === 0 ? { background: t.pill, color: t.onPill } : { color: t.muted }}
                >
                    <n.Icon size={13} />
                    <span className="text-[10px]">{n.label}</span>
                </div>
            ))}
            <p className="px-4 pt-2 text-[8px] leading-snug" style={{ color: t.muted }}>
                8 de los 10 destinos del administrador
            </p>
        </div>

        <div className="flex-1 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[9px]" style={{ color: t.muted }}>
                        Buenos días,
                    </p>
                    <p className="cav-title text-[16px] font-bold">Andrés Marcano</p>
                </div>
                <span
                    className="grid h-6 w-6 place-items-center rounded-full text-[8px] font-bold"
                    style={{ background: "#C3EAEF", color: "#00313B" }}
                >
                    AM
                </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
                {KPIS.map((k) => (
                    <div
                        key={k.label}
                        className="rounded-[10px] p-2.5"
                        style={{ background: t.card, border: `1px solid ${t.border}` }}
                    >
                        <span
                            className="grid h-5 w-5 place-items-center rounded-[5px]"
                            style={{ background: `${k.color}1F`, color: k.color }}
                        >
                            <k.Icon size={12} />
                        </span>
                        <p className="cav-title cav-num mt-2 text-[18px] font-bold leading-none">—</p>
                        <p className="mt-1 text-[8px]" style={{ color: t.muted }}>
                            {k.label}
                        </p>
                    </div>
                ))}
            </div>

            <div
                className="mt-3 flex items-start gap-2 rounded-[10px] p-2.5"
                style={{ background: t.card, border: `1px solid ${t.border}` }}
            >
                <Construction size={13} style={{ color: t.muted }} className="mt-px shrink-0" />
                <p className="text-[9px] leading-snug" style={{ color: t.muted }}>
                    Los indicadores se llenan a partir de la Fase 1, cuando entren las primeras recepciones.
                </p>
            </div>
        </div>
    </div>
);

/** Rótulo bajo cada teléfono. */
const ScreenLabel = ({ name }: { name?: string }) => (
    <p className="cav-mono mt-3 max-w-[224px] text-[9px] uppercase leading-relaxed tracking-[0.14em] opacity-45">
        {name}
    </p>
);

/* ───────────────────────────────── Landing ───────────────────────────────── */

const Landing = () => {
    const reduce = useReducedMotion();
    const [doorOpen, setDoorOpen] = useState(false);
    const [zone, setZone] = useState(0);
    const [light, setLight] = useState(true);

    const closingRef = useRef<HTMLDivElement>(null);
    const flow = useEnteredView<HTMLDivElement>(0.25);

    const { scrollYProgress: closing } = useScroll({
        target: closingRef,
        offset: ["start end", "end end"],
    });
    const leftLeaf = useTransform(closing, [0, 1], ["-101%", "-1%"]);
    const rightLeaf = useTransform(closing, [0, 1], ["101%", "1%"]);
    const slit = useTransform(closing, [0, 1], [0, 1]);

    useEffect(() => {
        const id = window.setTimeout(() => setDoorOpen(true), reduce ? 0 : 1500);
        return () => window.clearTimeout(id);
    }, [reduce]);

    const logo = p.media.find((m) => m.kind === "logo") ?? p.media[0];
    const built = p.features.filter((f) => !f.startsWith("Especificado"));
    const specced = p.features
        .filter((f) => f.startsWith("Especificado"))
        .map((f) => f.replace(/^Especificado\s*—\s*/, ""));
    const t = light ? LIGHT : DARK;
    /* La escarcha pierde un 20 % de opacidad en cada zona: la página se descongela al leerla. */
    const frost = Math.max(0.012, 0.07 * (1 - zone * 0.2));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="cav-root">
            <style>{css}</style>

            <ThermoRail onZone={setZone} />

            <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
                <FrostLayer opacity={frost} />
            </div>

            {/* ══════════════════ 1 · PUERTA DE CAVA + HERO ══════════════════ */}
            <section className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pt-24 pb-20 md:px-6 md:pt-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(75% 55% at 50% 8%, rgba(20,112,122,0.30), transparent 68%), radial-gradient(45% 40% at 82% 78%, rgba(244,144,33,0.10), transparent 70%)",
                    }}
                />
                <div className="relative z-10 w-full max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: reduce ? 0 : 1.05 }}
                        className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12"
                    >
                        <MarSaLeMark className="w-[200px] shrink-0 md:w-[260px]" still={!!reduce} />

                        <div className="min-w-0">
                            <ZoneTag code="CAVA-1" temp="−18,0 °C" note="Puerta abierta" />

                            <h1 className="cav-title mt-5 text-[2.1rem] font-black leading-[1.03] sm:text-5xl md:text-6xl">
                                Cadena de frío
                                <br />
                                que <span className="text-[#6FD3E0]">sí emite</span> el PDF
                            </h1>

                            <p className="max-w-xl mt-5 text-sm leading-relaxed opacity-75 md:text-base">
                                <RevealWords text={p.tagline} />
                            </p>

                            <div className="flex flex-wrap gap-2 mt-6">
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#6FD3E0]/35 bg-[#6FD3E0]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6FD3E0]">
                                    <span className="cav-dot h-1.5 w-1.5 rounded-full bg-[#6FD3E0]" />
                                    Offline-first
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#F49021]/35 bg-[#F49021]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F49021]">
                                    <span className="cav-dot h-1.5 w-1.5 rounded-full bg-[#F49021]" />
                                    Plan gratuito, sin Cloud Functions
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: reduce ? 0 : 1.25 }}
                        className="mt-12"
                    >
                        <div className="flex flex-wrap gap-2">
                            <Chip>{p.category}</Chip>
                            <Chip>{p.year}</Chip>
                        </div>

                        <div className="grid gap-4 mt-6 sm:grid-cols-2">
                            <div className="cav-card rounded-lg p-4">
                                <span className="cav-drop" />
                                <p className="cav-mono text-[9px] uppercase tracking-[0.24em] text-[#6FD3E0]">Rol</p>
                                <p className="relative mt-2 text-sm leading-relaxed opacity-80">{p.role}</p>
                            </div>
                            <div className="cav-card rounded-lg p-4">
                                <span className="cav-drop" />
                                <p className="cav-mono text-[9px] uppercase tracking-[0.24em] text-[#F49021]">Estado</p>
                                <p className="relative mt-2 text-sm leading-relaxed opacity-80">{p.status}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-8">
                            {p.links.web && (
                                <BrandButton href={p.links.web}>
                                    <Waves size={16} /> Ver el sistema
                                </BrandButton>
                            )}
                            {p.links.github && (
                                <BrandButton href={p.links.github} variant="outline">
                                    <FileText size={16} /> Ver el código
                                </BrandButton>
                            )}
                            {!p.links.web && !p.links.github && (
                                <Magnetic>
                                    <a
                                        href="#pantallas"
                                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#081113] shine-sweep"
                                        style={{ backgroundImage: "linear-gradient(135deg,#6FD3E0,#14707A)" }}
                                    >
                                        <ArrowDown size={16} /> Entrar a la cava
                                    </a>
                                </Magnetic>
                            )}
                            <span className="cav-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
                                Sistema interno · sin enlace público
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Las dos hojas de la puerta */}
                {!reduce && !doorOpen && (
                    <div aria-hidden className="absolute inset-0 z-30 pointer-events-none">
                        <motion.div
                            className="cav-leaf cav-leaf-l"
                            initial={{ x: "0%" }}
                            animate={{ x: "-101%" }}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="cav-gasket" />
                            <span className="cav-rivets" />
                            <span className="cav-handle right-4 w-[38%] -translate-y-1/2" />
                            <span className="absolute left-1/2 top-[26%] -translate-x-1/2 rounded border border-[#3C5058] bg-[#0E1A1E] px-3 py-2 text-center">
                                <span className="cav-mono block text-[9px] uppercase tracking-[0.24em] text-[#6FD3E0]">
                                    CAVA-1
                                </span>
                                <span className="cav-num block text-[15px] font-bold text-white">−18,0 °C</span>
                            </span>
                        </motion.div>

                        <motion.div
                            className="cav-leaf cav-leaf-r"
                            initial={{ x: "0%" }}
                            animate={{ x: "101%" }}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="cav-gasket" />
                            <span className="cav-rivets" />
                            <span className="cav-handle left-4 w-[38%] -translate-y-1/2" />
                            <span className="absolute left-1/2 top-[26%] hidden -translate-x-1/2 text-center sm:block">
                                <span className="cav-mono block text-[9px] uppercase tracking-[0.24em] opacity-40">
                                    Inversiones MarSaLe 0216, C.A.
                                </span>
                            </span>
                        </motion.div>

                        <span className="cav-vapor cav-vapor-a" />
                        <span className="cav-vapor cav-vapor-b" />
                    </div>
                )}
            </section>

            {/* ══════════════════ 2 · PARTES DE AVERÍA ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <ZoneTag code="CAVA-1" temp="−18,0 °C" note="Lo que había antes" />
                    </Reveal>

                    <SectionHead
                        index="01 / El sistema anterior"
                        title={
                            <>
                                Lo que <span className="text-[#F49021]">no salía</span>
                            </>
                        }
                        lead="Una aplicación de AppSheet que se quedó a medias. Tres fallas concretas la hacían inservible."
                    />

                    <Stagger className="grid gap-4 mt-10 md:grid-cols-3">
                        {FAULTS.map((f) => (
                            <StaggerItem key={f.code}>
                                <div className="cav-card h-full rounded-lg border-l-[3px] p-5" style={{ borderLeftColor: "#F49021" }}>
                                    <span className="cav-drop" />
                                    <p className="cav-mono relative text-[9px] uppercase tracking-[0.26em] text-[#F49021]">
                                        {f.code}
                                    </p>
                                    <h3 className="cav-title relative mt-3 text-lg font-bold">{f.title}</h3>
                                    <p className="relative mt-2 text-sm leading-relaxed opacity-75">{f.line}</p>
                                    <p className="relative pt-3 mt-4 text-xs leading-relaxed border-t opacity-45 border-white/10">
                                        {f.note}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-8">
                        <div className="cav-card p-6 rounded-lg md:p-8">
                            <span className="cav-drop" />
                            <p className="cav-mono relative text-[9px] uppercase tracking-[0.26em] opacity-45">
                                El parte completo
                            </p>
                            <p className="relative mt-3 text-sm leading-relaxed opacity-80 md:text-base">{p.problem}</p>
                        </div>
                    </Reveal>

                    <Reveal className="mt-6" delay={0.1}>
                        <div className="flex flex-wrap gap-2">
                            {["−20 °C", "Guantes de nitrilo mojados", "Sol directo", "Cortes eléctricos", "Doble moneda e IGTF", "Sin señal en la cava"].map(
                                (c) => (
                                    <span
                                        key={c}
                                        className="cav-mono rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.14em] opacity-55"
                                    >
                                        {c}
                                    </span>
                                )
                            )}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════ 3 · SIN SERVIDOR ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, #2B3F46, transparent)" }}
                />
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <ZoneTag code="TUNEL-1" temp="−35,0 °C" note="La decisión más dura" />
                    </Reveal>

                    <SectionHead
                        index="02 / La solución"
                        title={
                            <>
                                Backend <span className="text-[#6FD3E0]">sin backend</span>
                            </>
                        }
                        lead="Cada hueco que deja el plan gratuito tiene su compensación explícita, escrita en la especificación."
                    />

                    <Reveal className="mt-10">
                        <div className="cav-card p-6 rounded-lg md:p-8">
                            <span className="cav-drop" />
                            <p className="relative text-sm leading-relaxed opacity-80 md:text-base">{p.solution}</p>
                        </div>
                    </Reveal>

                    <div ref={flow.ref} className="mt-12 overflow-x-auto scrollbar-none">
                        <svg
                            viewBox="0 0 880 430"
                            className={`cav-flow h-auto w-[860px] min-w-[860px] md:w-full md:min-w-0 ${flow.inView ? "cav-on" : ""}`}
                        >
                            <text x="20" y="22" fill="#8FA9AF" fontSize="11" letterSpacing="3">
                                LO QUE HARÍA UNA CLOUD FUNCTION
                            </text>
                            <text x="530" y="22" fill="#6FD3E0" fontSize="11" letterSpacing="3">
                                LO QUE LO SUSTITUYE EN SPARK
                            </text>

                            {COMPENSATIONS.map((c, i) => {
                                const y = 46 + i * 62;
                                const mid = y + 22;
                                return (
                                    <g key={c.from}>
                                        <rect
                                            x="20"
                                            y={y}
                                            width="300"
                                            height="44"
                                            rx="8"
                                            fill="#101B20"
                                            stroke="#2B3F46"
                                            strokeDasharray="4 4"
                                        />
                                        <text x="36" y={mid + 4} fill="#8FA9AF" fontSize="12.5">
                                            {c.from}
                                        </text>

                                        <path
                                            className="cav-arrow"
                                            d={`M330 ${mid} C 400 ${mid}, 450 ${mid}, 518 ${mid}`}
                                            fill="none"
                                            stroke="#6FD3E0"
                                            strokeWidth="1.6"
                                            strokeOpacity="0.75"
                                            style={{ animationDelay: `${i * 0.12}s` }}
                                        />
                                        <path d={`M518 ${mid} l -9 -4.5 l 0 9 z`} fill="#6FD3E0" opacity="0.85" />

                                        <rect
                                            x="530"
                                            y={y}
                                            width="330"
                                            height="44"
                                            rx="8"
                                            fill="#16242A"
                                            stroke="#2B3F46"
                                        />
                                        <rect x="530" y={y} width="3" height="44" rx="1.5" fill="#6FD3E0" />
                                        <text x="548" y={mid + 4} fill="#E2F0F3" fontSize="12.5">
                                            {c.to}
                                        </text>
                                    </g>
                                );
                            })}

                            <text x="20" y="424" fill="#F49021" fontSize="11.5">
                                Blaze queda documentado, pero no se activa antes de la Fase 5.
                            </text>
                        </svg>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 4 · HIGHLIGHTS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <ZoneTag code="TUNEL-1" temp="−35,0 °C" note="Seis decisiones" />
                    </Reveal>

                    <SectionHead
                        index="03 / Lo que sostiene el sistema"
                        title={
                            <>
                                Seis piezas que <span className="text-[#6FD3E0]">aguantan el frío</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="cav-card h-full rounded-lg p-5">
                                        <span className="cav-drop" />
                                        <div className="relative flex items-center gap-3">
                                            <span className="grid h-10 w-10 place-items-center rounded-md bg-[#0E4C5A] text-[#9FE3EA]">
                                                <Icon size={18} />
                                            </span>
                                            <span className="cav-mono cav-num text-[10px] uppercase tracking-[0.24em] opacity-35">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className="cav-title relative mt-4 text-base font-bold leading-snug">{h.title}</h3>
                                        <p className="relative mt-2.5 text-[13px] leading-relaxed opacity-70">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════ 5 · ARQUITECTURA ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <ZoneTag code="TUNEL-1" temp="−35,0 °C" note="Plano de planta" />
                    </Reveal>

                    <SectionHead
                        index="04 / Arquitectura"
                        title={
                            <>
                                Un solo paquete, <span className="text-[#6FD3E0]">tres capas</span>
                            </>
                        }
                    />

                    <div className="grid gap-6 mt-10 lg:grid-cols-[1fr_260px]">
                        <Reveal>
                            <div className="relative pl-6">
                                <span
                                    aria-hidden
                                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                                    style={{ background: "linear-gradient(180deg,#6FD3E0,#14707A,#0E4C5A)" }}
                                />
                                <p className="text-sm leading-relaxed opacity-80 md:text-base">{p.architecture}</p>
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <div className="cav-card rounded-lg p-5">
                                <span className="cav-drop" />
                                <p className="cav-mono relative text-[9px] uppercase tracking-[0.24em] text-[#6FD3E0]">
                                    Puertos de los emuladores
                                </p>
                                <div className="cav-mono cav-num relative mt-3 space-y-1.5 text-[12px]">
                                    {[
                                        ["Auth", "9099"],
                                        ["Firestore", "8080"],
                                        ["Storage", "9199"],
                                        ["UI", "4000"],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                                            <span className="opacity-55">{k}</span>
                                            <span className="text-[#6FD3E0]">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="relative mt-4 text-[11px] leading-relaxed opacity-45">
                                    Proyecto sistemas-de-cava, plan Spark. Hosting apuntando a build/web.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 6 · RETOS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <ZoneTag code="TUNEL-1" temp="−35,0 °C" note="Fichas de lectura" />
                    </Reveal>

                    <SectionHead
                        index="05 / Retos"
                        title={
                            <>
                                Decisiones a <span className="text-[#6FD3E0]">−18 °C</span>
                            </>
                        }
                        lead="Cada ficha tiene su parte fría —lo que se rompía— y su parte templada: lo que quedó escrito para que no se repita."
                    />

                    <div className="mt-10 space-y-4">
                        {p.challenges.map((c, i) => (
                            <Reveal key={c.problem.slice(0, 24)} delay={i * 0.05}>
                                <div className="overflow-hidden border rounded-lg cav-card">
                                    <span className="cav-drop" />
                                    <div className="grid md:grid-cols-2">
                                        <div className="relative p-5 md:p-6" style={{ background: "rgba(14,76,90,0.28)" }}>
                                            <div className="flex items-center gap-2">
                                                <Snowflake size={13} className="text-[#6FD3E0]" />
                                                <span className="cav-mono text-[9px] uppercase tracking-[0.24em] text-[#6FD3E0]">
                                                    Lectura {String(i + 1).padStart(2, "0")} · frío
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed opacity-85">{c.problem}</p>
                                        </div>
                                        <div className="relative p-5 md:p-6 border-t border-white/10 md:border-l md:border-t-0">
                                            <div className="flex items-center gap-2">
                                                <Sun size={13} className="text-[#F49021]" />
                                                <span className="cav-mono text-[9px] uppercase tracking-[0.24em] text-[#F49021]">
                                                    Templado · lo que se hizo
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed opacity-75">{c.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 7 · PANTALLAS REALES ══════════════════ */}
            <section id="pantallas" className="relative px-4 py-20 md:px-6 md:py-28">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(60% 45% at 50% 0%, rgba(20,112,122,0.16), transparent 70%)" }}
                />
                <div className="relative max-w-6xl mx-auto">
                    <Reveal>
                        <ZoneTag code="CAVA-2" temp="0 a 4 °C" note="Antesala de proceso" />
                    </Reveal>

                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <SectionHead
                            index="06 / La interfaz"
                            title={
                                <>
                                    Las pantallas que <span className="text-[#6FD3E0]">ya compilan</span>
                                </>
                            }
                            lead="Seis pantallas construidas en la Fase 0, recreadas aquí con los mismos colores, medidas y textos que pinta la app."
                        />

                        <div className="flex items-center gap-2 rounded-full border border-[#2B3F46] bg-[#16242A] p-1">
                            {[
                                { key: true, label: "Tema claro" },
                                { key: false, label: "Tema oscuro" },
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => setLight(opt.key)}
                                    className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
                                    style={
                                        light === opt.key
                                            ? { background: "#6FD3E0", color: "#081113" }
                                            : { color: "#8FA9AF" }
                                    }
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Reveal className="mt-12">
                        <DragRail className="pb-2">
                            {[
                                { node: <MockSplash />, name: p.uiScreens[0]?.name },
                                { node: <MockLogin />, name: p.uiScreens[1]?.name },
                                { node: <MockPanel t={t} />, name: p.uiScreens[2]?.name },
                                { node: <MockShell t={t} />, name: p.uiScreens[3]?.name },
                                { node: <MockPassword t={t} />, name: p.uiScreens[4]?.name },
                            ].map((s, i) => (
                                <div key={i} className="w-[224px] shrink-0">
                                    <PhoneFrame glow={i === 0}>{s.node}</PhoneFrame>
                                    <ScreenLabel name={s.name} />
                                </div>
                            ))}
                        </DragRail>
                    </Reveal>

                    <p className="cav-mono mt-4 text-[10px] uppercase tracking-[0.18em] opacity-35">
                        Arrastra para ver las cinco pantallas
                    </p>

                    <Reveal className="mt-14" direction="scale">
                        <BrowserFrame url="sistemas-de-cava.web.app" dark={!light}>
                            <MockDesk t={t} />
                        </BrowserFrame>
                        <p className="cav-mono mt-3 text-[10px] uppercase tracking-[0.16em] opacity-45">
                            {p.uiScreens[3]?.name}
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════ 8 · LA PALETA SALIÓ DEL LOGO ══════════════════ */}
            {logo && (
                <section className="relative px-4 py-20 md:px-6 md:py-28">
                    <div className="max-w-6xl mx-auto">
                        <Reveal>
                            <ZoneTag code="CAVA-2" temp="0 a 4 °C" note="Muestreo de color" />
                        </Reveal>

                        <SectionHead
                            index="07 / Identidad"
                            title={
                                <>
                                    De esta imagen salió <span className="text-[#F49021]">cada hexadecimal</span>
                                </>
                            }
                            lead="Ningún color del sistema de diseño está inventado: se muestrearon píxel a píxel del logo real de la empresa."
                        />

                        <div className="grid items-start gap-8 mt-10 lg:grid-cols-2">
                            <Reveal direction="right">
                                <figure className="cav-card overflow-hidden rounded-xl p-4">
                                    <span className="cav-drop" />
                                    <div className="relative overflow-hidden bg-white rounded-lg">
                                        <Image
                                            src={logo.src}
                                            alt={p.name}
                                            width={1336}
                                            height={784}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <figcaption className="relative mt-4 text-xs leading-relaxed opacity-55">
                                        {logo.caption}
                                    </figcaption>
                                </figure>
                            </Reveal>

                            <div>
                                <Stagger className="grid grid-cols-2 gap-3" stagger={0.06}>
                                    {PALETTE.map((c) => (
                                        <StaggerItem key={c.hex}>
                                            <div className="cav-card rounded-lg p-3">
                                                <span className="cav-drop" />
                                                <span
                                                    className="relative block h-12 w-full rounded-md border border-white/10"
                                                    style={{ background: c.hex }}
                                                />
                                                <p className="cav-mono cav-num relative mt-2.5 text-[12px] font-semibold">
                                                    {c.hex}
                                                </p>
                                                <p className="relative text-[11px] opacity-70">{c.name}</p>
                                                <p className="relative mt-1 text-[10px] leading-snug opacity-40">{c.use}</p>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </Stagger>

                                <Reveal className="mt-4" delay={0.1}>
                                    <div
                                        className="p-4 rounded-lg"
                                        style={{ background: "#F49021", color: "#2B1400" }}
                                    >
                                        <p className="cav-mono text-[9px] uppercase tracking-[0.24em] opacity-70">
                                            Regla escrita en el código
                                        </p>
                                        <p className="mt-2 text-sm font-semibold leading-relaxed">
                                            Sobre el naranja del sol el texto es #2B1400 y nunca blanco: el blanco da 2,37:1.
                                        </p>
                                    </div>
                                </Reveal>

                                <Reveal className="mt-3" delay={0.16}>
                                    <div className="cav-card rounded-lg p-4">
                                        <span className="cav-drop" />
                                        <p className="cav-mono relative text-[9px] uppercase tracking-[0.24em] text-[#6FD3E0]">
                                            Anti-objetivo
                                        </p>
                                        <p className="relative mt-2 text-sm leading-relaxed opacity-80">
                                            Ningún tono entre 260° y 330° en toda la aplicación. El lila es el color por
                                            defecto de AppSheet, y es exactamente lo que el dueño rechaza.
                                        </p>
                                    </div>
                                </Reveal>
                            </div>
                        </div>

                        <Reveal className="mt-10">
                            <p className="text-xs leading-relaxed opacity-45">
                                <span className="text-[#6FD3E0]">Mood de marca · </span>
                                {p.brand.mood}
                            </p>
                        </Reveal>
                    </div>
                </section>
            )}

            {/* ══════════════════ 9 · KARDEX DE FUNCIONALIDADES ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <ZoneTag code="ANTESALA" temp="8 a 12 °C" note="Movimientos" />
                    </Reveal>

                    <SectionHead
                        index="08 / Funcionalidades"
                        title={
                            <>
                                Kardex de lo construido <span className="text-[#6FD3E0]">y lo especificado</span>
                            </>
                        }
                        lead="Append-only, como el kardex del proyecto: lo que entró en la Fase 0 y lo que ya tiene especificación esperando turno."
                    />

                    <Reveal className="mt-10">
                        <div className="overflow-x-auto scrollbar-none cav-card rounded-lg">
                            <span className="cav-drop" />
                            <table className="relative w-full min-w-[640px] border-collapse text-left">
                                <thead>
                                    <tr className="cav-mono text-[9px] uppercase tracking-[0.22em] opacity-45">
                                        <th className="px-4 py-3 font-normal w-[54px]">#</th>
                                        <th className="px-4 py-3 font-normal w-[110px]">Movimiento</th>
                                        <th className="px-4 py-3 font-normal">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {built.map((f, i) => (
                                        <tr key={`in-${i}`} className="border-t border-white/[0.06] align-top">
                                            <td className="cav-mono cav-num px-4 py-3 text-[11px] opacity-35">
                                                {String(i + 1).padStart(3, "0")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6FD3E0]/35 bg-[#6FD3E0]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6FD3E0]">
                                                    Entrada
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[13px] leading-relaxed opacity-75">{f}</td>
                                        </tr>
                                    ))}
                                    {specced.map((f, i) => (
                                        <tr key={`res-${i}`} className="border-t border-white/[0.06] align-top">
                                            <td className="cav-mono cav-num px-4 py-3 text-[11px] opacity-35">
                                                {String(built.length + i + 1).padStart(3, "0")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F49021]/35 bg-[#F49021]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#F49021]">
                                                    Reservado
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[13px] leading-relaxed opacity-60">{f}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Reveal>

                    <div className="grid gap-4 mt-6 sm:grid-cols-2">
                        <Reveal>
                            <div className="cav-card rounded-lg p-4">
                                <span className="cav-drop" />
                                <p className="cav-title cav-num relative text-2xl font-bold text-[#6FD3E0]">
                                    {built.length}
                                </p>
                                <p className="cav-mono relative mt-1 text-[10px] uppercase tracking-[0.18em] opacity-50">
                                    funcionalidades ya construidas
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <div className="cav-card rounded-lg p-4">
                                <span className="cav-drop" />
                                <p className="cav-title cav-num relative text-2xl font-bold text-[#F49021]">
                                    {specced.length}
                                </p>
                                <p className="cav-mono relative mt-1 text-[10px] uppercase tracking-[0.18em] opacity-50">
                                    módulos con especificación cerrada
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 10 · STACK ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <ZoneTag code="ANTESALA" temp="8 a 12 °C" note="Equipos instalados" />
                    </Reveal>

                    <SectionHead index="09 / Stack" title="Con qué está hecho" />

                    <Stagger className="grid gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
                        {p.stack.map((group) => (
                            <StaggerItem key={group.group}>
                                <div className="cav-card h-full rounded-lg p-5">
                                    <span className="cav-drop" />
                                    <p className="cav-mono relative text-[10px] uppercase tracking-[0.22em] text-[#6FD3E0]">
                                        {group.group}
                                    </p>
                                    <div className="relative flex flex-wrap gap-1.5 mt-3">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="cav-mono rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] opacity-75"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════ 11 · MÉTRICAS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <ZoneTag code="ANTESALA" temp="8 a 12 °C" note="Lectura del tablero" />
                    </Reveal>

                    <SectionHead
                        index="10 / Métricas"
                        title={
                            <>
                                El proyecto <span className="text-[#6FD3E0]">en cifras</span>
                            </>
                        }
                    />

                    <div className="cav-card mt-10 rounded-xl p-6 md:p-10">
                        <span className="cav-drop" />
                        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                            {p.metrics.map((m) => (
                                <div key={m.label} className="cav-num relative">
                                    <CountMetric value={m.value} label={m.label} />
                                    {m.value === "0" && (
                                        <span className="mt-2 inline-block rounded-full bg-[#F49021] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#2B1400]">
                                            Fuera de lo esperado, y a propósito
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 12 · LA TUBERÍA DE LAS FASES ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <ZoneTag code="ANTESALA" temp="8 a 12 °C" note="Plan de ejecución" />
                    </Reveal>

                    <SectionHead
                        index="11 / El plan"
                        title={
                            <>
                                Once fases, <span className="text-[#6FD3E0]">dos ya escarchadas</span>
                            </>
                        }
                        lead="El tramo con escarcha es el que ya está en frío. El tubo desnudo es lo que queda por conectar."
                    />

                    <div className="relative pl-8 mt-12 md:pl-12">
                        <span aria-hidden className="absolute left-[13px] top-2 bottom-2 w-[3px] rounded-full cav-pipe-todo md:left-[21px]" />
                        <span
                            aria-hidden
                            className="absolute left-[13px] top-2 h-[210px] w-[3px] rounded-full cav-pipe-done md:left-[21px]"
                        />

                        {[
                            {
                                phase: "Fase 0",
                                state: "Construida",
                                done: true,
                                text: "Paleta muestreada del logo, tema claro y oscuro verificados contra WCAG, logo animado con CustomPainter, splash, login, guard de sesión sin bucles y reglas en modo denegar-por-defecto.",
                            },
                            {
                                phase: "Fase 0.5",
                                state: "Construida",
                                done: true,
                                text: "Acceso y roles: ocho roles con permisos distintos, cascarón adaptativo por rol, cambio de contraseña obligatorio, pantalla de «sin acceso» y scripts de alta en Node.",
                            },
                            {
                                phase: "Fase 1",
                                state: "Siguiente",
                                done: false,
                                text: specced[0],
                            },
                            {
                                phase: "En el plan",
                                state: "Especificado",
                                done: false,
                                text: specced[1],
                            },
                            {
                                phase: "En el plan",
                                state: "Especificado",
                                done: false,
                                text: specced[2],
                            },
                            {
                                phase: "En el plan",
                                state: "Especificado",
                                done: false,
                                text: specced[3],
                            },
                            {
                                phase: "En el plan",
                                state: "Especificado",
                                done: false,
                                text: specced[4],
                            },
                            {
                                phase: "En el plan",
                                state: "Especificado",
                                done: false,
                                text: specced[5],
                            },
                        ].map((step, i) => (
                            <Reveal key={`${step.phase}-${i}`} delay={i * 0.05} className="relative pb-8 last:pb-0">
                                <span
                                    className={`absolute -left-8 top-1 grid h-[26px] w-[26px] place-items-center rounded-full border md:-left-12 ${
                                        step.done
                                            ? "border-[#6FD3E0] bg-[#0E4C5A]"
                                            : "border-[#2B3F46] bg-[#101B20]"
                                    }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${step.done ? "bg-[#6FD3E0]" : "bg-[#2B3F46] cav-pulse"}`}
                                    />
                                </span>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="cav-mono text-[10px] uppercase tracking-[0.22em] text-[#6FD3E0]">
                                        {step.phase}
                                    </span>
                                    <span
                                        className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
                                        style={
                                            step.done
                                                ? { background: "rgba(111,211,224,0.14)", color: "#6FD3E0" }
                                                : { background: "rgba(244,144,33,0.12)", color: "#F49021" }
                                        }
                                    >
                                        {step.state}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed opacity-75">{step.text}</p>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-10">
                        <p className="cav-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] opacity-35">
                            Once fases en el plan · dos construidas · nueve documentos de especificación por delante
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════ 13 · RESUMEN ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-3xl mx-auto">
                    <Reveal>
                        <ZoneTag code="MUELLE" temp="26 °C" note="Temperatura ambiente" />
                    </Reveal>

                    <div className="flex items-center gap-4 mt-8">
                        <MarSaLeMark className="w-[92px] shrink-0" still />
                        <h2 className="cav-title text-2xl font-bold leading-tight md:text-3xl">
                            El proyecto, <span className="text-[#6FD3E0]">contado entero</span>
                        </h2>
                    </div>

                    <Stagger className="mt-8 space-y-5" stagger={0.08}>
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={paragraph.slice(0, 24)}>
                                <p
                                    className={`leading-relaxed ${
                                        i === 0 ? "text-lg md:text-xl opacity-90" : "text-sm md:text-base opacity-65"
                                    }`}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <div className="py-6 border-y border-white/10 cav-mono text-[11px] uppercase tracking-[0.2em] opacity-45">
                <Marquee
                    items={[
                        "CAVA-1 · −18,0 °C",
                        "TUNEL-1 · −35,0 °C",
                        "Kardex append-only",
                        "Gramos enteros",
                        "Centavos enteros",
                        "Tasa BCV a 8 decimales",
                        "Modo campo",
                        "ULID",
                        "es-VE",
                        "Sin Cloud Functions",
                    ]}
                    speed={38}
                    separator="❄"
                />
            </div>

            {/* ══════════════════ 14 · LA PUERTA SE VUELVE A CERRAR ══════════════════ */}
            <div ref={closingRef} className="relative overflow-hidden h-[62vh] min-h-[380px]">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(20,112,122,0.20), transparent 70%)" }}
                />

                <div className="absolute inset-0 z-30 grid place-items-center px-6 text-center">
                    <motion.div style={reduce ? undefined : { opacity: slit }}>
                        <p className="cav-mono text-[10px] uppercase tracking-[0.28em] text-[#6FD3E0]">
                            Puerta cerrándose
                        </p>
                        <p className="cav-title mt-3 max-w-md text-xl font-bold leading-snug md:text-2xl">
                            La cava queda a −18,0 °C y el sistema sigue funcionando sin señal.
                        </p>
                    </motion.div>
                </div>

                {!reduce && (
                    <div aria-hidden className="absolute inset-0 pointer-events-none">
                        <motion.div className="cav-leaf cav-leaf-l" style={{ x: leftLeaf }}>
                            <span className="cav-gasket" />
                            <span className="cav-rivets" />
                            <span className="cav-handle right-4 w-[38%] -translate-y-1/2" />
                        </motion.div>
                        <motion.div className="cav-leaf cav-leaf-r" style={{ x: rightLeaf }}>
                            <span className="cav-gasket" />
                            <span className="cav-rivets" />
                            <span className="cav-handle left-4 w-[38%] -translate-y-1/2" />
                        </motion.div>
                    </div>
                )}

                <span
                    aria-hidden
                    className="absolute inset-y-0 left-1/2 z-20 w-[3px] -translate-x-1/2"
                    style={{ background: "linear-gradient(180deg, transparent, rgba(111,211,224,0.85), transparent)" }}
                />
            </div>

            <div className="pb-32">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un ERP de cadena de frío que emite documentos sin red, cuadra kilos al gramo y cabe entero en el plan gratuito de Firebase. Si tienes una operación con reglas propias —almacenaje, procesos, nómina venezolana— este es exactamente el terreno que conozco."
                />
                <div className="flex justify-center">
                    <Link
                        href="/portfolio"
                        className="cav-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-40 transition-opacity hover:opacity-80"
                    >
                        Salir de la cava <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
