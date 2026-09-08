"use client"

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    AlertTriangle,
    ArrowUpDown,
    Boxes,
    Building2,
    Calendar,
    Camera,
    CheckCircle2,
    ChevronRight,
    Clock,
    EyeOff,
    Filter,
    GitBranch,
    Inbox,
    Info,
    LayoutDashboard,
    Layers,
    LogOut,
    Map as MapIcon,
    MapPin,
    MessageCircle,
    Package,
    Plus,
    QrCode,
    Search,
    Server,
    Truck,
    UserCircle,
    Users,
    XCircle,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SampleDataNote, SectionHead } from "@/components/projects/bits";
import { BrowserFrame, PhoneFrame, ShotCard, AutoVideo, DragRail } from "@/components/projects/frames";
import { Reveal, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("humbolt")!;
const nxt = nextProject("humbolt");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Los ocho módulos reales del portal supervisor. Son las ocho losas del plano. */
const MODULES: { name: string; icon: LucideIcon; code: string }[] = [
    { name: "Dashboard", icon: LayoutDashboard, code: "M-01" },
    { name: "Usuarios", icon: Users, code: "M-02" },
    { name: "Clientes", icon: UserCircle, code: "M-03" },
    { name: "Destinatarios", icon: Building2, code: "M-04" },
    { name: "Tipos de Destino", icon: GitBranch, code: "M-05" },
    { name: "Choferes", icon: Truck, code: "M-06" },
    { name: "Envíos", icon: Package, code: "M-07" },
    { name: "Rutas", icon: MapIcon, code: "M-08" },
];

/* Desorden determinista de la rejilla rota: nada de Math.random en el render. */
const BROKEN = [
    { x: -26, y: -14, r: -13, z: 34 },
    { x: 22, y: -6, r: 9, z: -18 },
    { x: -10, y: 24, r: 17, z: 52 },
    { x: 30, y: 18, r: -7, z: 12 },
    { x: -34, y: 8, r: 6, z: -26 },
    { x: 14, y: 30, r: -19, z: 40 },
    { x: -18, y: -28, r: 12, z: 22 },
    { x: 26, y: -22, r: -10, z: -8 },
];

/* Los cuatro portales que monta App.tsx a partir del rol de /users/me. */
const PORTALS = [
    {
        title: "Supervisor",
        roles: "super_admin · admin",
        modules: "8 secciones",
        note: "Escritorio: alta de clientes, destinatarios, choferes y envíos, armado de rutas y asignación de paradas.",
        slabs: 6,
    },
    {
        title: "Operador",
        roles: "operator",
        modules: "Rutas asignadas",
        note: "Móvil del chofer: paradas, cámara trasera, evidencia y escaneo paquete por paquete.",
        slabs: 4,
    },
    {
        title: "Cliente Master",
        roles: "client_master",
        modules: "4 secciones",
        note: "Dashboard, usuarios de su compañía, destinatarios y envíos. Nada más del sistema.",
        slabs: 3,
    },
    {
        title: "Agencia",
        roles: "client_agency",
        modules: "3 secciones",
        note: "Dashboard, destinatarios y envíos de esa agencia, con el mismo módulo reutilizado.",
        slabs: 2,
    },
];

/* El ciclo real de un envío, de la oficina a la calle. */
const JOURNEY = [
    { step: "Alta de cliente", detail: "RIF J-30… validado", x: 60, y: 200, badge: null },
    { step: "Destinatario", detail: "país → estado → ciudad", x: 178, y: 122, badge: null },
    { step: "Envío", detail: "3 bultos · peso por bulto", x: 296, y: 200, badge: { text: "Pendiente", bg: "#E5E7EB", fg: "#4B5563" } },
    { step: "Etiqueta QR", detail: "GP… 1/3 impresa", x: 414, y: 122, badge: { text: "En Almacén", bg: "#EDE9FE", fg: "#6D28D9" } },
    { step: "Ruta", detail: "paradas por destinatario", x: 532, y: 200, badge: null },
    { step: "Parada", detail: "dropoff_stop_id resuelto", x: 650, y: 122, badge: { text: "En Tránsito", bg: "#DBEAFE", fg: "#1D4ED8" } },
    { step: "Foto", detail: "multipart /uploads/evidence", x: 768, y: 200, badge: null },
    { step: "Escaneo", detail: "/routes/{id}/stops/{id}/scan", x: 886, y: 122, badge: null },
    { step: "Entregado", detail: "cierre de la parada", x: 1004, y: 200, badge: { text: "Entregado", bg: "#10B981", fg: "#FFFFFF" } },
];

const JOURNEY_PATH =
    "M60,200 L178,122 L296,200 L414,122 L532,200 L650,122 L768,200 L886,122 L1004,200";

/* Los cuatro tipos de evento del WebSocket, con su color real. */
const EVENTS = [
    { type: "Éxito", color: "#10B981", icon: CheckCircle2, sample: "shipment.delivered · GP-4417832", n: 14 },
    { type: "Información", color: "#0EA5E9", icon: Info, sample: "route.started · RT-0091", n: 27 },
    { type: "Acción requerida", color: "#F59E0B", icon: AlertTriangle, sample: "recipient.address.pending", n: 5 },
    { type: "Error", color: "#EF4444", icon: XCircle, sample: "scan.mismatch · stop 4", n: 1 },
];

/* Las capas de la aplicación, de la primitiva al servidor. */
const LAYERS = [
    { name: "Primitivas de interfaz", detail: "shadcn/ui · 49 componentes sobre 28 primitivas de Radix", tag: "src/app/components/ui" },
    { name: "Layout propio", detail: "PortalShell · PageHeader · ResponsiveDataTable", tag: "src/app/components/layout" },
    { name: "Módulos de dominio", detail: "admin/ · shipping/ · routes/ · operator/ · client/", tag: "20 módulos" },
    { name: "Servicios generados", detail: "15 servicios + types.ts emitidos por gen_services.py", tag: "src/services" },
    { name: "API REST + WebSocket", detail: "axiomcoretech.store · openapi.json", tag: "45 rutas" },
];

const SHIPMENT_STATES = [
    { label: "Pendiente", bg: "#F3F4F6", fg: "#4B5563", bd: "#D1D5DB" },
    { label: "En Almacén", bg: "#EDE9FE", fg: "#6D28D9", bd: "#DDD6FE" },
    { label: "Aduana", bg: "#FFEDD5", fg: "#C2410C", bd: "#FED7AA" },
    { label: "En Tránsito", bg: "#DBEAFE", fg: "#1D4ED8", bd: "#BFDBFE" },
    { label: "Entregado", bg: "#10B981", fg: "#FFFFFF", bd: "#10B981" },
    { label: "Retrasado", bg: "#FEF3C7", fg: "#B45309", bd: "#FDE68A" },
    { label: "Cancelado", bg: "#FEE2E2", fg: "#B91C1C", bd: "#FECACA" },
];

const css = `
.hb-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
.hb-ink { color: #003153; }

/* ── El plano isométrico ─────────────────────────────────────────── */
.hb-stage { perspective: 1400px; perspective-origin: 50% 42%; }
.hb-plane {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 416px;
  height: 208px;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg);
}
.hb-plane--sway { animation: hb-sway 18s ease-in-out infinite; }
@keyframes hb-sway {
  0%, 100% { transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-52deg); }
  50%      { transform: translate(-50%, -50%) rotateX(59deg) rotateZ(-38deg); }
}
.hb-tile {
  position: absolute;
  width: 92px;
  height: 92px;
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid rgba(0, 49, 83, 0.16);
  transform-style: preserve-3d;
  box-shadow:
    -1px 1px 0 #004C7A, -2px 2px 0 #004C7A, -3px 3px 0 #004C7A,
    -4px 4px 0 #004C7A, -5px 5px 0 #004C7A, -6px 6px 0 #004C7A,
    -16px 18px 30px rgba(0, 49, 83, 0.16);
}
.hb-tile--dark {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow:
    -1px 1px 0 rgba(0, 76, 122, 0.9), -2px 2px 0 rgba(0, 76, 122, 0.9),
    -3px 3px 0 rgba(0, 76, 122, 0.9), -4px 4px 0 rgba(0, 76, 122, 0.9),
    -18px 20px 34px rgba(0, 20, 40, 0.5);
  backdrop-filter: blur(6px);
}
.hb-tile--slab {
  height: 92px;
  border-radius: 5px;
}
.hb-tile__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  padding: 6px;
}

/* Héroe: las losas todavía desarmadas, flotando en Z. */
.hb-float { animation: hb-float-tile 9s ease-in-out infinite; animation-delay: var(--d, 0ms); }
@keyframes hb-float-tile {
  0%, 100% { transform: translateZ(120px); opacity: 0.55; }
  50%      { transform: translateZ(210px); opacity: 0.85; }
}

/* Ensamblaje al entrar en viewport: translateZ 200 → 0, escalonado 80 ms. */
.hb-assemble .hb-tile { opacity: 0.3; transform: translateZ(200px); }
.hb-assemble.is-in .hb-tile {
  animation: hb-drop 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--d, 0ms);
}
@keyframes hb-drop {
  from { opacity: 0.3; transform: translateZ(200px); }
  to   { opacity: 1;   transform: translateZ(var(--z, 0px)); }
}

/* Halos difuminados calcados del dashboard real. */
.hb-blob { position: absolute; border-radius: 9999px; filter: blur(48px); pointer-events: none; }
.hb-blob--drift { animation: hb-drift 22s ease-in-out infinite; }
@keyframes hb-drift {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(26px, -20px); }
}

/* Indicador EN VIVO. */
.hb-ping { animation: hb-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
@keyframes hb-ping {
  0%   { transform: scale(0.8); opacity: 0.85; }
  100% { transform: scale(2.6); opacity: 0; }
}

/* El tilde de “Todo al día”, balanceándose ±4° en seis segundos. */
.hb-rock { animation: hb-rock 6s ease-in-out infinite; }
@keyframes hb-rock {
  0%, 100% { transform: rotate(-4deg); }
  50%      { transform: rotate(4deg); }
}

/* El paquete viajando por la rejilla. */
.hb-comet { stroke-dasharray: 110 1400; animation: hb-comet 7s linear infinite; }
@keyframes hb-comet { to { stroke-dashoffset: -1510; } }
.hb-dot {
  offset-path: path("${JOURNEY_PATH}");
  offset-distance: 0%;
  animation: hb-travel 7s linear infinite;
}
@keyframes hb-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }

/* Haces de luz de la sección de eventos en vivo. */
.hb-beam {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  transform-origin: top;
  animation: hb-beam 4.2s ease-in-out infinite;
  animation-delay: var(--d, 0ms);
}
@keyframes hb-beam {
  0%, 100% { opacity: 0; transform: scaleY(0.35); }
  18%      { opacity: 0.95; }
  70%      { opacity: 0; transform: scaleY(1); }
}

/* Losas de contenido: el mismo canto azul, en plano. */
.hb-slab {
  position: relative;
  background: #FFFFFF;
  border: 1px solid rgba(0, 49, 83, 0.12);
  border-radius: 10px;
  box-shadow: 0 1px 0 rgba(0, 49, 83, 0.06), 0 18px 34px -26px rgba(0, 49, 83, 0.55);
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms ease, border-color 320ms ease;
}
.hb-slab::before {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  top: -3px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: #004C7A;
  opacity: 0.55;
}
.hb-slab:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 76, 122, 0.4);
  box-shadow: 0 26px 46px -26px rgba(0, 49, 83, 0.6);
}
.hb-slab--dark {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: none;
}
.hb-slab--dark::before { background: #10B981; opacity: 0.7; }

/* Rejilla técnica de fondo, azul institucional. */
.hb-grid {
  background-image:
    linear-gradient(to right, rgba(0, 49, 83, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 49, 83, 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
}
.hb-grid--dark {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* Titulares en el degradado de texto real del dashboard. */
.hb-head {
  background-image: linear-gradient(90deg, #003153 0%, #0A5F7C 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* El outro compartido usa bordes blancos; sobre el gris claro hay que anclarlos. */
.hb-outro [class*="border-white"] { border-color: rgba(0, 49, 83, 0.16) !important; }

@media (prefers-reduced-motion: reduce) {
  .hb-plane--sway,
  .hb-float,
  .hb-assemble.is-in .hb-tile,
  .hb-blob--drift,
  .hb-ping,
  .hb-rock,
  .hb-comet,
  .hb-dot,
  .hb-beam { animation: none !important; }
  .hb-assemble .hb-tile { opacity: 1 !important; transform: none !important; }
  .hb-float { opacity: 0.8; transform: translateZ(0); }
  .hb-beam { opacity: 0.4; }
}
`;

/* ─────────────────────── Piezas del plano isométrico ─────────────────────── */

const TilePos = (i: number) => ({ left: (i % 4) * 104, top: Math.floor(i / 4) * 104 });

/** Rejilla de ocho losas: desarmada (héroe), rota (problema) o ensamblándose. */
const IsoBoard = ({
    variant,
    dark = false,
    className,
}: {
    variant: "float" | "broken" | "assemble";
    dark?: boolean;
    className?: string;
}) => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.35);

    return (
        <div ref={ref} className={`hb-stage relative ${className ?? ""}`}>
            <div
                className={`hb-plane ${variant === "float" ? "hb-plane--sway" : ""} ${
                    variant === "assemble" ? `hb-assemble ${inView ? "is-in" : ""}` : ""
                }`}
            >
                {MODULES.map((m, i) => {
                    const pos = TilePos(i);
                    const b = BROKEN[i];
                    const style: React.CSSProperties & Record<string, string | number> = {
                        left: pos.left,
                        top: pos.top,
                        ["--d"]: `${i * 80}ms`,
                    };
                    if (variant === "broken") {
                        style.transform = `translate3d(${b.x}px, ${b.y}px, ${b.z}px) rotateZ(${b.r}deg)`;
                        style.opacity = 0.92;
                    }
                    const Icon = m.icon;
                    return (
                        <div
                            key={m.name}
                            className={`hb-tile ${dark ? "hb-tile--dark" : ""} ${variant === "float" ? "hb-float" : ""}`}
                            style={style}
                        >
                            <div className="hb-tile__face">
                                <Icon size={20} color={dark ? "#8FE3C7" : "#004C7A"} strokeWidth={1.6} />
                                <span
                                    className="hb-mono text-[8px] uppercase tracking-[0.14em]"
                                    style={{ color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,49,83,0.55)" }}
                                >
                                    {m.code}
                                </span>
                                <span
                                    className="px-1 text-[9px] font-semibold leading-tight"
                                    style={{ color: dark ? "#FFFFFF" : "#003153" }}
                                >
                                    {m.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/** Las cuatro columnas de altura distinta que se levantan sobre el tablero. */
const IsoColumns = ({ className }: { className?: string }) => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.3);
    return (
        <div ref={ref} className={`hb-stage relative ${className ?? ""}`}>
            <div className={`hb-plane hb-assemble ${inView ? "is-in" : ""}`}>
                {PORTALS.map((portal, pi) =>
                    Array.from({ length: portal.slabs }).map((_, si) => {
                        const pos = TilePos(pi * 2);
                        const style: React.CSSProperties & Record<string, string | number> = {
                            left: pos.left,
                            top: pos.top + 52,
                            ["--d"]: `${pi * 120 + si * 70}ms`,
                            ["--z"]: `${si * 13}px`,
                            zIndex: si,
                            background: si === portal.slabs - 1 ? "#FFFFFF" : "#F1F5F9",
                        };
                        return (
                            <div key={`${portal.title}-${si}`} className="hb-tile hb-tile--slab" style={style}>
                                {si === portal.slabs - 1 && (
                                    <div className="hb-tile__face">
                                        <span className="text-[10px] font-bold" style={{ color: "#003153" }}>
                                            {portal.title}
                                        </span>
                                        <span className="hb-mono text-[7px]" style={{ color: "rgba(0,49,83,0.5)" }}>
                                            {portal.roles}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

/* ───────────────────────── Mockups recreados en CSS ───────────────────────── */

/** uiScreens[0] — Login de HumboltTracking. */
const MockLogin = () => (
    <div
        className="p-4 md:p-6"
        style={{ background: "linear-gradient(135deg, #003153 0%, #004C7A 50%, #003153 100%)" }}
    >
        <div className="grid items-center gap-5 md:grid-cols-2">
            <div className="text-white">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur-sm">
                        <Package size={20} color="#FFFFFF" />
                    </span>
                    <span>
                        <span className="block text-lg font-bold leading-none">HumboltTracking</span>
                        <span className="block mt-1 text-[9px] text-white/80">ERP de Logística</span>
                    </span>
                </div>

                <p className="mt-5 text-[13px] font-semibold">Sistema de Gestión de Envíos</p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-white/75">
                    Gestión de envíos, tracking en tiempo real y control operacional multi-rol.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                        ["100%", "Trazabilidad"],
                        ["24/7", "Monitoreo"],
                    ].map(([n, l]) => (
                        <div key={l} className="rounded-lg bg-white/10 p-2.5 backdrop-blur-sm">
                            <p className="text-base font-bold leading-none">{n}</p>
                            <p className="mt-1 text-[9px] text-white/75">{l}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-white shadow-2xl rounded-xl">
                <p className="text-[13px] font-bold" style={{ color: "#003153" }}>
                    Iniciar Sesión
                </p>
                <p className="mt-1 text-[9px] text-slate-500">Ingresa tus credenciales para acceder al sistema</p>

                <p className="mt-3 text-[9px] font-medium text-slate-600">Correo Electrónico</p>
                <div className="mt-1 rounded-md border border-slate-200 px-2.5 py-2 text-[10px] text-slate-400">
                    usuario@ejemplo.com
                </div>

                <p className="mt-2.5 text-[9px] font-medium text-slate-600">Contraseña</p>
                <div className="relative mt-1">
                    <div
                        className="rounded-md border px-2.5 py-2 text-[11px] tracking-[0.3em] text-slate-600"
                        style={{ borderColor: "#10B981", boxShadow: "0 0 0 2px rgba(16,185,129,0.18)" }}
                    >
                        ••••••••
                    </div>
                    <span className="absolute -translate-y-1/2 right-2 top-1/2 text-slate-400">
                        <EyeOff size={12} />
                    </span>
                </div>

                <div className="mt-3 flex items-start gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2 py-1.5">
                    <AlertTriangle size={11} className="mt-px text-rose-500 shrink-0" />
                    <p className="text-[8px] leading-snug text-rose-600">
                        Credenciales incorrectas o error en el servidor…
                    </p>
                </div>

                <div
                    className="mt-3 rounded-md py-2 text-center text-[10px] font-semibold text-white"
                    style={{ background: "#003153" }}
                >
                    Iniciar Sesión
                </div>
            </div>
        </div>
    </div>
);

/** Barra lateral navy de 80 px, común a los portales de escritorio. */
const MockSidebar = ({ active = 0 }: { active?: number }) => (
    <div className="flex w-11 shrink-0 flex-col items-center gap-1.5 py-3" style={{ background: "#003153" }}>
        <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "#10B981" }}>
            <Package size={14} color="#FFFFFF" />
        </span>
        <span className="my-1 h-px w-6 bg-white/15" />
        {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
                <span
                    key={m.name}
                    className="grid rounded-lg h-7 w-7 place-items-center"
                    style={{ background: i === active ? "#10B981" : "transparent" }}
                >
                    <Icon size={13} color={i === active ? "#FFFFFF" : "rgba(255,255,255,0.6)"} />
                </span>
            );
        })}
        <span className="mt-auto grid h-7 w-7 place-items-center rounded-lg text-white/50">
            <LogOut size={13} />
        </span>
    </div>
);

/** uiScreens[1] — Dashboard del supervisor, centro de comando en vivo. */
const MockDashboard = () => (
    <div className="flex min-h-[330px]" style={{ background: "#F8F9FA" }}>
        <MockSidebar active={0} />

        <div className="relative flex-1 p-3 overflow-hidden md:p-4">
            <span className="hb-blob hb-blob--drift" style={{ right: -30, top: -40, width: 200, height: 200, background: "rgba(16,185,129,0.22)" }} />
            <span className="hb-blob" style={{ left: -50, top: 40, width: 180, height: 180, background: "rgba(0,49,83,0.07)" }} />
            <span className="hb-blob hb-blob--drift" style={{ left: 90, bottom: -60, width: 160, height: 160, background: "rgba(14,165,233,0.14)" }} />

            <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5" style={{ borderColor: "#A7F3D0", background: "#ECFDF5" }}>
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="hb-ping absolute inline-flex h-full w-full rounded-full" style={{ background: "#10B981" }} />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "#10B981" }} />
                    </span>
                    <span className="hb-mono text-[7px] font-bold uppercase tracking-[0.2em]" style={{ color: "#047857" }}>
                        En vivo
                    </span>
                </span>

                <p className="hb-head mt-2 text-xl font-bold leading-none">Dashboard</p>
                <p className="mt-1 text-[9px] text-slate-500">Centro de comando operacional en tiempo real</p>

                <div className="grid gap-2 mt-3 md:grid-cols-2">
                    <div
                        className="relative overflow-hidden rounded-lg p-3"
                        style={{
                            border: "1px solid transparent",
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), linear-gradient(120deg, #10B981, #14B8A6, #0EA5E9)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "padding-box, border-box",
                        }}
                    >
                        <span className="hb-blob" style={{ right: -20, top: -20, width: 90, height: 90, background: "rgba(16,185,129,0.18)" }} />
                        <p className="relative text-[9px] font-semibold" style={{ color: "#003153" }}>
                            Estado operativo
                        </p>
                        <div className="relative flex flex-col items-center py-4">
                            <span
                                className="grid rounded-full h-11 w-11 place-items-center"
                                style={{ background: "linear-gradient(135deg,#34D399,#059669)", boxShadow: "0 0 0 3px #FFFFFF, 0 10px 24px -8px rgba(16,185,129,0.7)" }}
                            >
                                <CheckCircle2 size={22} color="#FFFFFF" className="hb-rock" />
                            </span>
                            <p className="mt-2 text-[10px] font-semibold" style={{ color: "#065F46" }}>
                                Todo al día
                            </p>
                            <p className="text-[8px] text-slate-500">Sin alertas ni acciones pendientes</p>
                        </div>
                    </div>

                    <div className="p-3 border rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[9px] font-semibold" style={{ color: "#003153" }}>
                                Resumen de eventos
                            </p>
                            <span className="hb-mono text-[8px] text-slate-400">47 en la sesión</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                            {EVENTS.map((e) => {
                                const Icon = e.icon;
                                return (
                                    <div
                                        key={e.type}
                                        className="rounded-md px-2 py-1.5"
                                        style={{ background: `${e.color}14`, boxShadow: `inset 0 0 0 1px ${e.color}33` }}
                                    >
                                        <span className="flex items-center gap-1">
                                            <Icon size={10} color={e.color} />
                                            <span className="hb-mono text-[11px] font-bold" style={{ color: e.color }}>
                                                {e.n}
                                            </span>
                                        </span>
                                        <span className="block text-[7px] text-slate-500">{e.type}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid mt-2 border rounded-lg border-slate-200 bg-white/70 place-items-center py-7">
                    <Inbox size={22} className="text-slate-300" />
                    <p className="mt-1.5 text-[8px] text-slate-400">Sin actividad reciente en esta sesión</p>
                </div>
            </div>
        </div>
    </div>
);

/** uiScreens[2] — Gestión de Envíos: listado, filtros y estados. */
const MockShipments = () => (
    <div className="flex min-h-[330px]" style={{ background: "#F8F9FA" }}>
        <MockSidebar active={6} />

        <div className="flex-1 p-3 md:p-4">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[13px] font-semibold" style={{ color: "#003153" }}>
                        Gestión de Envíos
                    </p>
                    <p className="text-[9px] text-slate-500">Control centralizado de operaciones de envío</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[9px] font-semibold text-white" style={{ background: "#003153" }}>
                    <Plus size={11} /> Nuevo Envío
                </span>
            </div>

            <div className="flex gap-1.5 mt-3 rounded-lg border border-slate-200 bg-white p-2">
                <span className="flex flex-1 items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5">
                    <Search size={10} className="text-slate-400" />
                    <span className="text-[8px] text-slate-400">Buscar por código, cliente, origen o destino...</span>
                </span>
                <span className="hidden items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[8px] text-slate-600 sm:inline-flex">
                    <Filter size={10} className="text-slate-400" /> Todos
                </span>
                <span className="hidden items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[8px] text-slate-600 sm:inline-flex">
                    <ArrowUpDown size={10} className="text-slate-400" /> Más recientes
                </span>
            </div>

            <div className="mt-2 overflow-x-auto bg-white border rounded-lg border-slate-200">
                <table className="w-full min-w-[520px] border-collapse">
                    <thead>
                        <tr className="text-[7px] uppercase tracking-[0.12em] text-slate-400">
                            {["Código de Seguimiento", "Cliente", "Ruta", "Peso", "Estado", "Entrega Est.", "Actualización"].map((h) => (
                                <th key={h} className="px-2 py-1.5 text-left font-semibold border-b border-slate-100">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { code: "GP-4417832", client: "Inversiones Delta C.A.", from: "Caracas", to: "Valencia", kg: "12,40", st: 4, eta: "12/03", upd: "hace 4 min" },
                            { code: "GP-4417791", client: "Comercial Ávila", from: "Maracay", to: "Barquisimeto", kg: "3,15", st: 3, eta: "12/03", upd: "hace 22 min" },
                            { code: "GP-4417744", client: "Agencia Guaicaipuro", from: "Caracas", to: "Maracaibo", kg: "28,00", st: 1, eta: "13/03", upd: "hace 1 h" },
                            { code: "GP-4417702", client: "Distribuidora Sur", from: "Valencia", to: "Puerto La Cruz", kg: "7,80", st: 5, eta: "11/03", upd: "hace 3 h" },
                            { code: "GP-4417688", client: "Textiles del Centro", from: "Caracas", to: "Mérida", kg: "1,05", st: 0, eta: "14/03", upd: "hace 5 h" },
                            { code: "GP-4417650", client: "Logística Andina", from: "Mérida", to: "Caracas", kg: "16,60", st: 2, eta: "15/03", upd: "ayer" },
                        ].map((row) => {
                            const s = SHIPMENT_STATES[row.st];
                            return (
                                <tr key={row.code} className="border-b border-slate-50 last:border-0">
                                    <td className="px-2 py-1.5">
                                        <span className="flex items-center gap-1">
                                            <Package size={10} style={{ color: "#004C7A" }} />
                                            <span className="hb-mono text-[8px] font-semibold" style={{ color: "#003153" }}>
                                                {row.code}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-[8px] text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <UserCircle size={10} className="text-slate-300" />
                                            {row.client}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-[8px] text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={10} className="text-slate-300" />
                                            {row.from} → {row.to}
                                        </span>
                                    </td>
                                    <td className="hb-mono px-2 py-1.5 text-[8px] text-slate-600">{row.kg} kg</td>
                                    <td className="px-2 py-1.5">
                                        <span
                                            className="inline-block rounded-full px-1.5 py-0.5 text-[7px] font-semibold"
                                            style={{ background: s.bg, color: s.fg, boxShadow: `inset 0 0 0 1px ${s.bd}` }}
                                        >
                                            {s.label}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-[8px] text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} className="text-slate-300" />
                                            {row.eta}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-[8px] text-slate-400">{row.upd}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="text-[8px] text-slate-400">Mostrando 6 de 128 envíos</span>
                <span className="flex gap-1">
                    {["1", "2", "3", "›"].map((n, i) => (
                        <span
                            key={n}
                            className="grid h-5 w-5 place-items-center rounded text-[8px]"
                            style={{
                                background: i === 0 ? "#003153" : "#FFFFFF",
                                color: i === 0 ? "#FFFFFF" : "#64748B",
                                boxShadow: "inset 0 0 0 1px #E2E8F0",
                            }}
                        >
                            {n}
                        </span>
                    ))}
                </span>
            </div>
        </div>
    </div>
);

/** uiScreens[3] — Portal Operador: la parada de ruta, foto y escaneo. */
const MockOperator = () => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(#F0F4F8, #F8F9FA)" }}>
        <div className="px-3 pt-8 pb-2 shadow-md" style={{ background: "#003153" }}>
            <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10">
                    <Truck size={14} color="#FFFFFF" />
                </span>
                <span className="flex-1">
                    <span className="block text-[11px] font-bold text-white leading-none">HumboltTracking</span>
                    <span className="block text-[8px] text-white/70">Portal Operador</span>
                </span>
                <LogOut size={12} color="rgba(255,255,255,0.7)" />
            </div>
            <div className="mt-1.5 flex items-center gap-1 border-t border-white/10 pt-1.5">
                <UserCircle size={11} color="rgba(255,255,255,0.7)" />
                <span className="text-[8px] text-white/75">Luis Marcano</span>
            </div>
        </div>

        <div className="p-2.5 space-y-2 overflow-hidden">
            <p className="text-[8px] text-slate-500">← Volver a rutas</p>

            <div className="rounded-lg p-2.5" style={{ background: "#003153" }}>
                <div className="flex items-center justify-between">
                    <span className="hb-mono text-[11px] font-bold text-white">RT-0091</span>
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[7px] text-white">8 paquetes</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                    <span className="rounded border border-white/25 px-1.5 py-0.5 text-[7px] text-white/85">Empezar ruta</span>
                    <span className="rounded border border-white/25 px-1.5 py-0.5 text-[7px] text-white/85">Completar ruta</span>
                </div>
                <p className="mt-1.5 flex items-start gap-1 text-[7px] text-white/60">
                    <MapPin size={9} className="mt-px shrink-0" />
                    Parada 3 de 5 · Av. Bolívar, Torre Delta, Valencia
                </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
                <p className="text-[7px] leading-relaxed text-slate-600">
                    <span className="font-bold" style={{ color: "#003153" }}>
                        Paso 1:
                    </span>{" "}
                    foto de evidencia.{" "}
                    <span className="font-bold" style={{ color: "#003153" }}>
                        Paso 2:
                    </span>{" "}
                    escanear o registrar el código del mismo paquete.
                </p>
            </div>

            <div className="grid gap-1.5">
                <div
                    className="flex items-center gap-2 rounded-lg p-2.5"
                    style={{ background: "#003153", boxShadow: "0 0 0 2px #FFFFFF, 0 0 0 4px rgba(0,49,83,0.35)" }}
                >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/15">
                        <Camera size={16} color="#FFFFFF" />
                    </span>
                    <span>
                        <span className="block text-[9px] font-bold text-white">1. Tomar foto de evidencia</span>
                        <span className="block text-[7px] text-white/70">Foto lista · escanea el paquete</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg p-2.5" style={{ background: "#10B981" }}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/20">
                        <QrCode size={16} color="#FFFFFF" />
                    </span>
                    <span>
                        <span className="block text-[9px] font-bold text-white">2. Escanear paquete</span>
                        <span className="hb-mono block text-[7px] text-white/85">3 / 8 registrados</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 rounded-md border px-2 py-1.5" style={{ borderColor: "#A7F3D0", background: "#ECFDF5" }}>
                <span className="w-8 h-8 rounded bg-slate-300" />
                <span className="flex-1 text-[7px]" style={{ color: "#047857" }}>
                    Foto lista — escanea el paquete
                </span>
                <span className="rounded border px-1.5 py-0.5 text-[7px]" style={{ borderColor: "#10B981", color: "#047857" }}>
                    Cambiar
                </span>
            </div>

            <div className="rounded-lg p-1.5" style={{ border: "2px solid #003153", background: "#0B1F2E" }}>
                <div className="relative grid h-[74px] place-items-center overflow-hidden rounded">
                    <span
                        className="absolute inset-0"
                        style={{ background: "radial-gradient(80% 80% at 50% 50%, rgba(16,185,129,0.16), rgba(0,0,0,0.6))" }}
                    />
                    <span className="relative block h-12 w-12 rounded" style={{ boxShadow: "0 0 0 2px rgba(16,185,129,0.85)", background: "rgba(16,185,129,0.12)" }} />
                </div>
                <p className="hb-mono mt-1 text-center text-[7px] text-white/60">Escaneando · html5-qrcode</p>
            </div>

            <div className="p-2 bg-white border rounded-lg border-slate-200">
                <p className="text-[8px] font-semibold" style={{ color: "#003153" }}>
                    Registro manual
                </p>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    <span className="hb-mono rounded border border-slate-200 px-1.5 py-1 text-[7px] text-slate-400">Código</span>
                    <span className="hb-mono rounded border border-slate-200 px-1.5 py-1 text-[7px] text-slate-400">Peso (kg)</span>
                </div>
            </div>

            <div className="rounded-md py-1.5 text-center text-[9px] font-bold text-white" style={{ background: "#004C7A" }}>
                Completar Parada
            </div>
        </div>
    </div>
);

/** uiScreens[4] — Asignar Envíos a Ruta. */
const MockAssign = () => (
    <div className="flex min-h-[330px]" style={{ background: "#F8F9FA" }}>
        <MockSidebar active={7} />

        <div className="flex-1 p-3 md:p-4">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[13px] font-semibold" style={{ color: "#003153" }}>
                        Asignar Envíos a Ruta
                    </p>
                    <p className="text-[9px] text-slate-500">
                        Ruta Centro-Occidente — Selecciona envíos y asígnalos a paradas específicas
                    </p>
                </div>
                <span className="flex gap-1 shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[8px] font-semibold text-white" style={{ background: "#10B981" }}>
                        <CheckCircle2 size={10} /> Asignar 2 Envío(s)
                    </span>
                    <span className="rounded-md border border-slate-300 px-2 py-1.5 text-[8px] text-slate-500">Cancelar</span>
                </span>
            </div>

            <div className="p-2 mt-3 bg-white border rounded-lg border-slate-200">
                <p className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: "#003153" }}>
                    <MapPin size={10} style={{ color: "#004C7A" }} /> Paradas de la Ruta
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {[
                        ["1 · Inversiones Delta", 2],
                        ["2 · Comercial Ávila", 0],
                        ["3 · Agencia Guaicaipuro", 1],
                        ["4 · Distribuidora Sur", 0],
                    ].map(([label, n]) => (
                        <span key={String(label)} className="inline-flex items-center overflow-hidden border rounded-full border-slate-300">
                            <span className="px-2 py-0.5 text-[7px] text-slate-600">{label}</span>
                            {Number(n) > 0 && (
                                <span className="hb-mono px-1.5 py-0.5 text-[7px] font-bold text-white" style={{ background: "#10B981" }}>
                                    +{n}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-2.5 mt-2 bg-white border rounded-lg border-slate-200">
                <span className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5">
                    <Search size={10} className="text-slate-400" />
                    <span className="text-[8px] text-slate-400">Buscar envíos por código o destino...</span>
                </span>

                <div className="mt-2 space-y-1.5">
                    {[
                        { code: "GP-4417832", kg: "12,40", client: "Inversiones Delta C.A.", trip: "Caracas → Valencia", on: true },
                        { code: "GP-4417791", kg: "3,15", client: "Comercial Ávila", trip: "Maracay → Barquisimeto", on: true },
                        { code: "GP-4417744", kg: "28,00", client: "Agencia Guaicaipuro", trip: "Caracas → Maracaibo", on: false },
                    ].map((row) => (
                        <div
                            key={row.code}
                            className="flex items-center gap-2 rounded-lg border p-2"
                            style={{
                                borderColor: row.on ? "#003153" : "#E2E8F0",
                                background: row.on ? "rgba(0,49,83,0.05)" : "#FFFFFF",
                            }}
                        >
                            <span
                                className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm"
                                style={{
                                    border: `2px solid ${row.on ? "#003153" : "#CBD5E1"}`,
                                    background: row.on ? "#003153" : "transparent",
                                }}
                            >
                                {row.on && <CheckCircle2 size={8} color="#FFFFFF" />}
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="flex items-center gap-1">
                                    <span className="hb-mono text-[8px] font-semibold" style={{ color: "#003153" }}>
                                        {row.code}
                                    </span>
                                    <span className="hb-mono rounded bg-slate-100 px-1 text-[7px] text-slate-500">{row.kg} kg</span>
                                </span>
                                <span className="block truncate text-[7px] text-slate-500">
                                    {row.client} · <MapPin size={7} className="inline" /> {row.trip}
                                </span>
                            </span>
                            {row.on && (
                                <span className="hidden shrink-0 rounded border border-slate-300 px-1.5 py-1 text-[7px] text-slate-600 sm:inline-block">
                                    Parada de descarga ▾
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* --------------------------------- Landing --------------------------------- */

const Landing = () => {
    const reduce = useReducedMotion();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);

    /* Parallax suave del plano: ±3° siguiendo el cursor sobre el héroe. */
    useEffect(() => {
        if (reduce) return;
        const node = heroRef.current;
        if (!node) return;
        const onMove = (event: MouseEvent) => {
            const rect = node.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            setTilt({ x: Math.max(-3, Math.min(3, py * 6)), y: Math.max(-3, Math.min(3, px * 6)) });
        };
        node.addEventListener("mousemove", onMove);
        return () => node.removeEventListener("mousemove", onMove);
    }, [reduce]);

    const hasLinks = Boolean(p.links.web || p.links.play || p.links.demo || p.links.github);

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ═════════════════════════ 1 · HÉROE ═════════════════════════ */}
            <section
                ref={heroRef}
                className="relative overflow-hidden px-4 pt-28 pb-20 md:px-6 md:pt-36 md:pb-28"
                style={{ background: "linear-gradient(135deg, #003153 0%, #004C7A 50%, #003153 100%)" }}
            >
                <div aria-hidden className="absolute inset-0 hb-grid--dark opacity-60" />
                <span aria-hidden className="hb-blob hb-blob--drift" style={{ right: "6%", top: "8%", width: 380, height: 380, background: "rgba(16,185,129,0.18)" }} />
                <span aria-hidden className="hb-blob" style={{ left: "-6%", top: "30%", width: 280, height: 280, background: "rgba(255,255,255,0.07)" }} />
                <span aria-hidden className="hb-blob hb-blob--drift" style={{ left: "40%", bottom: "-8%", width: 200, height: 200, background: "rgba(14,165,233,0.2)" }} />

                <div className="relative grid items-center max-w-6xl gap-12 mx-auto lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="text-white">
                        <p className="hb-mono text-[11px] uppercase tracking-[0.32em] text-white/55">
                            HumboltTracking · ERP de Logística
                        </p>

                        <h1 className="mt-5 text-4xl font-black leading-[1.02] md:text-6xl lg:text-7xl">
                            {p.name}
                        </h1>

                        <p className="max-w-xl mt-6 text-base leading-relaxed text-white/75 md:text-lg">{p.tagline}</p>

                        <div className="flex flex-wrap gap-2 mt-8">
                            {[p.categoryShort, p.year, p.statusShort].map((label) => (
                                <span
                                    key={label}
                                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>

                        <p className="max-w-xl mt-5 text-xs leading-relaxed text-white/55">{p.role}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-9">
                            {p.links.web && (
                                <a
                                    href={p.links.web}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shine-sweep"
                                    style={{ background: "#10B981" }}
                                >
                                    <Boxes size={16} /> Abrir la aplicación
                                </a>
                            )}
                            {p.links.demo && !p.links.web && (
                                <a
                                    href={p.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shine-sweep"
                                    style={{ background: "#10B981" }}
                                >
                                    <Boxes size={16} /> Ver la demo
                                </a>
                            )}
                            {p.links.play && (
                                <a
                                    href={p.links.play}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border rounded-full border-white/30"
                                >
                                    Google Play
                                </a>
                            )}
                            {p.links.github && (
                                <a
                                    href={p.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border rounded-full border-white/30"
                                >
                                    Ver el código
                                </a>
                            )}
                            {!hasLinks && (
                                <>
                                    <a
                                        href="https://wa.me/584168624450"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#003153] shine-sweep"
                                        style={{ background: "#10B981" }}
                                    >
                                        <MessageCircle size={16} /> Pedir un recorrido guiado
                                    </a>
                                    <span className="hb-mono text-[10px] leading-relaxed text-white/45">
                                        Aplicación interna: sin acceso público
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* La rejilla isométrica todavía desarmada. */}
                    <div className="relative">
                        <div
                            style={
                                reduce
                                    ? undefined
                                    : { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 400ms ease-out" }
                            }
                        >
                            <IsoBoard variant="float" dark className="h-[340px] md:h-[420px]" />
                        </div>

                        <div className="grid max-w-xs grid-cols-2 gap-3 mx-auto mt-2">
                            {[
                                ["100%", "Trazabilidad"],
                                ["24/7", "Monitoreo"],
                            ].map(([n, l]) => (
                                <div key={l} className="p-4 border rounded-lg border-white/15 bg-white/10 backdrop-blur-md">
                                    <p className="text-2xl font-bold text-white">{n}</p>
                                    <p className="mt-1 text-[11px] text-white/70">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════ 2 · EL PROYECTO ═════════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#F8F9FA", color: "#003153" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                    </div>

                    <Stagger className="mt-8 space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={
                                        i === 0
                                            ? "text-lg leading-relaxed md:text-2xl md:leading-relaxed font-medium"
                                            : "text-sm leading-relaxed md:text-base text-[#003153]/70"
                                    }
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-10">
                        <div className="hb-slab p-5 md:p-6">
                            <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-[#004C7A]">Estado del proyecto</p>
                            <p className="mt-2 text-sm leading-relaxed text-[#003153]/80 md:text-base">{p.status}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════════════════ 3 · EL PROBLEMA ═════════════════════════ */}
            <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ background: "#FFFFFF", color: "#003153" }}>
                <div aria-hidden className="absolute inset-0 hb-grid opacity-70" />

                <div className="relative grid max-w-6xl gap-12 mx-auto lg:grid-cols-2 lg:items-center">
                    <div>
                        <SectionHead
                            index="01 / El problema"
                            title={
                                <>
                                    Cada actor ve <span className="hb-head">sólo su parte</span> del mismo dato
                                </>
                            }
                        />
                        <p className="mt-6 text-sm leading-relaxed text-[#003153]/75 md:text-base">{p.problem}</p>

                        <div className="grid gap-3 mt-8 sm:grid-cols-2">
                            {[
                                { t: "Oficina", d: "Alta de clientes, destinatarios, choferes y envíos; armado de rutas." },
                                { t: "Calle", d: "Un teléfono, una mano: paradas, evidencia y confirmación paquete a paquete." },
                                { t: "Cliente corporativo", d: "Sus envíos y sus destinatarios, sin acceso al resto del sistema." },
                                { t: "Dominio venezolano", d: "RIF/NIT y cédula validables; dirección en cascada de país a zona postal." },
                            ].map((item) => (
                                <div key={item.t} className="p-4 border border-dashed rounded-lg border-[#003153]/25 bg-[#F8F9FA]">
                                    <p className="hb-mono text-[10px] uppercase tracking-[0.2em] text-[#004C7A]">{item.t}</p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-[#003153]/65">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* La rejilla rota: losas separadas, giradas, sin conectar. */}
                    <div className="relative">
                        <IsoBoard variant="broken" className="h-[380px] md:h-[440px]" />
                        <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none">
                            <g stroke="#94A3B8" strokeWidth="1" strokeDasharray="5 7" fill="none" opacity="0.8">
                                <path d="M90,150 L170,120" />
                                <path d="M230,110 L290,160" />
                                <path d="M120,250 L190,290" />
                                <path d="M250,280 L310,240" />
                            </g>
                        </svg>
                        <p className="hb-mono absolute bottom-0 left-0 right-0 text-center text-[10px] uppercase tracking-[0.2em] text-[#003153]/35">
                            módulos sin tablero común
                        </p>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════ 4 · LA SOLUCIÓN ═════════════════════════ */}
            <section className="relative px-4 py-20 overflow-hidden md:px-6 md:py-28" style={{ background: "#F8F9FA", color: "#003153" }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / La solución"
                        title={
                            <>
                                Cuatro portales, <span className="hb-head">una sola build</span>
                            </>
                        }
                        lead="Las ocho losas se ensamblan en un tablero continuo. Encima se levantan las cuatro cáscaras que monta App.tsx según el rol."
                    />

                    <div className="grid gap-10 mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <IsoColumns className="h-[340px] md:h-[400px]" />

                        <div>
                            <p className="text-sm leading-relaxed text-[#003153]/78 md:text-base">{p.solution}</p>

                            <Stagger className="grid gap-3 mt-8 sm:grid-cols-2">
                                {PORTALS.map((portal) => (
                                    <StaggerItem key={portal.title}>
                                        <div className="hb-slab h-full p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold">{portal.title}</p>
                                                <span className="hb-mono rounded-full bg-[#003153]/8 px-2 py-0.5 text-[9px] text-[#004C7A]">
                                                    {portal.modules}
                                                </span>
                                            </div>
                                            <p className="hb-mono mt-1 text-[10px] text-[#003153]/45">{portal.roles}</p>
                                            <p className="mt-2 text-xs leading-relaxed text-[#003153]/65">{portal.note}</p>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                        </div>
                    </div>

                    {/* Los ocho módulos, arrastrables. */}
                    <Reveal className="mt-14">
                        <p className="hb-mono mb-3 text-[10px] uppercase tracking-[0.24em] text-[#003153]/45">
                            Portal supervisor · arrastra
                        </p>
                        <DragRail>
                            {MODULES.map((m) => {
                                const Icon = m.icon;
                                return (
                                    <div key={m.name} className="hb-slab w-[190px] shrink-0 p-4">
                                        <span className="grid rounded-md h-9 w-9 place-items-center" style={{ background: "rgba(0,76,122,0.1)" }}>
                                            <Icon size={17} color="#004C7A" />
                                        </span>
                                        <p className="hb-mono mt-3 text-[9px] uppercase tracking-[0.18em] text-[#003153]/40">{m.code}</p>
                                        <p className="mt-1 text-sm font-semibold">{m.name}</p>
                                    </div>
                                );
                            })}
                        </DragRail>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════════════════ 5 · HIGHLIGHTS ═════════════════════════ */}
            <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ background: "#FFFFFF", color: "#003153" }}>
                <div aria-hidden className="absolute inset-0 hb-grid opacity-50" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / Lo que sostiene el sistema"
                        title={
                            <>
                                Siete piezas <span className="hb-head">bien apoyadas</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="hb-slab h-full p-5">
                                        <div className="flex items-start justify-between">
                                            <span className="grid rounded-lg h-10 w-10 place-items-center" style={{ background: "rgba(0,49,83,0.07)" }}>
                                                <Icon size={18} color="#003153" />
                                            </span>
                                            <span className="hb-mono text-[10px] tracking-[0.2em] text-[#003153]/30">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-base font-bold leading-snug">{h.title}</h3>
                                        <p className="mt-2 text-xs leading-relaxed text-[#003153]/68 md:text-[13px]">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ═════════════════════════ 6 · EL RECORRIDO ═════════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#F8F9FA", color: "#003153" }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / El recorrido"
                        title={
                            <>
                                Un paquete cruzando <span className="hb-head">las ocho losas</span>
                            </>
                        }
                        lead="Del alta del cliente al escaneo en la calle: el mismo dato cambiando de manos, y su insignia de estado cambiando de color."
                    />

                    <div className="mt-12 overflow-x-auto scrollbar-none">
                        <div className="relative h-[300px] w-[1064px]">
                            <svg aria-hidden viewBox="0 0 1064 300" className="absolute inset-0 w-[1064px] h-[300px]">
                                <path d={JOURNEY_PATH} fill="none" stroke="rgba(0,49,83,0.16)" strokeWidth="2" strokeLinecap="round" />
                                <path
                                    d={JOURNEY_PATH}
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    className="hb-comet"
                                />
                            </svg>

                            {!reduce && (
                                <span
                                    aria-hidden
                                    className="hb-dot absolute left-0 top-0 h-3 w-3 rounded-full"
                                    style={{ background: "#10B981", boxShadow: "0 0 0 5px rgba(16,185,129,0.22), 0 0 18px rgba(16,185,129,0.9)" }}
                                />
                            )}

                            {JOURNEY.map((node, i) => (
                                <div
                                    key={node.step}
                                    className="absolute -translate-x-1/2"
                                    style={{ left: node.x, top: node.y + (i % 2 === 0 ? 16 : -104) }}
                                >
                                    <div className="hb-slab w-[130px] p-2.5 text-center">
                                        <p className="hb-mono text-[9px] text-[#003153]/35">{String(i + 1).padStart(2, "0")}</p>
                                        <p className="mt-0.5 text-[11px] font-bold leading-tight">{node.step}</p>
                                        <p className="hb-mono mt-1 text-[8px] leading-tight text-[#003153]/50">{node.detail}</p>
                                        {node.badge && (
                                            <span
                                                className="mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
                                                style={{ background: node.badge.bg, color: node.badge.fg }}
                                            >
                                                {node.badge.text}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {JOURNEY.map((node) => (
                                <span
                                    key={`dot-${node.step}`}
                                    aria-hidden
                                    className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{ left: node.x, top: node.y, background: "#004C7A", boxShadow: "0 0 0 4px #F8F9FA" }}
                                />
                            ))}
                        </div>
                    </div>

                    <Reveal className="mt-10">
                        <p className="hb-mono mb-3 text-[10px] uppercase tracking-[0.24em] text-[#003153]/45">
                            Siete estados de envío, siete insignias
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SHIPMENT_STATES.map((s) => (
                                <span
                                    key={s.label}
                                    className="rounded-full px-3 py-1 text-[11px] font-semibold"
                                    style={{ background: s.bg, color: s.fg, boxShadow: `inset 0 0 0 1px ${s.bd}` }}
                                >
                                    {s.label}
                                </span>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════════════════ 7 · LAS PANTALLAS ═════════════════════════ */}
            <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ background: "#FFFFFF", color: "#003153" }}>
                <div aria-hidden className="absolute inset-0 hb-grid opacity-45" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="05 / La interfaz"
                        title={
                            <>
                                Del escritorio del supervisor <span className="hb-head">al bolsillo del chofer</span>
                            </>
                        }
                        lead="Cinco pantallas reconstruidas: la puerta de entrada, el centro de comando, la operación diaria, el trabajo de asignación y la vista de una mano."
                    />

                    <Reveal className="mt-12">
                        <BrowserFrame url="Humbolt · Acceso" dark={false}>
                            <MockLogin />
                        </BrowserFrame>
                        <p className="hb-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[#003153]/45">
                            {p.uiScreens[0]?.name}
                        </p>
                    </Reveal>

                    <div className="grid gap-8 mt-12 lg:grid-cols-2">
                        <Reveal>
                            <BrowserFrame url="…/humbolt/ · supervisor › dashboard" dark={false}>
                                <MockDashboard />
                            </BrowserFrame>
                            <p className="hb-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[#003153]/45">
                                {p.uiScreens[1]?.name}
                            </p>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <BrowserFrame url="…/humbolt/ · supervisor › envíos" dark={false}>
                                <MockShipments />
                            </BrowserFrame>
                            <p className="hb-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[#003153]/45">
                                {p.uiScreens[2]?.name}
                            </p>
                        </Reveal>
                    </div>

                    <div className="grid gap-10 mt-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                        <Reveal>
                            <BrowserFrame url="…/humbolt/ · rutas › asignar envíos" dark={false}>
                                <MockAssign />
                            </BrowserFrame>
                            <p className="hb-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[#003153]/45">
                                {p.uiScreens[4]?.name}
                            </p>
                        </Reveal>

                        <Reveal delay={0.12} direction="left">
                            <div className="max-w-[280px] mx-auto">
                                <PhoneFrame glow={false}>
                                    <MockOperator />
                                </PhoneFrame>
                            </div>
                            <p className="hb-mono mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#003153]/45">
                                {p.uiScreens[3]?.name}
                            </p>
                        </Reveal>
                    </div>

                    {/* Si algún día hay capturas reales del producto, entran aquí. */}
                    {p.media.length > 0 && (
                        <Reveal className="mt-16">
                            <DragRail>
                                {p.media.map((m) =>
                                    m.src.endsWith(".mp4") ? (
                                        <div key={m.src} className="w-[300px] shrink-0">
                                            <AutoVideo src={m.src} />
                                            <p className="hb-mono mt-2 text-[10px] text-[#003153]/45">{m.caption}</p>
                                        </div>
                                    ) : (
                                        <ShotCard key={m.src} src={m.src} alt={m.caption} caption={m.caption} className="w-[300px] shrink-0" />
                                    )
                                )}
                            </DragRail>
                        </Reveal>
                    )}
                </div>
            
                    <SampleDataNote className="mt-8" />
                </section>

            {/* ═════════════════════════ 8 · DATOS EN VIVO ═════════════════════════ */}
            <section className="relative px-4 py-20 overflow-hidden md:px-6 md:py-28" style={{ background: "#003153", color: "#FFFFFF" }}>
                <div aria-hidden className="absolute inset-0 hb-grid--dark opacity-70" />
                <div aria-hidden className="absolute inset-0 overflow-hidden">
                    {EVENTS.map((e, i) => {
                        const beam: React.CSSProperties & Record<string, string | number> = {
                            left: `${16 + i * 22}%`,
                            background: `linear-gradient(to bottom, ${e.color}, transparent)`,
                            boxShadow: `0 0 24px ${e.color}`,
                            ["--d"]: `${i * 900}ms`,
                        };
                        return <span key={e.type} className="hb-beam" style={beam} />;
                    })}
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-3 py-1 border rounded-full border-emerald-400/40 bg-emerald-400/10">
                        <span className="relative flex w-2 h-2">
                            <span className="hb-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400" />
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                        </span>
                        <span className="hb-mono text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">En vivo</span>
                    </span>

                    <h2 className="max-w-2xl mt-6 text-3xl font-bold leading-tight md:text-5xl">
                        El evento de la calle llega al escritorio{" "}
                        <span style={{ color: "#34D399" }}>sin pasar por WhatsApp</span>
                    </h2>
                    <p className="max-w-2xl mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                        `websocket.service.ts` abre `/api/v1/ws/dashboard/live` con el token en la query y reparte cada
                        evento entre sus suscriptores. Cuatro tipos, cuatro colores, un solo canal.
                    </p>

                    <div className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-4">
                        {EVENTS.map((e, i) => {
                            const Icon = e.icon;
                            return (
                                <Reveal key={e.type} delay={i * 0.08}>
                                    <div className="hb-slab hb-slab--dark h-full p-4" style={{ borderTopColor: e.color }}>
                                        <span className="grid rounded-lg h-9 w-9 place-items-center" style={{ background: `${e.color}22` }}>
                                            <Icon size={17} color={e.color} />
                                        </span>
                                        <p className="mt-3 text-sm font-bold" style={{ color: e.color }}>
                                            {e.type}
                                        </p>
                                        <p className="hb-mono mt-2 break-all text-[10px] leading-relaxed text-white/55">{e.sample}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>

                    <Reveal className="mt-10">
                        <div className="p-5 border rounded-xl border-white/12 bg-white/[0.04] md:p-6">
                            <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300/80">
                                Reconexión progresiva
                            </p>
                            <div className="flex flex-wrap items-end gap-2 mt-4">
                                {[3, 4.5, 6.75, 10.1, 15.2, 22.8, 30, 30].map((s, i) => (
                                    <span key={i} className="flex flex-col items-center gap-1.5">
                                        <span
                                            className="w-6 rounded-t md:w-9"
                                            style={{
                                                height: 12 + (s / 30) * 64,
                                                background: `linear-gradient(to top, rgba(16,185,129,0.25), ${s >= 30 ? "#F59E0B" : "#10B981"})`,
                                            }}
                                        />
                                        <span className="hb-mono text-[9px] text-white/50">{s}s</span>
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-white/55">
                                Si la conexión cae, el retardo crece multiplicando por 1,5 desde 3 s hasta un tope de 30 s.
                                El feed vuelve solo; nadie recarga la pestaña.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════════════════ 9 · FUNCIONALIDADES ═════════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#F8F9FA", color: "#003153" }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / Funcionalidades"
                        title={
                            <>
                                {p.features.length} losas de <span className="hb-head">producto terminado</span>
                            </>
                        }
                        lead="No es una lista de intenciones: cada una está construida, conectada al API real y en uso dentro de alguno de los cuatro portales."
                    />

                    <Stagger className="grid gap-3 mt-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={16}>
                                <div className="hb-slab h-full p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="hb-mono text-[10px] tracking-[0.14em] text-[#003153]/32">
                                            F-{String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="flex-1 h-px bg-[#003153]/8" />
                                        <CheckCircle2 size={12} color="#10B981" />
                                    </div>
                                    <p className="mt-2.5 text-xs leading-relaxed text-[#003153]/78 md:text-[13px]">{f}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ═════════════════════════ 10 · STACK ═════════════════════════ */}
            <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ background: "#FFFFFF", color: "#003153" }}>
                <div aria-hidden className="absolute inset-0 hb-grid opacity-50" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead index="07 / Stack" title="Con qué está hecho" />

                    <div className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.07}>
                                <div className="hb-slab h-full p-5">
                                    <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-[#004C7A]">{group.group}</p>
                                    <p className="hb-mono mt-1 text-[10px] text-[#003153]/35">{group.items.length} piezas</p>
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded border border-[#003153]/12 bg-[#F8F9FA] px-2 py-1 text-[11px] text-[#003153]/75"
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

            {/* ═════════════════════════ 11 · BAJO EL CAPÓ ═════════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#F8F9FA", color: "#003153" }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="08 / Bajo el capó"
                        title={
                            <>
                                El tablero <span className="hb-head">desmontado en capas</span>
                            </>
                        }
                        lead="De la primitiva de Radix al openapi.json del backend, con el hilo esmeralda atravesándolo todo."
                    />

                    <div className="relative grid gap-3 mt-12">
                        <span
                            aria-hidden
                            className="absolute left-[26px] top-4 bottom-4 w-px md:left-[34px]"
                            style={{ background: "linear-gradient(to bottom, transparent, #10B981 12%, #10B981 88%, transparent)" }}
                        />
                        {LAYERS.map((layer, i) => (
                            <Reveal key={layer.name} delay={i * 0.08} direction="right">
                                <div className="flex items-start gap-4 md:gap-6">
                                    <span
                                        className="relative z-10 grid rounded-lg shrink-0 place-items-center"
                                        style={{
                                            width: 52,
                                            height: 52,
                                            background: "#FFFFFF",
                                            boxShadow: "0 0 0 1px rgba(0,49,83,0.12), -4px 4px 0 #004C7A",
                                        }}
                                    >
                                        {i === 0 ? (
                                            <Layers size={18} color="#004C7A" />
                                        ) : i === 1 ? (
                                            <LayoutDashboard size={18} color="#004C7A" />
                                        ) : i === 2 ? (
                                            <Boxes size={18} color="#004C7A" />
                                        ) : i === 3 ? (
                                            <Icons.FileCode2 size={18} color="#004C7A" />
                                        ) : (
                                            <Server size={18} color="#10B981" />
                                        )}
                                    </span>
                                    <div className="hb-slab flex-1 p-4 md:p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-bold md:text-base">{layer.name}</p>
                                            <span className="hb-mono rounded-full bg-[#003153]/6 px-2 py-0.5 text-[10px] text-[#004C7A]">
                                                {layer.tag}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-xs leading-relaxed text-[#003153]/65 md:text-[13px]">
                                            {layer.detail}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-12">
                        <div className="p-6 border-l-2 md:p-8" style={{ borderColor: "#10B981", background: "#FFFFFF" }}>
                            <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-[#004C7A]">
                                Arquitectura, en detalle
                            </p>
                            <p className="mt-4 text-sm leading-relaxed text-[#003153]/78 md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════════════════ 12 · RETOS ═════════════════════════ */}
            <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ background: "#FFFFFF", color: "#003153" }}>
                <div aria-hidden className="absolute inset-0 hb-grid opacity-40" />
                <div className="relative max-w-5xl mx-auto">
                    <SectionHead
                        index="09 / Retos"
                        title={
                            <>
                                Seis cosas que <span className="hb-head">se rompieron primero</span>
                            </>
                        }
                        lead="Cada losa del tablero se asentó después de un fallo concreto. Aquí está el fallo y aquí está lo que lo sostiene ahora."
                    />

                    <div className="mt-12 space-y-6">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="grid overflow-hidden border rounded-xl border-[#003153]/12 md:grid-cols-2">
                                    <div className="p-5 md:p-6" style={{ background: "#F1F5F9" }}>
                                        <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-[#EF4444]">
                                            Se rompió · {String(i + 1).padStart(2, "0")}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-[#003153]/78">{c.problem}</p>
                                    </div>
                                    <div className="p-5 md:p-6" style={{ background: "rgba(16,185,129,0.07)" }}>
                                        <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-[#047857]">
                                            Se sostiene así
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-[#003153]/78">{c.solution}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═════════════════════════ 13 · MÉTRICAS ═════════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#F8F9FA", color: "#003153" }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="10 / Métricas"
                        title={
                            <>
                                El proyecto <span className="hb-head">en ocho cifras</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
                        {p.metrics.map((m) => (
                            <StaggerItem key={m.label} y={26}>
                                <div className="hb-slab h-full p-5">
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    {/* La paleta real del producto. */}
                    <Reveal className="mt-16">
                        <div className="hb-slab p-6 md:p-8">
                            <p className="hb-mono text-[10px] uppercase tracking-[0.24em] text-[#004C7A]">Paleta</p>
                            <div className="flex flex-wrap gap-3 mt-5">
                                {[
                                    { hex: p.brand.primary, name: "navy-blue" },
                                    { hex: p.brand.secondary, name: "navy-blue-light" },
                                    { hex: p.brand.accent, name: "emerald-green" },
                                    { hex: p.brand.bg, name: "soft-slate" },
                                    { hex: p.brand.surface, name: "surface" },
                                ].map((c) => (
                                    <span key={c.name} className="flex items-center gap-2">
                                        <span
                                            className="w-10 h-10 rounded-md"
                                            style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,49,83,0.15)" }}
                                        />
                                        <span>
                                            <span className="hb-mono block text-[11px] font-semibold">{c.hex}</span>
                                            <span className="hb-mono block text-[9px] text-[#003153]/45">{c.name}</span>
                                        </span>
                                    </span>
                                ))}
                            </div>
                            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#003153]/65">{p.brand.mood}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════════════════ 14 · CIERRE ═════════════════════════ */}
            <section
                className="relative px-4 py-20 overflow-hidden md:px-6 md:py-28"
                style={{ background: "linear-gradient(135deg, #003153 0%, #004C7A 50%, #003153 100%)", color: "#FFFFFF" }}
            >
                <div aria-hidden className="absolute inset-0 hb-grid--dark opacity-50" />
                <span aria-hidden className="hb-blob" style={{ left: "12%", top: "10%", width: 280, height: 280, background: "rgba(16,185,129,0.16)" }} />

                <div className="relative grid max-w-6xl gap-10 mx-auto lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="hb-mono text-[10px] uppercase tracking-[0.28em] text-white/45">El tablero, completo</p>
                        <h2 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
                            Ocho módulos, cuatro portales,{" "}
                            <span style={{ color: "#34D399" }}>una sola pieza de software</span>
                        </h2>
                        <p className="max-w-lg mt-5 text-sm leading-relaxed text-white/65 md:text-base">
                            Lo que empezó como un bundle exportado de Figma Make hoy habla con el OpenAPI de producción,
                            sube fotos desde la calle y confirma paquetes contra la parada exacta de la ruta.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">
                            <BrandButton href="https://wa.me/584168624450" variant="solid">
                                <MessageCircle size={16} /> Hablemos del tuyo
                            </BrandButton>
                        </div>
                    </div>

                    <IsoBoard variant="assemble" dark className="h-[340px] md:h-[400px]" />
                </div>
            </section>

            <div
                className="py-6 border-y hb-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ background: "#F8F9FA", color: "rgba(0,49,83,0.5)", borderColor: "rgba(0,49,83,0.1)" }}
            >
                <Marquee
                    items={[...MODULES.map((m) => m.name), "OpenAPI → TypeScript", "WebSocket en vivo", "Evidencia + escaneo", "RIF / Cédula"]}
                    speed={38}
                    separator="◇"
                />
            </div>

            <div className="hb-outro pb-32" style={{ background: "#F8F9FA", color: "#003153" }}>
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un ERP multi-rol conectado a una API real, con la calle y la oficina en la misma build. Si tu operación necesita portales por rol, evidencia en campo y un contrato de datos que no se escriba a mano, es exactamente el terreno que conozco."
                />
                <div className="flex items-center justify-center gap-2">
                    <Clock size={12} className="opacity-40" />
                    <span className="hb-mono text-[11px] uppercase tracking-[0.2em] opacity-45">{p.year}</span>
                    <ChevronRight size={12} className="opacity-40" />
                    <span className="hb-mono text-[11px] uppercase tracking-[0.2em] opacity-45">{p.statusShort}</span>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
