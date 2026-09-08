"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    Bookmark,
    BookOpen,
    ChevronLeft,
    Copy,
    Flame,
    Headphones,
    Heart,
    Highlighter,
    LayoutDashboard,
    List,
    Lock,
    MoreVertical,
    Plus,
    Quote,
    Rewind,
    Search,
    Send,
    Server,
    Smartphone,
    Sparkles,
    Star,
    Volume2,
    WifiOff,
    X,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, ProjectOutro } from "@/components/projects/bits";
import { DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("nebula")!;
const nxt = nextProject("nebula");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const media = (file: string) => p.media.find((m) => m.src.endsWith(file));

const logo = media("logo.png");
const icon = media("icon.png");
const launcher = media("ic_launcher.png");
const appleIcon = media("apple-touch-icon.png");
const favicon = media("favicon.svg");
const onboarding = p.media.filter((m) => m.src.includes("onboarding_"));
const ambients = [media("fantasy_1.jpg"), media("scifi_1.jpg"), media("mystery_1.jpg")].filter(
    (m): m is NonNullable<typeof m> => Boolean(m)
);
const ambientNames = ["Fantasía", "Ciencia ficción", "Misterio"];
const gallery = [...onboarding, media("og.jpg"), media("email-header.png")].filter(
    (m): m is NonNullable<typeof m> => Boolean(m)
);

/* La proporción real de cada lámina: el marco reserva el hueco antes de que cargue. */
const shotAspect = (src: string) =>
    src.includes("onboarding_")
        ? "[&_img]:aspect-[768/1408]"
        : src.endsWith("og.jpg")
        ? "[&_img]:aspect-[1200/630]"
        : "[&_img]:aspect-[1120/280]";

/* Cielo de fondo: estrellas fijas, generadas de forma determinista por índice. */
const twinkles = Array.from({ length: 30 }, (_, i) => ({
    left: ((i * 37 + 11) % 100),
    top: ((i * 61 + 7) % 100),
    delay: (i % 8) * 0.7,
    size: i % 5 === 0 ? 2.4 : 1.4,
}));

/* Palabras del modo RSVP con la posición de la letra pivote. */
const RSVP: { word: string; pivot: number }[] = [
    { word: "descubrir", pivot: 3 },
    { word: "nebulosa", pivot: 3 },
    { word: "silencio", pivot: 2 },
    { word: "constelación", pivot: 4 },
    { word: "memoria", pivot: 2 },
    { word: "viaje", pivot: 1 },
];

/* Los cuatro modos de consumo que describe la solución. */
const MODES = [
    { icon: BookOpen, name: "Lector", note: "8 temas · 10 tipografías" },
    { icon: Rewind, name: "Lectura rápida", note: "RSVP con letra pivote" },
    { icon: Headphones, name: "Escucha", note: "TTS con sesión de medios" },
    { icon: Sparkles, name: "Nova", note: "IA sobre el libro abierto" },
];

/* Índices de p.features que siguen funcionando con el avión en modo vuelo. */
const OFFLINE_FEATURES = [1, 2, 3, 6, 7, 11, 12, 16, 17];

/* Constelación de métricas: posición en % dentro del lienzo, por grupos. */
const CONSTELLATION: { x: number; y: number }[] = [
    { x: 9, y: 30 }, // 158 archivos
    { x: 22, y: 12 }, // ~99.200 líneas
    { x: 17, y: 54 }, // 31 rutas
    { x: 34, y: 34 }, // 26 functions
    { x: 45, y: 13 }, // 39 idiomas
    { x: 50, y: 52 }, // 1.929 claves
    { x: 62, y: 30 }, // 618 pruebas
    { x: 58, y: 74 }, // 11 colecciones
    { x: 75, y: 14 }, // 76 cosméticos
    { x: 86, y: 38 }, // 32 logros
    { x: 77, y: 56 }, // 24 temas
    { x: 92, y: 76 }, // 3 superficies
];

const LINKS: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [5, 7],
    [6, 8],
    [6, 9],
    [9, 10],
    [10, 11],
];

const css = `
.nb-mono { font-family: "Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.nb-caps { text-transform: uppercase; letter-spacing: 0.34em; }
.nb-measure { max-width: 62ch; }

/* ── el cielo del fondo ── */
.nb-sky {
  background-image:
    radial-gradient(1px 1px at 24px 30px, rgba(242,244,255,0.42), transparent 100%),
    radial-gradient(1px 1px at 132px 88px, rgba(242,244,255,0.28), transparent 100%),
    radial-gradient(1.6px 1.6px at 196px 40px, rgba(108,77,244,0.42), transparent 100%),
    radial-gradient(1px 1px at 88px 150px, rgba(77,159,244,0.30), transparent 100%);
  background-size: 240px 190px;
}
.nb-tw { animation: nb-tw 4.2s ease-in-out infinite; }
@keyframes nb-tw { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.95; } }

/* ── la hoja: cada sección es una página que se pasa ── */
.nb-sheet {
  position: relative;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(20,26,51,0.94), rgba(20,26,51,0.66));
  box-shadow: 0 44px 90px -46px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.05);
  opacity: 0;
  transform: translateY(24px);
}
.nb-sheet::before {
  content: "";
  position: absolute;
  left: 0; top: 22px; bottom: 22px;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(180deg, transparent, rgba(108,77,244,0.65), rgba(77,159,244,0.35), transparent);
}
.nb-sheet.is-in { animation: nb-fade 0.85s cubic-bezier(0.22,1,0.36,1) forwards; }
@keyframes nb-fade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.nb-shade {
  position: absolute; inset: 0; border-radius: 24px; pointer-events: none; opacity: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.9), rgba(0,0,0,0.25) 45%, transparent 72%);
}
@media (min-width: 900px) {
  .nb-sheet { transform: perspective(1400px) rotateY(-30deg) translateX(-12px); transform-origin: left center; }
  .nb-sheet.is-in { animation: nb-turn 1.05s cubic-bezier(0.22,1,0.36,1) forwards; }
  .nb-sheet.is-in .nb-shade { animation: nb-unshade 1.05s ease-out forwards; }
  @keyframes nb-turn {
    from { opacity: 0.2; transform: perspective(1400px) rotateY(-30deg) translateX(-12px); }
    to { opacity: 1; transform: perspective(1400px) rotateY(0deg) translateX(0); }
  }
  @keyframes nb-unshade { from { opacity: 0.95; } 55% { opacity: 0.4; } to { opacity: 0; } }
}

/* ── tratamiento editorial ── */
.nb-drop::first-letter {
  float: left;
  font-size: 3.4em;
  line-height: 0.82;
  font-weight: 800;
  padding: 0.06em 0.1em 0 0;
  color: var(--brand-primary);
}
.nb-rule { transform-origin: left; animation: nb-rule 1.5s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
@keyframes nb-rule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.nb-mark {
  background-image: linear-gradient(rgba(108,77,244,0.42), rgba(108,77,244,0.42));
  background-repeat: no-repeat;
  background-size: 0% 100%;
  border-radius: 3px;
  padding: 0 2px;
}
.is-in .nb-mark { animation: nb-mark 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
@keyframes nb-mark { to { background-size: 100% 100%; } }

/* ── el búho del hero: tres ritmos distintos ── */
.nb-halo-pulse { animation: nb-pulse 2.6s ease-in-out infinite; }
@keyframes nb-pulse { 0%, 100% { opacity: 0.28; transform: scale(0.94); } 50% { opacity: 0.6; transform: scale(1.08); } }
.nb-breathe { animation: nb-breathe 2.2s ease-in-out infinite; }
@keyframes nb-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.045); } }
.nb-glint { animation: nb-glint 1.6s ease-in-out infinite; }
@keyframes nb-glint { 0%, 72%, 100% { opacity: 0; } 82% { opacity: 0.9; } }

/* ── mockups ── */
.nb-ken { animation: nb-ken 24s ease-in-out infinite alternate; }
@keyframes nb-ken { from { transform: scale(1.1) translate3d(0,0,0); } to { transform: scale(1.24) translate3d(-3%, -2.5%, 0); } }
.nb-dust { animation: nb-dust 7s ease-in-out infinite; }
@keyframes nb-dust { 0%, 100% { transform: translateY(0); opacity: 0.35; } 50% { transform: translateY(-16px); opacity: 0.9; } }
.nb-ring { animation: nb-spin 14s linear infinite; }
@keyframes nb-spin { to { transform: rotate(360deg); } }

/* ── sin internet: la demostración ── */
.nb-offline.is-in .nb-desat { animation: nb-desat 2.8s ease-in-out 0.35s 1; }
@keyframes nb-desat {
  0% { filter: none; }
  22%, 58% { filter: saturate(0.05) brightness(0.86); }
  100% { filter: none; }
}
.nb-offline.is-in .nb-slash { animation: nb-slash 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
.nb-slash { transform-origin: left center; transform: scaleX(0); }
@keyframes nb-slash { to { transform: scaleX(1); } }

/* ── constelación de cifras ── */
.nb-star-dot { box-shadow: 0 0 10px rgba(34,211,238,0.85), 0 0 26px rgba(34,211,238,0.35); }

/* ── arquitectura ── */
.nb-flow { stroke-dasharray: 5 9; animation: nb-flow 1.6s linear infinite; }
@keyframes nb-flow { to { stroke-dashoffset: -28; } }

@media (prefers-reduced-motion: reduce) {
  .nb-tw, .nb-rule, .is-in .nb-mark, .nb-halo-pulse, .nb-breathe, .nb-glint,
  .nb-ken, .nb-dust, .nb-ring, .nb-flow,
  .nb-offline.is-in .nb-desat, .nb-offline.is-in .nb-slash { animation: none !important; }
  .nb-mark { background-size: 100% 100%; }
  .nb-slash { transform: scaleX(1); }
  .nb-sheet { transform: none !important; }
  .nb-sheet.is-in { animation: nb-fade 0.01s linear forwards !important; }
}
`;

/* ---------------------------------------------------------------- */
/* Hoja de papel: sección-página con folio, giro y sombra de canto.  */
/* ---------------------------------------------------------------- */

const Sheet = ({
    id,
    folio,
    chapter,
    children,
    className,
    inner,
}: {
    id: string;
    folio: string;
    chapter: string;
    children: React.ReactNode;
    className?: string;
    inner?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (typeof IntersectionObserver === "undefined") {
            node.classList.add("is-in");
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                node.classList.add("is-in");
                observer.disconnect();
            },
            { threshold: 0.06, rootMargin: "0px 0px -8% 0px" }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <section id={id} data-nb-page className="relative z-10 px-3 py-6 sm:px-5 md:py-9">
            <div ref={ref} className={`nb-sheet mx-auto max-w-5xl ${className ?? ""}`}>
                <span aria-hidden className="nb-shade" />
                <div className={`relative px-5 pt-10 pb-16 sm:px-8 md:px-14 md:pt-14 md:pb-20 ${inner ?? ""}`}>
                    {children}
                </div>
                <span className="nb-mono nb-caps absolute bottom-5 right-6 text-[9px] text-[#F2F4FF]/30 md:right-10">
                    {chapter} · {folio}
                </span>
            </div>
        </section>
    );
};

/** Rótulo de capítulo en versalitas, con filete cian corto. */
const Kicker = ({ children }: { children: React.ReactNode }) => (
    <p className="nb-mono nb-caps flex items-center gap-3 text-[10px] text-[#22D3EE]">
        <span aria-hidden className="h-px w-6 bg-[#22D3EE]/70" />
        {children}
    </p>
);

const Title = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.01em] md:text-[42px] ${className ?? ""}`}>
        {children}
    </h2>
);

/* ---------------------------------------------------------------- */
/* Mockups recreados en CSS a partir de p.uiScreens                  */
/* ---------------------------------------------------------------- */

const BOOKS = [
    { title: "El jardín de las horas", author: "M. Arriaga", pct: 62, from: "#6C4DF4", to: "#22D3EE" },
    { title: "Cartografía del insomnio", author: "L. Berenguer", pct: 18, from: "#4D9FF4", to: "#6C4DF4" },
    { title: "Los que miran arriba", author: "T. Okonkwo", pct: 91, from: "#22D3EE", to: "#4D9FF4" },
    { title: "Nada que devolver", author: "S. Vidal", pct: 7, from: "#8B5CF6", to: "#4D9FF4" },
];

/** 1 · Biblioteca (Home) */
const MockLibrary = () => (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0E1D] text-[#F2F4FF]">
        <span aria-hidden className="nb-sky absolute inset-0 opacity-60" />

        <div className="relative flex items-center gap-2 px-3 pt-9">
            <span className="relative grid h-7 w-7 shrink-0 place-items-center">
                <span aria-hidden className="nb-halo-pulse absolute inset-0 rounded-full bg-[#6C4DF4]/60 blur-[6px]" />
                {logo && (
                    <Image src={logo.src} alt="" width={28} height={28} className="nb-breathe relative h-7 w-7 object-contain" />
                )}
            </span>
            <span className="text-[13px] font-bold tracking-tight">Nébula</span>
            <span className="flex-1" />
            <Search size={12} className="opacity-70" />
            <span className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-1.5 py-0.5 text-[8px] text-[#FBBF24]">
                <Flame size={8} /> 12
            </span>
            <MoreVertical size={12} className="opacity-70" />
        </div>

        <div className="relative mt-3 flex gap-1.5 overflow-hidden px-3">
            {["Todos", "Leyendo", "Por leer", "Terminados"].map((chip, i) => (
                <span
                    key={chip}
                    className="whitespace-nowrap rounded-full px-2 py-[3px] text-[8px] font-semibold"
                    style={
                        i === 0
                            ? { backgroundImage: "linear-gradient(135deg,#6C4DF4,#4D9FF4)", color: "#F2F4FF" }
                            : { background: "#141A33", border: "1px solid rgba(255,255,255,0.08)", color: "#9AA3C7" }
                    }
                >
                    {chip}
                </span>
            ))}
        </div>

        <div className="relative mx-3 mt-3 flex items-center gap-3 rounded-[14px] border border-white/[0.07] bg-[#141A33] p-2.5">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center">
                <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="3" />
                    <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="94.2"
                        strokeDashoffset="28"
                    />
                </svg>
                <span className="nb-mono absolute text-[9px] font-bold">24</span>
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[9.5px] font-bold">Tu semana lectora</p>
                <p className="text-[8px] text-[#9AA3C7]">Meta diaria · 24 de 30 min</p>
                <div className="mt-1.5 flex gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F59E0B]/[0.12] px-1.5 py-[2px] text-[7.5px] text-[#FBBF24]">
                        <Flame size={8} /> 12 días
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#6C4DF4]/[0.15] px-1.5 py-[2px] text-[7.5px] text-[#B7A5FF]">
                        <BookOpen size={8} /> 8 libros
                    </span>
                </div>
            </div>
        </div>

        <div className="relative mt-3 px-3">
            <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold">Favoritos</p>
                <span className="text-[7.5px] text-[#9AA3C7]">Ver todo</span>
            </div>
            <div className="mt-1.5 flex gap-1.5 overflow-hidden">
                {BOOKS.slice(0, 4).map((b) => (
                    <span
                        key={b.title}
                        className="relative h-[46px] w-[32px] shrink-0 rounded-[4px]"
                        style={{ backgroundImage: `linear-gradient(150deg, ${b.from}, ${b.to})` }}
                    >
                        <Heart size={7} className="absolute right-[3px] top-[3px] fill-white text-white/90" />
                    </span>
                ))}
            </div>
        </div>

        <div className="relative mt-3 px-3">
            <p className="text-[9px] font-bold">Mis libros</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
                {BOOKS.map((b) => (
                    <div key={b.title}>
                        <div
                            className="h-[74px] w-full rounded-[6px]"
                            style={{ backgroundImage: `linear-gradient(150deg, ${b.from}, ${b.to})` }}
                        />
                        <p className="mt-1 line-clamp-2 text-[8.5px] font-semibold leading-tight">{b.title}</p>
                        <p className="text-[7.5px] text-[#9AA3C7]">{b.author}</p>
                        <span className="mt-1 block h-[2px] w-full rounded-full bg-white/[0.08]">
                            <span className="block h-full rounded-full bg-[#6C4DF4]" style={{ width: `${b.pct}%` }} />
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <span
            className="absolute bottom-5 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[8.5px] font-bold text-white shadow-lg"
            style={{ backgroundImage: "linear-gradient(135deg,#6C4DF4,#4D9FF4)" }}
        >
            <Plus size={10} /> Importar libro
        </span>
    </div>
);

/** 2 · Lectura Rápida (RSVP) */
const MockRsvp = ({ ambient, onAmbient }: { ambient: number; onAmbient: (i: number) => void }) => {
    const reduce = useReducedMotion();
    const [i, setI] = useState(0);

    useEffect(() => {
        if (reduce) return;
        const id = window.setInterval(() => setI((v) => (v + 1) % RSVP.length), 950);
        return () => window.clearInterval(id);
    }, [reduce]);

    const { word, pivot } = RSVP[i];
    const bg = ambients[ambient];

    return (
        <div className="absolute inset-0 overflow-hidden bg-black">
            {bg && (
                <Image
                    src={bg.src}
                    alt=""
                    fill
                    sizes="320px"
                    className="nb-ken object-cover opacity-70"
                />
            )}
            <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.88))" }}
            />
            {[
                { l: 18, t: 34 },
                { l: 72, t: 26 },
                { l: 44, t: 62 },
                { l: 84, t: 70 },
                { l: 28, t: 78 },
            ].map((d, n) => (
                <span
                    key={n}
                    aria-hidden
                    className="nb-dust absolute h-[3px] w-[3px] rounded-full bg-[#22D3EE]"
                    style={{ left: `${d.l}%`, top: `${d.t}%`, animationDelay: `${n * 0.9}s` }}
                />
            ))}

            <div className="absolute inset-x-0 top-9 flex items-center justify-between px-3">
                <X size={13} className="text-white/80" />
                <div className="flex gap-1">
                    {[<Volume2 key="v" size={9} />, "420 ppm", <List key="l" size={9} />].map((el, n) => (
                        <span
                            key={n}
                            className="nb-mono inline-flex items-center rounded-full border border-white/[0.15] bg-white/10 px-1.5 py-[3px] text-[7.5px] text-white/[0.85] backdrop-blur-sm"
                        >
                            {el}
                        </span>
                    ))}
                </div>
            </div>

            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <span aria-hidden className="absolute inset-x-6 top-1/2 h-px bg-white/20" />
                <p className="nb-mono relative text-center text-[19px] font-bold tracking-tight text-white">
                    {word.slice(0, pivot)}
                    <span className="text-[#22D3EE]">{word[pivot]}</span>
                    {word.slice(pivot + 1)}
                </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 px-3 pb-6">
                <div className="flex gap-1">
                    {ambients.map((a, n) => (
                        <button
                            key={a.src}
                            type="button"
                            onClick={() => onAmbient(n)}
                            aria-label={`Ambiente ${ambientNames[n]}`}
                            className={`h-4 flex-1 rounded-[3px] border transition-colors ${
                                n === ambient ? "border-[#22D3EE]" : "border-white/[0.15]"
                            }`}
                            style={{ backgroundImage: `url(${a.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                        />
                    ))}
                </div>

                <div className="mt-2.5 h-[3px] w-full rounded-full bg-white/[0.15]">
                    <span className="block h-full w-[64%] rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                </div>
                <div className="mt-1 h-[3px] w-full rounded-full bg-white/10">
                    <span className="block h-full w-[38%] rounded-full bg-white/75" />
                </div>
                <div className="nb-mono mt-1.5 flex justify-between text-[7.5px] text-white/[0.55]">
                    <span>Capítulo 4 de 21</span>
                    <span>38% · Restante: 1 h 12 min</span>
                </div>
                <p className="mt-2 text-center text-[9px] font-extrabold text-white">El jardín de las horas</p>
                <p className="text-center text-[7.5px] text-white/40">IV · La casa sin relojes</p>
            </div>
        </div>
    );
};

/** 3 · Lector (tema sepia, con menú de selección propio) */
const MockReader = () => (
    <div className="absolute inset-0 overflow-hidden bg-[#F3E6CE] text-[#3A3226]">
        <div className="flex items-center gap-2 px-3 pt-9 pb-2">
            <ChevronLeft size={12} className="opacity-60" />
            <span className="flex-1 truncate text-[8.5px] font-semibold opacity-70">IV · La casa sin relojes</span>
            <span className="nb-mono inline-flex items-center gap-1 rounded-full bg-[#6C4DF4]/[0.15] px-1.5 py-[2px] text-[7px] text-[#4B33B8]">
                <Star size={7} className="fill-[#4B33B8]" /> 24:31 · +18
            </span>
            <Bookmark size={11} className="fill-[#8B6B2E] text-[#8B6B2E]" />
            <MoreVertical size={11} className="opacity-60" />
        </div>

        <div className="px-4 text-[8.6px] leading-[1.85]" style={{ textAlign: "justify" }}>
            <p>
                La ciudad dormía bajo una manta de polvo azul. Nadie miraba ya hacia arriba y, aun así,{" "}
                <span className="rounded-[2px] bg-[#6C4DF4]/30 px-[1px]">
                    el cielo seguía escribiendo su historia cada noche
                </span>
                , paciente, como quien espera a un lector que tarda en llegar.
            </p>
            <p className="mt-2">
                Irene guardaba las horas en cajas de hojalata. Decía que el tiempo no se pierde: se traspapela. Y que basta con
                abrir la caja correcta —<span className="rounded-[2px] bg-[#F59E0B]/40 px-[1px]">la que huele a lluvia</span>—
                para volver a cualquier tarde.
            </p>
            <p className="mt-2">
                Aquella noche abrió la última. Dentro no había nada, salvo una lista de nombres escrita con una letra que no era
                la suya y una fecha que todavía no había ocurrido.
            </p>
            <p className="mt-2">
                Bajó al portal con la caja bajo el brazo. La calle olía a metal mojado y las farolas parpadeaban en un orden que
                le pareció deliberado, como si alguien estuviera contando en voz baja.
            </p>
            <p className="mt-2">
                En la esquina, el quiosco cerrado devolvía su reflejo partido en dos. Irene se quedó mirándolo más tiempo del
                razonable, buscando en el cristal la parte de sí misma que faltaba en la lista.
            </p>
            <p className="mt-2">
                Cuando levantó la vista, el cielo había cambiado de sitio las estrellas. No muchas: solo las suficientes para que
                una mujer que guardaba horas en cajas supiera que el tiempo, esta vez, no se había traspapelado solo.
            </p>
        </div>

        <div className="absolute inset-x-4 top-[46%] rounded-[10px] border border-white/10 bg-[#141A33] p-2 shadow-xl">
            <div className="flex justify-between px-1">
                {["#F59E0B", "#22D3EE", "#6C4DF4", "#34D399", "#F472B6"].map((c) => (
                    <span key={c} className="h-4 w-4 rounded-full ring-1 ring-white/20" style={{ background: c }} />
                ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-[7px] text-[#F2F4FF]">
                {[
                    { label: "Guardar cita", icon: <Quote key="q" size={8} /> },
                    { label: "Preguntar a Nova", icon: <Sparkles key="s" size={8} /> },
                    { label: "Copiar", icon: <Copy key="c" size={8} /> },
                ].map((a) => (
                    <span
                        key={a.label}
                        className="inline-flex items-center justify-center gap-1 rounded-[5px] border border-white/10 bg-white/5 px-1 py-1 text-center leading-tight"
                    >
                        {a.icon}
                        {a.label}
                    </span>
                ))}
            </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-black/10 bg-[#EFE0C4] px-3 py-2">
            <span className="nb-mono text-[7.5px] opacity-60">38% del libro</span>
            <span className="flex gap-[3px]">
                {["#3A3226", "#F3E6CE", "#0B0E1D", "#1B3A2F", "#3A1F2B"].map((c) => (
                    <span key={c} className="h-2.5 w-2.5 rounded-full ring-1 ring-black/[0.15]" style={{ background: c }} />
                ))}
            </span>
            <span className="nb-mono text-[7.5px] opacity-60">1 h 12 min</span>
        </div>
    </div>
);

/** 4 · Nova, la IA lectora */
const MockNova = () => (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0E1D] text-[#F2F4FF]">
        <span aria-hidden className="nb-sky absolute inset-0 opacity-40" />

        <div className="relative flex items-center gap-2 px-3 pt-9">
            <span className="relative grid h-10 w-10 place-items-center">
                <span
                    aria-hidden
                    className="nb-ring absolute inset-0 rounded-full"
                    style={{ background: "conic-gradient(from 0deg, transparent, #22D3EE, transparent 55%)", opacity: 0.5 }}
                />
                <span className="absolute inset-[3px] rounded-full bg-[#141A33]" />
                {logo && <Image src={logo.src} alt="" width={28} height={28} className="relative h-7 w-7 object-contain" />}
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-bold">Nova</p>
                <p className="nb-mono text-[7.5px] text-[#9AA3C7]">Nivel 12 · quedan 7 de 10 consultas</p>
            </div>
        </div>

        <div className="absolute inset-x-0 bottom-[88px] space-y-2 px-3">
            <div className="ml-auto w-[74%] rounded-[12px] rounded-br-[4px] px-2.5 py-1.5 text-[8.5px] leading-relaxed text-white"
                style={{ backgroundImage: "linear-gradient(135deg,#6C4DF4,#4D9FF4)" }}>
                ¿Quién narra el capítulo 4?
            </div>
            <div className="w-[88%] rounded-[12px] rounded-bl-[4px] border border-white/[0.08] bg-[#141A33] px-2.5 py-1.5 text-[8.5px] leading-[1.5] text-[#F2F4FF]">
                Sigue siendo Irene, pero por primera vez habla en pasado: el capítulo entero es un recuerdo. Fíjate en el cambio
                de tiempo verbal justo después de la caja de hojalata.
            </div>
            <div className="ml-auto w-[52%] rounded-[12px] rounded-br-[4px] px-2.5 py-1.5 text-[8.5px] text-white"
                style={{ backgroundImage: "linear-gradient(135deg,#6C4DF4,#4D9FF4)" }}>
                Hazme un cuestionario
            </div>
            <div className="w-[80%] rounded-[12px] rounded-bl-[4px] border border-white/[0.08] bg-[#141A33] px-2.5 py-1.5 text-[8.5px] leading-[1.5]">
                Van tres preguntas sobre lo que llevas leído, sin destripar nada de lo que viene después.
            </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-3 pb-5">
            <div className="flex gap-1 overflow-hidden pb-2">
                {["Resumen", "Personajes", "Cuestionario", "Explicar esto"].map((chip) => (
                    <span
                        key={chip}
                        className="whitespace-nowrap rounded-full border border-white/10 bg-[#141A33] px-2 py-[3px] text-[7.5px] text-[#9AA3C7]"
                    >
                        {chip}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#141A33] px-3 py-1.5">
                <span className="flex-1 text-[8px] text-[#9AA3C7]">Pregunta sobre el libro abierto…</span>
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#22D3EE] text-[#0B0E1D]">
                    <Send size={9} />
                </span>
            </div>
        </div>
    </div>
);

/** 5 · Constelaciones */
const SKY_STARS = Array.from({ length: 46 }, (_, i) => ({
    x: (i * 53 + 13) % 100,
    y: (i * 29 + 7) % 100,
    r: i % 6 === 0 ? 1.1 : 0.6,
}));

const MockSky = () => (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0E1D] text-[#F2F4FF]">
        <svg viewBox="0 0 100 190" className="absolute inset-0 h-full w-full">
            {SKY_STARS.map((s, i) => (
                <circle key={i} cx={s.x} cy={(s.y * 190) / 100} r={s.r} fill="#F2F4FF" opacity={i % 3 === 0 ? 0.4 : 0.18} />
            ))}
            <g stroke="#6C4DF4" strokeOpacity="0.4" strokeWidth="0.4" fill="none">
                <path d="M22 52 L38 40 L52 56 L44 74 L26 70 Z" />
                <path d="M62 104 L76 96 L84 112 L70 126 Z" />
                <path d="M26 132 L40 140 L34 156" />
            </g>
            {[
                [22, 52],
                [38, 40],
                [52, 56],
                [44, 74],
                [26, 70],
                [62, 104],
                [76, 96],
                [84, 112],
                [70, 126],
                [26, 132],
                [40, 140],
                [34, 156],
            ].map(([cx, cy], i) => (
                <g key={i}>
                    <circle cx={cx} cy={cy} r={2.6} fill="#22D3EE" opacity="0.18" />
                    <circle cx={cx} cy={cy} r={i % 4 === 0 ? 1.5 : 1.05} fill="#22D3EE" />
                </g>
            ))}
            <text x="30" y="34" fill="#F2F4FF" fillOpacity="0.55" fontSize="3.4" letterSpacing="0.8">
                EL DRAGÓN
            </text>
            <text x="66" y="90" fill="#F2F4FF" fillOpacity="0.55" fontSize="3.4" letterSpacing="0.8">
                LA LUPA
            </text>
            <text x="24" y="126" fill="#F2F4FF" fillOpacity="0.55" fontSize="3.4" letterSpacing="0.8">
                LA BRÚJULA
            </text>
        </svg>

        <span className="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.15] bg-white/10 px-2.5 py-1 text-[8px] backdrop-blur-sm">
            5 de 8 constelaciones
        </span>

        <div className="absolute inset-x-2 bottom-4 rounded-[12px] border border-white/10 bg-[#141A33]/95 p-2.5 backdrop-blur-sm">
            <div className="flex gap-2">
                <span
                    className="h-11 w-8 shrink-0 rounded-[4px]"
                    style={{ backgroundImage: "linear-gradient(150deg,#6C4DF4,#22D3EE)" }}
                />
                <div className="min-w-0">
                    <p className="truncate text-[9px] font-bold">El jardín de las horas</p>
                    <p className="nb-mono text-[7.5px] text-[#9AA3C7]">Terminado el 14 de marzo</p>
                    <p className="nb-mono text-[7.5px] text-[#22D3EE]">412 min · 9,2 / 10</p>
                </div>
            </div>
            <p className="mt-1.5 text-[7.5px] leading-snug text-[#9AA3C7]">
                Toca una estrella para revivir su libro.
            </p>
        </div>
    </div>
);

/* ---------------------------------------------------------------- */

const SCREENS = [
    { idx: 0, label: "Biblioteca", note: "Lo primero que se ve: la nebulosa propia, con la semana lectora arriba." },
    { idx: 1, label: "Lectura rápida", note: "Pantalla completa, ambiente propio y una sola palabra con letra pivote." },
    { idx: 2, label: "Lector", note: "Ocho temas, diez tipografías y un menú de selección que sustituye al del sistema." },
    { idx: 5, label: "Nova", note: "La IA responde sobre el libro abierto; la clave vive en el servidor." },
    { idx: 3, label: "Constelaciones", note: "Cada libro terminado enciende una estrella con posición estable." },
];

const Landing = () => {
    const reduce = useReducedMotion();
    const [screen, setScreen] = useState(0);
    const [ambient, setAmbient] = useState(0);

    const px = useSpring(useMotionValue(0), { stiffness: 30, damping: 20 });
    const py = useSpring(useMotionValue(0), { stiffness: 30, damping: 20 });
    const ix = useTransform(px, (v) => -v);
    const iy = useTransform(py, (v) => -v);

    /* Los halos de nebulosa siguen al ratón, nunca más de 20 px. */
    useEffect(() => {
        if (reduce) return;
        const onMove = (event: MouseEvent) => {
            px.set((event.clientX / window.innerWidth - 0.5) * 40);
            py.set((event.clientY / window.innerHeight - 0.5) * 40);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [px, py, reduce]);

    /* Las flechas del teclado pasan de página, como en un libro. */
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            const active = document.activeElement;
            if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
            const pages = Array.from(document.querySelectorAll<HTMLElement>("[data-nb-page]"));
            if (!pages.length) return;
            const current = pages.findIndex((node) => node.getBoundingClientRect().bottom > 140);
            const base = current < 0 ? pages.length - 1 : current;
            const target = pages[Math.min(pages.length - 1, Math.max(0, base + (event.key === "ArrowRight" ? 1 : -1)))];
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [reduce]);

    const current = SCREENS[screen];

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ───────── cielo fijo + halos de nebulosa ───────── */}
            <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
                <span className="nb-sky absolute inset-0 opacity-70" />
                {twinkles.map((t, i) => (
                    <span
                        key={i}
                        className="nb-tw absolute rounded-full bg-[#F2F4FF]"
                        style={{
                            left: `${t.left}%`,
                            top: `${t.top}%`,
                            height: t.size,
                            width: t.size,
                            animationDelay: `${t.delay}s`,
                        }}
                    />
                ))}
                <motion.span
                    style={{ x: px, y: py }}
                    className="absolute -left-32 -top-24 h-[520px] w-[520px] rounded-full bg-[#6C4DF4]/25 blur-[110px]"
                />
                <motion.span
                    style={{ x: ix, y: iy }}
                    className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-[#4D9FF4]/20 blur-[120px]"
                />
            </div>

            {/* ═════════════ I · PORTADILLA ═════════════ */}
            <section id="nb-portadilla" data-nb-page className="relative z-10 px-3 pt-24 sm:px-5 md:pt-28">
                <div className="nb-sheet is-in mx-auto max-w-5xl">
                    <div className="relative px-5 pb-16 pt-12 text-center sm:px-8 md:px-14 md:pb-24 md:pt-20">
                        <span className="relative mx-auto grid h-28 w-28 place-items-center md:h-36 md:w-36">
                            <span aria-hidden className="nb-halo-pulse absolute inset-0 rounded-full bg-[#6C4DF4]/[0.45] blur-2xl" />
                            <span aria-hidden className="nb-glint absolute right-3 top-4 h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_14px_#22D3EE]" />
                            {logo && (
                                <Image
                                    src={logo.src}
                                    alt={p.name}
                                    width={220}
                                    height={220}
                                    priority
                                    className="nb-breathe relative h-24 w-24 object-contain md:h-32 md:w-32"
                                />
                            )}
                        </span>

                        <p className="nb-mono nb-caps mt-8 text-[10px] text-[#9AA3C7]">Portadilla</p>
                        <h1 className="mt-3 text-6xl font-extrabold leading-none tracking-[-0.03em] md:text-8xl">
                            {p.name}
                        </h1>
                        <span aria-hidden className="nb-rule mx-auto mt-6 block h-px w-40 bg-gradient-to-r from-[#22D3EE] to-transparent md:w-72" />

                        <p className="nb-measure mx-auto mt-7 text-lg leading-relaxed text-[#F2F4FF]/80 md:text-2xl">
                            {p.tagline}
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            <Chip>{p.category}</Chip>
                            <Chip>{p.year}</Chip>
                        </div>
                        <p className="nb-measure mx-auto mt-5 text-sm text-[#9AA3C7]">{p.role}</p>
                        <p className="nb-mono mt-2 text-[11px] text-[#22D3EE]/80">{p.status}</p>

                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <BrandButton href="#nb-interfaz">
                                <BookOpen size={16} /> Abrir el libro
                            </BrandButton>
                            {p.links.play && (
                                <BrandButton href={p.links.play} variant="outline">
                                    <ArrowRight size={16} /> Google Play
                                </BrandButton>
                            )}
                            {p.links.web && (
                                <BrandButton href={p.links.web} variant="outline">
                                    <ArrowRight size={16} /> Sitio
                                </BrandButton>
                            )}
                            {p.links.github && (
                                <BrandButton href={p.links.github} variant="outline">
                                    <ArrowRight size={16} /> Código
                                </BrandButton>
                            )}
                        </div>

                        <p className="nb-mono nb-caps mt-10 text-[9px] text-[#F2F4FF]/25">
                            Pasa página con ← → o baja
                        </p>
                    </div>
                    <span className="nb-mono nb-caps absolute bottom-5 right-6 text-[9px] text-[#F2F4FF]/30 md:right-10">
                        Portadilla · 01
                    </span>
                </div>
            </section>

            {/* ═════════════ II · EL PROBLEMA, COMO UNA CITA ═════════════ */}
            <Sheet id="nb-problema" folio="02" chapter="El problema">
                <Kicker>Capítulo uno</Kicker>
                <Title>
                    Lectores <span className="brand-gradient-text">sin biblioteca propia</span>
                </Title>

                <div className="relative mt-9">
                    <Quote
                        aria-hidden
                        size={64}
                        className="absolute -left-2 -top-6 text-[#6C4DF4]/25 md:-left-10 md:-top-8"
                        strokeWidth={1.2}
                    />
                    <p className="nb-measure relative text-lg leading-[1.75] text-[#F2F4FF]/[0.85] md:text-2xl md:leading-[1.7]">
                        <span className="nb-mark">Las apps de lectura serias son tiendas</span>
                        {p.problem.replace("Las apps de lectura serias son tiendas", "")}
                    </p>
                </div>

                <div className="mt-10 grid gap-3 border-t border-white/[0.08] pt-6 sm:grid-cols-3">
                    {[
                        { k: "Catálogo ajeno", v: "tus libros atados a una cuenta" },
                        { k: "Siempre en línea", v: "sin red no hay casi nada" },
                        { k: "Competir", v: "rankings con desconocidos" },
                    ].map((row) => (
                        <div key={row.k}>
                            <p className="nb-mono nb-caps text-[10px] text-[#6C4DF4]">{row.k}</p>
                            <p className="mt-1.5 text-sm text-[#9AA3C7]">{row.v}</p>
                        </div>
                    ))}
                </div>
            </Sheet>

            {/* ═════════════ III · LA SOLUCIÓN ═════════════ */}
            <Sheet id="nb-solucion" folio="03" chapter="La solución">
                <Kicker>Capítulo dos</Kicker>
                <Title>
                    El contenido lo pone <span className="brand-gradient-text">el lector</span>
                </Title>

                <p className="nb-drop nb-measure mt-8 text-base leading-[1.85] text-[#F2F4FF]/80 md:text-lg">
                    {p.solution}
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {MODES.map((mode, i) => (
                        <Reveal key={mode.name} delay={i * 0.08}>
                            <div className="h-full rounded-2xl border border-white/[0.08] bg-[#0B0E1D]/60 p-4">
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6C4DF4]/[0.15] text-[#B7A5FF]">
                                    <mode.icon size={16} />
                                </span>
                                <p className="mt-3 text-sm font-bold">{mode.name}</p>
                                <p className="nb-mono mt-1 text-[10px] text-[#9AA3C7]">{mode.note}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Sheet>

            {/* ═════════════ IV · HIGHLIGHTS ═════════════ */}
            <Sheet id="nb-certezas" folio="04" chapter="Seis certezas">
                <Kicker>Capítulo tres</Kicker>
                <Title>
                    Seis decisiones que <span className="brand-gradient-text">no se negocian</span>
                </Title>

                <Stagger className="mt-10 divide-y divide-white/[0.08]">
                    {p.highlights.map((h, i) => {
                        const Icon = iconOf(h.icon);
                        return (
                            <StaggerItem key={h.title} y={18}>
                                <div className="group grid gap-3 py-6 md:grid-cols-[auto_1fr] md:gap-7">
                                    <div className="flex items-start gap-3 md:w-40 md:flex-col md:gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#6C4DF4]/[0.35] bg-[#6C4DF4]/[0.12] text-[#B7A5FF] transition-colors duration-500 group-hover:border-[#22D3EE]/60 group-hover:text-[#22D3EE]">
                                            <Icon size={18} />
                                        </span>
                                        <span className="nb-mono nb-caps text-[10px] text-[#F2F4FF]/30">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold md:text-xl">{h.title}</h3>
                                        <p className="nb-measure mt-2 text-sm leading-relaxed text-[#9AA3C7] md:text-[15px]">
                                            {h.description}
                                        </p>
                                    </div>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            </Sheet>

            {/* ═════════════ V · LA INTERFAZ (mockups) ═════════════ */}
            <Sheet id="nb-interfaz" folio="05" chapter="La interfaz">
                <Kicker>Lámina desplegable</Kicker>
                <Title>
                    Cinco pantallas, <span className="brand-gradient-text">un mismo cielo</span>
                </Title>
                <p className="nb-measure mt-4 text-sm text-[#9AA3C7] md:text-base">
                    Recreadas en HTML y CSS con la paleta, las medidas y los ritmos reales de la app.
                </p>

                <div className="mt-10 grid gap-8 md:grid-cols-[240px_1fr] md:gap-12">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0 scrollbar-none">
                        {SCREENS.map((s, i) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => setScreen(i)}
                                className={`shrink-0 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 md:w-full ${
                                    i === screen
                                        ? "border-[#22D3EE]/50 bg-[#22D3EE]/[0.08]"
                                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                                }`}
                            >
                                <span className="nb-mono nb-caps block text-[9px] text-[#F2F4FF]/30">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span
                                    className={`mt-1 block whitespace-nowrap text-sm font-semibold ${
                                        i === screen ? "text-[#22D3EE]" : "text-[#F2F4FF]/75"
                                    }`}
                                >
                                    {p.uiScreens[s.idx].name}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center">
                        {/* media página que se pasa en horizontal dentro de la misma hoja */}
                        <motion.div
                            key={current.label}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40, rotateY: -16 }}
                            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformPerspective: 1200, transformOrigin: "left center" }}
                        >
                            <PhoneFrame className="w-[248px] md:w-[288px]">
                                {current.idx === 0 && <MockLibrary />}
                                {current.idx === 1 && <MockRsvp ambient={ambient} onAmbient={setAmbient} />}
                                {current.idx === 2 && <MockReader />}
                                {current.idx === 5 && <MockNova />}
                                {current.idx === 3 && <MockSky />}
                            </PhoneFrame>
                        </motion.div>

                        <p className="nb-measure mt-8 text-center text-sm text-[#9AA3C7]">{current.note}</p>
                        {current.idx === 1 && (
                            <p className="nb-mono mt-2 text-center text-[10px] text-[#22D3EE]">
                                Ambiente: {ambientNames[ambient]} · toca las miniaturas
                            </p>
                        )}
                    </div>
                </div>
            </Sheet>

            {/* ═════════════ VI · SIN INTERNET ═════════════ */}
            <Sheet id="nb-offline" folio="06" chapter="Sin internet" className="nb-offline">
                <div className="nb-desat">
                    <Kicker>Demostración</Kicker>
                    <div className="mt-4 flex items-start gap-5">
                        <span className="relative mt-1 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/10 bg-[#0B0E1D]">
                            <WifiOff size={22} className="text-[#9AA3C7]" />
                            <span aria-hidden className="nb-slash absolute h-[2px] w-10 rotate-[-38deg] rounded-full bg-[#6C4DF4]" />
                        </span>
                        <div>
                            <Title className="!mt-0">
                                Quita la red y <span className="brand-gradient-text">no se cae nada</span>
                            </Title>
                            <p className="nb-measure mt-4 text-sm leading-relaxed text-[#9AA3C7] md:text-base">
                                Todo lo irremplazable vive en 9 cajas de Hive dentro del teléfono. La conexión solo hace falta
                                para la IA, la voz en la nube, la copia de seguridad y los avisos: cuatro puertas que degradan
                                con elegancia.
                            </p>
                        </div>
                    </div>

                    <Stagger className="mt-9 grid gap-x-8 gap-y-0 sm:grid-cols-2" stagger={0.05}>
                        {OFFLINE_FEATURES.map((index) => {
                            const feature = p.features[index];
                            if (!feature) return null;
                            return (
                                <StaggerItem key={index} y={12}>
                                    <div className="flex items-start gap-3 border-b border-white/[0.06] py-3">
                                        <Icons.Check size={14} className="mt-0.5 shrink-0 text-[#22D3EE]" />
                                        <p className="text-[13px] leading-relaxed text-[#F2F4FF]/75">{feature}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </Sheet>

            {/* ═════════════ VII · CONSTELACIÓN DE CIFRAS ═════════════ */}
            <Sheet id="nb-cifras" folio="07" chapter="Constelación de cifras" inner="!px-3 sm:!px-6 md:!px-10">
                <div className="px-2 md:px-4">
                    <Kicker>Las cifras</Kicker>
                    <Title>
                        Doce estrellas, <span className="brand-gradient-text">un solo cielo</span>
                    </Title>
                </div>

                <div className="mt-10 overflow-x-auto scrollbar-none">
                    <div className="relative h-[420px] w-[900px] md:h-[480px] md:w-full md:min-w-[860px]">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                            {LINKS.map(([a, b], i) => (
                                <motion.path
                                    key={`${a}-${b}`}
                                    d={`M ${CONSTELLATION[a].x} ${CONSTELLATION[a].y} L ${CONSTELLATION[b].x} ${CONSTELLATION[b].y}`}
                                    stroke="#6C4DF4"
                                    strokeOpacity="0.5"
                                    strokeWidth="1"
                                    fill="none"
                                    vectorEffect="non-scaling-stroke"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.1 + i * 0.09, ease: "easeOut" }}
                                />
                            ))}
                        </svg>

                        {p.metrics.map((metric, i) => {
                            const pos = CONSTELLATION[i];
                            if (!pos) return null;
                            return (
                                <div
                                    key={metric.label}
                                    className="absolute w-[150px] -translate-x-1/2 -translate-y-1/2 text-center"
                                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                >
                                    <span
                                        aria-hidden
                                        className="nb-star-dot nb-tw mx-auto mb-2 block h-1.5 w-1.5 rounded-full bg-[#22D3EE]"
                                        style={{ animationDelay: `${(i % 6) * 0.6}s` }}
                                    />
                                    <div className="nb-mono [&_p:first-child]:!text-xl [&_p:first-child]:md:!text-2xl [&_p:last-child]:!mt-1 [&_p:last-child]:!text-[9px] [&_p:last-child]:!tracking-[0.14em]">
                                        <CountMetric value={metric.value} label={metric.label} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <p className="nb-mono mt-2 px-2 text-[10px] text-[#F2F4FF]/25 md:hidden">
                    Arrastra el cielo hacia los lados →
                </p>
            </Sheet>

            {/* ═════════════ VIII · ARQUITECTURA ═════════════ */}
            <Sheet id="nb-arquitectura" folio="08" chapter="Tres superficies">
                <Kicker>Bajo el capó</Kicker>
                <Title>
                    Tres superficies y <span className="brand-gradient-text">una puerta cerrada</span>
                </Title>

                <div className="mt-10 overflow-x-auto scrollbar-none">
                    <div className="relative min-w-[620px]">
                        <div className="grid grid-cols-3 items-stretch gap-4">
                            {[
                                { icon: Smartphone, name: "App Flutter", lines: ["158 archivos Dart", "9 cajas de Hive", "31 rutas"] },
                                { icon: Server, name: "Cloud Functions", lines: ["26 funciones · Node 22", "Nova, voz, pagos, correos", "Admin SDK"] },
                                { icon: LayoutDashboard, name: "Paneles", lines: ["Web en React 19", "Android en Flutter", "Sin privilegios propios"] },
                            ].map((node, i) => (
                                <Reveal key={node.name} delay={i * 0.1}>
                                    <div
                                        className={`h-full rounded-2xl border p-4 ${
                                            i === 1 ? "border-[#22D3EE]/[0.35] bg-[#22D3EE]/[0.06]" : "border-white/10 bg-[#0B0E1D]/60"
                                        }`}
                                    >
                                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#6C4DF4]/[0.15] text-[#B7A5FF]">
                                            <node.icon size={17} />
                                        </span>
                                        <p className="mt-3 text-sm font-bold">{node.name}</p>
                                        <ul className="nb-mono mt-2 space-y-1 text-[10px] text-[#9AA3C7]">
                                            {node.lines.map((line) => (
                                                <li key={line}>{line}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <svg viewBox="0 0 600 60" className="mt-3 h-14 w-full" preserveAspectRatio="none">
                            <path className="nb-flow" d="M100 12 L300 12" stroke="#6C4DF4" strokeWidth="2" fill="none" />
                            <path className="nb-flow" d="M500 12 L300 12" stroke="#4D9FF4" strokeWidth="2" fill="none" />
                            <path d="M300 12 L300 40" stroke="#22D3EE" strokeWidth="2" fill="none" strokeDasharray="3 5" />
                        </svg>

                        <div className="mx-auto -mt-2 flex max-w-md items-center gap-3 rounded-2xl border border-[#6C4DF4]/[0.35] bg-[#141A33] p-4">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#6C4DF4]/20 text-[#22D3EE]">
                                <Lock size={17} />
                            </span>
                            <div>
                                <p className="text-sm font-bold">Firestore · 11 colecciones</p>
                                <p className="nb-mono text-[10px] text-[#9AA3C7]">
                                    allow read, write: if false; — el único camino son las callables
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="nb-measure mt-10 border-l-2 border-[#6C4DF4] pl-5 text-sm leading-[1.85] text-[#F2F4FF]/75 md:text-[15px]">
                    {p.architecture}
                </p>
            </Sheet>

            {/* ═════════════ IX · RETOS COMO NOTAS AL PIE ═════════════ */}
            <Sheet id="nb-retos" folio="09" chapter="Notas al pie">
                <Kicker>Aparato crítico</Kicker>
                <Title>
                    Seis notas <span className="brand-gradient-text">al pie del proyecto</span>
                </Title>

                <div className="mt-10 divide-y divide-white/[0.08]">
                    {p.challenges.map((challenge, i) => (
                        <Reveal key={i} delay={0.04 * i}>
                            <div className="grid gap-4 py-7 md:grid-cols-[auto_1fr] md:gap-8">
                                <span className="nb-mono text-2xl font-bold leading-none text-[#6C4DF4] md:text-3xl">
                                    <sup className="text-[#22D3EE]">{i + 1}</sup>
                                </span>
                                <div>
                                    <p className="nb-measure text-sm leading-[1.8] text-[#9AA3C7] md:text-[15px]">
                                        {challenge.problem}
                                    </p>
                                    <div className="mt-4 border-t border-dashed border-white/[0.12] pt-4">
                                        <p className="nb-mono nb-caps mb-2 text-[10px] text-[#22D3EE]">Cómo se resolvió</p>
                                        <p className="nb-measure text-sm leading-[1.8] text-[#F2F4FF]/90 md:text-[15px]">
                                            {challenge.solution}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Sheet>

            {/* ═════════════ X · ÍNDICE DE FUNCIONES ═════════════ */}
            <Sheet id="nb-indice" folio="10" chapter="Índice de funciones">
                <Kicker>Índice</Kicker>
                <Title>
                    Veintiuna entradas, <span className="brand-gradient-text">todas dentro</span>
                </Title>

                <Stagger className="mt-9 columns-1 gap-10 lg:columns-2" stagger={0.035}>
                    {p.features.map((feature, i) => (
                        <StaggerItem key={feature} y={10} className="break-inside-avoid">
                            <div className="group flex items-baseline gap-3 border-b border-white/[0.06] py-3">
                                <span className="nb-mono shrink-0 text-[10px] text-[#6C4DF4]">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="text-[13px] leading-relaxed text-[#F2F4FF]/70 transition-colors duration-300 group-hover:text-[#F2F4FF]">
                                    {feature}
                                </p>
                            </div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </Sheet>

            {/* ═════════════ XI · BIBLIOGRAFÍA TÉCNICA ═════════════ */}
            <Sheet id="nb-stack" folio="11" chapter="Bibliografía técnica">
                <Kicker>Bibliografía</Kicker>
                <Title>
                    Con qué está <span className="brand-gradient-text">escrito</span>
                </Title>

                <div className="mt-10 space-y-7">
                    {p.stack.map((group, i) => (
                        <Reveal key={group.group} delay={i * 0.05}>
                            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:gap-8">
                                <p className="nb-mono nb-caps text-[10px] text-[#6C4DF4] md:pt-1">{group.group}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.items.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-[#F2F4FF]/70"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Sheet>

            {/* ═════════════ XII · LÁMINAS ═════════════ */}
            <Sheet id="nb-laminas" folio="12" chapter="Láminas">
                <Kicker>Láminas</Kicker>
                <Title>
                    La identidad <span className="brand-gradient-text">del proyecto</span>
                </Title>
                <p className="nb-measure mt-4 text-sm text-[#9AA3C7]">
                    Onboarding, imagen social y cabecera de los correos que envían las Cloud Functions. Arrastra.
                </p>

                <div className="mt-9">
                    <DragRail>
                        {gallery.map((shot, i) => (
                            <ShotCard
                                key={shot.src}
                                src={shot.src}
                                alt={shot.caption}
                                caption={shot.caption}
                                priority={i === 0}
                                className={`w-[210px] shrink-0 self-start md:w-[250px] ${shotAspect(shot.src)}`}
                            />
                        ))}
                    </DragRail>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/[0.08] pt-8">
                    {[icon, launcher, appleIcon].map(
                        (shot) =>
                            shot && (
                                <span key={shot.src} className="flex items-center gap-3">
                                    <Image
                                        src={shot.src}
                                        alt={shot.caption}
                                        width={48}
                                        height={48}
                                        className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                                    />
                                    <span className="nb-mono max-w-[180px] text-[10px] leading-snug text-[#9AA3C7]">
                                        {shot.kind}
                                    </span>
                                </span>
                            )
                    )}
                    {favicon && (
                        <span className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={favicon.src} alt={favicon.caption} className="h-12 w-12 rounded-xl border border-white/10 p-1" />
                            <span className="nb-mono max-w-[180px] text-[10px] leading-snug text-[#9AA3C7]">favicon svg</span>
                        </span>
                    )}
                </div>
            </Sheet>

            {/* ═════════════ XIII · COLOFÓN ═════════════ */}
            <Sheet id="nb-colofon" folio="13" chapter="Colofón">
                <Kicker>Colofón</Kicker>
                <Title>
                    Lo que es <span className="brand-gradient-text">Nébula</span>
                </Title>

                <Stagger className="mt-8 space-y-5">
                    {p.summary.map((paragraph, i) => (
                        <StaggerItem key={i}>
                            <p
                                className={`nb-measure leading-[1.85] ${
                                    i === 0 ? "text-lg text-[#F2F4FF]/90 md:text-xl" : "text-sm text-[#9AA3C7] md:text-[15px]"
                                }`}
                            >
                                {paragraph}
                            </p>
                        </StaggerItem>
                    ))}
                </Stagger>

                <div className="mt-12 border-t border-white/[0.08] pt-8">
                    <p className="nb-mono nb-caps text-[10px] text-[#6C4DF4]">Paleta</p>
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {[
                            ["primary", p.brand.primary],
                            ["secondary", p.brand.secondary],
                            ["accent", p.brand.accent],
                            ["bg", p.brand.bg],
                            ["surface", p.brand.surface],
                            ["text", p.brand.text],
                        ].map(([name, hex]) => (
                            <div key={name}>
                                <span
                                    className="block h-14 rounded-xl border border-white/10"
                                    style={{ background: hex }}
                                />
                                <p className="nb-mono mt-2 text-[10px] text-[#F2F4FF]/70">{hex}</p>
                                <p className="nb-mono nb-caps text-[8px] text-[#F2F4FF]/30">{name}</p>
                            </div>
                        ))}
                    </div>
                    <p className="nb-measure mt-6 text-sm leading-relaxed text-[#9AA3C7]">{p.brand.mood}</p>
                </div>

                <div className="mt-10 grid gap-6 border-t border-white/[0.08] pt-8 sm:grid-cols-3">
                    {[
                        ["Año", p.year],
                        ["Categoría", p.category],
                        ["Estado", p.status],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <p className="nb-mono nb-caps text-[10px] text-[#6C4DF4]">{label}</p>
                            <p className="mt-1.5 text-sm text-[#F2F4FF]/80">{value}</p>
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-xl font-bold leading-snug md:text-2xl">
                    <RevealWords text="Un lector que no vende libros: los recibe, los cuida y los convierte en un cielo propio." />
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-[#9AA3C7]">
                        <Highlighter size={13} className="text-[#6C4DF4]" /> resaltados por coordenadas
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-[#9AA3C7]">
                        <Icons.Languages size={13} className="text-[#6C4DF4]" /> 39 idiomas
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-[#9AA3C7]">
                        <Star size={13} className="text-[#22D3EE]" /> gamificación sin nadie más
                    </span>
                </div>
            </Sheet>

            {/* ═════════════ CIERRE ═════════════ */}
            <div className="relative z-10 pb-32">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una app offline-first con lector propio, IA servida desde el backend y una capa de hábito que no necesita a nadie más. Si tienes algo así en la cabeza —Flutter, Firebase, producto entero— es exactamente el terreno que conozco."
                />
            </div>
        </ProjectShell>
    );
};

export default Landing;
