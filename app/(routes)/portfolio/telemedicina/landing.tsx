"use client"

import { useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    ArrowUpRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    FileText,
    IdCard,
    LayoutDashboard,
    LogOut,
    MessageCircle,
    MessageSquare,
    Moon,
    RefreshCw,
    Search,
    ShieldCheck,
    Star,
    Stethoscope,
    Undo2,
    User,
    Users,
    Wifi,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { BrowserFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("telemedicina")!;
const nxt = nextProject("telemedicina");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* ── Paleta real de la app: azul de sistema + los cuatro colores de estado ── */
const INK = "#1a1a1c";
const SUB = "#6e6e73";
const MUTE = "#8e8e93";
const HAIR = "#e5e5ea";
const BLUE = "#0071e3";
const SKY = "#38bdf8";
const VIOLET = "#5e5ce6";
const GREEN = "#34c759";
const AMBER = "#ff9f0a";
const GRAY = "#8e8e93";
const RED = "#ff3b30";

const icon = p.media.find((m) => m.kind === "icon");

/* ── Trazo de electrocardiograma, construido latido a latido (sin azar) ── */
const BEAT_W = 200;
const beat = (x: number, y: number) =>
    `M${x} ${y} h44 q9 -11 18 0 h24 l7 6 l8 -32 l9 50 l8 -24 h8 q15 -15 30 0 h44`;
const ecg = (beats: number, y = 50) =>
    Array.from({ length: beats }, (_, i) => beat(i * BEAT_W, y)).join(" ");
const ECG_HERO = ecg(6);
const ECG_FLAT = `${beat(0, 50)} ${beat(BEAT_W, 50)} M${BEAT_W * 2} 50 H1180`;
const ECG_MINI = "M0 14 h8 l3 3 l4 -12 l4 18 l4 -9 h9 q6 -6 12 0 h16";

/* ── Datos de muestra de los mockups: fieles a lo que describe uiScreens ── */
type StateKey = "activa" | "espera" | "final" | "rechaz";
const STATES: Record<StateKey, { label: string; color: string }> = {
    activa: { label: "Activa", color: GREEN },
    espera: { label: "En espera", color: AMBER },
    final: { label: "Finalizada", color: GRAY },
    rechaz: { label: "Rechazada", color: RED },
};

const DONUT_TOTAL = 312;
const DONUT_ARCS = ([
    { key: "activa", value: 7 },
    { key: "espera", value: 41 },
    { key: "final", value: 214 },
    { key: "rechaz", value: 50 },
] as { key: StateKey; value: number }[]).reduce<{ key: StateKey; value: number; pct: number; off: number }[]>(
    (arr, s) => {
        const prev = arr[arr.length - 1];
        const off = prev ? prev.off + prev.pct : 0;
        arr.push({ key: s.key, value: s.value, pct: (s.value / DONUT_TOTAL) * 100, off });
        return arr;
    },
    []
);

const RECIENTES: { ini: string; tone: string; name: string; mail: string; motivo: string; state: StateKey; date: string; time: string }[] = [
    { ini: "MV", tone: BLUE, name: "María Villalba", mail: "maria.villalba@gmail.com", motivo: "Dolor abdominal desde ayer", state: "activa", date: "12/08/2026", time: "09:41" },
    { ini: "JR", tone: VIOLET, name: "José Ramírez", mail: "jramirez84@hotmail.com", motivo: "Control de tensión arterial", state: "espera", date: "12/08/2026", time: "09:18" },
    { ini: "AC", tone: GREEN, name: "Andrea Colmenares", mail: "andrea.c@gmail.com", motivo: "Resultados de laboratorio", state: "final", date: "11/08/2026", time: "17:52" },
    { ini: "LG", tone: AMBER, name: "Luis Gutiérrez", mail: "luisgtz@gmail.com", motivo: "Fiebre y malestar general", state: "final", date: "11/08/2026", time: "16:05" },
    { ini: "NP", tone: RED, name: "Nayibe Pérez", mail: "n.perez@outlook.com", motivo: "Consulta pediátrica de rutina", state: "rechaz", date: "11/08/2026", time: "11:30" },
];

const DOCTORES: { ini: string; name: string; mail: string; esp: string; anios: string; rating: number }[] = [
    { ini: "AR", name: "Dra. Andreína Rojas", mail: "a.rojas@constitucion.com", esp: "Medicina general", anios: "12 años", rating: 4.6 },
    { ini: "LP", name: "Dr. Luis Peraza", mail: "l.peraza@constitucion.com", esp: "Cardiología", anios: "9 años", rating: 4.8 },
    { ini: "CF", name: "Dra. Camila Ferrer", mail: "c.ferrer@constitucion.com", esp: "Pediatría", anios: "6 años", rating: 4.9 },
    { ini: "HS", name: "Dr. Héctor Salas", mail: "h.salas@constitucion.com", esp: "Medicina general", anios: "15 años", rating: 4.4 },
    { ini: "NO", name: "Dra. Nayibe Ortega", mail: "n.ortega@constitucion.com", esp: "Pediatría", anios: "11 años", rating: 4.7 },
    { ini: "OM", name: "Dr. Óscar Medina", mail: "o.medina@constitucion.com", esp: "Cardiología", anios: "8 años", rating: 4.5 },
];

const FILAS: {
    pac: [string, string, string];
    doc: [string, string, string];
    motivo: string;
    state: StateKey;
    poliza: [string, string];
    ini: [string, string];
    fin: [string, string];
}[] = [
    { pac: ["MV", "María Villalba", "maria.villalba@gmail.com"], doc: ["LP", "Dr. Luis Peraza", "l.peraza@constitucion.com"], motivo: "Dolor abdominal persistente desde ayer", state: "activa", poliza: ["0084 2291", "Individual"], ini: ["12/08/2026", "09:41"], fin: ["—", "en curso"] },
    { pac: ["JR", "José Ramírez", "jramirez84@hotmail.com"], doc: ["AR", "Dra. Andreína Rojas", "a.rojas@constitucion.com"], motivo: "Control de tensión arterial", state: "espera", poliza: ["0079 1140", "Familiar"], ini: ["12/08/2026", "09:18"], fin: ["—", "—"] },
    { pac: ["AC", "Andrea Colmenares", "andrea.c@gmail.com"], doc: ["CF", "Dra. Camila Ferrer", "c.ferrer@constitucion.com"], motivo: "Revisión de resultados de laboratorio", state: "final", poliza: ["0091 5527", "Corporativa"], ini: ["11/08/2026", "17:52"], fin: ["11/08/2026", "18:14"] },
    { pac: ["LG", "Luis Gutiérrez", "luisgtz@gmail.com"], doc: ["HS", "Dr. Héctor Salas", "h.salas@constitucion.com"], motivo: "Fiebre y malestar general", state: "final", poliza: ["0066 3018", "Individual"], ini: ["11/08/2026", "16:05"], fin: ["11/08/2026", "16:33"] },
    { pac: ["NP", "Nayibe Pérez", "n.perez@outlook.com"], doc: ["OM", "Dr. Óscar Medina", "o.medina@constitucion.com"], motivo: "Consulta pediátrica de rutina", state: "rechaz", poliza: ["0088 7742", "Familiar"], ini: ["11/08/2026", "11:30"], fin: ["11/08/2026", "11:31"] },
    { pac: ["RD", "Rubén Duarte", "rduarte@gmail.com"], doc: ["NO", "Dra. Nayibe Ortega", "n.ortega@constitucion.com"], motivo: "Seguimiento posoperatorio",  state: "final", poliza: ["0072 9083", "Individual"], ini: ["10/08/2026", "14:20"], fin: ["10/08/2026", "14:58"] },
];

const NAV: { label: string; icon: LucideIcon }[] = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Usuarios", icon: Users },
    { label: "Reseñas", icon: MessageSquare },
    { label: "Doctores", icon: Stethoscope },
    { label: "Doctores en línea", icon: Wifi },
    { label: "Consultas", icon: ClipboardList },
];

const KPI: { label: string; value: string; tone: string; icon: LucideIcon }[] = [
    { label: "Usuarios totales", value: "1.248", tone: BLUE, icon: Users },
    { label: "Doctores registrados", value: "86", tone: VIOLET, icon: Stethoscope },
    { label: "Doctores en línea", value: "12", tone: GREEN, icon: Wifi },
    { label: "Consultas activas", value: "7", tone: AMBER, icon: ClipboardList },
];

const METRIC_TONES = [BLUE, VIOLET, GREEN, AMBER, SKY, BLUE];
const METRIC_ICONS: LucideIcon[] = [Icons.Route, Icons.Boxes, Icons.Share2, Icons.Layers, Icons.Languages, Icons.FileCode2];

/* Fichas del héroe: tres lengüetas de archivador, con los colores de estado. */
const HERO_CARDS = [
    { tone: BLUE, tab: "CONSULTA", title: "Teleconsulta 0084-2291", rows: [["Paciente", "María Villalba"], ["Doctor", "Dr. Luis Peraza"], ["Estado", "Activa"]] },
    { tone: AMBER, tab: "DOCTOR", title: "Dra. Andreína Rojas", rows: [["Especialidad", "Medicina general"], ["Colegiado", "MPPS 48211"], ["Estado", "En línea"]] },
    { tone: GREEN, tab: "PACIENTE", title: "José Ramírez", rows: [["Identificación", "V-27815456-0"], ["Póliza", "0079 1140 · Familiar"], ["Reseñas", "3 valoraciones"]] },
];

const css = `
.tm-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
.tm-num { font-variant-numeric: tabular-nums; }
.tm-tight { letter-spacing: -0.022em; }

.tm-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.055);
}
.tm-paper {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow:
    0 1px 2px rgba(16, 24, 40, 0.04),
    0 8px 24px -10px rgba(16, 24, 40, 0.10),
    0 30px 60px -34px rgba(16, 24, 40, 0.18);
}
.tm-lift { transition: transform .55s cubic-bezier(.22,1,.36,1), box-shadow .55s cubic-bezier(.22,1,.36,1); }
.tm-lift:hover {
  transform: translateY(-3px);
  box-shadow:
    0 2px 4px rgba(16, 24, 40, 0.05),
    0 14px 34px -12px rgba(16, 24, 40, 0.16),
    0 44px 84px -44px rgba(16, 24, 40, 0.26);
}

/* Papel milimetrado de electrocardiograma */
.tm-graph {
  background-image:
    linear-gradient(to right, rgba(0, 113, 227, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 113, 227, 0.055) 1px, transparent 1px),
    linear-gradient(to right, rgba(0, 113, 227, 0.13) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 113, 227, 0.13) 1px, transparent 1px);
  background-size: 12px 12px, 12px 12px, 60px 60px, 60px 60px;
}

/* El pulso: una cola y un punto brillante que corren sobre el mismo trazo */
.tm-tail { stroke-dasharray: 120 880; stroke-dashoffset: 1000; animation: tm-tail 3.2s linear infinite; }
.tm-head { stroke-dasharray: 7 993; stroke-dashoffset: 887; animation: tm-head 3.2s linear infinite; }
@keyframes tm-tail { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
@keyframes tm-head { from { stroke-dashoffset: 887; } to { stroke-dashoffset: -113; } }

.tm-mini { stroke-dasharray: 34 66; stroke-dashoffset: 100; animation: tm-mini 2.4s linear infinite; }
@keyframes tm-mini { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }

.tm-wire {
  stroke-dasharray: 13 87;
  stroke-dashoffset: 100;
  animation-name: tm-mini;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* La pila de fichas del héroe */
.tm-drop { opacity: 0; animation: tm-drop .72s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes tm-drop {
  from { opacity: 0; transform: translateY(24px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.tm-fan { transition: transform .6s cubic-bezier(.22,1,.36,1), box-shadow .6s cubic-bezier(.22,1,.36,1), filter .6s; }
.tm-fan-0 { transform: rotate(3deg) translate(-20px, -22px); filter: saturate(.85); }
.tm-fan-1 { transform: rotate(1.5deg) translate(-10px, -11px); }
.tm-fan-2 { transform: rotate(0deg) translate(0, 0); }
.tm-stack:hover .tm-fan-0 { transform: rotate(5.5deg) translate(-44px, -36px); filter: saturate(1); }
.tm-stack:hover .tm-fan-1 { transform: rotate(2.6deg) translate(-24px, -19px); }
.tm-stack:hover .tm-fan-2 { transform: rotate(0deg) translate(0, -10px); }

/* Punto de la línea de tiempo de incidencias */
.tm-beat { animation: tm-beat 1.8s cubic-bezier(.22,1,.36,1) infinite; }
@keyframes tm-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }

.tm-skel { animation: tm-skel 1.6s ease-in-out infinite; }
@keyframes tm-skel { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }

.tm-folio {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

@media (prefers-reduced-motion: reduce) {
  .tm-tail, .tm-head, .tm-mini, .tm-wire, .tm-drop, .tm-beat, .tm-skel { animation: none !important; }
  .tm-drop { opacity: 1; }
  .tm-tail { stroke-dasharray: none; stroke-dashoffset: 0; opacity: .35; }
  .tm-head { display: none; }
  .tm-mini, .tm-wire { stroke-dasharray: none; stroke-dashoffset: 0; }
  .tm-lift:hover, .tm-stack:hover .tm-fan-0, .tm-stack:hover .tm-fan-1, .tm-stack:hover .tm-fan-2 { transform: none; }
}
`;

/* ────────────────────────── Piezas reutilizables ────────────────────────── */

const Pulse = ({ d, className, width = "100%", height = 100, viewBox = "0 0 1200 100", stroke = BLUE, base = 0.16 }: {
    d: string;
    className?: string;
    width?: string | number;
    height?: number;
    viewBox?: string;
    stroke?: string;
    base?: number;
}) => (
    <svg
        viewBox={viewBox}
        width={width}
        height={height}
        preserveAspectRatio="none"
        aria-hidden
        className={className}
    >
        <path d={d} fill="none" stroke={stroke} strokeOpacity={base} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} pathLength={1000} className="tm-tail" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} pathLength={1000} className="tm-head" fill="none" stroke={stroke} strokeWidth={4.5} strokeLinecap="round" />
    </svg>
);

const MiniPulse = ({ tone, delay = 0 }: { tone: string; delay?: number }) => (
    <svg viewBox="0 0 56 28" width={56} height={18} aria-hidden className="block">
        <path d={ECG_MINI} fill="none" stroke={tone} strokeOpacity={0.2} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <path
            d={ECG_MINI}
            pathLength={100}
            className="tm-mini"
            style={{ animationDelay: `${delay}s` }}
            fill="none"
            stroke={tone}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/** Tarjeta con lengüeta de archivador: el material base de toda la página. */
const FileCard = ({
    tab,
    tone = BLUE,
    folio,
    children,
    className,
    glass = false,
}: {
    tab?: string;
    tone?: string;
    folio?: string;
    children: ReactNode;
    className?: string;
    glass?: boolean;
}) => (
    <div className={`relative ${className ?? ""}`}>
        {tab && (
            <span
                className="tm-mono absolute -top-[19px] left-6 inline-flex items-center rounded-t-[8px] px-3 pb-1.5 pt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white"
                style={{ background: tone }}
            >
                {tab}
            </span>
        )}
        <div className={`relative h-full rounded-[22px] ${glass ? "tm-glass" : "tm-paper"}`}>
            {folio && (
                <span className="tm-mono absolute right-4 top-4 text-[10px] tracking-[0.14em]" style={{ color: "#c7c7cc" }}>
                    {folio}
                </span>
            )}
            {children}
        </div>
    </div>
);

const Avatar = ({ ini, tone = BLUE, size = 26 }: { ini: string; tone?: string; size?: number }) => (
    <span
        className="inline-grid font-semibold rounded-full shrink-0 place-items-center"
        style={{
            width: size,
            height: size,
            fontSize: Math.round(size * 0.36),
            background: `${tone}1f`,
            color: tone,
        }}
    >
        {ini}
    </span>
);

const Pill = ({ state }: { state: StateKey }) => (
    <span
        className="inline-flex items-center rounded-full px-2 py-[2px] text-[9px] font-medium"
        style={{ background: `${STATES[state].color}1f`, color: STATES[state].color }}
    >
        {STATES[state].label}
    </span>
);

const Stars = ({ rating }: { rating: number }) => (
    <span className="inline-flex items-center gap-[1px]">
        {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={10} strokeWidth={0} fill={i < Math.round(rating) ? AMBER : HAIR} />
        ))}
        <span className="ml-1 text-[9px] tm-num" style={{ color: SUB }}>
            {rating.toFixed(1)}
        </span>
    </span>
);

/* ───────────────────────── Mockups de las pantallas ───────────────────────── */

const Field = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div>
        <p className="text-[9px] font-medium" style={{ color: SUB }}>{label}</p>
        <div
            className={`mt-1 rounded-[10px] px-2.5 py-[7px] text-[10px] ${mono ? "tm-mono" : ""}`}
            style={{ background: "#f2f2f7", color: INK, border: "1px solid rgba(0,0,0,0.04)" }}
        >
            {value}
        </div>
    </div>
);

/** 01 · Login */
const MockLogin = () => (
    <div className="relative overflow-hidden bg-[#f5f5f7] px-5 py-10 sm:py-14">
        <span aria-hidden className="absolute -left-20 -top-24 h-64 w-64 rounded-full blur-[70px]" style={{ background: "rgba(0,113,227,0.22)" }} />
        <span aria-hidden className="absolute -right-20 -bottom-28 h-64 w-64 rounded-full blur-[70px]" style={{ background: "rgba(94,92,230,0.20)" }} />

        <div
            className="relative mx-auto w-full max-w-[304px] rounded-[26px] px-6 py-7 text-center"
            style={{
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(255,255,255,0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 34px 70px -32px rgba(16,24,40,0.38)",
            }}
        >
            {icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon.src} alt="" className="mx-auto h-12 w-12 rounded-[14px]" />
            ) : (
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] text-white" style={{ backgroundImage: "var(--brand-gradient)" }}>
                    <ShieldCheck size={22} />
                </span>
            )}
            <p className="mt-3 text-[15px] font-semibold tm-tight" style={{ color: INK }}>Backoffice Telemedicina</p>
            <p className="mt-1 text-[10px]" style={{ color: MUTE }}>Accede al panel de telemedicina</p>

            <div className="mt-5 space-y-3 text-left">
                <Field label="Correo electrónico" value="admin@segurosconstitucion.com" />
                <Field label="Contraseña" value="••••••••••" />
            </div>

            <div
                className="mt-5 flex items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[11px] font-semibold text-white"
                style={{ background: BLUE, boxShadow: "0 10px 22px -12px rgba(0,113,227,0.9)" }}
            >
                Entrar <ArrowRight size={13} />
            </div>

            <p className="mt-4 text-[9px]" style={{ color: "#aeaeb2" }}>
                dconstiapi.segurosconstitucion.com · entorno DEV
            </p>
        </div>
    </div>
);

/** Carcasa común: barra lateral de vidrio + barra superior pegajosa. */
const MockChrome = ({ active, children }: { active: number; children: ReactNode }) => (
    <div className="flex min-w-[780px] gap-3 bg-[#f5f5f7] p-3">
        <aside
            className="flex w-[176px] shrink-0 flex-col rounded-[22px] p-3"
            style={{ background: "rgba(255,255,255,0.78)", border: "1px solid rgba(0,0,0,0.05)" }}
        >
            <div className="flex items-center gap-2">
                {icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={icon.src} alt="" className="h-7 w-7 rounded-[9px]" />
                ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-[9px] text-white" style={{ backgroundImage: "var(--brand-gradient)" }}>
                        <ShieldCheck size={14} />
                    </span>
                )}
                <span className="min-w-0">
                    <span className="block truncate text-[10px] font-semibold" style={{ color: INK }}>Backoffice Telemedicina</span>
                    <span className="block text-[8px]" style={{ color: MUTE }}>Seguros Constitución</span>
                </span>
            </div>

            <span className="my-3 block h-px" style={{ background: HAIR }} />

            <nav className="space-y-[3px]">
                {NAV.map((item, i) => {
                    const Icon = item.icon;
                    const on = i === active;
                    return (
                        <span
                            key={item.label}
                            className="flex items-center gap-2 rounded-[9px] px-2 py-[6px] text-[10px]"
                            style={
                                on
                                    ? { background: `${BLUE}1a`, color: BLUE, boxShadow: `inset 0 0 0 1px ${BLUE}2e`, fontWeight: 600 }
                                    : { color: SUB }
                            }
                        >
                            <Icon size={12} />
                            <span className="truncate">{item.label}</span>
                        </span>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-[10px] px-2 py-1.5" style={{ background: "#f2f2f7" }}>
                <span className="flex items-center gap-1.5 text-[8px] font-medium" style={{ color: INK }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                    Entorno DEV
                </span>
                <span className="tm-mono mt-[2px] block truncate text-[7px]" style={{ color: MUTE }}>
                    dconstiapi.segurosconstitucion.com
                </span>
            </div>
        </aside>

        <div className="flex-1 min-w-0">
            <div
                className="flex items-center justify-between rounded-[14px] px-3 py-2"
                style={{ background: "rgba(255,255,255,0.78)", border: "1px solid rgba(0,0,0,0.05)" }}
            >
                <span className="text-[10px] font-medium" style={{ color: INK }}>Seguros Constitución</span>
                <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: "#f2f2f7", color: SUB }}>
                        <Moon size={11} />
                    </span>
                    <span className="text-right">
                        <span className="block text-[9px] font-semibold" style={{ color: INK }}>Arturo Sojo</span>
                        <span className="block text-[8px]" style={{ color: MUTE }}>Administrador</span>
                    </span>
                    <Avatar ini="AS" size={24} />
                    <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: "#f2f2f7", color: SUB }}>
                        <LogOut size={11} />
                    </span>
                </span>
            </div>

            <div className="mt-3">{children}</div>
        </div>
    </div>
);

const PageHead = ({ title, lead, right }: { title: string; lead: string; right?: ReactNode }) => (
    <div className="flex items-end justify-between gap-3">
        <span>
            <span className="block text-[15px] font-semibold tm-tight" style={{ color: INK }}>{title}</span>
            <span className="mt-[2px] block text-[10px]" style={{ color: MUTE }}>{lead}</span>
        </span>
        {right}
    </div>
);

const GhostBtn = ({ children }: { children: ReactNode }) => (
    <span
        className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[10px] font-medium"
        style={{ background: "#ffffff", color: INK, border: `1px solid ${HAIR}` }}
    >
        {children}
    </span>
);

/** 02 · Dashboard, resumen general */
const MockDashboard = () => (
    <MockChrome active={0}>
        <PageHead
            title="Resumen general"
            lead="Vista consolidada del módulo de telemedicina"
            right={
                <GhostBtn>
                    <RefreshCw size={11} /> Actualizar
                </GhostBtn>
            }
        />

        <div className="grid grid-cols-4 gap-2.5 mt-3">
            {KPI.map((k) => {
                const Icon = k.icon;
                return (
                    <div key={k.label} className="tm-paper rounded-[16px] p-3">
                        <div className="flex items-start justify-between gap-2">
                            <span>
                                <span className="block text-[8px] font-medium uppercase tracking-[0.12em]" style={{ color: MUTE }}>
                                    {k.label}
                                </span>
                                <span className="tm-num mt-1.5 block text-[22px] font-semibold leading-none tm-tight" style={{ color: INK }}>
                                    {k.value}
                                </span>
                            </span>
                            <span
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-white"
                                style={{ background: `linear-gradient(135deg, ${k.tone}, ${k.tone}bb)` }}
                            >
                                <Icon size={14} />
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
            <div className="col-span-2 tm-paper rounded-[16px] p-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold" style={{ color: INK }}>Consultas recientes</span>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-medium" style={{ color: BLUE }}>
                        Ver <ArrowUpRight size={10} />
                    </span>
                </div>
                <div className="mt-1.5">
                    {RECIENTES.map((r) => (
                        <div key={r.mail} className="flex items-center gap-2 py-[7px]" style={{ borderTop: `1px solid ${HAIR}` }}>
                            <Avatar ini={r.ini} tone={r.tone} size={24} />
                            <span className="min-w-0 w-[132px]">
                                <span className="block truncate text-[10px] font-medium" style={{ color: INK }}>{r.name}</span>
                                <span className="block truncate text-[8px]" style={{ color: MUTE }}>{r.mail}</span>
                            </span>
                            <span className="flex-1 min-w-0 truncate text-[9px]" style={{ color: SUB }}>{r.motivo}</span>
                            <Pill state={r.state} />
                            <span className="text-right shrink-0">
                                <span className="tm-num block text-[9px]" style={{ color: SUB }}>{r.date}</span>
                                <span className="tm-num block text-[8px]" style={{ color: MUTE }}>{r.time}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="tm-paper rounded-[16px] p-3">
                <span className="text-[11px] font-semibold" style={{ color: INK }}>Consultas</span>
                <div className="relative mx-auto mt-2 h-[104px] w-[104px]">
                    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden>
                        <g transform="rotate(-90 60 60)">
                            {DONUT_ARCS.map((a) => {
                                const len = Math.max(a.pct - 1.1, 0.6);
                                return (
                                    <circle
                                        key={a.key}
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        fill="none"
                                        stroke={STATES[a.key].color}
                                        strokeWidth="16"
                                        pathLength={100}
                                        strokeDasharray={`${len} ${100 - len}`}
                                        strokeDashoffset={-a.off}
                                    />
                                );
                            })}
                        </g>
                    </svg>
                    <span className="absolute inset-0 grid place-items-center">
                        <span className="text-center">
                            <span className="tm-num block text-[17px] font-semibold leading-none" style={{ color: INK }}>{DONUT_TOTAL}</span>
                            <span className="block text-[8px]" style={{ color: MUTE }}>total</span>
                        </span>
                    </span>
                </div>
                <div className="mt-2.5 space-y-[5px]">
                    {DONUT_ARCS.map((a) => (
                        <div key={a.key} className="flex items-center gap-1.5 text-[9px]">
                            <span className="h-2 w-2 rounded-[3px]" style={{ background: STATES[a.key].color }} />
                            <span className="flex-1" style={{ color: SUB }}>{STATES[a.key].label}</span>
                            <span className="tm-num font-medium" style={{ color: INK }}>{a.value}</span>
                            <span className="tm-num w-[34px] text-right" style={{ color: MUTE }}>{a.pct.toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="tm-paper mt-2.5 rounded-[16px] p-3">
            <span className="text-[11px] font-semibold" style={{ color: INK }}>Equipo conectado</span>
            <div className="grid grid-cols-3 gap-2 mt-2">
                {DOCTORES.slice(0, 3).map((d) => (
                    <div key={d.mail} className="flex items-center gap-2 rounded-[12px] p-2" style={{ background: "#f2f2f7" }}>
                        <span className="relative">
                            <Avatar ini={d.ini} size={28} />
                            <span
                                className="absolute -bottom-[1px] -right-[1px] h-[9px] w-[9px] rounded-full"
                                style={{ background: GREEN, boxShadow: "0 0 0 2px #f2f2f7" }}
                            />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-[9px] font-semibold" style={{ color: INK }}>{d.name}</span>
                            <span className="block truncate text-[8px]" style={{ color: MUTE }}>{d.esp}</span>
                        </span>
                        <span
                            className="ml-auto shrink-0 rounded-full px-1.5 py-[2px] text-[7px] font-medium"
                            style={{ background: `${BLUE}1a`, color: BLUE }}
                        >
                            {d.anios}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </MockChrome>
);

/** 03 · Consultas */
const MockConsultas = () => (
    <MockChrome active={5}>
        <PageHead
            title="Consultas"
            lead="Historial y monitoreo de teleconsultas"
            right={
                <span className="rounded-full px-2.5 py-1 text-[9px] font-medium" style={{ background: "#f2f2f7", color: SUB }}>
                    312 consultas
                </span>
            }
        />

        <div className="tm-paper mt-3 rounded-[14px] p-2.5">
            <div className="grid grid-cols-4 gap-2">
                <span className="col-span-2 flex items-center gap-1.5 rounded-[9px] px-2 py-[7px]" style={{ background: "#f2f2f7" }}>
                    <Search size={11} color={MUTE} />
                    <span className="text-[9px]" style={{ color: MUTE }}>Buscar por nombre</span>
                </span>
                {["Todos los usuarios", "Todas"].map((label) => (
                    <span
                        key={label}
                        className="flex items-center justify-between rounded-[9px] px-2 py-[7px] text-[9px]"
                        style={{ background: "#ffffff", border: `1px solid ${HAIR}`, color: INK }}
                    >
                        {label}
                        <Icons.ChevronsUpDown size={10} color={MUTE} />
                    </span>
                ))}

                {["01/08/2026", "12/08/2026"].map((label) => (
                    <span
                        key={label}
                        className="tm-num flex items-center gap-1.5 rounded-[9px] px-2 py-[7px] text-[9px]"
                        style={{ background: "#ffffff", border: `1px solid ${HAIR}`, color: INK }}
                    >
                        <Calendar size={10} color={MUTE} /> {label}
                    </span>
                ))}
                <span
                    className="flex items-center justify-between rounded-[9px] px-2 py-[7px] text-[9px]"
                    style={{ background: "#ffffff", border: `1px solid ${BLUE}55`, color: BLUE, boxShadow: `inset 0 0 0 1px ${BLUE}1a` }}
                >
                    Fecha de consulta
                    <Icons.ChevronsUpDown size={10} color={BLUE} />
                </span>
                <span
                    className="flex items-center justify-between rounded-[9px] px-2 py-[7px] text-[9px]"
                    style={{ background: "#ffffff", border: `1px solid ${HAIR}`, color: INK }}
                >
                    Descendente
                    <Icons.ChevronsUpDown size={10} color={MUTE} />
                </span>
            </div>
            <div className="flex justify-end mt-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-medium" style={{ color: SUB }}>
                    <Undo2 size={10} /> Limpiar filtros
                </span>
            </div>
        </div>

        <div className="tm-paper mt-2.5 overflow-hidden rounded-[16px]">
            <div className="grid grid-cols-[1.35fr_1.35fr_1.5fr_0.8fr_0.9fr_0.8fr_0.8fr_20px] gap-2 px-3 py-2" style={{ background: "#fafafc", borderBottom: `1px solid ${HAIR}` }}>
                {["Paciente", "Doctor", "Motivo", "Estado", "Póliza", "Inicio", "Fin", ""].map((h, i) => (
                    <span key={`${h}-${i}`} className="text-[8px] font-medium uppercase tracking-[0.1em]" style={{ color: MUTE }}>
                        {h}
                    </span>
                ))}
            </div>

            {FILAS.map((f) => (
                <div
                    key={f.poliza[0]}
                    className="grid grid-cols-[1.35fr_1.35fr_1.5fr_0.8fr_0.9fr_0.8fr_0.8fr_20px] items-center gap-2 px-3 py-2"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                >
                    <span className="flex items-center min-w-0 gap-1.5">
                        <Avatar ini={f.pac[0]} tone={BLUE} size={22} />
                        <span className="min-w-0">
                            <span className="block truncate text-[9px] font-medium" style={{ color: INK }}>{f.pac[1]}</span>
                            <span className="block truncate text-[8px]" style={{ color: MUTE }}>{f.pac[2]}</span>
                        </span>
                    </span>
                    <span className="flex items-center min-w-0 gap-1.5">
                        <Avatar ini={f.doc[0]} tone={VIOLET} size={22} />
                        <span className="min-w-0">
                            <span className="block truncate text-[9px] font-medium" style={{ color: INK }}>{f.doc[1]}</span>
                            <span className="block truncate text-[8px]" style={{ color: MUTE }}>{f.doc[2]}</span>
                        </span>
                    </span>
                    <span className="truncate text-[9px]" style={{ color: SUB }}>{f.motivo}</span>
                    <span><Pill state={f.state} /></span>
                    <span>
                        <span className="tm-num block text-[9px]" style={{ color: INK }}>{f.poliza[0]}</span>
                        <span className="mt-[2px] inline-block rounded-full px-1.5 py-[1px] text-[7px]" style={{ border: `1px solid ${HAIR}`, color: MUTE }}>
                            {f.poliza[1]}
                        </span>
                    </span>
                    <span>
                        <span className="tm-num block text-[9px]" style={{ color: INK }}>{f.ini[0]}</span>
                        <span className="tm-num block text-[8px]" style={{ color: MUTE }}>{f.ini[1]}</span>
                    </span>
                    <span>
                        <span className="tm-num block text-[9px]" style={{ color: INK }}>{f.fin[0]}</span>
                        <span className="tm-num block text-[8px]" style={{ color: MUTE }}>{f.fin[1]}</span>
                    </span>
                    <ChevronRight size={12} color="#c7c7cc" />
                </div>
            ))}

            {[0, 1].map((i) => (
                <div key={i} className="grid grid-cols-8 gap-2 px-3 py-[11px]" style={{ borderBottom: `1px solid ${HAIR}` }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
                        <span key={c} className="tm-skel block h-2 rounded-full" style={{ background: "#ececf0", animationDelay: `${(i * 8 + c) * 0.06}s` }} />
                    ))}
                </div>
            ))}

            <div className="flex items-center justify-between px-3 py-2.5">
                <span className="tm-num text-[9px]" style={{ color: MUTE }}>312 registros · Página 2 de 32</span>
                <span className="flex items-center gap-1">
                    {[
                        { l: <ChevronLeft size={11} />, k: "prev", on: false },
                        { l: "1", k: "1", on: false },
                        { l: "2", k: "2", on: true },
                        { l: "3", k: "3", on: false },
                        { l: "···", k: "gap", on: false },
                        { l: "32", k: "32", on: false },
                        { l: <ChevronRight size={11} />, k: "next", on: false },
                    ].map((b) => (
                        <span
                            key={b.k}
                            className="grid h-[22px] min-w-[22px] place-items-center rounded-[7px] px-1 text-[9px] font-medium"
                            style={
                                b.on
                                    ? { background: BLUE, color: "#ffffff" }
                                    : { background: "#ffffff", color: SUB, border: `1px solid ${HAIR}` }
                            }
                        >
                            {b.l}
                        </span>
                    ))}
                </span>
            </div>
        </div>
    </MockChrome>
);

/** 04 · Doctores en línea */
const MockOnline = () => (
    <MockChrome active={4}>
        <PageHead
            title="Doctores en línea"
            lead="Equipo médico actualmente conectado"
            right={
                <GhostBtn>
                    <RefreshCw size={11} /> Actualizar
                </GhostBtn>
            }
        />

        <div className="grid grid-cols-3 gap-2.5 mt-3">
            {DOCTORES.map((d) => (
                <div key={d.mail} className="tm-paper tm-lift flex items-center gap-2.5 rounded-[16px] p-3">
                    <span className="relative shrink-0">
                        <Avatar ini={d.ini} size={38} />
                        <span
                            className="absolute -bottom-[1px] -right-[1px] h-[12px] w-[12px] rounded-full"
                            style={{ background: GREEN, boxShadow: "0 0 0 2.5px #ffffff" }}
                        />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-[10px] font-semibold" style={{ color: INK }}>{d.name}</span>
                        <span className="block truncate text-[8px]" style={{ color: MUTE }}>{d.mail}</span>
                        <span className="mt-1 flex items-center gap-1.5">
                            <span className="rounded-full px-1.5 py-[1px] text-[7px] font-medium" style={{ background: `${BLUE}1a`, color: BLUE }}>
                                {d.esp}
                            </span>
                            <span className="text-[8px]" style={{ color: MUTE }}>{d.anios}</span>
                        </span>
                        <span className="block mt-1">
                            <Stars rating={d.rating} />
                        </span>
                    </span>
                </div>
            ))}
        </div>

        <div className="tm-paper mt-2.5 grid place-items-center rounded-[16px] px-4 py-6 text-center">
            <Wifi size={22} strokeWidth={1.3} color="#c7c7cc" />
            <span className="mt-2 block text-[10px] font-semibold" style={{ color: INK }}>Aún no hay doctores conectados</span>
            <span className="mt-[2px] block text-[9px]" style={{ color: MUTE }}>Equipo médico actualmente conectado</span>
        </div>
    </MockChrome>
);

/** 05 · Detalle de consulta (diálogo) */
const DlgField = ({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) => (
    <span className="block">
        <span className="block text-[7px] font-medium uppercase tracking-[0.12em]" style={{ color: MUTE }}>{label}</span>
        <span className={`mt-[2px] block text-[9px] ${mono ? "tm-mono" : ""}`} style={{ color: INK }}>{value}</span>
    </span>
);

const DlgSection = ({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) => (
    <div className="rounded-[16px] p-2.5" style={{ background: "#fafafc", border: `1px solid ${HAIR}` }}>
        <span className="flex items-center gap-1.5">
            <span className="grid h-[18px] w-[18px] place-items-center rounded-[6px]" style={{ background: `${BLUE}1a`, color: BLUE }}>
                <Icon size={10} />
            </span>
            <span className="text-[10px] font-semibold" style={{ color: INK }}>{title}</span>
        </span>
        <div className="mt-2">{children}</div>
    </div>
);

const MockDialog = () => (
    <div className="relative min-w-[560px] bg-[#f5f5f7] p-3">
        <div aria-hidden className="absolute inset-0" style={{ background: "rgba(0,0,0,0.28)" }} />
        <div className="relative w-full max-w-[440px] mx-auto rounded-[20px] p-3.5" style={{ background: "#ffffff", boxShadow: "0 40px 90px -30px rgba(16,24,40,0.55)" }}>
            <div className="flex items-center gap-2">
                <Pill state="activa" />
                <span className="tm-mono text-[8px]" style={{ color: MUTE }}>ID de consulta: 4f2a9c1e…</span>
            </div>

            <div className="mt-2.5 space-y-2">
                <DlgSection icon={User} title="Paciente">
                    <span className="flex items-center gap-2">
                        <Avatar ini="MV" size={26} />
                        <span className="text-[10px] font-semibold" style={{ color: INK }}>María Villalba</span>
                        <span className="rounded-full px-1.5 py-[1px] text-[7px]" style={{ background: "#f2f2f7", color: SUB }}>Paciente</span>
                    </span>
                    <span className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                        <DlgField label="Correo" value="maria.villalba@gmail.com" />
                        <DlgField label="Identificación" value="V-27815456-0" mono />
                        <DlgField label="Género" value="Femenino" />
                        <DlgField label="Fecha de nacimiento" value="14/03/1991" />
                        <DlgField label="Calificación" value={<Stars rating={4.8} />} />
                        <DlgField label="Valoraciones" value="9 · 3 reseñas" />
                    </span>
                </DlgSection>

                <DlgSection icon={Stethoscope} title="Doctor">
                    <span className="flex items-center gap-2">
                        <Avatar ini="LP" tone={VIOLET} size={26} />
                        <span className="text-[10px] font-semibold" style={{ color: INK }}>Dr. Luis Peraza</span>
                        <span className="rounded-full px-1.5 py-[1px] text-[7px]" style={{ background: `${GREEN}1f`, color: GREEN }}>En línea</span>
                    </span>
                    <span className="mt-2 block h-px" style={{ background: HAIR }} />
                    <span className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                        <DlgField label="Especialidad" value="Cardiología" />
                        <DlgField label="N.º de colegiado" value="MPPS 48211" mono />
                        <DlgField label="Años de experiencia" value="9 años" />
                        <DlgField label="Calificación" value={<Stars rating={4.6} />} />
                    </span>
                </DlgSection>

                <DlgSection icon={ShieldCheck} title="Póliza de seguro">
                    <span className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        <DlgField label="Número" value="0084 2291" mono />
                        <DlgField label="Tipo" value="Individual" />
                        <DlgField label="Estado" value="Vigente" />
                        <DlgField label="Emisión / vigencia" value="01/01/2026 — 31/12/2026" />
                        <DlgField label="Titular" value="María Villalba" />
                        <DlgField label="Identificación" value="V-27815456-0" mono />
                    </span>
                </DlgSection>

                <DlgSection icon={FileText} title="Datos de la consulta">
                    <span className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        <DlgField label="Motivo" value="Dolor abdominal persistente" />
                        <DlgField label="Sala virtual" value="sala-4f2a9c1e" mono />
                        <DlgField label="Token de sesión" value="eyJhbGciOiJIUzI1…" mono />
                        <DlgField label="Creación" value="12/08/2026 09:39" />
                        <DlgField label="Inicio" value="12/08/2026 09:41" />
                        <DlgField label="Fin" value="En curso" />
                    </span>
                </DlgSection>
            </div>
        </div>
    </div>
);

/* Las cinco pantallas documentadas, con su lengüeta y su folio. */
const SCREENS: { tone: string; url: string; node: ReactNode }[] = [
    { tone: BLUE, url: "constitucion/login", node: <MockLogin /> },
    { tone: VIOLET, url: "constitucion/dashboard", node: <MockDashboard /> },
    { tone: AMBER, url: "constitucion/consultas", node: <MockConsultas /> },
    { tone: GREEN, url: "constitucion/doctores/en-linea", node: <MockOnline /> },
    { tone: RED, url: "constitucion/consultas/4f2a9c1e", node: <MockDialog /> },
];

/* ─────────────── Diagrama de derivaciones (arquitectura) ─────────────── */

const Wire = ({ d, dur, delay = 0 }: { d: string; dur: number; delay?: number }) => (
    <g>
        <path d={d} fill="none" stroke={BLUE} strokeOpacity={0.2} strokeWidth={1.4} />
        <path
            d={d}
            pathLength={100}
            className="tm-wire"
            style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
            fill="none"
            stroke={BLUE}
            strokeWidth={2.4}
            strokeLinecap="round"
        />
    </g>
);

const Box = ({ x, y, w, h, label, sub, tone = BLUE, strong = false }: {
    x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: string; strong?: boolean;
}) => (
    <g>
        <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={14}
            fill={strong ? tone : "#ffffff"}
            stroke={strong ? tone : "rgba(0,0,0,0.08)"}
            strokeWidth={1}
        />
        <text
            x={x + w / 2}
            y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            fill={strong ? "#ffffff" : INK}
        >
            {label}
        </text>
        {sub && (
            <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={10} fill={strong ? "rgba(255,255,255,0.75)" : MUTE}>
                {sub}
            </text>
        )}
    </g>
);

const MODULES = ["auth", "dashboard", "users", "doctors", "consult"];

const ArchDiagram = () => (
    <svg viewBox="0 0 900 486" className="w-full min-w-[720px]" aria-hidden>
        {MODULES.map((m, i) => {
            const x = 25 + i * 175;
            return (
                <g key={m}>
                    <Box x={x} y={24} w={150} h={54} label={m} sub="pages · hooks · api" />
                    <Wire d={`M${x + 75} 78 V120`} dur={2.6} delay={i * 0.42} />
                </g>
            );
        })}

        <line x1="100" y1="120" x2="800" y2="120" stroke={BLUE} strokeOpacity={0.2} strokeWidth={1.4} />
        <text x="100" y="110" fontSize={10} fill={MUTE}>src/features/ — feature-first</text>
        <Wire d="M450 120 V170" dur={1.5} />

        <Box x={310} y={170} w={280} h={56} label="shared/api · cliente axios" sub="apiAxios · JSON / multipart / urlencoded" />
        <Wire d="M450 226 V330" dur={1.2} />

        {[
            { cy: 254, label: "interceptor de petición", note: "Bearer · app-key · Accept-Language" },
            { cy: 298, label: "interceptor de respuesta", note: "401 → logout · 5xx → modal global" },
        ].map((r) => (
            <g key={r.label}>
                <circle cx="450" cy={r.cy} r="13" fill="#ffffff" stroke={BLUE} strokeOpacity={0.55} strokeWidth={1.6} />
                <circle cx="450" cy={r.cy} r="5" fill={BLUE} fillOpacity={0.35} />
                <text x="478" y={r.cy - 1} fontSize={11} fontWeight={600} fill={INK}>{r.label}</text>
                <text x="478" y={r.cy + 12} fontSize={9.5} fill={MUTE}>{r.note}</text>
            </g>
        ))}

        <Box x={310} y={330} w={280} h={56} label="api-proxy.php + .htaccess" sub="pasarela cURL · sin CORS, sin mod_proxy" />
        <Wire d="M450 386 V430" dur={1.8} />
        <Box x={250} y={430} w={400} h={46} label="dconstiapi.segurosconstitucion.com" tone={BLUE} strong />

        <g>
            <rect x="30" y="248" width="216" height="100" rx="14" fill="#ffffff" stroke="rgba(0,0,0,0.07)" />
            <text x="46" y="272" fontSize={11} fontWeight={600} fill={INK}>src/shared/</text>
            <text x="46" y="292" fontSize={9.5} fill={MUTE}>store RTK · 4 slices persistidos</text>
            <text x="46" y="308" fontSize={9.5} fill={MUTE}>9 primitivas de interfaz (CVA)</text>
            <text x="46" y="324" fontSize={9.5} fill={MUTE}>7 hooks · usePagination</text>
            <text x="46" y="340" fontSize={9.5} fill={MUTE}>diccionario de textos</text>
        </g>
        <g>
            <rect x="654" y="248" width="216" height="100" rx="14" fill="#ffffff" stroke="rgba(0,0,0,0.07)" />
            <text x="670" y="272" fontSize={11} fontWeight={600} fill={INK}>src/app/</text>
            <text x="670" y="292" fontSize={9.5} fill={MUTE}>providers + rutas</text>
            <text x="670" y="308" fontSize={9.5} fill={MUTE}>React.lazy en todas las páginas</text>
            <text x="670" y="324" fontSize={9.5} fill={MUTE}>guard RequireAuth sobre el layout</text>
            <text x="670" y="340" fontSize={9.5} fill={MUTE}>basename = BASE_URL</text>
        </g>
    </svg>
);

/* ─────────────────────────────── Landing ─────────────────────────────── */

const Landing = () => {
    const reduce = useReducedMotion();
    const [screen, setScreen] = useState(0);
    const heroMeta = [p.stack[0].items[0], p.stack[0].items[1], p.stack[1].items[0]].join(" · ");

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* Halos fijos detrás de todo el scroll, como el layout real de la app */}
            <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
                <span className="absolute -left-32 top-[6%] h-[460px] w-[460px] rounded-full blur-[130px]" style={{ background: "rgba(0,113,227,0.07)" }} />
                <span className="absolute -right-32 top-[58%] h-[460px] w-[460px] rounded-full blur-[130px]" style={{ background: "rgba(94,92,230,0.06)" }} />
            </div>

            {/* ───────────────────────── HÉROE ───────────────────────── */}
            <section className="relative z-10 px-4 pt-28 pb-16 md:px-6 md:pt-36 md:pb-24" style={{ color: INK }}>
                <div className="grid items-center max-w-6xl gap-12 mx-auto lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <span className="tm-mono inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]" style={{ background: `${BLUE}12`, color: BLUE }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                            Expediente 2026 · Seguros Constitución
                        </span>

                        <h1 className="mt-6 text-4xl font-semibold leading-[1.03] tm-tight md:text-6xl">
                            <RevealWords text={p.name} />
                        </h1>

                        {/* El pulso subraya el titular: no es fondo, es parte de la frase */}
                        <div className="relative mt-1 h-[54px] w-full overflow-hidden">
                            <Pulse d={ECG_HERO} height={54} className="w-full h-[54px]" />
                        </div>

                        <p className="max-w-xl text-base leading-relaxed md:text-lg" style={{ color: SUB }}>
                            {p.tagline}
                        </p>

                        <p className="tm-mono mt-5 text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTE }}>
                            {heroMeta}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <Chip>{p.category}</Chip>
                            <Chip>{p.year}</Chip>
                        </div>

                        <p className="max-w-xl mt-5 text-sm leading-relaxed" style={{ color: SUB }}>
                            <span className="font-medium" style={{ color: INK }}>Rol.</span> {p.role}
                        </p>

                        <p className="max-w-xl mt-3 text-sm leading-relaxed" style={{ color: SUB }}>
                            <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: GREEN }}>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                                Estado.
                            </span>{" "}
                            {p.status}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-8">
                            <BrandButton href="#tm-expediente">
                                <ClipboardList size={16} /> Abrir el expediente
                            </BrandButton>
                            {p.links.web && (
                                <BrandButton href={p.links.web} variant="outline">
                                    <ArrowUpRight size={16} /> Ver el panel
                                </BrandButton>
                            )}
                            {p.links.demo && !p.links.web && (
                                <BrandButton href={p.links.demo} variant="outline">
                                    <ArrowUpRight size={16} /> Ver demo
                                </BrandButton>
                            )}
                            {p.links.github && (
                                <BrandButton href={p.links.github} variant="outline">
                                    <Icons.Github size={16} /> Ver el código
                                </BrandButton>
                            )}
                            {!p.links.web && !p.links.demo && !p.links.github && !p.links.play && (
                                <a
                                    href="https://wa.me/584168624450"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-300"
                                    style={{ border: `1px solid ${BLUE}40`, color: BLUE }}
                                >
                                    <MessageCircle size={16} /> Pedir una demo guiada
                                </a>
                            )}
                        </div>

                        {!p.links.web && !p.links.demo && !p.links.github && (
                            <p className="tm-mono mt-4 text-[10px] uppercase tracking-[0.14em]" style={{ color: "#aeaeb2" }}>
                                Panel interno de cliente · sin acceso público
                            </p>
                        )}
                    </div>

                    {/* Pila de fichas clínicas */}
                    <div className="tm-stack relative mx-auto h-[330px] w-full max-w-[420px] sm:h-[360px]">
                        {HERO_CARDS.map((card, i) => (
                            <div
                                key={card.tab}
                                className={reduce ? "absolute inset-x-2 top-6" : "tm-drop absolute inset-x-2 top-6"}
                                style={reduce ? undefined : { animationDelay: `${0.12 + i * 0.09}s` }}
                            >
                                <div className={`tm-fan tm-fan-${i}`}>
                                    <FileCard tab={card.tab} tone={card.tone} folio={`0${i + 1}`}>
                                        <div className="p-5">
                                            <p className="text-[13px] font-semibold tm-tight" style={{ color: INK }}>{card.title}</p>
                                            <span className="my-3 block h-px" style={{ background: HAIR }} />
                                            <div className="space-y-2">
                                                {card.rows.map(([k, v]) => (
                                                    <div key={k} className="flex items-baseline justify-between gap-3">
                                                        <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: MUTE }}>{k}</span>
                                                        <span className="text-[12px] font-medium text-right" style={{ color: INK }}>{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 mt-4">
                                                <MiniPulse tone={card.tone} delay={i * 0.4} />
                                                <span className="tm-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: MUTE }}>
                                                    dconstiapi · DEV
                                                </span>
                                            </div>
                                        </div>
                                    </FileCard>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────────── SIGNOS VITALES (métricas) ───────────────────── */}
            <section className="relative z-10 px-4 py-16 md:px-6 md:py-20" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <p className="tm-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: MUTE }}>
                            Signos vitales
                        </p>
                    </Reveal>

                    <Stagger className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 lg:grid-cols-6" stagger={0.07}>
                        {p.metrics.map((m, i) => {
                            const tone = METRIC_TONES[i % METRIC_TONES.length];
                            const Icon = METRIC_ICONS[i % METRIC_ICONS.length];
                            return (
                                <StaggerItem key={m.label}>
                                    <div className="tm-paper tm-lift h-full rounded-[18px] p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="tm-num">
                                                <CountMetric value={m.value} label={m.label} />
                                            </span>
                                            <span
                                                className="grid rounded-[10px] h-8 w-8 shrink-0 place-items-center text-white"
                                                style={{ background: `linear-gradient(135deg, ${tone}, ${tone}bb)` }}
                                            >
                                                <Icon size={14} />
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <MiniPulse tone={tone} delay={i * 0.22} />
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ─────────────── MOTIVO DE CONSULTA / PLAN DE TRATAMIENTO ─────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="01 / Anamnesis"
                        title={
                            <>
                                Lo que había, <span className="brand-gradient-text">y lo que hay ahora</span>
                            </>
                        }
                        lead="Un servicio de telemedicina repartido entre endpoints, contado en dos hojas del mismo expediente."
                    />

                    <div className="grid gap-8 mt-14 md:grid-cols-2 md:gap-6">
                        <Reveal direction="right">
                            <FileCard tab="Motivo de consulta" tone={RED} folio="A-01" className="h-full">
                                <div className="p-6 md:p-8">
                                    <p className="text-lg font-semibold tm-tight md:text-xl" style={{ color: INK }}>
                                        Sin consola, todo pasa por el swagger
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed md:text-[15px]" style={{ color: SUB }}>
                                        {p.problem}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {["CORS cerrado", "Sin métricas", "Subcarpeta", "Sin mod_proxy"].map((t) => (
                                            <span key={t} className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: `${RED}12`, color: RED }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </FileCard>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <FileCard tab="Plan de tratamiento" tone={BLUE} folio="A-02" className="h-full">
                                <div className="p-6 md:p-8">
                                    <p className="text-lg font-semibold tm-tight md:text-xl" style={{ color: INK }}>
                                        Siete rutas que traducen los endpoints
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed md:text-[15px]" style={{ color: SUB }}>
                                        {p.solution}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {["Dashboard compuesto", "Filtros del swagger", "Proxy propio", "ApiResult"].map((t) => (
                                            <span key={t} className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: `${BLUE}12`, color: BLUE }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </FileCard>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── HALLAZGOS ───────────────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / Hallazgos"
                        title={
                            <>
                                Cinco piezas que <span className="brand-gradient-text">sostienen la consola</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            const tone = [BLUE, VIOLET, GREEN, AMBER, SKY][i % 5];
                            return (
                                <StaggerItem key={h.title} className="h-full">
                                    <div className="tm-paper tm-lift h-full rounded-[22px] p-6">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="grid rounded-[12px] h-10 w-10 place-items-center"
                                                style={{ background: `${tone}16`, color: tone }}
                                            >
                                                <Icon size={18} />
                                            </span>
                                            <span className="tm-mono text-[10px] tracking-[0.16em]" style={{ color: "#c7c7cc" }}>
                                                H-0{i + 1}
                                            </span>
                                        </div>
                                        <h3 className="mt-5 text-[17px] font-semibold leading-snug tm-tight" style={{ color: INK }}>
                                            {h.title}
                                        </h3>
                                        <p className="mt-2.5 text-sm leading-relaxed" style={{ color: SUB }}>
                                            {h.description}
                                        </p>
                                        <span className="block mt-5 h-px" style={{ background: HAIR }} />
                                        <div className="mt-3">
                                            <MiniPulse tone={tone} delay={i * 0.3} />
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ─────────────────── EL EXPEDIENTE: las pantallas ─────────────────── */}
            <section id="tm-expediente" className="relative z-10 px-4 py-20 scroll-mt-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / El expediente"
                        title={
                            <>
                                Cinco pantallas, <span className="brand-gradient-text">una misma consola</span>
                            </>
                        }
                        lead="Del login al detalle de una teleconsulta. Cada ficha del expediente es una pantalla real del panel, recreada aquí en HTML y CSS."
                    />

                    <div className="grid gap-6 mt-12 lg:grid-cols-[210px_1fr]">
                        {/* Pestañas verticales tipo archivador */}
                        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible scrollbar-none">
                            {p.uiScreens.map((s, i) => {
                                const on = i === screen;
                                const tone = SCREENS[i].tone;
                                return (
                                    <button
                                        key={s.name}
                                        type="button"
                                        onClick={() => setScreen(i)}
                                        className="flex shrink-0 items-center gap-3 rounded-[14px] px-3 py-3 text-left transition-all duration-300 lg:shrink"
                                        style={
                                            on
                                                ? { background: `${BLUE}14`, boxShadow: `inset 0 0 0 1px ${BLUE}33`, color: BLUE }
                                                : { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.05)", color: SUB }
                                        }
                                    >
                                        <span className="h-8 w-[3px] shrink-0 rounded-full" style={{ background: on ? tone : HAIR }} />
                                        <span className="min-w-0">
                                            <span className="tm-mono block text-[9px] tracking-[0.18em]" style={{ color: on ? BLUE : MUTE }}>
                                                0{i + 1}/0{p.uiScreens.length}
                                            </span>
                                            <span className="block whitespace-nowrap text-[13px] font-medium lg:whitespace-normal">
                                                {s.name}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}

                            <div className="hidden lg:block rounded-[14px] p-3 tm-glass mt-2">
                                <p className="tm-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: MUTE }}>
                                    Materiales
                                </p>
                                <div className="mt-2 space-y-1.5 text-[11px]" style={{ color: SUB }}>
                                    <p>Vidrio esmerilado · backdrop-blur</p>
                                    <p>Papel de ficha · sombra en 3 capas</p>
                                    <p>Radios de 16 a 30 px</p>
                                </div>
                            </div>
                        </div>

                        {/* Ficha activa */}
                        <div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="tm-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTE }}>
                                    Folio 0{screen + 1} — {p.uiScreens[screen].name}
                                </span>
                                <span className="hidden sm:flex items-center gap-1.5">
                                    {SCREENS.map((s, i) => (
                                        <span
                                            key={s.url}
                                            className="h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: i === screen ? 22 : 8, background: i === screen ? s.tone : HAIR }}
                                        />
                                    ))}
                                </span>
                            </div>

                            <BrowserFrame dark={false} url={SCREENS[screen].url}>
                                <div className="overflow-x-auto scrollbar-none">{SCREENS[screen].node}</div>
                            </BrowserFrame>

                            <div className="flex items-center justify-between gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setScreen((s) => (s === 0 ? SCREENS.length - 1 : s - 1))}
                                    className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
                                    style={{ color: SUB }}
                                >
                                    <ChevronLeft size={14} /> Anterior
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setScreen((s) => (s === SCREENS.length - 1 ? 0 : s + 1))}
                                    className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
                                    style={{ color: BLUE }}
                                >
                                    Siguiente ficha <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* El único activo gráfico del proyecto: el icono real de la app */}
                    {icon && (
                        <Reveal className="mt-14">
                            <div className="tm-glass flex flex-col items-center gap-4 rounded-[22px] p-6 sm:flex-row sm:items-center sm:gap-6 md:p-8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={icon.src} alt={icon.caption} className="h-16 w-16 rounded-[18px] shrink-0 anim-float" />
                                <div>
                                    <p className="tm-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTE }}>
                                        Identidad
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed" style={{ color: SUB }}>
                                        {icon.caption}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            {/* ─────────────── HOJA DE EXPLORACIÓN: funcionalidades ─────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / Hoja de exploración"
                        title={
                            <>
                                Todo lo que <span className="brand-gradient-text">ya responde</span>
                            </>
                        }
                        lead="Dieciséis comportamientos verificados sobre la API real del cliente."
                    />

                    <Stagger className="grid gap-x-6 mt-12 md:grid-cols-2" stagger={0.035}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={14}>
                                <div
                                    className="flex items-start gap-3 py-3.5 group"
                                    style={{ borderBottom: `1px solid ${HAIR}` }}
                                >
                                    <span
                                        className="tm-mono mt-[2px] shrink-0 rounded-[6px] px-1.5 py-[3px] text-[9px] font-semibold tracking-[0.08em] transition-colors duration-300"
                                        style={{ background: "#f2f2f7", color: MUTE }}
                                    >
                                        F-{String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-[13px] leading-relaxed md:text-sm" style={{ color: SUB }}>
                                        {f}
                                    </span>
                                    <Icons.Check
                                        size={14}
                                        className="ml-auto mt-[3px] shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        color={GREEN}
                                    />
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────────────── INSTRUMENTAL: stack ───────────────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead index="05 / Instrumental" title="Con qué está construido" />

                    <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06} className="h-full">
                                <div className="tm-paper tm-lift h-full rounded-[20px] p-5">
                                    <div className="flex items-center justify-between">
                                        <p className="tm-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: BLUE }}>
                                            {group.group}
                                        </p>
                                        <span className="tm-mono tm-num text-[10px]" style={{ color: "#c7c7cc" }}>
                                            {String(group.items.length).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-[8px] px-2 py-1 text-[11px]"
                                                style={{ background: "#f2f2f7", color: SUB }}
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

            {/* ────────────── DERIVACIONES: arquitectura ────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / Derivaciones"
                        title={
                            <>
                                Cómo viaja <span className="brand-gradient-text">una petición</span>
                            </>
                        }
                        lead="Cinco módulos, un cliente axios con dos interceptores y una pasarela propia. El tráfico se dibuja como pulsos, no como flechas."
                    />

                    <Reveal className="mt-12">
                        <div className="tm-paper overflow-hidden rounded-[24px]">
                            <div className="tm-graph overflow-x-auto p-4 md:p-8">
                                <ArchDiagram />
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1} className="mt-6">
                        <div className="tm-glass rounded-[22px] p-6 md:p-8">
                            <p className="tm-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTE }}>
                                Nota de arquitectura
                            </p>
                            <p className="mt-4 text-sm leading-relaxed md:text-[15px]" style={{ color: SUB }}>
                                {p.architecture}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ─────────────── HISTORIAL DE INCIDENCIAS: retos ─────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="07 / Historial de incidencias"
                        title={
                            <>
                                Cinco cosas que <span className="brand-gradient-text">costaron trabajo</span>
                            </>
                        }
                    />

                    <div className="relative mt-14 pl-8 md:pl-40">
                        <span
                            aria-hidden
                            className="absolute top-2 bottom-2 left-[7px] w-px md:left-[135px]"
                            style={{ background: HAIR }}
                        />

                        <div className="space-y-10 md:space-y-14">
                            {p.challenges.map((c, i) => {
                                const tone = [RED, AMBER, VIOLET, GREEN, BLUE][i % 5];
                                return (
                                    <Reveal key={c.problem.slice(0, 32)} delay={i * 0.05}>
                                        <div className="relative">
                                            <span
                                                aria-hidden
                                                className="tm-beat absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full md:-left-[133px]"
                                                style={{ background: tone, boxShadow: `0 0 0 4px ${tone}22`, animationDelay: `${i * 0.3}s` }}
                                            />
                                            <span
                                                className="tm-mono absolute hidden md:block text-[10px] uppercase tracking-[0.14em] md:-left-40 md:top-1 md:w-[88px] md:text-right"
                                                style={{ color: MUTE }}
                                            >
                                                INC-0{i + 1}
                                            </span>

                                            <p className="tm-mono mb-2 text-[10px] uppercase tracking-[0.2em] md:hidden" style={{ color: MUTE }}>
                                                INC-0{i + 1}
                                            </p>

                                            <p className="text-base font-medium leading-relaxed md:text-lg tm-tight" style={{ color: INK }}>
                                                {c.problem}
                                            </p>

                                            <div className="tm-glass mt-4 rounded-[18px] p-5 md:p-6">
                                                <p className="tm-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: tone }}>
                                                    Resolución
                                                </p>
                                                <p className="mt-2.5 text-sm leading-relaxed" style={{ color: SUB }}>
                                                    {c.solution}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── EPICRISIS: resumen ───────────────────────── */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="max-w-3xl mx-auto">
                    <SectionHead index="08 / Epicrisis" title="El proyecto, en cuatro párrafos" />

                    <Stagger className="mt-10 space-y-6" stagger={0.1}>
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={paragraph.slice(0, 24)}>
                                <div className="flex gap-4">
                                    <span className="tm-mono shrink-0 pt-1 text-[10px] tracking-[0.14em]" style={{ color: "#c7c7cc" }}>
                                        §{i + 1}
                                    </span>
                                    <p
                                        className={i === 0 ? "text-lg leading-relaxed md:text-xl tm-tight" : "text-sm leading-relaxed md:text-[15px]"}
                                        style={{ color: i === 0 ? INK : SUB }}
                                    >
                                        {paragraph}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────────────── Cinta de estados ───────────────────────── */}
            <div
                className="relative z-10 py-5 tm-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: MUTE, borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}
            >
                <Marquee
                    items={[
                        "Activa",
                        "En espera",
                        "Finalizada",
                        "Rechazada",
                        "/auth/login",
                        "/users",
                        "/doctors",
                        "/doctors/online",
                        "/consult",
                        "/reviews",
                    ]}
                    speed={38}
                    separator="·"
                />
            </div>

            {/* ───────── CIERRE: el pulso se aplana y termina en el escudo ───────── */}
            <div className="relative z-10 px-4 pt-16 md:px-6">
                <div className="relative flex items-center max-w-6xl mx-auto">
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <Pulse d={ECG_FLAT} height={70} className="w-full h-[70px]" base={0.18} />
                    </div>
                    {icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={icon.src} alt="" className="h-9 w-9 rounded-[11px] shrink-0 -ml-1" />
                    ) : (
                        <span className="grid rounded-[11px] h-9 w-9 shrink-0 place-items-center text-white" style={{ backgroundImage: "var(--brand-gradient)" }}>
                            <ShieldCheck size={18} />
                        </span>
                    )}
                </div>
            </div>

            <div className="relative z-10 pb-32" style={{ color: INK }}>
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una consola que convierte un swagger en operación diaria: dashboard compuesto, listados con filtros fieles al contrato, sesión resuelta en los interceptores y despliegue en subcarpeta sin tocar el backend. Si tienes una API y te falta el panel, ése es exactamente el trabajo."
                />
                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="tm-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-100"
                        style={{ color: MUTE }}
                    >
                        <IdCard size={13} /> Cerrar expediente <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
