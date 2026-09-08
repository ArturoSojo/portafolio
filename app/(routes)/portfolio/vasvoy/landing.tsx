"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    Bell,
    Bike,
    Check,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Clock,
    Compass,
    Copy,
    History,
    Home,
    LayoutDashboard,
    MapPin,
    MessageCircle,
    Navigation,
    Phone,
    Receipt,
    Search,
    Settings,
    ShoppingBag,
    Star,
    Store,
    UtensilsCrossed,
    Wallet,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { BrowserFrame, DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("vasvoy")!;
const nxt = nextProject("vasvoy");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const media = (file: string) => p.media.find((m) => m.src.endsWith(file));

const lockup = media("logo_vasvoy.png");
const mark = media("vasvoy_mark.png");

/* ─────────────────────────── Paleta del proyecto ─────────────────────────── */

const TURQ = "#2BB3A6";
const OCEAN = "#187A98";
const DEEP = "#0E3F52";
const PALM = "#2A8256";
const GOLD = "#F6BB46";
const INK = "#16242E";
const SOFT = "#5B6C7A";
const CREAM = "#CFE3E3";
const RED = "#E0574B";

/* Tema oscuro real del panel del conductor. */
const D_BG = "#0E1621";
const D_CARD = "#18222E";
const D_LINE = "#283544";
const D_TEXT = "#E8EDF2";
const D_MUTE = "#93A1B3";

/* ─────────────────────────── Datos de apoyo (rótulos) ─────────────────────── */

/** Capítulos del recorrido: son los anclajes del raíl lateral. */
const CHAPTERS = [
    { id: "vv-salida", label: "Salida" },
    { id: "vv-problema", label: "El pueblo por WhatsApp" },
    { id: "vv-roles", label: "Cuatro apps, un mapa" },
    { id: "vv-interfaz", label: "Las pantallas" },
    { id: "vv-viaje", label: "Cómo viaja un pedido" },
    { id: "vv-dinero", label: "El dinero" },
    { id: "vv-motor", label: "Bajo el capó" },
    { id: "vv-retos", label: "Los retos" },
    { id: "vv-llegada", label: "Llegada" },
];

/** Las tres caras del problema, tomadas de p.problem. */
const PAINS = [
    {
        emoji: "📞",
        title: "Se pide por chat",
        text: "Los mototaxis se coordinan por WhatsApp y llamadas: sin tarifa transparente y sin saber dónde viene el conductor.",
    },
    {
        emoji: "🕵️",
        title: "Nadie deja rastro",
        text: "Ni historial ni calificaciones, y los datos personales de todos circulando por chats privados.",
    },
    {
        emoji: "🏪",
        title: "El comercio no tiene canal",
        text: "Los negocios locales no tienen forma de recibir pedidos ni un repartidor confiable en quien apoyarse.",
    },
];

/** Los cuatro roles, tal y como los separa p.solution. */
const ROLES = [
    {
        key: "cliente",
        label: "Cliente",
        emoji: "🧍",
        x: 22,
        y: 62,
        color: TURQ,
        text: "Fija origen y destino tocando el mapa, ve la tarifa calculada por kilómetros reales de la ruta, sigue a la moto en vivo y coordina por un chat efímero que se autodestruye al terminar el viaje.",
        tags: ["Mapa y tarifa", "Seguimiento en vivo", "Chat efímero"],
    },
    {
        key: "conductor",
        label: "Conductor",
        emoji: "🛵",
        x: 47,
        y: 33,
        color: GOLD,
        text: "Se registra con un flujo KYC con fotos, es aprobado por un administrador, recibe solo las carreras dentro de un radio de 8 km ordenadas por cercanía y opera con un saldo de créditos prepago.",
        tags: ["KYC en 4 pasos", "Radio de 8 km", "Cartera prepaga"],
    },
    {
        key: "comercio",
        label: "Comercio",
        emoji: "🏪",
        x: 70,
        y: 58,
        color: PALM,
        text: "Administra su carta, horarios y pedidos desde un panel propio, con la máquina de estados del delivery y la bandera de «listo para recoger» en sus manos.",
        tags: ["Carta y horarios", "Cola de pedidos", "Créditos"],
    },
    {
        key: "admin",
        label: "Administración",
        emoji: "🖥️",
        x: 84,
        y: 26,
        color: OCEAN,
        text: "Acredita recargas, aprueba conductores y comercios, y despacha deliveries desde una consola web con dashboard de indicadores.",
        tags: ["Recargas", "Aprobaciones", "Despacho manual"],
    },
];

/** La máquina de estados real del delivery, con lo que custodia cada tramo. */
const STOPS = [
    {
        state: "pendiente",
        title: "El cliente confirma",
        guard: "Regla de Firestore",
        note: "El pedido nace con los precios del catálogo y una tarea programada lo expira si nadie lo toma: cada cinco minutos pasa una función revisando los que quedaron colgados.",
    },
    {
        state: "aceptado",
        title: "El comercio acepta",
        guard: "Función · congela la base",
        note: "Una función relee los precios reales en Firestore, valida las cantidades y congela ahí la base de la comisión. Si algún producto no se pudo verificar, el pedido queda marcado para revisión manual.",
    },
    {
        state: "en preparación",
        title: "La cocina arranca",
        guard: "Bandera independiente",
        note: "«Listo para recoger» es una bandera aparte del estado, para que el repartidor pueda ir en camino mientras la comida todavía se prepara.",
    },
    {
        state: "asignado",
        title: "Un conductor lo toma",
        guard: "Transacción atómica",
        note: "La asignación escribe solo estado, conductor y marca de tiempo dentro de una transacción, para que dos conductores no puedan tomar el mismo viaje. Las reglas exigen estar aprobado y con saldo.",
    },
    {
        state: "recogido",
        title: "Va en la moto",
        guard: "Realtime Database",
        note: "La posición se publica en posiciones/higuerote/{uid} con onDisconnect y el cliente ve la moto avanzar con un pulso animado, con la ruta trazada por OSRM.",
    },
    {
        state: "entregado",
        title: "Se cobra una sola vez",
        guard: "onDeliveryEntregado",
        note: "La comisión se descuenta dentro de una transacción que marca el pedido como cobrado. El chat se borra al entregar, y una limpieza diaria a las 3 AM barre lo que quede.",
    },
];

/** El modelo de negocio: comisión prepaga, sin intermediación de pagos. */
const MONEY = [
    {
        pct: "12%",
        who: "al conductor",
        text: "Sobre el viaje, descontado del saldo de créditos que compró por adelantado.",
    },
    {
        pct: "10%",
        who: "al comercio",
        text: "Sobre los productos, calculado siempre desde la base congelada por el servidor.",
    },
    {
        pct: "0%",
        who: "de intermediación",
        text: "El pasajero le paga al conductor y los productos al comercio: VasVoy nunca toca ese dinero.",
    },
];

/** Calles del plano estilizado: valores fijos, nada de azar en el render. */
const H_STREETS = [26, 58, 92, 126, 158, 192, 226, 258, 288];
const V_STREETS = [34, 78, 122, 168, 214, 258, 302, 348, 384];

/* ───────────────────────────────── CSS propio ─────────────────────────────── */

const css = `
.vv-ink { color: ${INK}; }
.vv-soft { color: ${SOFT}; }
.vv-grad-ink {
  background-image: linear-gradient(135deg, #0E8C82 0%, #14688A 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.vv-card {
  background: #FFFFFF;
  border: 1px solid rgba(43, 179, 166, 0.18);
  box-shadow: 0 20px 44px -30px rgba(24, 122, 152, 0.55);
}
.vv-rail {
  background-image: linear-gradient(to bottom, rgba(24, 122, 152, 0.34) 56%, rgba(0, 0, 0, 0) 0);
  background-size: 2px 11px;
  background-repeat: repeat-y;
}

@keyframes vv-drift {
  0%   { transform: translate3d(-1.6%, -1.2%, 0) scale(1.08); }
  100% { transform: translate3d(1.6%, 1.2%, 0) scale(1.08); }
}
.vv-drift { animation: vv-drift 46s ease-in-out infinite alternate; }

@keyframes vv-trace {
  0%   { stroke-dashoffset: 660; opacity: 0.95; }
  42%  { stroke-dashoffset: 0;   opacity: 0.95; }
  90%  { stroke-dashoffset: 0;   opacity: 0.95; }
  100% { stroke-dashoffset: 0;   opacity: 0; }
}
.vv-trace { stroke-dasharray: 660; animation: vv-trace 6s ease-in-out infinite; }

@keyframes vv-ants { to { stroke-dashoffset: -32; } }
.vv-ants { stroke-dasharray: 5 11; animation: vv-ants 1.1s linear infinite; }

@keyframes vv-ring {
  0%   { transform: scale(0.45); opacity: 0.85; }
  100% { transform: scale(2.2);  opacity: 0; }
}
.vv-ring { transform-box: fill-box; transform-origin: center; animation: vv-ring 2s ease-out infinite; }
.vv-ring-late { animation-delay: 0.4s; }

@keyframes vv-halo {
  0%   { transform: scale(0.4); opacity: 0.75; }
  100% { transform: scale(1.9); opacity: 0; }
}
.vv-halo { animation: vv-halo 2s ease-out infinite; }
.vv-halo-2 { animation-delay: 0.66s; }
.vv-halo-3 { animation-delay: 1.32s; }

@keyframes vv-pin-out { 0%, 70% { opacity: 1; } 74%, 94% { opacity: 0; } 100% { opacity: 1; } }
@keyframes vv-pin-in  { 0%, 70% { opacity: 0; } 74%, 94% { opacity: 1; } 100% { opacity: 0; } }
.vv-pin-out { animation: vv-pin-out 6s linear infinite; }
.vv-pin-in  { animation: vv-pin-in 6s linear infinite; opacity: 0; }

@keyframes vv-dot {
  0%, 100% { opacity: 0.28; transform: translateY(0); }
  50%      { opacity: 1;    transform: translateY(-2px); }
}
.vv-dot { animation: vv-dot 1.2s ease-in-out infinite; }
.vv-dot-2 { animation-delay: 0.2s; }
.vv-dot-3 { animation-delay: 0.4s; }

@keyframes vv-wave { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.vv-wave { animation: vv-wave 22s linear infinite; }
.vv-wave-slow { animation: vv-wave 34s linear infinite; }

@keyframes vv-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.vv-bob { animation: vv-bob 5.5s ease-in-out infinite; }

.vv-chip {
  border: 1px solid rgba(43, 179, 166, 0.32);
  background: rgba(43, 179, 166, 0.08);
  color: #0E7C74;
}
.vv-scroll-cue { animation: vv-bob 2.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .vv-drift, .vv-trace, .vv-ants, .vv-ring, .vv-halo, .vv-pin-out, .vv-pin-in,
  .vv-dot, .vv-wave, .vv-wave-slow, .vv-bob, .vv-scroll-cue {
    animation: none !important;
  }
  .vv-trace { stroke-dashoffset: 0 !important; }
  .vv-pin-in { display: none; }
}
`;

/* ───────────────────────────── Plano de fondo fijo ────────────────────────── */

/** El mapa costero que nunca se va: queda fijo detrás de todo el scroll. */
const CoastBackdrop = () => (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full vv-drift" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="vv-sea" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={TURQ} stopOpacity="0.16" />
                    <stop offset="100%" stopColor={OCEAN} stopOpacity="0.22" />
                </linearGradient>
            </defs>

            {/* vegetación */}
            <ellipse cx="72" cy="66" rx="58" ry="34" fill={PALM} opacity="0.07" />
            <ellipse cx="322" cy="112" rx="70" ry="40" fill={PALM} opacity="0.06" />
            <ellipse cx="188" cy="34" rx="52" ry="26" fill={PALM} opacity="0.05" />

            {/* trama de calles */}
            <g stroke={OCEAN} strokeOpacity="0.12" strokeWidth="0.8">
                {H_STREETS.map((y, i) => (
                    <line key={`h${y}`} x1="-10" y1={y} x2="410" y2={y + (i % 3) - 1} />
                ))}
                {V_STREETS.map((x, i) => (
                    <line key={`v${x}`} x1={x} y1="-10" x2={x + (i % 4) - 1.5} y2="310" />
                ))}
            </g>
            <g stroke={TURQ} strokeOpacity="0.2" strokeWidth="1.6" fill="none">
                <path d="M-10 148 C 90 138, 150 168, 240 152 S 350 128, 410 140" />
                <path d="M120 -10 C 132 70, 108 140, 150 220 S 178 290, 168 310" />
            </g>

            {/* costa */}
            <path d="M-10 232 C 70 220, 130 248, 214 238 S 344 216, 410 228 L410 310 L-10 310 Z" fill="url(#vv-sea)" />
            <path
                d="M-10 232 C 70 220, 130 248, 214 238 S 344 216, 410 228"
                fill="none"
                stroke={TURQ}
                strokeOpacity="0.4"
                strokeWidth="1.4"
            />
            <path
                d="M-10 242 C 70 230, 130 258, 214 248 S 344 226, 410 238"
                fill="none"
                stroke={GOLD}
                strokeOpacity="0.35"
                strokeWidth="1.2"
            />
        </svg>
    </div>
);

/* ────────────────────────── Raíl de recorrido lateral ─────────────────────── */

const RouteRail = ({ progress }: { progress: number }) => (
    <nav
        aria-label="Recorrido de la página"
        className="fixed z-40 hidden -translate-y-1/2 left-4 top-1/2 xl:block"
    >
        <div className="relative" style={{ height: 320, width: 22 }}>
            <span aria-hidden className="vv-rail absolute left-[10px] top-0 h-full w-[2px]" />
            <span
                aria-hidden
                className="absolute left-[10px] top-0 w-[2px] rounded-full"
                style={{ height: `${Math.min(100, progress * 100)}%`, backgroundImage: `linear-gradient(${TURQ}, ${OCEAN})` }}
            />
            {CHAPTERS.map((c, i) => {
                const at = i / (CHAPTERS.length - 1);
                const lit = progress >= at - 0.03;
                return (
                    <a
                        key={c.id}
                        href={`#${c.id}`}
                        className="absolute group"
                        style={{ top: `calc(${at * 100}% - 7px)`, left: 4 }}
                    >
                        <span
                            className="block transition-all duration-500 rounded-full h-3.5 w-3.5 border-2"
                            style={{
                                borderColor: lit ? TURQ : "rgba(24,122,152,0.35)",
                                background: lit ? TURQ : "#FFFFFF",
                                boxShadow: lit ? `0 0 0 4px rgba(43,179,166,0.16)` : "none",
                            }}
                        />
                        <span
                            className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                            style={{ color: OCEAN }}
                        >
                            {c.label}
                        </span>
                    </a>
                );
            })}
            <span
                aria-hidden
                className="absolute grid transition-all duration-200 rounded-full h-6 w-6 place-items-center"
                style={{
                    top: `calc(${Math.min(100, progress * 100)}% - 12px)`,
                    left: -2,
                    background: "#FFFFFF",
                    boxShadow: "0 6px 16px -6px rgba(24,122,152,0.7)",
                    color: OCEAN,
                }}
            >
                <Bike size={13} />
            </span>
        </div>
    </nav>
);

/* ─────────────────────── Mapa animado del héroe (la ruta) ─────────────────── */

const ROUTE_D = "M 58 244 C 118 228, 112 176, 172 160 S 254 138, 300 74";

const RouteCard = ({ reduce }: { reduce: boolean | null }) => (
    <div className="relative w-full overflow-hidden aspect-[4/3] rounded-[22px]">
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="vv-hero-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={TURQ} />
                    <stop offset="100%" stopColor={OCEAN} />
                </linearGradient>
                <linearGradient id="vv-hero-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#062A38" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#062A38" stopOpacity="0" />
                </linearGradient>
            </defs>

            <rect x="0" y="0" width="400" height="300" fill="url(#vv-hero-grad)" />
            <rect x="0" y="0" width="400" height="300" fill="url(#vv-hero-fade)" />

            {/* vegetación */}
            <ellipse cx="60" cy="96" rx="46" ry="28" fill={PALM} opacity="0.34" />
            <ellipse cx="330" cy="196" rx="54" ry="30" fill={PALM} opacity="0.26" />

            {/* calles al 12% */}
            <g stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1">
                {H_STREETS.map((y, i) => (
                    <line key={`hh${y}`} x1="0" y1={y} x2="400" y2={y + (i % 3) - 1} />
                ))}
                {V_STREETS.map((x, i) => (
                    <line key={`vv${x}`} x1={x} y1="0" x2={x + (i % 4) - 1.5} y2="300" />
                ))}
            </g>
            <g stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="2" fill="none">
                <path d="M0 132 C 90 122, 150 152, 240 136 S 350 112, 400 124" />
                <path d="M232 0 C 244 70, 216 140, 258 220 S 286 290, 276 300" />
            </g>

            {/* costa: dos olas del logo */}
            <path d="M0 262 C 70 250, 130 278, 214 268 S 344 246, 400 258 L400 300 L0 300 Z" fill="#0B4A5F" opacity="0.5" />
            <path d="M0 262 C 70 250, 130 278, 214 268 S 344 246, 400 258" fill="none" stroke={TURQ} strokeWidth="2.4" opacity="0.9" />
            <path d="M0 272 C 70 260, 130 288, 214 278 S 344 256, 400 268" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.85" />

            {/* la ruta */}
            <path d={ROUTE_D} fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" />
            <path
                d={ROUTE_D}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.9"
                strokeWidth="3"
                strokeLinecap="round"
                className="vv-trace"
            />
            <path
                d={ROUTE_D}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.55"
                strokeWidth="3"
                strokeLinecap="round"
                className="vv-ants"
            />

            {/* pin de origen */}
            <g>
                <circle cx="58" cy="244" r="10" fill={TURQ} fillOpacity="0.55" className="vv-ring" />
                <circle cx="58" cy="244" r="7" fill="#FFFFFF" />
                <circle cx="58" cy="244" r="4" fill={TURQ} />
            </g>

            {/* pin de destino: dorado que pasa a check verde al completarse */}
            <g>
                <circle cx="300" cy="74" r="10" fill={GOLD} fillOpacity="0.55" className="vv-ring vv-ring-late" />
                <g className="vv-pin-out">
                    <circle cx="300" cy="74" r="8" fill="#FFFFFF" />
                    <circle cx="300" cy="74" r="4.5" fill={GOLD} />
                </g>
                <g className="vv-pin-in">
                    <circle cx="300" cy="74" r="9" fill={PALM} />
                    <path
                        d="M296 74 l3 3.4 l5.4 -6.6"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </g>

            {/* la moto recorriendo la ruta */}
            <g transform="translate(58,244)">
                <g transform="translate(-9,-9)">
                    <rect x="0" y="0" width="18" height="18" rx="9" fill="#FFFFFF" />
                    <path
                        d="M5 12.4 a1.7 1.7 0 1 0 0.02 0 M13 12.4 a1.7 1.7 0 1 0 0.02 0 M6.6 12.4 h4 l1.6 -3.6 h-3.2 l-0.9 -1.7 h-2"
                        fill="none"
                        stroke={OCEAN}
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                {!reduce && (
                    <animateMotion
                        dur="6s"
                        repeatCount="indefinite"
                        path={ROUTE_D}
                        keyPoints="0;1;1"
                        keyTimes="0;0.72;1"
                        calcMode="linear"
                    />
                )}
            </g>
        </svg>

        {/* pastilla de ETA, igual que la del mapa del cliente */}
        <div className="absolute px-3 py-2 bg-white shadow-lg left-4 top-4 rounded-xl">
            <p className="text-[15px] font-extrabold leading-none" style={{ color: TURQ }}>
                7 min
            </p>
            <p className="text-[12px] leading-tight mt-0.5" style={{ color: "#718096" }}>
                3,2 km
            </p>
        </div>
    </div>
);

/* ─────────────────────────── Ola ancha del cierre ─────────────────────────── */

const WaveBand = () => (
    <div aria-hidden className="relative w-full overflow-hidden h-14 md:h-20">
        <svg
            className="absolute inset-0 w-[200%] h-full vv-wave-slow"
            viewBox="0 0 800 80"
            preserveAspectRatio="none"
        >
            <path d="M0 44 C 60 28, 140 60, 200 44 S 340 28, 400 44 S 540 60, 600 44 S 740 28, 800 44 L800 80 L0 80 Z" fill={DEEP} />
            <path
                d="M0 44 C 60 28, 140 60, 200 44 S 340 28, 400 44 S 540 60, 600 44 S 740 28, 800 44"
                fill="none"
                stroke={TURQ}
                strokeWidth="3"
            />
            <path
                d="M0 54 C 60 38, 140 70, 200 54 S 340 38, 400 54 S 540 70, 600 54 S 740 38, 800 54"
                fill="none"
                stroke={GOLD}
                strokeWidth="2.4"
                opacity="0.9"
            />
        </svg>
    </div>
);

/* ══════════════════════════════ MOCKUPS EN CSS ════════════════════════════ */

/** 1 · Home del cliente — «¿A dónde vamos?» */
const MockHome = () => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#F6F8F9", color: INK }}>
        {/* cabecera con esquinas inferiores redondeadas */}
        <div
            className="relative px-4 pt-9 pb-5 rounded-b-[26px] overflow-hidden"
            style={{ backgroundImage: `linear-gradient(135deg, ${TURQ} 0%, ${OCEAN} 100%)` }}
        >
            {mark && (
                <Image
                    src={mark.src}
                    alt=""
                    width={90}
                    height={86}
                    className="absolute -right-4 -top-2 h-[74px] w-auto opacity-[0.16]"
                />
            )}
            <div className="relative flex items-center gap-2.5">
                <span
                    className="grid h-[34px] w-[34px] place-items-center rounded-[12px] text-[11px] font-black"
                    style={{ background: GOLD, color: "#4A5568" }}
                >
                    AS
                </span>
                <div className="leading-tight">
                    <p className="text-[9px]" style={{ color: CREAM }}>
                        ¡Hola, buenas! 👋
                    </p>
                    <p className="text-[13px] font-black text-white">Arturo</p>
                </div>
            </div>
        </div>

        <div className="px-3 -mt-3">
            {/* llamado principal */}
            <div
                className="rounded-[16px] bg-white p-3.5"
                style={{ boxShadow: "0 14px 30px -18px rgba(43,179,166,0.85)" }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[13px] font-black" style={{ color: INK }}>
                            ¿A dónde vamos?
                        </p>
                        <p className="text-[8px] mt-0.5" style={{ color: "#718096" }}>
                            Toca el mapa y calculamos la tarifa
                        </p>
                    </div>
                    <span className="grid rounded-full h-7 w-7 place-items-center" style={{ background: GOLD, color: "#4A5568" }}>
                        <Navigation size={13} />
                    </span>
                </div>
            </div>

            {/* accesos */}
            <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                    { e: "🧭", t: "Mis viajes" },
                    { e: "🛍️", t: "Delivery" },
                ].map((a) => (
                    <div
                        key={a.t}
                        className="rounded-[14px] bg-white px-2.5 py-3"
                        style={{ border: "1px solid rgba(43,179,166,0.16)" }}
                    >
                        <span className="text-[17px] leading-none">{a.e}</span>
                        <p className="mt-1.5 text-[9.5px] font-extrabold" style={{ color: INK }}>
                            {a.t}
                        </p>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-[9px] font-extrabold tracking-[0.08em]" style={{ color: "#718096" }}>
                ÚLTIMO VIAJE
            </p>

            <div className="mt-1.5 rounded-[14px] bg-white p-2.5" style={{ border: "1px solid rgba(43,179,166,0.14)" }}>
                <div className="flex items-start gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-[8px]" style={{ background: "rgba(43,179,166,0.12)", color: TURQ }}>
                        <Bike size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-bold" style={{ color: INK }}>
                            Av. Principal → Playa Los Totumos
                        </p>
                        <p className="text-[7.5px] mt-0.5" style={{ color: "#718096" }}>
                            Ayer · 3,2 km · Moto
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black" style={{ color: OCEAN }}>
                            Bs 168,00
                        </p>
                        <p className="flex items-center justify-end gap-0.5 text-[7.5px]" style={{ color: GOLD }}>
                            <Star size={7} fill={GOLD} /> 5,0
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* barra de carrito activa */}
        <div
            className="absolute inset-x-0 bottom-0 px-3 py-2.5"
            style={{ backgroundImage: `linear-gradient(135deg, ${TURQ} 0%, ${OCEAN} 100%)` }}
        >
            <div className="flex items-center gap-2">
                <span className="text-[14px] leading-none">🍔</span>
                <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-[9px] font-black text-white">Arepera La Costa</p>
                    <p className="text-[7.5px]" style={{ color: CREAM }}>
                        3 artículos · Bs 742,50
                    </p>
                </div>
                <span className="rounded-full px-2 py-1 text-[7.5px] font-bold" style={{ background: GOLD, color: "#4A5568" }}>
                    Ver carta
                </span>
                <span className="text-[7.5px] font-semibold" style={{ color: CREAM }}>
                    Vaciar
                </span>
            </div>
        </div>
    </div>
);

/** 2 · Mapa del cliente — buscando conductor */
const MockSearch = () => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#E9EFF1" }}>
        {/* el mapa */}
        <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect x="0" y="0" width="200" height="400" fill="#EDF2F3" />
            <ellipse cx="40" cy="90" rx="46" ry="30" fill={PALM} opacity="0.1" />
            <ellipse cx="168" cy="220" rx="50" ry="34" fill={PALM} opacity="0.09" />
            <g stroke="#B7C7CE" strokeWidth="1.1">
                {[30, 64, 98, 132, 166, 200, 234, 268, 302, 336].map((y, i) => (
                    <line key={y} x1="-10" y1={y} x2="210" y2={y + (i % 3) - 1} />
                ))}
                {[24, 62, 100, 140, 178].map((x, i) => (
                    <line key={x} x1={x} y1="-10" x2={x + (i % 3) - 1} y2="410" />
                ))}
            </g>
            <path d="M-10 316 C 40 306, 90 330, 140 320 S 200 306, 210 314 L210 410 L-10 410 Z" fill={TURQ} opacity="0.16" />
            <path d="M-10 316 C 40 306, 90 330, 140 320 S 200 306, 210 314" fill="none" stroke={TURQ} strokeWidth="1.6" opacity="0.55" />

            {/* ruta OSRM */}
            <path
                d="M48 288 C 78 262, 74 214, 106 190 S 150 148, 148 108"
                fill="none"
                stroke={OCEAN}
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="0.9"
            />
            {/* motos cercanas */}
            {[
                [70, 240],
                [124, 246],
                [92, 158],
            ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                    <circle cx={x} cy={y} r="7" fill={TURQ} opacity="0.16" />
                    <circle cx={x} cy={y} r="3.4" fill={TURQ} />
                </g>
            ))}
            {/* origen y destino */}
            <circle cx="48" cy="288" r="10" fill={TURQ} fillOpacity="0.45" className="vv-ring" />
            <circle cx="48" cy="288" r="6" fill="#FFFFFF" />
            <circle cx="48" cy="288" r="3.4" fill={TURQ} />
            <circle cx="148" cy="108" r="10" fill={GOLD} fillOpacity="0.45" className="vv-ring vv-ring-late" />
            <circle cx="148" cy="108" r="6" fill="#FFFFFF" />
            <circle cx="148" cy="108" r="3.4" fill={GOLD} />
        </svg>

        {/* pastilla flotante de ETA */}
        <div className="absolute px-2.5 py-1.5 bg-white shadow-md left-3 top-10 rounded-xl">
            <p className="text-[11px] font-extrabold leading-none" style={{ color: TURQ }}>
                7 min
            </p>
            <p className="text-[8.5px] leading-tight mt-0.5" style={{ color: "#718096" }}>
                3,2 km
            </p>
        </div>

        {/* hoja inferior */}
        <div
            className="absolute inset-x-0 bottom-0 rounded-t-[26px] px-4 pt-2.5 pb-4"
            style={{ backgroundImage: `linear-gradient(135deg, ${TURQ} 0%, ${OCEAN} 100%)` }}
        >
            <span className="mx-auto block h-1 w-9 rounded-full bg-white/40" />

            <div className="flex items-center gap-3 mt-3">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center">
                    <span className="absolute inset-0 rounded-full vv-halo bg-white/35" />
                    <span className="absolute inset-0 rounded-full vv-halo vv-halo-2 bg-white/30" />
                    <span className="absolute inset-0 rounded-full vv-halo vv-halo-3 bg-white/25" />
                    <span className="relative grid rounded-full h-6 w-6 place-items-center bg-white/90" style={{ color: OCEAN }}>
                        <Bike size={12} />
                    </span>
                </span>
                <div className="min-w-0">
                    <p className="text-[13px] font-black leading-tight text-white">Buscando tu VasVoy…</p>
                    <p className="text-[8.5px] leading-snug text-white/70">Conectando con motos cercanas en Higuerote</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <span className="flex gap-1.5">
                    <span className="h-[7px] w-[7px] rounded-full bg-white vv-dot" />
                    <span className="h-[7px] w-[7px] rounded-full bg-white vv-dot vv-dot-2" />
                    <span className="h-[7px] w-[7px] rounded-full bg-white vv-dot vv-dot-3" />
                </span>
                <span className="text-[9px] font-semibold text-white/70">Cancelar</span>
            </div>
        </div>
    </div>
);

/** 3 · Panel del conductor — carreras cercanas (tema oscuro real de la app) */
const MockDriver = () => {
    const [online, setOnline] = useState(true);

    return (
        <div className="absolute inset-0 overflow-hidden" style={{ background: D_BG, color: D_TEXT }}>
            {/* cabecera */}
            <div className="flex items-center gap-2 px-3 pt-9">
                <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-black text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, #6FD6CB, ${TURQ})` }}
                >
                    LM
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-[11px] font-black">Hola, Luis</p>
                    <p className="text-[8px]" style={{ color: D_MUTE }}>
                        Higuerote
                    </p>
                </div>
                <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black"
                    style={{ backgroundImage: `linear-gradient(135deg, ${GOLD}, #E2A22F)`, color: "#4A5568" }}
                >
                    <Wallet size={9} /> Bs 1.240,00
                </span>
            </div>

            {/* interruptor de disponibilidad */}
            <button
                type="button"
                onClick={() => setOnline((v) => !v)}
                className="mx-3 mt-3 flex w-[calc(100%-24px)] items-center justify-between rounded-[14px] px-3 py-2.5 text-left transition-all duration-500"
                style={
                    online
                        ? {
                              backgroundImage: `linear-gradient(135deg, ${PALM}, #1E6642)`,
                              boxShadow: "0 10px 26px -12px rgba(42,130,86,0.9)",
                          }
                        : { background: D_CARD, border: `1px solid ${D_LINE}` }
                }
            >
                <span>
                    <span className="block text-[10px] font-black">{online ? "Estás disponible" : "No disponible"}</span>
                    <span className="block text-[7.5px]" style={{ color: online ? "rgba(255,255,255,0.75)" : D_MUTE }}>
                        {online ? "Recibiendo carreras a 8 km" : "Toca para empezar a recibir"}
                    </span>
                </span>
                <span
                    className="relative h-5 w-9 rounded-full transition-colors duration-500"
                    style={{ background: online ? "rgba(255,255,255,0.35)" : "#2E3B4A" }}
                >
                    <span
                        className="absolute top-[3px] h-[14px] w-[14px] rounded-full bg-white transition-all duration-500"
                        style={{ left: online ? 19 : 3 }}
                    />
                </span>
            </button>

            <p className="px-3 mt-3 text-[9px] font-extrabold" style={{ color: "#6FD6CB" }}>
                Carreras cercanas (2)
            </p>

            <div className="px-3 mt-2 space-y-2">
                {[
                    {
                        delivery: false,
                        from: "Calle Bolívar #12",
                        to: "Playa Los Totumos",
                        km: "1,2",
                        price: "Bs 168,00",
                    },
                    {
                        delivery: true,
                        from: "Arepera La Costa",
                        to: "Res. Mar Azul, torre B",
                        km: "0,8",
                        price: "Bs 96,00",
                    },
                ].map((o) => (
                    <div
                        key={o.to}
                        className="rounded-[12px] p-2.5"
                        style={{
                            background: D_CARD,
                            border: `1px solid ${D_LINE}`,
                            borderLeft: `3px solid ${o.delivery ? GOLD : TURQ}`,
                        }}
                    >
                        <div className="flex items-center justify-between">
                            {o.delivery ? (
                                <span
                                    className="rounded px-1.5 py-0.5 text-[6.5px] font-black tracking-[0.12em]"
                                    style={{ background: "rgba(246,187,70,0.18)", color: GOLD }}
                                >
                                    DELIVERY
                                </span>
                            ) : (
                                <span className="text-[6.5px] font-black tracking-[0.12em]" style={{ color: TURQ }}>
                                    CARRERA
                                </span>
                            )}
                            <span className="text-[9px] font-black">{o.price}</span>
                        </div>

                        <div className="mt-1.5 space-y-1">
                            <p className="flex items-center gap-1 text-[8px]">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: TURQ }} />
                                <span className="truncate">{o.from}</span>
                            </p>
                            <p className="flex items-center gap-1 text-[8px]">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
                                <span className="truncate">{o.to}</span>
                            </p>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between text-[7.5px]" style={{ color: D_MUTE }}>
                            <span className="inline-flex items-center gap-1">
                                <MapPin size={8} /> A {o.km} km de ti
                            </span>
                            <span className="inline-flex items-center gap-0.5" style={{ color: "#6FD6CB" }}>
                                Ver punto <ChevronRight size={8} />
                            </span>
                        </div>

                        <div
                            className="mt-2 rounded-[9px] py-1.5 text-center text-[9px] font-black"
                            style={{ background: GOLD, color: "#4A5568" }}
                        >
                            Aceptar carrera
                        </div>
                    </div>
                ))}
            </div>

            {/* barra de pestañas */}
            <div
                className="absolute inset-x-0 bottom-0 flex items-center justify-around py-2.5"
                style={{ background: D_BG, borderTop: `1px solid ${D_LINE}` }}
            >
                {[
                    { Icon: ClipboardList, on: true },
                    { Icon: Bike, on: false },
                    { Icon: Wallet, on: false },
                    { Icon: Settings, on: false },
                ].map(({ Icon, on }, i) => (
                    <Icon key={i} size={14} style={{ color: on ? "#6FD6CB" : D_MUTE }} />
                ))}
            </div>
        </div>
    );
};

/** 4 · Seguimiento del delivery — cliente */
const STEPS = [
    { label: "Confirmando", Icon: Receipt },
    { label: "Preparando tu pedido", Icon: UtensilsCrossed },
    { label: "Buscando repartidor", Icon: Search },
    { label: "En camino", Icon: Bike },
    { label: "Entregado", Icon: Home },
];

const MockDelivery = () => (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#EDF2F3", color: INK }}>
        {/* mapa de fondo */}
        <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect x="0" y="0" width="200" height="400" fill="#EDF2F3" />
            <g stroke="#B7C7CE" strokeWidth="1.1">
                {[26, 60, 94, 128, 162].map((y) => (
                    <line key={y} x1="-10" y1={y} x2="210" y2={y} />
                ))}
                {[30, 74, 118, 162].map((x) => (
                    <line key={x} x1={x} y1="-10" x2={x} y2="200" />
                ))}
            </g>
            <path d="M40 150 C 66 122, 92 118, 118 84" fill="none" stroke={OCEAN} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <circle cx="40" cy="150" r="9" fill={PALM} fillOpacity="0.45" />
            <circle cx="40" cy="150" r="5" fill={PALM} />
            <circle cx="118" cy="84" r="9" fill={GOLD} fillOpacity="0.45" className="vv-ring" />
            <circle cx="118" cy="84" r="5" fill={GOLD} />
            <circle cx="78" cy="118" r="7" fill={TURQ} fillOpacity="0.4" className="vv-ring vv-ring-late" />
            <circle cx="78" cy="118" r="4" fill={TURQ} />
        </svg>

        {/* hoja arrastrable */}
        <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-white px-3 pt-2 pb-3 shadow-[0_-18px_40px_-24px_rgba(24,122,152,0.7)]">
            <span className="mx-auto block h-1 w-9 rounded-full" style={{ background: "#D3DDE2" }} />

            <span
                className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[7.5px] font-bold"
                style={{ background: "rgba(42,130,86,0.12)", color: PALM }}
            >
                <Check size={8} /> Pedido listo
            </span>

            {/* línea de cinco pasos */}
            <div className="relative mt-2.5 pl-1">
                {STEPS.map((s, i) => {
                    const done = i < 3;
                    const current = i === 3;
                    return (
                        <div key={s.label} className="relative flex items-start gap-2 pb-2 last:pb-0">
                            {i < STEPS.length - 1 && (
                                <span
                                    className="absolute left-[9px] top-[18px] w-[1.5px]"
                                    style={{ height: 12, background: done ? TURQ : "#DCE4E8" }}
                                />
                            )}
                            <span
                                className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
                                style={
                                    done
                                        ? { background: TURQ, color: "#FFFFFF" }
                                        : current
                                        ? { background: "rgba(43,179,166,0.14)", color: TURQ, border: `1.5px solid ${TURQ}` }
                                        : { background: "#FFFFFF", color: "#B7C7CE", border: "1.5px solid #DCE4E8" }
                                }
                            >
                                {done ? <Check size={9} /> : <s.Icon size={9} />}
                            </span>
                            <p
                                className="text-[8.5px] leading-[18px]"
                                style={{
                                    color: current ? INK : done ? "#5B6C7A" : "#A9B7C0",
                                    fontWeight: current ? 800 : 500,
                                }}
                            >
                                {s.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* repartidor y contacto */}
            <div className="mt-2 rounded-[12px] p-2" style={{ background: "#F6F8F9" }}>
                <div className="flex items-center gap-2">
                    <span
                        className="grid h-6 w-6 place-items-center rounded-full text-[8px] font-black text-white"
                        style={{ backgroundImage: `linear-gradient(135deg, #6FD6CB, ${TURQ})` }}
                    >
                        LM
                    </span>
                    <div className="flex-1 leading-tight">
                        <p className="text-[8.5px] font-extrabold">Luis M. · Moto roja</p>
                        <p className="text-[7px]" style={{ color: "#718096" }}>
                            A 4 min de tu dirección
                        </p>
                    </div>
                    <span className="relative grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(43,179,166,0.14)", color: TURQ }}>
                        <MessageCircle size={11} />
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full" style={{ background: RED }} />
                    </span>
                    <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(24,122,152,0.12)", color: OCEAN }}>
                        <Phone size={11} />
                    </span>
                </div>
            </div>

            {/* pago móvil al comercio */}
            <div className="mt-2 rounded-[12px] p-2" style={{ border: "1px solid rgba(43,179,166,0.2)" }}>
                {[
                    ["Banco", "0102 · Venezuela"],
                    ["Cédula", "V-18.402.115"],
                    ["Teléfono", "0414-8624450"],
                ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-[3px]">
                        <span className="text-[7px]" style={{ color: "#718096" }}>
                            {k}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[7.5px] font-semibold">
                            {v} <Copy size={8} style={{ color: TURQ }} />
                        </span>
                    </div>
                ))}
                <div className="mt-1 flex items-end justify-between border-t pt-1.5" style={{ borderColor: "#EDF2F3" }}>
                    <span className="text-[6.5px] font-black tracking-[0.1em]" style={{ color: "#718096" }}>
                        MONTO A PAGAR
                    </span>
                    <span className="text-[12px] font-black" style={{ color: OCEAN }}>
                        Bs 742,50
                    </span>
                </div>
                <p className="mt-1 text-[6.5px] leading-snug" style={{ color: "#8A98A4" }}>
                    Los productos se los pagas al comercio; el envío, al repartidor.
                </p>
            </div>

            {/* detalle de compra */}
            <div className="mt-2 space-y-[3px]">
                {[
                    ["2× Hamburguesa", "Bs 520,00"],
                    ["1× Refresco 1,5 L", "Bs 142,50"],
                    ["Envío", "Bs 80,00"],
                ].map(([k, v], i) => (
                    <div key={k} className="flex items-center justify-between text-[7.5px]">
                        <span style={{ color: i === 2 ? "#718096" : INK }}>{k}</span>
                        <span className="font-semibold">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/** 5 · Panel del comercio — cola de pedidos (web y Android) */
const MockComercio = () => {
    const [open, setOpen] = useState(true);

    return (
        <div className="min-w-[620px]" style={{ background: "#F6F8F9", color: INK }}>
            {/* barra superior */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white" style={{ borderBottom: "1px solid #E4EBEE" }}>
                <span className="grid h-7 w-7 place-items-center rounded-[9px] text-[13px]" style={{ background: "rgba(43,179,166,0.12)" }}>
                    🍔
                </span>
                <div className="leading-tight">
                    <p className="text-[12px] font-black">Arepera La Costa</p>
                    <p className="text-[9px]" style={{ color: "#718096" }}>
                        Higuerote · Comida rápida
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="ml-2 rounded-full px-2.5 py-1 text-[9px] font-bold transition-colors duration-300"
                    style={
                        open
                            ? { background: "rgba(42,130,86,0.12)", color: PALM }
                            : { background: "rgba(224,87,75,0.12)", color: RED }
                    }
                >
                    {open ? "● Abierto" : "● Cerrado"}
                </button>

                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black" style={{ background: "rgba(246,187,70,0.18)", color: "#946510" }}>
                    <Wallet size={11} /> Créditos: Bs 310,00
                </span>
            </div>

            {/* tres columnas de la cola */}
            <div className="grid grid-cols-3 gap-3 p-3">
                {[
                    {
                        group: "Nuevos",
                        color: TURQ,
                        count: 1,
                        cards: [
                            {
                                time: "12:04",
                                code: "#A-2291",
                                items: [
                                    ["2×", "Hamburguesa", "sin cebolla, por favor"],
                                    ["1×", "Refresco 1,5 L", ""],
                                ],
                                address: "Res. Mar Azul, torre B, apto 4-C",
                                ref: "Portón azul, frente a la plaza",
                                totals: [
                                    ["Productos", "Bs 662,50"],
                                    ["Envío", "Bs 80,00"],
                                ],
                                pm: "Referencia 004417832",
                                actions: ["Aceptar", "Rechazar"],
                                warn: "",
                            },
                        ],
                    },
                    {
                        group: "En preparación",
                        color: GOLD,
                        count: 1,
                        cards: [
                            {
                                time: "11:52",
                                code: "#A-2290",
                                items: [
                                    ["1×", "Pabellón criollo", "para llevar"],
                                    ["2×", "Tequeños (6 u.)", ""],
                                ],
                                address: "Calle Bolívar #12",
                                ref: "Casa blanca, reja negra",
                                totals: [
                                    ["Productos", "Bs 940,00"],
                                    ["Envío", "Bs 80,00"],
                                ],
                                pm: "",
                                actions: ["Listo para recoger"],
                                warn: "",
                            },
                        ],
                    },
                    {
                        group: "En reparto",
                        color: PALM,
                        count: 1,
                        cards: [
                            {
                                time: "11:31",
                                code: "#A-2288",
                                items: [["3×", "Empanada de cazón", ""]],
                                address: "Playa Los Totumos, kiosco 3",
                                ref: "Preguntar por Ana",
                                totals: [
                                    ["Productos", "Bs 285,00"],
                                    ["Envío", "Bs 90,00"],
                                ],
                                pm: "",
                                actions: [],
                                warn: "Créditos insuficientes para la comisión estimada: recarga para aceptar nuevos pedidos.",
                            },
                        ],
                    },
                ].map((col) => (
                    <div key={col.group}>
                        <p className="mb-2 flex items-center gap-1.5 text-[9px] font-extrabold tracking-[0.1em] uppercase" style={{ color: "#718096" }}>
                            <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
                            {col.group}
                            <span className="rounded-full px-1.5 py-[1px] text-[8px] text-white" style={{ background: col.color }}>
                                {col.count}
                            </span>
                        </p>

                        {col.cards.map((c) => (
                            <div
                                key={c.code}
                                className="rounded-[12px] bg-white p-2.5"
                                style={{ border: "1px solid #E4EBEE", boxShadow: "0 12px 24px -20px rgba(24,122,152,0.6)" }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black">
                                        <Clock size={9} style={{ color: "#718096" }} /> {c.time}
                                    </span>
                                    <span className="text-[9px] font-bold" style={{ color: OCEAN }}>
                                        {c.code}
                                    </span>
                                </div>

                                <div className="mt-1.5 space-y-1">
                                    {c.items.map(([q, n, note]) => (
                                        <div key={n} className="leading-tight">
                                            <p className="text-[9px] font-semibold">
                                                <span style={{ color: TURQ }}>{q}</span> {n}
                                            </p>
                                            {note && (
                                                <p className="text-[7.5px] italic" style={{ color: "#8A98A4" }}>
                                                    “{note}”
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-1.5 rounded-[8px] px-2 py-1.5" style={{ background: "#F6F8F9" }}>
                                    <p className="text-[8px] font-semibold">{c.address}</p>
                                    <p className="text-[7px]" style={{ color: "#8A98A4" }}>
                                        {c.ref}
                                    </p>
                                </div>

                                <div className="mt-1.5 space-y-[2px]">
                                    {c.totals.map(([k, v]) => (
                                        <div key={k} className="flex items-center justify-between text-[8px]">
                                            <span style={{ color: "#718096" }}>{k}</span>
                                            <span className="font-bold">{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {c.pm && (
                                    <div className="mt-1.5 rounded-[8px] px-2 py-1.5" style={{ background: "rgba(43,179,166,0.09)" }}>
                                        <p className="text-[7.5px] font-semibold" style={{ color: OCEAN }}>
                                            Pago móvil reportado · {c.pm}
                                        </p>
                                        <p className="mt-1 rounded-[6px] py-1 text-center text-[8px] font-bold text-white" style={{ background: TURQ }}>
                                            Confirmar que me llegó
                                        </p>
                                    </div>
                                )}

                                {c.actions.length > 0 && (
                                    <div className="flex gap-1.5 mt-2">
                                        {c.actions.map((a, i) => (
                                            <span
                                                key={a}
                                                className="flex-1 rounded-[8px] py-1 text-center text-[8.5px] font-bold"
                                                style={
                                                    i === 0
                                                        ? { background: GOLD, color: "#4A5568" }
                                                        : { border: "1px solid #E4EBEE", color: "#8A98A4" }
                                                }
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {c.warn && (
                                    <div className="mt-2 rounded-[8px] px-2 py-1.5" style={{ background: "rgba(224,87,75,0.1)" }}>
                                        <p className="text-[7.5px] leading-snug" style={{ color: "#A8382E" }}>
                                            {c.warn}
                                        </p>
                                        <p className="mt-1 rounded-[6px] py-1 text-center text-[8px] font-bold" style={{ background: "#E9EFF1", color: "#A9B7C0" }}>
                                            Aceptar
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* navegación de cinco destinos */}
            <div className="flex items-center justify-around px-4 py-2 bg-white" style={{ borderTop: "1px solid #E4EBEE" }}>
                {[
                    { Icon: Bell, label: "Pedidos", on: true, badge: 1 },
                    { Icon: UtensilsCrossed, label: "Carta", on: false, badge: 0 },
                    { Icon: History, label: "Historial", on: false, badge: 0 },
                    { Icon: Wallet, label: "Créditos", on: false, badge: 0 },
                    { Icon: Settings, label: "Ajustes", on: false, badge: 0 },
                ].map(({ Icon, label, on, badge }) => (
                    <span key={label} className="relative inline-flex flex-col items-center gap-0.5" style={{ color: on ? TURQ : "#A9B7C0" }}>
                        <Icon size={13} />
                        <span className="text-[8px] font-semibold">{label}</span>
                        {badge > 0 && (
                            <span className="absolute -right-1.5 -top-1 grid h-3 w-3 place-items-center rounded-full text-[6.5px] font-black text-white" style={{ background: RED }}>
                                {badge}
                            </span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
};

/* ══════════════════════════════════ LANDING ═══════════════════════════════ */

const Landing = () => {
    const reduce = useReducedMotion();

    /* progreso global: alimenta el raíl lateral del recorrido */
    const { scrollYProgress } = useScroll();
    const [progress, setProgress] = useState(0);
    useEffect(() => scrollYProgress.on("change", setProgress), [scrollYProgress]);

    /* progreso local de la sección de estados: la moto avanza parada a parada */
    const stopsRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: rideRaw } = useScroll({ target: stopsRef, offset: ["start 70%", "end 80%"] });
    const [ride, setRide] = useState(0);
    useEffect(() => rideRaw.on("change", setRide), [rideRaw]);

    const [role, setRole] = useState(0);
    const [openChallenge, setOpenChallenge] = useState<number | null>(0);

    const activeRole = ROLES[role];

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>
            <CoastBackdrop />
            <RouteRail progress={progress} />

            <div className="relative z-10">
                {/* ════════════════════ HÉROE ════════════════════ */}
                <section id="vv-salida" className="px-4 pt-24 pb-16 md:px-6 md:pt-32 md:pb-24">
                    <div className="mx-auto max-w-6xl">
                        <div
                            className="relative overflow-hidden rounded-[26px] md:rounded-[34px]"
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${TURQ} 0%, ${OCEAN} 100%)`,
                                boxShadow: "0 46px 100px -50px rgba(24,122,152,0.9)",
                            }}
                        >
                            {/* trama de calles del panel */}
                            <svg
                                aria-hidden
                                className="absolute inset-0 w-full h-full"
                                viewBox="0 0 400 300"
                                preserveAspectRatio="xMidYMid slice"
                            >
                                <g stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="1">
                                    {H_STREETS.map((y, i) => (
                                        <line key={`ph${y}`} x1="0" y1={y} x2="400" y2={y + (i % 3) - 1} />
                                    ))}
                                    {V_STREETS.map((x, i) => (
                                        <line key={`pv${x}`} x1={x} y1="0" x2={x + (i % 4) - 1.5} y2="300" />
                                    ))}
                                </g>
                                <ellipse cx="40" cy="250" rx="70" ry="40" fill={PALM} opacity="0.24" />
                            </svg>

                            <div className="relative grid gap-8 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-10 md:px-12 md:py-14">
                                <div>
                                    {mark && (
                                        <span
                                            className="inline-grid rounded-[22px] bg-white p-3 place-items-center vv-bob"
                                            style={{ boxShadow: "0 18px 40px -22px rgba(4,40,52,0.8)" }}
                                        >
                                            <Image
                                                src={mark.src}
                                                alt={`${p.name} — isotipo`}
                                                width={140}
                                                height={134}
                                                priority
                                                className="w-auto h-12 md:h-16"
                                            />
                                        </span>
                                    )}

                                    <h1 className="mt-6 text-4xl font-black leading-[1.02] text-white md:text-6xl">
                                        <RevealWords text="VasVoy" />
                                    </h1>
                                    <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.24em]" style={{ color: CREAM }}>
                                        Viajes y delivery — Higuerote
                                    </p>

                                    <p className="max-w-xl mt-5 text-base leading-relaxed text-white/85 md:text-lg">{p.tagline}</p>

                                    <p className="max-w-xl mt-4 text-sm leading-relaxed text-white/70">
                                        En un pueblo costero donde la movilidad se resuelve por WhatsApp, aquí hay tarifa, ruta y
                                        rastro.
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-7">
                                        {[p.category, p.year].map((t) => (
                                            <span
                                                key={t}
                                                className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                                                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.32)" }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="mt-4 text-xs leading-relaxed text-white/60">{p.role}</p>

                                    <div className="flex flex-wrap items-center gap-3 mt-6">
                                        <span
                                            className="inline-flex max-w-full items-start gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] leading-snug"
                                            style={{ background: "rgba(255,255,255,0.14)", color: "#FFFFFF" }}
                                        >
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: GOLD }} />
                                            <span className="text-white/85">{p.status}</span>
                                        </span>

                                        {p.links.play && (
                                            <BrandButton href={p.links.play}>
                                                <ShoppingBag size={16} /> Google Play
                                            </BrandButton>
                                        )}
                                        {p.links.web && (
                                            <BrandButton href={p.links.web} variant="outline">
                                                <Compass size={16} /> Ver el sitio
                                            </BrandButton>
                                        )}
                                        {p.links.github && (
                                            <BrandButton href={p.links.github} variant="outline">
                                                <LayoutDashboard size={16} /> Código
                                            </BrandButton>
                                        )}
                                    </div>
                                </div>

                                <RouteCard reduce={reduce} />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-8 text-xs uppercase tracking-[0.28em] vv-soft">
                            <span>Empieza el recorrido</span>
                            <ChevronDown size={14} className="vv-scroll-cue" />
                        </div>
                    </div>
                </section>

                {/* ════════════════════ PROBLEMA ════════════════════ */}
                <section id="vv-problema" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="01 / El punto de partida"
                                title={
                                    <>
                                        El pueblo se mueve <span className="vv-grad-ink">por WhatsApp</span>
                                    </>
                                }
                                lead="Higuerote, municipio Brión, estado Miranda. No hay plataforma formal de transporte ni de delivery: hay chats."
                            />
                        </div>

                        <Stagger className="grid gap-4 mt-10 md:grid-cols-3" stagger={0.12}>
                            {PAINS.map((pain) => (
                                <StaggerItem key={pain.title} y={40}>
                                    <div className="h-full p-5 vv-card rounded-[20px] md:p-6">
                                        <span className="text-2xl leading-none">{pain.emoji}</span>
                                        <h3 className="mt-3 text-base font-extrabold vv-ink">{pain.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed vv-soft">{pain.text}</p>
                                    </div>
                                </StaggerItem>
                            ))}
                        </Stagger>

                        <div className="grid gap-4 mt-4 lg:grid-cols-[1fr_1fr]">
                            <Reveal direction="right">
                                <div className="h-full p-6 rounded-[20px] md:p-8" style={{ background: "rgba(255,255,255,0.72)", border: "1px dashed rgba(24,122,152,0.28)" }}>
                                    <p className="text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: RED }}>
                                        El problema completo
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed vv-soft md:text-[15px]">{p.problem}</p>
                                </div>
                            </Reveal>

                            <Reveal direction="left" delay={0.1}>
                                <div
                                    className="h-full p-6 rounded-[20px] md:p-8"
                                    style={{ backgroundImage: `linear-gradient(150deg, ${OCEAN}, ${DEEP})`, color: "#FFFFFF" }}
                                >
                                    <p className="text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: GOLD }}>
                                        La solución
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-[15px]">{p.solution}</p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ════════════════════ CUATRO ROLES ════════════════════ */}
                <section id="vv-roles" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="02 / Los roles"
                                title={
                                    <>
                                        Cuatro apps, <span className="vv-grad-ink">un mismo mapa</span>
                                    </>
                                }
                                lead="Un monorepo Flutter con cuatro aplicaciones y dos paquetes compartidos, todas sobre el mismo proyecto Firebase."
                            />
                        </div>

                        <div className="grid gap-6 mt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            {/* el plano con los cuatro pines */}
                            <Reveal direction="right">
                                <div
                                    className="relative w-full overflow-hidden rounded-[22px] aspect-[4/3]"
                                    style={{ backgroundImage: `linear-gradient(140deg, ${TURQ}, ${OCEAN})` }}
                                >
                                    <svg aria-hidden className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                                        <g stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1">
                                            {H_STREETS.map((y, i) => (
                                                <line key={`rh${y}`} x1="0" y1={y} x2="400" y2={y + (i % 3) - 1} />
                                            ))}
                                            {V_STREETS.map((x, i) => (
                                                <line key={`rv${x}`} x1={x} y1="0" x2={x + (i % 4) - 1.5} y2="300" />
                                            ))}
                                        </g>
                                        <ellipse cx="72" cy="70" rx="52" ry="30" fill={PALM} opacity="0.3" />
                                        <path d="M0 268 C 70 256, 130 284, 214 274 S 344 252, 400 264 L400 300 L0 300 Z" fill="#0B4A5F" opacity="0.5" />
                                        <path d="M0 268 C 70 256, 130 284, 214 274 S 344 252, 400 264" fill="none" stroke={TURQ} strokeWidth="2.4" />
                                        <path d="M0 278 C 70 266, 130 294, 214 284 S 344 262, 400 274" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.9" />
                                    </svg>

                                    {ROLES.map((r, i) => {
                                        const on = i === role;
                                        return (
                                            <button
                                                key={r.key}
                                                type="button"
                                                onMouseEnter={() => setRole(i)}
                                                onFocus={() => setRole(i)}
                                                onClick={() => setRole(i)}
                                                aria-label={r.label}
                                                aria-pressed={on}
                                                className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500"
                                                style={{ left: `${r.x}%`, top: `${r.y}%`, opacity: on ? 1 : 0.4 }}
                                            >
                                                <span className="relative grid place-items-center h-11 w-11">
                                                    {on && <span className="absolute inset-0 rounded-full vv-halo" style={{ background: "rgba(255,255,255,0.4)" }} />}
                                                    <span
                                                        className="relative grid rounded-full h-9 w-9 place-items-center text-[15px] transition-transform duration-500"
                                                        style={{
                                                            background: "#FFFFFF",
                                                            transform: on ? "scale(1.12)" : "scale(1)",
                                                            boxShadow: on ? `0 0 0 3px ${r.color}` : "0 4px 10px -6px rgba(0,0,0,0.6)",
                                                        }}
                                                    >
                                                        {r.emoji}
                                                    </span>
                                                </span>
                                                <span
                                                    className="mt-1 block rounded-full px-2 py-0.5 text-[10px] font-black whitespace-nowrap"
                                                    style={{ background: on ? r.color : "rgba(255,255,255,0.85)", color: on ? "#0B2A36" : "#4A5568" }}
                                                >
                                                    {r.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Reveal>

                            <Reveal direction="left" delay={0.08}>
                                <div className="p-6 vv-card rounded-[20px] md:p-8">
                                    <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: activeRole.color === GOLD ? "#946510" : activeRole.color }}>
                                        App {role + 1} de 4
                                    </p>
                                    <h3 className="mt-2 text-2xl font-black vv-ink md:text-3xl">{activeRole.label}</h3>
                                    <p className="mt-3 text-sm leading-relaxed vv-soft md:text-[15px]">{activeRole.text}</p>
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {activeRole.tags.map((t) => (
                                            <span key={t} className="vv-chip rounded-full px-2.5 py-1 text-[11px] font-bold">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mt-5 text-[11px] leading-relaxed" style={{ color: "#8A98A4" }}>
                                        Pasa el cursor por los pines del plano para cambiar de rol. Las cuatro apps comparten
                                        brio_core y brio_ui.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ════════════════════ HIGHLIGHTS ════════════════════ */}
                <section className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="03 / Lo que sostiene el viaje"
                                title={
                                    <>
                                        Seis piezas que <span className="vv-grad-ink">no se pueden caer</span>
                                    </>
                                }
                            />
                        </div>

                        <Stagger className="grid gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
                            {p.highlights.map((h, i) => {
                                const Icon = iconOf(h.icon);
                                const tone = [TURQ, GOLD, OCEAN, PALM, TURQ, GOLD][i % 6];
                                return (
                                    <StaggerItem key={h.title}>
                                        <div className="relative h-full p-5 overflow-hidden transition-transform duration-500 vv-card rounded-[20px] hover:-translate-y-1">
                                            <span
                                                aria-hidden
                                                className="absolute left-0 top-0 h-full w-[3px]"
                                                style={{ background: tone }}
                                            />
                                            <span
                                                className="grid h-10 w-10 place-items-center rounded-[13px]"
                                                style={{ background: `${tone}1F`, color: tone === GOLD ? "#946510" : tone }}
                                            >
                                                <Icon size={18} />
                                            </span>
                                            <h3 className="mt-4 text-[15px] font-extrabold leading-snug vv-ink">{h.title}</h3>
                                            <p className="mt-2 text-[13px] leading-relaxed vv-soft">{h.description}</p>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </Stagger>
                    </div>
                </section>

                {/* ════════════════════ INTERFAZ ════════════════════ */}
                <section id="vv-interfaz" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="04 / La interfaz"
                                title={
                                    <>
                                        Cinco pantallas, <span className="vv-grad-ink">cuatro apps</span>
                                    </>
                                }
                                lead="Recreadas aquí en HTML y CSS con la paleta real: turquesa de agua clara, verde de palmera y un único dorado de acción por pantalla."
                            />
                        </div>

                        {/* cliente: home + buscando conductor */}
                        <div className="grid gap-10 mt-12 sm:grid-cols-2 lg:gap-14">
                            {[
                                { node: <MockHome />, name: p.uiScreens[0]?.name, note: "El llamado principal abre el mapa; abajo, el carrito de delivery si quedó activo." },
                                { node: <MockSearch />, name: p.uiScreens[1]?.name, note: "El radar de la hoja inferior es el mismo pulso que late en los pines de esta página." },
                            ].map((m, i) => (
                                <Reveal key={m.name} direction="up" delay={i * 0.1} className="flex flex-col items-center">
                                    <PhoneFrame className="w-[232px] md:w-[262px]">{m.node}</PhoneFrame>
                                    <p className="mt-6 text-sm font-extrabold text-center vv-ink">{m.name}</p>
                                    <p className="max-w-xs mt-2 text-xs leading-relaxed text-center vv-soft">{m.note}</p>
                                </Reveal>
                            ))}
                        </div>

                        {/* conductor + seguimiento */}
                        <div className="grid gap-10 mt-16 sm:grid-cols-2 lg:gap-14">
                            {[
                                { node: <MockDriver />, name: p.uiScreens[2]?.name, note: "Tema oscuro real de la app: toca el interruptor de disponibilidad para verlo encender." },
                                { node: <MockDelivery />, name: p.uiScreens[3]?.name, note: "Cinco pasos con conectores, contacto con el repartidor y el pago móvil del comercio con copiar en cada línea." },
                            ].map((m, i) => (
                                <Reveal key={m.name} direction="up" delay={i * 0.1} className="flex flex-col items-center">
                                    <PhoneFrame className="w-[232px] md:w-[262px]">{m.node}</PhoneFrame>
                                    <p className="mt-6 text-sm font-extrabold text-center vv-ink">{m.name}</p>
                                    <p className="max-w-xs mt-2 text-xs leading-relaxed text-center vv-soft">{m.note}</p>
                                </Reveal>
                            ))}
                        </div>

                        {/* comercio en navegador */}
                        <Reveal className="mt-16">
                            <BrowserFrame url="panel.vasvoy · comercio" dark={false}>
                                <div className="overflow-x-auto">
                                    <MockComercio />
                                </div>
                            </BrowserFrame>
                            <p className="mt-6 text-sm font-extrabold text-center vv-ink">{p.uiScreens[4]?.name}</p>
                            <p className="max-w-2xl mx-auto mt-2 text-xs leading-relaxed text-center vv-soft">
                                La misma aplicación corre en web y en Android. El chip de abierto/cerrado se togglea al tacto —
                                pruébalo — y el de créditos avisa cuando el saldo ya no cubre la comisión.
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* ════════════════════ MÁQUINA DE ESTADOS ════════════════════ */}
                <section id="vv-viaje" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="05 / La máquina de estados"
                                title={
                                    <>
                                        Cómo viaja <span className="vv-grad-ink">un pedido</span>
                                    </>
                                }
                                lead="Seis paradas del mismo recorrido. Cada una la custodia una Cloud Function o una regla, no la buena fe del cliente."
                            />
                        </div>

                        <div ref={stopsRef} className="relative mt-12 pl-10 md:pl-14">
                            {/* el raíl de la ruta */}
                            <span aria-hidden className="vv-rail absolute left-[15px] top-2 h-[calc(100%-16px)] w-[2px] md:left-[23px]" />
                            <span
                                aria-hidden
                                className="absolute left-[15px] top-2 w-[2px] rounded-full md:left-[23px]"
                                style={{
                                    height: `${Math.min(100, ride * 100)}%`,
                                    maxHeight: "calc(100% - 16px)",
                                    backgroundImage: `linear-gradient(${TURQ}, ${OCEAN})`,
                                }}
                            />
                            {/* la moto que avanza al hacer scroll */}
                            <span
                                aria-hidden
                                className="absolute z-10 grid rounded-full h-7 w-7 place-items-center"
                                style={{
                                    left: 2,
                                    top: `calc(${Math.min(100, ride * 100)}% - 14px)`,
                                    background: "#FFFFFF",
                                    color: OCEAN,
                                    boxShadow: "0 8px 20px -8px rgba(24,122,152,0.9)",
                                }}
                            >
                                <Bike size={14} />
                            </span>

                            <div className="space-y-4">
                                {STOPS.map((s, i) => {
                                    const lit = ride >= i / (STOPS.length - 1) - 0.06;
                                    return (
                                        <div key={s.state} className="relative">
                                            <span
                                                aria-hidden
                                                className="absolute -left-[30px] top-5 h-3.5 w-3.5 rounded-full transition-all duration-500 md:-left-[38px]"
                                                style={{
                                                    background: lit ? TURQ : "#FFFFFF",
                                                    border: `2px solid ${lit ? TURQ : "rgba(24,122,152,0.35)"}`,
                                                    boxShadow: lit ? "0 0 0 4px rgba(43,179,166,0.16)" : "none",
                                                }}
                                            />
                                            <div
                                                className="p-5 transition-all duration-500 vv-card rounded-[18px] md:p-6"
                                                style={{ opacity: lit ? 1 : 0.55 }}
                                            >
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                                    <span
                                                        className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
                                                        style={{ background: "rgba(43,179,166,0.12)", color: "#0E7C74" }}
                                                    >
                                                        {s.state}
                                                    </span>
                                                    <h3 className="text-base font-extrabold vv-ink md:text-lg">{s.title}</h3>
                                                    <span
                                                        className="ml-auto rounded-full px-2.5 py-1 text-[10px] font-bold"
                                                        style={{ background: "rgba(246,187,70,0.18)", color: "#946510" }}
                                                    >
                                                        {s.guard}
                                                    </span>
                                                </div>
                                                <p className="mt-3 text-sm leading-relaxed vv-soft">{s.note}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════ EL DINERO ════════════════════ */}
                <section id="vv-dinero" className="relative px-4 py-16 md:px-6 md:py-24">
                    <div
                        className="mx-auto max-w-6xl overflow-hidden rounded-[26px] px-5 py-12 md:px-12 md:py-16"
                        style={{ backgroundImage: `linear-gradient(150deg, ${OCEAN} 0%, ${DEEP} 100%)`, color: "#FFFFFF" }}
                    >
                        <div className="max-w-2xl">
                            <span className="block mb-3 font-mono text-xs tracking-[0.4em] uppercase text-white/50">
                                06 / El modelo
                            </span>
                            <h2 className="text-3xl font-black leading-tight md:text-5xl">
                                El dinero <span style={{ color: GOLD }}>no pasa por aquí</span>
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-white/70">
                                Sin pasarela, sin cobranza posterior y sin intermediación financiera: comisiones prepagas
                                descontadas de un saldo de créditos.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <Chip>Comisión prepaga</Chip>
                                <Chip>Cobro idempotente</Chip>
                                <Chip>Base congelada por el servidor</Chip>
                            </div>
                        </div>

                        <Stagger className="grid gap-5 mt-10 md:grid-cols-3" stagger={0.12}>
                            {MONEY.map((m) => (
                                <StaggerItem key={m.who}>
                                    <div
                                        className="h-full p-6 rounded-[18px]"
                                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)" }}
                                    >
                                        <p className="text-4xl font-black md:text-5xl" style={{ color: GOLD }}>
                                            {m.pct}
                                        </p>
                                        <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-white/80">{m.who}</p>
                                        <p className="mt-3 text-sm leading-relaxed text-white/65">{m.text}</p>
                                    </div>
                                </StaggerItem>
                            ))}
                        </Stagger>

                        <Reveal delay={0.1}>
                            <div className="flex flex-wrap items-center gap-3 pt-6 mt-8 border-t border-white/15">
                                <span className="inline-flex items-center gap-2 text-sm text-white/75">
                                    <Icons.Banknote size={16} style={{ color: GOLD }} />
                                    Precios canónicos en dólares, siempre visibles en bolívares
                                </span>
                                <span className="inline-flex items-center gap-2 text-sm text-white/75">
                                    <Clock size={16} style={{ color: GOLD }} />
                                    Tasa oficial traída cada mañana a las 8:00 de Caracas
                                </span>
                                <span className="inline-flex items-center gap-2 text-sm text-white/75">
                                    <Icons.ShieldCheck size={16} style={{ color: GOLD }} />
                                    Recargas por Pago Móvil verificadas a mano desde el panel
                                </span>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ════════════════════ MÉTRICAS ════════════════════ */}
                <section className="px-4 py-12 md:px-6 md:py-16">
                    <div className="mx-auto max-w-6xl p-6 vv-card rounded-[24px] md:p-10">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {p.metrics.map((m) => (
                                <div key={m.label} className="vv-ink">
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════ FUNCIONALIDADES ════════════════════ */}
                <section className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="07 / Funcionalidades"
                                title={
                                    <>
                                        Catorce paradas <span className="vv-grad-ink">ya construidas</span>
                                    </>
                                }
                                lead="Arrastra la cinta: cada tarjeta es una funcionalidad implementada en alguna de las cuatro apps."
                            />
                        </div>
                    </div>

                    <div className="mt-10 pl-4 md:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
                        <DragRail className="pb-4">
                            {p.features.map((f, i) => (
                                <div
                                    key={f}
                                    className="w-[250px] shrink-0 rounded-[18px] p-5 vv-card md:w-[290px]"
                                    style={{ borderTop: `3px solid ${[TURQ, GOLD, PALM, OCEAN][i % 4]}` }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-black"
                                            style={{ background: "rgba(43,179,166,0.12)", color: "#0E7C74" }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="h-[2px] flex-1 rounded-full" style={{ background: "rgba(24,122,152,0.15)" }} />
                                        <MapPin size={13} style={{ color: [TURQ, GOLD, PALM, OCEAN][i % 4] }} />
                                    </div>
                                    <p className="mt-4 text-[13px] leading-relaxed vv-ink">{f}</p>
                                </div>
                            ))}
                        </DragRail>
                    </div>
                </section>

                {/* ════════════════════ ARQUITECTURA ════════════════════ */}
                <section id="vv-motor" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="08 / Bajo el capó"
                                title={
                                    <>
                                        Un monorepo <span className="vv-grad-ink">sin ciclos</span>
                                    </>
                                }
                            />
                        </div>

                        <Reveal className="mt-10">
                            <div className="grid gap-3 md:grid-cols-3">
                                {[
                                    { t: "4 apps", s: "cliente · conductor · comercio · admin", c: TURQ },
                                    { t: "brio_ui", s: "tema, paleta, logo y widgets compartidos", c: GOLD },
                                    { t: "brio_core", s: "7 modelos · 12 repositorios · providers", c: PALM },
                                ].map((n, i) => (
                                    <div key={n.t} className="relative p-5 vv-card rounded-[18px]">
                                        <p className="text-lg font-black vv-ink">{n.t}</p>
                                        <p className="mt-1 text-xs leading-relaxed vv-soft">{n.s}</p>
                                        <span
                                            aria-hidden
                                            className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full"
                                            style={{ background: n.c }}
                                        />
                                        {i < 2 && (
                                            <span
                                                aria-hidden
                                                className="absolute z-10 hidden -translate-y-1/2 md:grid h-6 w-6 place-items-center rounded-full -right-5 top-1/2"
                                                style={{ background: "#FFFFFF", color: OCEAN, boxShadow: "0 6px 14px -8px rgba(24,122,152,0.9)" }}
                                            >
                                                <Icons.ArrowRight size={12} />
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal className="mt-6">
                            <div className="p-6 rounded-[20px] md:p-8" style={{ background: "#FFFFFF", borderLeft: `4px solid ${GOLD}`, boxShadow: "0 20px 44px -34px rgba(24,122,152,0.6)" }}>
                                <p className="text-sm leading-relaxed vv-soft md:text-[15px]">{p.architecture}</p>
                            </div>
                        </Reveal>

                        {/* stack */}
                        <div className="mt-14 vv-ink">
                            <SectionHead index="09 / Stack" title="Con qué está hecho" />
                        </div>
                        <div className="grid gap-4 mt-8 md:grid-cols-2">
                            {p.stack.map((group, i) => (
                                <Reveal key={group.group} delay={i * 0.06}>
                                    <div className="h-full p-5 vv-card rounded-[18px]">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: OCEAN }}>
                                            {group.group}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {group.items.map((item) => (
                                                <span key={item} className="vv-chip rounded-full px-2.5 py-1 text-[11.5px] font-semibold">
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

                {/* ════════════════════ RETOS ════════════════════ */}
                <section id="vv-retos" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-4xl">
                        <div className="vv-ink">
                            <SectionHead
                                index="10 / Los retos"
                                title={
                                    <>
                                        Seis baches <span className="vv-grad-ink">del camino</span>
                                    </>
                                }
                                lead="Cada uno se abre con lo que falló y con lo que quedó en su lugar."
                            />
                        </div>

                        <div className="mt-10 space-y-3">
                            {p.challenges.map((c, i) => {
                                const isOpen = openChallenge === i;
                                return (
                                    <Reveal key={i} delay={i * 0.05}>
                                        <div
                                            className="overflow-hidden rounded-[18px] bg-white transition-shadow duration-500"
                                            style={{
                                                borderLeft: `4px solid ${isOpen ? GOLD : "rgba(246,187,70,0.35)"}`,
                                                boxShadow: isOpen
                                                    ? "0 24px 48px -34px rgba(24,122,152,0.7)"
                                                    : "0 14px 30px -30px rgba(24,122,152,0.7)",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setOpenChallenge(isOpen ? null : i)}
                                                aria-expanded={isOpen}
                                                className="flex items-start w-full gap-3 p-5 text-left md:p-6"
                                            >
                                                <span
                                                    className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black"
                                                    style={{ background: "rgba(224,87,75,0.12)", color: "#A8382E" }}
                                                >
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span className="flex-1 text-sm font-bold leading-relaxed vv-ink md:text-[15px]">
                                                    {c.problem}
                                                </span>
                                                <ChevronDown
                                                    size={18}
                                                    className="mt-1 transition-transform duration-500 shrink-0"
                                                    style={{ color: OCEAN, transform: isOpen ? "rotate(180deg)" : "none" }}
                                                />
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        key="body"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 md:px-6 md:pb-6">
                                                            <div className="p-4 rounded-[14px]" style={{ background: "rgba(43,179,166,0.07)" }}>
                                                                <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "#0E7C74" }}>
                                                                    Cómo se resolvió
                                                                </p>
                                                                <p className="mt-2 text-sm leading-relaxed vv-soft">{c.solution}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ════════════════════ RESUMEN + MARCA ════════════════════ */}
                <section id="vv-llegada" className="px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-5xl">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <Reveal direction="right">
                                <div className="p-6 vv-card rounded-[22px] md:p-8">
                                    {lockup && (
                                        <Image src={lockup.src} alt={p.name} width={360} height={196} className="w-auto h-20" />
                                    )}
                                    <p className="mt-5 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: OCEAN }}>
                                        La marca
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed vv-soft">{p.brand.mood}</p>
                                    <div className="flex gap-2 mt-5">
                                        {[TURQ, PALM, GOLD, OCEAN, "#F6F8F9"].map((c) => (
                                            <span
                                                key={c}
                                                className="h-8 flex-1 rounded-[8px]"
                                                style={{ background: c, border: "1px solid rgba(24,122,152,0.15)" }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Reveal>

                            <Stagger className="space-y-4">
                                {p.summary.map((paragraph, i) => (
                                    <StaggerItem key={i}>
                                        <p
                                            className={`leading-relaxed ${i === 0 ? "text-lg md:text-xl vv-ink font-semibold" : "text-sm md:text-[15px] vv-soft"}`}
                                        >
                                            {paragraph}
                                        </p>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                        </div>

                        {/* piezas gráficas reales del repositorio */}
                        <div className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-3">
                            {p.media.map((m, i) => (
                                <Reveal key={m.src} delay={i * 0.05}>
                                    <figure className="h-full p-4 vv-card rounded-[18px]">
                                        <div
                                            className="grid rounded-[12px] p-3 place-items-center"
                                            style={{ background: i % 2 === 0 ? "#F1F6F7" : "rgba(43,179,166,0.08)" }}
                                        >
                                            <Image
                                                src={m.src}
                                                alt={m.caption}
                                                width={320}
                                                height={175}
                                                className="object-contain w-auto h-16"
                                            />
                                        </div>
                                        <figcaption className="mt-3 text-[11.5px] leading-relaxed vv-soft">{m.caption}</figcaption>
                                    </figure>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════ CINTA ════════════════════ */}
                <div className="py-5 text-xs uppercase tracking-[0.28em] vv-soft" style={{ borderTop: "1px solid rgba(24,122,152,0.16)", borderBottom: "1px solid rgba(24,122,152,0.16)" }}>
                    <Marquee
                        items={[
                            "Higuerote",
                            "Municipio Brión",
                            "Mototaxi",
                            "Taxi",
                            "Delivery",
                            "Pago Móvil",
                            "Tasa BCV",
                            "Créditos prepagos",
                        ]}
                        speed={38}
                        separator="~"
                    />
                </div>

                {/* ════════════════════ CIERRE ════════════════════ */}
                <div className="relative pb-24" style={{ marginTop: 40 }}>
                    <WaveBand />
                    <div className="pt-4 text-white" style={{ background: DEEP }}>
                        {mark && (
                            <div className="flex justify-center pt-8">
                                <span className="inline-grid p-3 bg-white rounded-full place-items-center vv-bob">
                                    <Image src={mark.src} alt={p.name} width={100} height={95} className="w-auto h-14" />
                                </span>
                            </div>
                        )}
                        <ProjectOutro
                            name={p.name}
                            links={p.links}
                            nextSlug={nxt.slug}
                            nextName={nxt.name}
                            note="Una super-app de movilidad y delivery pensada para un pueblo real: cuatro apps, un backend Firebase y reglas que sostienen el dinero. Si necesitas algo así —tiempo real, roles separados y cobros que no se repiten— es terreno conocido."
                        />
                    </div>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
