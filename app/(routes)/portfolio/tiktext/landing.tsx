"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowUpRight,
    Check,
    Coins,
    Download,
    Gauge,
    GripVertical,
    Heart,
    ImageIcon,
    Lock,
    LockOpen,
    MessageCircle,
    Music4,
    Pause,
    Play,
    RefreshCw,
    Send,
    Sparkles,
    Wallet,
    Wand2,
    X,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { Reveal, Stagger, StaggerItem } from "@/components/projects/reveal";
import { AutoVideo, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";

const p = getProject("tiktext")!;
const nxt = nextProject("tiktext");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Índice del feed: cada sección es una tarjeta, igual que en la app. */
const SECTIONS: { id: string; label: string }[] = [
    { id: "tt-hero", label: "Lector RSVP" },
    { id: "tt-chat", label: "Problema" },
    { id: "tt-reader", label: "La mecánica" },
    { id: "tt-highlights", label: "Piezas clave" },
    { id: "tt-studio", label: "Herramientas" },
    { id: "tt-money", label: "Monetización" },
    { id: "tt-roadmap", label: "Funcionalidades" },
    { id: "tt-arch", label: "Arquitectura" },
    { id: "tt-challenges", label: "Retos" },
    { id: "tt-metrics", label: "Métricas" },
    { id: "tt-stack", label: "Stack" },
];

/* Contenido de ejemplo de los mockups: recreación de las pantallas reales. */
const CHAPTERS = [
    { code: "CH 01", title: "The Last Signal", state: "done" as const, price: "" },
    { code: "CH 02", title: "Dead Frequency", state: "active" as const, price: "" },
    { code: "CH 03", title: "Static Bloom", state: "locked" as const, price: "120" },
    { code: "CH 04", title: "Ghost Protocol", state: "locked" as const, price: "180" },
];

const GENRES = [
    { name: "Sci-Fi", from: "#3B82F6", to: "#7000FF" },
    { name: "Noir", from: "#4B5563", to: "#111827" },
    { name: "Romance", from: "#FB7185", to: "#F472B6" },
    { name: "Thriller", from: "#F472B6", to: "#FFD700" },
    { name: "Fantasy", from: "#22D3EE", to: "#7000FF" },
];

const TRACKS = [
    { name: "Neon Rain", artist: "Void Collective", time: "3:42", mood: "Tense", playing: true },
    { name: "Static Bloom", artist: "Kyra Nine", time: "4:18", mood: "Dreamy", playing: false },
];

const DIRECTIVES = [
    "Add Cliffhanger",
    "Deepen Atmosphere",
    "Insert Dialogue",
    "Check Coherence",
    "Build Tension",
    "Reveal Secret",
];

const PRESETS = [
    "Anime",
    "Cinematic",
    "Oil Painting",
    "Sketch",
    "Watercolor",
    "3D Render",
    "Pixel Art",
    "Noir",
    "Neon",
    "Vintage",
    "Cyberpunk",
    "Fantasy",
    "Comic Book",
    "Abstract",
    "Minimalist",
    "Surreal",
];

const TXNS = [
    { who: "@lumen.reads", what: "Unlocked Chapter 4", amount: "+ 180", when: "hace 4 min", initials: "LR" },
    { who: "@sable.k", what: "Tipped your story", amount: "+ 500", when: "hace 21 min", initials: "SK" },
    { who: "@nine.tales", what: "Unlocked Chapter 3", amount: "+ 120", when: "hace 1 h", initials: "NT" },
];

const WAVE = [4, 9, 6, 12, 8, 14, 7, 10];
const WAVE_LONG = [5, 11, 7, 13, 6, 15, 9, 12, 7, 14, 8, 10];

const TOOLS = [
    { key: "lab", label: "AI Lab", icon: Sparkles, from: "#7000FF", to: "#3B82F6" },
    { key: "writer", label: "Writer", icon: Icons.PenTool, from: "#7000FF", to: "#F472B6" },
    { key: "visual", label: "Visual", icon: ImageIcon, from: "#22D3EE", to: "#7000FF" },
    { key: "wallet", label: "Wallet", icon: Wallet, from: "#FFD700", to: "#7000FF" },
];

const css = `
.tt-mono { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-feature-settings: "tnum" 1; }
.tt-glass { background: rgba(0,0,0,0.42); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.10); }
.tt-halo {
  background: radial-gradient(circle, rgba(112,0,255,0.95) 0%, rgba(112,0,255,0.35) 42%, rgba(112,0,255,0) 70%);
  filter: blur(40px);
  animation: tt-breathe 2s ease-in-out infinite;
}
@keyframes tt-breathe { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
.tt-word { animation: tt-word-in 0.12s ease-out; }
@keyframes tt-word-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.tt-ring { background: conic-gradient(from 0deg, #7000FF, #00FF94, #FFD700, #7000FF); animation: tt-spin 6s linear infinite; }
@keyframes tt-spin { to { transform: rotate(360deg); } }
.tt-coin { animation: tt-coin-pulse 1.9s ease-out infinite; }
@keyframes tt-coin-pulse {
  0% { box-shadow: 0 0 0 0 rgba(255,215,0,0.55); }
  70% { box-shadow: 0 0 0 12px rgba(255,215,0,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); }
}
.tt-wave { display: flex; align-items: flex-end; gap: 2px; }
.tt-wave > i { display: block; width: 2px; border-radius: 2px; background: #7000FF; transform-origin: bottom; animation: tt-wave 0.9s ease-in-out infinite; }
@keyframes tt-wave { 0%, 100% { transform: scaleY(0.28); } 50% { transform: scaleY(1); } }
.tt-lift { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.4s ease; }
.tt-lift:hover { transform: translateY(-4px); border-color: rgba(112,0,255,0.55); box-shadow: 0 18px 52px -22px rgba(112,0,255,0.85); }
.tt-iso { transform: perspective(760px) rotateX(11deg) rotateZ(-5deg); transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease; }
.tt-iso:hover, .tt-iso[data-on="1"] { transform: perspective(760px) rotateX(5deg) rotateZ(-1deg) translateY(-4px); }
.tt-caret::after { content: "▍"; color: #00FF94; margin-left: 2px; animation: brand-blink 1s steps(1) infinite; }
.tt-gold {
  background-image:
    repeating-linear-gradient(112deg, rgba(255,215,0,0.10) 0 1px, transparent 1px 11px),
    repeating-linear-gradient(64deg, rgba(255,215,0,0.055) 0 1px, transparent 1px 17px);
}
.tt-scroll { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.tt-scroll::-webkit-scrollbar { display: none; }
.tt-section { scroll-margin-top: 76px; }
.tt-locked { filter: blur(2.6px) saturate(0.55); }
.tt-dim { color: rgba(255,255,255,0.30); transition: color 0.4s ease; }
.tt-lit { color: #FFFFFF; }
.tt-bubble-ai { background: rgba(112,0,255,0.20); border: 1px solid rgba(112,0,255,0.30); }
.tt-bubble-me { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); }
.tt-underglow { box-shadow: 0 -1px 0 rgba(255,255,255,0.06), 0 -18px 60px -30px rgba(112,0,255,0.9); }
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  html { scroll-snap-type: y proximity; }
  .tt-snap { scroll-snap-align: start; }
}
@media (prefers-reduced-motion: reduce) {
  .tt-halo, .tt-word, .tt-ring, .tt-coin, .tt-wave > i, .tt-caret::after { animation: none !important; }
  .tt-lift:hover { transform: none; }
  .tt-iso, .tt-iso:hover { transform: none; }
}
`;

/* ------------------------------------------------------------------ */
/* Lector RSVP: un único temporizador, sólo mientras la tarjeta vive.  */
/* ------------------------------------------------------------------ */

const useRsvp = (words: string[], ms: number, active = true) => {
    const [index, setIndex] = useState(0);
    const [done, setDone] = useState(false);
    const reduce = useReducedMotion();

    useEffect(() => {
        if (reduce || !active || ms <= 0 || words.length === 0) {
            setIndex(words.length ? words.length - 1 : 0);
            setDone(true);
            return;
        }
        let cancelled = false;
        let timer = 0;
        let i = 0;
        setIndex(0);
        setDone(false);

        const tick = () => {
            if (cancelled) return;
            i += 1;
            if (i >= words.length) {
                setDone(true);
                timer = window.setTimeout(() => {
                    if (cancelled) return;
                    i = 0;
                    setIndex(0);
                    setDone(false);
                    timer = window.setTimeout(tick, ms);
                }, 1600);
                return;
            }
            setIndex(i);
            timer = window.setTimeout(tick, ms);
        };

        timer = window.setTimeout(tick, ms);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [words, ms, active, reduce]);

    return { index, done, word: words[index] ?? words[0] ?? "" };
};

/* Rótulo técnico reutilizado en toda la página. */
const Label = ({ children, tone = "violet" }: { children: React.ReactNode; tone?: "violet" | "green" | "gold" | "mute" }) => {
    const color =
        tone === "green" ? "#00FF94" : tone === "gold" ? "#FFD700" : tone === "mute" ? "rgba(255,255,255,0.35)" : "#9A5BFF";
    return (
        <span className="tt-mono block text-[10px] uppercase tracking-[0.3em]" style={{ color }}>
            {children}
        </span>
    );
};

/* Barras de onda de la banda sonora. */
const Wave = ({ bars = WAVE, color = "#7000FF" }: { bars?: number[]; color?: string }) => (
    <span className="tt-wave h-4">
        {bars.map((h, i) => (
            <i key={i} style={{ height: `${h}px`, background: color, animationDelay: `${i * 70}ms` }} />
        ))}
    </span>
);

/* --------------------------- MOCKUP 1: feed --------------------------- */

const MockFeed = ({ active }: { active: boolean }) => {
    const words = useMemo(
        () => "La señal volvió a las 3:07 y nadie en el búnker quiso admitir que la habíamos oído antes".split(" "),
        []
    );
    const { index, word } = useRsvp(words, 92, active);
    const progress = Math.round(((index + 1) / words.length) * 100);

    return (
        <div className="absolute inset-0 bg-black text-white">
            {/* medidor y accesos */}
            <div className="absolute z-20 flex items-center justify-between left-3 right-3 top-9">
                <span className="tt-glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1">
                    <Gauge size={11} color="#00FF94" />
                    <span className="tt-mono text-[9px] font-bold tracking-wider">650 WPM</span>
                </span>
                <span className="flex gap-1.5">
                    {[Wallet, Wand2].map((Ico, i) => (
                        <span
                            key={i}
                            className="grid rounded-full h-7 w-7 place-items-center"
                            style={{
                                backgroundImage: "linear-gradient(135deg,#7000FF,#00FF94)",
                                boxShadow: "0 6px 18px -4px rgba(112,0,255,0.9)",
                            }}
                        >
                            <Ico size={12} color="#000" />
                        </span>
                    ))}
                </span>
            </div>

            {/* palabra central sobre el halo */}
            <div className="absolute inset-x-0 grid top-[34%] place-items-center">
                <span aria-hidden className="tt-halo absolute h-32 w-32 rounded-full" />
                <span className="tt-mono tt-word relative text-[26px] font-bold leading-none" key={word}>
                    {word}
                </span>
            </div>

            {/* columna de acciones */}
            <div className="absolute right-2.5 top-[38%] flex w-11 flex-col items-center gap-4">
                <span className="relative grid h-9 w-9 place-items-center">
                    <span aria-hidden className="tt-ring absolute inset-0 rounded-full" />
                    <span className="relative grid h-[30px] w-[30px] place-items-center rounded-full bg-[#121212] text-[9px] font-bold">
                        NV
                    </span>
                </span>
                <span className="flex flex-col items-center gap-0.5">
                    <Heart size={17} fill="#fff" color="#fff" />
                    <span className="tt-mono text-[8px] opacity-70">12.4k</span>
                </span>
                <span className="flex flex-col items-center gap-0.5">
                    <MessageCircle size={17} color="#fff" />
                    <span className="tt-mono text-[8px] opacity-70">850</span>
                </span>
                <span className="flex flex-col items-center gap-0.5">
                    <span
                        className="tt-coin grid h-8 w-8 place-items-center rounded-full"
                        style={{ backgroundImage: "linear-gradient(135deg,#FFD700,#FF8A00)" }}
                    >
                        <Coins size={15} color="#1a1200" />
                    </span>
                    <span className="tt-mono text-[8px] text-[#FFD700]">Tip</span>
                </span>
            </div>

            {/* pie: progreso, banda sonora, capítulos y ficha */}
            <div className="absolute inset-x-0 bottom-0 pb-3">
                <div className="h-[2px] w-full bg-white/10">
                    <span
                        className="block h-full transition-[width] duration-100"
                        style={{ width: `${progress}%`, background: "#00FF94", boxShadow: "0 0 8px #00FF94" }}
                    />
                </div>

                <div className="px-3 mt-3">
                    <div className="tt-glass flex items-center gap-2 rounded-xl px-2.5 py-2">
                        <span className="grid rounded-lg h-7 w-7 place-items-center bg-[#7000FF]/25">
                            <Music4 size={12} color="#9A5BFF" />
                        </span>
                        <span className="flex-1 min-w-0">
                            <span className="block text-[10px] font-semibold leading-tight truncate">Neon Rain</span>
                            <span className="block text-[8px] leading-tight text-white/45 truncate">Void Collective</span>
                        </span>
                        <Wave />
                    </div>

                    <div className="tt-scroll flex gap-2 pt-3 pb-1">
                        {CHAPTERS.map((c) => (
                            <span key={c.code} className="relative shrink-0">
                                <span
                                    className={`grid h-[52px] w-[52px] place-items-center rounded-xl border text-[8px] ${
                                        c.state === "active"
                                            ? "border-[#7000FF] shadow-[0_0_18px_-2px_rgba(112,0,255,0.9)]"
                                            : "border-white/10"
                                    } ${c.state === "locked" ? "tt-locked" : ""}`}
                                    style={{ backgroundImage: "linear-gradient(150deg,#1b1030,#0a0a0a)" }}
                                >
                                    <span className="tt-mono text-white/60">{c.code}</span>
                                </span>
                                {c.state === "locked" && (
                                    <>
                                        <span className="absolute grid inset-0 place-items-center">
                                            <Lock size={13} color="#9A5BFF" />
                                        </span>
                                        <span className="tt-mono absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#FFD700] px-1.5 py-[1px] text-[7px] font-bold text-black">
                                            {c.price}
                                        </span>
                                    </>
                                )}
                                {c.state === "done" && (
                                    <span className="absolute grid rounded-full -right-1 -top-1 h-4 w-4 place-items-center bg-[#00FF94]">
                                        <Check size={10} color="#000" strokeWidth={3} />
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>

                    <p className="mt-2 text-[12px] font-semibold leading-tight">Dead Frequency</p>
                    <p className="truncate text-[9px] text-white/70">
                        Seis técnicos, una antena que no debería seguir transmitiendo.
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[9px] text-white/55">
                        @nova.writes
                        <span className="rounded-full bg-[#7000FF]/25 px-1.5 py-[1px] text-[7px] text-[#B78BFF]">
                            Verified
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ------------------------- MOCKUP 2: AI Story Lab ------------------------- */

const MockLab = () => (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
        <div className="flex items-center justify-between px-3 pt-9 pb-2">
            <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] anim-blink" />
                <span className="text-[9px] text-white/50">Draft Saved</span>
            </span>
            <X size={13} className="opacity-50" />
        </div>

        <div className="flex-1 px-3 space-y-3 overflow-hidden">
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-2.5 h-[74px]">
                <span className="text-[9px] text-white/30">Type your story seed here...</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[#00FF94] py-2">
                <Sparkles size={12} color="#000" />
                <span className="text-[10px] font-bold text-black">Expand Idea</span>
            </div>

            <div>
                <p className="tt-mono text-[7px] uppercase tracking-[0.28em] text-white/35">Genre Framework</p>
                <div className="tt-scroll flex gap-2.5 pt-3 pb-4 pl-1">
                    {GENRES.map((g, i) => (
                        <span key={g.name} className="relative shrink-0">
                            <span
                                className="tt-iso grid h-[54px] w-[64px] place-items-center rounded-lg text-[8px] font-semibold"
                                style={{
                                    backgroundImage: `linear-gradient(150deg, ${g.from}, ${g.to})`,
                                    boxShadow: `0 10px 22px -10px ${g.from}`,
                                }}
                                data-on={i === 0 ? "1" : "0"}
                            >
                                {g.name}
                            </span>
                            {i === 0 && (
                                <span className="absolute rounded-full -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 bg-[#00FF94]" />
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <p className="tt-mono text-[7px] uppercase tracking-[0.28em] text-white/35">Story Soundtrack</p>
                <div className="mt-2 space-y-1.5">
                    {TRACKS.map((t) => (
                        <div key={t.name} className="tt-glass flex items-center gap-2 rounded-lg px-2 py-1.5">
                            <span className="grid rounded-full h-6 w-6 place-items-center bg-white/10">
                                {t.playing ? <Pause size={10} /> : <Play size={10} />}
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="block text-[9px] font-medium leading-tight truncate">{t.name}</span>
                                <span className="block text-[7px] leading-tight text-white/40">
                                    {t.artist} · {t.time}
                                </span>
                            </span>
                            {t.playing ? (
                                <Wave bars={WAVE_LONG} />
                            ) : (
                                <span className="rounded-full border border-white/10 px-1.5 py-[1px] text-[7px] text-white/45">
                                    {t.mood}
                                </span>
                            )}
                        </div>
                    ))}
                    <div className="rounded-lg border border-dashed border-white/15 py-2 text-center text-[7px] text-white/30">
                        Sube tu propio audio
                    </div>
                </div>
            </div>

            <div>
                <p className="tt-mono text-[7px] uppercase tracking-[0.28em] text-white/35">Story Roadmap</p>
                <div className="mt-2 space-y-1.5">
                    {CHAPTERS.slice(0, 3).map((c, i) => (
                        <div
                            key={c.code}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#121212] px-2 py-2"
                        >
                            <GripVertical size={11} className="opacity-25" />
                            <span className="tt-mono text-[8px] text-[#9A5BFF]">{c.code}</span>
                            <span className="flex-1 min-w-0">
                                <span className="block text-[9px] leading-tight truncate">{c.title}</span>
                                <span className="block h-1 mt-1 rounded-full bg-white/10">
                                    <span
                                        className="block h-full rounded-full"
                                        style={{
                                            width: `${45 + i * 22}%`,
                                            backgroundImage:
                                                i === 2
                                                    ? "linear-gradient(90deg,#FFD700,#FF8A00)"
                                                    : "linear-gradient(90deg,#7000FF,#00FF94)",
                                        }}
                                    />
                                </span>
                            </span>
                            <span
                                className={`grid h-6 w-6 place-items-center rounded-md ${
                                    c.state === "locked" ? "bg-[#FFD700]/20 text-[#FFD700]" : "bg-white/5 text-white/40"
                                }`}
                            >
                                {c.state === "locked" ? <Lock size={10} /> : <LockOpen size={10} />}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <MockNav active={0} />
    </div>
);

/* Barra inferior compartida por las pantallas del estudio. */
const MockNav = ({ active }: { active: number }) => (
    <div className="tt-glass tt-underglow flex items-center justify-around px-2 py-2.5">
        {TOOLS.map((t, i) => {
            const Ico = t.icon;
            const on = i === active;
            return (
                <span key={t.key} className="flex flex-col items-center gap-1">
                    <span
                        className="grid rounded-lg h-9 w-9 place-items-center"
                        style={{
                            background: on ? "linear-gradient(135deg,#7000FF,#00FF94)" : "rgba(255,255,255,0.05)",
                        }}
                    >
                        <Ico size={13} color={on ? "#000" : "rgba(255,255,255,0.5)"} />
                    </span>
                    <span className={`text-[7px] ${on ? "text-white" : "text-white/35"}`}>{t.label}</span>
                </span>
            );
        })}
    </div>
);

/* --------------------- MOCKUP 3: Neural Writing Studio --------------------- */

const MockWriter = () => (
    <div className="absolute inset-0 flex flex-col bg-[#1A1A1A] text-white">
        <div className="flex items-center justify-between px-3 pt-9 pb-2 border-b border-white/10">
            <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7000FF] anim-blink" />
                <span className="text-[10px] font-semibold">Neural Writing Studio</span>
            </span>
            <X size={13} className="opacity-50" />
        </div>

        <div className="relative px-3 py-3 overflow-hidden basis-[52%]">
            <p className="text-[9px] leading-[1.6] text-white/90">
                La antena llevaba once años apagada. Cuando la aguja saltó,{" "}
                <span className="rounded bg-[#7000FF]/35 px-1 py-[1px]">Vera no dijo nada</span> y se limitó a anotar la
                hora en el margen del cuaderno.
            </p>
            <p className="mt-2 text-[9px] leading-[1.6] text-white/90">
                Abajo, el búnker seguía respirando su aire reciclado.{" "}
                <span className="rounded bg-[#7000FF]/35 px-1 py-[1px]">Nadie preguntó</span> por qué la señal repetía la
                misma secuencia de siete tonos.
            </p>

            <span className="tt-glass absolute left-1/2 top-[46%] flex -translate-x-1/2 items-center gap-1 rounded-lg px-1.5 py-1">
                {["Summarize", "Expand"].map((a) => (
                    <span key={a} className="rounded px-1.5 py-0.5 text-[7px] text-white/70">
                        {a}
                    </span>
                ))}
                <span className="rounded bg-[#7000FF] px-1.5 py-0.5 text-[7px] font-semibold">Make Aggressive</span>
            </span>
        </div>

        <div className="flex flex-col flex-1 gap-2 px-3 py-3 border-t border-white/10 bg-black/40">
            <div className="tt-bubble-ai max-w-[82%] rounded-xl rounded-bl-sm px-2 py-1.5 text-[8px] leading-relaxed">
                El capítulo cierra flojo. ¿Cortamos justo cuando la aguja salta?
            </div>
            <div className="tt-bubble-me ml-auto max-w-[70%] rounded-xl rounded-br-sm px-2 py-1.5 text-[8px] leading-relaxed">
                Sí, y que Vera no explique nada.
            </div>

            <div className="tt-scroll flex gap-1.5 pt-1">
                {DIRECTIVES.map((d) => (
                    <span
                        key={d}
                        className="shrink-0 rounded-full border border-[#7000FF]/45 bg-[#7000FF]/15 px-2 py-1 text-[7px] text-[#C7A6FF]"
                    >
                        {d}
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-1.5">
                <span className="flex-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[8px] text-white/30">
                    Ask AI for suggestions...
                </span>
                <span className="grid rounded-lg h-7 w-7 place-items-center bg-[#7000FF]">
                    <Send size={11} />
                </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
                <span className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[7px] text-white/70">
                    <ImageIcon size={9} /> Generate Art
                </span>
                <span className="flex items-center justify-center gap-1 rounded-lg bg-[#7000FF] py-1.5 text-[7px] font-semibold">
                    <Check size={9} /> Finalize Text
                </span>
            </div>
        </div>
    </div>
);

/* ------------------------- MOCKUP 4: Visual Synth ------------------------- */

const MockSynth = () => (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
        <div className="px-3 pt-9 pb-3">
            <p className="text-[13px] font-light tracking-[0.28em]">Visual Synth</p>
        </div>

        <div className="flex-1 px-3 space-y-3 overflow-hidden">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundImage: "linear-gradient(160deg,#2a0a4d,#0d0d18 55%,#031a12)" }}
                />
                <span aria-hidden className="absolute inset-0 grid-lines opacity-30" />
                <span aria-hidden className="absolute inset-0 bg-black/20" />
                <span className="absolute flex gap-1.5 right-2 top-2">
                    {[RefreshCw, Download].map((Ico, i) => (
                        <span key={i} className="tt-glass grid h-6 w-6 place-items-center rounded-md">
                            <Ico size={10} />
                        </span>
                    ))}
                </span>
                <span className="absolute inset-0 grid place-items-center">
                    <span aria-hidden className="tt-halo absolute h-24 w-24 rounded-full" />
                    <span className="tt-mono relative text-[16px] font-bold">encrypted</span>
                </span>
            </div>

            <div className="tt-glass flex items-center justify-between rounded-xl px-2.5 py-2">
                <span className="text-[9px] text-white/70">RSVP Text Preview</span>
                <span className="relative h-4 w-8 rounded-full bg-[#7000FF]">
                    <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white" />
                </span>
            </div>

            <div>
                <p className="tt-mono text-[7px] uppercase tracking-[0.28em] text-white/30">Style Presets</p>
                <div className="tt-scroll flex gap-1.5 pt-2">
                    {PRESETS.map((s, i) => (
                        <span
                            key={s}
                            className={`grid h-[46px] w-[54px] shrink-0 place-items-center rounded-lg border text-[7px] ${
                                i === 8 ? "border-[#7000FF]" : "border-white/10"
                            }`}
                            style={{ backgroundImage: "linear-gradient(160deg,#1a1030,#0a0a0a)" }}
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#121212] p-2">
                <p className="text-[8px] leading-relaxed text-white/55">
                    antena de radio abandonada bajo lluvia de neón, niebla violeta, formato vertical
                </p>
            </div>

            <div className="rounded-xl bg-[#7000FF] py-2 text-center text-[9px] font-semibold">Regenerate</div>

            <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="rounded-lg aspect-square"
                        style={{
                            backgroundImage: `linear-gradient(${150 + i * 30}deg,#2a0a4d,#0a0a0a)`,
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    />
                ))}
            </div>
        </div>

        <MockNav active={2} />
    </div>
);

/* ------------------------ MOCKUP 5: Creator Wallet ------------------------ */

const MockWallet = () => (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
        <div className="px-3 pt-9 pb-3">
            <p className="text-[15px] font-semibold leading-tight">Creator Wallet</p>
            <p className="text-[8px] text-white/45">Manage your earnings and payouts</p>
        </div>

        <div className="flex-1 px-3 space-y-3 overflow-hidden">
            <div
                className="p-3 border rounded-2xl border-white/10"
                style={{ backgroundImage: "linear-gradient(150deg, rgba(112,0,255,0.35), rgba(10,10,10,0.9))" }}
            >
                <span className="tt-glass inline-flex items-center gap-1.5 rounded-full px-2 py-1">
                    <span className="text-[8px]">Binance Pay</span>
                    <span className="rounded-full bg-[#00FF94]/20 px-1.5 py-[1px] text-[7px] text-[#00FF94]">
                        Connected
                    </span>
                </span>
                <p className="mt-3 text-[8px] uppercase tracking-[0.18em] text-white/45">Available Balance</p>
                <p className="flex items-end gap-1.5">
                    <span className="tt-mono text-[28px] font-bold leading-none">2,481.90</span>
                    <span className="text-[9px] text-white/45">USDT</span>
                </p>
                <div className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-white/10 py-1.5 text-[9px] font-semibold">
                    Withdraw Funds <ArrowUpRight size={11} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {[
                    { k: "Weekly earnings", v: "412.60", c: "#00FF94" },
                    { k: "Total readers", v: "38.2k", c: "#9A5BFF" },
                ].map((s) => (
                    <div key={s.k} className="rounded-xl border border-white/10 bg-[#121212] p-2">
                        <p className="text-[7px] text-white/40">{s.k}</p>
                        <p className="tt-mono text-[13px] font-bold" style={{ color: s.c }}>
                            {s.v}
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-[#121212] p-2">
                <div className="flex items-center justify-between">
                    <p className="text-[8px] text-white/60">Performance Overview</p>
                    <span className="flex items-center gap-2 text-[7px] text-white/40">
                        <span className="flex items-center gap-1">
                            <i className="inline-block h-1.5 w-1.5 rounded-full bg-[#7000FF]" /> Ingresos
                        </span>
                        <span className="flex items-center gap-1">
                            <i className="inline-block h-1.5 w-1.5 rounded-full bg-[#00FF94]" /> Lectores
                        </span>
                    </span>
                </div>
                <svg viewBox="0 0 300 80" className="w-full h-16 mt-1" preserveAspectRatio="none">
                    {[16, 32, 48, 64].map((y) => (
                        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#ffffff" strokeOpacity="0.06" />
                    ))}
                    <path
                        d="M0,62 L50,52 L100,58 L150,36 L200,42 L250,22 L300,14"
                        fill="none"
                        stroke="#7000FF"
                        strokeWidth="2"
                    />
                    <path
                        d="M0,70 L50,66 L100,58 L150,60 L200,44 L250,48 L300,30"
                        fill="none"
                        stroke="#00FF94"
                        strokeWidth="1.6"
                    />
                </svg>
            </div>

            <div className="space-y-1.5">
                <p className="text-[8px] text-white/60">Recent Transactions</p>
                {TXNS.map((t) => (
                    <div key={t.who} className="flex items-center gap-2">
                        <span
                            className="tt-mono grid h-7 w-7 place-items-center rounded-full text-[8px] font-bold"
                            style={{ backgroundImage: "linear-gradient(135deg,#7000FF,#00FF94)", color: "#000" }}
                        >
                            {t.initials}
                        </span>
                        <span className="flex-1 min-w-0">
                            <span className="block text-[8px] leading-tight truncate">{t.who}</span>
                            <span className="block text-[7px] leading-tight text-white/40">{t.what}</span>
                        </span>
                        <span className="text-right">
                            <span className="tt-mono block text-[9px] font-bold text-[#00FF94]">{t.amount}</span>
                            <span className="block text-[7px] text-white/30">{t.when}</span>
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121212] px-2 py-1.5">
                <span className="text-[8px] text-white/70">Story Pricing</span>
                <span className="relative h-4 w-8 rounded-full bg-[#7000FF]">
                    <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white" />
                </span>
            </div>
        </div>

        <MockNav active={3} />
    </div>
);

/* ------------------------------- LANDING ------------------------------- */

const Landing = () => {
    const reduce = useReducedMotion();

    /* Héroe: revelación palabra a palabra del tagline. */
    const heroWords = useMemo(() => p.tagline.split(" "), []);
    const [wpm, setWpm] = useState(650);
    const heroMs = wpm > 0 ? Math.round(60000 / wpm) : 0;
    const { index: heroIndex, done: heroDone, word: heroWord } = useRsvp(heroWords, heroMs);

    /* Sólo la tarjeta visible ejecuta su temporizador, igual que en la app. */
    const phoneRef = useRef<HTMLDivElement>(null);
    const phoneActive = useInView(phoneRef, { amount: 0.3 });

    /* Herramientas del creador. */
    const [tool, setTool] = useState(0);

    /* Sección activa: alimenta la pastilla del medidor y el riel vertical. */
    const [section, setSection] = useState(0);
    useEffect(() => {
        const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(
            (n): n is HTMLElement => n !== null
        );
        if (nodes.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const i = SECTIONS.findIndex((s) => s.id === entry.target.id);
                    if (i >= 0) setSection(i);
                });
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );
        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, []);

    const toolScreens = [
        { node: <MockLab />, screen: p.uiScreens[1] },
        { node: <MockWriter />, screen: p.uiScreens[2] },
        { node: <MockSynth />, screen: p.uiScreens[3] },
        { node: <MockWallet />, screen: p.uiScreens[4] },
    ];

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* Medidor fijo: el «650 WPM» de la app, aquí marcando la sección. */}
            <div className="fixed z-40 hidden left-4 top-1/2 -translate-y-1/2 lg:block">
                <div className="tt-glass flex items-center gap-2 rounded-full px-3 py-2">
                    <Gauge size={13} color="#00FF94" />
                    <span className="tt-mono text-[10px] font-bold tracking-wider">
                        {String(section + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-white/60">{SECTIONS[section]?.label}</span>
                </div>
            </div>

            {/* Riel vertical de progreso del feed. */}
            <div className="fixed z-40 hidden right-3 top-1/2 -translate-y-1/2 flex-col gap-1.5 md:flex">
                {SECTIONS.map((s, i) => (
                    <a
                        key={s.id}
                        href={`#${s.id}`}
                        aria-label={s.label}
                        className="block w-[2px] rounded-full transition-all duration-500"
                        style={{
                            height: i === section ? 26 : 14,
                            background: i === section ? "#00FF94" : "rgba(255,255,255,0.18)",
                            boxShadow: i === section ? "0 0 10px #00FF94" : "none",
                        }}
                    />
                ))}
            </div>

            {/* ─────────────────────────── 01 · HÉROE ─────────────────────────── */}
            <section
                id="tt-hero"
                className="tt-section tt-snap relative flex min-h-[100svh] flex-col justify-center px-4 pt-28 pb-20 md:px-6 md:pt-32"
            >
                <span
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(60% 50% at 50% 38%, rgba(112,0,255,0.28), transparent 70%), radial-gradient(40% 40% at 85% 85%, rgba(0,255,148,0.10), transparent 70%)",
                    }}
                />

                <div className="relative w-full max-w-5xl mx-auto">
                    <p className="tt-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/45">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] anim-blink" />
                        feed · 01 / {SECTIONS.length}
                    </p>

                    <h1 className="mt-5 text-6xl font-black leading-none tracking-tight md:text-8xl">
                        <span className="brand-gradient-text">{p.name}</span>
                    </h1>

                    {/* La palabra que se lee, sobre el halo violeta. */}
                    <div className="relative grid h-24 mt-8 place-items-center md:h-32">
                        <span aria-hidden className="tt-halo absolute h-40 w-40 rounded-full md:h-56 md:w-56" />
                        <span
                            key={`${heroWord}-${heroIndex}`}
                            className="tt-mono tt-word relative text-4xl font-bold leading-none md:text-6xl"
                        >
                            {heroWord}
                        </span>
                    </div>

                    {/* El párrafo completo, que se enciende al terminar. */}
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed md:text-2xl">
                        {heroWords.map((w, i) => (
                            <span
                                key={`${w}-${i}`}
                                className={i === heroIndex || heroDone ? "tt-lit" : "tt-dim"}
                                style={{ transition: heroDone ? "color 0.4s ease" : undefined }}
                            >
                                {w}
                                {i < heroWords.length - 1 ? " " : ""}
                            </span>
                        ))}
                    </p>

                    {/* Control de velocidad, como el medidor de la app. */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                        <span className="tt-mono text-[10px] uppercase tracking-[0.24em] text-white/35">velocidad</span>
                        {[
                            { v: 650, l: "650 wpm" },
                            { v: 325, l: "325 wpm" },
                            { v: 0, l: "pausa" },
                        ].map((o) => (
                            <button
                                key={o.v}
                                type="button"
                                onClick={() => setWpm(o.v)}
                                className={`tt-mono rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                                    wpm === o.v
                                        ? "bg-[#00FF94] text-black"
                                        : "border border-white/12 text-white/50 hover:text-white"
                                }`}
                            >
                                {o.l}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                        <Chip>{p.status}</Chip>
                    </div>
                    <p className="tt-mono mt-4 text-center text-[11px] text-white/40">{p.role}</p>

                    <div className="flex flex-wrap justify-center gap-3 mt-9">
                        {p.links.play && (
                            <BrandButton href={p.links.play}>
                                <Play size={16} /> Google Play
                            </BrandButton>
                        )}
                        {p.links.web && (
                            <BrandButton href={p.links.web} variant={p.links.play ? "outline" : "solid"}>
                                <Icons.Globe size={16} /> Ver el sitio
                            </BrandButton>
                        )}
                        {p.links.demo && !p.links.web && (
                            <BrandButton href={p.links.demo} variant="outline">
                                <ArrowUpRight size={16} /> Ver demo
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <BrandButton href={p.links.github} variant="outline">
                                <Icons.Github size={16} /> Código
                            </BrandButton>
                        )}
                        {!p.links.play && !p.links.web && !p.links.demo && !p.links.github && (
                            <>
                                <BrandButton href="#tt-reader">
                                    <Gauge size={16} /> Ver la mecánica
                                </BrandButton>
                                <BrandButton href="https://wa.me/584168624450" variant="outline">
                                    <MessageCircle size={16} /> Pedir la demo
                                </BrandButton>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ─────────────────── 02 · PROBLEMA Y SOLUCIÓN ─────────────────── */}
            <section
                id="tt-chat"
                className="tt-section tt-snap relative flex min-h-[100svh] items-center px-4 py-24 md:px-6"
            >
                <div className="w-full max-w-3xl mx-auto">
                    <SectionHead
                        index="02 / La conversación"
                        title={
                            <>
                                Lo que pasa cuando <span className="brand-gradient-text">el pulgar decide</span>
                            </>
                        }
                        lead="La misma consola de chat del Writing Studio, usada aquí para contar por qué existe TikText."
                    />

                    <div className="mt-12 space-y-4">
                        <Reveal direction="left" amount={0.4}>
                            <div className="tt-bubble-me ml-auto max-w-[85%] rounded-2xl rounded-br-sm px-5 py-4">
                                <Label tone="mute">lector</Label>
                                <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">{p.problem}</p>
                            </div>
                        </Reveal>

                        <Reveal direction="right" delay={0.08} amount={0.4}>
                            <div className="tt-bubble-ai max-w-[92%] rounded-2xl rounded-bl-sm px-5 py-4">
                                <Label>tiktext</Label>
                                <p className="mt-2 text-sm leading-relaxed text-white/90 md:text-base">
                                    {p.solution}
                                    <span className="tt-caret" />
                                </p>
                            </div>
                        </Reveal>

                        <Stagger className="flex flex-wrap gap-2 pt-2" stagger={0.08}>
                            {["92 ms por palabra", "scroll-snap obligatorio", "capítulos con precio", "propinas en monedas"].map(
                                (t) => (
                                    <StaggerItem key={t} y={10}>
                                        <span className="tt-mono rounded-full border border-[#7000FF]/45 bg-[#7000FF]/12 px-3 py-1.5 text-[11px] text-[#C7A6FF]">
                                            {t}
                                        </span>
                                    </StaggerItem>
                                )
                            )}
                        </Stagger>
                    </div>
                </div>
            </section>

            {/* ──────────────────── 03 · MECÁNICA DEL LECTOR ──────────────────── */}
            <section
                id="tt-reader"
                className="tt-section tt-snap relative flex min-h-[100svh] items-center px-4 py-24 md:px-6"
            >
                <span
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(45% 45% at 22% 50%, rgba(112,0,255,0.20), transparent 70%)" }}
                />
                <div className="relative grid items-center w-full max-w-6xl gap-12 mx-auto lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
                    <Reveal direction="scale" className="justify-self-center">
                        <div ref={phoneRef} className="w-[268px] md:w-[300px]">
                            <PhoneFrame>
                                <MockFeed active={phoneActive} />
                            </PhoneFrame>
                            <p className="tt-mono mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-white/35">
                                {p.uiScreens[0]?.name}
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <SectionHead
                            index="03 / La mecánica"
                            title={
                                <>
                                    Una palabra fija, <span className="brand-gradient-text">cero movimiento ocular</span>
                                </>
                            }
                        />

                        <div className="mt-8 space-y-4">
                            {[
                                {
                                    k: "92 ms",
                                    t: "El intervalo",
                                    d: "650 palabras por minuto salen exactamente a 92 milisegundos por palabra. La palabra sale del centro y la siguiente entra con un fundido de 60 ms.",
                                },
                                {
                                    k: "1 timer",
                                    t: "Sólo la tarjeta activa",
                                    d: "El contenedor divide scrollTop entre la altura de ventana para saber qué historia se está viendo; el resto de tarjetas no ejecuta ningún intervalo.",
                                },
                                {
                                    k: "snap-y",
                                    t: "El feed",
                                    d: "snap-y mandatory con snap-always: cada historia se ancla a la pantalla completa y no hay estados intermedios. Esta misma página lo usa.",
                                },
                            ].map((row, i) => (
                                <Reveal key={row.k} delay={i * 0.08}>
                                    <div className="tt-glass tt-lift flex gap-4 rounded-2xl p-4 md:p-5">
                                        <span className="tt-mono shrink-0 rounded-lg bg-[#7000FF]/18 px-2.5 py-1.5 text-[12px] font-bold text-[#B78BFF]">
                                            {row.k}
                                        </span>
                                        <span>
                                            <span className="block text-sm font-semibold md:text-base">{row.t}</span>
                                            <span className="block mt-1 text-sm leading-relaxed text-white/60">
                                                {row.d}
                                            </span>
                                        </span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <Reveal delay={0.2}>
                            <p className="tt-mono mt-6 text-[11px] leading-relaxed text-white/35">
                                {p.brand.mood}
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── 04 · HIGHLIGHTS ───────────────────────── */}
            <section
                id="tt-highlights"
                className="tt-section tt-snap relative flex min-h-[100svh] items-center px-4 py-24 md:px-6"
            >
                <div className="w-full max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / Piezas clave"
                        title={
                            <>
                                Seis piezas que <span className="brand-gradient-text">sostienen el feed</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="tt-glass tt-lift relative h-full overflow-hidden rounded-2xl p-5">
                                        <span
                                            aria-hidden
                                            className="absolute rounded-full opacity-0 -right-10 -top-10 h-28 w-28 blur-2xl transition-opacity duration-500"
                                            style={{ background: "#7000FF" }}
                                        />
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="grid rounded-xl h-10 w-10 place-items-center"
                                                style={{
                                                    background:
                                                        i % 3 === 0
                                                            ? "rgba(112,0,255,0.20)"
                                                            : i % 3 === 1
                                                            ? "rgba(0,255,148,0.14)"
                                                            : "rgba(255,215,0,0.14)",
                                                    color: i % 3 === 0 ? "#B78BFF" : i % 3 === 1 ? "#00FF94" : "#FFD700",
                                                }}
                                            >
                                                <Icon size={18} />
                                            </span>
                                            <span className="tt-mono text-[10px] text-white/25">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-base font-bold">{h.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-white/60">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ─────────────── 05 · HERRAMIENTAS DEL CREADOR (mockups) ─────────────── */}
            <section
                id="tt-studio"
                className="tt-section tt-snap relative flex min-h-[100svh] items-center px-4 py-24 md:px-6"
            >
                <div className="w-full max-w-6xl mx-auto">
                    <SectionHead
                        index="05 / El estudio"
                        title={
                            <>
                                Cuatro herramientas <span className="brand-gradient-text">dentro de la misma app</span>
                            </>
                        }
                        lead="Las mismas tarjetas isométricas del selector de géneros, una por destino del estudio. Toca una para abrir su pantalla."
                    />

                    <div className="tt-scroll flex gap-5 px-1 pt-14 pb-8">
                        {TOOLS.map((t, i) => {
                            const Ico = t.icon;
                            const on = tool === i;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setTool(i)}
                                    data-on={on ? "1" : "0"}
                                    aria-pressed={on}
                                    className="tt-iso relative flex h-[112px] w-[140px] shrink-0 flex-col justify-between rounded-2xl p-3 text-left"
                                    style={{
                                        backgroundImage: `linear-gradient(150deg, ${t.from}, ${t.to})`,
                                        boxShadow: on
                                            ? `0 22px 46px -18px ${t.from}, 0 0 0 1px rgba(255,255,255,0.28) inset`
                                            : `0 16px 34px -20px ${t.from}`,
                                        opacity: on ? 1 : 0.72,
                                    }}
                                >
                                    <Ico size={18} color="#050505" />
                                    <span>
                                        <span className="block text-[13px] font-bold text-black">{t.label}</span>
                                        <span className="tt-mono block text-[9px] uppercase tracking-[0.18em] text-black/55">
                                            {String(i + 1).padStart(2, "0")} / 04
                                        </span>
                                    </span>
                                    {on && (
                                        <span className="absolute rounded-full -bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 bg-[#00FF94]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid items-center gap-10 mt-6 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)]">
                        <div className="justify-self-center w-[262px] md:w-[290px]">
                            <PhoneFrame>{toolScreens[tool].node}</PhoneFrame>
                        </div>

                        <div>
                            <Label tone="green">{`pantalla ${tool + 1} de 4`}</Label>
                            <h3 className="mt-3 text-2xl font-bold md:text-4xl">{toolScreens[tool].screen?.name}</h3>
                            <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
                                {
                                    [
                                        "Semilla narrativa, cinco marcos de género en tarjetas isométricas, biblioteca musical y un roadmap de capítulos con score de complejidad e interruptor de monetización por capítulo.",
                                        "Lienzo contenteditable con barra flotante al seleccionar texto —Summarize, Expand, Make Aggressive— y una consola de chat con seis directivas rápidas bajo el 60/40 de la pantalla.",
                                        "Generación de portadas por prompt con dieciséis presets de estilo, variaciones, biblioteca de stock y una vista previa que simula el texto RSVP sobre la imagen elegida.",
                                        "Saldo en USDT sobre Binance Pay, gráfico semanal de ingresos y lectores, transacciones recientes y ajustes de precio por capítulo en monedas.",
                                    ][tool]
                                }
                            </p>

                            <div className="flex flex-wrap gap-2 mt-6">
                                {TOOLS.map((t, i) => (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => setTool(i)}
                                        className={`tt-mono rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                                            tool === i
                                                ? "bg-white text-black"
                                                : "border border-white/12 text-white/45 hover:text-white"
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Galería de material real, si el proyecto llega a tenerlo. */}
            {p.media.length > 0 && (
                <section className="relative px-4 py-20 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHead index="05b / Capturas" title="Material del proyecto" />
                        <DragRail className="mt-10">
                            {p.media.map((m) =>
                                m.src.endsWith(".mp4") ? (
                                    <div key={m.src} className="w-[280px] shrink-0">
                                        <AutoVideo src={m.src} />
                                    </div>
                                ) : (
                                    <ShotCard
                                        key={m.src}
                                        src={m.src}
                                        alt={m.caption}
                                        caption={m.caption}
                                        className="w-[280px] shrink-0"
                                    />
                                )
                            )}
                        </DragRail>
                    </div>
                </section>
            )}

            {/* ───────────────────────── 06 · MONETIZACIÓN ───────────────────────── */}
            <section
                id="tt-money"
                className="tt-section tt-snap relative flex min-h-[100svh] items-center px-4 py-24 md:px-6"
            >
                <span aria-hidden className="tt-gold absolute inset-0 opacity-70" />
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(50% 50% at 70% 40%, rgba(255,215,0,0.12), transparent 70%)" }}
                />
                <div className="relative w-full max-w-5xl mx-auto">
                    <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_180px]">
                        <div>
                            <SectionHead
                                index="06 / Monetización"
                                title={
                                    <>
                                        Todo lo que cuesta dinero <span className="brand-gradient-text">se pinta en oro</span>
                                    </>
                                }
                                lead="Capítulos con candado, propinas que laten y una billetera que lleva la cuenta: el escritor cobra dentro de la misma pantalla donde publica."
                            />

                            <div className="grid gap-4 mt-10 sm:grid-cols-3">
                                {[
                                    { k: "120–180", l: "monedas por capítulo bloqueado" },
                                    { k: "USDT", l: "saldo sobre Binance Pay" },
                                    { k: "7 días", l: "de ingresos y lectores en el gráfico" },
                                ].map((m, i) => (
                                    <Reveal key={m.k} delay={i * 0.08}>
                                        <div
                                            className="h-full p-4 border rounded-2xl"
                                            style={{
                                                borderColor: "rgba(255,215,0,0.28)",
                                                background: "rgba(255,215,0,0.05)",
                                            }}
                                        >
                                            <p className="tt-mono text-xl font-bold text-[#FFD700]">{m.k}</p>
                                            <p className="mt-1 text-xs leading-relaxed text-white/55">{m.l}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        <Reveal direction="scale" className="justify-self-center">
                            <span className="relative grid place-items-center">
                                <span
                                    aria-hidden
                                    className="absolute rounded-full h-36 w-36 blur-3xl"
                                    style={{ background: "rgba(255,215,0,0.35)" }}
                                />
                                <span
                                    className="anim-spin-slow relative grid h-28 w-28 place-items-center rounded-full"
                                    style={{
                                        backgroundImage:
                                            "conic-gradient(from 0deg, #FFD700, #FF8A00, #FFD700, #FFF3B0, #FFD700)",
                                        boxShadow: "0 20px 60px -18px rgba(255,215,0,0.8)",
                                    }}
                                >
                                    <span className="grid rounded-full h-20 w-20 place-items-center bg-[#1a1200]">
                                        <Coins size={30} color="#FFD700" />
                                    </span>
                                </span>
                            </span>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ─────────────── 07 · FUNCIONALIDADES COMO ROADMAP ─────────────── */}
            <section
                id="tt-roadmap"
                className="tt-section tt-snap relative px-4 py-24 md:px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <SectionHead
                        index="07 / Funcionalidades"
                        title={
                            <>
                                El roadmap, <span className="brand-gradient-text">capítulo a capítulo</span>
                            </>
                        }
                        lead="Las diecisiete funcionalidades presentadas con la misma fila que el Story Roadmap del AI Lab: manija, código monoespaciado y barra de complejidad."
                    />

                    <div className="mt-12 space-y-2">
                        <Stagger stagger={0.05}>
                            {p.features.map((f, i) => (
                                <StaggerItem key={f} y={14}>
                                    <div className="tt-lift group flex items-center gap-3 rounded-xl border border-white/10 bg-[#121212]/70 px-3 py-3 md:px-4">
                                        <GripVertical size={14} className="opacity-20 shrink-0" />
                                        <span className="tt-mono shrink-0 text-[11px] text-[#9A5BFF]">
                                            CH {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="block text-sm leading-snug text-white/80">{f}</span>
                                            <span className="block h-[3px] mt-2 w-full rounded-full bg-white/8">
                                                <span
                                                    className="block h-full rounded-full"
                                                    style={{
                                                        width: `${42 + ((i * 17) % 55)}%`,
                                                        backgroundImage:
                                                            i % 4 === 3
                                                                ? "linear-gradient(90deg,#FFD700,#FF8A00)"
                                                                : "linear-gradient(90deg,#7000FF,#00FF94)",
                                                    }}
                                                />
                                            </span>
                                        </span>
                                        <span
                                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                                                i % 4 === 3
                                                    ? "bg-[#FFD700]/15 text-[#FFD700]"
                                                    : "bg-white/5 text-white/35"
                                            }`}
                                        >
                                            {i % 4 === 3 ? <Lock size={12} /> : <LockOpen size={12} />}
                                        </span>
                                    </div>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── 08 · ARQUITECTURA ───────────────────────── */}
            <section
                id="tt-arch"
                className="tt-section tt-snap relative px-4 py-24 md:px-6"
            >
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="08 / Arquitectura"
                        title={
                            <>
                                Tres capas y <span className="brand-gradient-text">un solo cliente HTTP</span>
                            </>
                        }
                        lead="Router por estado, sin dependencia externa: la vista decide el modo, los servicios tipan la respuesta y el cliente axios centraliza los errores."
                    />

                    <Reveal className="mt-12">
                        <div className="tt-scroll rounded-2xl border border-white/10 bg-black/40 p-4 md:p-8">
                            <svg viewBox="0 0 860 430" className="w-full min-w-[660px]" role="img" aria-label="Diagrama de capas de TikText">
                                <defs>
                                    <linearGradient id="tt-gr" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#7000FF" />
                                        <stop offset="100%" stopColor="#00FF94" />
                                    </linearGradient>
                                </defs>

                                {/* Capa 1 · vista */}
                                <rect x="20" y="20" width="820" height="112" rx="16" fill="rgba(112,0,255,0.08)" stroke="rgba(112,0,255,0.45)" />
                                <text x="40" y="48" fill="#B78BFF" fontSize="12" letterSpacing="4" fontFamily="ui-monospace, monospace">
                                    CAPA 1 · VISTA
                                </text>
                                {[
                                    { x: 40, label: "App.tsx", sub: "router por estado" },
                                    { x: 240, label: "StoryCard", sub: "feed + RSVP" },
                                    { x: 440, label: "StoryLab", sub: "4 pestañas" },
                                    { x: 640, label: "CreatorWallet", sub: "4 pestañas" },
                                ].map((b) => (
                                    <g key={b.label}>
                                        <rect x={b.x} y="62" width="180" height="52" rx="10" fill="#121212" stroke="rgba(255,255,255,0.12)" />
                                        <text x={b.x + 16} y="86" fill="#ffffff" fontSize="14" fontWeight="600">
                                            {b.label}
                                        </text>
                                        <text x={b.x + 16} y="103" fill="rgba(255,255,255,0.45)" fontSize="11">
                                            {b.sub}
                                        </text>
                                    </g>
                                ))}

                                {/* Capa 2 · servicios */}
                                <rect x="20" y="176" width="820" height="96" rx="16" fill="rgba(0,255,148,0.06)" stroke="rgba(0,255,148,0.35)" />
                                <text x="40" y="204" fill="#00FF94" fontSize="12" letterSpacing="4" fontFamily="ui-monospace, monospace">
                                    CAPA 2 · SERVICIOS
                                </text>
                                {[
                                    { x: 40, label: "creatorStudio.ts", sub: "CreatorStats · CreatorContent" },
                                    { x: 340, label: "types.ts", sub: "PaginatedResponse<T>" },
                                    { x: 640, label: "toast.ts", sub: "parser de errores" },
                                ].map((b) => (
                                    <g key={b.label}>
                                        <rect x={b.x} y="216" width="180" height="42" rx="10" fill="#121212" stroke="rgba(255,255,255,0.12)" />
                                        <text x={b.x + 16} y="234" fill="#ffffff" fontSize="13" fontWeight="600">
                                            {b.label}
                                        </text>
                                        <text x={b.x + 16} y="249" fill="rgba(255,255,255,0.45)" fontSize="10">
                                            {b.sub}
                                        </text>
                                    </g>
                                ))}

                                {/* Capa 3 · cliente HTTP */}
                                <rect x="20" y="316" width="820" height="96" rx="16" fill="rgba(255,215,0,0.05)" stroke="rgba(255,215,0,0.32)" />
                                <text x="40" y="344" fill="#FFD700" fontSize="12" letterSpacing="4" fontFamily="ui-monospace, monospace">
                                    CAPA 3 · CLIENTE HTTP
                                </text>
                                {[
                                    { x: 40, label: "http.ts", sub: "axios · X-Api-Key · X-Timezone" },
                                    { x: 340, label: "api.ts", sub: "get · post · put · patch · del" },
                                    { x: 640, label: "API REST v1", sub: "Creator Studio" },
                                ].map((b) => (
                                    <g key={b.label}>
                                        <rect x={b.x} y="356" width="180" height="42" rx="10" fill="#121212" stroke="rgba(255,255,255,0.12)" />
                                        <text x={b.x + 16} y="374" fill="#ffffff" fontSize="13" fontWeight="600">
                                            {b.label}
                                        </text>
                                        <text x={b.x + 16} y="389" fill="rgba(255,255,255,0.45)" fontSize="10">
                                            {b.sub}
                                        </text>
                                    </g>
                                ))}

                                {/* Conectores trazados al entrar */}
                                {[130, 430, 730].map((x, i) => (
                                    <motion.path
                                        key={x}
                                        d={`M${x},114 L${x},216`}
                                        stroke="url(#tt-gr)"
                                        strokeWidth="1.5"
                                        fill="none"
                                        initial={{ pathLength: reduce ? 1 : 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                                    />
                                ))}
                                {[130, 430, 730].map((x, i) => (
                                    <motion.path
                                        key={`b-${x}`}
                                        d={`M${x},258 L${x},356`}
                                        stroke="url(#tt-gr)"
                                        strokeWidth="1.5"
                                        fill="none"
                                        initial={{ pathLength: reduce ? 1 : 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                                    />
                                ))}
                            </svg>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="p-6 mt-8 border-l-2 md:p-8" style={{ borderColor: "#7000FF", background: "rgba(255,255,255,0.02)" }}>
                            <Label>src/</Label>
                            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ─────────────────────────── 09 · RETOS ─────────────────────────── */}
            <section
                id="tt-challenges"
                className="tt-section tt-snap relative px-4 py-24 md:px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <SectionHead
                        index="09 / Retos"
                        title={
                            <>
                                Cinco cosas que <span className="brand-gradient-text">no salieron a la primera</span>
                            </>
                        }
                    />

                    <div className="mt-12 space-y-5">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="overflow-hidden border rounded-2xl border-white/10">
                                    <div className="p-5 md:p-6 bg-white/[0.03]">
                                        <span className="tt-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/35">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                                            síntoma {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">
                                            {c.problem}
                                        </p>
                                    </div>
                                    <div
                                        className="p-5 md:p-6"
                                        style={{ background: "rgba(112,0,255,0.12)", borderTop: "1px solid rgba(112,0,255,0.28)" }}
                                    >
                                        <span className="tt-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#00FF94]">
                                            <Check size={11} strokeWidth={3} />
                                            patch
                                        </span>
                                        <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">
                                            {c.solution}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────────────────────── 10 · MÉTRICAS ────────────────────────── */}
            <section
                id="tt-metrics"
                className="tt-section tt-snap relative flex min-h-[100svh] items-center px-4 py-24 md:px-6"
            >
                <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(50% 40% at 50% 50%, rgba(112,0,255,0.18), transparent 70%)" }}
                />
                <div className="relative w-full max-w-6xl mx-auto">
                    <SectionHead
                        index="10 / Números"
                        title={
                            <>
                                El prototipo <span className="brand-gradient-text">en cifras</span>
                            </>
                        }
                        align="center"
                    />

                    <div className="tt-glass grid gap-10 mt-14 rounded-3xl p-8 sm:grid-cols-2 lg:grid-cols-3 md:p-12">
                        {p.metrics.map((m) => (
                            <div key={m.label} className="tt-mono text-center">
                                <CountMetric value={m.value} label={m.label} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─────────────────────── 11 · STACK Y PALETA ─────────────────────── */}
            <section
                id="tt-stack"
                className="tt-section tt-snap relative px-4 py-24 md:px-6"
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="11 / Stack"
                        title={
                            <>
                                Con qué está <span className="brand-gradient-text">construido</span>
                            </>
                        }
                    />

                    <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06}>
                                <div className="tt-glass tt-lift h-full rounded-2xl p-5">
                                    <Label tone={i % 2 === 0 ? "violet" : "green"}>{group.group}</Label>
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Paleta de marca */}
                    <Reveal className="mt-10">
                        <div className="p-5 border rounded-2xl border-white/10 md:p-6">
                            <Label tone="gold">paleta</Label>
                            <div className="tt-scroll flex gap-3 mt-4">
                                {[
                                    ["primary", p.brand.primary],
                                    ["secondary", p.brand.secondary],
                                    ["accent", p.brand.accent],
                                    ["surface", p.brand.surface],
                                    ["bg", p.brand.bg],
                                    ["text", p.brand.text],
                                ].map(([name, hex]) => (
                                    <span key={name} className="shrink-0 text-center">
                                        <span
                                            className="block border rounded-lg h-14 w-20 border-white/15"
                                            style={{ background: hex }}
                                        />
                                        <span className="tt-mono mt-2 block text-[9px] uppercase tracking-[0.14em] text-white/35">
                                            {name}
                                        </span>
                                        <span className="tt-mono block text-[10px] text-white/70">{hex}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ─────────────────────────── EL RESUMEN ─────────────────────────── */}
            <section className="relative px-4 py-24 md:px-6">
                <div className="max-w-3xl mx-auto">
                    <Label tone="mute">la historia completa</Label>
                    <Stagger className="mt-6 space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={`leading-relaxed ${
                                        i === 0 ? "text-lg text-white/90 md:text-2xl" : "text-sm text-white/60 md:text-base"
                                    }`}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <div className="py-5 border-y border-white/10">
                <Marquee
                    items={[
                        "650 WPM",
                        "scroll-snap",
                        "AI Lab",
                        "Writing Studio",
                        "Visual Synth",
                        "Creator Wallet",
                        "capítulos premium",
                        "propinas en monedas",
                    ]}
                    speed={30}
                    separator="·"
                    className="tt-mono text-[11px] uppercase tracking-[0.24em] text-white/45"
                />
            </div>

            <div className="pb-32">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un front-end completo: feed con scroll-snap, lector RSVP sincronizado, cuatro herramientas de creación y una capa de datos tipada con manejo central de errores. Si tienes un producto que necesita interfaz de verdad, este es el terreno."
                />
            </div>
        </ProjectShell>
    );
};

export default Landing;
