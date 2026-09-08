"use client"

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    BookOpen,
    Bookmark,
    Check,
    ChevronLeft,
    Download,
    Github,
    Globe,
    Highlighter,
    LayoutGrid,
    Lightbulb,
    MoreVertical,
    Pause,
    Play,
    Quote,
    Search,
    Sparkles,
    Type,
    User,
    Users,
    Volume2,
    X,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { AutoVideo, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("eduletter")!;
const nxt = nextProject("eduletter");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const media = (file: string) => p.media.find((m) => m.src.endsWith(file));

const appIcon = media("icon.png");
const splashLight = media("splash_logo.png");
const splashDark = media("dark_theme_splash_logo.png");
const bookmarkSvg = media("logo_ebook.svg");
const intros = p.media.filter((m) => m.kind === "illustration");
const upgradeBanner = media("upgrade_plans_banner.png");
const geniusMp4 = media("Edugenius_Lottie_Animation_Generated.mp4");
const geniusWebm = media("edugenius_alpha.webm");
const spotEs = media("eduletter_tiktok_final.mp4");
const spotEn = media("EduLetter_TikTok_EN.mp4");

/* ─────────────────────────── datos de la puesta en escena ─────────────────────────── */

/* Los lomos del héroe: ancho, alto y los tres del centro que quedan encendidos. */
const HERO_SPINES = Array.from({ length: 44 }, (_, i) => ({
    w: 30 + ((i * 7) % 4) * 7 + ((i * 3) % 2) * 4,
    h: 46 + ((i * 29) % 46),
    keep: i === 21 || i === 22 || i === 23,
}));

/* Las cuatro apps sueltas que el proyecto sustituye. */
const SCATTERED = ["Lector EPUB", "Catálogo", "Audiolibros", "IA de estudio"];

/* Los veinte ambientes del modo de lectura rápida, con su degradado y su acento. */
const AMBIENTS: {
    name: string;
    from: string;
    mid: string;
    to: string;
    accent: string;
    word: string;
    pivot: number;
    shot?: string;
}[] = [
    { name: "Fantasía", from: "#150B2E", mid: "#2C1A5E", to: "#0F2E3F", accent: "#B388FF", word: "hechizo", pivot: 2, shot: "bg_fantasy.jpg" },
    { name: "Ciencia ficción", from: "#020B1C", mid: "#0A1F3C", to: "#021826", accent: "#4FE3E3", word: "órbita", pivot: 1, shot: "bg_scifi.jpg" },
    { name: "Romance", from: "#1A0714", mid: "#3A1030", to: "#200A1C", accent: "#FF7BAC", word: "latido", pivot: 2 },
    { name: "Aventura", from: "#14100A", mid: "#3A2A10", to: "#1C1408", accent: "#FFB74D", word: "brújula", pivot: 2 },
    { name: "Clásico", from: "#151109", mid: "#33291A", to: "#1A150C", accent: "#E8C79A", word: "memoria", pivot: 2, shot: "bg_classic.jpg" },
    { name: "Misterio", from: "#0B0F14", mid: "#17242E", to: "#0A1218", accent: "#7FD1D6", word: "indicio", pivot: 2 },
    { name: "Terror", from: "#140708", mid: "#320F12", to: "#180708", accent: "#FF6B6B", word: "susurro", pivot: 2 },
    { name: "Histórico", from: "#12100C", mid: "#2E2718", to: "#17130D", accent: "#D9B26B", word: "imperio", pivot: 2 },
    { name: "Poesía", from: "#120A18", mid: "#2B1636", to: "#160C1C", accent: "#E5A9FF", word: "verso", pivot: 1 },
    { name: "Naturaleza", from: "#08130C", mid: "#12321E", to: "#09170F", accent: "#7BE0A3", word: "raíces", pivot: 2 },
    { name: "Océano", from: "#04121A", mid: "#0B2E42", to: "#05161F", accent: "#5FD0F0", word: "marea", pivot: 1 },
    { name: "Noche", from: "#08080F", mid: "#161629", to: "#0A0A13", accent: "#9EA8FF", word: "silencio", pivot: 2 },
    { name: "Amanecer", from: "#170D0A", mid: "#3B2013", to: "#1C1009", accent: "#FFB07C", word: "aurora", pivot: 1 },
    { name: "Bosque", from: "#0A1210", mid: "#152C24", to: "#0B1512", accent: "#8FD6B0", word: "sendero", pivot: 2 },
    { name: "Desierto", from: "#161009", mid: "#3A2A15", to: "#1A130A", accent: "#F3C77A", word: "duna", pivot: 1 },
    { name: "Invierno", from: "#0A0F16", mid: "#16283A", to: "#0B1219", accent: "#BFE3FF", word: "escarcha", pivot: 2 },
    { name: "Café", from: "#130D0A", mid: "#2E1E14", to: "#17100B", accent: "#D9A177", word: "aroma", pivot: 1 },
    { name: "Biblioteca", from: "#110E0B", mid: "#2A2119", to: "#15110C", accent: "#F0C89A", word: "estante", pivot: 2 },
    { name: "Cyberpunk", from: "#0B0418", mid: "#2A0940", to: "#0E0620", accent: "#FF4FD8", word: "circuito", pivot: 2 },
    { name: "Papel", from: "#131211", mid: "#2B2825", to: "#171614", accent: "#EDE6DC", word: "página", pivot: 1 },
];

/* Los degradados reales de los módulos de EduGenius, reutilizados en las funciones. */
const MODULE_GRADS: [string, string][] = [
    ["#6C5CE7", "#00B8D4"],
    ["#00B894", "#55EFC4"],
    ["#F39C12", "#FDCB6E"],
    ["#00B8D4", "#74D7EC"],
    ["#E17055", "#FAB1A0"],
    ["#A29BFE", "#6C5CE7"],
];

/* Las seis tarjetas del hub de EduGenius, con sus degradados reales. */
const GENIUS_ROWS: { title: string; sub: string; grad: [string, string]; glyph: string }[] = [
    { title: "Habla con el librarian IA", sub: "Chat sobre el libro abierto", grad: ["#6C5CE7", "#8E7CF7"], glyph: "💬" },
    { title: "Rutas de Lectura", sub: "Caminos curados por IA", grad: ["#00B894", "#55EFC4"], glyph: "🧭" },
    { title: "Recomendaciones", sub: "Libros personalizados", grad: ["#F39C12", "#FDCB6E"], glyph: "✨" },
    { title: "Modo Estudio", sub: "Flashcards y quizzes", grad: ["#00B8D4", "#74D7EC"], glyph: "🎓" },
    { title: "Analíticas de Lectura", sub: "Tu progreso", grad: ["#E17055", "#FAB1A0"], glyph: "📈" },
    { title: "Marcadores Inteligentes", sub: "Marcadores con IA", grad: ["#A29BFE", "#6C5CE7"], glyph: "🔖" },
];

/* Los carriles del diagrama de arquitectura. */
const LANES: { label: string; tone: string; items: string[] }[] = [
    {
        label: "Clientes",
        tone: "#F46F4C",
        items: ["App Flutter · 71 pantallas", "PWA Next.js 14 · 33 páginas", "Panel admin · Riverpod"],
    },
    {
        label: "Cloud Functions",
        tone: "#B388FF",
        items: ["34 callable", "20 HTTP · webhooks y RTDN", "12 tareas programadas"],
    },
    {
        label: "Firestore + Storage",
        tone: "#6C5CE7",
        items: ["55 rutas de colección", "La app lee derechos, nunca los escribe", "Caché Hive con TTL"],
    },
    {
        label: "Servicios externos",
        tone: "#00B8D4",
        items: ["Gemini", "Cloud Text-to-Speech", "Play Billing · Stripe · Braintree · NOWPayments", "AdMob"],
    },
];

/* Tokens del motor RSVP: la duración de cada palabra depende de su forma. */
const RSVP_TOKENS: { w: string; pivot: number; ms: number }[] = [
    { w: "El", pivot: 0, ms: 190 },
    { w: "lector", pivot: 2, ms: 250 },
    { w: "avanza", pivot: 2, ms: 250 },
    { w: "una", pivot: 1, ms: 200 },
    { w: "palabra", pivot: 2, ms: 280 },
    { w: "a", pivot: 0, ms: 170 },
    { w: "la", pivot: 0, ms: 190 },
    { w: "vez,", pivot: 1, ms: 360 },
    { w: "y", pivot: 0, ms: 170 },
    { w: "el", pivot: 0, ms: 190 },
    { w: "ojo", pivot: 1, ms: 220 },
    { w: "deja", pivot: 1, ms: 240 },
    { w: "de", pivot: 0, ms: 190 },
    { w: "saltar.", pivot: 2, ms: 560 },
];

const METRIC_HEIGHTS = [300, 258, 286, 240, 272, 228, 264, 248, 292];

const css = `
.el-display { font-family: Poppins, Urbanist, ui-sans-serif, system-ui, sans-serif; }
.el-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
.el-vert { writing-mode: vertical-rl; text-orientation: mixed; }

/* ── el lomo: la pieza que estructura toda la página ── */
.el-spine {
  position: relative;
  border-radius: 3px;
  background: linear-gradient(180deg, #1C1828, #141120);
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}
.el-spine::before,
.el-spine::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  height: 1px;
  background: rgba(255,255,255,0.09);
}
.el-spine::before { top: 12px; }
.el-spine::after { bottom: 12px; }
.el-on {
  background: linear-gradient(180deg, #FF9268, #F46F4C 46%, #D5522B);
  border-color: rgba(255,255,255,0.20);
  box-shadow: 0 0 28px rgba(244,111,76,.45), inset 0 1px 0 rgba(255,255,255,0.28);
}
.el-on::before, .el-on::after { background: rgba(26,14,10,0.34); }

/* ── héroe: la cascada de encendido y la linterna del cursor ── */
.el-hero-glow {
  position: absolute;
  inset: 0;
  border-radius: 3px;
  opacity: 0;
  background: linear-gradient(180deg, #FF9268, #F46F4C 46%, #D5522B);
  box-shadow: 0 0 24px rgba(244,111,76,.42);
  animation: el-ignite .92s cubic-bezier(.22,1,.36,1) forwards;
}
.el-hero-glow::before,
.el-hero-glow::after {
  content: "";
  position: absolute;
  left: 14%;
  right: 14%;
  height: 1px;
  background: rgba(26,14,10,0.34);
}
.el-hero-glow::before { top: 12px; }
.el-hero-glow::after { bottom: 12px; }
.el-hero-keep { animation-name: el-ignite-keep; }
@keyframes el-ignite {
  0% { opacity: 0; }
  28% { opacity: 1; }
  100% { opacity: .14; }
}
@keyframes el-ignite-keep {
  0% { opacity: 0; }
  28% { opacity: 1; }
  100% { opacity: 1; }
}
.el-torch {
  opacity: 0;
  transition: opacity .4s ease;
  -webkit-mask-image: radial-gradient(circle 150px at var(--el-mx, -400px) var(--el-my, -400px), #000 0%, rgba(0,0,0,.6) 45%, transparent 74%);
  mask-image: radial-gradient(circle 150px at var(--el-mx, -400px) var(--el-my, -400px), #000 0%, rgba(0,0,0,.6) 45%, transparent 74%);
}
.el-shelf:hover .el-torch { opacity: 1; }

/* ── grano y viñeta de sala a oscuras ── */
.el-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
}

/* ── ambientes: el lomo que se abre en tarjeta ── */
.el-amb {
  width: 30px;
  flex: none;
  transition: width .5s cubic-bezier(.22,1,.36,1);
}
@media (min-width: 768px) { .el-amb { width: 38px; } }
.el-amb:hover, .el-amb:focus-visible { width: 178px; outline: none; }
.el-amb-body { opacity: 0; transition: opacity .3s ease .14s; }
.el-amb:hover .el-amb-body, .el-amb:focus-visible .el-amb-body { opacity: 1; }
.el-amb-tag { transition: opacity .25s ease; }
.el-amb:hover .el-amb-tag, .el-amb:focus-visible .el-amb-tag { opacity: 0; }
.el-mote { animation: el-mote 6s ease-in-out infinite; }
@keyframes el-mote {
  0%, 100% { transform: translateY(0); opacity: .25; }
  50% { transform: translateY(-14px); opacity: .9; }
}

/* ── funciones: el libro que sale del estante ── */
.el-book {
  transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease, filter .5s ease;
  transform-origin: bottom center;
}
.el-book[data-on="1"] { transform: translateY(-20px) rotateY(-16deg) scale(1.04); }
.el-book:hover { transform: translateY(-8px); }
.el-book[data-on="1"]:hover { transform: translateY(-22px) rotateY(-16deg) scale(1.04); }

/* ── arquitectura: pulsos que recorren los carriles ── */
.el-pulse {
  position: absolute;
  top: 50%;
  height: 6px;
  width: 46px;
  margin-top: -3px;
  border-radius: 99px;
  animation: el-run 4.4s linear infinite;
}
@keyframes el-run {
  0% { left: -12%; opacity: 0; }
  8% { opacity: 1; }
  88% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* ── cierre: toda la estantería se enciende de golpe ── */
.el-final .el-spine { transition: background .6s ease, box-shadow .6s ease, border-color .6s ease; }
.el-final:hover .el-spine {
  background: linear-gradient(180deg, #FF9268, #F46F4C 46%, #D5522B);
  box-shadow: 0 0 24px rgba(244,111,76,.4);
}

@media (prefers-reduced-motion: reduce) {
  .el-hero-glow { animation: none !important; opacity: .16; }
  .el-hero-keep { opacity: 1; }
  .el-torch { display: none; }
  .el-mote, .el-pulse { animation: none !important; }
  .el-book, .el-amb, .el-amb-body, .el-amb-tag { transition: none !important; }
}
`;

/* ───────────────────────────── piezas propias ───────────────────────────── */

/** Un lomo suelto: la unidad visual de toda la landing. */
const Spine = ({
    w,
    h,
    on = false,
    className,
    style,
    children,
}: {
    w: number | string;
    h: number | string;
    on?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
}) => (
    <span
        className={`el-spine ${on ? "el-on" : ""} relative block shrink-0 ${className ?? ""}`}
        style={{ width: w, height: h, ...style }}
    >
        {children}
    </span>
);

/** La balda de madera sobre la que se apoyan los lomos. */
const ShelfBoard = ({ className }: { className?: string }) => (
    <div aria-hidden className={`relative ${className ?? ""}`}>
        <div className="h-[6px] w-full rounded-[2px]" style={{ background: "linear-gradient(180deg,#332C42,#171420)" }} />
        <div
            className="h-6 w-full"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,0))" }}
        />
    </div>
);

/** Rótulo de sección: un lomo encendido y el número del capítulo. */
const Tag = ({ n, children }: { n: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-3">
        <span
            className="inline-block h-4 w-[5px] rounded-[2px]"
            style={{ background: "linear-gradient(180deg,#FF9268,#D5522B)", boxShadow: "0 0 14px rgba(244,111,76,.6)" }}
        />
        <span className="el-mono text-[10px] uppercase tracking-[0.32em] text-[#9C93B0]">
            {n} · {children}
        </span>
    </div>
);

/** La estantería del héroe: cascada de encendido y linterna que sigue al cursor. */
const HeroShelf = () => {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (event: MouseEvent<HTMLDivElement>) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--el-mx", `${event.clientX - rect.left}px`);
        node.style.setProperty("--el-my", `${event.clientY - rect.top}px`);
    };

    return (
        <div ref={ref} onMouseMove={onMove} aria-hidden className="el-shelf absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center gap-[4px]">
                {HERO_SPINES.map((s, i) => (
                    <Spine key={i} w={s.w} h={`${s.h}%`}>
                        <span
                            className={`el-hero-glow ${s.keep ? "el-hero-keep" : ""}`}
                            style={{ animationDelay: `${i * 40}ms` }}
                        />
                    </Spine>
                ))}
            </div>

            <div className="el-torch absolute inset-0">
                <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center gap-[4px]">
                    {HERO_SPINES.map((s, i) => (
                        <Spine key={i} w={s.w} h={`${s.h}%`} on />
                    ))}
                </div>
            </div>

            <div
                className="absolute inset-x-0 bottom-0 h-40"
                style={{ background: "linear-gradient(180deg, rgba(13,11,20,0), #0D0B14 82%)" }}
            />
        </div>
    );
};

/* ─────────────────── mockups recreados a partir de p.uiScreens ─────────────────── */

/** Portada de la biblioteca — tema oscuro (#25303E con tarjetas #1A1A2E). */
const MockHome = () => (
    <div className="h-full w-full overflow-hidden bg-[#25303E] text-white">
        <div className="flex items-center gap-2 px-3 pb-2 pt-9">
            <div className="min-w-0 flex-1">
                <p className="text-[7px] text-white/45">Buenas noches</p>
                <p className="truncate text-[10px] font-semibold">Arturo 👋</p>
            </div>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                <Search size={11} />
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F46F4C] text-[8px] font-bold text-[#1A0E0A]">
                AS
            </span>
        </div>

        <div className="px-3">
            <div
                className="relative h-[58px] overflow-hidden rounded-[14px]"
                style={{ background: "linear-gradient(120deg,#F46F4C,#B388FF)" }}
            >
                <div className="relative flex h-full flex-col justify-center px-3">
                    <p className="text-[9px] font-extrabold text-[#1A0E0A]">Semana de clásicos</p>
                    <p className="text-[7px] text-[#1A0E0A]/70">40 títulos abiertos para todos</p>
                </div>
            </div>
            <div className="mt-1.5 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-[3px] rounded-full"
                        style={{ width: i === 0 ? 12 : 4, background: i === 0 ? "#F46F4C" : "#D6D8D8" }}
                    />
                ))}
            </div>
        </div>

        <div
            className="mx-3 mt-2 flex items-center gap-2 rounded-[16px] p-2"
            style={{
                border: "1.5px solid rgba(244,111,76,.42)",
                background: "linear-gradient(120deg, rgba(244,111,76,.20), rgba(179,136,255,.10))",
            }}
        >
            <span className="text-[15px] leading-none">🔥</span>
            <div>
                <p className="text-[15px] font-extrabold leading-none">7</p>
                <p className="text-[7px] text-white/55">Racha de Lectura</p>
            </div>
            <span className="ml-auto rounded-full bg-white/12 px-1.5 py-0.5 text-[6px] text-white/70">+30 pts hoy</span>
        </div>

        <div className="mt-3 flex items-center justify-between px-3">
            <p className="text-[9px] font-bold">Continuar Leyendo</p>
            <span className="text-[7px] text-[#F46F4C]">Ver todo</span>
        </div>
        <div className="mt-1.5 flex gap-2 overflow-hidden px-3">
            {[
                { t: "El hombre que calculaba", a: "Malba Tahan", c: "#7A4A2B", pct: 62, tag: "Leyendo" },
                { t: "La ciudad y los perros", a: "M. Vargas Llosa", c: "#2E4A6B", pct: 18, tag: "Leyendo" },
                { t: "Ensayo sobre la ceguera", a: "J. Saramago", c: "#3D3350", pct: 100, tag: "Terminado" },
            ].map((b) => (
                <div
                    key={b.t}
                    className="relative h-[100px] w-[72px] shrink-0 overflow-hidden rounded-[12px]"
                    style={{ background: `linear-gradient(160deg, ${b.c}, #10121A)` }}
                >
                    <span className="absolute left-1 top-1 rounded-full bg-black/55 px-1 py-[1px] text-[5px] text-white/85">
                        {b.tag}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 pb-1.5 pt-4">
                        <p className="line-clamp-2 text-[6.5px] font-semibold leading-tight">{b.t}</p>
                        <p className="text-[5.5px] text-white/45">{b.a}</p>
                        <span className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                            <span className="block h-full rounded-full bg-[#F46F4C]" style={{ width: `${b.pct}%` }} />
                        </span>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-3 flex items-center justify-between px-3">
            <p className="text-[9px] font-bold">Destacados</p>
            <span className="text-[7px] text-[#F46F4C]">Ver todo</span>
        </div>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5 px-3">
            {["#6C5CE7", "#00B894", "#F39C12", "#E17055"].map((c) => (
                <span
                    key={c}
                    className="h-[52px] rounded-[8px] shadow-[0_6px_16px_-8px_rgba(0,0,0,.9)]"
                    style={{ background: `linear-gradient(160deg, ${c}, #14141F)` }}
                />
            ))}
        </div>

        <div className="mx-3 mt-2 rounded-[10px] border border-dashed border-white/15 bg-[#1A1A2E] px-2 py-1.5">
            <p className="text-[5.5px] uppercase tracking-[0.18em] text-white/35">Patrocinado · anuncio nativo</p>
            <p className="text-[7px] text-white/70">Sólo para cuentas sin Premium</p>
        </div>

        <div className="absolute inset-x-3 bottom-2 flex items-center justify-between rounded-[18px] bg-[#1A1A2E] px-2.5 py-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,1)]">
            {[
                { I: Bookmark, l: "Reciente", on: false },
                { I: LayoutGrid, l: "Categoría", on: false },
                { I: BookOpen, l: "Inicio", on: true },
                { I: Users, l: "Social", on: false },
                { I: Download, l: "Guardado", on: false },
                { I: User, l: "Cuenta", on: false },
            ].map(({ I, l, on }) => (
                <span key={l} className="flex flex-col items-center gap-[2px]" style={{ color: on ? "#F46F4C" : "rgba(255,255,255,.4)" }}>
                    <I size={11} />
                    <span className="text-[5px]">{l}</span>
                </span>
            ))}
        </div>
    </div>
);

/** Lector EPUB — barra fija, progreso de 3 px y banner anclado. */
const MockReader = () => (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#FBF9F6] text-[#1A0E0A]">
        <div className="bg-white px-2.5 pb-1.5 pt-9 shadow-[0_6px_10px_-8px_rgba(0,0,0,.45)]">
            <div className="flex items-center gap-2">
                <span className="grid h-[22px] w-[22px] place-items-center rounded-[7px] bg-black/[0.04]">
                    <ChevronLeft size={12} />
                </span>
                <p className="min-w-0 flex-1 truncate text-[9px] font-semibold">El hombre que calculaba</p>
                <MoreVertical size={12} className="opacity-55" />
            </div>
        </div>
        <div className="h-[2px] w-full bg-black/5">
            <div className="h-full bg-[#F46F4C]" style={{ width: "38%" }} />
        </div>

        <div className="relative flex-1 px-3 py-3">
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-black/35">Capítulo IV</p>
            <p className="mt-1.5 text-justify text-[7.5px] leading-[1.75] text-black/80">
                Íbamos los dos, en aquella tarde inolvidable, por el camino que lleva a Bagdad. Beremiz caminaba
                despacio y en silencio, con los ojos fijos en la arena, como si buscara en ella la solución de un
                problema antiguo.
            </p>
            <p className="mt-2 text-justify text-[7.5px] leading-[1.75] text-black/80">
                De pronto se detuvo y me dijo:{" "}
                <span className="rounded-[2px] bg-[#F46F4C]/25 px-[2px] py-[1px]">
                    «Los números tienen una manera de hablar que sólo entiende quien los escucha despacio».
                </span>{" "}
                Anoté la frase en el margen, donde ya se acumulaban otras tres.
            </p>
            <p className="mt-2 text-justify text-[7.5px] leading-[1.75] text-black/80">
                Aquella noche, mientras el desierto se enfriaba, comprendí que la aritmética podía ser también una
                forma de cortesía.
            </p>

            <span
                aria-hidden
                className="absolute bottom-0 right-0 h-12 w-12"
                style={{ background: "linear-gradient(315deg, rgba(0,0,0,.10), transparent 62%)" }}
            />
        </div>

        <div className="border-t border-black/5 bg-white px-3 py-2">
            <div className="relative h-[3px] w-full rounded-full bg-black/8">
                <div className="h-full rounded-full bg-[#F46F4C]" style={{ width: "38%" }} />
                <span className="absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#F46F4C] shadow" style={{ left: "38%" }} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[6.5px] text-black/45">
                <span>38 % leído</span>
                <span>24 min restantes</span>
            </div>
            <div className="mt-2 flex items-center justify-around text-black/55">
                <Highlighter size={11} />
                <Bookmark size={11} />
                <Type size={11} />
                <Volume2 size={11} />
                <Search size={11} />
            </div>
        </div>

        <div className="flex h-[34px] items-center justify-center border-t border-black/10 bg-[#EFEBE6] text-[6px] uppercase tracking-[0.2em] text-black/35">
            Banner AdMob · cuenta gratuita
        </div>
    </div>
);

/** Lectura rápida (RSVP): el motor real, con temporizador que se rearma por palabra. */
const MockRsvp = () => {
    const reduce = useReducedMotion();
    const [i, setI] = useState(0);
    const amb = AMBIENTS[0];

    useEffect(() => {
        if (reduce) return;
        const id = window.setTimeout(() => setI((v) => (v + 1) % RSVP_TOKENS.length), RSVP_TOKENS[i].ms);
        return () => window.clearTimeout(id);
    }, [i, reduce]);

    const token = RSVP_TOKENS[i];
    const prev = RSVP_TOKENS[(i - 1 + RSVP_TOKENS.length) % RSVP_TOKENS.length];
    const next = RSVP_TOKENS[(i + 1) % RSVP_TOKENS.length];

    return (
        <div
            className="relative flex h-full w-full flex-col overflow-hidden"
            style={{ background: `linear-gradient(180deg, ${amb.from}, ${amb.mid} 52%, ${amb.to})` }}
        >
            {[
                { l: 18, t: 22, d: 0 },
                { l: 72, t: 34, d: 1.4 },
                { l: 34, t: 62, d: 2.6 },
                { l: 84, t: 74, d: 3.8 },
                { l: 56, t: 14, d: 2 },
            ].map((m, k) => (
                <span
                    key={k}
                    aria-hidden
                    className="el-mote absolute h-[3px] w-[3px] rounded-full"
                    style={{ left: `${m.l}%`, top: `${m.t}%`, background: amb.accent, animationDelay: `${m.d}s` }}
                />
            ))}

            <div className="relative flex items-center justify-between px-3 pt-9">
                <span className="rounded-full bg-white/12 px-2 py-[3px] text-[7px] font-medium text-white/85 backdrop-blur">
                    320 ppm
                </span>
                <X size={13} className="text-white/70" />
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center gap-2">
                <span className="el-mono text-[9px] text-white/25">{prev.w}</span>
                <span className="el-mono text-[26px] font-bold tracking-[0.06em] text-white">
                    {token.w.slice(0, token.pivot)}
                    <span style={{ color: amb.accent }}>{token.w.charAt(token.pivot)}</span>
                    {token.w.slice(token.pivot + 1)}
                </span>
                <span className="el-mono text-[9px] text-white/25">{next.w}</span>

                <span className="absolute top-1/2 h-px w-10 -translate-y-[26px] bg-white/15" style={{ left: 14 }} />
                <span className="absolute top-1/2 h-px w-10 -translate-y-[26px] bg-white/15" style={{ right: 14 }} />
            </div>

            <div className="relative px-3 pb-6">
                <div className="rounded-[14px] bg-black/35 px-3 py-2 backdrop-blur">
                    <div className="flex items-center justify-between text-white/80">
                        <Volume2 size={12} />
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#1A0E0A]">
                            <Pause size={13} />
                        </span>
                        <BookOpen size={12} />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[6.5px] text-white/50">
                        <span>Cap. 4 · Fantasía</span>
                        <span>12 min restantes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** EduGenius Hub: cabecera degradada, tarjeta de estadísticas y las seis funciones. */
const MockGenius = () => (
    <div className="h-full w-full overflow-hidden bg-[#0D0D2B] text-white">
        <div className="px-3 pb-4 pt-9" style={{ background: "linear-gradient(120deg,#6C5CE7,#00B8D4)" }}>
            <ChevronLeft size={13} className="text-white" />
            <div className="mt-2 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25">
                    <Sparkles size={14} />
                </span>
                <div>
                    <p className="text-[12px] font-extrabold leading-none">EduGenius</p>
                    <p className="mt-1 text-[7px] text-white/85">Tu asistente de lectura inteligente ✨</p>
                </div>
            </div>
        </div>

        <div className="-mt-3 px-3">
            <div className="flex items-center justify-around rounded-[16px] bg-[#1A1A3E] px-2 py-2 shadow-[0_10px_26px_-14px_rgba(0,0,0,1)]">
                {[
                    ["📚", "12", "Libros Leídos"],
                    ["📄", "340", "Páginas"],
                    ["🔥", "7", "Racha"],
                ].map(([e, n, l]) => (
                    <div key={l} className="text-center">
                        <p className="text-[10px] leading-none">{e}</p>
                        <p className="mt-1 text-[12px] font-extrabold leading-none">{n}</p>
                        <p className="mt-[3px] text-[5.5px] text-white/45">{l}</p>
                    </div>
                ))}
            </div>
        </div>

        <p className="mt-3 px-3 text-[9px] font-bold">Funciones</p>
        <div className="mt-1.5 space-y-1.5 px-3">
            {GENIUS_ROWS.map((r) => (
                <div key={r.title} className="flex items-center gap-2 rounded-[12px] bg-[#1A1A3E] px-2 py-[6px]">
                    <span
                        className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] text-[10px]"
                        style={{ background: `linear-gradient(135deg, ${r.grad[0]}, ${r.grad[1]})` }}
                    >
                        {r.glyph}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-[7px] font-semibold">{r.title}</span>
                        <span className="block truncate text-[6px] text-white/40">{r.sub}</span>
                    </span>
                </div>
            ))}
        </div>

        <div
            className="mx-3 mt-2 flex items-center gap-2 rounded-[12px] px-2 py-1.5"
            style={{
                background: "linear-gradient(120deg, rgba(108,92,231,.08), rgba(0,184,212,.08))",
                border: "1px solid rgba(108,92,231,.15)",
            }}
        >
            <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                style={{ background: "linear-gradient(135deg,#6C5CE7,#00B8D4)" }}
            >
                <Lightbulb size={10} />
            </span>
            <span className="text-[6px] leading-tight text-white/70">
                Consejo del Día · Lee 20 minutos antes de dormir: la retención sube y la racha no se corta.
            </span>
        </div>
    </div>
);

/** Oferta Premium: el naranja de marca con texto casi negro para que se lea. */
const MockPaywall = () => (
    <div className="h-full w-full overflow-hidden bg-[#0D0D1F] px-3 pt-9 text-white">
        <div className="flex items-center gap-2">
            <ChevronLeft size={13} className="opacity-70" />
            <p className="text-[10px] font-semibold">Mejorar plan</p>
        </div>

        <p className="mt-3 text-[15px] font-extrabold leading-tight brand-gradient-text">
            Todo Eduletter Premium, en un solo plan
        </p>
        <p className="mt-1.5 text-[7px] leading-relaxed text-white/45">
            EduGenius sin límites, sin anuncios y lectura premium. El precio final lo confirma Google Play al pagar.
        </p>

        <div
            className="relative mt-3 overflow-hidden rounded-[20px] p-3 shadow-[0_18px_34px_-18px_rgba(244,111,76,.9)]"
            style={{ background: "linear-gradient(140deg,#FF6B35,#E04000)" }}
        >
            <span className="inline-block rounded-full bg-[#1A0E0A]/15 px-2 py-[2px] text-[6px] font-bold uppercase tracking-[0.16em] text-[#1A0E0A]">
                Prueba
            </span>
            <p className="mt-1.5 text-[11px] font-extrabold leading-tight text-[#1A0E0A]">
                Prueba Premium 7 días por solo $1
            </p>
            <p className="mt-1 text-[6.5px] leading-relaxed text-[#1A0E0A]/75">
                Acceso total: sin anuncios, lectura y narración ilimitadas. Cancela cuando quieras.
            </p>
        </div>

        <div className="mt-3 space-y-1.5">
            {["Sin anuncios", "Lectura ilimitada", "Narración", "Lectura rápida ilimitada"].map((b) => (
                <div key={b} className="flex items-center gap-2">
                    <span className="grid h-[14px] w-[14px] place-items-center rounded-full bg-[#F46F4C]/20 text-[#F46F4C]">
                        <Check size={8} />
                    </span>
                    <span className="text-[7.5px] text-white/80">{b}</span>
                </div>
            ))}
        </div>

        <p className="mt-3 text-[5.5px] leading-relaxed text-white/30">
            La suscripción se renueva automáticamente salvo cancelación 24 h antes del fin del periodo. Gestiona el plan
            desde Google Play.
        </p>

        <div className="mt-2 rounded-full bg-[#F46F4C] py-2 text-center text-[8px] font-bold text-[#1A0E0A]">
            Continuar con Google Play
        </div>
    </div>
);

/* ─────────────────────────────── la landing ─────────────────────────────── */

const Landing = () => {
    const [feature, setFeature] = useState(0);
    const ambientShots = AMBIENTS.map((a) => (a.shot ? media(a.shot) : undefined));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="el-page">
            <style>{css}</style>

            {/* ══════════════════ HÉROE ══════════════════ */}
            <section className="relative px-4 pb-24 pt-28 md:px-6 md:pb-32 md:pt-36">
                <HeroShelf />
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
                    style={{
                        background:
                            "radial-gradient(58% 52% at 50% 8%, rgba(244,111,76,.16), transparent 72%), radial-gradient(40% 40% at 88% 24%, rgba(108,92,231,.16), transparent 70%)",
                    }}
                />

                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="flex items-center gap-4">
                        {appIcon && (
                            <Image
                                src={appIcon.src}
                                alt={appIcon.caption}
                                width={72}
                                height={72}
                                priority
                                className="h-14 w-14 rounded-[16px] shadow-[0_14px_36px_-12px_rgba(244,111,76,.8)] md:h-[72px] md:w-[72px]"
                            />
                        )}
                        <div>
                            <p className="el-mono text-[10px] uppercase tracking-[0.34em] text-[#F46F4C]">
                                La estantería que se enciende
                            </p>
                            <p className="mt-1 text-sm text-[#9C93B0]">{p.category}</p>
                        </div>
                    </div>

                    <h1 className="el-display mt-8 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight md:text-7xl">
                        <RevealWords text={p.name} />
                        <motion.span
                            className="block brand-gradient-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        >
                            cuatro formas de leer un mismo libro
                        </motion.span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#CFC7DE] md:text-xl">{p.tagline}</p>

                    <div className="mt-8 flex flex-wrap gap-2">
                        <Chip>{p.year}</Chip>
                        <Chip>Google Play</Chip>
                        <Chip>Flutter · Firebase · Next.js</Chip>
                    </div>

                    <p className="el-mono mt-5 max-w-2xl text-[11px] leading-relaxed text-[#9C93B0]">{p.role}</p>
                    <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-[#9C93B0]/75">{p.status}</p>

                    <div className="mt-9 flex flex-wrap gap-3">
                        {p.links.play && (
                            <BrandButton href={p.links.play}>
                                <Play size={16} /> Descargar en Google Play
                            </BrandButton>
                        )}
                        {p.links.web && (
                            <BrandButton href={p.links.web} variant="outline">
                                <Globe size={16} /> Abrir la web
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <BrandButton href={p.links.github} variant="outline">
                                <Github size={16} /> Código de la web
                            </BrandButton>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 01 · EL ESTANTE DESORDENADO ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="01">El estante desordenado</Tag>

                    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
                        <Reveal direction="right">
                            <div className="flex h-[190px] items-end gap-3 md:h-[220px]">
                                {SCATTERED.map((s, i) => (
                                    <Spine
                                        key={s}
                                        w={46}
                                        h={[140, 176, 120, 158][i]}
                                        className="flex items-center justify-center"
                                        style={{ transform: `rotate(${[-4, 2, -1, 5][i]}deg)` }}
                                    >
                                        <span className="el-vert el-mono text-[9px] uppercase tracking-[0.18em] text-[#6E657F]">
                                            {s}
                                        </span>
                                    </Spine>
                                ))}
                                <span className="el-mono mb-2 text-[10px] leading-tight text-[#5B5468]">
                                    progreso
                                    <br />
                                    perdido
                                </span>
                            </div>
                            <ShelfBoard className="mt-1 max-w-[320px]" />
                            <h3 className="el-display mt-6 text-2xl font-bold md:text-3xl">
                                Cuatro apps, cuatro progresos
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-[#B7AEC7] md:text-base">{p.problem}</p>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <div className="flex h-[190px] items-end gap-3 md:h-[220px]">
                                <Spine w={68} h={200} on className="flex items-center justify-center">
                                    <span className="el-vert el-display text-[13px] font-bold uppercase tracking-[0.22em] text-[#1A0E0A]">
                                        EduLetter
                                    </span>
                                </Spine>
                                <div className="mb-1 space-y-1.5">
                                    {["Leer", "Escuchar", "Leer rápido", "Estudiar con IA"].map((m) => (
                                        <p key={m} className="el-mono text-[10px] text-[#F46F4C]">
                                            ▸ {m}
                                        </p>
                                    ))}
                                    <p className="el-mono pt-1 text-[10px] text-[#9C93B0]">
                                        un mismo progreso en Firestore
                                    </p>
                                </div>
                            </div>
                            <ShelfBoard className="mt-1 max-w-[320px]" />
                            <h3 className="el-display mt-6 text-2xl font-bold md:text-3xl">
                                <span className="brand-gradient-text">Un solo lomo encendido</span>
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-[#CFC7DE] md:text-base">{p.solution}</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 02 · SEIS PIEZAS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="02">Lo que sostiene la app</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Seis piezas que <span className="brand-gradient-text">encienden el estante</span>
                                </span>
                            }
                        />
                    </div>

                    <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            const [g0, g1] = MODULE_GRADS[i % MODULE_GRADS.length];
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="group relative h-full overflow-hidden rounded-[20px] border border-white/8 bg-[#17141F] p-5 transition-colors duration-500 hover:border-[#F46F4C]/45">
                                        <span
                                            aria-hidden
                                            className="absolute inset-y-0 left-0 w-[5px]"
                                            style={{ background: `linear-gradient(180deg, ${g0}, ${g1})` }}
                                        />
                                        <span
                                            aria-hidden
                                            className="absolute inset-y-0 left-0 w-[5px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                            style={{ boxShadow: `0 0 22px ${g0}` }}
                                        />
                                        <span
                                            className="ml-2 grid h-10 w-10 place-items-center rounded-[12px] text-white"
                                            style={{ background: `linear-gradient(135deg, ${g0}, ${g1})` }}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        <h3 className="el-display ml-2 mt-4 text-base font-bold">{h.title}</h3>
                                        <p className="ml-2 mt-2 text-sm leading-relaxed text-[#A79EBA]">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ══════════════════ 03 · TRES PANTALLAS SOBRE LA BALDA ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-1/4 h-[420px]"
                    style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(244,111,76,.10), transparent 70%)" }}
                />
                <div className="relative mx-auto max-w-6xl">
                    <Tag n="03">La interfaz</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Tres pantallas <span className="brand-gradient-text">de pie en la balda</span>
                                </span>
                            }
                            lead="Recreadas en HTML y CSS con los colores, las medidas y los textos reales de la app."
                        />
                    </div>

                    <div className="mt-14 grid justify-items-center gap-12 md:grid-cols-3 md:gap-6">
                        {[
                            { node: <MockHome />, name: p.uiScreens[0].name, note: "Racha, continuidad y navegación de seis destinos." },
                            { node: <MockReader />, name: p.uiScreens[1].name, note: "Barra fija, progreso de 3 px y banner anclado abajo." },
                            { node: <MockRsvp />, name: p.uiScreens[2].name, note: "El motor cambia de palabra con la duración de cada token." },
                        ].map((m, i) => (
                            <Reveal key={m.name} direction="up" delay={i * 0.1} className="w-full">
                                <div className="flex flex-col items-center">
                                    <PhoneFrame className="w-[232px] sm:w-[244px]">{m.node}</PhoneFrame>
                                    <ShelfBoard className="mt-4 w-[240px] sm:w-[252px]" />
                                    <p className="el-display mt-3 text-center text-sm font-semibold">{m.name}</p>
                                    <p className="mt-1 max-w-[240px] text-center text-xs leading-relaxed text-[#9C93B0]">
                                        {m.note}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 04 · AMBIENTES DE LECTURA RÁPIDA ══════════════════ */}
            <section className="relative py-20 md:py-28">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <Tag n="04">Lectura rápida</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Veinte ambientes, <span className="brand-gradient-text">un lomo cada uno</span>
                                </span>
                            }
                            lead="Pasa el cursor por la fila: cada lomo se abre y enseña su degradado, sus partículas y una palabra con la letra pivote tintada."
                        />
                    </div>
                </div>

                <div className="mt-10 overflow-x-auto px-4 pb-4 scrollbar-none md:px-6">
                    <div className="mx-auto flex w-max items-end gap-[4px]">
                        {AMBIENTS.map((a, i) => (
                            <button
                                key={a.name}
                                type="button"
                                aria-label={`Ambiente ${a.name}`}
                                className="el-amb el-spine relative h-[230px] overflow-hidden rounded-[4px] text-left md:h-[280px]"
                                style={{ background: `linear-gradient(180deg, ${a.from}, ${a.mid} 54%, ${a.to})` }}
                            >
                                <span
                                    aria-hidden
                                    className="absolute inset-x-0 top-0 h-[3px]"
                                    style={{ background: a.accent, opacity: 0.85 }}
                                />
                                <span
                                    className="el-amb-tag el-vert absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.14em]"
                                    style={{ color: a.accent }}
                                >
                                    {a.name}
                                </span>

                                <span className="el-amb-body absolute inset-0 block p-3">
                                    {[
                                        { l: 22, t: 26, d: 0 },
                                        { l: 68, t: 44, d: 1.6 },
                                        { l: 40, t: 70, d: 3.1 },
                                    ].map((m, k) => (
                                        <span
                                            key={k}
                                            aria-hidden
                                            className="el-mote absolute h-[3px] w-[3px] rounded-full"
                                            style={{ left: `${m.l}%`, top: `${m.t}%`, background: a.accent, animationDelay: `${m.d}s` }}
                                        />
                                    ))}
                                    <span className="block text-[9px] uppercase tracking-[0.18em]" style={{ color: a.accent }}>
                                        {a.name}
                                    </span>
                                    <span className="el-mono mt-[38%] block whitespace-nowrap text-[15px] font-bold text-white">
                                        {a.word.slice(0, a.pivot)}
                                        <span style={{ color: a.accent }}>{a.word.charAt(a.pivot)}</span>
                                        {a.word.slice(a.pivot + 1)}
                                    </span>
                                    <span className="mt-1 block text-[8px] text-white/40">
                                        {100 + i * 35} ppm · letra pivote
                                    </span>
                                    {ambientShots[i] && (
                                        <span className="absolute inset-x-3 bottom-3 block rounded-[8px] bg-white/10 px-2 py-1 text-[7px] text-white/70">
                                            Fondo real en la app
                                        </span>
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mx-auto mt-10 max-w-6xl px-4 md:px-6">
                    <p className="el-mono text-[10px] uppercase tracking-[0.24em] text-[#9C93B0]">
                        Los tres fondos que sí existen como imagen
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-3 md:max-w-2xl">
                        {AMBIENTS.filter((a) => a.shot).map((a) => {
                            const shot = media(a.shot as string);
                            if (!shot) return null;
                            return (
                                <Reveal key={a.name} direction="scale">
                                    <figure className="relative aspect-[768/1408] overflow-hidden rounded-[16px] border border-white/10">
                                        <Image
                                            src={shot.src}
                                            alt={shot.caption}
                                            fill
                                            sizes="(max-width: 768px) 30vw, 220px"
                                            className="object-cover"
                                        />
                                        <figcaption
                                            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-2 text-[10px] font-semibold"
                                            style={{ color: a.accent }}
                                        >
                                            {a.name}
                                        </figcaption>
                                    </figure>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 05 · EDUGENIUS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(46% 40% at 22% 40%, rgba(108,92,231,.20), transparent 70%), radial-gradient(40% 36% at 78% 62%, rgba(0,184,212,.14), transparent 70%)",
                    }}
                />
                <div className="relative mx-auto max-w-6xl">
                    <Tag n="05">EduGenius</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    La IA vive <span className="brand-gradient-text">detrás del servidor</span>
                                </span>
                            }
                            lead="Nueve funciones callable en Python delante de Gemini: la clave nunca viaja en el binario y el coste tiene techo."
                        />
                    </div>

                    <div className="mt-12 grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
                        <Reveal direction="right" className="flex justify-center">
                            <PhoneFrame className="w-[232px] sm:w-[244px]">
                                <MockGenius />
                            </PhoneFrame>
                        </Reveal>

                        <div>
                            <p className="el-display text-sm font-semibold text-[#CFC7DE]">
                                {p.uiScreens[3].name}
                            </p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {GENIUS_ROWS.map((r) => (
                                    <div
                                        key={r.title}
                                        className="rounded-[16px] border border-white/8 bg-[#17141F] p-3"
                                        style={{ borderLeft: `3px solid ${r.grad[0]}` }}
                                    >
                                        <p className="text-[13px] font-semibold">{r.title}</p>
                                        <p className="mt-1 text-xs text-[#9C93B0]">{r.sub}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap items-start gap-4">
                                {geniusMp4 && (
                                    <figure className="w-[150px]">
                                        <AutoVideo src={geniusMp4.src} rounded="rounded-[16px]" />
                                        <figcaption className="mt-2 text-[10px] leading-tight text-[#9C93B0]">
                                            Avatar animado dentro de la app
                                        </figcaption>
                                    </figure>
                                )}
                                {geniusWebm && (
                                    <figure className="w-[150px]">
                                        <AutoVideo src={geniusWebm.src} rounded="rounded-[16px]" />
                                        <figcaption className="mt-2 text-[10px] leading-tight text-[#9C93B0]">
                                            Versión WebM con canal alfa para la web
                                        </figcaption>
                                    </figure>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 06 · MONETIZACIÓN ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="06">Cómo se paga</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Cinco caminos <span className="brand-gradient-text">hasta el mismo derecho</span>
                                </span>
                            }
                            lead="Play Billing, Stripe, Braintree/PayPal, criptomonedas y un pago manual aprobado a mano: donde no hay pasarela, hay referencia."
                        />
                    </div>

                    <div className="mt-12 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
                        <Reveal direction="right" className="flex justify-center">
                            <PhoneFrame className="w-[232px] sm:w-[244px]">
                                <MockPaywall />
                            </PhoneFrame>
                        </Reveal>

                        <div>
                            <p className="el-display text-sm font-semibold text-[#CFC7DE]">{p.uiScreens[4].name}</p>

                            <div className="mt-4 overflow-x-auto scrollbar-none">
                                <div className="flex w-max gap-2">
                                    {[
                                        "Google Play Billing + RTDN",
                                        "Stripe",
                                        "Braintree / PayPal",
                                        "NOWPayments (cripto)",
                                        "Pago manual con referencia",
                                        "AdMob para el tramo gratuito",
                                    ].map((m, i) => (
                                        <span
                                            key={m}
                                            className="whitespace-nowrap rounded-full border px-3 py-1.5 text-xs"
                                            style={{
                                                borderColor: i === 4 ? "rgba(244,111,76,.5)" : "rgba(255,255,255,.12)",
                                                color: i === 4 ? "#F46F4C" : "#B7AEC7",
                                                background: i === 4 ? "rgba(244,111,76,.10)" : "transparent",
                                            }}
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {upgradeBanner && (
                                <Reveal className="mt-6">
                                    <figure className="overflow-hidden rounded-[18px] border border-white/10">
                                        <Image
                                            src={upgradeBanner.src}
                                            alt={upgradeBanner.caption}
                                            width={1692}
                                            height={400}
                                            className="h-auto w-full"
                                        />
                                    </figure>
                                    <figcaption className="mt-2 text-[11px] text-[#9C93B0]">
                                        {upgradeBanner.caption}
                                    </figcaption>
                                </Reveal>
                            )}

                            <div className="mt-6 rounded-[18px] border border-white/8 bg-[#17141F] p-5">
                                <p className="el-mono text-[10px] uppercase tracking-[0.24em] text-[#F46F4C]">
                                    El contraste que costó un token
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <span className="rounded-[10px] bg-[#F46F4C] px-3 py-2 text-sm font-bold text-white">
                                        Blanco · 2,91:1
                                    </span>
                                    <ArrowRight size={16} className="text-[#9C93B0]" />
                                    <span className="rounded-[10px] bg-[#F46F4C] px-3 py-2 text-sm font-bold text-[#1A0E0A]">
                                        onBrand #1A0E0A · 6,50:1
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#A79EBA]">
                                    El mismo par viaja como token único a la app, a la web y al panel de administración.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════ 07 · ONBOARDING Y CAMPAÑA ══════════════════ */}
            <section className="relative py-20 md:py-28">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <Tag n="07">Piezas gráficas</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Lo que ve el lector <span className="brand-gradient-text">antes de entrar</span>
                                </span>
                            }
                            lead="Las tres láminas del onboarding y los anuncios verticales con los que se presenta la app."
                        />
                    </div>
                </div>

                <div className="mt-10 px-4 md:px-6">
                    <DragRail className="mx-auto max-w-6xl">
                        {intros.map((m, i) => (
                            <div key={m.src} className="w-[200px] shrink-0 sm:w-[240px]">
                                <ShotCard
                                    src={m.src}
                                    alt={m.caption}
                                    caption={m.caption}
                                    className="[&_img]:aspect-[1284/1425] [&_img]:object-cover"
                                />
                                <p className="el-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[#9C93B0]">
                                    intro {i + 1}
                                </p>
                            </div>
                        ))}
                        {[spotEs, spotEn].map((v, i) =>
                            v ? (
                                <div key={v.src} className="w-[150px] shrink-0 sm:w-[170px]">
                                    <AutoVideo src={v.src} rounded="rounded-[16px]" />
                                    <p className="el-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[#9C93B0]">
                                        spot {i === 0 ? "es" : "en"}
                                    </p>
                                    <p className="mt-1 max-w-[170px] text-[11px] leading-tight text-[#9C93B0]/75">
                                        {v.caption}
                                    </p>
                                </div>
                            ) : null
                        )}
                    </DragRail>
                </div>
            </section>

            {/* ══════════════════ 08 · FUNCIONES: EL LIBRO QUE SALE ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="08">Funciones</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Quince títulos: <span className="brand-gradient-text">saca uno del estante</span>
                                </span>
                            }
                            lead="Toca cualquier lomo. El libro sale de la balda y se convierte en la ficha de esa funcionalidad."
                        />
                    </div>

                    <div className="mt-12 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex w-max items-end gap-[5px] px-1 pt-8">
                            {p.features.map((f, i) => {
                                const on = i === feature;
                                const [g0, g1] = MODULE_GRADS[i % MODULE_GRADS.length];
                                return (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => setFeature(i)}
                                        aria-pressed={on}
                                        aria-label={f}
                                        className="el-book el-spine relative flex shrink-0 items-center justify-center rounded-[3px]"
                                        style={{
                                            width: 30 + (i % 3) * 6,
                                            height: 148 + ((i * 23) % 58),
                                            background: on ? `linear-gradient(180deg, ${g0}, ${g1})` : undefined,
                                            boxShadow: on ? `0 0 28px ${g0}88` : undefined,
                                            borderColor: on ? "rgba(255,255,255,.28)" : undefined,
                                        }}
                                    >
                                        <span
                                            className="el-vert el-mono text-[10px] tracking-[0.2em]"
                                            style={{ color: on ? "#0D0B14" : "#6E657F" }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <ShelfBoard />

                    <motion.div
                        key={feature}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8 rounded-[22px] border border-white/8 bg-[#17141F] p-6 md:p-8"
                        style={{
                            borderLeft: `4px solid ${MODULE_GRADS[feature % MODULE_GRADS.length][0]}`,
                        }}
                    >
                        <p className="el-mono text-[10px] uppercase tracking-[0.28em] text-[#9C93B0]">
                            función {String(feature + 1).padStart(2, "0")} de {p.features.length}
                        </p>
                        <p className="el-display mt-3 text-lg font-semibold leading-relaxed md:text-2xl">
                            {p.features[feature]}
                        </p>
                    </motion.div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {p.features.map((f, i) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFeature(i)}
                                className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                                    i === feature
                                        ? "border-[#F46F4C] text-[#F46F4C]"
                                        : "border-white/10 text-[#6E657F] hover:border-white/25"
                                }`}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 09 · STACK COMO BALDAS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="09">Stack</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Siete baldas, <span className="brand-gradient-text">una por dominio</span>
                                </span>
                            }
                        />
                    </div>

                    <div className="mt-12 space-y-10">
                        {p.stack.map((group, gi) => (
                            <Reveal key={group.group} delay={gi * 0.05}>
                                <p className="el-mono text-[10px] uppercase tracking-[0.28em] text-[#F46F4C]">
                                    {group.group}
                                </p>
                                <div className="mt-3 overflow-x-auto scrollbar-none">
                                    <div className="flex w-max items-end gap-[4px] px-1">
                                        {group.items.map((item, ii) => (
                                            <span
                                                key={item}
                                                className="el-spine el-vert flex min-h-[96px] items-center justify-center whitespace-nowrap px-[7px] py-2 text-[9px] tracking-[0.06em] text-[#B7AEC7]"
                                                style={{
                                                    background:
                                                        (gi + ii) % 4 === 0
                                                            ? "linear-gradient(180deg,#241E33,#171326)"
                                                            : undefined,
                                                }}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <ShelfBoard />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 10 · ARQUITECTURA ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="10">Arquitectura</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    La estantería <span className="brand-gradient-text">tumbada</span>
                                </span>
                            }
                            lead="Los lomos se vuelven carriles: tres clientes, un backend y los servicios que se pagan por uso."
                        />
                    </div>

                    <div className="mt-12 space-y-3">
                        {LANES.map((lane, i) => (
                            <Reveal key={lane.label} delay={i * 0.08}>
                                <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-center">
                                    <p className="el-mono text-[11px] uppercase tracking-[0.2em] text-[#9C93B0]">
                                        {lane.label}
                                    </p>
                                    <div
                                        className="relative overflow-hidden rounded-[14px] border border-white/8 px-3 py-3"
                                        style={{ background: `linear-gradient(90deg, ${lane.tone}12, rgba(23,20,31,.7))` }}
                                    >
                                        <span
                                            aria-hidden
                                            className="el-pulse"
                                            style={{
                                                background: `linear-gradient(90deg, transparent, ${lane.tone}, transparent)`,
                                                animationDelay: `${i * 0.8}s`,
                                            }}
                                        />
                                        <div className="relative flex flex-wrap gap-2">
                                            {lane.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-[8px] border px-2.5 py-1 text-xs"
                                                    style={{
                                                        borderColor: `${lane.tone}44`,
                                                        color: "#DCD6E6",
                                                        background: "rgba(13,11,20,.55)",
                                                    }}
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

                    <Reveal className="mt-10">
                        <div className="rounded-[22px] border border-white/8 bg-[#17141F] p-6 md:p-8">
                            <p className="text-sm leading-relaxed text-[#B7AEC7] md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════════════ 11 · RETOS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="11">Retos</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Seis pares de lomos: <span className="brand-gradient-text">apagado y encendido</span>
                                </span>
                            }
                        />
                    </div>

                    <div className="mt-12 space-y-6">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.05}>
                                <div className="grid items-stretch gap-4 md:grid-cols-[1fr_44px_1fr] md:gap-0">
                                    <div className="flex gap-3 rounded-[18px] border border-white/8 bg-white/[0.02] p-5">
                                        <Spine w={12} h="auto" className="!h-auto self-stretch" />
                                        <div>
                                            <p className="el-mono text-[10px] uppercase tracking-[0.24em] text-[#6E657F]">
                                                problema {String(i + 1).padStart(2, "0")}
                                            </p>
                                            <p className="mt-2 text-sm leading-relaxed text-[#A79EBA]">{c.problem}</p>
                                        </div>
                                    </div>

                                    <div className="relative hidden items-center md:flex">
                                        <motion.span
                                            aria-hidden
                                            className="block h-[2px] w-full origin-left"
                                            style={{ background: "linear-gradient(90deg, #2C2739, #F46F4C)" }}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true, amount: 0.6 }}
                                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </div>

                                    <div
                                        className="flex gap-3 rounded-[18px] p-5"
                                        style={{
                                            border: "1px solid rgba(244,111,76,.3)",
                                            background: "linear-gradient(140deg, rgba(244,111,76,.10), rgba(23,20,31,.7))",
                                        }}
                                    >
                                        <Spine w={12} h="auto" on className="!h-auto self-stretch" />
                                        <div>
                                            <p className="el-mono text-[10px] uppercase tracking-[0.24em] text-[#F46F4C]">
                                                solución
                                            </p>
                                            <p className="mt-2 text-sm leading-relaxed text-[#CFC7DE]">{c.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ 12 · MÉTRICAS ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <Tag n="12">Las cifras</Tag>
                    <div className="mt-6">
                        <SectionHead
                            title={
                                <span className="el-display">
                                    Cada número, <span className="brand-gradient-text">un título impreso</span>
                                </span>
                            }
                        />
                    </div>

                    <div className="mt-14 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex w-max items-end gap-[6px] px-1">
                            {p.metrics.map((m, i) => {
                                const h = METRIC_HEIGHTS[i % METRIC_HEIGHTS.length];
                                return (
                                    <Spine key={m.label} w={110} h={h} className="overflow-hidden">
                                        <span
                                            aria-hidden
                                            className="absolute inset-x-0 top-0 h-[3px]"
                                            style={{ background: "linear-gradient(90deg,#F46F4C,#B388FF)" }}
                                        />
                                        <span
                                            className="absolute left-1/2 top-1/2 block"
                                            style={{
                                                width: h - 48,
                                                transform: "translate(-50%, -50%) rotate(-90deg)",
                                            }}
                                        >
                                            <CountMetric value={m.value} label={m.label} />
                                        </span>
                                    </Spine>
                                );
                            })}
                        </div>
                    </div>
                    <ShelfBoard />
                    <p className="el-mono mt-6 text-[10px] uppercase tracking-[0.24em] text-[#9C93B0]">
                        desliza la balda →
                    </p>
                </div>
            </section>

            {/* ══════════════════ 13 · EN CORTO ══════════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-4xl">
                    <Tag n="13">En corto</Tag>

                    <div className="mt-8 flex flex-wrap items-center gap-5">
                        {bookmarkSvg && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={bookmarkSvg.src} alt={bookmarkSvg.caption} className="h-12 w-12 anim-float" />
                        )}
                        {splashLight && (
                            <span className="rounded-[16px] bg-[#F6F4FA] p-2">
                                <Image
                                    src={splashLight.src}
                                    alt={splashLight.caption}
                                    width={56}
                                    height={56}
                                    className="h-12 w-12 object-contain"
                                />
                            </span>
                        )}
                        {splashDark && (
                            <span className="rounded-[16px] bg-[#17141F] p-2">
                                <Image
                                    src={splashDark.src}
                                    alt={splashDark.caption}
                                    width={56}
                                    height={56}
                                    className="h-12 w-12 object-contain"
                                />
                            </span>
                        )}
                        <span className="el-mono text-[10px] uppercase tracking-[0.2em] text-[#9C93B0]">
                            marca en claro y en oscuro
                        </span>
                    </div>

                    <Stagger className="mt-8 space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={`leading-relaxed ${
                                        i === 0 ? "text-lg text-[#EDE7F5] md:text-xl" : "text-sm text-[#A79EBA] md:text-base"
                                    }`}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <div className="mt-10 flex items-start gap-3 rounded-[18px] border border-white/8 bg-[#17141F] p-5">
                        <Quote size={18} className="mt-1 shrink-0 text-[#F46F4C]" />
                        <p className="text-sm leading-relaxed text-[#B7AEC7]">
                            La luz de esta página viene de los lomos: el mismo naranja #F46F4C que en la app marca el
                            progreso, la racha y el botón que abre Google Play.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════ CINTA + CIERRE ══════════════════ */}
            <div className="el-mono border-y border-white/8 py-6 text-[11px] uppercase tracking-[0.2em] text-[#9C93B0]">
                <Marquee
                    items={[
                        "Lector EPUB propio",
                        "RSVP 100–800 ppm",
                        "Narración con créditos",
                        "EduGenius sobre Gemini",
                        "Offline con concesiones firmadas",
                        "Racha diaria",
                        "Español · English",
                    ]}
                    speed={36}
                    separator="│"
                />
            </div>

            <div className="el-final relative pb-32">
                <div aria-hidden className="flex items-end justify-center gap-[4px] px-4 pt-16">
                    {HERO_SPINES.slice(0, 30).map((s, i) => (
                        <Spine key={i} w={s.w * 0.7} h={30 + ((i * 17) % 46)} />
                    ))}
                </div>

                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una app de lectura con su propio lector EPUB, su motor de lectura rápida, narración medida por créditos y una IA que no se sale de presupuesto — más la web y el panel que la sostienen. Si tienes un producto de contenido que cobrar y escalar, es el terreno que conozco."
                />

                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="el-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#9C93B0] transition-colors hover:text-[#F46F4C]"
                    >
                        volver a la estantería <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
