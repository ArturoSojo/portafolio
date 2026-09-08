"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowRight, Mic, Play, Trash2, WifiOff } from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

/**
 * Redondea un numero destinado a un atributo SVG. El navegador reserializa los
 * atributos numericos de SVG con menos precision que el renderizador del
 * servidor, y la diferencia dispara un fallo de hidratacion de React.
 */
const svgNum = (n: number) => Number(n.toFixed(3));

const p = getProject("robust-pickleball")!;
const nxt = nextProject("robust-pickleball");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const mediaOf = (file: string) => p.media.find((m) => m.src.endsWith(file));
const appIcon = mediaOf("icon.png");
const markSvg = mediaOf("mark.svg");
const brandSheet = p.media;

const metricOf = (needle: string) => p.metrics.find((m) => m.label.includes(needle));
const heroMetrics = [metricOf("pantallas"), metricOf("Cloud Functions"), metricOf("idiomas"), metricOf("habilidades")]
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

/* Colores del tema claro del producto: los mockups son fieles a la app, que prioriza el tema claro. */
const INK = "#121212";
const MUTED = "#6B6B72";
const CANVAS = "#F7F7F8";
const LINE = "#E4E4E7";
const RED_INK = "#D62A12";
const BRAND = "#F5361B";
const GREEN = "#15803D";
const AMBER = "#A16207";

/* Las cuatro estaciones del ciclo, tal como las cuenta el resumen del proyecto. */
const CYCLE = [
    { code: "01", title: "Dicta", text: "30 a 90 segundos al bajar de la cancha. El audio se escribe en disco y se encola antes de tocar la red." },
    { code: "02", title: "Estructura", text: "Gemini 2.5 Flash recibe el URI de Storage y devuelve ejercicios, series contadas, tareas y claves." },
    { code: "03", title: "Revisa y publica", text: "El coach corrige sobre la transcripción literal y publica con un toque. La IA nunca cambia el estado." },
    { code: "04", title: "El alumno recibe", text: "El servidor arma con lista blanca su proyección, recalcula el Player DNA y programa el recordatorio." },
];

/* Reglas del producto, acotadas como en un plano. Salen de highlights, features y challenges. */
const RULES = [
    {
        n: "01",
        title: "La IA nunca publica",
        text: "La publicación del reporte es manual. El modelo propone un borrador; el estado de la clase sólo lo cambia una persona.",
    },
    {
        n: "02",
        title: "La omisión nunca borra",
        text: "El servidor recibe el cuaderno entero y sólo acepta añadir, corregir con justificación o eliminar con justificación. Lo omitido se restituye y se anota donde el coach lo ve.",
    },
    {
        n: "03",
        title: "Dos unidades que no se convierten",
        text: "Bolas contadas (made/attempted) y puntuación 0-100 por serie viven separadas. Ningún denominador se deduce: o lo dijo el coach o es el tamaño de serie del catálogo.",
    },
    {
        n: "04",
        title: "El dominio es consistencia",
        text: "Una serie hundida deja el ejercicio en ámbar aunque el promedio sea alto. Y con menos de tres mediciones no se declara tendencia.",
    },
];

/* Los dos lados de la red: lo que toca cada rol. Es la arquitectura de permisos del proyecto. */
const COACH_SIDE = [
    "Panel con avisos, cola de trabajo y quién entra hoy",
    "Alumnos, fichas y notas privadas del entrenador",
    "Clases, borradores y publicación manual",
    "Estudio de dictado y asistente conversacional",
    "Court ID: la batería versionada de diez ejercicios",
];
const PLAYER_SIDE = [
    "Panel propio, sin nada de la organización",
    "Player DNA con cobertura declarada",
    "Progreso sobre bolas contadas",
    "Historial de clases que se acumula",
    "Tareas con id estable y su respuesta al coach",
];

const css = `
.rp-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
.rp-display { font-weight: 900; letter-spacing: -0.035em; font-stretch: 87.5%; }
.rp-grid {
  background-image:
    linear-gradient(to right, rgba(245, 54, 27, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(245, 54, 27, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}
.rp-grid-strong {
  background-image:
    linear-gradient(to right, rgba(245, 54, 27, 0.10) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(245, 54, 27, 0.10) 1px, transparent 1px);
  background-size: 40px 40px;
}
.rp-hatch {
  background-image: repeating-linear-gradient(45deg, rgba(245, 54, 27, 0.10) 0 1px, transparent 1px 8px);
}
.rp-line { stroke-dashoffset: 1; }
.rp-drawn .rp-line { animation: rp-draw 900ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes rp-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.rp-trace {
  stroke-dasharray: 760;
  stroke-dashoffset: 760;
  animation: rp-trace 6s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
@keyframes rp-trace {
  0% { stroke-dashoffset: 760; opacity: 1; }
  46% { stroke-dashoffset: 0; opacity: 1; }
  84% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
.rp-ring { animation: rp-ring 1600ms cubic-bezier(0.4, 0, 0.2, 1) infinite; }
@keyframes rp-ring {
  0% { transform: scale(1); opacity: 0.5; }
  72% { transform: scale(1.95); opacity: 0; }
  100% { transform: scale(1.95); opacity: 0; }
}
.rp-lift { transition: transform 90ms ease-out, border-color 260ms ease, background-color 260ms ease; }
.rp-lift:hover { transform: translateY(-4px); }
.rp-iso-l { transform: perspective(1400px) rotateY(9deg) rotateX(3deg) scale(0.97); }
.rp-iso-r { transform: perspective(1400px) rotateY(-9deg) rotateX(3deg) scale(0.97); }
@media (max-width: 1023px) {
  .rp-iso-l, .rp-iso-r { transform: none; }
}
.rp-leader {
  background-image: linear-gradient(to right, rgba(245, 54, 27, 0.55) 0 4px, transparent 4px 9px);
  background-size: 9px 1px;
  background-repeat: repeat-x;
  background-position: 0 50%;
}
@media (prefers-reduced-motion: reduce) {
  .rp-drawn .rp-line, .rp-trace, .rp-ring { animation: none !important; }
  .rp-line, .rp-trace { stroke-dashoffset: 0 !important; }
  .rp-lift:hover { transform: none; }
}
`;

/* ---------------- primitivas de plano ---------------- */

const Ticks = () => (
    <>
        {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
        ].map((c) => (
            <span key={c} aria-hidden className={`pointer-events-none absolute h-3 w-3 border-[#F5361B]/70 ${c}`} />
        ))}
    </>
);

const Plate = ({
    code,
    title,
    children,
    className,
}: {
    code?: string;
    title?: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`relative border border-[#F5361B]/18 bg-[#101012] ${className ?? ""}`}>
        <Ticks />
        {(code || title) && (
            <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/8">
                <span className="rp-mono text-[10px] uppercase tracking-[0.28em] text-[#F5361B]/75">{code}</span>
                <span className="rp-mono truncate text-[10px] uppercase tracking-[0.2em] text-white/35">{title}</span>
            </div>
        )}
        {children}
    </div>
);

/** Cota de plano: línea roja con flechas en los extremos. */
const DimLine = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3">
        <svg viewBox="0 0 130 10" className="h-2.5 w-[110px] shrink-0" fill="none" aria-hidden>
            <path d="M0 5h130M0.5 1v8M129.5 1v8" stroke="#F5361B" strokeWidth="1" />
            <path d="M4 5l7-3.2v6.4zM126 5l-7-3.2v6.4z" fill="#F5361B" />
        </svg>
        <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-[#F5361B]/70">{label}</span>
    </div>
);

/**
 * Planta de una pista de pickleball (44' x 20'). Primero la guía punteada roja,
 * después las líneas blancas que se trazan una a una.
 */
const CourtPlan = ({ drawn, className }: { drawn: boolean; className?: string }) => {
    const lines = [
        { d: "M20 20H460V220H20V20", delay: 0 },
        { d: "M240 12V228", delay: 240 },
        { d: "M170 20V220", delay: 420 },
        { d: "M310 20V220", delay: 420 },
        { d: "M20 120H170", delay: 640 },
        { d: "M310 120H460", delay: 640 },
    ];

    return (
        <svg viewBox="0 0 480 240" className={className} fill="none" aria-hidden preserveAspectRatio="xMidYMid meet">
            <g stroke="#F5361B" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="5 6">
                {lines.map((l) => (
                    <path key={`g-${l.d}`} d={l.d} />
                ))}
            </g>
            <g className={drawn ? "rp-drawn" : undefined} stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="square">
                {lines.map((l) => (
                    <path
                        key={`w-${l.d}`}
                        className="rp-line"
                        d={l.d}
                        pathLength={1}
                        strokeDasharray={1}
                        style={{ animationDelay: `${l.delay}ms` }}
                    />
                ))}
            </g>
            <g className="rp-mono" fill="#F5361B" fillOpacity="0.55" fontSize="9" letterSpacing="1.6">
                <text x="20" y="12">44&apos;</text>
                <text x="176" y="234">KITCHEN 7&apos;</text>
                <text x="316" y="234">KITCHEN 7&apos;</text>
                <text x="246" y="12">NET</text>
            </g>
        </svg>
    );
};

/** El símbolo de ROBUST: los dos arcos reales del asset, trazándose cada 6 segundos. */
const MarkArcs = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 280 180" className={className} fill="none" aria-hidden>
        <g fill="#F5361B" fillOpacity="0.16">
            <path d="M8 84C78 24 170 0 244 10L268 52C196 38 90 64 8 84Z" />
            <path d="M4 176C72 104 152 70 212 78L212 176L174 176L174 110C126 114 56 144 4 176Z" />
        </g>
        <g className="rp-trace" stroke="#F5361B" strokeWidth="3" strokeLinejoin="round">
            <path d="M8 84C78 24 170 0 244 10L268 52C196 38 90 64 8 84Z" />
            <path d="M4 176C72 104 152 70 212 78L212 176L174 176L174 110C126 114 56 144 4 176Z" />
        </g>
    </svg>
);

/* ---------------- mockups: recreaciones fieles de p.uiScreens ---------------- */

const Pill = ({ tone, children }: { tone: "green" | "amber" | "red" | "grey"; children: React.ReactNode }) => {
    const map = {
        green: { bg: "rgba(21,128,61,0.12)", color: GREEN },
        amber: { bg: "rgba(161,98,7,0.14)", color: AMBER },
        red: { bg: "rgba(214,42,18,0.12)", color: RED_INK },
        grey: { bg: "rgba(18,18,18,0.06)", color: MUTED },
    }[tone];
    return (
        <span
            className="inline-flex items-center rounded-full px-1.5 py-[1px] text-[7px] font-semibold"
            style={{ background: map.bg, color: map.color }}
        >
            {children}
        </span>
    );
};

/** uiScreens[1] — Estudio · asistente de IA conversacional. */
const MockStudio = () => (
    <div className="absolute inset-0 flex flex-col" style={{ background: CANVAS, color: INK }}>
        <div className="h-7 shrink-0" />
        <div className="flex items-center justify-center gap-1 px-3 py-1" style={{ background: "rgba(18,18,18,0.06)", color: MUTED }}>
            <WifiOff size={8} />
            <span className="text-[7px]">Sin conexión. Los apuntes se guardan y se suben solos.</span>
        </div>

        <div className="flex items-start justify-between gap-2 px-3 pt-2 pb-2 bg-white">
            <div>
                <p className="rp-display text-[15px] leading-none">Asistente</p>
                <p className="mt-1 text-[8px]" style={{ color: MUTED }}>Clase 12 · Lillian</p>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[9px] font-semibold" style={{ color: RED_INK }}>Terminar</span>
                <Trash2 size={11} style={{ color: MUTED }} />
            </div>
        </div>

        <div className="px-3 py-1.5 text-[7.5px] leading-snug" style={{ background: "rgba(245,54,27,0.05)", color: INK }}>
            Esto no publica nada. Al cerrar, los apuntes pasan al borrador.
        </div>

        <div className="flex-1 px-2.5 pt-2 space-y-2 overflow-hidden">
            <div className="rounded-[14px] bg-white p-2.5 shadow-[0_1px_2px_rgba(18,18,18,0.05),0_8px_20px_-12px_rgba(18,18,18,0.25)]">
                <div className="flex items-center justify-between">
                    <span className="rp-mono text-[7px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>Cuaderno</span>
                    <span className="text-[7px]" style={{ color: MUTED }}>3 turnos</span>
                </div>

                <p className="mt-2 text-[7px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Resumen</p>
                <p className="text-[8px] leading-snug">Dinks cruzados y tercer golpe. Lillian sube la altura del reset.</p>

                <p className="mt-2 text-[7px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Ejercicios</p>
                {[
                    { name: "Dink cruzado sostenido", series: ["8/10", "9/10", "7/10"], pct: 80 },
                    { name: "Third shot drop", series: ["6/10", "7/10"], pct: 65 },
                ].map((ex) => (
                    <div key={ex.name} className="mt-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[8px] font-medium">{ex.name}</span>
                            <span className="flex gap-1">
                                {ex.series.map((s) => (
                                    <span
                                        key={s}
                                        className="rp-mono rounded px-1 py-[1px] text-[7px]"
                                        style={{ background: "rgba(18,18,18,0.06)", color: INK }}
                                    >
                                        {s}
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="mt-1 h-[3px] w-full rounded-full" style={{ background: LINE }}>
                            <div className="h-full rounded-full" style={{ width: `${ex.pct}%`, background: BRAND }} />
                        </div>
                    </div>
                ))}

                <div className="mt-2 flex items-start gap-1.5 rounded-md px-1.5 py-1" style={{ background: "rgba(161,98,7,0.10)" }}>
                    <span className="text-[8px] leading-none" style={{ color: AMBER }}>▲</span>
                    <span className="text-[7px] leading-snug" style={{ color: AMBER }}>
                        Se restituyó «Reset desde el fondo»: countDrift. La omisión no borra.
                    </span>
                </div>

                <p className="mt-2 text-[7px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Tareas</p>
                {["50 dinks cruzados antes del jueves", "Grabar 3 saques desde la derecha"].map((t) => (
                    <div key={t} className="flex items-center gap-1.5 mt-1">
                        <span className="h-2 w-2 rounded-[3px] border" style={{ borderColor: LINE }} />
                        <span className="text-[8px]">{t}</span>
                    </div>
                ))}

                <p className="mt-2 text-[7px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Claves</p>
                <p className="text-[8px]">· Pala arriba antes del bote</p>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-end">
                    <div className="max-w-[78%] rounded-[12px] px-2 py-1.5" style={{ background: "rgba(245,54,27,0.08)" }}>
                        <p className="text-[8px] italic leading-snug">«sacó 80, 90, 75, 48 y 90»</p>
                        <p className="mt-0.5 text-right text-[6.5px]" style={{ color: MUTED }}>0:41</p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="max-w-[78%] rounded-[12px] border px-2 py-1.5 bg-white" style={{ borderColor: LINE }}>
                        <p className="text-[8px] leading-snug">¿De cuántas bolas era cada serie? No la supongo.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t" style={{ borderColor: LINE }}>
            <div className="relative grid h-11 w-11 place-items-center rounded-full" style={{ background: BRAND }}>
                <span aria-hidden className="rp-ring absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 2px ${BRAND}` }} />
                <Mic size={17} color="#fff" />
            </div>
            <span className="rp-display text-[19px]" style={{ color: INK }}>0:41</span>
            <span className="text-[8px] font-semibold" style={{ color: RED_INK }}>Dictar en su lugar</span>
        </div>
    </div>
);

/** uiScreens[2] — Player DNA del alumno: cuatro arcos, no un radar. */
const ARCS = [
    { label: "Técnica", pct: 77, color: GREEN },
    { label: "Táctica", pct: 54, color: AMBER },
    { label: "Movimiento", pct: 41, color: RED_INK },
    { label: "Mental", pct: null, color: LINE },
];

const MockDna = () => (
    <div className="absolute inset-0 flex flex-col" style={{ background: CANVAS, color: INK }}>
        <div className="h-7 shrink-0" />
        <div className="px-3 py-2.5 bg-white">
            <p className="rp-display text-[15px] leading-none">Tu ADN de juego</p>
        </div>

        <div className="flex-1 px-2.5 pt-2.5 space-y-2 overflow-hidden">
            <p className="text-[8px] leading-snug" style={{ color: MUTED }}>
                Un mapa de lo que hemos medido en tus clases. Lo que no se ha medido no se rellena con un cero.
            </p>

            <div className="rounded-[14px] bg-white p-3 shadow-[0_1px_2px_rgba(18,18,18,0.05),0_8px_20px_-12px_rgba(18,18,18,0.25)]">
                <div className="grid grid-cols-4 gap-1">
                    {ARCS.map((a) => (
                        <div key={a.label} className="flex flex-col items-center">
                            <div className="relative w-full">
                                <svg viewBox="0 0 60 34" className="w-full" fill="none">
                                    <path d="M6 30a24 24 0 0 1 48 0" stroke={LINE} strokeWidth="6" strokeLinecap="round" />
                                    {a.pct !== null && (
                                        <path
                                            d="M6 30a24 24 0 0 1 48 0"
                                            stroke={a.color}
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            pathLength={100}
                                            strokeDasharray={`${a.pct} 100`}
                                        />
                                    )}
                                </svg>
                                <span
                                    className="rp-display absolute inset-x-0 bottom-0 text-center text-[10px]"
                                    style={{ color: a.pct === null ? MUTED : INK }}
                                >
                                    {a.pct === null ? "—" : `${a.pct}%`}
                                </span>
                            </div>
                            <span className="mt-1 text-[6.5px] text-center leading-tight" style={{ color: MUTED }}>
                                {a.label}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="mt-2 text-[6.5px] text-center" style={{ color: MUTED }}>
                    Mental: todavía no lo hemos medido
                </p>
            </div>

            <div className="rounded-[14px] bg-white p-2.5 shadow-[0_1px_2px_rgba(18,18,18,0.05),0_8px_20px_-12px_rgba(18,18,18,0.25)]">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold">Técnica</span>
                    <span className="text-[7px]" style={{ color: MUTED }}>1 de 5 medidas</span>
                </div>

                {[
                    { name: "Dink cruzado", tone: "green" as const, state: "fuerte", from: 60, to: 77, spark: [40, 52, 58, 63, 71, 77] },
                    { name: "Third shot drop", tone: "amber" as const, state: "en desarrollo", from: 48, to: 54, spark: [30, 44, 39, 47, 50, 54] },
                    { name: "Reset desde el fondo", tone: "red" as const, state: "prioridad", from: 45, to: 41, spark: [52, 48, 44, 46, 42, 41] },
                ].map((s) => (
                    <div key={s.name} className="flex items-center gap-2 py-1.5 border-b last:border-0" style={{ borderColor: LINE }}>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                                <span className="truncate text-[8px] font-medium">{s.name}</span>
                                <Pill tone={s.tone}>{s.state}</Pill>
                            </div>
                            <p className="text-[6.5px]" style={{ color: MUTED }}>
                                empezaste en {s.from}%, vas por {s.to}%
                            </p>
                        </div>
                        <svg viewBox="0 0 48 16" className="h-4 w-12 shrink-0" fill="none">
                            <polyline
                                points={s.spark.map((v, i) => `${svgNum(i * 9.6)},${svgNum(16 - (v / 100) * 15)}`).join(" ")}
                                stroke={s.tone === "green" ? GREEN : s.tone === "amber" ? AMBER : RED_INK}
                                strokeWidth="1.4"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                ))}

                {["Volea de revés", "Saque profundo"].map((s) => (
                    <div key={s} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: LINE }}>
                        <span className="text-[8px]" style={{ color: MUTED }}>{s}</span>
                        <span className="text-[6.5px]" style={{ color: MUTED }}>todavía no lo hemos medido</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** uiScreens[3] — Court ID · ejecución de la evaluación. */
const MockCourtId = () => (
    <div className="absolute inset-0 flex flex-col" style={{ background: CANVAS, color: INK }}>
        <div className="h-7 shrink-0" />
        <div className="px-3 pt-2 pb-2 bg-white">
            <div className="flex items-baseline justify-between">
                <p className="rp-display text-[14px] leading-none">Court ID · Lillian</p>
                <span className="rp-mono text-[7px]" style={{ color: MUTED }}>6/10</span>
            </div>
            <div className="mt-2 h-[3px] w-full rounded-full" style={{ background: LINE }}>
                <div className="h-full rounded-full" style={{ width: "60%", background: BRAND }} />
            </div>
        </div>

        <div className="flex-1 px-2.5 pt-2 space-y-2 overflow-hidden">
            {[
                {
                    n: "01",
                    name: "Dink cruzado sostenido",
                    unit: "bolas contadas",
                    values: ["8", "9", "7", "9", "8"],
                    tones: ["ok", "ok", "ok", "ok", "ok"],
                    flag: null as string | null,
                },
                {
                    n: "02",
                    name: "Third shot drop",
                    unit: "bolas contadas",
                    values: ["8", "9", "3", "8", "9"],
                    tones: ["ok", "ok", "low", "ok", "ok"],
                    flag: "Una serie hundida deja el ejercicio en ámbar: el criterio es consistencia, no promedio.",
                },
            ].map((ex) => (
                <div
                    key={ex.n}
                    className="rounded-[14px] bg-white p-2.5 border"
                    style={{ borderColor: ex.flag ? "rgba(161,98,7,0.45)" : LINE }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-semibold">
                            <span className="rp-mono mr-1.5" style={{ color: MUTED }}>{ex.n}</span>
                            {ex.name}
                        </span>
                        <span className="rounded-full px-1.5 py-[1px] text-[6.5px]" style={{ background: "rgba(18,18,18,0.06)", color: MUTED }}>
                            {ex.unit}
                        </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mt-2">
                        {ex.values.map((v, i) => (
                            <span
                                key={`${ex.n}-${i}`}
                                className="rp-display grid aspect-square place-items-center rounded-[8px] text-[13px]"
                                style={
                                    ex.tones[i] === "ok"
                                        ? { background: "rgba(21,128,61,0.12)", color: GREEN }
                                        : { background: "rgba(161,98,7,0.16)", color: AMBER }
                                }
                            >
                                {v}
                            </span>
                        ))}
                    </div>
                    {ex.flag && (
                        <p className="mt-1.5 text-[6.5px] leading-snug" style={{ color: AMBER }}>{ex.flag}</p>
                    )}
                </div>
            ))}

            <div className="rounded-[14px] bg-white p-2.5 border" style={{ borderColor: LINE }}>
                <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-semibold">
                        <span className="rp-mono mr-1.5" style={{ color: MUTED }}>03</span>
                        Saque profundo
                    </span>
                    <span className="rounded-full px-1.5 py-[1px] text-[6.5px]" style={{ background: "rgba(245,54,27,0.10)", color: RED_INK }}>
                        puntuación
                    </span>
                </div>
                <p className="mt-2 text-[6.5px]" style={{ color: MUTED }}>Sin teclado: 21 casillas de cinco en cinco.</p>
                <div className="grid grid-cols-7 gap-1 mt-1.5">
                    {Array.from({ length: 21 }, (_, i) => i * 5).map((v) => (
                        <span
                            key={v}
                            className="rp-display grid aspect-square place-items-center rounded-[6px] text-[9px]"
                            style={
                                v === 80
                                    ? { background: BRAND, color: "#fff" }
                                    : { background: "rgba(18,18,18,0.05)", color: INK }
                            }
                        >
                            {v}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="px-3 py-2.5 bg-white border-t" style={{ borderColor: LINE }}>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[7px] uppercase tracking-wide" style={{ color: MUTED }}>Compuesto objetivo</p>
                    <p className="rp-display text-[26px] leading-none">72<span className="text-[12px]" style={{ color: MUTED }}>/100</span></p>
                </div>
                <span className="rounded-full px-2 py-1 text-[6.5px]" style={{ background: "rgba(161,98,7,0.12)", color: AMBER }}>
                    Nivel 3.5 · provisional
                </span>
            </div>
            <p className="mt-1.5 text-[6.5px] leading-snug" style={{ color: MUTED }}>
                La traducción a nivel es provisional. Autoguardado a los 3 s del último conteo.
            </p>
        </div>
    </div>
);

/* ---------------- secciones con vida propia ---------------- */

/** Cuatro estaciones unidas por una línea roja atada al scroll, no a un temporizador. */
const CycleTrack = () => {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
    const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
    const [lit, setLit] = useState(0);

    useEffect(() => {
        if (reduce) {
            setLit(4);
            return;
        }
        return draw.on("change", (v) => setLit(v < 0.03 ? 0 : Math.min(4, Math.floor(v * 4) + 1)));
    }, [draw, reduce]);

    const on = (i: number) => Boolean(reduce) || lit > i;

    return (
        <div ref={ref} className="relative mt-14">
            {/* riel horizontal (md+) */}
            <div aria-hidden className="absolute hidden md:block left-[12.5%] right-[12.5%] top-[21px] h-[2px] bg-white/10">
                <motion.div className="h-full origin-left bg-[#F5361B]" style={{ scaleX: reduce ? 1 : draw }} />
            </div>
            {/* riel vertical (móvil) */}
            <div aria-hidden className="absolute md:hidden left-[21px] top-6 bottom-10 w-[2px] bg-white/10">
                <motion.div className="w-full h-full origin-top bg-[#F5361B]" style={{ scaleY: reduce ? 1 : draw }} />
            </div>

            <div className="relative grid gap-8 md:grid-cols-4 md:gap-5">
                {CYCLE.map((s, i) => (
                    <div key={s.code} className="flex gap-4 md:block">
                        <span
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-500"
                            style={{
                                borderColor: on(i) ? BRAND : "rgba(255,255,255,0.18)",
                                background: on(i) ? "rgba(245,54,27,0.14)" : "#0D0D0F",
                                color: on(i) ? BRAND : "rgba(255,255,255,0.4)",
                                boxShadow: on(i) ? `0 0 0 5px rgba(245,54,27,0.08)` : "none",
                            }}
                        >
                            <span className="rp-mono text-[11px] font-bold">{s.code}</span>
                        </span>
                        <div className="md:mt-5">
                            <h3 className="rp-display text-lg uppercase">{s.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/** Plato de plano que se traza cuando entra en pantalla. */
const CourtPlate = ({ className }: { className?: string }) => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.3);
    return (
        <div ref={ref} className={className}>
            <CourtPlan drawn={inView} className="w-full h-auto" />
        </div>
    );
};

/* ------------------------------- Landing ------------------------------- */

const Landing = () => (
    <ProjectShell name={p.name} brand={p.brand} links={p.links}>
        <style>{css}</style>

        {/* ─────────────────── A-00 · HÉROE ─────────────────── */}
        <section className="relative px-4 pt-28 pb-20 md:px-6 md:pt-36 md:pb-28">
            <div aria-hidden className="absolute inset-0 rp-grid" />
            <div aria-hidden className="absolute inset-x-0 top-16 opacity-40 md:opacity-55">
                <CourtPlan drawn className="w-full h-auto max-h-[70vh]" />
            </div>
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[560px]"
                style={{ background: "radial-gradient(58% 55% at 12% 0%, rgba(179,31,12,0.35), transparent 70%)" }}
            />

            <div className="relative max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="rp-mono text-[10px] uppercase tracking-[0.32em] text-[#F5361B]">plano a-00</span>
                    <span aria-hidden className="h-px w-16 bg-[#F5361B]/40" />
                    <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-white/35">{p.year} · escala 1:1</span>
                </div>

                <div className="flex items-center gap-4 mt-8">
                    {appIcon && (
                        <span className="relative border border-white/10 bg-black/50 p-1.5">
                            <Ticks />
                            <Image src={appIcon.src} alt={appIcon.caption} width={64} height={64} priority className="w-14 h-14 md:w-16 md:h-16" />
                        </span>
                    )}
                    <MarkArcs className="w-24 h-auto md:w-32" />
                </div>

                <h1 className="rp-display mt-8 text-[15vw] leading-[0.86] uppercase sm:text-6xl md:text-8xl">
                    <span className="block text-white">El historial</span>
                    <span className="block text-[#F5361B]">dura años</span>
                </h1>

                <p className="max-w-2xl mt-7 text-base leading-relaxed text-white/65 md:text-xl">{p.tagline}</p>

                <div className="flex flex-wrap gap-2 mt-8">
                    <Chip>{p.category}</Chip>
                    <Chip>{p.year}</Chip>
                </div>

                <div className="grid max-w-3xl gap-4 mt-8 sm:grid-cols-2">
                    <p className="rp-mono border-l border-[#F5361B]/40 pl-3 text-[11px] leading-relaxed text-white/45">
                        <span className="block text-[#F5361B]/70 uppercase tracking-[0.2em] mb-1">rol</span>
                        {p.role}
                    </p>
                    <p className="rp-mono border-l border-white/15 pl-3 text-[11px] leading-relaxed text-white/45">
                        <span className="block text-white/40 uppercase tracking-[0.2em] mb-1">estado</span>
                        {p.status}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-9">
                    {p.links.play && (
                        <BrandButton href={p.links.play}>
                            <Play size={16} /> Google Play
                        </BrandButton>
                    )}
                    {p.links.web && (
                        <BrandButton href={p.links.web} variant={p.links.play ? "outline" : "solid"}>
                            <ArrowRight size={16} /> Ver el sitio
                        </BrandButton>
                    )}
                    {p.links.github && (
                        <BrandButton href={p.links.github} variant="outline">
                            <ArrowRight size={16} /> Código
                        </BrandButton>
                    )}
                    <BrandButton href="#rp-pantallas" variant={p.links.play || p.links.web ? "outline" : "solid"}>
                        <ArrowDown size={16} /> Ver las pantallas
                    </BrandButton>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 mt-14 border-t border-white/10 md:grid-cols-4">
                    {heroMetrics.map((m) => (
                        <CountMetric key={m.label} value={m.value} label={m.label} />
                    ))}
                </div>
            </div>
        </section>

        {/* ─────────────────── A-01 · GUÍA Y TRAZO ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div className="max-w-6xl mx-auto">
                <SectionHead
                    index="a-01 / Guía y trazo"
                    title={
                        <>
                            De la nota suelta <span className="brand-gradient-text">a la línea medida</span>
                        </>
                    }
                    lead="Un plano empieza con la guía punteada y termina con el trazo firme. El producto hace lo mismo con lo que el entrenador dice de viva voz."
                />

                <div className="grid gap-5 mt-12 lg:grid-cols-2">
                    <Reveal direction="right">
                        <div className="relative h-full p-6 md:p-8" style={{ border: "1px dashed rgba(245,54,27,0.4)" }}>
                            <div aria-hidden className="absolute inset-0 rp-hatch opacity-40" />
                            <div className="relative">
                                <DimLine label="línea de guía" />
                                <h3 className="rp-display mt-5 text-2xl uppercase text-white/85 md:text-3xl">Lo que no existía</h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">{p.problem}</p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal direction="left" delay={0.1}>
                        <div className="relative h-full p-6 md:p-8 border border-white/25 bg-[#101012]">
                            <Ticks />
                            <div className="relative">
                                <DimLine label="trazo definitivo" />
                                <h3 className="rp-display mt-5 text-2xl uppercase text-white md:text-3xl">Lo que se construyó</h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">{p.solution}</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>

        {/* ─────────────────── A-02 · EL CICLO ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div className="max-w-6xl mx-auto">
                <SectionHead
                    index="a-02 / El ciclo"
                    title={
                        <>
                            Cuatro pasos <span className="brand-gradient-text">y ni uno más</span>
                        </>
                    }
                    lead="El único trabajo del coach es hablar noventa segundos. Toda la disciplina vive en el servidor."
                />
                <CycleTrack />
            </div>
        </section>

        {/* ─────────────────── A-03 · PIEZAS ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div aria-hidden className="absolute inset-0 rp-grid" />
            <div className="relative max-w-6xl mx-auto">
                <SectionHead
                    index="a-03 / Piezas"
                    title={
                        <>
                            Seis decisiones que <span className="brand-gradient-text">sostienen el historial</span>
                        </>
                    }
                />

                <Stagger className="grid gap-px mt-12 border border-white/10 md:grid-cols-2 lg:grid-cols-3 bg-white/10" stagger={0.055}>
                    {p.highlights.map((h) => {
                        const Icon = iconOf(h.icon);
                        return (
                            <StaggerItem key={h.title} y={18}>
                                <div className="rp-lift h-full bg-[#0D0D0F] p-6 hover:bg-[#101012]">
                                    <div className="flex items-center justify-between">
                                        <span className="grid h-9 w-9 place-items-center border border-[#F5361B]/40 text-[#F5361B]">
                                            <Icon size={16} />
                                        </span>
                                        <span aria-hidden className="h-px flex-1 ml-4 rp-leader" />
                                    </div>
                                    <h3 className="rp-display mt-5 text-lg uppercase leading-tight text-white">{h.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-white/55">{h.description}</p>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            </div>
        </section>

        {/* ─────────────────── A-04 · DOS LADOS DE LA RED ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div className="max-w-6xl mx-auto">
                <SectionHead
                    index="a-04 / Dos lados de la red"
                    title={
                        <>
                            Nada cruza <span className="brand-gradient-text">salvo una flecha</span>
                        </>
                    }
                    lead="El alumno nunca toca /orgs/**: lee su propio player_space. El puente entre los dos lados lo cruzan únicamente las Cloud Functions."
                />

                <CourtPlate className="mt-10 opacity-70" />

                <div className="relative mt-10">
                    <span aria-hidden className="absolute hidden lg:block left-1/2 top-0 bottom-0 w-px bg-white/30" />
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
                        {[
                            { side: "Área del entrenador", note: "/orgs/{orgId}/**", items: COACH_SIDE, tone: "coach" as const },
                            { side: "Área del alumno", note: "/player_space/{uid}/**", items: PLAYER_SIDE, tone: "player" as const },
                        ].map((col, ci) => (
                            <Reveal key={col.side} direction={ci === 0 ? "right" : "left"} delay={ci * 0.1}>
                                <div className="relative h-full p-6 border border-white/10 bg-[#101012]">
                                    <Ticks />
                                    <p className="rp-mono text-[10px] uppercase tracking-[0.24em] text-[#F5361B]/70">
                                        {ci === 0 ? "lado a" : "lado b"}
                                    </p>
                                    <h3 className="rp-display mt-2 text-xl uppercase text-white md:text-2xl">{col.side}</h3>
                                    <p className="rp-mono mt-1 text-[11px] text-white/35">{col.note}</p>
                                    <ul className="mt-5 space-y-2.5">
                                        {col.items.map((item) => (
                                            <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/60">
                                                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-[#F5361B]/60" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="flex justify-center mt-8 lg:mt-10">
                        <span className="inline-flex items-center gap-3 border border-[#F5361B]/45 bg-[#0D0D0F] px-4 py-2">
                            <span aria-hidden className="h-px w-8 bg-[#F5361B]" />
                            <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-[#F5361B]">
                                Cloud Functions
                            </span>
                            <ArrowRight size={14} className="text-[#F5361B]" />
                        </span>
                    </Reveal>
                    <p className="mt-4 text-xs text-center text-white/40">
                        Proyección con lista blanca, feedback espejado y notas privadas que ninguna regla puede evaluar a favor del alumno.
                    </p>
                </div>
            </div>
        </section>

        {/* ─────────────────── A-05 · LO QUE NO SE INVENTA ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28 bg-[#08080A]">
            <div className="max-w-5xl mx-auto">
                <SectionHead
                    index="a-05 / Cotas"
                    title={
                        <>
                            Lo que <span className="brand-gradient-text">no se inventa</span>
                        </>
                    }
                    lead="Un hueco visible se arregla en diez segundos; un número inventado ya no se distingue de una medición."
                />

                <div className="mt-14 space-y-10">
                    {RULES.map((r, i) => (
                        <Reveal key={r.n} delay={i * 0.06}>
                            <div className="grid gap-4 md:grid-cols-[130px_1fr] md:gap-8">
                                <div className="md:pt-2">
                                    <DimLine label={r.n} />
                                </div>
                                <div className="border-b border-white/8 pb-8">
                                    <h3 className="rp-display text-2xl uppercase leading-none text-white md:text-4xl">{r.title}</h3>
                                    <p className="max-w-2xl mt-4 text-sm leading-relaxed text-white/55 md:text-base">{r.text}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>

        {/* ─────────────────── A-06 · PANTALLAS ─────────────────── */}
        <section id="rp-pantallas" className="relative px-4 py-20 scroll-mt-20 md:px-6 md:py-28">
            <div aria-hidden className="absolute inset-0 rp-grid" />
            <div className="relative max-w-6xl mx-auto">
                <SectionHead
                    index="a-06 / Pantallas"
                    title={
                        <>
                            Tres pantallas <span className="brand-gradient-text">del mismo plano</span>
                        </>
                    }
                    lead="La app prioriza el tema claro: lienzo #F7F7F8, tarjetas blancas y el rojo de marca como único acento. Aquí van recreadas."
                />

                <div className="grid gap-10 mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {[
                        {
                            screen: p.uiScreens[1],
                            code: "s-02",
                            callout: "anillo del micrófono · bucle de 1600 ms",
                            mock: <MockStudio />,
                            iso: "rp-iso-l",
                        },
                        {
                            screen: p.uiScreens[2],
                            code: "s-03",
                            callout: "cuatro arcos · cobertura declarada",
                            mock: <MockDna />,
                            iso: "",
                        },
                        {
                            screen: p.uiScreens[3],
                            code: "s-04",
                            callout: "rejilla de conteo · 21 casillas, sin teclado",
                            mock: <MockCourtId />,
                            iso: "rp-iso-r",
                        },
                    ].map((m, i) => (
                        <Reveal key={m.code} delay={i * 0.1} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center w-full gap-3 mb-4">
                                    <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-[#F5361B]">{m.code}</span>
                                    <span aria-hidden className="h-px flex-1 rp-leader" />
                                    <span className="rp-mono text-[10px] uppercase tracking-[0.16em] text-white/35">móvil</span>
                                </div>

                                <PhoneFrame glow={false} className={`w-full max-w-[280px] ${m.iso}`}>
                                    {m.mock}
                                </PhoneFrame>

                                <div className="w-full mt-5">
                                    <h3 className="rp-display text-base uppercase text-white">{m.screen?.name}</h3>
                                    <div className="flex items-start gap-2 mt-2">
                                        <span aria-hidden className="mt-2 h-px w-6 shrink-0 rp-leader" />
                                        <p className="rp-mono text-[10px] leading-relaxed text-white/40">{m.callout}</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal className="grid gap-5 mt-16 md:grid-cols-2">
                    {[p.uiScreens[0], p.uiScreens[4]].map((s, i) => (
                        <div key={s?.name ?? i} className="relative p-6 border border-white/10 bg-[#101012]">
                            <Ticks />
                            <p className="rp-mono text-[10px] uppercase tracking-[0.24em] text-[#F5361B]/70">
                                {i === 0 ? "s-01" : "s-05"}
                            </p>
                            <h3 className="rp-display mt-2 text-lg uppercase text-white">{s?.name}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/50">
                                {i === 0
                                    ? "Panel ordenado por urgencia y no por estética: aviso, cola de trabajo, quién entra hoy, marcador en vivo y seis gráficas servidas desde un único documento agregado."
                                    : "El destino de la notificación push: mensaje del entrenador, lo que salió bien, en qué seguimos, ejercicios contados, tareas marcables y el bloque donde el alumno responde."}
                            </p>
                        </div>
                    ))}
                </Reveal>
            </div>
        </section>

        {/* ─────────────────── A-07 · HOJA DE MARCA ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-24">
            <div className="max-w-6xl mx-auto">
                <SectionHead
                    index="a-07 / Hoja de marca"
                    title={
                        <>
                            Dos arcos <span className="brand-gradient-text">y un solo rojo</span>
                        </>
                    }
                    lead="El símbolo es la trayectoria de una bola y su rebote. Cada capa del icono está cortada para su destino: adaptativo de Android, monocromo tematizado, oscuro y teñido de iOS 18."
                />

                <div className="mt-12">
                    <DragRail className="pb-4">
                        {brandSheet.map((m) => (
                            <figure key={m.src} className="w-[190px] shrink-0">
                                <div className="relative grid h-[190px] place-items-center border border-white/10 bg-[#101012] p-6">
                                    <Ticks />
                                    <span aria-hidden className="absolute inset-0 rp-grid-strong opacity-40" />
                                    {m.src.endsWith(".svg") ? (
                                        <span className="relative grid w-full h-full place-items-center bg-white">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={m.src} alt={m.caption} className="w-24 h-auto" draggable={false} />
                                        </span>
                                    ) : (
                                        <Image
                                            src={m.src}
                                            alt={m.caption}
                                            width={m.src.endsWith("mark_red.png") ? 140 : 104}
                                            height={m.src.endsWith("mark_red.png") ? 95 : 104}
                                            className="relative object-contain w-auto h-24"
                                            draggable={false}
                                        />
                                    )}
                                </div>
                                <figcaption className="rp-mono mt-3 text-[10px] leading-relaxed text-white/40">
                                    {m.caption}
                                </figcaption>
                            </figure>
                        ))}
                    </DragRail>
                </div>

                <div className="grid gap-3 mt-10 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { name: "brand", hex: p.brand.primary, note: "relleno y acento" },
                        { name: "brandDeep", hex: p.brand.secondary, note: "texto sobre claro" },
                        { name: "brandEmber", hex: p.brand.accent, note: "sólo extremo del gradiente" },
                        { name: "canvas", hex: p.brand.bg, note: "lienzo oscuro" },
                    ].map((c) => (
                        <div key={c.name} className="flex items-center gap-3 p-3 border border-white/10">
                            <span className="w-10 h-10 shrink-0" style={{ background: c.hex }} />
                            <span className="min-w-0">
                                <span className="rp-mono block text-[11px] text-white/80">{c.hex}</span>
                                <span className="rp-mono block text-[10px] text-white/35">{c.name} · {c.note}</span>
                            </span>
                        </div>
                    ))}
                </div>

                <p className="max-w-3xl mt-8 text-sm leading-relaxed text-white/50">{p.brand.mood}</p>
            </div>
        </section>

        {/* ─────────────────── A-08 · ESPECIFICACIÓN ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div className="max-w-6xl mx-auto">
                <SectionHead
                    index="a-08 / Especificación"
                    title={
                        <>
                            Índice de <span className="brand-gradient-text">lo que ya funciona</span>
                        </>
                    }
                />

                <Plate code={`${p.features.length} partidas`} title="hoja de especificación" className="mt-12">
                    <Stagger className="grid md:grid-cols-2" stagger={0.03}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={10}>
                                <div className="flex items-start gap-3 px-4 py-3 border-b border-white/6 md:px-5">
                                    <span className="rp-mono shrink-0 pt-0.5 text-[11px] text-[#F5361B]/70">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm leading-relaxed text-white/60">{f}</span>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </Plate>
            </div>
        </section>

        {/* ─────────────────── A-09 · MATERIALES ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-24">
            <div aria-hidden className="absolute inset-0 rp-grid-strong opacity-70" />
            <div className="relative max-w-6xl mx-auto">
                <SectionHead index="a-09 / Materiales" title="Con qué está levantado" />

                <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                    {p.stack.map((group, i) => (
                        <Reveal key={group.group} delay={i * 0.05}>
                            <div className="rp-lift relative h-full border border-[#F5361B]/20 bg-[#0D0D0F] p-5 hover:border-[#F5361B]/50">
                                <div className="flex items-center gap-3">
                                    <span className="rp-mono text-[10px] uppercase tracking-[0.22em] text-[#F5361B]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="rp-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                                        {group.group}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-4">
                                    {group.items.map((item) => (
                                        <span key={item} className="rp-mono flex items-start gap-2 text-[11px] text-white/50">
                                            <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-[#F5361B]/50" />
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

        {/* ─────────────────── A-10 · ESQUEMA E INCIDENCIAS ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div className="max-w-5xl mx-auto">
                <SectionHead
                    index="a-10 / Esquema general"
                    title={
                        <>
                            Cómo está <span className="brand-gradient-text">levantado por dentro</span>
                        </>
                    }
                />

                <Reveal className="mt-12">
                    <Plate code="e-01" title="clean architecture · 11 features · 23 functions">
                        <p className="p-6 text-sm leading-relaxed text-white/60 md:p-8 md:text-base">{p.architecture}</p>
                    </Plate>
                </Reveal>

                <div className="flex items-center gap-3 mt-16 mb-8">
                    <span className="rp-mono text-[10px] uppercase tracking-[0.32em] text-[#F5361B]">incidencias</span>
                    <span aria-hidden className="h-px flex-1 rp-leader" />
                    <span className="rp-mono text-[10px] text-white/35">{p.challenges.length}</span>
                </div>

                <div className="space-y-4">
                    {p.challenges.map((c, i) => (
                        <Reveal key={i} delay={i * 0.05}>
                            <div className="relative grid border border-white/10 md:grid-cols-2">
                                <Ticks />
                                <div className="p-5 md:p-7 border-b border-white/10 md:border-b-0 md:border-r bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-white/40" />
                                        <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                                            incidencia {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-white/65">{c.problem}</p>
                                </div>
                                <div className="p-5 md:p-7" style={{ background: "rgba(245,54,27,0.045)" }}>
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#F5361B]" />
                                        <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-[#F5361B]">
                                            corrección
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-white/75">{c.solution}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>

        {/* ─────────────────── A-11 · MEDICIONES ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-24">
            <div className="max-w-6xl mx-auto">
                <Plate code="a-11" title="mediciones del repositorio">
                    <div className="p-6 md:p-10">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                            {p.metrics.map((m) => (
                                <CountMetric key={m.label} value={m.value} label={m.label} />
                            ))}
                        </div>
                    </div>
                </Plate>
            </div>
        </section>

        {/* ─────────────────── A-12 · MEMORIA ─────────────────── */}
        <section className="relative px-4 py-20 md:px-6 md:py-28">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4">
                    <MarkArcs className="w-16 h-auto" />
                    <span className="rp-mono text-[10px] uppercase tracking-[0.28em] text-white/35">memoria del proyecto</span>
                </div>
                <Stagger className="mt-8 space-y-5">
                    {p.summary.map((paragraph, i) => (
                        <StaggerItem key={i}>
                            <p
                                className={`leading-relaxed ${
                                    i === 0 ? "text-lg text-white/85 md:text-xl" : "text-sm text-white/55 md:text-base"
                                }`}
                            >
                                {paragraph}
                            </p>
                        </StaggerItem>
                    ))}
                </Stagger>

                <div className="flex flex-wrap gap-2 mt-10">
                    {["Multi-tenant desde el día uno", "Sin cobertura en la cancha", "PDF en el propio teléfono"].map((t) => (
                        <span
                            key={t}
                            className="rp-mono border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/45"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </section>

        <div className="rp-mono border-y border-white/10 py-5 text-[11px] uppercase tracking-[0.24em] text-white/35">
            <Marquee
                items={["dink", "third shot drop", "reset", "kitchen", "player DNA", "court ID", "count drift", "el glosario no se traduce"]}
                speed={38}
                separator="—"
            />
        </div>

        <div className="relative pb-32">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-64 opacity-30">
                <CourtPlan drawn className="w-full h-full" />
            </div>
            <div className="relative">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una app Flutter con dos productos dentro, veintitrés Cloud Functions y una IA a la que no se le deja inventar un solo número. Si necesitas algo así —voz que se vuelve dato, permisos que de verdad separan, gasto acotado— es exactamente el terreno que conozco."
                />
                <div className="flex items-center justify-center gap-3 px-4">
                    <span aria-hidden className="h-px w-10 rp-leader" />
                    <span className="rp-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
                        fin del plano · {p.name}
                    </span>
                    <span aria-hidden className="h-px w-10 rp-leader" />
                </div>
            </div>
        </div>
    </ProjectShell>
);

export default Landing;
