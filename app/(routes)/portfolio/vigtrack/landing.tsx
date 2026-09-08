"use client"

import { useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Clock,
    Download,
    Eye,
    EyeOff,
    FileSpreadsheet,
    Filter,
    Languages,
    Lock,
    Play,
    Search,
    X,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { BrowserFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("vigtrack")!;
const nxt = nextProject("vigtrack");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* ------------------------------------------------------------------ *
 *  Paletas: la escala semántica real del producto.
 *  LIGHT = los pares exactos de la app (ok/warn/crit/info).
 *  DARK  = las versiones aclaradas para el turno de noche de la landing.
 * ------------------------------------------------------------------ */

type Tone = "ok" | "info" | "warn" | "crit" | "mute";

const DARK_TONE: Record<Tone, { fg: string; bg: string; bd: string }> = {
    ok: { fg: "#4ade80", bg: "rgba(74,222,128,0.12)", bd: "rgba(74,222,128,0.34)" },
    info: { fg: "#60a5fa", bg: "rgba(96,165,250,0.12)", bd: "rgba(96,165,250,0.34)" },
    warn: { fg: "#fbbf24", bg: "rgba(251,191,36,0.12)", bd: "rgba(251,191,36,0.34)" },
    crit: { fg: "#f87171", bg: "rgba(248,113,113,0.12)", bd: "rgba(248,113,113,0.36)" },
    mute: { fg: "#94a3b8", bg: "rgba(148,163,184,0.10)", bd: "rgba(148,163,184,0.28)" },
};

const LIGHT_TONE: Record<Tone, { fg: string; bg: string }> = {
    ok: { fg: "#16a34a", bg: "#dcfce7" },
    info: { fg: "#0891b2", bg: "#cffafe" },
    warn: { fg: "#d97706", bg: "#fef3c7" },
    crit: { fg: "#dc2626", bg: "#fee2e2" },
    mute: { fg: "#64748b", bg: "#f1f5f9" },
};

/* Las marcas del riel de fichaje del héroe. */
const MARCAS: { hora: string; oficial: string; sede: string; etiqueta: string; tone: Tone }[] = [
    { hora: "05:58", oficial: "Nieves, José G.", sede: "CC Líder · Guarenas", etiqueta: "entrada", tone: "ok" },
    { hora: "06:00", oficial: "Rangel, María C.", sede: "Torre Miranda", etiqueta: "entrada", tone: "ok" },
    { hora: "07:12", oficial: "Chirinos, Ander J.", sede: "Planta Charallave", etiqueta: "relevo", tone: "info" },
    { hora: "09:45", oficial: "Bastidas, Luis E.", sede: "Sede Higuerote", etiqueta: "novedad", tone: "warn" },
    { hora: "12:30", oficial: "Mendoza, Rosa M.", sede: "CC Líder · Guarenas", etiqueta: "relevo", tone: "info" },
    { hora: "14:03", oficial: "Salazar, Deivis A.", sede: "Depósito Santa Teresa", etiqueta: "puesto sin cubrir", tone: "crit" },
    { hora: "18:00", oficial: "Pacheco, Eglee R.", sede: "Torre Miranda", etiqueta: "entrada", tone: "ok" },
    { hora: "22:40", oficial: "Ojeda, Carlos D.", sede: "Planta Charallave", etiqueta: "novedad", tone: "warn" },
];

/* Los cinco productos que viven bajo el mismo dominio. */
const ROLES: {
    id: string;
    nombre: string;
    icon: string;
    tone: Tone;
    resumen: string;
    rutas: string[];
    marcas: { h: string; t: string }[];
}[] = [
    {
        id: "admin",
        nombre: "Administrador",
        icon: "UserCog",
        tone: "info",
        resumen: "Mantiene los catálogos y mira el histórico nacional.",
        rutas: ["Dashboard", "Personal", "Catálogos", "Usuarios", "Reportes", "Histórico"],
        marcas: [
            { h: "08:10", t: "Alta de sucursal" },
            { h: "11:32", t: "Nuevo tipo de novedad" },
            { h: "16:44", t: "Reporte por cliente · CSV" },
        ],
    },
    {
        id: "supervisor",
        nombre: "Supervisor regional",
        icon: "ClipboardList",
        tone: "ok",
        resumen: "Abre la jornada y registra lo que pasa en campo.",
        rutas: ["Dashboard", "Asistencia diaria", "Plantilla mensual", "Novedades", "Justificativos"],
        marcas: [
            { h: "05:50", t: "Abrir jornada · Miranda" },
            { h: "09:45", t: "Novedad · ausencia" },
            { h: "18:02", t: "Cerrar reporte" },
        ],
    },
    {
        id: "analyst",
        nombre: "Analista de operaciones",
        icon: "Search",
        tone: "warn",
        resumen: "Revisa justificativos y cruza inconsistencias.",
        rutas: ["Dashboard", "Incidencias · análisis", "Justificativos", "Reasignaciones", "Inconsistencias"],
        marcas: [
            { h: "10:20", t: "Justificativo recibido" },
            { h: "15:20", t: "Incidencia analizada" },
        ],
    },
    {
        id: "coordinator",
        nombre: "Coordinador",
        icon: "Gavel",
        tone: "crit",
        resumen: "Decide: escala a RRHH o muere en auditoría.",
        rutas: ["Dashboard", "Decisión de incidencias", "Asignación de supervisores", "Resumen por región", "Alertas"],
        marcas: [
            { h: "08:05", t: "Aprobada · escala a RRHH" },
            { h: "08:19", t: "Rechazada · auditoría" },
        ],
    },
    {
        id: "coordination_center",
        nombre: "Centro de coordinación",
        icon: "RadioTower",
        tone: "mute",
        resumen: "Vigila el día entero desde una sola pantalla.",
        rutas: ["Dashboard", "Incidencias en curso", "Eventos del día", "Alertas", "Notificaciones"],
        marcas: [
            { h: "14:03", t: "Puesto sin cubrir · alta" },
            { h: "14:11", t: "Cobertura asignada" },
        ],
    },
];

/* Las tres firmas del ciclo de una novedad. */
const ESTACIONES: { rol: string; accion: string; estado: string; tone: Tone; fecha: string }[] = [
    {
        rol: "Supervisor Regional",
        accion: "Registra la novedad en campo",
        estado: "Pendiente análisis",
        tone: "mute",
        fecha: "01/04 · 09:45",
    },
    {
        rol: "Analista de Operaciones",
        accion: "Revisa el justificativo",
        estado: "Analizada — por decidir",
        tone: "warn",
        fecha: "01/04 · 15:20",
    },
    {
        rol: "Coordinador",
        accion: "Decisión final con observación",
        estado: "Decisión registrada",
        tone: "info",
        fecha: "02/04 · 08:05",
    },
];

/* Menú lateral tal y como se ve en la maqueta del supervisor. */
const NAV_SUPERVISOR: { icon: string; label: string }[] = [
    { icon: "LayoutDashboard", label: "Dashboard" },
    { icon: "CalendarCheck", label: "Asistencia diaria" },
    { icon: "CalendarDays", label: "Plantilla mensual" },
    { icon: "AlertOctagon", label: "Novedades" },
    { icon: "FileCheck2", label: "Justificativos" },
    { icon: "Bell", label: "Alertas" },
];

const ROSTER: { nombre: string; cedula: string; novedad?: string }[] = [
    { nombre: "Nieves, José G.", cedula: "V-14.208.771" },
    { nombre: "Rangel, María C.", cedula: "V-19.443.902" },
    { nombre: "Bastidas, Luis E.", cedula: "V-12.997.140", novedad: "Cita médica · cubierta" },
    { nombre: "Chirinos, Ander J.", cedula: "V-21.008.365" },
    { nombre: "Salazar, Deivis A.", cedula: "V-17.554.881", novedad: "Ausencia · sin justificativo" },
    { nombre: "Pacheco, Eglee R.", cedula: "V-23.117.409" },
];

const CATEGORIAS = [
    "Ausencia injustificada",
    "Reposo médico",
    "Cita médica",
    "Vacaciones",
    "Permiso legal",
    "Ingreso de personal",
    "Egreso de personal",
    "Reasignación",
    "Cobertura por backup",
    "Puesto sin cubrir",
    "Retardo",
    "Cambio de turno",
    "Suspensión",
    "Servicio extra",
    "Capacitación",
    "Incidencia disciplinaria",
    "Abandono de puesto",
    "Traslado temporal",
    "Reposo post-vacacional",
    "Renuncia",
];

const OFICIALES = [
    { nombre: "Nieves, José G.", grupo: "GRP-A" },
    { nombre: "Rangel, María C.", grupo: "GRP-B" },
    { nombre: "Chirinos, Ander J.", grupo: "GRP-A" },
    { nombre: "Bastidas, Luis E.", grupo: "GRP-C" },
    { nombre: "Mendoza, Rosa M.", grupo: "GRP-B" },
    { nombre: "Salazar, Deivis A.", grupo: "GRP-C" },
    { nombre: "Pacheco, Eglee R.", grupo: "GRP-A" },
    { nombre: "Ojeda, Carlos D.", grupo: "GRP-B" },
];

const INCIDENCIAS: {
    oficial: string;
    sede: string;
    cliente: string;
    motivo: string;
    fecha: string;
    estado: string;
    tone: Tone;
}[] = [
    {
        oficial: "Bastidas, Luis E.",
        sede: "CC Líder · Guarenas",
        cliente: "Centro Líder",
        motivo: "Ausencia injustificada",
        fecha: "01/04/2026",
        estado: "Analizada — por decidir",
        tone: "warn",
    },
    {
        oficial: "Salazar, Deivis A.",
        sede: "Depósito Santa Teresa",
        cliente: "Alimentos Santa Teresa",
        motivo: "Abandono de puesto",
        fecha: "01/04/2026",
        estado: "Analizada — por decidir",
        tone: "warn",
    },
    {
        oficial: "Ojeda, Carlos D.",
        sede: "Planta Charallave",
        cliente: "Industrias Charallave",
        motivo: "Retardo reiterado",
        fecha: "31/03/2026",
        estado: "Pendiente análisis",
        tone: "mute",
    },
    {
        oficial: "Mendoza, Rosa M.",
        sede: "Torre Miranda",
        cliente: "Corporación Miranda",
        motivo: "Falta de uniforme",
        fecha: "30/03/2026",
        estado: "Aprobada · escalada a RRHH",
        tone: "ok",
    },
    {
        oficial: "Chirinos, Ander J.",
        sede: "Sede Higuerote",
        cliente: "Marina Higuerote",
        motivo: "Ausencia justificada",
        fecha: "29/03/2026",
        estado: "Rechazada · auditoría",
        tone: "crit",
    },
];

/* Valor determinista para el mapa de calor: nada de Math.random. */
const heat = (row: number, col: number) => {
    if ((row + col * 2) % 7 === 0) return 0;
    return ((row * 7 + col * 5 + row * col) % 23) + 1;
};

const heatTone = (v: number): { bg: string; fg: string } => {
    if (v === 0) return { bg: "#f1f5f9", fg: "transparent" };
    if (v <= 5) return { bg: "#dbeafe", fg: "#1d4ed8" };
    if (v <= 15) return { bg: "#fef3c7", fg: "#b45309" };
    return { bg: "#fee2e2", fg: "#b91c1c" };
};

/* Damero de la plantilla mensual: 24h / L / A / V, determinista por índice. */
const turno = (row: number, col: number): "24h" | "L" | "A" | "V" => {
    const grupo = row % 3;
    if (row === 4 && col >= 17 && col <= 23) return "V";
    if (col === 11 + grupo && row % 2 === 1) return "A";
    return (col + grupo) % 2 === 0 ? "24h" : "L";
};

const TURNO_TONE: Record<string, { bg: string; fg: string }> = {
    "24h": { bg: "#dcfce7", fg: "#15803d" },
    L: { bg: "#dbeafe", fg: "#1d4ed8" },
    A: { bg: "#fee2e2", fg: "#b91c1c" },
    V: { bg: "#f1f5f9", fg: "#64748b" },
};

const DIAS = Array.from({ length: 30 }, (_, i) => i + 1);

/* El árbol real de carpetas descrito en la arquitectura. */
const ARBOL: { linea: string; nota?: string }[] = [
    { linea: "src/" },
    { linea: "├─ app/", nota: "App · routes.tsx · providers" },
    { linea: "├─ shared/" },
    { linea: "│  ├─ api/", nota: "cliente Axios · interceptores · ApiResult" },
    { linea: "│  ├─ components/", nota: "ui · data · form · feedback · pagination · layout" },
    { linea: "│  ├─ hooks/", nota: "usePagination · useApi · useDebounce · useT · useAuth" },
    { linea: "│  ├─ store/", nota: "auth · theme · lang · ui · notifications · incidencias" },
    { linea: "│  ├─ i18n/", nota: "es · en · 191 claves" },
    { linea: "│  ├─ mock/", nota: "db.ts — exportación real del Excel operativo" },
    { linea: "│  └─ utils/", nota: "notify · exportCsv · applyServerErrors · cn" },
    { linea: "└─ features/", nota: "15 módulos autónomos · 25 rutas diferidas" },
];

const MODULOS = [
    "auth",
    "dashboard",
    "personal",
    "attendance",
    "events",
    "incidencias",
    "justifications",
    "reports",
    "assignments",
    "catalogs",
    "users",
    "admin",
    "operator",
    "notifications",
    "profile",
];

/* La hora en la que cada funcionalidad "ficha" dentro de la jornada. */
const horaDeFeature = (i: number) => {
    const total = 360 + i * 75;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const SWATCHES: { label: string; value: string; nota: string }[] = [
    { label: "primary", value: p.brand.primary, nota: "acción y estado activo" },
    { label: "secondary", value: p.brand.secondary, nota: "barra lateral · ancla" },
    { label: "accent", value: p.brand.accent, nota: "ok · presente · aprobada" },
    { label: "bg", value: p.brand.bg, nota: "fondo de la aplicación" },
    { label: "surface", value: p.brand.surface, nota: "tarjetas y tablas" },
    { label: "text", value: p.brand.text, nota: "texto principal" },
];

const css = `
.vt-sys {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.vt-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.vt-rule-dark {
  background-image: repeating-linear-gradient(to right, rgba(148,163,184,0.10) 0 1px, transparent 1px 60px);
}
.vt-rule-light {
  background-image: repeating-linear-gradient(to right, rgba(15,23,42,0.055) 0 1px, transparent 1px 60px);
}
.vt-card {
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15,23,42,0.06), 0 8px 24px -16px rgba(15,23,42,0.35);
}

@keyframes vt-stamp {
  0%   { opacity: 0; transform: scale(0.6) translateY(6px); }
  68%  { opacity: 1; transform: scale(1.06) translateY(0); }
  100% { opacity: 1; transform: scale(1); }
}
.vt-mark { animation: vt-stamp 0.52s cubic-bezier(.34,1.56,.64,1) both; }

@keyframes vt-ring {
  0%   { box-shadow: 0 0 0 0 currentColor; opacity: 0.55; }
  100% { box-shadow: 0 0 0 14px currentColor; opacity: 0; }
}
.vt-ring { animation: vt-ring 0.95s ease-out both; }

@keyframes vt-beat {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.55); }
  50%      { box-shadow: 0 0 0 7px rgba(220,38,38,0); }
}
.vt-beat { animation: vt-beat 2s ease-out infinite; }

@keyframes vt-cellin {
  from { opacity: 0; transform: scale(0.35); }
  to   { opacity: 1; transform: scale(1); }
}
.vt-grid .vt-cell { opacity: 0; }
.vt-grid.vt-lit .vt-cell { animation: vt-cellin 0.34s ease-out both; }

@keyframes vt-draw { to { stroke-dashoffset: 0; } }
.vt-line { stroke-dasharray: 240; stroke-dashoffset: 240; }
.vt-line.vt-on { animation: vt-draw 1.05s ease-out forwards; }

.vt-lane { transition: opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
.vt-lanes:hover .vt-lane { opacity: 0.35; }
.vt-lanes .vt-lane:hover { opacity: 1; }
.vt-lane-mark { transition: transform 0.2s ease; }
.vt-lane:hover .vt-lane-mark { transform: translateX(6px); }

.vt-row { transition: background 0.15s ease; }
.vt-row:hover { background: rgba(15,23,42,0.035); }

@keyframes vt-spin { to { transform: rotate(360deg); } }
.vt-spin { animation: vt-spin 0.85s linear infinite; }

@keyframes vt-tickin { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
.vt-tick { transform-origin: top center; animation: vt-tickin 0.55s ease-out both; }

.vt-feature { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
.vt-feature:hover { border-color: rgba(37,99,235,0.45); background: #ffffff; transform: translateY(-2px); }

@media (prefers-reduced-motion: reduce) {
  .vt-mark, .vt-ring, .vt-beat, .vt-spin, .vt-tick, .vt-line.vt-on { animation: none !important; }
  .vt-ring { display: none; }
  .vt-tick { transform: scaleY(1) !important; opacity: 1 !important; }
  .vt-line { stroke-dashoffset: 0 !important; }
  .vt-grid .vt-cell, .vt-grid.vt-lit .vt-cell { opacity: 1 !important; animation: none !important; }
}
`;

/* ------------------------------------------------------------------ *
 *  Piezas pequeñas
 * ------------------------------------------------------------------ */

const PillDark = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => {
    const t = DARK_TONE[tone];
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
            style={{ color: t.fg, background: t.bg, border: `1px solid ${t.bd}` }}
        >
            {children}
        </span>
    );
};

const PillLight = ({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) => {
    const t = LIGHT_TONE[tone];
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${className ?? ""}`}
            style={{ color: t.fg, background: t.bg }}
        >
            {children}
        </span>
    );
};

/** Reloj de jornada fijo: avanza de 05:30 a 23:30 según el scroll. */
const JornadaHud = () => {
    const { scrollYProgress } = useScroll();
    const [hora, setHora] = useState("05:30");
    const [pct, setPct] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const clamped = Math.min(1, Math.max(0, v));
        const total = 330 + clamped * (1410 - 330);
        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const next = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        setHora((prev) => (prev === next ? prev : next));
        const np = Math.round(clamped * 100);
        setPct((prev) => (prev === np ? prev : np));
    });

    return (
        <div
            aria-hidden
            className="fixed z-40 flex-col items-center hidden gap-3 -translate-y-1/2 left-4 top-1/2 lg:flex"
        >
            <div className="rounded-full border border-white/15 bg-[#0f172a]/85 px-3 py-2 text-center backdrop-blur-md shadow-lg">
                <span className="vt-mono block text-[13px] font-semibold text-white">{hora}</span>
                <span className="block text-[8px] uppercase tracking-[0.22em] text-slate-400">jornada</span>
            </div>
            <div className="relative w-[2px] h-40 rounded-full bg-white/15 overflow-hidden">
                <span
                    className="absolute inset-x-0 top-0 rounded-full"
                    style={{ height: `${pct}%`, background: "linear-gradient(#2563eb,#16a34a)" }}
                />
            </div>
            <span className="vt-mono text-[9px] text-slate-400">{String(pct).padStart(2, "0")}%</span>
        </div>
    );
};

/* ------------------------------------------------------------------ *
 *  Riel de fichaje del héroe
 * ------------------------------------------------------------------ */

const RielFichaje = () => (
    <div className="relative pl-6 sm:pl-8">
        <span aria-hidden className="absolute left-[9px] sm:left-[13px] top-2 bottom-2 w-[2px] bg-[#334155]" />
        <div className="space-y-3">
            {MARCAS.map((m, i) => {
                const t = DARK_TONE[m.tone];
                return (
                    <div key={m.hora} className="vt-mark relative flex items-center gap-3" style={{ animationDelay: `${i * 0.22}s` }}>
                        <span
                            aria-hidden
                            className={`absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 ml-[5px] sm:ml-[9px] h-2 w-2 rounded-full ${
                                m.tone === "crit" ? "vt-beat" : ""
                            }`}
                            style={{ background: t.fg }}
                        />
                        <span
                            aria-hidden
                            className="vt-ring absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 ml-[5px] sm:ml-[9px] h-2 w-2 rounded-full"
                            style={{ color: t.fg, animationDelay: `${i * 0.22}s` }}
                        />
                        <div
                            className="flex flex-1 items-center gap-3 rounded-[10px] border px-3 py-2"
                            style={{ borderColor: "rgba(148,163,184,0.18)", background: "rgba(30,41,59,0.72)" }}
                        >
                            <span className="vt-mono text-[13px] font-semibold text-white shrink-0">{m.hora}</span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[12px] font-semibold text-slate-100 truncate">{m.oficial}</span>
                                <span className="block text-[10px] text-slate-400 truncate">{m.sede}</span>
                            </span>
                            <PillDark tone={m.tone}>{m.etiqueta}</PillDark>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

/* ------------------------------------------------------------------ *
 *  Mockup 1 — Login (uiScreens[0])
 * ------------------------------------------------------------------ */

const MockLogin = () => (
    <div className="flex flex-col items-center justify-center bg-[#0f172a] px-4 py-10">
        <p className="text-3xl font-extrabold tracking-tight text-white">Vigtrack</p>
        <p className="mt-1 text-[12px] text-slate-400">Sistema de Gestión de Seguridad</p>

        <div className="mt-6 w-full max-w-[300px] rounded-2xl bg-[#1e293b] p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
            <div>
                <span className="block text-[12px] text-slate-300">Correo</span>
                <div className="mt-1.5 rounded-lg border border-[#475569] bg-[#334155] px-3 py-2">
                    <span className="text-[12px] text-slate-400">usuario@vigtrack.app</span>
                </div>
            </div>

            <div className="mt-5">
                <span className="block text-[12px] text-slate-300">Contraseña</span>
                <div className="relative mt-1.5 rounded-lg border border-[#475569] bg-[#334155] px-3 py-2">
                    <span className="vt-mono text-[12px] text-white">••••••••••</span>
                    <EyeOff size={13} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400" />
                </div>
            </div>

            <div
                className="mt-5 flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.30)" }}
            >
                <CircleAlert size={13} className="text-[#f87171] shrink-0" />
                <span className="text-[11px] text-[#fca5a5]">Credenciales inválidas</span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-2.5">
                <span className="vt-spin h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white" />
                <span className="text-[12px] font-semibold text-white">Iniciando sesión…</span>
            </div>
        </div>

        <p className="vt-mono mt-5 text-[10px] text-slate-500">Bearer inyectado por interceptor · 401 ⇒ logout</p>
    </div>
);

/* ------------------------------------------------------------------ *
 *  Mockup 2 — Asistencia diaria del supervisor (uiScreens[1])
 * ------------------------------------------------------------------ */

const MockAsistencia = () => (
    <div className="overflow-x-auto">
        <div className="flex min-w-[680px] bg-[#eef2f7]">
            {/* Barra lateral */}
            <aside className="flex w-[176px] shrink-0 flex-col bg-[#0f172a] py-3">
                <div className="px-3">
                    <p className="text-[15px] font-extrabold tracking-tight text-white">Vigtrack</p>
                    <p className="text-[9px] text-slate-400">Supervisor Regional</p>
                </div>

                <nav className="flex-1 mt-4 space-y-0.5">
                    {NAV_SUPERVISOR.map((item, i) => {
                        const Icon = iconOf(item.icon);
                        const active = i === 1;
                        return (
                            <div
                                key={item.label}
                                className="relative flex items-center gap-2 px-3 py-[7px]"
                                style={active ? { background: "rgba(37,99,235,0.22)" } : undefined}
                            >
                                {active && <span aria-hidden className="absolute inset-y-0 left-0 w-[2px] bg-white" />}
                                <Icon size={13} className={active ? "text-white" : "text-slate-400"} />
                                <span className={`text-[11px] ${active ? "font-semibold text-white" : "text-slate-400"}`}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2 px-3 pt-3 mt-3 border-t border-white/10">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2563eb] text-[11px] font-bold text-white">
                        J
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-[10px] font-semibold text-white">J. Marcano</span>
                        <span className="block truncate text-[9px] text-slate-500">jmarcano@vigtrack.app</span>
                    </span>
                </div>
            </aside>

            {/* Contenido */}
            <div className="flex-1 min-w-0 p-4">
                <p className="text-[15px] font-bold text-[#0f172a]">Asistencia diaria</p>
                <p className="text-[10px] text-[#64748b]">
                    Región Miranda · presente-por-defecto: todos laboran salvo novedad
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <div className="flex overflow-hidden rounded-lg border border-[#e2e8f0] bg-white">
                        {["Todos", "Sin novedad", "Con novedad"].map((f, i) => (
                            <span
                                key={f}
                                className={`px-2.5 py-1 text-[10px] ${
                                    i === 0 ? "bg-[#2563eb] font-semibold text-white" : "text-[#64748b]"
                                }`}
                            >
                                {f}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white px-1.5 py-1">
                        <ChevronLeft size={12} className="text-[#94a3b8]" />
                        <span className="vt-mono text-[10px] text-[#0f172a]">2026-04-01</span>
                        <ChevronRight size={12} className="text-[#94a3b8]" />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <PillLight tone="warn">Sin abrir</PillLight>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#2563eb] px-2.5 py-1 text-[10px] font-semibold text-white">
                            <Play size={10} /> Abrir jornada
                        </span>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#f1f5f9] px-3 py-2">
                    <Lock size={12} className="text-[#94a3b8]" />
                    <span className="text-[10px] text-[#64748b]">
                        Jornada no iniciada — abre la jornada para registrar el estado del día
                    </span>
                </div>

                <div className="mt-3 overflow-hidden bg-white vt-card">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#e2e8f0]">
                        <span className="text-[11px] font-semibold text-[#0f172a]">34 oficiales · miércoles, 1 de abril</span>
                        <span className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-[#16a34a]">31 presentes</span>
                            <span className="text-[10px] font-semibold text-[#d97706]">3 con novedad</span>
                        </span>
                    </div>

                    {ROSTER.map((r) => (
                        <div key={r.cedula} className="vt-row flex items-center gap-2 border-b border-[#f1f5f9] px-3 py-2 last:border-0">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#2563eb] text-[10px] font-bold text-white">
                                {r.nombre.charAt(0)}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[11px] font-semibold text-[#0f172a]">{r.nombre}</span>
                                <span className="vt-mono block text-[9px] text-[#94a3b8]">{r.cedula}</span>
                            </span>
                            {r.novedad ? (
                                <PillLight tone="warn">{r.novedad}</PillLight>
                            ) : (
                                <PillLight tone="ok">Presente</PillLight>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ------------------------------------------------------------------ *
 *  Mockup 3 — Incidencias, decisión del coordinador (uiScreens[3])
 * ------------------------------------------------------------------ */

const MockIncidencias = () => (
    <div className="overflow-x-auto bg-[#eef2f7]">
        <div className="min-w-[640px] p-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-bold text-[#0f172a]">Decisión de incidencias</span>
                <PillLight tone="warn">7 por decidir</PillLight>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-[#64748b]">
                Región Miranda · decisión final tras el análisis. El Analista analiza primero; aquí apruebas (escala a
                RRHH) o rechazas (muere en auditoría).
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-white p-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-2 py-1">
                    <Search size={11} className="text-[#94a3b8]" />
                    <span className="text-[10px] text-[#94a3b8]">Buscar oficial / motivo…</span>
                </div>
                {["Todos los clientes", "Todos los motivos", "Todos los estados"].map((s) => (
                    <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#e2e8f0] px-2 py-1 text-[10px] text-[#64748b]"
                    >
                        {s} <ChevronRight size={9} className="rotate-90" />
                    </span>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-[#2563eb]">
                    <Filter size={10} /> Limpiar
                </span>
            </div>

            <div className="mt-3 overflow-hidden bg-white vt-card">
                <div className="grid grid-cols-[1.3fr_1.2fr_1fr_0.7fr_0.8fr] gap-2 border-b border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-[9px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                    <span>Oficial</span>
                    <span>Sede / cliente</span>
                    <span>Motivo</span>
                    <span>Fecha</span>
                    <span>Estado</span>
                </div>

                {INCIDENCIAS.map((row) => (
                    <div
                        key={row.oficial}
                        className="vt-row grid grid-cols-[1.3fr_1.2fr_1fr_0.7fr_0.8fr] items-center gap-2 border-b border-[#f1f5f9] px-3 py-2 last:border-0"
                    >
                        <span className="text-[10px] font-semibold text-[#0f172a]">{row.oficial}</span>
                        <span className="min-w-0">
                            <span className="block truncate text-[10px] text-[#0f172a]">{row.sede}</span>
                            <span className="block truncate text-[9px] text-[#94a3b8]">{row.cliente}</span>
                        </span>
                        <span className="text-[10px] text-[#64748b]">{row.motivo}</span>
                        <span className="vt-mono text-[9px] text-[#64748b]">{row.fecha}</span>
                        <span className="flex items-center justify-end gap-1.5">
                            <PillLight tone={row.tone}>{row.estado}</PillLight>
                            <Eye size={12} className="text-[#94a3b8] shrink-0" />
                        </span>
                    </div>
                ))}

                <div className="flex items-center justify-between px-3 py-2 bg-[#f8fafc]">
                    <span className="text-[9px] text-[#94a3b8]">Mostrando 1–10 de 34</span>
                    <span className="flex items-center gap-1">
                        {["‹", "1", "2", "3", "›"].map((n, i) => (
                            <span
                                key={n}
                                className={`grid h-5 w-5 place-items-center rounded text-[9px] ${
                                    i === 1 ? "bg-[#2563eb] font-semibold text-white" : "text-[#64748b]"
                                }`}
                            >
                                {n}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

/* ------------------------------------------------------------------ *
 *  Mockup 4 — Modal de detalle con línea de aprobación (uiScreens[4])
 * ------------------------------------------------------------------ */

const PASOS: { rol: string; accion: string; fecha: string; estado: "hecho" | "rechazo" | "pendiente" }[] = [
    { rol: "Supervisor Regional", accion: "Registró la novedad", fecha: "01/04 · 09:45", estado: "hecho" },
    { rol: "Analista de Operaciones", accion: "Analizó el justificativo", fecha: "01/04 · 15:20", estado: "hecho" },
    { rol: "Coordinador", accion: "Decisión final", fecha: "— pendiente", estado: "pendiente" },
];

const DATOS_EVENTO: [string, string][] = [
    ["Oficial", "Bastidas, Luis E."],
    ["Cédula", "V-12.997.140"],
    ["Sede", "CC Líder · Guarenas"],
    ["Región", "Miranda"],
    ["Tipo de novedad", "Incidencia"],
    ["Tipo de incidencia", "Ausencia injustificada"],
    ["Fecha", "01/04/2026"],
];

const MockDetalle = () => (
    <div className="relative overflow-hidden rounded-2xl" style={{ background: "rgba(2,6,23,0.55)" }}>
        <div aria-hidden className="absolute inset-0 vt-rule-dark opacity-60" />
        <div className="relative p-4 sm:p-6">
            <div className="mx-auto max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-30px_rgba(2,6,23,0.85)]">
                <div className="flex items-center gap-2 border-b border-[#e2e8f0] px-4 py-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fef3c7] text-[#d97706]">
                        <CircleAlert size={14} />
                    </span>
                    <span className="flex-1 text-[12px] font-bold text-[#0f172a]">Detalle de la novedad</span>
                    <X size={14} className="text-[#94a3b8]" />
                </div>

                <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-3">
                    {DATOS_EVENTO.map(([k, v]) => (
                        <span key={k} className="min-w-0">
                            <span className="block text-[9px] uppercase tracking-wide text-[#94a3b8]">{k}</span>
                            <span className="block truncate text-[11px] font-semibold text-[#0f172a]">{v}</span>
                        </span>
                    ))}
                </div>

                <div className="border-t border-[#e2e8f0] px-4 py-3">
                    <span className="block text-[9px] uppercase tracking-[0.16em] text-[#94a3b8]">
                        Recorrido de la aprobación
                    </span>

                    <div className="relative mt-3 pl-6">
                        <span aria-hidden className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-[#e2e8f0]" />
                        {PASOS.map((paso) => (
                            <div key={paso.rol} className="relative flex items-start gap-2 pb-4 last:pb-0">
                                <span
                                    aria-hidden
                                    className="absolute -left-6 top-0.5 ml-[1px] grid h-4 w-4 place-items-center rounded-full"
                                    style={{
                                        background: paso.estado === "hecho" ? "#16a34a" : "#ffffff",
                                        border: paso.estado === "hecho" ? "none" : "2px solid #cbd5e1",
                                    }}
                                >
                                    {paso.estado === "hecho" && <Check size={9} className="text-white" strokeWidth={3} />}
                                </span>
                                <span className="flex-1 min-w-0">
                                    <span className="block text-[11px] font-semibold text-[#0f172a]">{paso.rol}</span>
                                    <span className="block text-[10px] text-[#64748b]">{paso.accion}</span>
                                </span>
                                <span className="vt-mono text-[9px] text-[#94a3b8] shrink-0">{paso.fecha}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[#e2e8f0] px-4 py-3">
                    <span className="block text-[9px] uppercase tracking-wide text-[#94a3b8]">Observación (obligatoria)</span>
                    <div className="mt-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2 py-2 text-[10px] text-[#94a3b8]">
                        Escribe el motivo de la decisión…
                    </div>
                    <div className="flex gap-2 mt-3">
                        <span className="flex-1 rounded-lg bg-[#16a34a] py-2 text-center text-[11px] font-semibold text-white">
                            Aprobar · escala a RRHH
                        </span>
                        <span className="flex-1 rounded-lg border border-[#dc2626] py-2 text-center text-[11px] font-semibold text-[#dc2626]">
                            Rechazar · auditoría
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ------------------------------------------------------------------ *
 *  Mockup 5 — Parte numérica: el mapa de calor (uiScreens[2])
 * ------------------------------------------------------------------ */

const MockParte = () => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.15);

    return (
        <div ref={ref} className={`vt-grid ${inView ? "vt-lit" : ""}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[15px] font-bold text-[#0f172a]">Parte Numérica</p>
                    <p className="text-[11px] text-[#64748b]">20 categorías · 30 días</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-2 py-1">
                    <ChevronLeft size={13} className="text-[#94a3b8]" />
                    <span className="w-12 text-center text-[11px] font-semibold text-[#0f172a]">Abril</span>
                    <ChevronRight size={13} className="text-[#94a3b8]" />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
                {[
                    { c: "#f1f5f9", l: "0" },
                    { c: "#dbeafe", l: "1–5" },
                    { c: "#fef3c7", l: "6–15" },
                    { c: "#fee2e2", l: "16+" },
                ].map((leg) => (
                    <span key={leg.l} className="inline-flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-[3px] border border-[#e2e8f0]" style={{ background: leg.c }} />
                        <span className="text-[10px] text-[#64748b]">{leg.l}</span>
                    </span>
                ))}
                <span className="inline-flex items-center gap-1 ml-auto rounded-lg border border-[#e2e8f0] bg-white px-2 py-1 text-[10px] font-semibold text-[#2563eb]">
                    <Download size={11} /> CSV
                </span>
            </div>

            <div className="mt-3 overflow-x-auto bg-white vt-card">
                <table className="border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 min-w-[150px] border-b border-[#e2e8f0] bg-[#f8fafc] px-2 py-1.5 text-left text-[10px] font-semibold text-[#64748b]">
                                Categoría
                            </th>
                            {DIAS.map((d) => (
                                <th
                                    key={d}
                                    className="min-w-[28px] border-b border-[#e2e8f0] bg-[#f8fafc] px-0 py-1.5 text-center text-[9px] font-medium text-[#94a3b8]"
                                >
                                    {d}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CATEGORIAS.map((cat, r) => (
                            <tr key={cat} className="vt-row">
                                <td className="sticky left-0 z-10 min-w-[150px] bg-white px-2 py-[3px] text-[10px] text-[#0f172a] whitespace-nowrap">
                                    {cat}
                                </td>
                                {DIAS.map((d, c) => {
                                    const v = heat(r, c);
                                    const tone = heatTone(v);
                                    return (
                                        <td key={d} className="px-[1px] py-[1px]">
                                            <span
                                                className="vt-cell vt-mono grid h-6 w-7 place-items-center rounded-[4px] text-[9px] font-semibold"
                                                style={{
                                                    background: tone.bg,
                                                    color: tone.fg,
                                                    animationDelay: `${(r + c) * 8}ms`,
                                                }}
                                            >
                                                {v === 0 ? "" : v}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ *
 *  Mockup 6 — Plantilla mensual (uiScreens[5])
 * ------------------------------------------------------------------ */

const MockPlantilla = () => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.2);

    return (
        <div ref={ref} className={`vt-grid ${inView ? "vt-lit" : ""}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[15px] font-bold text-[#0f172a]">Plantilla mensual</p>
                    <p className="text-[11px] text-[#64748b]">30 días por oficial · damero de 24 horas</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-2 py-1">
                        <ChevronLeft size={13} className="text-[#94a3b8]" />
                        <span className="w-12 text-center text-[11px] font-semibold text-[#0f172a]">Abril</span>
                        <ChevronRight size={13} className="text-[#94a3b8]" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white px-2 py-1 text-[10px] font-semibold text-[#2563eb]">
                        <Download size={11} /> CSV
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
                {[
                    { k: "24h", l: "día laborado" },
                    { k: "L", l: "libre" },
                    { k: "A", l: "ausencia" },
                    { k: "V", l: "vacaciones" },
                ].map((leg) => (
                    <span key={leg.k} className="inline-flex items-center gap-1.5">
                        <span
                            className="vt-mono grid h-5 w-7 place-items-center rounded-[4px] text-[9px] font-semibold"
                            style={{ background: TURNO_TONE[leg.k].bg, color: TURNO_TONE[leg.k].fg }}
                        >
                            {leg.k}
                        </span>
                        <span className="text-[10px] text-[#64748b]">{leg.l}</span>
                    </span>
                ))}
            </div>

            <div className="mt-3 overflow-x-auto bg-white vt-card">
                <table className="border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 min-w-[150px] border-b border-[#e2e8f0] bg-[#f8fafc] px-2 py-1.5 text-left text-[10px] font-semibold text-[#64748b]">
                                Oficial
                            </th>
                            {DIAS.map((d) => (
                                <th
                                    key={d}
                                    className="min-w-[28px] border-b border-[#e2e8f0] bg-[#f8fafc] py-1.5 text-center text-[9px] font-medium text-[#94a3b8]"
                                >
                                    {d}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {OFICIALES.map((o, r) => (
                            <tr key={o.nombre} className="vt-row">
                                <td className="sticky left-0 z-10 min-w-[150px] max-w-[170px] bg-white px-2 py-[3px]">
                                    <span className="block truncate text-[10px] font-semibold text-[#0f172a]">{o.nombre}</span>
                                    <span className="vt-mono block text-[9px] text-[#94a3b8]">{o.grupo}</span>
                                </td>
                                {DIAS.map((d, c) => {
                                    const k = turno(r, c);
                                    const tone = TURNO_TONE[k];
                                    return (
                                        <td key={d} className="px-[1px] py-[1px]">
                                            <span
                                                className="vt-cell vt-mono grid h-6 w-7 place-items-center rounded-[4px] text-[8px] font-semibold"
                                                style={{
                                                    background: tone.bg,
                                                    color: tone.fg,
                                                    animationDelay: `${(r + c) * 8}ms`,
                                                }}
                                            >
                                                {k}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ *
 *  Flujo de una incidencia: tres estaciones y dos ramas
 * ------------------------------------------------------------------ */

const Conector = ({ on }: { on: boolean }) => (
    <div className="flex items-center justify-center shrink-0 md:w-14">
        <svg viewBox="0 0 60 12" className="w-3 h-8 md:h-3 md:w-full" preserveAspectRatio="none" aria-hidden>
            <line
                x1="0"
                y1="6"
                x2="60"
                y2="6"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                className={`vt-line ${on ? "vt-on" : ""}`}
                style={{ strokeDasharray: 60, strokeDashoffset: on ? undefined : 60 }}
            />
        </svg>
    </div>
);

const FlujoIncidencia = () => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.25);

    return (
        <div ref={ref}>
            <div className="flex flex-col items-stretch md:flex-row md:items-center">
                {ESTACIONES.map((e, i) => (
                    <div key={e.rol} className="contents">
                        <div
                            className="flex-1 rounded-[10px] border p-4"
                            style={{ borderColor: "rgba(148,163,184,0.22)", background: "rgba(15,23,42,0.55)" }}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="vt-mono grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold"
                                    style={{ background: DARK_TONE[e.tone].bg, color: DARK_TONE[e.tone].fg }}
                                >
                                    {i + 1}
                                </span>
                                <span className="text-[13px] font-bold text-white">{e.rol}</span>
                            </div>
                            <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{e.accion}</p>
                            <div className="mt-3">
                                <PillDark tone={e.tone}>{e.estado}</PillDark>
                            </div>
                            <p className="vt-mono mt-2 text-[10px] text-slate-500">{e.fecha}</p>
                        </div>
                        {i < ESTACIONES.length - 1 && <Conector on={inView} />}
                    </div>
                ))}
            </div>

            <div className="relative mt-2">
                <svg viewBox="0 0 400 60" className="w-full h-14" preserveAspectRatio="none" aria-hidden>
                    <path
                        d="M200,0 C200,30 100,26 100,58"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="2"
                        className={`vt-line ${inView ? "vt-on" : ""}`}
                    />
                    <path
                        d="M200,0 C200,30 300,26 300,58"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        className={`vt-line ${inView ? "vt-on" : ""}`}
                    />
                </svg>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {[
                    { tone: "ok" as Tone, titulo: "Aprobada · escalada a RRHH", nota: "La decisión sale del sistema operativo y entra en el expediente del oficial." },
                    { tone: "crit" as Tone, titulo: "Rechazada · auditoría", nota: "La incidencia muere aquí, pero queda registrada con su observación y su fecha." },
                ].map((rama) => (
                    <div
                        key={rama.titulo}
                        className="rounded-[10px] border p-4"
                        style={{ borderColor: DARK_TONE[rama.tone].bd, background: DARK_TONE[rama.tone].bg }}
                    >
                        <p className="text-[13px] font-bold" style={{ color: DARK_TONE[rama.tone].fg }}>
                            {rama.titulo}
                        </p>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-slate-300">{rama.nota}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ *
 *  Landing
 * ------------------------------------------------------------------ */

const Landing = () => {
    const reduce = useReducedMotion();
    const favicon = p.media.find((m) => m.src.endsWith(".svg"));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="vt-sys">
            <style>{css}</style>
            {!reduce && <JornadaHud />}

            {/* ══════════════════ HÉROE · turno de noche ══════════════════ */}
            <section className="relative overflow-hidden bg-[#0f172a] px-4 pt-28 pb-20 text-slate-200 md:px-6 md:pt-36 md:pb-28">
                <div aria-hidden className="absolute inset-0 vt-rule-dark" />
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[620px]"
                    style={{
                        background:
                            "radial-gradient(58% 60% at 30% 0%, rgba(37,99,235,0.20), transparent 70%), radial-gradient(40% 50% at 90% 20%, rgba(37,99,235,0.10), transparent 70%)",
                    }}
                />

                <div className="relative grid max-w-6xl gap-12 mx-auto lg:grid-cols-[1.05fr_1fr] lg:items-center">
                    <div className="min-w-0">
                        <p className="vt-mono text-[11px] uppercase tracking-[0.3em] text-[#60a5fa]">
                            05:30 · antes del primer relevo
                        </p>

                        <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl">
                            {p.name}
                        </h1>

                        <p className="max-w-xl mt-5 text-base leading-relaxed text-slate-300 md:text-xl">
                            <RevealWords text={p.tagline} />
                        </p>

                        <p className="max-w-xl mt-5 text-sm leading-relaxed text-slate-400 md:text-base">
                            Una jornada entera —de la primera entrada al cierre del reporte— dentro de una sola
                            aplicación web, con el rastro de quién decidió qué y cuándo.
                        </p>

                        <div className="flex flex-wrap gap-2 mt-8">
                            <Chip>{p.category}</Chip>
                            <Chip>{p.year}</Chip>
                        </div>

                        <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
                            <div
                                className="rounded-[10px] border px-3 py-2.5"
                                style={{ borderColor: "rgba(148,163,184,0.20)", background: "rgba(30,41,59,0.6)" }}
                            >
                                <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">Rol</span>
                                <span className="block mt-1 text-[12px] font-semibold text-slate-200">{p.role}</span>
                            </div>
                            <div
                                className="rounded-[10px] border px-3 py-2.5"
                                style={{ borderColor: "rgba(148,163,184,0.20)", background: "rgba(30,41,59,0.6)" }}
                            >
                                <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">Estado</span>
                                <span className="block mt-1 text-[12px] font-semibold text-slate-200">{p.status}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8">
                            <a
                                href="#pantallas"
                                className="inline-flex items-center gap-2 rounded-[10px] bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
                            >
                                <Eye size={15} /> Ver las pantallas
                            </a>
                            <a
                                href="#arquitectura"
                                className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-[#60a5fa] hover:text-white"
                            >
                                <Clock size={15} /> Cómo está hecho
                            </a>
                            {p.links.web && (
                                <a
                                    href={p.links.web}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200"
                                >
                                    Abrir el sitio
                                </a>
                            )}
                            {p.links.github && (
                                <a
                                    href={p.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200"
                                >
                                    Ver el código
                                </a>
                            )}
                        </div>

                        {Object.keys(p.links).length === 0 && (
                            <p className="vt-mono mt-4 text-[10px] text-slate-500">
                                Sistema interno de una empresa de vigilancia · sin acceso público
                            </p>
                        )}
                    </div>

                    <div className="relative min-w-0">
                        <div className="flex items-center justify-between mb-4">
                            <span className="vt-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                Riel de fichaje · 01/04/2026
                            </span>
                            <span className="vt-mono text-[10px] text-slate-500">Región Miranda</span>
                        </div>
                        <RielFichaje />
                        <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/10">
                            <span className="vt-mono text-[13px] font-semibold text-white">06:00 → 18:00</span>
                            <span className="text-[10px] text-slate-500">turno diurno · relevo cada 12 h</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════ PROBLEMA / SOLUCIÓN ══════════════════ */}
            <section className="relative bg-[#0f172a] px-4 py-20 text-slate-200 md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-0 vt-rule-dark opacity-70" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="04:40 · antes de la aplicación"
                        title={
                            <span className="text-white">
                                Toda una operación <span className="text-[#60a5fa]">dentro de un Excel</span>
                            </span>
                        }
                        lead="Decenas de sedes, varias regiones y una única cuadrícula que todos miraban igual."
                    />

                    <div className="grid gap-6 mt-12 lg:grid-cols-2 lg:items-start">
                        <Reveal direction="right" className="min-w-0">
                            <div
                                className="min-w-0 overflow-hidden rounded-[10px] border"
                                style={{ borderColor: "rgba(148,163,184,0.20)", background: "rgba(30,41,59,0.55)" }}
                            >
                                <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "rgba(148,163,184,0.16)" }}>
                                    <FileSpreadsheet size={14} className="text-[#4ade80]" />
                                    <span className="vt-mono text-[11px] text-slate-400">parte_cecom_abril.xlsx</span>
                                    <span className="vt-mono ml-auto text-[10px] text-slate-600">6 pestañas</span>
                                </div>

                                <div className="p-3 overflow-x-auto">
                                    <table className="border-collapse min-w-[420px]">
                                        <thead>
                                            <tr>
                                                <th className="border border-white/8 bg-white/[0.04] px-2 py-1 text-left text-[10px] font-normal text-slate-500">
                                                    A
                                                </th>
                                                {["B", "C", "D", "E", "F", "G"].map((c) => (
                                                    <th
                                                        key={c}
                                                        className="border border-white/8 bg-white/[0.04] px-2 py-1 text-center text-[10px] font-normal text-slate-500"
                                                    >
                                                        {c}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="vt-mono">
                                            {[
                                                ["Categoría", "01", "02", "03", "04", "05", "06"],
                                                ["Ausencias", "3", "1", "", "7", "2", ""],
                                                ["Vacaciones", "12", "12", "11", "11", "10", "10"],
                                                ["Egresos", "", "2", "", "", "1", ""],
                                                ["Reasignados", "4", "", "3", "", "", "6"],
                                                ["Sin cubrir", "1", "", "", "2", "", ""],
                                            ].map((fila, i) => (
                                                <tr key={fila[0]}>
                                                    {fila.map((celda, j) => (
                                                        <td
                                                            key={`${fila[0]}-${j}`}
                                                            className={`border border-white/8 px-2 py-1 text-[10px] ${
                                                                j === 0 ? "text-slate-300" : "text-center text-slate-500"
                                                            } ${i === 0 ? "text-slate-400" : ""}`}
                                                        >
                                                            {celda}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t px-4 py-3" style={{ borderColor: "rgba(148,163,184,0.16)" }}>
                                    <p className="text-[13px] leading-relaxed text-slate-400">{p.problem}</p>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.12} className="min-w-0">
                            <div
                                className="h-full min-w-0 rounded-[10px] border p-5 md:p-7"
                                style={{
                                    borderColor: "rgba(37,99,235,0.42)",
                                    background: "linear-gradient(160deg, rgba(37,99,235,0.16), rgba(15,23,42,0.4))",
                                }}
                            >
                                <span className="vt-mono text-[10px] uppercase tracking-[0.24em] text-[#60a5fa]">
                                    la traducción
                                </span>
                                <h3 className="mt-3 text-xl font-bold text-white md:text-2xl">
                                    Cada rol mira su propia realidad
                                </h3>
                                <p className="mt-4 text-[13px] leading-relaxed text-slate-300 md:text-[15px]">{p.solution}</p>

                                <div className="grid gap-2 mt-6 sm:grid-cols-2">
                                    {[
                                        { t: "Hoja de cálculo", tone: "crit" as Tone },
                                        { t: "Aplicación por rol", tone: "ok" as Tone },
                                        { t: "Nadie sabía el estado", tone: "crit" as Tone },
                                        { t: "Jornada con estado", tone: "ok" as Tone },
                                        { t: "Decisiones por WhatsApp", tone: "crit" as Tone },
                                        { t: "Tres firmas auditables", tone: "ok" as Tone },
                                    ].map((row) => (
                                        <span
                                            key={row.t}
                                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px]"
                                            style={{
                                                background: DARK_TONE[row.tone].bg,
                                                color: DARK_TONE[row.tone].fg,
                                                border: `1px solid ${DARK_TONE[row.tone].bd}`,
                                            }}
                                        >
                                            {row.tone === "ok" ? <Check size={11} /> : <X size={11} />}
                                            {row.t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════ LOGIN + ROLES ══════════════════ */}
            <section className="relative bg-[#0f172a] px-4 py-20 text-slate-200 md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-0 vt-rule-dark opacity-60" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="05:30 · quién entra"
                        title={
                            <span className="text-white">
                                Un solo login, <span className="text-[#60a5fa]">cinco aplicaciones</span>
                            </span>
                        }
                        lead="El mismo dominio se comporta como cinco productos distintos: menú, dashboard y rutas protegidas propias."
                    />

                    <div className="grid gap-8 mt-12 lg:grid-cols-[420px_1fr] lg:items-start">
                        <Reveal direction="right" className="min-w-0">
                            <BrowserFrame url="vigtrack.app/login">
                                <MockLogin />
                            </BrowserFrame>
                            <p className="vt-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                {p.uiScreens[0]?.name}
                            </p>
                        </Reveal>

                        <div className="vt-lanes min-w-0 space-y-3">
                            {ROLES.map((rol, i) => {
                                const Icon = iconOf(rol.icon);
                                const t = DARK_TONE[rol.tone];
                                return (
                                    <Reveal key={rol.id} direction="left" delay={i * 0.06}>
                                        <div
                                            className="vt-lane rounded-[10px] border p-4"
                                            style={{ borderColor: "rgba(148,163,184,0.18)", background: "rgba(30,41,59,0.5)" }}
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className="grid rounded-lg h-8 w-8 place-items-center"
                                                    style={{ background: t.bg, color: t.fg }}
                                                >
                                                    <Icon size={15} />
                                                </span>
                                                <span className="text-[14px] font-bold text-white">{rol.nombre}</span>
                                                <span className="vt-mono ml-auto text-[10px] text-slate-500">
                                                    RequireRole([&quot;{rol.id}&quot;])
                                                </span>
                                            </div>

                                            <p className="mt-2 text-[12px] text-slate-400">{rol.resumen}</p>

                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {rol.rutas.map((ruta) => (
                                                    <span
                                                        key={ruta}
                                                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
                                                    >
                                                        {ruta}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="relative mt-4 pl-5">
                                                <span aria-hidden className="absolute left-1 top-1.5 bottom-1.5 w-px bg-white/12" />
                                                {rol.marcas.map((marca) => (
                                                    <div key={marca.h} className="vt-lane-mark flex items-center gap-2 py-0.5">
                                                        <span
                                                            aria-hidden
                                                            className="absolute left-0 w-2 h-2 rounded-full"
                                                            style={{ background: t.fg }}
                                                        />
                                                        <span className="vt-mono text-[10px] text-slate-500">{marca.h}</span>
                                                        <span className="text-[11px] text-slate-400">{marca.t}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════ HIGHLIGHTS ══════════════════ */}
            <section
                className="relative px-4 py-20 text-slate-200 md:px-6 md:py-28"
                style={{ background: "linear-gradient(180deg,#0f172a,#16213a)" }}
            >
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="07:00 · lo que sostiene la operación"
                        title={
                            <span className="text-white">
                                Cinco piezas que <span className="text-[#60a5fa]">no se pueden saltar</span>
                            </span>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title} className={i === 0 ? "lg:col-span-2" : ""}>
                                    <div
                                        className="relative h-full overflow-hidden rounded-[10px] border p-5 transition-colors duration-300 hover:border-[#2563eb]/60"
                                        style={{ borderColor: "rgba(148,163,184,0.18)", background: "rgba(30,41,59,0.5)" }}
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute inset-y-0 left-0 w-[2px]"
                                            style={{ background: i % 2 === 0 ? "#2563eb" : "#16a34a" }}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563eb]/16 text-[#60a5fa]">
                                                <Icon size={16} />
                                            </span>
                                            <span className="vt-mono text-[10px] text-slate-600">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-[15px] font-bold text-white">{h.title}</h3>
                                        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════ FLUJO DE UNA INCIDENCIA ══════════════════ */}
            <section
                className="relative px-4 py-20 text-slate-200 md:px-6 md:py-28"
                style={{ background: "linear-gradient(180deg,#16213a,#1e293b)" }}
            >
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="09:45 · una novedad en curso"
                        title={
                            <span className="text-white">
                                El recorrido de <span className="text-[#60a5fa]">una incidencia</span>
                            </span>
                        }
                        lead="Registrar no es decidir. Entre el campo y RRHH hay tres firmas, y todas quedan con fecha."
                    />

                    <div className="mt-12">
                        <FlujoIncidencia />
                    </div>

                    <div className="grid gap-8 mt-16 lg:grid-cols-[1fr_460px] lg:items-center">
                        <div className="min-w-0">
                            <h3 className="text-xl font-bold text-white md:text-2xl">
                                El modal que dibuja el expediente completo
                            </h3>
                            <p className="mt-4 text-[13px] leading-relaxed text-slate-400 md:text-[15px]">
                                Los datos del evento arriba en pares etiqueta-valor y, debajo, la línea vertical de pasos:
                                círculo relleno con check para lo hecho, círculo hueco para lo pendiente y círculo rojo con
                                aspa cuando la incidencia se rechaza. Al pie, aprobar en verde, rechazar en rojo contorneado
                                y una observación que no se puede dejar vacía.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {["Pendiente análisis", "Analizada — por decidir", "Aprobada · escalada a RRHH", "Rechazada · auditoría"].map(
                                    (estado, i) => (
                                        <PillDark key={estado} tone={(["mute", "warn", "ok", "crit"] as Tone[])[i]}>
                                            {estado}
                                        </PillDark>
                                    )
                                )}
                            </div>
                            <p className="vt-mono mt-6 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                {p.uiScreens[4]?.name}
                            </p>
                        </div>

                        <Reveal direction="left" className="min-w-0">
                            <MockDetalle />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════ AMANECE ══════════════════ */}
            <section
                className="relative px-4 py-24 md:px-6"
                style={{ background: "linear-gradient(180deg,#1e293b 0%,#475569 34%,#94a3b8 62%,#cbd5e1 82%,#eef2f7 100%)" }}
            >
                <div className="relative max-w-3xl mx-auto text-center">
                    <span className="vt-mono text-[11px] uppercase tracking-[0.3em] text-slate-300">
                        05:59 → 06:00
                    </span>
                    <p className="mt-4 text-2xl font-extrabold leading-tight text-white md:text-4xl">
                        La jornada se abre.
                    </p>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#1e293b] md:text-base">
                        A partir de aquí todo ocurre a la luz del día: el roster, el parte numérico, la plantilla del mes.
                        Las mismas pantallas que sustituyeron a la hoja de cálculo.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <span
                                key={i}
                                className="vt-tick w-px bg-[#0f172a]/45"
                                style={{ height: `${10 + i * 4}px`, animationDelay: `${i * 60}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ PANTALLAS (día) ══════════════════ */}
            <section id="pantallas" className="relative bg-[#eef2f7] px-4 py-20 text-[#0f172a] md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-0 vt-rule-light" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="12:00 · la jornada abierta"
                        title={
                            <span className="text-[#0f172a]">
                                Las pantallas donde <span className="text-[#2563eb]">se trabaja</span>
                            </span>
                        }
                        lead="Recreadas aquí en HTML y CSS, con los mismos colores, pastillas y disposición del producto."
                    />

                    <Reveal className="mt-12">
                        <BrowserFrame url="vigtrack.app/attendance/daily" dark={false}>
                            <MockAsistencia />
                        </BrowserFrame>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                            <p className="vt-mono text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
                                {p.uiScreens[1]?.name}
                            </p>
                            <p className="text-[11px] text-[#64748b]">
                                Presente por defecto: solo se marca la excepción.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal className="mt-14" delay={0.08}>
                        <BrowserFrame url="vigtrack.app/incidencias/decision" dark={false}>
                            <MockIncidencias />
                        </BrowserFrame>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                            <p className="vt-mono text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
                                {p.uiScreens[3]?.name}
                            </p>
                            <p className="text-[11px] text-[#64748b]">
                                Una sola ruta, tres experiencias según el rol del store.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════ DATOS: parte numérica y plantilla ══════════════════ */}
            <section className="relative bg-[#e6ebf3] px-4 py-20 text-[#0f172a] md:px-6 md:py-28">
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="16:20 · el parte del día"
                        title={
                            <span className="text-[#0f172a]">
                                La hoja de cálculo, <span className="text-[#2563eb]">convertida en color</span>
                            </span>
                        }
                        lead="Veinte categorías por treinta días y un damero de turnos de 24 horas: dos cuadrículas que se leen de un vistazo y se exportan a CSV."
                    />

                    <div className="mt-12 space-y-14">
                        <Reveal>
                            <MockParte />
                            <p className="vt-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
                                {p.uiScreens[2]?.name}
                            </p>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <MockPlantilla />
                            <p className="vt-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
                                {p.uiScreens[5]?.name}
                            </p>
                        </Reveal>
                    </div>

                    <div className="grid gap-4 mt-14 md:grid-cols-3">
                        {[
                            {
                                t: "Columna fija",
                                d: "position sticky con fondo propio en claro y oscuro: al desplazarse treinta días no se pierde de vista la fila.",
                            },
                            {
                                t: "Color por rango",
                                d: "0, 1–5, 6–15 y 16+ con su leyenda, para interpretar la cuadrícula sin leer un solo número.",
                            },
                            {
                                t: "CSV con BOM UTF-8",
                                d: "El utilitario exportCsv escribe el BOM, escapa comillas y usa CRLF: Excel en español respeta ñ y tildes.",
                            },
                        ].map((card, i) => (
                            <Reveal key={card.t} delay={i * 0.06}>
                                <div className="h-full bg-white vt-card p-5">
                                    <p className="text-[13px] font-bold text-[#0f172a]">{card.t}</p>
                                    <p className="mt-2 text-[12px] leading-relaxed text-[#64748b]">{card.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ MÉTRICAS ══════════════════ */}
            <section className="relative bg-white px-4 py-20 text-[#0f172a] md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="18:00 · cambio de turno"
                        title={<span className="text-[#0f172a]">El tamaño real de la maqueta</span>}
                    />

                    <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-5">
                        {p.metrics.map((m, i) => (
                            <Reveal key={m.label} delay={(i % 5) * 0.05}>
                                <div className="relative">
                                    <CountMetric value={m.value} label={m.label} />
                                    <span
                                        aria-hidden
                                        className="vt-tick absolute -bottom-4 left-0 block w-[2px] bg-[#2563eb]/45"
                                        style={{ height: "14px", animationDelay: `${(i % 5) * 90}ms` }}
                                    />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ FUNCIONALIDADES ══════════════════ */}
            <section className="relative bg-[#eef2f7] px-4 py-20 text-[#0f172a] md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-0 vt-rule-light" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="20:00 · el turno completo"
                        title={
                            <span className="text-[#0f172a]">
                                Quince marcas en <span className="text-[#2563eb]">la misma jornada</span>
                            </span>
                        }
                        lead="Cada funcionalidad, fichada a su hora. Es todo lo que hoy hace la aplicación."
                    />

                    <Stagger className="grid gap-3 mt-12 md:grid-cols-2" stagger={0.05}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={16}>
                                <div className="vt-feature flex h-full items-start gap-3 rounded-[10px] border border-[#e2e8f0] bg-white/70 p-4">
                                    <span className="flex flex-col items-center gap-1 shrink-0">
                                        <span className="vt-mono text-[11px] font-semibold text-[#2563eb]">
                                            {horaDeFeature(i)}
                                        </span>
                                        <span aria-hidden className="w-px flex-1 bg-[#e2e8f0]" />
                                        <span
                                            aria-hidden
                                            className="h-1.5 w-1.5 rounded-full"
                                            style={{ background: i % 3 === 0 ? "#16a34a" : i % 3 === 1 ? "#2563eb" : "#d97706" }}
                                        />
                                    </span>
                                    <p className="text-[13px] leading-relaxed text-[#334155]">{f}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════ STACK ══════════════════ */}
            <section
                className="relative px-4 py-20 text-[#0f172a] md:px-6 md:py-24"
                style={{ background: "linear-gradient(180deg,#eef2f7,#e2e8f0)" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="21:10 · con qué está hecho"
                        title={<span className="text-[#0f172a]">El cuadro de turnos técnico</span>}
                    />

                    <div className="mt-12 overflow-hidden bg-white vt-card">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.05}>
                                <div
                                    className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center ${
                                        i < p.stack.length - 1 ? "border-b border-[#e2e8f0]" : ""
                                    }`}
                                >
                                    <span className="flex items-center gap-2 sm:w-56 shrink-0">
                                        <span
                                            aria-hidden
                                            className="h-6 w-[3px] rounded-full"
                                            style={{ background: i % 2 === 0 ? "#2563eb" : "#16a34a" }}
                                        />
                                        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0f172a]">
                                            {group.group}
                                        </span>
                                    </span>
                                    <span className="flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1 text-[11px] text-[#334155]"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ ARQUITECTURA ══════════════════ */}
            <section id="arquitectura" className="relative bg-[#e2e8f0] px-4 py-20 text-[#0f172a] md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="22:00 · bajo el capó"
                        title={
                            <span className="text-[#0f172a]">
                                Feature-first, <span className="text-[#2563eb]">y un solo contrato</span>
                            </span>
                        }
                        lead="Quince módulos autónomos, una capa HTTP tipada y un mock poblado con la exportación real del Excel."
                    />

                    <div className="grid gap-6 mt-12 lg:grid-cols-[1fr_1fr] lg:items-start">
                        <Reveal direction="right" className="min-w-0">
                            <div className="min-w-0 overflow-hidden rounded-[10px] bg-[#0f172a] shadow-[0_24px_60px_-30px_rgba(15,23,42,0.9)]">
                                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                                    <span className="h-2 w-2 rounded-full bg-[#f87171]" />
                                    <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                                    <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
                                    <span className="vt-mono ml-2 text-[10px] text-slate-500">estructura del proyecto</span>
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <div className="vt-mono min-w-[360px] text-[11px] leading-relaxed">
                                        {ARBOL.map((linea) => (
                                            <div key={linea.linea} className="flex gap-3">
                                                <span className="text-slate-200 whitespace-pre">{linea.linea}</span>
                                                {linea.nota && <span className="text-slate-600">{linea.nota}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="vt-mono rounded-lg border border-white/10 bg-black/30 p-3 text-[11px] leading-relaxed">
                                        <p className="text-[#60a5fa]">type ApiResult&lt;T&gt; =</p>
                                        <p className="text-slate-300">{"  | { ok: true;  data: T }"}</p>
                                        <p className="text-slate-300">
                                            {"  | { ok: false; status; detail; fieldErrors }"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.1} className="min-w-0">
                            <div className="p-5 bg-white vt-card md:p-7">
                                <p className="text-[13px] leading-relaxed text-[#334155] md:text-[14px]">{p.architecture}</p>
                            </div>

                            <div className="mt-6">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                                    Los quince módulos
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {MODULOS.map((m) => (
                                        <span
                                            key={m}
                                            className="vt-mono rounded-md border border-[#cbd5e1] bg-white px-2 py-1 text-[11px] text-[#334155]"
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 mt-6 sm:grid-cols-3">
                                {[
                                    { k: "42", l: "funciones de API tipadas" },
                                    { k: "11", l: "recursos REST" },
                                    { k: "6", l: "slices de Redux" },
                                ].map((box) => (
                                    <div key={box.l} className="p-3 bg-white vt-card">
                                        <p className="vt-mono text-xl font-extrabold text-[#2563eb]">{box.k}</p>
                                        <p className="mt-1 text-[11px] text-[#64748b]">{box.l}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════ RETOS ══════════════════ */}
            <section className="relative bg-[#eef2f7] px-4 py-20 text-[#0f172a] md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="22:40 · lo que costó"
                        title={
                            <span className="text-[#0f172a]">
                                Cinco novedades <span className="text-[#2563eb]">del propio proyecto</span>
                            </span>
                        }
                        lead="Registradas, analizadas y resueltas — el mismo ciclo que aplica la aplicación, aplicado al código."
                    />

                    <div className="mt-12 space-y-4">
                        {p.challenges.map((c, i) => (
                            <Reveal key={c.problem} delay={i * 0.05}>
                                <div className="overflow-hidden bg-white vt-card">
                                    <div className="grid md:grid-cols-2">
                                        <div className="border-b border-[#e2e8f0] p-5 md:border-b-0 md:border-r">
                                            <span className="inline-flex items-center gap-1.5">
                                                <PillLight tone="crit">Registrada</PillLight>
                                                <span className="vt-mono text-[10px] text-[#94a3b8]">
                                                    #{String(i + 1).padStart(2, "0")}
                                                </span>
                                            </span>
                                            <p className="mt-3 text-[13px] leading-relaxed text-[#334155]">{c.problem}</p>
                                        </div>
                                        <div className="p-5 bg-[#f8fafc]">
                                            <PillLight tone="ok">Resuelta</PillLight>
                                            <p className="mt-3 text-[13px] leading-relaxed text-[#334155]">{c.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ SISTEMA DE COLOR + MARCA ══════════════════ */}
            <section className="relative bg-[#e6ebf3] px-4 py-20 text-[#0f172a] md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="23:00 · el sistema de color"
                        title={<span className="text-[#0f172a]">El color nunca decora: informa</span>}
                        lead={p.brand.mood}
                    />

                    <div className="grid gap-3 mt-12 sm:grid-cols-3 lg:grid-cols-6">
                        {SWATCHES.map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.04}>
                                <div className="overflow-hidden bg-white vt-card">
                                    <span className="block h-16 border-b border-[#e2e8f0]" style={{ background: s.value }} />
                                    <span className="block p-3">
                                        <span className="vt-mono block text-[11px] font-semibold text-[#0f172a]">
                                            {s.label}
                                        </span>
                                        <span className="vt-mono block text-[10px] uppercase text-[#94a3b8]">{s.value}</span>
                                        <span className="block mt-1 text-[10px] text-[#64748b]">{s.nota}</span>
                                    </span>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div className="grid gap-3 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                            [
                                { k: "ok", l: "presente · aprobada", tone: "ok" as Tone },
                                { k: "warn", l: "novedad · por decidir", tone: "warn" as Tone },
                                { k: "crit", l: "sin cubrir · rechazada", tone: "crit" as Tone },
                                { k: "info", l: "informativo · relevo", tone: "info" as Tone },
                            ]
                        ).map((sem) => (
                            <div
                                key={sem.k}
                                className="rounded-[10px] p-4"
                                style={{ background: LIGHT_TONE[sem.tone].bg }}
                            >
                                <p className="vt-mono text-[12px] font-bold" style={{ color: LIGHT_TONE[sem.tone].fg }}>
                                    {sem.k}
                                </p>
                                <p className="mt-1 text-[11px]" style={{ color: LIGHT_TONE[sem.tone].fg }}>
                                    {sem.l}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 mt-10 md:grid-cols-[auto_1fr] md:items-center">
                        {favicon && (
                            <div className="flex items-center gap-4 p-4 bg-white vt-card">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={favicon.src} alt="Favicon actual de Vigtrack" className="w-12 h-12" />
                                <span>
                                    <span className="block text-[12px] font-bold text-[#0f172a]">favicon.svg</span>
                                    <span className="block text-[10px] text-[#94a3b8]">lo que sirve hoy index.html</span>
                                </span>
                            </div>
                        )}
                        {favicon && (
                            <p className="text-[12px] leading-relaxed text-[#64748b]">
                                {favicon.caption}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-10">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-3 py-1.5 text-[11px] text-[#334155]">
                            <Languages size={13} className="text-[#2563eb]" /> es / en · 191 claves
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-3 py-1.5 text-[11px] text-[#334155]">
                            <Icons.Sun size={13} className="text-[#d97706]" /> claro
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-3 py-1.5 text-[11px] text-[#334155]">
                            <Icons.Moon size={13} className="text-[#2563eb]" /> oscuro
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-3 py-1.5 text-[11px] text-[#334155]">
                            <Icons.MonitorSmartphone size={13} className="text-[#64748b]" /> sistema
                        </span>
                    </div>
                </div>
            </section>

            {/* ══════════════════ CIERRE DE JORNADA ══════════════════ */}
            <section
                className="relative px-4 py-24 md:px-6 md:py-28"
                style={{ background: "linear-gradient(180deg,#e6ebf3 0%,#cbd5e1 26%,#64748b 62%,#1e293b 88%,#0f172a 100%)" }}
            >
                <div className="max-w-3xl mx-auto">
                    <span className="vt-mono text-[11px] uppercase tracking-[0.3em] text-[#334155]">
                        23:30 · cierre de jornada
                    </span>

                    <Stagger className="mt-6 space-y-5">
                        {p.summary.map((parrafo, i) => (
                            <StaggerItem key={parrafo.slice(0, 24)}>
                                <p
                                    className="leading-relaxed"
                                    style={{
                                        color: i < 2 ? "#0f172a" : i === 2 ? "#1e293b" : "#cbd5e1",
                                        fontSize: i === 0 ? "1.0625rem" : "0.9375rem",
                                    }}
                                >
                                    {parrafo}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <div className="bg-[#0f172a] py-6 text-slate-400">
                <div className="vt-mono text-[11px] uppercase tracking-[0.2em]">
                    <Marquee
                        items={[
                            "ingreso",
                            "egreso",
                            "reasignación",
                            "vacación",
                            "ausencia",
                            "reposo médico",
                            "cobertura",
                            "incidencia",
                            "asignación de supervisor",
                        ]}
                        speed={38}
                        separator="·"
                    />
                </div>
            </div>

            <div className="bg-[#0f172a] pb-32 text-slate-200">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una operación completa —cinco roles, un ciclo de aprobación auditable y las cuadrículas que sustituyen al Excel— dentro de una sola aplicación React. Si tu empresa lleva su control en hojas de cálculo, éste es exactamente el terreno que conozco."
                />
            </div>
        </ProjectShell>
    );
};

export default Landing;
