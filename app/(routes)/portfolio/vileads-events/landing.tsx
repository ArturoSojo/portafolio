"use client"

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    BarChart3,
    Calendar,
    Camera,
    Check,
    ChevronDown,
    Handshake,
    LayoutGrid,
    LifeBuoy,
    MapPin,
    Monitor,
    QrCode,
    Receipt,
    Settings,
    Share2,
    Smartphone,
    Sparkles,
    Ticket as TicketIcon,
    Users,
    Wallet,
    WifiOff,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SampleDataNote, SectionHead } from "@/components/projects/bits";
import { BrowserFrame, DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("vileads-events")!;
const nxt = nextProject("vileads-events");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const INK = "#0A0E1A";
const PAPER = "#F7F7F5";
const CREAM = "#EFEEE9";
const HAIR = "#E5E2DA";
const BLUE = "#1A2B6B";
const RED = "#D33A2C";

/* Las seis plantillas del Site Builder, tal y como se ven en la galería. */
const TEMPLATES = [
    { id: "tech-conference", name: "Tech Conference", sub: "Cian sobre casi negro", cat: "Tecnología", glyph: "◆", grad: "linear-gradient(140deg,#020617 0%,#0F172A 55%,#06B6D4 100%)", accent: "#06B6D4" },
    { id: "music-festival", name: "Music Festival", sub: "Granate, violeta y naranja", cat: "Música", glyph: "♪", grad: "linear-gradient(140deg,#7F1D3A 0%,#6D28D9 55%,#F97316 100%)", accent: "#F97316" },
    { id: "executive-summit", name: "Executive Summit", sub: "Azul marino con dorado", cat: "Corporativo", glyph: "◆", grad: "linear-gradient(140deg,#0B1B3A 0%,#1A2B6B 60%,#C9A84C 100%)", accent: "#C9A84C" },
    { id: "creative-workshop", name: "Creative Workshop", sub: "Rosa y ámbar de taller", cat: "Creativo", glyph: "✳", grad: "linear-gradient(140deg,#831843 0%,#DB2777 55%,#FBBF24 100%)", accent: "#DB2777" },
    { id: "industry-expo", name: "Industry Expo", sub: "Acero y cielo técnico", cat: "Expo", glyph: "▦", grad: "linear-gradient(140deg,#1E293B 0%,#334155 55%,#0EA5E9 100%)", accent: "#0EA5E9" },
    { id: "community-event", name: "Community Event", sub: "Verde de barrio", cat: "Comunidad", glyph: "❋", grad: "linear-gradient(140deg,#064E3B 0%,#059669 55%,#84CC16 100%)", accent: "#84CC16" },
];

const css = `
.vle-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
.vle-serif { font-family: "DM Serif Display", Georgia, "Times New Roman", serif; letter-spacing: -0.012em; }

.vle-grid {
  background-image:
    linear-gradient(to right, rgba(252,252,251,0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(252,252,251,0.045) 1px, transparent 1px);
  background-size: 48px 48px;
}
.vle-confetti {
  background-image: radial-gradient(circle at 2px 2px, rgba(252,252,251,0.09) 1.4px, transparent 1.8px);
  background-size: 26px 26px;
}

/* ---- la entrada de papel ---- */
.vle-ticket {
  position: relative;
  background:
    repeating-linear-gradient(0deg, rgba(10,14,26,0.016) 0 1px, transparent 1px 3px),
    ${PAPER};
  color: ${INK};
  border-radius: 12px;
  box-shadow: 0 26px 64px -30px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(10,14,26,0.10);
}
.vle-accent-bar {
  position: absolute;
  left: 0; top: 14px; bottom: 14px;
  width: 5px;
  border-radius: 0 4px 4px 0;
  background: ${RED};
}
/* troquel vertical: agujeros del color del fondo */
.vle-perf {
  position: absolute;
  top: -2px; bottom: -2px;
  width: 16px;
  background-image: radial-gradient(circle at 8px 11px, ${INK} 5.4px, rgba(10,14,26,0) 6px);
  background-size: 16px 22px;
  clip-path: inset(0 0 0 0);
}
.vle-perf-anim { animation: vle-diecut 620ms cubic-bezier(.2,.9,.3,1) both; }
@keyframes vle-diecut {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 0 0 0); }
}
/* troquel horizontal, para las entradas partidas por la mitad */
.vle-perf-h {
  position: absolute;
  left: -2px; right: -2px;
  height: 16px;
  background-image: radial-gradient(circle at 11px 8px, ${INK} 5.4px, rgba(10,14,26,0) 6px);
  background-size: 22px 16px;
}
.vle-notch {
  position: absolute;
  width: 20px; height: 20px;
  border-radius: 9999px;
  background: ${INK};
}

/* ---- código de barras ---- */
.vle-barcode {
  background-image: repeating-linear-gradient(90deg,
    ${BLUE} 0 2px, transparent 2px 4px,
    ${BLUE} 4px 5px, transparent 5px 9px,
    ${BLUE} 9px 12px, transparent 12px 13px,
    ${BLUE} 13px 14px, transparent 14px 18px);
}
.vle-barcode-v {
  background-image: repeating-linear-gradient(180deg,
    ${BLUE} 0 2px, transparent 2px 4px,
    ${BLUE} 4px 5px, transparent 5px 9px,
    ${BLUE} 9px 12px, transparent 12px 13px,
    ${BLUE} 13px 14px, transparent 14px 18px);
}

/* ---- validación al pasar el cursor ---- */
.vle-hl .vle-scan {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.20) 44%, rgba(34,211,238,0.85) 50%, rgba(34,211,238,0.20) 56%, transparent 100%);
  background-size: 100% 46px;
  background-repeat: no-repeat;
  background-position: 0 -50px;
}
.vle-hl:hover .vle-scan { animation: vle-scan 700ms ease-out 1; }
@keyframes vle-scan {
  0%   { opacity: 1; background-position: 0 -50px; }
  100% { opacity: 0; background-position: 0 118%; }
}
.vle-hl .vle-ring {
  position: absolute; inset: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 0 0 rgba(22,163,74,0);
  transition: box-shadow 300ms ease;
  pointer-events: none;
}
.vle-hl:hover .vle-ring { box-shadow: inset 0 0 0 2px rgba(22,163,74,0.6); }

/* ---- sello ---- */
.vle-stamp {
  border: 3px double currentColor;
  border-radius: 9999px;
  box-shadow: 0 0 0 1px currentColor inset;
  mix-blend-mode: multiply;
}

/* ---- fajo / talonario del stack ---- */
.vle-fold { position: relative; z-index: 0; transition: transform 420ms cubic-bezier(.2,.9,.3,1); }
.vle-fold::before, .vle-fold::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: ${CREAM};
  box-shadow: inset 0 0 0 1px rgba(10,14,26,0.10);
  z-index: -1;
  transition: transform 420ms cubic-bezier(.2,.9,.3,1);
}
.vle-fold::before { transform: translate(6px, 7px) rotate(1.4deg); opacity: 0.6; }
.vle-fold::after  { transform: translate(12px, 13px) rotate(2.8deg); opacity: 0.32; }
.vle-fold:hover { transform: translateY(-8px) rotate(-1deg); }
.vle-fold:hover::before { transform: translate(10px, 12px) rotate(3deg); }
.vle-fold:hover::after  { transform: translate(20px, 22px) rotate(5.4deg); }

/* ---- rasgado del talón al pasar el cursor ---- */
.vle-tear { transition: transform 480ms cubic-bezier(.2,.9,.3,1); }
.vle-ticket:hover .vle-tear { transform: translateX(8px) rotate(1.5deg); }

.vle-vert { writing-mode: vertical-rl; transform: rotate(180deg); }

@media (prefers-reduced-motion: reduce) {
  .vle-perf-anim,
  .vle-hl:hover .vle-scan { animation: none !important; }
  .vle-perf-anim { clip-path: inset(0 0 0 0) !important; }
  .vle-fold, .vle-fold::before, .vle-fold::after, .vle-tear { transition: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Piezas del sistema visual: la entrada, el sello, el código de barras */
/* ------------------------------------------------------------------ */

const Barcode = ({ className }: { className?: string }) => (
    <span aria-hidden className={`vle-barcode block ${className ?? ""}`} />
);

const Stamp = ({
    label,
    color,
    className,
    delay = 0.15,
}: {
    label: string;
    color: string;
    className?: string;
    delay?: number;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.span
            initial={reduce ? { opacity: 0.9, scale: 1, rotate: -8 } : { opacity: 0, scale: 2.4, rotate: -18 }}
            whileInView={
                reduce
                    ? { opacity: 0.9 }
                    : { opacity: [0, 1, 0.92, 0.9], scale: [2.4, 0.94, 1.03, 1], rotate: [-18, -6, -10, -8] }
            }
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduce ? 0 : 0.42, delay: reduce ? 0 : delay, ease: "easeOut" }}
            className={`vle-stamp vle-mono inline-flex items-center justify-center px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] ${className ?? ""}`}
            style={{ color }}
        >
            {label}
        </motion.span>
    );
};

/** La entrada: cuerpo largo a la izquierda, talón troquelado a la derecha. */
const Ticket = ({
    sec,
    stub,
    code,
    children,
    className,
    bodyClassName,
    tilt = 0,
    stubWidth = "w-[62px] md:w-[86px]",
    delay = 0,
}: {
    sec: string;
    stub: string;
    code: string;
    children: React.ReactNode;
    className?: string;
    bodyClassName?: string;
    tilt?: number;
    stubWidth?: string;
    delay?: number;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: tilt - 1.2 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotate: tilt }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
            className={`vle-ticket ${className ?? ""}`}
        >
            <span aria-hidden className="vle-accent-bar" />
            <div className="flex">
                <div className={`min-w-0 flex-1 ${bodyClassName ?? "p-5 pl-6 md:p-8 md:pl-10"}`}>{children}</div>

                <div className={`relative shrink-0 ${stubWidth}`}>
                    <span aria-hidden className="vle-perf vle-perf-anim absolute left-0 -translate-x-1/2" />
                    <span aria-hidden className="vle-notch -top-[10px] left-0 -translate-x-1/2" />
                    <span aria-hidden className="vle-notch -bottom-[10px] left-0 -translate-x-1/2" />

                    <motion.div
                        initial={reduce ? undefined : { x: 10, rotate: 1.6 }}
                        whileInView={reduce ? undefined : { x: 0, rotate: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: reduce ? 0 : 0.48, delay: reduce ? 0 : delay + 0.18, ease: [0.2, 0.9, 0.3, 1] }}
                        className="vle-tear flex h-full flex-col items-center justify-between gap-3 py-4"
                    >
                        <span className="vle-mono text-[9px] font-bold tracking-[0.16em]" style={{ color: BLUE }}>
                            {sec}
                        </span>
                        <span
                            className="vle-vert vle-mono flex-1 text-[9px] uppercase tracking-[0.34em] md:text-[10px]"
                            style={{ color: "rgba(10,14,26,0.55)" }}
                        >
                            {stub}
                        </span>
                        <span className="flex flex-col items-center gap-1.5">
                            <Barcode className="h-9 w-7 md:w-9" />
                            <span className="vle-mono text-[7px] tracking-[0.1em]" style={{ color: "rgba(10,14,26,0.45)" }}>
                                {code}
                            </span>
                        </span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

/* ------------------------------------------------------------------ */
/*  Mockups recreados en HTML/CSS a partir de p.uiScreens              */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: { label: string; icon: LucideIcon }[] = [
    { label: "Resumen", icon: LayoutGrid },
    { label: "Eventos", icon: Calendar },
    { label: "Entradas", icon: TicketIcon },
    { label: "Órdenes", icon: Receipt },
    { label: "Fondos", icon: Wallet },
    { label: "Ponentes", icon: Users },
    { label: "Patrocinadores", icon: Handshake },
    { label: "Analítica", icon: BarChart3 },
    { label: "Asesoría", icon: LifeBuoy },
    { label: "Ajustes", icon: Settings },
];

/** uiScreens[0] — Home: hero sobre papel con la maqueta del panel. */
const MockHome = () => (
    <div className="relative overflow-hidden bg-[#F7F7F5] p-4 text-[#0A0E1A] md:p-6">
        <span
            aria-hidden
            className="absolute inset-0"
            style={{
                backgroundImage:
                    "linear-gradient(to right, rgba(10,14,26,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,14,26,0.04) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}
        />
        <span aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#7C3AED]/25 blur-3xl" />
        <span aria-hidden className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#1A2B6B]/20 blur-3xl" />

        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_1.05fr]">
            <div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6B7280]">
                    <Sparkles size={11} /> Infraestructura de eventos
                </span>
                <h4 className="vle-serif mt-3 text-[22px] leading-[1.06] md:text-[30px]">
                    El sistema operativo para
                    <br />
                    <span
                        style={{
                            backgroundImage: "linear-gradient(90deg,#7C3AED,#D946EF)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        eventos ambiciosos.
                    </span>
                </h4>
                <p className="mt-3 max-w-[34ch] text-[10px] leading-relaxed text-[#3B4252] md:text-[11px]">
                    Vileads le da a los operadores modernos la plataforma para lanzar, vender y operar eventos de punta a
                    punta — con tu marca arriba, nuestra ingeniería abajo.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0A0E1A] px-3.5 py-2 text-[10px] font-semibold text-[#FCFCFB]">
                    Crear cuenta <ArrowRight size={11} />
                </span>
            </div>

            {/* Maqueta del panel dentro de una tarjeta blanca de 24px */}
            <div className="overflow-hidden rounded-[18px] border border-[#E5E2DA] bg-[#FCFCFB] shadow-[0_26px_60px_-24px_rgba(10,14,26,0.45)]">
                <div className="flex">
                    <div className="w-[62px] shrink-0 bg-[#EFEEE9] p-2 md:w-[74px]">
                        <p className="vle-mono text-[7px] font-bold tracking-[0.2em] text-[#6B7280]">ACME</p>
                        <div className="mt-2 space-y-1">
                            {["Resumen", "Eventos", "Constructor", "Entradas", "Ponentes", "Patrocin.", "Ajustes"].map(
                                (item, i) => (
                                    <p
                                        key={item}
                                        className={`truncate rounded px-1.5 py-1 text-[7px] ${
                                            i === 0
                                                ? "bg-[#0A0E1A] font-semibold text-[#FCFCFB]"
                                                : "text-[#6B7280]"
                                        }`}
                                    >
                                        {item}
                                    </p>
                                )
                            )}
                        </div>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-2 p-2.5">
                        {[
                            { label: "Asistentes", value: "8,432", delta: "+12%", icon: Users },
                            { label: "Ingresos", value: "$278,600", delta: "+18%", icon: Wallet },
                            { label: "Entradas", value: "1,204", delta: "+9%", icon: TicketIcon },
                            { label: "Eventos", value: "14", delta: "+2", icon: Calendar },
                        ].map((m) => (
                            <div key={m.label} className="rounded-lg border border-[#E5E2DA] bg-white p-2">
                                <m.icon size={11} className="text-[#1A2B6B]" />
                                <p className="mt-1.5 text-[7px] uppercase tracking-[0.14em] text-[#6B7280]">{m.label}</p>
                                <p className="vle-serif text-[14px] leading-tight text-[#0A0E1A]">{m.value}</p>
                                <p className="text-[7px] font-semibold text-emerald-600">{m.delta}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/** uiScreens[1] — Ficha de evento en la vista de catálogo. */
const MockEvent = () => (
    <div className="bg-[#F7F7F5] text-[#0A0E1A]">
        <div className="relative h-[132px] md:h-[150px]">
            <span
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundImage: "linear-gradient(120deg,#1A2B6B 0%,#6D28D9 58%,#D33A2C 100%)" }}
            />
            <span
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundImage: "linear-gradient(to bottom, rgba(10,14,26,0) 30%, rgba(10,14,26,0.9) 100%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 px-3 pb-3 md:px-5">
                <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#D33A2C] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-white">
                        Tecnología
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[7px] uppercase tracking-[0.12em] text-white/90">
                        Presencial
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[7px] uppercase tracking-[0.12em] text-white/90">
                        Publicado
                    </span>
                </div>
                <h4 className="vle-serif mt-1.5 text-[20px] leading-tight text-[#FCFCFB] md:text-[26px]">
                    Cumbre Vileads 2026
                </h4>
                <p className="text-[9px] text-[#FCFCFB]/85">Dos días de producto, operación y negocio para equipos que organizan.</p>
                <div className="mt-1.5 flex flex-wrap gap-3 text-[8px] text-[#FCFCFB]/75">
                    <span className="inline-flex items-center gap-1">
                        <Calendar size={9} /> 12 de marzo de 2026 · 9:00
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <MapPin size={9} /> Centro de Convenciones · Caracas, Venezuela
                    </span>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-1.5 px-3 pt-2.5 md:px-5">
            <span className="rounded-lg bg-[#FCFCFB] px-2.5 py-1.5 text-[8px] font-bold text-[#0A0E1A] shadow-sm">
                Comprar entrada
            </span>
            <span className="rounded-lg border border-[#0A0E1A]/25 px-2.5 py-1.5 text-[8px] text-[#0A0E1A]/75">
                Postularme como ponente
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[8px] text-[#0A0E1A]/55">
                <Share2 size={9} /> Compartir
            </span>
        </div>

        <div className="grid gap-2.5 p-3 md:grid-cols-[2fr_1fr] md:p-5">
            <div className="space-y-2.5">
                <div className="rounded-2xl border border-[#E5E2DA] bg-white p-3">
                    <p className="vle-serif text-[14px]">Sobre el evento</p>
                    <p className="mt-1 text-[9px] leading-relaxed text-[#3B4252]">
                        Una cumbre para organizadores: cómo se vende una entrada, cómo se abre la puerta y cómo se
                        liquida el dinero cuando el recinto ya está vacío.
                    </p>
                </div>
                <div className="rounded-2xl border border-[#E5E2DA] bg-white p-3">
                    <p className="vle-serif text-[14px]">Agenda</p>
                    {[
                        ["09:00", "Apertura y bienvenida"],
                        ["10:30", "Ticketing sin fricción"],
                        ["12:00", "Puerta, aforo y check-in"],
                    ].map(([h, t]) => (
                        <div key={h} className="flex gap-2 border-t border-[#E5E2DA] py-1.5 first:border-0">
                            <span className="vle-mono text-[8px] text-[#1A2B6B]">{h}</span>
                            <span className="text-[9px] text-[#3B4252]">{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="rounded-2xl border border-[#E5E2DA] bg-white p-3">
                    <p className="vle-serif text-[13px]">Entradas</p>
                    {[
                        { name: "General", desc: "Acceso a las dos jornadas", price: "$45" },
                        { name: "VIP", desc: "Networking y sala privada", price: "$120" },
                    ].map((t) => (
                        <div key={t.name} className="mt-2 rounded-xl border border-[#E5E2DA] p-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold">{t.name}</span>
                                <span className="vle-mono text-[10px] text-[#1A2B6B]">{t.price}</span>
                            </div>
                            <p className="text-[7px] text-[#6B7280]">{t.desc}</p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-2 rounded-md border border-[#E5E2DA] px-1.5 py-0.5 text-[8px]">
                                    <span>−</span> 1 <span>+</span>
                                </span>
                                <span className="flex-1 rounded-md bg-[#0A0E1A] py-1 text-center text-[8px] font-semibold text-[#FCFCFB]">
                                    Añadir
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl border border-[#E5E2DA] bg-white p-3">
                    <p className="text-[7px] uppercase tracking-[0.16em] text-[#6B7280]">Organiza</p>
                    <p className="mt-0.5 text-[10px] font-bold">ACME Producciones</p>
                    <p className="text-[8px] text-[#6B7280]">Caracas, Venezuela</p>
                    <span className="vle-mono mt-1.5 inline-block rounded border border-[#E5E2DA] px-1.5 py-0.5 text-[7px] text-[#6B7280]">
                        Powered by Vileads
                    </span>
                </div>
            </div>
        </div>
    </div>
);

/** uiScreens[2] — Panel del organizador, pestaña Resumen. */
const MockPanel = () => (
    <div className="flex bg-[#F7F7F5] text-[#0A0E1A]">
        <aside className="w-[92px] shrink-0 border-r border-[#E5E2DA] bg-[#EFEEE9] p-2 md:w-[118px]">
            <p className="vle-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#6B7280]">Panel · ACME</p>
            <div className="mt-2 space-y-0.5">
                {NAV_ITEMS.map((item, i) => (
                    <p
                        key={item.label}
                        className={`flex items-center gap-1.5 truncate rounded px-1.5 py-1 text-[7.5px] ${
                            i === 0 ? "bg-[#0A0E1A] font-semibold text-[#FCFCFB]" : "text-[#3B4252]"
                        }`}
                    >
                        <item.icon size={9} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </p>
                ))}
                <div className="!mt-2 border-t border-[#E5E2DA] pt-1.5">
                    <p className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[7.5px] text-[#D33A2C]">
                        <QrCode size={9} className="shrink-0" /> Check-in QR
                    </p>
                </div>
            </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-2.5 p-2.5 md:p-4">
            <div className="rounded-lg border border-[#FCD34D] bg-[#FEF3C7] px-2.5 py-1.5 text-[8px] text-[#92400E]">
                Tu organización está en revisión. Podrás publicar eventos cuando el equipo apruebe la cuenta.
            </div>

            <div className="grid grid-cols-3 gap-2">
                {[
                    ["Ventas totales", "$278.600", "+18%"],
                    ["Entradas emitidas", "1.204", "+9%"],
                    ["Asistentes activos", "8.432", "+12%"],
                ].map(([label, value, delta]) => (
                    <div key={label} className="rounded-lg border border-[#E5E2DA] bg-white p-2">
                        <p className="truncate text-[7px] uppercase tracking-[0.12em] text-[#6B7280]">{label}</p>
                        <p className="vle-serif text-[14px] leading-tight md:text-[17px]">{value}</p>
                        <p className="text-[7px] font-semibold text-emerald-600">{delta}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-[#E5E2DA] bg-white p-2.5">
                <p className="text-[8px] font-semibold text-[#3B4252]">Ventas por mes</p>
                <svg viewBox="0 0 300 84" className="mt-1 h-[76px] w-full" preserveAspectRatio="none">
                    {[16, 34, 52, 70].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="300"
                            y2={y}
                            stroke="#0A0E1A"
                            strokeOpacity="0.12"
                            strokeDasharray="3 4"
                        />
                    ))}
                    {[28, 44, 36, 58, 47, 70, 62, 78].map((h, i) => (
                        <rect
                            key={i}
                            x={12 + i * 36}
                            y={80 - h}
                            width="20"
                            height={h}
                            rx="3"
                            fill={i === 7 ? RED : BLUE}
                            fillOpacity={i === 7 ? 0.9 : 0.78}
                        />
                    ))}
                </svg>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-lg border border-[#E5E2DA] bg-white p-2.5">
                    <p className="text-[7px] uppercase tracking-[0.14em] text-[#6B7280]">Suscripción anual</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                        <Check size={9} /> Al día
                    </p>
                    <p className="text-[7.5px] text-[#6B7280]">Vence el 14 de marzo de 2027</p>
                </div>
                <div className="rounded-lg border border-[#E5E2DA] bg-white p-2.5">
                    <p className="text-[7px] uppercase tracking-[0.14em] text-[#6B7280]">Eventos recientes</p>
                    {[
                        ["Cumbre Vileads 2026", "Publicado", "#059669"],
                        ["Expo Industria", "Borrador", "#6B7280"],
                        ["Taller de producto", "Agotado", "#D33A2C"],
                    ].map(([name, state, color]) => (
                        <div key={name} className="flex items-center justify-between border-t border-[#E5E2DA] py-1 first:border-0">
                            <span className="truncate text-[8px]">{name}</span>
                            <span className="vle-mono shrink-0 text-[7px]" style={{ color }}>
                                {state}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/** uiScreens[3] — Check-in con QR en la puerta, en el teléfono del staff. */
const MockCheckin = () => (
    <div className="flex h-full flex-col bg-[#F7F7F5] px-3 pb-3 pt-8 text-[#0A0E1A]">
        <div className="flex items-start justify-between gap-2">
            <div>
                <p className="vle-mono text-[7px] uppercase tracking-[0.24em] text-[#6B7280]">En sitio</p>
                <h4 className="vle-serif text-[16px] leading-tight">Check-in con QR</h4>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0A0E1A]/8 px-1.5 py-0.5 text-[7px] font-semibold text-[#D33A2C]">
                <WifiOff size={9} /> Offline
            </span>
        </div>
        <p className="mt-1 text-[8px] leading-relaxed text-[#3B4252]">
            Escanea el QR del ticket o pega el código. Funciona offline.
        </p>

        <div className="mt-2 flex items-center justify-between rounded-lg border border-[#E5E2DA] bg-white px-2 py-1.5">
            <span className="truncate text-[8px] font-semibold">Cumbre Vileads 2026</span>
            <ChevronDown size={10} className="text-[#6B7280]" />
        </div>

        <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-[#EFEEE9] p-0.5">
            <span className="rounded-md bg-[#0A0E1A] py-1 text-center text-[8px] font-semibold text-[#FCFCFB]">
                Entradas
            </span>
            <span className="py-1 text-center text-[8px] text-[#6B7280]">Postulaciones</span>
        </div>

        <div className="mt-2 rounded-lg bg-[#05070E] p-2.5 text-center">
            <div className="mx-auto grid h-[70px] w-full place-items-center rounded-md border border-dashed border-white/20">
                <p className="px-3 text-[7.5px] leading-relaxed text-white/55">
                    Cámara apagada. Usa ingreso manual o enciende la cámara.
                </p>
            </div>
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#FCFCFB] px-2 py-1 text-[8px] font-semibold text-[#0A0E1A]">
                <Camera size={9} /> Iniciar cámara
            </span>
        </div>

        <div className="mt-2 flex gap-1">
            <span className="vle-mono flex-1 truncate rounded-md border border-[#E5E2DA] bg-white px-2 py-1.5 text-[8px] text-[#6B7280]">
                VL-TCK-8F42-19
            </span>
            <span className="rounded-md bg-[#1A2B6B] px-2.5 py-1.5 text-[8px] font-semibold text-white">Validar</span>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-md bg-[#FEF3C7] px-2 py-1.5">
            <span className="text-[7.5px] font-semibold text-[#92400E]">Pendientes de sincronizar · 3</span>
            <span className="rounded bg-[#92400E] px-1.5 py-0.5 text-[7px] font-bold text-[#FEF3C7]">Sincronizar 3</span>
        </div>

        <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-hidden">
            {[
                { code: "VL-TCK-8F42-19", state: "Válido", cls: "bg-emerald-100 text-emerald-700" },
                { code: "VL-TCK-2A07-63", state: "Ya registrado", cls: "border border-[#0A0E1A]/25 text-[#3B4252]" },
                { code: "VL-TCK-9C11-04", state: "Encolado offline", cls: "bg-[#0A0E1A]/8 text-[#6B7280]" },
                { code: "VL-TCK-5D88-77", state: "Ticket no encontrado", cls: "bg-[#D33A2C]/12 text-[#D33A2C]" },
            ].map((r) => (
                <div
                    key={r.code}
                    className="flex items-center justify-between gap-1 rounded-md border border-[#E5E2DA] bg-white px-2 py-1.5"
                >
                    <span className="vle-mono truncate text-[7.5px] text-[#3B4252]">{r.code}</span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[6.5px] font-bold ${r.cls}`}>{r.state}</span>
                </div>
            ))}
        </div>

        <p className="mt-1.5 text-[7px] text-[#6B7280]">Invitados registrados · 218</p>
    </div>
);

/* ------------------------------------------------------------------ */

const Landing = () => {
    const reduce = useReducedMotion();
    const { scrollY } = useScroll();
    const confettiY = useTransform(scrollY, (v) => -v * 0.5);

    const logoDark = p.media.find((m) => m.src.endsWith("logo-white.png"));
    const logoPaper = p.media.find((m) => m.src.endsWith("logo-full.png"));
    const favicon = p.media.find((m) => m.src.endsWith(".svg"));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* confeti de perforaciones al medio de la velocidad del scroll */}
            <motion.span
                aria-hidden
                className="vle-confetti pointer-events-none fixed inset-x-0 -top-[60vh] h-[220vh] opacity-70"
                style={reduce ? undefined : { y: confettiY }}
            />

            {/* ─────────────────── SEC 00 · HERO ─────────────────── */}
            <section className="relative px-4 pt-28 pb-16 md:px-6 md:pt-36 md:pb-24">
                <div aria-hidden className="vle-grid absolute inset-0" />
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[520px]"
                    style={{
                        background:
                            "radial-gradient(55% 60% at 70% 0%, rgba(109,40,217,0.22), transparent 70%), radial-gradient(45% 55% at 15% 20%, rgba(26,43,107,0.35), transparent 70%)",
                    }}
                />

                <div className="relative mx-auto max-w-6xl">
                    <Ticket
                        sec="SEC 00"
                        stub="Admit one"
                        code="VL-2026-0001"
                        tilt={-2}
                        stubWidth="w-[74px] md:w-[124px]"
                        className="relative"
                        bodyClassName="p-6 pl-7 md:p-12 md:pl-14"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {logoPaper && (
                                <Image
                                    src={logoPaper.src}
                                    alt={p.name}
                                    width={260}
                                    height={72}
                                    priority
                                    className="h-9 w-auto md:h-11"
                                />
                            )}
                            <span className="vle-mono text-[10px] uppercase tracking-[0.28em] text-[#0A0E1A]/45">
                                {p.categoryShort} · {p.year}
                            </span>
                        </div>

                        <div className="mt-7 border-t border-dashed border-[#0A0E1A]/20 pt-7">
                            <p className="vle-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: RED }}>
                                Entrada general · no reembolsable
                            </p>
                            <h1 className="vle-serif mt-3 text-[40px] leading-[0.98] md:text-[76px]">
                                <span className="text-[#0A0E1A]">Vileads</span>{" "}
                                <span className="brand-gradient-text">Events</span>
                            </h1>
                            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#3B4252] md:text-lg">
                                {p.tagline}
                            </p>
                        </div>

                        <div className="mt-7 grid gap-4 border-t border-dashed border-[#0A0E1A]/20 pt-6 sm:grid-cols-3">
                            {[
                                ["Categoría", p.category],
                                ["Rol", p.role],
                                ["Estado", p.status],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <p className="vle-mono text-[9px] uppercase tracking-[0.24em] text-[#0A0E1A]/40">{k}</p>
                                    <p className="mt-1 text-[12px] leading-snug text-[#0A0E1A]/80">{v}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <BrandButton href="#pantallas">
                                <Monitor size={16} /> Ver las pantallas
                            </BrandButton>
                            <BrandButton href="#retos" variant="outline" className="!border-[#0A0E1A]/25 !text-[#0A0E1A]">
                                <QrCode size={16} /> Cómo está hecho
                            </BrandButton>
                            <Chip className="!bg-[#1A2B6B]/8">{p.statusShort}</Chip>
                        </div>

                        {/* dos sellos superpuestos, con tinta desgastada */}
                        <div className="pointer-events-none absolute right-[15%] top-8 hidden rotate-[-6deg] flex-col items-end gap-2 md:flex">
                            <Stamp label="Multi-tenant" color={RED} delay={0.35} />
                            <Stamp label="React · TypeScript" color={BLUE} delay={0.5} className="mr-6" />
                        </div>
                    </Ticket>
                </div>
            </section>

            <div className="relative border-y border-white/10 py-4">
                <Marquee
                    items={[
                        "Catálogo",
                        "Landing por evento",
                        "Site Builder",
                        "Checkout",
                        "Webhook",
                        "Check-in QR",
                        "Fondos y liquidaciones",
                        "Super-admin",
                    ]}
                    speed={38}
                    separator="✦"
                    className="vle-mono text-[11px] uppercase tracking-[0.24em] opacity-55"
                />
            </div>

            {/* ─────────────────── SEC 01 · PROBLEMA / SOLUCIÓN ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="SEC 01 / El antes y el después"
                        title={
                            <>
                                Dos entradas para el mismo evento:{" "}
                                <span className="brand-gradient-text">una vencida, una válida</span>
                            </>
                        }
                        lead="Así se opera un evento cuando las herramientas están cosidas a mano, y así se opera cuando el evento vive entero dentro de una sola aplicación."
                    />

                    <div className="mt-12 grid gap-8 lg:grid-cols-2">
                        <Ticket
                            sec="SEC 01·A"
                            stub="Vencida"
                            code="VL-OLD-0000"
                            tilt={-1}
                            className="opacity-95 saturate-[0.35]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <p className="vle-mono text-[10px] uppercase tracking-[0.26em] text-[#0A0E1A]/45">
                                    El problema
                                </p>
                                <Stamp label="Vencida" color={RED} />
                            </div>
                            <h3 className="vle-serif mt-4 text-2xl md:text-3xl">Media docena de herramientas cosidas</h3>
                            <p className="mt-4 text-sm leading-relaxed text-[#3B4252] md:text-base">{p.problem}</p>
                        </Ticket>

                        <Ticket sec="SEC 01·B" stub="Válida" code="VL-NEW-2026" tilt={1} delay={0.12}>
                            <div className="flex items-start justify-between gap-4">
                                <p className="vle-mono text-[10px] uppercase tracking-[0.26em]" style={{ color: BLUE }}>
                                    La solución
                                </p>
                                <Stamp label="Válida" color="#15803D" delay={0.28} />
                            </div>
                            <h3 className="vle-serif mt-4 text-2xl md:text-3xl">Una sola aplicación de punta a punta</h3>
                            <p className="mt-4 text-sm leading-relaxed text-[#3B4252] md:text-base">{p.solution}</p>
                        </Ticket>
                    </div>
                </div>
            </section>

            {/* ─────────────────── SEC 02 · HIGHLIGHTS ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="SEC 02 / Lo que sostiene la plataforma"
                        title={
                            <>
                                Cinco talones que <span className="brand-gradient-text">validan el producto</span>
                            </>
                        }
                    />

                    <div className="mt-12 space-y-6">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <div key={h.title} className="vle-hl relative">
                                    <Ticket
                                        sec={`SEC 02·${i + 1}`}
                                        stub={h.title.split(" ").slice(0, 2).join(" ")}
                                        code={`VL-H${String(i + 1).padStart(2, "0")}-4482`}
                                        tilt={i % 2 === 0 ? -0.6 : 0.6}
                                        delay={i * 0.05}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span
                                                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                                                style={{ background: "rgba(26,43,107,0.10)", color: BLUE }}
                                            >
                                                <Icon size={19} />
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="vle-serif text-xl leading-tight md:text-2xl">{h.title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-[#3B4252]">
                                                    {h.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Ticket>
                                    <span aria-hidden className="vle-scan" />
                                    <span aria-hidden className="vle-ring" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─────────────────── SEC 03 · PANTALLAS ─────────────────── */}
            <section id="pantallas" className="relative scroll-mt-20 px-4 py-20 md:px-6 md:py-28">
                <div aria-hidden className="vle-grid absolute inset-0 opacity-60" />
                <div className="relative mx-auto max-w-6xl">
                    <SectionHead
                        index="SEC 03 / La interfaz"
                        title={
                            <>
                                Cuatro pantallas, <span className="brand-gradient-text">tres audiencias</span>
                            </>
                        }
                        lead="El asistente que compra, el organizador que administra y el staff que abre la puerta: todos viven dentro de la misma aplicación React."
                    />

                    <div className="mt-12 space-y-12">
                        <Reveal>
                            <p className="vle-mono mb-3 text-[10px] uppercase tracking-[0.24em] opacity-50">
                                01 · {p.uiScreens[0].name}
                            </p>
                            <BrowserFrame url="vileadsevents.com" dark={false}>
                                <MockHome />
                            </BrowserFrame>
                        </Reveal>

                        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
                            <Reveal direction="right">
                                <p className="vle-mono mb-3 text-[10px] uppercase tracking-[0.24em] opacity-50">
                                    02 · {p.uiScreens[1].name}
                                </p>
                                <BrowserFrame url="cumbre-2026.vileadsevents.com" dark={false}>
                                    <MockEvent />
                                </BrowserFrame>
                            </Reveal>

                            <Reveal direction="left" delay={0.12} className="mx-auto w-full max-w-[268px]">
                                <p className="vle-mono mb-3 text-[10px] uppercase tracking-[0.24em] opacity-50">
                                    03 · {p.uiScreens[3].name}
                                </p>
                                <PhoneFrame>
                                    <MockCheckin />
                                </PhoneFrame>
                            </Reveal>
                        </div>

                        <Reveal>
                            <p className="vle-mono mb-3 text-[10px] uppercase tracking-[0.24em] opacity-50">
                                04 · {p.uiScreens[2].name}
                            </p>
                            <BrowserFrame url="vileadsevents.com/panel" dark={false}>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[520px]">
                                        <MockPanel />
                                    </div>
                                </div>
                            </BrowserFrame>
                        </Reveal>
                    </div>
                </div>
            
                    <SampleDataNote className="mt-8" />
                </section>

            {/* ─────────────────── SEC 04 · SITE BUILDER ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="SEC 04 / Site Builder"
                        title={
                            <>
                                Seis plantillas con <span className="brand-gradient-text">persona propia</span>
                            </>
                        }
                        lead={p.uiScreens[4].name}
                    />

                    <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {TEMPLATES.map((t, i) => (
                            <StaggerItem key={t.id}>
                                <div
                                    className="group h-full rounded-3xl bg-[#F7F7F5] p-3 transition-transform duration-500 hover:-translate-y-1"
                                    style={
                                        i === 0
                                            ? { boxShadow: `0 0 0 2px ${t.accent}, 0 26px 60px -30px rgba(0,0,0,.9)` }
                                            : { boxShadow: `inset 0 0 0 1px ${HAIR}, 0 20px 50px -34px rgba(0,0,0,.9)` }
                                    }
                                >
                                    <div
                                        className="relative grid h-24 place-items-center rounded-2xl"
                                        style={{ backgroundImage: t.grad }}
                                    >
                                        <span className="text-2xl text-white/85">{t.glyph}</span>
                                        <span className="vle-mono absolute bottom-1.5 right-2 text-[8px] uppercase tracking-[0.18em] text-white/60">
                                            {t.id}
                                        </span>
                                    </div>
                                    <p className="vle-serif mt-3 text-lg text-[#0A0E1A]">{t.name}</p>
                                    <p className="text-[11px] text-[#3B4252]">{t.sub}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="vle-mono text-[9px] uppercase tracking-[0.18em] text-[#6B7280]">
                                            {t.cat}
                                        </span>
                                        {i === 0 && (
                                            <span
                                                className="vle-mono rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white"
                                                style={{ background: t.accent }}
                                            >
                                                Elegida
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-8" delay={0.1}>
                        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-relaxed opacity-70">
                                El lienzo del editor y la página publicada construyen su aspecto desde el mismo módulo de
                                tema: lo que se previsualiza es literalmente lo que se publica.
                            </p>
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px]">
                                    <Monitor size={13} /> Escritorio
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] opacity-50">
                                    <Smartphone size={13} /> Móvil
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ─────────────────── SEC 05 · MÉTRICAS ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <SectionHead index="SEC 05 / El talonario" title="Nueve cifras del proyecto" align="center" />

                    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {p.metrics.map((m, i) => (
                            <Reveal key={m.label} delay={i * 0.05} direction="scale">
                                <div className="vle-ticket relative flex h-full items-stretch gap-2 p-3">
                                    <span aria-hidden className="vle-notch -left-[10px] top-1/2 -translate-y-1/2" />
                                    <span aria-hidden className="vle-notch -right-[10px] top-1/2 -translate-y-1/2" />
                                    <span
                                        aria-hidden
                                        className="vle-barcode-v w-3 shrink-0 rounded-sm opacity-70"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <CountMetric value={m.value} label={m.label} />
                                    </div>
                                    <span
                                        className="vle-vert vle-mono shrink-0 text-[8px] uppercase tracking-[0.2em]"
                                        style={{ color: "rgba(10,14,26,0.35)" }}
                                    >
                                        SEC 05·{String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─────────────────── SEC 06 · FUNCIONALIDADES ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="SEC 06 / El programa"
                        title={
                            <>
                                Diecisiete líneas <span className="brand-gradient-text">ya impresas</span>
                            </>
                        }
                        lead="El programa completo de la plataforma, tal y como está construido hoy."
                    />

                    <div className="mt-12">
                        <Ticket sec="SEC 06" stub="Programa" code="VL-PRG-1709" stubWidth="w-[58px] md:w-[78px]">
                            <Stagger stagger={0.04}>
                                {p.features.map((f, i) => (
                                    <StaggerItem key={f} y={10}>
                                        <div className="group flex items-start gap-3 border-b border-dashed border-[#0A0E1A]/15 py-2.5 last:border-0">
                                            <span className="vle-mono shrink-0 pt-0.5 text-[10px]" style={{ color: RED }}>
                                                F-{String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-[#0A0E1A]/80 md:text-sm">
                                                {f}
                                            </span>
                                            <span
                                                className="vle-mono hidden shrink-0 items-center gap-1 pt-0.5 text-[9px] uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inline-flex"
                                                style={{ color: "#15803D" }}
                                            >
                                                <Check size={11} /> Ok
                                            </span>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                        </Ticket>
                    </div>
                </div>
            </section>

            {/* ─────────────────── SEC 07 · STACK ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="SEC 07 / El fajo"
                        title={
                            <>
                                Con qué está <span className="brand-gradient-text">impreso</span>
                            </>
                        }
                    />

                    <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.07}>
                                <div className="vle-fold vle-ticket h-full p-5">
                                    <span aria-hidden className="vle-accent-bar" />
                                    <p className="vle-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: RED }}>
                                        {group.group}
                                    </p>
                                    <Barcode className="mt-2 h-5 w-16 opacity-60" />
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-md border border-[#0A0E1A]/12 bg-white/70 px-2 py-1 text-[11px] text-[#0A0E1A]/75"
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

            {/* ─────────────────── SEC 08 · EL REVERSO (arquitectura + resumen) ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="SEC 08 / El reverso"
                        title={
                            <>
                                La letra pequeña de <span className="brand-gradient-text">la arquitectura</span>
                            </>
                        }
                    />

                    <Reveal className="mt-12">
                        <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#0F1320] p-6 md:p-10">
                            <span aria-hidden className="vle-confetti absolute inset-0 opacity-40" />
                            <span aria-hidden className="vle-notch -left-[10px] top-1/2 -translate-y-1/2" />
                            <span aria-hidden className="vle-notch -right-[10px] top-1/2 -translate-y-1/2" />

                            <div className="relative">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-white/15 pb-4">
                                    <p className="vle-mono text-[10px] uppercase tracking-[0.3em] opacity-55">
                                        Condiciones de uso · reverso
                                    </p>
                                    <Barcode className="h-6 w-28 opacity-70" />
                                </div>
                                <p className="mt-6 text-sm leading-relaxed opacity-75 md:text-base">{p.architecture}</p>

                                <div className="mt-8 grid gap-3 border-t border-dashed border-white/15 pt-6 sm:grid-cols-3">
                                    {[
                                        ["src/app", "bootstrap, providers y rutas perezosas"],
                                        ["src/shared", "HTTP, UI, layouts, i18n y store"],
                                        ["src/features", "quince módulos independientes"],
                                    ].map(([dir, what]) => (
                                        <div key={dir} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                                            <p className="vle-mono text-[11px]" style={{ color: "#8FA6FF" }}>
                                                {dir}
                                            </p>
                                            <p className="mt-1 text-[11px] leading-relaxed opacity-60">{what}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Stagger className="mt-14 space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={`leading-relaxed ${
                                        i === 0 ? "text-lg opacity-90 md:text-xl" : "text-sm opacity-65 md:text-base"
                                    }`}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ─────────────────── SEC 09 · RETOS ─────────────────── */}
            <section id="retos" className="relative scroll-mt-20 px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="SEC 09 / Rasgado por la mitad"
                        title={
                            <>
                                Cinco entradas <span className="brand-gradient-text">partidas en dos</span>
                            </>
                        }
                        lead="Arriba, lo que se rompía. Abajo, lo que quedó impreso en el código."
                    />

                    <div className="mt-12 space-y-10">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="relative">
                                    {/* mitad superior: el problema */}
                                    <div className="vle-ticket relative overflow-hidden p-5 pb-8 md:p-8 md:pb-10">
                                        <span aria-hidden className="vle-perf-h bottom-0" />
                                        <span aria-hidden className="vle-notch -left-[10px] -bottom-[10px]" />
                                        <span aria-hidden className="vle-notch -right-[10px] -bottom-[10px]" />
                                        <div className="flex items-start justify-between gap-4">
                                            <p
                                                className="vle-mono text-[10px] uppercase tracking-[0.26em]"
                                                style={{ color: RED }}
                                            >
                                                Reto {String(i + 1).padStart(2, "0")} · lo que se rompía
                                            </p>
                                            <Barcode className="hidden h-5 w-20 opacity-50 sm:block" />
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed text-[#0A0E1A]/80 md:text-base">
                                            {c.problem}
                                        </p>
                                    </div>

                                    {/* mitad inferior: la solución */}
                                    <div className="vle-ticket relative mt-3 overflow-hidden p-5 pt-8 md:p-8 md:pt-10">
                                        <span aria-hidden className="vle-perf-h top-0" />
                                        <span aria-hidden className="vle-notch -left-[10px] -top-[10px]" />
                                        <span aria-hidden className="vle-notch -right-[10px] -top-[10px]" />
                                        <span aria-hidden className="vle-accent-bar" style={{ background: BLUE }} />
                                        <div className="flex items-start justify-between gap-4">
                                            <p
                                                className="vle-mono text-[10px] uppercase tracking-[0.26em]"
                                                style={{ color: BLUE }}
                                            >
                                                Cómo se resolvió
                                            </p>
                                            <span className="vle-mono text-[9px] uppercase tracking-[0.2em] text-[#0A0E1A]/35">
                                                VL-RT-{String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed text-[#0A0E1A]/80 md:text-base">
                                            {c.solution}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─────────────────── SEC 10 · LA MARCA ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="SEC 10 / El sello"
                        title={
                            <>
                                La marca <span className="brand-gradient-text">sobre papel y sobre tinta</span>
                            </>
                        }
                        lead="El infinito azul-rojo de Visionary Leaders App, en sus dos versiones y su favicon."
                    />

                    <div className="mt-10">
                        <DragRail>
                            {p.media.map((m) => {
                                const isSvg = m.src.endsWith(".svg");
                                const onPaper = m.src.includes("logo-full");
                                return (
                                    <figure
                                        key={m.src}
                                        className="w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/10 md:w-[300px]"
                                    >
                                        <div
                                            className="grid h-[124px] place-items-center px-6"
                                            style={{ background: onPaper ? PAPER : "#0F1320" }}
                                        >
                                            {isSvg ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={m.src} alt={m.caption} className="h-14 w-14" />
                                            ) : (
                                                <Image
                                                    src={m.src}
                                                    alt={m.caption}
                                                    width={300}
                                                    height={90}
                                                    className="h-auto w-full max-w-[190px] object-contain"
                                                />
                                            )}
                                        </div>
                                        <figcaption className="bg-white/[0.03] p-3 text-[11px] leading-relaxed opacity-60">
                                            {m.caption}
                                        </figcaption>
                                    </figure>
                                );
                            })}
                        </DragRail>
                        <p className="vle-mono mt-4 text-[10px] uppercase tracking-[0.2em] opacity-35">
                            Arrastra para ver las {p.media.length} piezas
                        </p>
                    </div>

                    <Reveal className="mt-14">
                        <div className="flex flex-col items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-center md:p-8">
                            {logoDark && (
                                <Image
                                    src={logoDark.src}
                                    alt={p.name}
                                    width={220}
                                    height={64}
                                    className="h-10 w-auto shrink-0"
                                />
                            )}
                            <p className="text-sm leading-relaxed opacity-70">
                                <RevealWords text={p.brand.mood} />
                            </p>
                            {favicon && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={favicon.src} alt={favicon.caption} className="h-11 w-11 shrink-0 rounded-lg" />
                            )}
                        </div>
                    </Reveal>
                </div>
            </section>

            <div className="pb-24">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Catálogo, landing por evento en subdominio, checkout confirmado por webhook y check-in offline en la puerta: si tu producto necesita esa clase de infraestructura, es exactamente el terreno que trabajo."
                />
            </div>
        </ProjectShell>
    );
};

export default Landing;
