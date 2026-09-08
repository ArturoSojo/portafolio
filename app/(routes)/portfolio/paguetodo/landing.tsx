"use client"

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    Boxes,
    Building2,
    Calculator,
    Check,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Coins,
    CreditCard,
    Github,
    Globe,
    Menu,
    Minus,
    MousePointerClick,
    Network,
    Plus,
    Receipt,
    Share2,
    Smartphone,
    Store,
    Wallet,
    X,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { BrowserFrame, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("paguetodo")!;
const nxt = nextProject("paguetodo");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const BLUE = "#0F79EE";
const BLUE_DEEP = "#0F58EE";
const YELLOW = "#EBCA00";
const ORANGE = "#FF7B00";
const INK = "#0B0B0B";
const SURFACE = "#EFEFEF";

/* ── El tablero: los doce productos vendibles que el sitio enruta ── */
type Cell = { name: string; note: string; icon: LucideIcon; span?: string };

const BOARD: Cell[] = [
    { name: "Punto de venta", note: "MiniPOS, AISINO A80 y A90 con ficha técnica", icon: CreditCard, span: "col-span-2 row-span-2" },
    { name: "Soluciones de pago", note: "El paraguas comercial de toda la casa", icon: Wallet, span: "col-span-2" },
    { name: "Recargas", note: "Telefonía y servicios del ecosistema", icon: Smartphone },
    { name: "Gestión de inventario", note: "Existencias del comercio", icon: Boxes },
    { name: "Gestión de caja", note: "Cierre y arqueo diario", icon: Calculator },
    { name: "Cobranza", note: "Cobro recurrente a clientes", icon: Receipt },
    { name: "Sistema de vuelto", note: "Versión comercio y versión banca", icon: Coins },
    { name: "Botón de pago", note: "Cobro en línea para empresas", icon: MousePointerClick },
    { name: "Merchant", note: "Consola centralizada de la cadena", icon: Store },
    { name: "Red de recaudación", note: "Puntos de cobro repartidos", icon: Network },
    { name: "Canales", note: "Integración para terceros", icon: Share2 },
    { name: "Cadenas comerciales", note: "Multi-sucursal bajo un mismo techo", icon: Building2, span: "col-span-2" },
];

/* ── Las cuatro audiencias por las que se organizó la navegación ── */
const AUDIENCES = [
    { name: "Comercios", line: "El abasto de la esquina que quiere cobrar con tarjeta.", pick: "MiniPOS · 75 $" },
    { name: "Cadenas comerciales", line: "Varias sucursales que necesitan una sola consola.", pick: "Merchant" },
    { name: "Empresas", line: "Cobro en línea y red de recaudación propia.", pick: "Botón de pago" },
    { name: "Bancos", line: "Ampliar cartera con productos ya montados.", pick: "POS banca · Vuelto" },
];

/* ── Orden real de carga de los scripts en index.html ── */
const LOAD_ORDER = [
    { file: "shim.min.js · all-node-modules.js", layer: "CDN", detail: "Los bundles de Angular ya minificados desde staticd.paguetodo.com", items: ["Angular core", "Router", "Forms", "Http"] },
    { file: "index_v4.js", layer: "Configuración", detail: "Dominio, realm, business_id y URLs de la API", items: ["realm", "business_id", "apid", "staticd"] },
    { file: "list.config.js", layer: "Taxonomía", detail: "Áreas × tipos de solicitud → plantilla del back-office", items: ["5 áreas", "4 tipos", "plantillas"] },
    { file: "i18n · messages.es · utils · msg · loading", layer: "Utilidades", detail: "Diccionario en español y helpers de interfaz", items: ["334 cadenas", "spinner", "modales", "tabla"] },
    { file: "app.callservices.js", layer: "Servicios", detail: "La única puerta a la red: cabeceras, timeout de 120 s y sesión", items: ["website-request", "device-get", "device-suscribe"] },
    { file: "paguetodo-controllers/* · app.router.js · app.module.js", layer: "Pantallas", detail: "19 controladores IIFE, 16 rutas con useHash y 24 declaraciones", items: ["19 componentes", "16 rutas", "22 vistas"] },
];

/* ── Taxonomía del formulario, tal como la modela list.config.js ── */
const AREAS = ["POS", "Recarga", "Soluciones de pago", "Cobranza", "Desarrollo a la medida"];
const TIPOS = ["Sugerencia", "Reclamo", "Queja", "Solicitud"];
const SIN_PLANTILLA = "Desarrollo a la medida|Queja";

const SERVICIOS = [
    "CANTV", "Corpoelec", "Movistar", "Digitel", "Inter",
    "SimpleTV", "Bancaribe", "Banco de Venezuela", "Bancamiga", "BDT",
];

const TERMINALES = ["MINIPOS", "$75", "AISINO A80", "$230", "AISINO A90", "$300"];

const POS_CARDS = [
    { model: "MINIPOS", price: "$75", attrs: ["Inalámbrico", "Bluetooth", "Fácil de usar"], tint: "#0F79EE" },
    { model: "AISINO A80", price: "$230", attrs: ["Inalámbrico", "Impresora", "Pantalla táctil"], tint: "#0F58EE" },
    { model: "AISINO A90", price: "$300", attrs: ["Inalámbrico", "Android", "Batería extendida"], tint: "#0B4FCB" },
];

const POS_SPEC = [
    "Banda magnética",
    "Tarjeta NFC",
    "Compatible con Android",
    "Procesador ARM 32-bit 192 MHz",
    "Batería de litio 250 mAh 3,7 V",
    "99 × 59,03 × 16,1 mm",
];

const MENU_COLUMNS = [
    {
        title: "Para tu comercio",
        links: [
            { name: "Punto de venta", line: "El POS es un sistema esencial para la gestión eficaz de ventas y operaciones del día." },
            { name: "Gestión de Inventario", line: "Controla existencias, entradas y salidas sin salir del mostrador." },
            { name: "Gestión de caja", line: "Arqueo y cierre diario con el detalle de cada movimiento." },
        ],
    },
    {
        title: "Para cobrar mejor",
        links: [
            { name: "Sistema de vuelto", line: "Devuelve el cambio en saldo en vez de en efectivo escaso." },
            { name: "Recargas", line: "Telefonía y servicios vendidos desde el mismo terminal." },
            { name: "Soluciones de pago", line: "El paraguas que agrupa todas las formas de cobro de la casa." },
        ],
    },
    {
        title: "Para tu empresa",
        links: [
            { name: "Botón de pago", line: "Cobro en línea integrado a tu web o a tu aplicación." },
            { name: "Cobranza", line: "Cobro recurrente y seguimiento de la cartera de clientes." },
            { name: "Red de recaudación", line: "Puntos de cobro repartidos para recibir por ti." },
        ],
    },
];

const css = `
@property --pt-ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }

.pt-root { font-family: Roboto, "Helvetica Neue", Arial, ui-sans-serif, system-ui, sans-serif; }
.pt-tight { letter-spacing: -0.045em; }
.pt-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }

/* ── El tablero magnético ─────────────────────────────────────── */
.pt-cell {
  --dx: 0;
  --dy: 0;
  position: relative;
  border-radius: 14px;
  background: #FFFFFF;
  border: 1px solid rgba(11, 11, 11, 0.10);
  transform: perspective(900px)
    rotateX(calc(var(--dy) * -6deg))
    rotateY(calc(var(--dx) * 6deg))
    translate3d(calc(var(--dx) * 8px), calc(var(--dy) * 8px), 0);
  transition: transform 220ms cubic-bezier(.2,.9,.25,1),
              opacity 220ms ease,
              scale 220ms cubic-bezier(.2,.9,.25,1),
              background-color 220ms ease,
              border-color 220ms ease;
}
.pt-board:hover .pt-cell { opacity: 0.55; scale: 0.98; }
.pt-board:hover .pt-cell:hover {
  opacity: 1;
  scale: 1;
  background-color: rgba(15, 121, 238, 0.06);
  border-color: rgba(15, 121, 238, 0.24);
}
.pt-cell::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 2px;
  background: conic-gradient(from var(--pt-ang),
    rgba(235, 202, 0, 0) 0deg,
    #EBCA00 55deg,
    rgba(235, 202, 0, 0) 150deg,
    rgba(235, 202, 0, 0) 360deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 220ms ease;
  pointer-events: none;
}
.pt-cell:hover::before { opacity: 1; animation: pt-halo 1.2s linear infinite; }
@keyframes pt-halo { to { --pt-ang: 360deg; } }

/* ── Cintas ───────────────────────────────────────────────────── */
.pt-ribbon { overflow: hidden; }
.pt-ribbon-track {
  display: flex;
  width: max-content;
  animation: pt-slide 28s linear infinite;
}
.pt-ribbon-rev .pt-ribbon-track { animation-duration: 34s; animation-direction: reverse; }
.pt-ribbon:hover .pt-ribbon-track { animation-play-state: paused; }
@keyframes pt-slide { to { transform: translateX(-50%); } }
.pt-ribbon-item { transition: color 180ms ease; }
.pt-ribbon-item:hover {
  color: #EBCA00;
  text-decoration: underline;
  text-decoration-color: #EBCA00;
  text-decoration-thickness: 2px;
  text-underline-offset: 7px;
}

/* ── Cuña diagonal del hero ───────────────────────────────────── */
.pt-wedge {
  position: absolute;
  inset: 0;
  clip-path: polygon(38% 0, 100% 0, 100% 100%, 20% 100%);
  background:
    radial-gradient(120% 90% at 100% 0%, rgba(15,121,238,0.16), transparent 62%),
    linear-gradient(135deg, rgba(15,121,238,0.10) 0%, rgba(15,88,238,0.07) 52%, rgba(235,202,0,0.12) 100%);
  pointer-events: none;
}
.pt-wedge-edge {
  position: absolute;
  inset: 0;
  clip-path: polygon(38% 0, 38.35% 0, 20.35% 100%, 20% 100%);
  background: #EBCA00;
  opacity: 0.85;
  pointer-events: none;
}
.pt-dots {
  background-image: radial-gradient(rgba(15,121,238,0.22) 1px, transparent 1px);
  background-size: 18px 18px;
}

/* ── Franja azul de métricas: el degradado de marca no se lee sobre azul ── */
.pt-metrics .brand-gradient-text {
  background-image: linear-gradient(120deg, #FFFFFF 0%, #FFFFFF 42%, #EBCA00 100%);
}

/* ── Diagrama de carga ────────────────────────────────────────── */
.pt-node {
  position: relative;
}
.pt-node::after {
  content: "";
  position: absolute;
  left: 11px;
  top: 26px;
  bottom: -22px;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255,123,0,0.55), rgba(255,123,0,0.08));
}
.pt-node:last-child::after { display: none; }

/* ── Detalles de maqueta ──────────────────────────────────────── */
.pt-chev { transition: transform 200ms ease; }
.pt-open .pt-chev { transform: rotate(180deg); }
.pt-underline {
  background-image: linear-gradient(#EBCA00, #EBCA00);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 3px;
  transition: background-size 320ms cubic-bezier(.2,.9,.25,1);
}
.pt-underline:hover { background-size: 100% 3px; }
.pt-stack-card { transition: transform 300ms cubic-bezier(.2,.9,.25,1), box-shadow 300ms ease; }
.pt-stack-card:hover { transform: translateY(-4px); box-shadow: 0 24px 50px -28px rgba(15,121,238,0.55); }
.pt-shot { scrollbar-width: none; }
.pt-shot::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .pt-cell,
  .pt-board:hover .pt-cell,
  .pt-board:hover .pt-cell:hover { transform: none !important; scale: 1 !important; opacity: 1 !important; }
  .pt-cell:hover { border-color: #EBCA00 !important; }
  .pt-cell:hover::before { animation: none !important; opacity: 0 !important; }
  .pt-ribbon-track { animation: none !important; }
  .pt-stack-card:hover { transform: none !important; }
}
`;

/* ───────────────────────── Piezas propias ───────────────────────── */

/** Una celda del tablero. Es la misma pieza que luego se convierte en fila del diagrama. */
const BoardCell = ({
    cell,
    compact = false,
    className,
}: {
    cell: Cell;
    compact?: boolean;
    className?: string;
}) => {
    const Icon = cell.icon;
    return (
        <div
            data-pt-cell
            className={`pt-cell group flex flex-col justify-between overflow-hidden ${compact ? "p-3" : "p-3.5"} ${className ?? ""}`}
        >
            <span
                className="inline-grid h-7 w-7 shrink-0 place-items-center rounded-md"
                style={{ background: "rgba(15,121,238,0.10)", color: BLUE }}
            >
                <Icon size={15} />
            </span>
            <div className="mt-3">
                <p className="text-[12px] font-bold leading-tight md:text-[13px]" style={{ color: BLUE }}>
                    {cell.name}
                </p>
                {!compact && (
                    <p className="mt-1 text-[10.5px] leading-snug" style={{ color: "rgba(11,11,11,0.55)" }}>
                        {cell.note}
                    </p>
                )}
            </div>
            <span
                aria-hidden
                className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ color: ORANGE }}
            >
                ruta registrada <ChevronRight size={10} />
            </span>
        </div>
    );
};

/** El tablero completo. Escribe --dx/--dy en cada celda según la cercanía del puntero. */
const Board = ({ className }: { className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const raf = useRef(0);
    const reduce = useReducedMotion();

    const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (reduce || raf.current) return;
        const px = event.clientX;
        const py = event.clientY;
        raf.current = window.requestAnimationFrame(() => {
            raf.current = 0;
            const root = ref.current;
            if (!root) return;
            root.querySelectorAll<HTMLElement>("[data-pt-cell]").forEach((cell) => {
                const rect = cell.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (px - cx) / (rect.width / 2 + 120);
                const dy = (py - cy) / (rect.height / 2 + 120);
                const near = Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
                cell.style.setProperty("--dx", near ? dx.toFixed(3) : "0");
                cell.style.setProperty("--dy", near ? dy.toFixed(3) : "0");
            });
        });
    };

    const reset = () => {
        ref.current?.querySelectorAll<HTMLElement>("[data-pt-cell]").forEach((cell) => {
            cell.style.setProperty("--dx", "0");
            cell.style.setProperty("--dy", "0");
        });
    };

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={reset}
            className={`pt-board grid grid-flow-dense grid-cols-2 gap-2.5 sm:grid-cols-3 ${className ?? ""}`}
            style={{ gridAutoRows: "minmax(104px, auto)" }}
        >
            {BOARD.map((cell) => (
                <BoardCell key={cell.name} cell={cell} className={cell.span ?? ""} />
            ))}
        </div>
    );
};

/** Cinta continua con dos copias del contenido. */
const Ribbon = ({
    items,
    reverse = false,
    tone = "dark",
    height = "h-[72px]",
    size = "text-[15px] md:text-[18px]",
}: {
    items: string[];
    reverse?: boolean;
    tone?: "dark" | "yellow";
    height?: string;
    size?: string;
}) => {
    const line = [...items, ...items];
    return (
        <div
            className={`pt-ribbon ${reverse ? "pt-ribbon-rev" : ""} flex items-center ${height}`}
            style={{ background: tone === "dark" ? INK : YELLOW }}
        >
            <div className="pt-ribbon-track">
                {line.map((item, i) => (
                    <span
                        key={`${item}-${i}`}
                        className={`pt-ribbon-item inline-flex shrink-0 items-center gap-6 px-6 font-semibold uppercase tracking-[0.08em] ${size}`}
                        style={{ color: tone === "dark" ? "rgba(255,255,255,0.88)" : INK }}
                    >
                        {item}
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: tone === "dark" ? YELLOW : INK }} />
                    </span>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────── Maquetas recreadas en CSS ─────────────────── */

const NAV = ["Comercios", "Cadenas comerciales", "Empresas", "Bancos", "Canales", "¿Quiénes somos?"];

const SiteHeader = ({ active, open = false }: { active?: string; open?: boolean }) => (
    <div className="flex items-center gap-2 px-3 py-2.5 md:gap-4 md:px-4" style={{ background: BLUE }}>
        <Menu size={15} className="shrink-0" style={{ color: open ? YELLOW : "#FFFFFF" }} />
        <span className="pt-tight shrink-0 text-[12px] font-black tracking-tight text-white">
            PAGUETODO<span style={{ color: YELLOW }}>.</span>
        </span>
        <div className="hidden flex-1 items-center justify-center gap-3 lg:flex">
            {NAV.map((item) => (
                <span
                    key={item}
                    className="inline-flex items-center gap-0.5 whitespace-nowrap text-[9.5px] font-medium"
                    style={{
                        color: active === item ? YELLOW : "rgba(255,255,255,0.92)",
                        borderBottom: active === item ? `2px solid ${YELLOW}` : "2px solid transparent",
                        paddingBottom: 2,
                    }}
                >
                    {item}
                    {["Comercios", "Empresas", "Bancos"].includes(item) &&
                        (active === item ? <ChevronUp size={9} /> : <ChevronDown size={9} />)}
                </span>
            ))}
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold lg:ml-0" style={{ color: BLUE }}>
            Iniciar sesión
        </span>
    </div>
);

/** Render en CSS del terminal MiniPOS. */
const Terminal = ({ scale = 1 }: { scale?: number }) => (
    <div
        className="relative shrink-0 rounded-[10px] bg-[#15171C] p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
        style={{ width: 72 * scale, transform: `rotate(-6deg)` }}
    >
        <div className="rounded-[6px] px-1.5 py-2" style={{ background: "#0B1220" }}>
            <p className="text-center text-[6px] font-bold tracking-widest" style={{ color: YELLOW }}>
                PAGUETODO
            </p>
            <p className="mt-1 text-center text-[9px] font-black text-white">Bs 1.240,00</p>
            <p className="text-center text-[5px] text-white/45">Inserte o acerque la tarjeta</p>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 12 }).map((_, i) => (
                <span
                    key={i}
                    className="block rounded-[2px]"
                    style={{ height: 7 * scale, background: i === 10 ? "#1FA95C" : i === 9 ? "#C8332C" : "#2A2E36" }}
                />
            ))}
        </div>
    </div>
);

/** uiScreens[0] — Portada (/init) */
const MockPortada = () => (
    <div className="bg-white text-[11px]" style={{ color: INK }}>
        <SiteHeader />

        {/* Banner MiniPos */}
        <div className="relative overflow-hidden px-4 py-5" style={{ background: "linear-gradient(115deg,#E8F1FE 0%,#F7FAFF 60%,#FFFDEB 100%)" }}>
            <span aria-hidden className="pt-dots absolute inset-0 opacity-60" />
            <div className="relative flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.24em]" style={{ color: "#B99F00" }}>
                        MiniPos
                    </p>
                    <p className="pt-tight mt-1 text-[17px] font-black leading-[1.05] md:text-[21px]">
                        El control de tu negocio
                        <br />
                        en tus manos
                    </p>
                    <span
                        className="mt-3 inline-block rounded-full px-4 py-1.5 text-[9px] font-black tracking-[0.14em]"
                        style={{ background: YELLOW, color: INK }}
                    >
                        REGÍSTRATE
                    </span>
                </div>
                <Terminal />
            </div>
        </div>

        {/* Carrusel de audiencias */}
        <div className="px-3 py-4">
            <div className="grid grid-cols-3 gap-2">
                {["Canales", "Comercio", "Bancos"].map((title, i) => (
                    <div key={title} className="overflow-hidden rounded-lg border" style={{ borderColor: "rgba(11,11,11,0.10)" }}>
                        <div
                            className="h-9"
                            style={{
                                background: [
                                    "linear-gradient(135deg,#0F79EE,#0F58EE)",
                                    "linear-gradient(135deg,#5AA2F5,#0F79EE)",
                                    "linear-gradient(135deg,#0B4FCB,#0F79EE)",
                                ][i],
                            }}
                        />
                        <div className="p-2">
                            <p className="text-[9.5px] font-bold" style={{ color: BLUE }}>{title}</p>
                            <p className="mt-0.5 text-[7.5px] leading-tight" style={{ color: "rgba(11,11,11,0.5)" }}>
                                Soluciones pensadas para este perfil.
                            </p>
                            <span className="mt-1.5 inline-block text-[7.5px] font-bold" style={{ color: BLUE }}>
                                Conoce más →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 flex justify-center gap-1">
                {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1 rounded-full" style={{ width: d === 0 ? 12 : 5, background: d === 0 ? BLUE : "rgba(11,11,11,0.18)" }} />
                ))}
            </div>
        </div>

        {/* Gestiona tu negocio */}
        <div className="flex items-center gap-3 px-3 py-4" style={{ background: SURFACE }}>
            <div className="h-14 w-16 shrink-0 rounded-lg" style={{ background: "linear-gradient(135deg,#0F79EE22,#EBCA0033)", border: "1px solid rgba(11,11,11,0.08)" }} />
            <div className="min-w-0">
                <p className="pt-tight text-[12px] font-black leading-tight">
                    Gestiona tu Negocio
                    <br />
                    <span style={{ color: BLUE }}>SIN ESPERAS</span>
                </p>
                <p className="mt-1 text-[8px] leading-snug" style={{ color: "rgba(11,11,11,0.55)" }}>
                    Soluciones financieras para comercios, cadenas, empresas y bancos.
                </p>
                <span className="mt-1.5 inline-block rounded-full border px-2.5 py-1 text-[7.5px] font-bold" style={{ borderColor: BLUE, color: BLUE }}>
                    CONÓCENOS
                </span>
            </div>
        </div>

        {/* Productos */}
        <div className="px-3 py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: BLUE }}>Productos</p>
            <div className="pt-shot mt-2 flex gap-2 overflow-x-auto pb-1">
                {["Punto de Venta", "Sistema de caja", "Botón de pago", "INVENTARIO", "Cobranza", "Vuelto", "Merchant"].map((prod) => (
                    <div key={prod} className="w-[86px] shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: "rgba(11,11,11,0.10)" }}>
                        <div className="h-12" style={{ background: "linear-gradient(160deg,#0F79EE18,#EBCA0018)" }} />
                        <div className="p-1.5">
                            <p className="truncate text-[8px] font-bold" style={{ color: INK }}>{prod}</p>
                            <span className="mt-1 block rounded px-1 py-0.5 text-center text-[6.5px] font-black" style={{ background: YELLOW, color: INK }}>
                                INFORMACIÓN
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Cintas de aliados */}
        <div className="border-t px-3 py-3" style={{ borderColor: "rgba(11,11,11,0.08)" }}>
            <p className="text-center text-[7.5px] font-black uppercase tracking-[0.24em]" style={{ color: "rgba(11,11,11,0.45)" }}>
                Aliados comerciales
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
                {["Sunmi", "Meru", "Apolo", "Servipunto"].map((ally) => (
                    <span
                        key={ally}
                        className="flex h-7 flex-1 items-center justify-center rounded text-[8px] font-bold"
                        style={{ background: SURFACE, color: "rgba(11,11,11,0.55)" }}
                    >
                        {ally}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

/** uiScreens[1] — Mega menú de cabecera */
const MockMegaMenu = () => (
    <div className="bg-white" style={{ color: INK }}>
        <SiteHeader active="Comercios" />
        <div className="p-3" style={{ background: "#FFFFFF" }}>
            <div className="rounded-xl p-3 md:p-4" style={{ background: SURFACE }}>
                <div className="grid gap-4 md:grid-cols-3">
                    {MENU_COLUMNS.map((col) => (
                        <div key={col.title} className="space-y-3">
                            <p className="text-[7.5px] font-black uppercase tracking-[0.22em]" style={{ color: "rgba(11,11,11,0.38)" }}>
                                {col.title}
                            </p>
                            {col.links.map((link) => (
                                <div key={link.name} className="flex gap-2">
                                    <span
                                        className="mt-0.5 inline-grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full"
                                        style={{ background: YELLOW, color: INK }}
                                    >
                                        <ChevronRight size={9} strokeWidth={3} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold leading-tight" style={{ color: BLUE }}>
                                            {link.name}
                                        </p>
                                        <p className="mt-0.5 text-[8px] leading-snug" style={{ color: "rgba(11,11,11,0.52)" }}>
                                            {link.line}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <p className="pt-mono mt-3 text-[8px]" style={{ color: "rgba(11,11,11,0.35)" }}>
                .activea marca el enlace abierto · el chevron gira de ▾ a ▴
            </p>
        </div>
    </div>
);

/** uiScreens[1] en móvil — sidebar oscuro con acordeones */
const MockSidebar = () => {
    const [open, setOpen] = useState("Comercio");
    const rows = ["Comercio", "Cadenas comerciales", "Empresa", "Banco", "Canales", "¿Quiénes somos?"];
    const sub: Record<string, string[]> = {
        Comercio: ["Punto de venta", "Gestión de inventario", "Gestión de caja", "Sistema de vuelto"],
        Empresa: ["Botón de pago", "Cobranza", "Red de recaudación"],
        Banco: ["Punto de venta banca", "Vuelto banca", "Merchant"],
    };

    return (
        <div className="h-full w-full overflow-y-auto pt-shot" style={{ background: "#111318" }}>
            <div className="flex items-center justify-between px-4 pb-3 pt-9">
                <span className="pt-tight text-[13px] font-black text-white">
                    PAGUETODO<span style={{ color: YELLOW }}>.</span>
                </span>
                <span className="inline-grid h-6 w-6 place-items-center rounded" style={{ background: YELLOW, color: INK }}>
                    <X size={13} strokeWidth={3} />
                </span>
            </div>
            <div className="px-2 pb-6">
                {rows.map((row) => {
                    const hasSub = Boolean(sub[row]);
                    const isOpen = open === row && hasSub;
                    return (
                        <div key={row} className="border-b border-white/8">
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? "" : row)}
                                className="flex w-full items-center justify-between px-2 py-3 text-left"
                            >
                                <span className="text-[12px] font-medium" style={{ color: isOpen ? YELLOW : "rgba(255,255,255,0.86)" }}>
                                    {row}
                                </span>
                                {hasSub && (
                                    <ChevronDown
                                        size={13}
                                        style={{
                                            color: isOpen ? YELLOW : "rgba(255,255,255,0.5)",
                                            transform: isOpen ? "rotate(180deg)" : "none",
                                            transition: "transform 200ms ease",
                                        }}
                                    />
                                )}
                            </button>
                            {isOpen && (
                                <div className="pb-2 pl-4">
                                    {sub[row].map((child) => (
                                        <p key={child} className="flex items-center gap-2 py-1.5 text-[10.5px] text-white/65">
                                            <span className="h-1 w-1 rounded-full" style={{ background: YELLOW }} />
                                            {child}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="mt-4 px-2">
                    <span className="block rounded-full py-2 text-center text-[11px] font-bold" style={{ background: YELLOW, color: INK }}>
                        Iniciar Sesión
                    </span>
                </div>
            </div>
        </div>
    );
};

/** uiScreens[2] — Punto de venta (/point-sales), con «Ver detalle» real */
const MockPointSales = () => {
    const [open, setOpen] = useState<string | null>("MINIPOS");

    return (
        <div className="bg-white" style={{ color: INK }}>
            <SiteHeader />
            <div className="px-4 py-5" style={{ background: "linear-gradient(120deg,#0F79EE 0%,#0F58EE 68%,#0B4FCB 100%)" }}>
                <p className="pt-tight text-[16px] font-black leading-tight text-white md:text-[20px]">
                    La Solución que <span style={{ color: YELLOW }}>NECESITAS</span>
                </p>
                <p className="mt-1 text-[9px] text-white/70">Puntos de venta para comercios y banca</p>
            </div>

            <div className="px-3 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: BLUE }}>
                    Puntos de venta
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                    {POS_CARDS.map((pos) => {
                        const isOpen = open === pos.model;
                        return (
                            <div
                                key={pos.model}
                                className={`overflow-hidden rounded-lg border ${isOpen ? "pt-open" : ""}`}
                                style={{ borderColor: isOpen ? YELLOW : "rgba(11,11,11,0.12)" }}
                            >
                                <div className="flex h-[86px] items-center justify-center bg-white">
                                    <Terminal scale={0.86} />
                                </div>
                                <div className="p-2.5 text-white" style={{ background: pos.tint }}>
                                    <p className="text-[10px] font-black tracking-wide">{pos.model}</p>
                                    <p className="pt-tight text-[19px] font-black leading-none">{pos.price}</p>
                                    <div className="mt-1.5 space-y-0.5">
                                        {pos.attrs.map((a) => (
                                            <p key={a} className="text-[8px] text-white/80">{a}</p>
                                        ))}
                                    </div>
                                    <span className="mt-2 block rounded py-1 text-center text-[8.5px] font-black" style={{ background: YELLOW, color: INK }}>
                                        Adquirir
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(isOpen ? null : pos.model)}
                                    className="flex w-full items-center gap-1.5 px-2.5 py-2 text-left text-[8.5px] font-bold"
                                    style={{ color: BLUE, background: "#FFFFFF" }}
                                >
                                    {isOpen ? <Minus size={10} strokeWidth={3} /> : <Plus size={10} strokeWidth={3} />}
                                    Ver detalle
                                </button>
                                {isOpen && (
                                    <div className="px-2.5 pb-2.5" style={{ background: SURFACE }}>
                                        {POS_SPEC.map((spec) => (
                                            <p key={spec} className="flex items-start gap-1.5 py-[3px] text-[8px]" style={{ color: "rgba(11,11,11,0.66)" }}>
                                                <Check size={9} strokeWidth={3} className="mt-[2px] shrink-0" style={{ color: YELLOW }} />
                                                {spec}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["Gestión rápida", "Diversidad de cobro", "Atención personalizada", "Sencillez"].map((benefit) => (
                        <div key={benefit} className="rounded-lg p-2 text-center" style={{ background: SURFACE }}>
                            <span className="mx-auto mb-1 inline-grid h-6 w-6 place-items-center rounded-full" style={{ background: YELLOW, color: INK }}>
                                <Check size={11} strokeWidth={3} />
                            </span>
                            <p className="text-[8px] font-bold leading-tight">{benefit}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div>
                        <p className="pt-tight text-[13px] font-black leading-tight">Preguntas frecuentes</p>
                        <p className="mt-1 text-[8px] leading-snug" style={{ color: "rgba(11,11,11,0.5)" }}>
                            Todo lo que un comercio pregunta antes de instalar su primer terminal.
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        {["¿Cómo cobro con el punto de venta?", "¿Qué tarjetas se aceptan?", "¿Necesito conexión a internet?"].map((q, i) => (
                            <div key={q} className="rounded border px-2 py-1.5" style={{ borderColor: "rgba(11,11,11,0.10)" }}>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[8.5px] font-semibold">{q}</span>
                                    {i === 0 ? (
                                        <ChevronUp size={11} style={{ color: YELLOW }} />
                                    ) : (
                                        <ChevronDown size={11} style={{ color: YELLOW }} />
                                    )}
                                </div>
                                {i === 0 && (
                                    <p className="mt-1 text-[7.5px] leading-snug" style={{ color: "rgba(11,11,11,0.5)" }}>
                                        1. Enciende el terminal. 2. Marca el monto. 3. Pide al cliente insertar o acercar la tarjeta.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/** uiScreens[3] — el formulario de ¿Quiénes somos? */
const MockForm = ({ area, tipo }: { area: string; tipo: string }) => (
    <div className="bg-white p-3.5" style={{ color: INK }}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: BLUE }}>Escríbenos</p>
        <div className="mt-2.5 space-y-2">
            <div className="flex gap-1.5">
                <span className="flex items-center gap-1 rounded border px-2 py-1.5 text-[9px] font-bold" style={{ borderColor: "rgba(11,11,11,0.14)" }}>
                    J <ChevronDown size={9} />
                </span>
                <span className="flex-1 rounded border px-2 py-1.5 text-[9px]" style={{ borderColor: "rgba(11,11,11,0.14)", color: "rgba(11,11,11,0.75)" }}>
                    410258963
                </span>
            </div>
            <span className="block rounded border px-2 py-1.5 text-[9px]" style={{ borderColor: "rgba(11,11,11,0.14)", color: "rgba(11,11,11,0.75)" }}>
                Nombre y Apellido
            </span>
            <div>
                <span className="block rounded border px-2 py-1.5 text-[9px]" style={{ borderColor: "#DC3545", color: "#DC3545" }}>
                    correo@sin-arroba
                </span>
                <p className="mt-0.5 text-[7.5px]" style={{ color: "#DC3545" }}>is-invalid · el correo no tiene formato válido</p>
            </div>
            <div className="flex gap-1.5">
                <span className="flex items-center gap-1 rounded border px-2 py-1.5 text-[9px] font-bold" style={{ borderColor: "rgba(11,11,11,0.14)" }}>
                    0414 <ChevronDown size={9} />
                </span>
                <span className="flex-1 rounded border px-2 py-1.5 text-[9px]" style={{ borderColor: "rgba(11,11,11,0.14)", color: "rgba(11,11,11,0.75)" }}>
                    862-4450
                </span>
            </div>

            {[
                ["Área del servicio", area],
                ["Tipo de solicitud", tipo],
                ["Asunto", tipo === "Solicitud" ? "Instalación de terminal" : "Detalle del caso"],
            ].map(([label, value]) => (
                <div key={label}>
                    <p className="text-[7.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(11,11,11,0.4)" }}>{label}</p>
                    <span
                        className="mt-0.5 flex items-center justify-between rounded border px-2 py-1.5 text-[9px] font-semibold"
                        style={{ borderColor: "rgba(15,121,238,0.35)", color: BLUE, background: "rgba(15,121,238,0.05)" }}
                    >
                        {value}
                        <ChevronDown size={9} />
                    </span>
                </div>
            ))}

            <span className="block h-12 rounded border px-2 py-1.5 text-[8.5px]" style={{ borderColor: "rgba(11,11,11,0.14)", color: "rgba(11,11,11,0.4)" }}>
                Cuéntanos tu caso…
            </span>
            <span className="block rounded py-1.5 text-center text-[9.5px] font-black" style={{ background: YELLOW, color: INK }}>
                Enviar
            </span>
        </div>
    </div>
);

/** uiScreens[4] — Suscripción de equipo financiero */
const MockSuscription = ({ found }: { found: boolean }) => (
    <div className="bg-white p-3.5" style={{ color: INK }}>
        <p className="pt-mono text-[8px]" style={{ color: "rgba(11,11,11,0.4)" }}>
            /#/suscription-finantial-app?identifier=SN-A90-{found ? "44127" : "00000"}
        </p>
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            Suscríbete
        </p>
        {found ? (
            <div className="mt-2 space-y-1.5">
                {[
                    ["Titular", "J-410258963 · Comercial La Vega"],
                    ["Correo", "operaciones@ejemplo.com"],
                    ["Teléfono", "0414 862-4450"],
                    ["Tipo de dispositivo", "Terminal financiero"],
                    ["Marca", "AISINO"],
                    ["Modelo", "A90"],
                ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded border px-2 py-1.5" style={{ borderColor: "rgba(11,11,11,0.12)" }}>
                        <span className="text-[8px]" style={{ color: "rgba(11,11,11,0.45)" }}>{k}</span>
                        <span className="text-[8.5px] font-semibold">{v}</span>
                    </div>
                ))}
                <p className="flex items-start gap-1.5 pt-1 text-[8px]" style={{ color: "rgba(11,11,11,0.55)" }}>
                    <span className="mt-[1px] inline-grid h-3 w-3 shrink-0 place-items-center rounded-sm" style={{ background: BLUE, color: "#fff" }}>
                        <Check size={8} strokeWidth={4} />
                    </span>
                    Acepto el contrato de servicio (PDF)
                </p>
                <span className="mt-1 block rounded py-1.5 text-center text-[9px] font-black" style={{ background: YELLOW, color: INK }}>
                    Suscribir equipo
                </span>
            </div>
        ) : (
            <div className="mt-3 rounded-lg border-l-4 p-3" style={{ borderColor: ORANGE, background: "rgba(255,123,0,0.07)" }}>
                <p className="text-[9.5px] font-semibold leading-snug">
                    No se encontró el serial en nuestro parque de equipos financieros.
                </p>
                <p className="pt-mono mt-1 text-[7.5px]" style={{ color: "rgba(11,11,11,0.45)" }}>
                    wallet_management/find/identifier/commerce → 0 resultados
                </p>
            </div>
        )}
    </div>
);

/* ─────────────────────────── Landing ─────────────────────────── */

const Landing = () => {
    const [area, setArea] = useState(AREAS[0]);
    const [tipo, setTipo] = useState(TIPOS[3]);
    const [serialFound, setSerialFound] = useState(true);
    const hasTemplate = `${area}|${tipo}` !== SIN_PLANTILLA;
    const shots = p.media.filter((m) => m.src.endsWith(".png"));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="pt-root">
            <style>{css}</style>

            {/* ══════════════════════ HERO ══════════════════════ */}
            <section className="relative overflow-hidden px-4 pt-28 pb-16 md:px-6 md:pt-32 md:pb-20">
                <span aria-hidden className="pt-wedge hidden lg:block" />
                <span aria-hidden className="pt-wedge-edge hidden lg:block" />

                <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <p className="pt-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: BLUE }}>
                            {p.category}
                        </p>

                        <h1 className="pt-tight mt-4 text-4xl font-black leading-[0.95] md:text-6xl" style={{ color: INK }}>
                            <RevealWords text="Paguetodo" />
                            <br />
                            <span className="brand-gradient-text">Website</span>
                        </h1>

                        <p className="pt-tight mt-4 text-lg font-bold md:text-2xl" style={{ color: "rgba(11,11,11,0.62)" }}>
                            16 rutas · 4 audiencias · 0 pasos de build
                        </p>

                        <p className="mt-5 max-w-md text-sm leading-relaxed md:text-base" style={{ color: "rgba(11,11,11,0.66)" }}>
                            {p.tagline}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <Chip>{p.year}</Chip>
                            <Chip>{p.status}</Chip>
                        </div>
                        <p className="pt-mono mt-4 text-[11px]" style={{ color: "rgba(11,11,11,0.45)" }}>
                            {p.role}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            {p.links.web && (
                                <BrandButton href={p.links.web}>
                                    <Globe size={16} /> Ver paguetodo.com
                                </BrandButton>
                            )}
                            {p.links.github && (
                                <a
                                    href={p.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-300"
                                    style={{ borderColor: "rgba(11,11,11,0.22)", color: INK }}
                                >
                                    <Github size={16} /> Ver el repositorio
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="pt-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                                el catálogo enrutado
                            </p>
                            <p className="pt-mono text-[10px]" style={{ color: ORANGE }}>
                                12 productos vendibles
                            </p>
                        </div>
                        <Board />
                        <p className="mt-3 text-[11px]" style={{ color: "rgba(11,11,11,0.42)" }}>
                            Acerca el cursor: cada pieza del tablero se inclina hacia el puntero y las vecinas se retraen.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════ CINTAS ══════════════════════ */}
            <div>
                <Ribbon items={SERVICIOS} />
                <Ribbon items={TERMINALES} reverse tone="yellow" height="h-[40px]" size="text-[11px] md:text-[12px]" />
            </div>

            {/* ══════════════════════ AUDIENCIAS + PROBLEMA/SOLUCIÓN ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="01 / El encargo"
                        title={
                            <>
                                Ocho productos, <span className="brand-gradient-text">cuatro visitantes distintos</span>
                            </>
                        }
                        lead="La navegación no se ordenó por catálogo sino por a quién le sirve cada cosa. Antes de hacer clic, el visitante ya se ha reconocido."
                    />

                    <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {AUDIENCES.map((aud, i) => (
                            <StaggerItem key={aud.name}>
                                <div
                                    className="pt-stack-card h-full rounded-xl border p-5"
                                    style={{ borderColor: "rgba(11,11,11,0.10)", background: i % 2 === 0 ? "#FFFFFF" : SURFACE }}
                                >
                                    <span
                                        className="pt-mono text-[10px] font-bold"
                                        style={{ color: ORANGE }}
                                    >
                                        0{i + 1}
                                    </span>
                                    <p className="pt-tight mt-2 text-lg font-black" style={{ color: BLUE }}>
                                        {aud.name}
                                    </p>
                                    <p className="mt-2 text-sm leading-snug" style={{ color: "rgba(11,11,11,0.6)" }}>
                                        {aud.line}
                                    </p>
                                    <p
                                        className="mt-4 inline-block border-t pt-2 text-[11px] font-bold uppercase tracking-[0.12em]"
                                        style={{ borderColor: YELLOW, color: "rgba(11,11,11,0.55)" }}
                                    >
                                        {aud.pick}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <div className="mt-14 grid gap-5 lg:grid-cols-2">
                        <Reveal direction="right">
                            <div className="h-full rounded-2xl p-6 md:p-8" style={{ background: SURFACE }}>
                                <p className="pt-mono text-[11px] font-bold uppercase tracking-[0.26em]" style={{ color: ORANGE }}>
                                    El problema
                                </p>
                                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "rgba(11,11,11,0.72)" }}>
                                    {p.problem}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <div
                                className="relative h-full overflow-hidden rounded-2xl p-6 md:p-8"
                                style={{ background: `linear-gradient(140deg, ${BLUE} 0%, ${BLUE_DEEP} 74%, #0B4FCB 100%)` }}
                            >
                                <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: "rgba(235,202,0,0.25)" }} />
                                <p className="pt-mono relative text-[11px] font-bold uppercase tracking-[0.26em]" style={{ color: YELLOW }}>
                                    La solución
                                </p>
                                <p className="relative mt-4 text-sm leading-relaxed text-white/90 md:text-base">{p.solution}</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════════ HIGHLIGHTS ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK, background: SURFACE }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="02 / Las cinco piezas"
                        title={
                            <>
                                Lo que sostiene <span className="brand-gradient-text">el sitio</span>
                            </>
                        }
                    />

                    <Stagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            const wide = i === 0 || i === 3;
                            return (
                                <StaggerItem key={h.title} className={wide ? "lg:col-span-2" : ""}>
                                    <div
                                        className="pt-stack-card group h-full rounded-xl border bg-white p-6"
                                        style={{ borderColor: "rgba(11,11,11,0.10)" }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span
                                                className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors duration-300"
                                                style={{ background: BLUE, color: "#FFFFFF" }}
                                            >
                                                <Icon size={19} />
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="pt-tight text-lg font-black leading-tight" style={{ color: INK }}>
                                                    {h.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(11,11,11,0.62)" }}>
                                                    {h.description}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            aria-hidden
                                            className="mt-5 block h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                                            style={{ background: YELLOW }}
                                        />
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════════ MAQUETAS: PORTADA Y MEGA MENÚ ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="03 / La interfaz"
                        title={
                            <>
                                El sitio, <span className="brand-gradient-text">pantalla por pantalla</span>
                            </>
                        }
                        lead="Cabecera azul de borde a borde, amarillo reservado para la acción y gris muy claro para los paneles. Reconstruido aquí en HTML y CSS."
                    />

                    <Reveal className="mt-12">
                        <BrowserFrame url="paguetodo.com/#/init" dark={false}>
                            <div className="overflow-x-auto">
                                <div className="min-w-[520px]">
                                    <MockPortada />
                                </div>
                            </div>
                        </BrowserFrame>
                        <p className="pt-mono mt-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                            {p.uiScreens[0]?.name}
                        </p>
                    </Reveal>

                    <div className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                        <Reveal direction="right">
                            <BrowserFrame url="paguetodo.com/#/init · menú Comercios abierto" dark={false}>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[520px]">
                                        <MockMegaMenu />
                                    </div>
                                </div>
                            </BrowserFrame>
                            <p className="pt-mono mt-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                                {p.uiScreens[1]?.name}
                            </p>
                        </Reveal>

                        <Reveal direction="left" delay={0.1} className="mx-auto w-full max-w-[260px]">
                            <PhoneFrame>
                                <MockSidebar />
                            </PhoneFrame>
                            <p className="pt-mono mt-4 text-center text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                                el mismo menú, en móvil
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════════ MAQUETA: PUNTO DE VENTA ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK, background: SURFACE }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="04 / Catálogo"
                        title={
                            <>
                                Tres terminales con <span className="brand-gradient-text">precio y ficha técnica</span>
                            </>
                        }
                        lead="Pulsa «Ver detalle» en cualquiera de las tres tarjetas: el disparador cambia de ＋ a − y abre la especificación real del equipo."
                    />

                    <Reveal className="mt-10">
                        <BrowserFrame url="paguetodo.com/#/point-sales" dark={false}>
                            <div className="overflow-x-auto">
                                <div className="min-w-[520px]">
                                    <MockPointSales />
                                </div>
                            </div>
                        </BrowserFrame>
                        <p className="pt-mono mt-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                            {p.uiScreens[2]?.name}
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════════ EL FORMULARIO Y SU TAXONOMÍA ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="05 / El único formulario"
                        title={
                            <>
                                Un contacto que <span className="brand-gradient-text">abre un ticket real</span>
                            </>
                        }
                        lead="Área del servicio × tipo de solicitud: la combinación decide la plantilla del back-office. Elige una y mira lo que se envía."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                        <Reveal direction="right">
                            <BrowserFrame url="paguetodo.com/#/us" dark={false}>
                                <MockForm area={area} tipo={tipo} />
                            </BrowserFrame>
                            <p className="pt-mono mt-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                                {p.uiScreens[3]?.name}
                            </p>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: "rgba(11,11,11,0.12)", background: SURFACE }}>
                                <p className="pt-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
                                    list.config.js
                                </p>

                                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(11,11,11,0.45)" }}>
                                    Área del servicio
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {AREAS.map((a) => (
                                        <button
                                            key={a}
                                            type="button"
                                            onClick={() => setArea(a)}
                                            className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200"
                                            style={
                                                a === area
                                                    ? { background: BLUE, borderColor: BLUE, color: "#FFFFFF" }
                                                    : { background: "#FFFFFF", borderColor: "rgba(11,11,11,0.14)", color: "rgba(11,11,11,0.6)" }
                                            }
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>

                                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(11,11,11,0.45)" }}>
                                    Tipo de solicitud
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {TIPOS.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTipo(t)}
                                            className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200"
                                            style={
                                                t === tipo
                                                    ? { background: YELLOW, borderColor: YELLOW, color: INK }
                                                    : { background: "#FFFFFF", borderColor: "rgba(11,11,11,0.14)", color: "rgba(11,11,11,0.6)" }
                                            }
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <div
                                    className="pt-mono mt-6 overflow-x-auto rounded-xl p-4 text-[11px] leading-relaxed"
                                    style={{ background: INK, color: "rgba(255,255,255,0.82)" }}
                                >
                                    <p style={{ color: YELLOW }}>POST /issue_open</p>
                                    <p className="opacity-60">Content-Type: multipart/form-data</p>
                                    <p className="opacity-60">X-Paguetodo-ID: ‹id de la aplicación›</p>
                                    <p className="opacity-60">app-id: website</p>
                                    <p className="mt-2 opacity-30">— — — —</p>
                                    <p>area: <span style={{ color: "#7FB6FF" }}>{area}</span></p>
                                    <p>type: <span style={{ color: "#7FB6FF" }}>{tipo}</span></p>
                                    <p>rif: <span style={{ color: "#7FB6FF" }}>J-410258963</span></p>
                                    <p>phone: <span style={{ color: "#7FB6FF" }}>04148624450</span></p>
                                    <p className="mt-2">
                                        template:{" "}
                                        {hasTemplate ? (
                                            <span style={{ color: "#5FD08A" }}>resuelta ✓</span>
                                        ) : (
                                            <span style={{ color: ORANGE }}>sin plantilla</span>
                                        )}
                                    </p>
                                </div>

                                <div
                                    className="mt-4 rounded-xl border-l-4 p-4"
                                    style={
                                        hasTemplate
                                            ? { borderColor: "#1FA95C", background: "rgba(31,169,92,0.08)" }
                                            : { borderColor: ORANGE, background: "rgba(255,123,0,0.08)" }
                                    }
                                >
                                    {hasTemplate ? (
                                        <p className="text-sm font-semibold" style={{ color: INK }}>
                                            ¡Gracias por enviar su solicitud! — el ticket entra tipificado al back-office.
                                        </p>
                                    ) : (
                                        <p className="text-sm font-semibold" style={{ color: INK }}>
                                            Esta combinación no tiene plantilla: se abre un modal que deriva al correo de operaciones en vez de fallar en silencio.
                                        </p>
                                    )}
                                    <p className="mt-1.5 text-[12px]" style={{ color: "rgba(11,11,11,0.55)" }}>
                                        RIF validado con <span className="pt-mono">/^([VEJPG]{"{1}"})([0-9]{"{4,9}"}$)/</span> y teléfono
                                        enmascarado a 10 dígitos con jQuery Mask.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Suscripción de equipos */}
                    <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
                        <Reveal direction="right">
                            <h3 className="pt-tight text-2xl font-black leading-tight md:text-3xl" style={{ color: INK }}>
                                Y una ruta que no vende nada:{" "}
                                <span style={{ color: BLUE }}>suscribir un equipo por su serial</span>
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "rgba(11,11,11,0.62)" }}>
                                Se abre desde un enlace con <span className="pt-mono">?identifier=</span>, consulta el parque de equipos
                                financieros y decide qué mostrar. Prueba los dos desenlaces.
                            </p>
                            <div className="mt-5 flex gap-2">
                                {[
                                    { label: "Serial encontrado", value: true },
                                    { label: "Serial desconocido", value: false },
                                ].map((opt) => (
                                    <button
                                        key={opt.label}
                                        type="button"
                                        onClick={() => setSerialFound(opt.value)}
                                        className="rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors duration-200"
                                        style={
                                            serialFound === opt.value
                                                ? { background: INK, borderColor: INK, color: "#FFFFFF" }
                                                : { background: "#FFFFFF", borderColor: "rgba(11,11,11,0.16)", color: "rgba(11,11,11,0.6)" }
                                        }
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <BrowserFrame url="paguetodo.com/#/suscription-finantial-app" dark={false}>
                                <MockSuscription found={serialFound} />
                            </BrowserFrame>
                            <p className="pt-mono mt-3 text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(11,11,11,0.42)" }}>
                                {p.uiScreens[4]?.name}
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════════ MÉTRICAS ══════════════════════ */}
            <section
                className="pt-metrics relative overflow-hidden px-4 py-16 md:px-6 md:py-20"
                style={{ background: `linear-gradient(120deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)` }}
            >
                <span aria-hidden className="pt-dots absolute inset-0 opacity-20" />
                <div className="relative mx-auto max-w-6xl">
                    <p className="pt-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: YELLOW }}>
                        el repositorio en números
                    </p>
                    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {p.metrics.map((m) => (
                            <div key={m.label} className="text-white">
                                <CountMetric value={m.value} label={m.label} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════ ARQUITECTURA ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="06 / Cómo está armado"
                        title={
                            <>
                                El mismo tablero, ahora <span className="brand-gradient-text">en orden de carga</span>
                            </>
                        }
                        lead="index.html no compila nada: encadena los ficheros en un orden que importa. Estas son las seis capas, de la CDN a los controladores."
                    />

                    <div className="mt-12 space-y-6">
                        {LOAD_ORDER.map((step, i) => (
                            <Reveal key={step.layer} delay={i * 0.06}>
                                <div className="pt-node grid gap-3 md:grid-cols-[220px_1fr] md:gap-6">
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="mt-0.5 inline-grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black"
                                            style={{ background: ORANGE, color: "#FFFFFF" }}
                                        >
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="pt-tight text-base font-black leading-tight" style={{ color: BLUE }}>
                                                {step.layer}
                                            </p>
                                            <p className="pt-mono mt-1 break-words text-[10.5px]" style={{ color: "rgba(11,11,11,0.45)" }}>
                                                {step.file}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4 md:p-5" style={{ borderColor: "rgba(11,11,11,0.10)", background: SURFACE }}>
                                        <p className="text-sm leading-relaxed" style={{ color: "rgba(11,11,11,0.68)" }}>
                                            {step.detail}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {step.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="pt-mono rounded border bg-white px-2 py-1 text-[10.5px]"
                                                    style={{ borderColor: "rgba(15,121,238,0.22)", color: BLUE }}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-12">
                        <div className="rounded-2xl border-l-4 bg-white p-6 md:p-8" style={{ borderColor: BLUE }}>
                            <p className="text-sm leading-relaxed md:text-[15px]" style={{ color: "rgba(11,11,11,0.72)" }}>
                                {p.architecture}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════════ RETOS ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK, background: SURFACE }}>
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="07 / Los retos"
                        title={
                            <>
                                Cinco decisiones <span className="brand-gradient-text">que hubo que defender</span>
                            </>
                        }
                    />

                    <div className="mt-10 space-y-4">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="pt-stack-card overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "rgba(11,11,11,0.10)" }}>
                                    <div className="grid md:grid-cols-2">
                                        <div className="border-b p-5 md:border-b-0 md:border-r md:p-6" style={{ borderColor: "rgba(11,11,11,0.08)" }}>
                                            <p className="pt-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: ORANGE }}>
                                                reto {String(i + 1).padStart(2, "0")}
                                            </p>
                                            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(11,11,11,0.7)" }}>
                                                {c.problem}
                                            </p>
                                        </div>
                                        <div className="p-5 md:p-6" style={{ background: "rgba(15,121,238,0.045)" }}>
                                            <p className="pt-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: BLUE }}>
                                                cómo se resolvió
                                            </p>
                                            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(11,11,11,0.72)" }}>
                                                {c.solution}
                                            </p>
                                        </div>
                                    </div>
                                    <span aria-hidden className="block h-[3px]" style={{ background: YELLOW }} />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════ FUNCIONALIDADES ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ color: INK }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="08 / Funcionalidades"
                        title={
                            <>
                                Todo lo que <span className="brand-gradient-text">ya está publicado</span>
                            </>
                        }
                    />

                    <Stagger className="mt-10 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2" stagger={0.05}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={16}>
                                <div
                                    className="group flex h-full gap-4 p-5 md:p-6"
                                    style={{ background: i % 2 === 0 ? "#FFFFFF" : "rgba(239,239,239,0.55)" }}
                                >
                                    <span
                                        className="pt-mono shrink-0 text-[11px] font-black"
                                        style={{ color: "rgba(11,11,11,0.25)" }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                        className="mt-0.5 inline-grid h-4 w-4 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                                        style={{ background: YELLOW, color: INK }}
                                    >
                                        <ChevronRight size={10} strokeWidth={3} />
                                    </span>
                                    <p className="text-sm leading-relaxed" style={{ color: "rgba(11,11,11,0.68)" }}>
                                        {f}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════════ STACK ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: "#FFFFFF", background: INK }}>
                <div className="mx-auto max-w-6xl">
                    <span className="pt-mono block text-xs uppercase tracking-[0.4em]" style={{ color: YELLOW }}>
                        09 / Stack
                    </span>
                    <h2 className="pt-tight mt-3 text-3xl font-black leading-tight md:text-5xl">
                        Cinco capas y <span style={{ color: YELLOW }}>ni un node_modules</span> en el navegador
                    </h2>

                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06}>
                                <div className="h-full rounded-xl border border-white/12 bg-white/[0.04] p-5">
                                    <p className="pt-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: YELLOW }}>
                                        {group.group}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded border border-white/12 bg-white/6 px-2 py-1 text-[11px] text-white/78"
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

            {/* ══════════════════════ CAPTURAS REALES ══════════════════════ */}
            {shots.length > 0 && (
                <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="mx-auto max-w-6xl">
                        <SectionHead
                            index="10 / El ecosistema"
                            title={
                                <>
                                    Lo que el sitio <span className="brand-gradient-text">vende de verdad</span>
                                </>
                            }
                            lead="Capturas de la aplicación Paguetodo: recargas, inventario, métodos de pago y recibos. El sitio corporativo es la puerta de entrada a este ecosistema."
                        />
                    </div>

                    <div className="mt-10 pl-4 md:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
                        <DragRail>
                            {shots.map((shot, i) => (
                                <div key={shot.src} className="w-[176px] shrink-0 md:w-[210px]">
                                    <ShotCard src={shot.src} alt={shot.caption} caption={shot.caption} priority={i < 2} />
                                    <p className="pt-mono mt-2 text-[10px]" style={{ color: "rgba(11,11,11,0.35)" }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </p>
                                </div>
                            ))}
                        </DragRail>
                    </div>

                    <p className="mx-auto mt-6 max-w-6xl px-0 text-[12px] md:px-0" style={{ color: "rgba(11,11,11,0.4)" }}>
                        Arrastra para recorrer las {shots.length} capturas.
                    </p>
                </section>
            )}

            {/* ══════════════════════ RESUMEN ══════════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK, background: SURFACE }}>
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.3fr]">
                    <div>
                        <span className="pt-mono block text-xs uppercase tracking-[0.4em]" style={{ color: "rgba(11,11,11,0.4)" }}>
                            11 / En resumen
                        </span>
                        <h2 className="pt-tight mt-3 text-3xl font-black leading-[0.98] md:text-5xl">
                            Un sitio corporativo
                            <br />
                            <span className="brand-gradient-text">que trabaja</span>
                        </h2>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Chip>{p.category}</Chip>
                            <Chip>{p.year}</Chip>
                        </div>
                    </div>

                    <Stagger className="space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={`leading-relaxed ${i === 0 ? "text-lg font-semibold md:text-xl" : "text-sm md:text-base"}`}
                                    style={{ color: i === 0 ? INK : "rgba(11,11,11,0.65)" }}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <Ribbon items={SERVICIOS} reverse />

            <div className="pb-24" style={{ color: INK }}>
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un sitio institucional que no se queda en folleto: enruta 16 productos por audiencia, clasifica cada solicitud antes de enviarla y se publica con un pipeline propio. Si necesitas algo así —web comercial conectada a tu back-office— es terreno conocido."
                />
                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="pt-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-100"
                        style={{ color: "rgba(11,11,11,0.45)" }}
                    >
                        volver al índice <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
