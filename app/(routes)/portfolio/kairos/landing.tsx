"use client"

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Globe, Radio, TrendingDown, TrendingUp } from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Magnetic, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { BrowserFrame, DragRail, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("kairos")!;
const nxt = nextProject("kairos");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* ───────────────────────── paleta literal del terminal ─────────────────────────
   Espejo de los tokens del producto: el cian es la única acción, el verde y el
   rojo sólo significan alcista y bajista, el resto es gris de terminal.        */
const C = {
    bg: "#0b0f14",
    panel: "#131922",
    sunken: "#10151c",
    line: "#2a3441",
    cyan: "#22d3ee",
    up: "#16c784",
    down: "#ea3943",
    amber: "#f59e0b",
    magenta: "#ff2d55",
    yellow: "#facc15",
    text: "#e3e8ef",
    dim: "#93a1b5",
};

const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

/* ───────────────────────── datos deterministas (mulberry32) ─────────────────────────
   Nada de Math.random ni Date.now: la misma serie en el servidor y en el cliente. */
const rnd = (seed: number) => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

type Candle = { o: number; h: number; l: number; c: number; v: number };

const makeCandles = (n: number, seed: number, start: number, vol: number): Candle[] => {
    const rand = rnd(seed);
    const out: Candle[] = [];
    let price = start;
    for (let i = 0; i < n; i += 1) {
        const o = price;
        const c = o + (rand() - 0.47) * vol;
        const h = Math.max(o, c) + rand() * vol * 0.55;
        const l = Math.min(o, c) - rand() * vol * 0.55;
        out.push({ o, h, l, c, v: 0.22 + rand() * 0.78 });
        price = c;
    }
    return out;
};

const HERO_SERIES = makeCandles(66, 20260214, 67180, 118);
const PANEL_SERIES = makeCandles(48, 991, 67210, 96);
const RSI_SERIES = Array.from({ length: 48 }, (_, i) => 50 + Math.sin(i * 0.42) * 22 + Math.sin(i * 1.13) * 7);

/** Formato español con separador de miles y coma decimal. */
const fmt = (n: number, d = 2) => {
    const [int, frac] = Math.abs(n).toFixed(d).split(".");
    const sign = n < 0 ? "-" : "";
    return `${sign}${int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${frac ? `,${frac}` : ""}`;
};

const INSTRUMENTS = [
    { sym: "NQ", name: "Nasdaq 100 · futuro", px: 20418.75, d: 2 },
    { sym: "ES", name: "S&P 500 · futuro", px: 5842.25, d: 2 },
    { sym: "BTCUSDT", name: "Bitcoin · Binance", px: 67412.3, d: 2 },
    { sym: "ETHUSDT", name: "Ethereum · Binance", px: 3284.66, d: 2 },
    { sym: "AAPL", name: "Apple Inc.", px: 228.41, d: 2 },
    { sym: "NVDA", name: "NVIDIA Corp.", px: 121.08, d: 2 },
    { sym: "EURUSD", name: "Euro / Dólar", px: 1.0842, d: 4 },
    { sym: "VIX", name: "Índice de volatilidad", px: 14.62, d: 2 },
];

/** Deriva determinista del precio para el índice i en el tick t. */
const drift = (i: number, t: number) =>
    Math.sin(t * 0.11 + i * 1.7) * 0.0021 + Math.sin(t * 0.037 + i * 0.9) * 0.0038;

/* ───────────────────────── reloj maestro ─────────────────────────
   Un solo requestAnimationFrame a ~8 Hz alimenta todo lo vivo de la página,
   de modo que las cifras de secciones distintas parpadean en fase.          */
const TickCtx = createContext(0);
const useTick = () => useContext(TickCtx);

const Clock = ({ children, hz = 8 }: { children: React.ReactNode; hz?: number }) => {
    const [tick, setTick] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        if (reduce) return;
        let raf = 0;
        let last = 0;
        const step = (now: number) => {
            if (now - last >= 1000 / hz) {
                last = now;
                setTick((t) => t + 1);
            }
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [hz, reduce]);

    return <TickCtx.Provider value={tick}>{children}</TickCtx.Provider>;
};

const css = `
.kairos-mono { font-family: ${MONO}; font-variant-numeric: tabular-nums; }
.kairos-grid {
  background-image:
    linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px);
  background-size: 32px 32px;
}
.kairos-halo { position: absolute; pointer-events: none; animation: kairos-breathe 18s ease-in-out infinite; }
@keyframes kairos-breathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.06); opacity: 1; }
}
@keyframes kairos-tape { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.kairos-tape-track { animation: kairos-tape 52s linear infinite; }
.kairos-tape-track:hover { animation-play-state: paused; }
@keyframes kairos-thread { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
.kairos-thread { background-size: 200% 100%; animation: kairos-thread 3s linear infinite; }
@keyframes kairos-beat {
  0%, 100% { opacity: 0.22; transform: scaleX(0.35); }
  10% { opacity: 1; transform: scaleX(1); }
  45% { opacity: 0.22; transform: scaleX(0.35); }
}
.kairos-beat { transform-origin: left; animation: kairos-beat 1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
@keyframes kairos-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
.kairos-dot { animation: kairos-dot 1.6s ease-in-out infinite; }
.kairos-row { transition: background-color 0.24s cubic-bezier(0.2, 0.8, 0.2, 1); }
.kairos-row:hover { background-color: rgba(34, 211, 238, 0.055); }
.kairos-card { transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.24s cubic-bezier(0.2, 0.8, 0.2, 1); }
.kairos-card:hover { transform: translateY(-1px); border-color: rgba(34, 211, 238, 0.5); }
.kairos-spark-line { transition: stroke-width 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.kairos-spark:hover .kairos-spark-line { stroke-width: 2.6; }
.kairos-spark-val { opacity: 0; transition: opacity 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.kairos-spark:hover .kairos-spark-val { opacity: 1; }
.kairos-key {
  border: 1px solid ${C.line};
  border-radius: 3px;
  padding: 1px 5px;
  color: ${C.dim};
}
.kairos-scroll { scrollbar-width: thin; scrollbar-color: ${C.line} transparent; }
.kairos-scroll::-webkit-scrollbar { height: 6px; }
.kairos-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 999px; }
@media (prefers-reduced-motion: reduce) {
  .kairos-halo, .kairos-tape-track, .kairos-thread, .kairos-beat, .kairos-dot { animation: none !important; }
  .kairos-card:hover { transform: none; }
}
`;

/* ───────────────────────── piezas vivas ───────────────────────── */

/** Cintillo de cotizaciones: precio en monoespaciada tabular y destello al cambiar. */
const TapeCell = ({ i, sym, px, d }: { i: number; sym: string; px: number; d: number }) => {
    const t = useTick();
    const dv = drift(i, t);
    const price = px * (1 + dv);
    const chg = dv * 100;
    const up = chg >= 0;
    const flash = Math.floor(t * 0.5 + i * 3) % 9 === 0;

    return (
        <span
            className="kairos-mono inline-flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded px-2.5 py-1 text-[11px] transition-colors duration-200"
            style={{ background: flash ? `${up ? C.up : C.down}1f` : "transparent" }}
        >
            <span className="font-semibold" style={{ color: C.text }}>{sym}</span>
            <span style={{ color: C.dim }}>{fmt(price, d)}</span>
            <span style={{ color: up ? C.up : C.down }}>
                {up ? "▲" : "▼"} {fmt(Math.abs(chg), 2)} %
            </span>
        </span>
    );
};

const Tape = () => (
    <div
        className="relative flex overflow-hidden border-y select-none"
        style={{ borderColor: C.line, background: C.sunken }}
    >
        <div className="kairos-tape-track flex shrink-0 gap-1 py-1.5 pr-1">
            {[...INSTRUMENTS, ...INSTRUMENTS].map((inst, i) => (
                <TapeCell key={`${inst.sym}-${i}`} i={i % INSTRUMENTS.length} sym={inst.sym} px={inst.px} d={inst.d} />
            ))}
        </div>
        <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-10"
            style={{ background: `linear-gradient(90deg, ${C.sunken}, transparent)` }}
        />
        <span
            aria-hidden
            className="absolute inset-y-0 right-0 w-10"
            style={{ background: `linear-gradient(270deg, ${C.sunken}, transparent)` }}
        />
    </div>
);

/** Contador del héroe: sube a 60 en 900 ms y luego oscila como un medidor real. */
const FpsCounter = () => {
    const [n, setN] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        if (reduce) {
            setN(60);
            return;
        }
        const start = performance.now();
        let raf = 0;
        const loop = (now: number) => {
            const e = now - start;
            const next =
                e < 900
                    ? Math.round(60 * (1 - Math.pow(1 - e / 900, 3)))
                    : 58 + (Math.floor((e - 900) / 620) % 3);
            setN((prev) => (prev === next ? prev : next));
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [reduce]);

    return (
        <span className="kairos-mono" style={{ color: C.cyan }}>
            {n}
        </span>
    );
};

/**
 * Panel de velas del héroe dibujado en canvas: caminata determinista, barra de
 * precios vertical, etiqueta de último precio y una cruceta fantasma que recorre
 * el gráfico de derecha a izquierda cada 12 s. Ni un render de React por fotograma.
 */
const HeroChart = () => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduce = useReducedMotion();

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0;
        let h = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = wrap.clientWidth;
            h = wrap.clientHeight;
            canvas.width = Math.max(1, Math.floor(w * dpr));
            canvas.height = Math.max(1, Math.floor(h * dpr));
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = (time: number) => {
            if (w === 0 || h === 0) return;
            const axisW = 62;
            const plotW = w - axisW;
            const volH = h * 0.16;
            const priceH = h - volH - 10;

            const live = HERO_SERIES[HERO_SERIES.length - 1];
            const beat = reduce ? 0 : Math.sin(time / 260) * 46;
            const liveClose = live.c + beat;
            const liveHigh = Math.max(live.h, liveClose + 18);
            const liveLow = Math.min(live.l, liveClose - 18);

            let min = Infinity;
            let max = -Infinity;
            HERO_SERIES.forEach((k, i) => {
                const hi = i === HERO_SERIES.length - 1 ? liveHigh : k.h;
                const lo = i === HERO_SERIES.length - 1 ? liveLow : k.l;
                if (hi > max) max = hi;
                if (lo < min) min = lo;
            });
            const pad = (max - min) * 0.08;
            min -= pad;
            max += pad;
            const y = (v: number) => ((max - v) / (max - min)) * priceH;

            ctx.clearRect(0, 0, w, h);

            /* rejilla de terminal */
            ctx.strokeStyle = "rgba(148,163,184,0.07)";
            ctx.lineWidth = 1;
            for (let gy = 0; gy < priceH; gy += 32) {
                ctx.beginPath();
                ctx.moveTo(0, Math.round(gy) + 0.5);
                ctx.lineTo(plotW, Math.round(gy) + 0.5);
                ctx.stroke();
            }
            for (let gx = plotW; gx > 0; gx -= 48) {
                ctx.beginPath();
                ctx.moveTo(Math.round(gx) + 0.5, 0);
                ctx.lineTo(Math.round(gx) + 0.5, priceH + volH + 10);
                ctx.stroke();
            }

            /* velas y volumen */
            const step = plotW / HERO_SERIES.length;
            const bodyW = Math.max(2, step * 0.62);
            HERO_SERIES.forEach((k, i) => {
                const isLive = i === HERO_SERIES.length - 1;
                const o = k.o;
                const c = isLive ? liveClose : k.c;
                const hi = isLive ? liveHigh : k.h;
                const lo = isLive ? liveLow : k.l;
                const cx = i * step + step / 2;
                const bull = c >= o;
                const color = bull ? C.up : C.down;

                ctx.globalAlpha = isLive && !reduce ? 0.72 + Math.abs(Math.sin(time / 320)) * 0.28 : 1;
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(Math.round(cx) + 0.5, y(hi));
                ctx.lineTo(Math.round(cx) + 0.5, y(lo));
                ctx.stroke();
                const top = y(Math.max(o, c));
                const height = Math.max(1, Math.abs(y(o) - y(c)));
                ctx.fillRect(cx - bodyW / 2, top, bodyW, height);
                ctx.globalAlpha = 0.35;
                ctx.fillRect(cx - bodyW / 2, h - k.v * volH, bodyW, k.v * volH);
                ctx.globalAlpha = 1;
            });

            /* barra de precios vertical */
            ctx.fillStyle = C.sunken;
            ctx.fillRect(plotW, 0, axisW, h);
            ctx.strokeStyle = C.line;
            ctx.beginPath();
            ctx.moveTo(plotW + 0.5, 0);
            ctx.lineTo(plotW + 0.5, h);
            ctx.stroke();
            /* ctx.font no resuelve custom properties: pila de fuentes literal */
            ctx.font = `10px ${MONO}`;
            ctx.textBaseline = "middle";
            ctx.fillStyle = C.dim;
            for (let i = 0; i <= 4; i += 1) {
                const v = min + ((max - min) / 4) * i;
                const py = y(v);
                ctx.fillText(fmt(v, 0), plotW + 8, py);
                ctx.strokeStyle = "rgba(148,163,184,0.07)";
                ctx.beginPath();
                ctx.moveTo(0, Math.round(py) + 0.5);
                ctx.lineTo(plotW, Math.round(py) + 0.5);
                ctx.stroke();
            }

            /* etiqueta de último precio deslizándose por la barra */
            const ly = y(liveClose);
            ctx.fillStyle = C.cyan;
            ctx.fillRect(plotW + 1, ly - 8, axisW - 1, 16);
            ctx.fillStyle = "#04222a";
            ctx.fillText(fmt(liveClose, 1), plotW + 7, ly);
            ctx.strokeStyle = "rgba(34,211,238,0.5)";
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(0, Math.round(ly) + 0.5);
            ctx.lineTo(plotW, Math.round(ly) + 0.5);
            ctx.stroke();
            ctx.setLineDash([]);

            /* cruceta fantasma: derecha → izquierda cada 12 s */
            if (!reduce) {
                const prog = (time % 12000) / 12000;
                const cx = plotW * (1 - prog);
                const idx = Math.min(HERO_SERIES.length - 1, Math.max(0, Math.floor(cx / step)));
                const cy = y(idx === HERO_SERIES.length - 1 ? liveClose : HERO_SERIES[idx].c);
                ctx.strokeStyle = "rgba(148,163,184,0.35)";
                ctx.setLineDash([2, 3]);
                ctx.beginPath();
                ctx.moveTo(Math.round(cx) + 0.5, 0);
                ctx.lineTo(Math.round(cx) + 0.5, priceH + volH + 10);
                ctx.moveTo(0, Math.round(cy) + 0.5);
                ctx.lineTo(plotW, Math.round(cy) + 0.5);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = C.panel;
                ctx.fillRect(plotW + 1, cy - 7, axisW - 1, 14);
                ctx.fillStyle = C.dim;
                ctx.fillText(fmt(HERO_SERIES[idx].c, 1), plotW + 7, cy);
            }
        };

        resize();
        draw(0);
        const observer = new ResizeObserver(() => {
            resize();
            draw(0);
        });
        observer.observe(wrap);

        let raf = 0;
        if (reduce) {
            draw(0);
        } else {
            const loop = (now: number) => {
                draw(now);
                raf = requestAnimationFrame(loop);
            };
            raf = requestAnimationFrame(loop);
        }

        return () => {
            observer.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [reduce]);

    return (
        <div
            className="relative overflow-hidden rounded-2xl border"
            style={{ borderColor: C.line, background: C.sunken, boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)" }}
        >
            <div
                className="kairos-mono flex items-center justify-between border-b px-3 py-2 text-[10px]"
                style={{ borderColor: C.line, color: C.dim }}
            >
                <span className="flex items-center gap-2">
                    <span className="kairos-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.up }} />
                    <span className="font-semibold" style={{ color: C.text }}>BTCUSDT</span>
                    <span>· 1m · Velas japonesas</span>
                </span>
                <span>data-stream.binance.vision</span>
            </div>
            <div ref={wrapRef} className="relative h-[240px] w-full md:h-[330px]">
                <canvas ref={canvasRef} className="block" />
            </div>
            <p
                className="kairos-mono border-t px-3 py-1.5 text-[10px]"
                style={{ borderColor: C.line, color: C.dim }}
            >
                caminata determinista · 66 velas · 1 rAF por panel · 0 renders de React por tick
            </p>
        </div>
    );
};

/** Miniatura de 120 × 32 que se desplaza un punto por tick. */
const Spark = ({ seed, label }: { seed: number; label: string }) => {
    const t = useTick();
    const n = 26;
    const vals = Array.from({ length: n }, (_, j) => {
        const x = j + t * 0.5 + seed;
        return 0.5 + Math.sin(x * 0.55) * 0.3 + Math.sin(x * 1.31 + seed) * 0.14;
    });
    const pts = vals.map((v, j) => `${(j / (n - 1)) * 120},${32 - Math.min(0.98, Math.max(0.02, v)) * 30}`);
    const last = vals[n - 1];

    return (
        <div
            className="kairos-spark kairos-card rounded-lg border px-3 py-2.5"
            style={{ borderColor: C.line, background: C.panel }}
        >
            <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[10px] font-semibold" style={{ color: C.text }}>{label}</span>
                <span className="kairos-spark-val kairos-mono text-[10px]" style={{ color: C.cyan }}>
                    {fmt(last * 100, 1)}
                </span>
            </div>
            <svg viewBox="0 0 120 32" className="mt-1.5 h-8 w-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                    <linearGradient id={`kairos-sp-${seed}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.cyan} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,32 ${pts.join(" ")} 120,32`} fill={`url(#kairos-sp-${seed})`} />
                <polyline
                    className="kairos-spark-line"
                    points={pts.join(" ")}
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

/* ───────────────────────── mockups en HTML/CSS ───────────────────────── */

/** Velas en SVG a tamaño fijo: sirve a los mockups sin pedir un canvas más. */
const CandleSvg = ({
    series,
    width,
    height,
    withVolume = true,
}: {
    series: Candle[];
    width: number;
    height: number;
    withVolume?: boolean;
}) => {
    const volH = withVolume ? height * 0.18 : 0;
    const priceH = height - volH;
    const min = Math.min(...series.map((k) => k.l));
    const max = Math.max(...series.map((k) => k.h));
    const y = (v: number) => ((max - v) / (max - min)) * (priceH - 8) + 4;
    const step = width / series.length;
    const last = series[series.length - 1];

    return (
        <svg width={width} height={height} className="block">
            {[0, 1, 2, 3, 4].map((i) => (
                <line
                    key={`h${i}`}
                    x1="0"
                    x2={width}
                    y1={(priceH / 4) * i}
                    y2={(priceH / 4) * i}
                    stroke="rgba(148,163,184,0.07)"
                />
            ))}
            {Array.from({ length: Math.floor(width / 60) }, (_, i) => (
                <line
                    key={`v${i}`}
                    y1="0"
                    y2={height}
                    x1={width - i * 60}
                    x2={width - i * 60}
                    stroke="rgba(148,163,184,0.07)"
                />
            ))}
            {series.map((k, i) => {
                const bull = k.c >= k.o;
                const color = bull ? C.up : C.down;
                const cx = i * step + step / 2;
                const bw = Math.max(1.5, step * 0.6);
                return (
                    <g key={i}>
                        <line x1={cx} x2={cx} y1={y(k.h)} y2={y(k.l)} stroke={color} strokeWidth="1" />
                        <rect
                            x={cx - bw / 2}
                            y={y(Math.max(k.o, k.c))}
                            width={bw}
                            height={Math.max(1, Math.abs(y(k.o) - y(k.c)))}
                            fill={color}
                        />
                        {withVolume && (
                            <rect
                                x={cx - bw / 2}
                                y={height - k.v * volH}
                                width={bw}
                                height={k.v * volH}
                                fill={color}
                                opacity="0.35"
                            />
                        )}
                    </g>
                );
            })}
            {/* posición abierta, stop y objetivo arrastrables */}
            <line x1="0" x2={width} y1={y(last.c - 120)} y2={y(last.c - 120)} stroke={C.down} strokeWidth="1" strokeDasharray="4 3" />
            <line x1="0" x2={width} y1={y(last.c + 150)} y2={y(last.c + 150)} stroke={C.up} strokeWidth="1" strokeDasharray="4 3" />
            <line x1="0" x2={width} y1={y(last.c)} y2={y(last.c)} stroke={C.cyan} strokeWidth="1" strokeDasharray="2 3" />
            {/* marcadores verticales de eventos macro sobre la vela de publicación */}
            {[Math.floor(series.length * 0.42), Math.floor(series.length * 0.78)].map((i) => (
                <g key={`m${i}`}>
                    <line x1={i * step} x2={i * step} y1="0" y2={height} stroke={C.amber} strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
                    <rect x={i * step - 8} y="2" width="16" height="9" rx="2" fill={C.amber} opacity="0.85" />
                </g>
            ))}
        </svg>
    );
};

const RsiSvg = ({ width, height }: { width: number; height: number }) => {
    const y = (v: number) => height - (v / 100) * height;
    const step = width / RSI_SERIES.length;
    return (
        <svg width={width} height={height} className="block">
            {[30, 50, 70].map((g) => (
                <g key={g}>
                    <line
                        x1="0"
                        x2={width}
                        y1={y(g)}
                        y2={y(g)}
                        stroke={g === 50 ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)"}
                        strokeDasharray={g === 50 ? "1 4" : "3 3"}
                    />
                    <text x="2" y={y(g) - 2} fill={C.dim} fontSize="7" fontFamily={MONO}>
                        {g}
                    </text>
                </g>
            ))}
            <polyline
                points={RSI_SERIES.map((v, i) => `${i * step + step / 2},${y(v)}`).join(" ")}
                fill="none"
                stroke={C.cyan}
                strokeWidth="1.2"
            />
        </svg>
    );
};

const Seg = ({ items, active }: { items: string[]; active: number }) => (
    <div className="flex overflow-hidden rounded border" style={{ borderColor: C.line }}>
        {items.map((it, i) => (
            <span
                key={it}
                className="kairos-mono px-2 py-[3px] text-[9px]"
                style={{
                    background: i === active ? C.cyan : "transparent",
                    color: i === active ? "#04222a" : C.dim,
                    fontWeight: i === active ? 700 : 400,
                }}
            >
                {it}
            </span>
        ))}
    </div>
);

const AcctCell = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div className="min-w-0">
        <p className="text-[8px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>{label}</p>
        <p className="kairos-mono truncate text-[12px] font-semibold" style={{ color: color ?? C.text }}>{value}</p>
    </div>
);

/** Mockup 1 — Terminal · rejilla multiactivo. */
const MockTerminal = () => (
    <div className="min-w-[900px]" style={{ background: C.bg }}>
        {/* (1) barra superior */}
        <div className="flex items-center gap-3 border-b px-3 py-2" style={{ background: C.panel, borderColor: C.line }}>
            <Image src="/proyectos/kairos/kairos-mark.png" alt="" width={488} height={428} className="h-[26px] w-auto" />
            <div className="leading-none">
                <p className="text-[13px] font-bold" style={{ color: C.text }}>Kairos</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>Fase 1 · Data Nivel 1</p>
            </div>
            <span className="kairos-mono ml-4 text-[9px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>Layout</span>
            <Seg items={["1", "2", "3", "4"]} active={1} />
            <span className="ml-1 flex items-center gap-1.5">
                <span className="relative inline-block h-[14px] w-[26px] rounded-full" style={{ background: `${C.cyan}44` }}>
                    <span className="absolute right-[2px] top-[2px] h-[10px] w-[10px] rounded-full" style={{ background: C.cyan }} />
                </span>
                <span className="text-[9px]" style={{ color: C.dim }}>Marco enlazado</span>
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[9px]" style={{ color: C.dim }}>
                <span className="kairos-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.up }} />
                Feed en vivo
            </span>
            <span className="kairos-mono text-[11px]" style={{ color: C.text }}>14:32:08 UTC</span>
            <span
                className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold"
                style={{ background: `${C.cyan}22`, color: C.cyan }}
            >
                AS
            </span>
        </div>

        {/* (2) estado de cuenta */}
        <div
            className="grid grid-cols-6 gap-4 border-b px-3 py-1.5"
            style={{ background: C.sunken, borderColor: C.line }}
        >
            <AcctCell label="Saldo" value="10.000,00" />
            <AcctCell label="Equity" value="10.412,55" />
            <AcctCell label="P&L flotante" value="+412,55" color={C.up} />
            <AcctCell label="Margen usado" value="1.240,00" />
            <AcctCell label="Margen libre" value="9.172,55" />
            <AcctCell label="Nivel" value="839,7 %" color={C.amber} />
        </div>

        {/* (3) cuerpo */}
        <div className="flex">
            <div className="flex-1">
                <div className="flex items-center gap-2 border-b px-2 py-1" style={{ borderColor: C.line }}>
                    <span className="kairos-mono text-[10px] font-bold" style={{ color: C.text }}>BTCUSDT</span>
                    <span className="text-[9px]" style={{ color: C.dim }}>Binance · espejo público</span>
                    <span className="ml-auto flex items-center gap-1">
                        <Seg items={["1s", "1m", "5m", "1h", "1D"]} active={1} />
                        <Seg items={["Velas", "Línea", "Heikin"]} active={0} />
                    </span>
                </div>
                <div className="flex">
                    <div className="relative">
                        <CandleSvg series={PANEL_SERIES} width={604} height={214} />
                        <span
                            className="kairos-mono absolute left-1 top-[86px] rounded-sm px-1 text-[8px]"
                            style={{ background: `${C.cyan}22`, color: C.cyan }}
                        >
                            0,25 @ 67.180,20
                        </span>
                        <span
                            className="kairos-mono absolute left-1 top-[132px] rounded-sm px-1 text-[8px]"
                            style={{ background: `${C.down}22`, color: C.down }}
                        >
                            SL 66.940,00
                        </span>
                        <span
                            className="kairos-mono absolute left-1 top-[40px] rounded-sm px-1 text-[8px]"
                            style={{ background: `${C.up}22`, color: C.up }}
                        >
                            TP 67.640,00
                        </span>
                    </div>
                    {/* barra de precios vertical, al borde derecho */}
                    <div className="relative w-[52px] border-l" style={{ background: C.sunken, borderColor: C.line }}>
                        {["67.640", "67.480", "67.320", "67.160", "67.000"].map((v, i) => (
                            <span
                                key={v}
                                className="kairos-mono absolute left-1 text-[9px]"
                                style={{ color: C.dim, top: `${10 + i * 44}px` }}
                            >
                                {v}
                            </span>
                        ))}
                        <span
                            className="kairos-mono absolute left-0 right-0 px-1 text-[9px] font-bold"
                            style={{ top: "96px", background: C.cyan, color: "#04222a" }}
                        >
                            67.298
                        </span>
                    </div>
                </div>
                {/* panel inferior de oscilador */}
                <div className="flex border-t" style={{ borderColor: C.line }}>
                    <div className="relative">
                        <span className="kairos-mono absolute left-1.5 top-1 text-[8px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>
                            RSI (14) · Wilder
                        </span>
                        <RsiSvg width={604} height={64} />
                    </div>
                    <div className="w-[52px] border-l" style={{ background: C.sunken, borderColor: C.line }} />
                </div>
            </div>

            {/* carril lateral */}
            <div className="w-[240px] border-l" style={{ background: C.panel, borderColor: C.line }}>
                <p className="border-b px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ borderColor: C.line, color: C.text }}>
                    Lista de seguimiento
                </p>
                {INSTRUMENTS.slice(0, 6).map((inst, i) => {
                    const up = i % 3 !== 1;
                    return (
                        <div
                            key={inst.sym}
                            className="kairos-row flex items-center justify-between border-b px-2.5 py-[7px]"
                            style={{ borderColor: `${C.line}80` }}
                        >
                            <span className="min-w-0">
                                <span className="block text-[10px] font-semibold" style={{ color: C.text }}>{inst.sym}</span>
                                <span className="block truncate text-[8px]" style={{ color: C.dim }}>{inst.name}</span>
                            </span>
                            <span className="text-right">
                                <span className="kairos-mono block text-[10px]" style={{ color: C.text }}>{fmt(inst.px, inst.d)}</span>
                                <span className="kairos-mono block text-[8px]" style={{ color: up ? C.up : C.down }}>
                                    {up ? "+" : "−"}
                                    {fmt(0.18 + i * 0.31, 2)} %
                                </span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* (4) bitácora */}
        <div className="border-t" style={{ borderColor: C.line, background: C.sunken }}>
            <div
                className="kairos-mono grid grid-cols-8 gap-2 border-b px-3 py-1 text-[8px] uppercase tracking-[0.12em]"
                style={{ borderColor: C.line, color: C.dim }}
            >
                {["Hora", "Instrumento", "Lado", "Vol.", "Entrada", "Salida", "Comisión + swap", "Neto"].map((th) => (
                    <span key={th}>{th}</span>
                ))}
            </div>
            {[
                ["14:12:04", "BTCUSDT", "Compra", "0,25", "66.940,00", "67.298,10", "−4,20", "+85,32"],
                ["13:48:51", "NQ", "Venta", "2", "20.462,25", "20.418,75", "−3,10", "+84,90"],
                ["12:59:12", "EURUSD", "Compra", "1,0", "1,0871", "1,0842", "−1,80", "−30,80"],
            ].map((row) => (
                <div key={row[0]} className="kairos-mono kairos-row grid grid-cols-8 gap-2 px-3 py-[5px] text-[9px]" style={{ color: C.text }}>
                    {row.map((cell, i) => (
                        <span
                            key={i}
                            style={{
                                color:
                                    i === 7
                                        ? cell.startsWith("+")
                                            ? C.up
                                            : C.down
                                        : i === 2
                                        ? cell === "Compra"
                                            ? C.up
                                            : C.down
                                        : i === 0
                                        ? C.dim
                                        : C.text,
                            }}
                        >
                            {cell}
                        </span>
                    ))}
                </div>
            ))}
        </div>

        {/* (5) barra de estado */}
        <div
            className="kairos-mono flex items-center gap-2 border-t px-3 py-1.5 text-[9px]"
            style={{ background: C.panel, borderColor: C.line, color: C.dim }}
        >
            {["Arrastrar", "Rueda", "Arrastrar barra de precios", "Doble clic"].map((k) => (
                <span key={k} className="kairos-key">{k}</span>
            ))}
            <span className="ml-auto" style={{ color: C.up }}>SharedArrayBuffer: disponible</span>
            <span style={{ color: C.up }}>Firebase: kairos-74b99</span>
            <span style={{ color: `${C.dim}99` }}>Nivel 2 · Nivel 3: contratos declarados</span>
        </div>
    </div>
);

/** Mockup 2 — Panel de ejecución (ticket de orden), 340 px. */
const MockTicket = () => (
    <div className="w-[340px] shrink-0 space-y-3 p-3" style={{ background: C.panel }}>
        <div className="flex items-start justify-between">
            <span>
                <span className="block text-[12px] font-bold" style={{ color: C.text }}>BTCUSDT</span>
                <span className="block text-[10px]" style={{ color: C.dim }}>Bitcoin / Tether · Binance</span>
            </span>
            <span className="kairos-mono text-[14px] font-bold" style={{ color: C.text }}>67.298,10</span>
        </div>

        <div className="flex rounded-full border p-[3px]" style={{ borderColor: C.line }}>
            {["Mercado", "Límite", "Stop"].map((t, i) => (
                <span
                    key={t}
                    className="flex-1 rounded-full py-1 text-center text-[10px]"
                    style={{
                        background: i === 0 ? C.cyan : "transparent",
                        color: i === 0 ? "#04222a" : C.dim,
                        fontWeight: i === 0 ? 700 : 400,
                    }}
                >
                    {t}
                </span>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
            {[
                ["Cantidad", "0,25"],
                ["Nocional", "16.824,53"],
            ].map(([label, value]) => (
                <span key={label} className="rounded border px-2 py-1.5" style={{ borderColor: C.line, background: C.sunken }}>
                    <span className="block text-[8px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>{label}</span>
                    <span className="kairos-mono block text-[12px]" style={{ color: C.text }}>{value}</span>
                </span>
            ))}
        </div>

        <label className="flex items-center gap-2 text-[10px]" style={{ color: C.dim }}>
            <span
                className="grid h-[10px] w-[10px] place-items-center rounded-[2px] text-[7px] font-bold"
                style={{ background: C.cyan, color: "#04222a" }}
            >
                ✓
            </span>
            Adjuntar Stop Loss y Take Profit
        </label>

        <div className="grid grid-cols-2 gap-2">
            {[
                ["Stop (ticks)", "240"],
                ["Objetivo (ticks)", "342"],
            ].map(([label, value]) => (
                <span key={label} className="rounded border px-2 py-1.5" style={{ borderColor: C.line, background: C.sunken }}>
                    <span className="block text-[8px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>{label}</span>
                    <span className="kairos-mono block text-[12px]" style={{ color: C.text }}>{value}</span>
                </span>
            ))}
        </div>

        <div className="kairos-mono rounded border p-2 text-[10px] leading-relaxed" style={{ borderColor: `${C.line}aa`, background: C.sunken, color: C.dim }}>
            <span className="flex justify-between"><span>Riesgo</span><span style={{ color: C.down }}>−60,00 USD</span></span>
            <span className="flex justify-between"><span>Recompensa</span><span style={{ color: C.up }}>+85,50 USD</span></span>
            <span className="flex justify-between"><span>Relación</span><span style={{ color: C.text }}>1 : 1,43</span></span>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <span
                className="kairos-card flex h-10 items-center justify-center gap-2 rounded text-[11px] font-bold"
                style={{ background: C.up, color: "#04220f" }}
            >
                COMPRAR <span className="kairos-mono text-[9px] opacity-80">67.298,60</span>
            </span>
            <span
                className="kairos-card flex h-10 items-center justify-center gap-2 rounded text-[11px] font-bold"
                style={{ background: C.down, color: "#2a0508" }}
            >
                VENDER <span className="kairos-mono text-[9px] opacity-80">67.297,90</span>
            </span>
        </div>

        <p className="text-[9px] leading-relaxed" style={{ color: `${C.dim}cc` }}>
            Cartera en papel: las órdenes se ejecutan contra el simulador local y no salen a ningún mercado.
        </p>
    </div>
);

/** Mockup 3 — Módulo macroeconómico, con cuenta regresiva viva. */
const MockMacro = () => {
    const t = useTick();
    const seconds = (base: number) => {
        const left = base - Math.floor(t / 8);
        return left <= 0 ? null : left;
    };
    const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const events = [
        { time: "14:30", name: "IPC subyacente (EE. UU.)", folder: C.down, base: 214, prev: "3,2 %", cons: "3,1 %", act: "—", dev: "DESVIACIÓN ESPERADA", pct: "24,0 %" },
        { time: "15:00", name: "PMI manufacturero ISM", folder: C.amber, base: 512, prev: "48,7", cons: "49,2", act: "—", dev: "DESVIACIÓN ESPERADA", pct: "9,4 %" },
        { time: "16:00", name: "Subasta de letras a 4 semanas", folder: C.yellow, base: 0, prev: "4,32 %", cons: "4,30 %", act: "4,29 %", dev: "DESVIACIÓN REALIZADA", pct: "0,7 %" },
    ];

    return (
        <div className="w-[340px] shrink-0 space-y-3 p-3" style={{ background: C.panel }}>
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: C.text }}>
                    Entorno macroeconómico
                </p>
                <span className="rounded border px-1.5 py-0.5 text-[9px]" style={{ borderColor: C.line, color: C.cyan }}>
                    Alertas ON
                </span>
            </div>

            <div className="flex items-center gap-3 rounded border px-3 py-2" style={{ borderColor: C.line, background: C.sunken }}>
                {[
                    { c: C.down, on: true, label: "Roja" },
                    { c: C.amber, on: true, label: "Naranja" },
                    { c: C.yellow, on: false, label: "Amarilla" },
                ].map((lamp) => (
                    <span key={lamp.label} className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{
                                background: lamp.c,
                                opacity: lamp.on ? 1 : 0.2,
                                boxShadow: lamp.on ? `0 0 10px ${lamp.c}` : "none",
                            }}
                        />
                        <span className="text-[9px]" style={{ color: C.dim }}>{lamp.label}</span>
                    </span>
                ))}
                <span className="kairos-mono ml-auto text-[9px]" style={{ color: C.dim }}>σ 24,0 %</span>
            </div>

            <div className="rounded border p-2" style={{ borderColor: `${C.down}66`, background: `${C.down}14` }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: C.down }}>
                    ⚠ Volatilidad extrema inminente
                </p>
                <p className="mt-1 text-[9px]" style={{ color: `${C.text}cc` }}>
                    IPC subyacente (EE. UU.) · desviación esperada 24,0 %
                </p>
            </div>

            {events.map((ev) => {
                const left = seconds(ev.base);
                const tone = left === null ? C.dim : left <= 60 ? C.down : left <= 300 ? C.cyan : C.dim;
                return (
                    <div key={ev.name} className="rounded border p-2" style={{ borderColor: `${C.line}aa`, background: C.sunken }}>
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ev.folder }} />
                            <span className="kairos-mono text-[10px]" style={{ color: C.dim }}>{ev.time}</span>
                            <span className="truncate text-[11px] font-semibold" style={{ color: C.text }}>{ev.name}</span>
                            <span
                                className="kairos-mono ml-auto shrink-0 text-[10px]"
                                style={{ color: tone, fontWeight: left !== null && left <= 300 ? 700 : 400 }}
                            >
                                {left === null ? "Publicado" : clock(left)}
                            </span>
                        </div>
                        <div className="kairos-mono mt-1.5 grid grid-cols-3 gap-1 text-[9px]" style={{ color: C.dim }}>
                            <span>Previo {ev.prev}</span>
                            <span>Consenso {ev.cons}</span>
                            <span>Actual {ev.act}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[8px] uppercase tracking-[0.12em]">
                            <span style={{ color: `${C.dim}aa` }}>{ev.dev}</span>
                            <span className="kairos-mono" style={{ color: ev.folder }}>{ev.pct}</span>
                        </div>
                    </div>
                );
            })}

            <div className="rounded border p-2" style={{ borderColor: `${C.line}aa`, background: C.sunken }}>
                <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>Fed Watch · próxima decisión</p>
                {[
                    ["Sin cambios", 62, C.cyan],
                    ["−25 pb", 33, C.up],
                    ["−50 pb", 5, C.dim],
                ].map(([label, pct, color]) => (
                    <div key={String(label)} className="mt-1.5 flex items-center gap-2">
                        <span className="w-[70px] text-[9px]" style={{ color: C.dim }}>{label}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: `${C.line}` }}>
                            <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: String(color) }} />
                        </span>
                        <span className="kairos-mono w-8 text-right text-[9px]" style={{ color: C.text }}>{pct} %</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/** Mockup 4 — Acceso de operador, 448 px. */
const MockAccess = () => (
    <div
        className="w-full max-w-[420px] rounded-2xl border p-6"
        style={{ borderColor: C.line, background: C.panel, boxShadow: "0 40px 90px -50px rgba(0,0,0,0.95)" }}
    >
        <Image src="/proyectos/kairos/kairos-lockup.png" alt={p.name} width={786} height={224} className="h-[34px] w-auto" />
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: C.dim }}>Acceso de operador</p>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: `${C.text}b3` }}>
            No se almacenan contraseñas: la identidad la verifica Google mediante Firebase Authentication.
        </p>
        <span
            className="mt-5 flex h-10 w-full items-center justify-center rounded-lg text-[12px] font-bold"
            style={{ background: C.cyan, color: "#04222a" }}
        >
            Continuar con Google
        </span>
        <span
            className="mt-2 flex h-10 w-full items-center justify-center rounded-lg border text-[12px]"
            style={{ borderColor: C.line, color: C.text }}
        >
            Entrar como invitado
        </span>
        <p className="mt-4 text-[10px] leading-relaxed" style={{ color: `${C.dim}cc` }}>
            La sesión la gestiona Firebase y persiste en este navegador. Los datos quedan protegidos por reglas
            evaluadas en el servidor.
        </p>
    </div>
);

/* ───────────────────────── secciones auxiliares ───────────────────────── */

const LEVELS = [
    {
        tag: "Nivel 1",
        color: C.up,
        state: "Operativo",
        title: "Acción del precio y entorno",
        rows: ["OHLCV en búfer columnar", "22 marcos con frontera UTC", "Indicadores en TA-Engine", "Cartera en papel", "Calendario macro"],
    },
    {
        tag: "Nivel 2",
        color: C.amber,
        state: "Contratos listos",
        title: "Microestructura",
        rows: ["Entidad MarketDepth", "Libro por niveles", "Cinta de operaciones", "Puerto tipado declarado", "Sin adaptador activo"],
    },
    {
        tag: "Nivel 3",
        color: C.magenta,
        state: "Contratos listos",
        title: "Flujo institucional y motor 3D",
        rows: ["Entidad QuantAnalytics", "WebGL reservado", "Mapa de calor térmico", "Puerto tipado declarado", "Sin adaptador activo"],
    },
];

const HEAT = ["#ff2d55", "#ff9f0a", "#ffd60a", "#22d3ee", "#0a2540"];

const HeatBackdrop = () => {
    const t = useTick();
    return (
        <div aria-hidden className="absolute inset-0 grid grid-cols-8 opacity-[0.16]">
            {Array.from({ length: 48 }, (_, i) => {
                const v = (Math.sin(i * 2.1 + t * 0.31) + 1) / 2;
                return (
                    <span
                        key={i}
                        className="block transition-opacity duration-300"
                        style={{ background: HEAT[Math.min(HEAT.length - 1, Math.floor(v * HEAT.length))], opacity: 0.25 + v * 0.6 }}
                    />
                );
            })}
        </div>
    );
};

/** Histograma de tiempos de fotograma contra el presupuesto de 16,6 ms. */
const FRAMES = Array.from({ length: 56 }, (_, i) => 0.95 + Math.abs(Math.sin(i * 1.37)) * 0.9 + (i % 13 === 0 ? 0.55 : 0));
const BUDGET = 16.6;

const barVariants: Variants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { scaleY: 1, opacity: 1, transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] } },
};

const FrameHistogram = () => (
    <div className="relative rounded-xl border p-4" style={{ borderColor: C.line, background: C.sunken }}>
        <div className="flex items-baseline justify-between">
            <p className="kairos-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>
                Tiempo por fotograma · 56 muestras
            </p>
            <p className="kairos-mono text-[10px]" style={{ color: C.up }}>0 por encima del presupuesto</p>
        </div>

        <div className="relative mt-4 h-[120px]">
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 border-t border-dashed"
                style={{ borderColor: `${C.down}80` }}
            />
            <span
                className="kairos-mono absolute right-0 -top-4 text-[9px]"
                style={{ color: C.down }}
            >
                16,6 ms · presupuesto
            </span>
            <Stagger className="flex h-full items-end gap-[3px]" stagger={0.012} amount={0.3}>
                {FRAMES.map((ms, i) => (
                    <motion.span
                        key={i}
                        variants={barVariants}
                        className="block flex-1 rounded-[1px]"
                        style={{
                            height: `${(ms / BUDGET) * 100}%`,
                            transformOrigin: "bottom",
                            background: ms > BUDGET ? C.down : C.up,
                            opacity: 0.85,
                        }}
                    />
                ))}
            </Stagger>
        </div>

        <p className="kairos-mono mt-3 text-[10px]" style={{ color: C.dim }}>
            tres indicadores · panel de oscilador · marcadores macro · 140 velas
        </p>
    </div>
);

const FEATURE_TAGS = [
    "Rejilla",
    "Marcos",
    "Escala",
    "TA-Engine",
    "Órdenes",
    "Bitácora",
    "Cuenta",
    "Rendimiento",
    "Macro",
    "Avisos",
    "Acceso",
    "Sync",
    "Estado",
    "Landing",
];

/* ───────────────────────────── landing ───────────────────────────── */

const Landing = () => {
    const [before, after] = p.tagline.includes("60")
        ? [p.tagline.slice(0, p.tagline.indexOf("60")), p.tagline.slice(p.tagline.indexOf("60") + 2)]
        : [p.tagline, ""];

    const brandShots = p.media.filter((m) => ["logo", "banner", "social"].includes(m.kind));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            <Clock>
                {/* fondo: rejilla de terminal y dos halos que respiran */}
                <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
                    <div className="kairos-grid absolute inset-0" />
                    <span
                        className="kairos-halo -left-40 -top-40 h-[1100px] w-[1100px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 62%)" }}
                    />
                    <span
                        className="kairos-halo -right-40 -top-32 h-[900px] w-[900px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(22,199,132,0.10), transparent 62%)" }}
                    />
                </div>

                <div className="relative z-10">
                    {/* ───────── cintillo de cotizaciones ───────── */}
                    <div className="pt-24">
                        <Tape />
                    </div>

                    {/* ───────── héroe ───────── */}
                    <section className="px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-16">
                        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
                            <div>
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]"
                                    style={{ borderColor: C.line, color: C.dim, background: C.panel }}
                                >
                                    <span className="kairos-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: C.up }} />
                                    {p.status}
                                </span>

                                <h1
                                    className="mt-6 text-[2.4rem] font-bold leading-[1.03] tracking-tight md:text-6xl"
                                    style={{ color: C.text }}
                                >
                                    {before}
                                    <FpsCounter />
                                    {after}
                                </h1>

                                <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: `${C.text}a6` }}>
                                    {p.summary[0]}
                                </p>

                                <div className="mt-7 flex flex-wrap gap-2">
                                    <Chip>{p.category}</Chip>
                                    <Chip>{p.year}</Chip>
                                </div>
                                <p className="kairos-mono mt-4 text-[11px]" style={{ color: C.dim }}>{p.role}</p>

                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    {p.links.web && (
                                        <Magnetic>
                                            <BrandButton href={p.links.web}>
                                                <Globe size={16} /> Abrir el terminal
                                            </BrandButton>
                                        </Magnetic>
                                    )}
                                    <a
                                        href="#interfaz"
                                        className="kairos-mono inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[12px] transition-colors duration-200"
                                        style={{ borderColor: C.line, color: C.text }}
                                    >
                                        Ver qué incluye <ArrowRight size={14} />
                                    </a>
                                </div>

                                <div className="mt-10 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: C.line }}>
                                    {p.metrics.slice(1, 4).map((m) => (
                                        <div key={m.label}>
                                            <p className="kairos-mono text-xl font-bold md:text-2xl" style={{ color: C.cyan }}>{m.value}</p>
                                            <p className="mt-1 text-[10px] leading-snug" style={{ color: C.dim }}>{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <HeroChart />
                        </div>
                    </section>

                    {/* ───────── tira de sparklines ───────── */}
                    <section className="px-4 pb-16 md:px-6 md:pb-24">
                        <div className="mx-auto max-w-6xl">
                            <p className="kairos-mono mb-3 text-[10px] uppercase tracking-[0.28em]" style={{ color: C.dim }}>
                                Capacidades · lectura en vivo
                            </p>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                                {p.highlights.slice(0, 6).map((h, i) => (
                                    <Spark key={h.title} seed={11 + i * 17} label={h.title} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ───────── problema / solución como posición corta y larga ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-6xl">
                            <SectionHead
                                index="01 / La tesis"
                                title={
                                    <>
                                        Dos lados del mismo <span className="brand-gradient-text">libro</span>
                                    </>
                                }
                                lead="El estado del arte se vende como gráfico con indicadores encima o como terminal cerrado y carísimo. La posición contraria es un puesto completo que corre entero en el navegador."
                            />

                            <div className="mt-10 grid gap-4 md:grid-cols-2">
                                <Reveal direction="right">
                                    <div
                                        className="h-full rounded-xl border p-6 md:p-7"
                                        style={{ borderColor: `${C.down}44`, background: `linear-gradient(160deg, ${C.down}12, ${C.panel})` }}
                                    >
                                        <p className="kairos-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: C.down }}>
                                            <TrendingDown size={14} /> Corto · el problema
                                        </p>
                                        <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: `${C.text}b8` }}>
                                            {p.problem}
                                        </p>
                                    </div>
                                </Reveal>

                                <Reveal direction="left" delay={0.1}>
                                    <div
                                        className="h-full rounded-xl border p-6 md:p-7"
                                        style={{ borderColor: `${C.up}44`, background: `linear-gradient(160deg, ${C.up}12, ${C.panel})` }}
                                    >
                                        <p className="kairos-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: C.up }}>
                                            <TrendingUp size={14} /> Largo · la solución
                                        </p>
                                        <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: `${C.text}b8` }}>
                                            {p.solution}
                                        </p>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    {/* ───────── highlights como escalera del libro de órdenes ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-5xl">
                            <SectionHead
                                index="02 / Profundidad"
                                title={
                                    <>
                                        Siete niveles de <span className="brand-gradient-text">este libro</span>
                                    </>
                                }
                                lead="Lo que sostiene el terminal, apilado como se apila la profundidad: arriba lo que se paga en rendimiento, abajo lo que se cobra en honestidad."
                            />

                            <div className="mt-10 overflow-hidden rounded-xl border" style={{ borderColor: C.line, background: C.panel }}>
                                <div
                                    className="kairos-mono grid grid-cols-[56px_1fr_84px] gap-3 border-b px-4 py-2 text-[9px] uppercase tracking-[0.16em]"
                                    style={{ borderColor: C.line, color: C.dim }}
                                >
                                    <span>Nivel</span>
                                    <span>Capacidad</span>
                                    <span className="text-right">Lado</span>
                                </div>

                                {p.highlights.map((h, i) => {
                                    const Icon = iconOf(h.icon);
                                    const ask = i < 3;
                                    const tone = ask ? C.down : C.up;
                                    const depth = 92 - i * 9;
                                    return (
                                        <Reveal key={h.title} direction="up" delay={i * 0.05} amount={0.2}>
                                            <div
                                                className="kairos-row relative grid grid-cols-[56px_1fr_84px] items-start gap-3 border-b px-4 py-4"
                                                style={{ borderColor: `${C.line}88` }}
                                            >
                                                <motion.span
                                                    aria-hidden
                                                    className="absolute inset-y-0 left-0"
                                                    style={{ background: `${tone}14` }}
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${depth}%` }}
                                                    viewport={{ once: true, amount: 0.4 }}
                                                    transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.05 }}
                                                />
                                                <span className="kairos-mono relative text-[11px]" style={{ color: tone }}>
                                                    {String(7 - i).padStart(2, "0")}
                                                </span>
                                                <span className="relative min-w-0">
                                                    <span className="flex items-center gap-2">
                                                        <Icon size={15} color={C.cyan} />
                                                        <span className="text-sm font-semibold md:text-base" style={{ color: C.text }}>
                                                            {h.title}
                                                        </span>
                                                    </span>
                                                    <span className="mt-1.5 block text-[13px] leading-relaxed" style={{ color: `${C.text}9e` }}>
                                                        {h.description}
                                                    </span>
                                                </span>
                                                <span
                                                    className="kairos-mono relative text-right text-[10px] uppercase tracking-[0.14em]"
                                                    style={{ color: tone }}
                                                >
                                                    {ask ? "Ask" : "Bid"}
                                                </span>
                                            </div>
                                        </Reveal>
                                    );
                                })}

                                <div
                                    className="kairos-mono flex items-center justify-between px-4 py-2 text-[10px]"
                                    style={{ background: C.sunken, color: C.dim }}
                                >
                                    <span>spread</span>
                                    <span style={{ color: C.cyan }}>{p.statusShort}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ───────── mockups de interfaz ───────── */}
                    <section id="interfaz" className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-6xl">
                            <SectionHead
                                index="03 / La interfaz"
                                title={
                                    <>
                                        Cinco franjas, <span className="brand-gradient-text">un solo reloj</span>
                                    </>
                                }
                                lead="El terminal ocupa el alto completo de la ventana sin scroll: barra superior, estado de cuenta, cuerpo, bitácora y barra de estado."
                            />

                            <Reveal className="mt-10">
                                <BrowserFrame url="kairos-74b99.web.app/terminal">
                                    <div className="kairos-scroll overflow-x-auto">
                                        <MockTerminal />
                                    </div>
                                </BrowserFrame>
                                <p className="kairos-mono mt-3 text-[10px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>
                                    {p.uiScreens[2]?.name}
                                </p>
                            </Reveal>

                            <div className="mt-12 grid gap-6 lg:grid-cols-[auto_auto_1fr] lg:items-start">
                                <Reveal direction="up">
                                    <div className="kairos-scroll overflow-x-auto rounded-xl border" style={{ borderColor: C.line }}>
                                        <MockTicket />
                                    </div>
                                    <p className="kairos-mono mt-3 text-[10px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>
                                        {p.uiScreens[3]?.name}
                                    </p>
                                </Reveal>

                                <Reveal direction="up" delay={0.1}>
                                    <div className="kairos-scroll overflow-x-auto rounded-xl border" style={{ borderColor: C.line }}>
                                        <MockMacro />
                                    </div>
                                    <p className="kairos-mono mt-3 text-[10px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>
                                        {p.uiScreens[4]?.name}
                                    </p>
                                </Reveal>

                                <Reveal direction="up" delay={0.2} className="flex flex-col items-start">
                                    <MockAccess />
                                    <p className="kairos-mono mt-3 text-[10px] uppercase tracking-[0.16em]" style={{ color: C.dim }}>
                                        {p.uiScreens[1]?.name}
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    {/* ───────── niveles de datos ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-6xl">
                            <SectionHead
                                index="04 / Niveles de datos"
                                title={
                                    <>
                                        Lo que corre y <span className="brand-gradient-text">lo que está declarado</span>
                                    </>
                                }
                                lead="La especificación va por niveles y la landing no los confunde: un nivel operativo de extremo a extremo y dos con los contratos de datos cerrados y tipados."
                            />

                            <div className="mt-10 grid gap-4 md:grid-cols-3">
                                {LEVELS.map((lv, i) => (
                                    <Reveal key={lv.tag} direction="up" delay={i * 0.08}>
                                        <div
                                            className="kairos-card relative h-full overflow-hidden rounded-xl border p-5"
                                            style={{ borderColor: C.line, background: C.panel }}
                                        >
                                            {i === 2 && <HeatBackdrop />}
                                            <span
                                                aria-hidden
                                                className="kairos-thread absolute inset-x-0 top-0 h-px"
                                                style={{ backgroundImage: `linear-gradient(90deg, transparent, ${lv.color}, transparent)` }}
                                            />
                                            <div className="relative">
                                                <div className="flex items-center justify-between">
                                                    <span className="kairos-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: lv.color }}>
                                                        {lv.tag}
                                                    </span>
                                                    <span
                                                        className="rounded-full border px-2 py-0.5 text-[9px]"
                                                        style={{ borderColor: `${lv.color}55`, color: lv.color, background: `${lv.color}14` }}
                                                    >
                                                        {lv.state}
                                                    </span>
                                                </div>
                                                <p className="mt-3 text-lg font-semibold" style={{ color: C.text }}>{lv.title}</p>
                                                <ul className="mt-4 space-y-2">
                                                    {lv.rows.map((row) => (
                                                        <li key={row} className="kairos-mono flex items-start gap-2 text-[11px]" style={{ color: `${C.text}9e` }}>
                                                            <span style={{ color: lv.color }}>·</span>
                                                            {row}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ───────── funcionalidades como catálogo de módulos ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-6xl">
                            <SectionHead
                                index="05 / Catálogo"
                                title={
                                    <>
                                        Catorce módulos <span className="brand-gradient-text">enrutados</span>
                                    </>
                                }
                            />

                            <div className="kairos-scroll mt-10 overflow-x-auto rounded-xl border" style={{ borderColor: C.line, background: C.panel }}>
                                <div className="min-w-[640px]">
                                    <div
                                        className="kairos-mono grid grid-cols-[52px_120px_1fr] gap-3 border-b px-4 py-2 text-[9px] uppercase tracking-[0.16em]"
                                        style={{ borderColor: C.line, color: C.dim }}
                                    >
                                        <span>ID</span>
                                        <span>Módulo</span>
                                        <span>Descripción</span>
                                    </div>
                                    <Stagger stagger={0.035}>
                                        {p.features.map((f, i) => (
                                            <StaggerItem key={f} y={10}>
                                                <div
                                                    className="kairos-row grid grid-cols-[52px_120px_1fr] items-start gap-3 border-b px-4 py-2.5"
                                                    style={{ borderColor: `${C.line}77` }}
                                                >
                                                    <span className="kairos-mono text-[11px]" style={{ color: `${C.cyan}b3` }}>
                                                        F-{String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="kairos-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: C.text }}>
                                                        {FEATURE_TAGS[i] ?? "Módulo"}
                                                    </span>
                                                    <span className="text-[13px] leading-relaxed" style={{ color: `${C.text}9e` }}>
                                                        {f}
                                                    </span>
                                                </div>
                                            </StaggerItem>
                                        ))}
                                    </Stagger>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ───────── stack como hoja de especificación ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-5xl">
                            <SectionHead index="06 / Stack" title="Con qué está construido" />

                            <div className="mt-10 rounded-xl border" style={{ borderColor: C.line, background: C.panel }}>
                                {p.stack.map((group, i) => (
                                    <Reveal key={group.group} direction="up" delay={i * 0.05}>
                                        <div
                                            className="kairos-row grid gap-2 border-b px-5 py-4 md:grid-cols-[190px_1fr] md:gap-6"
                                            style={{ borderColor: i === p.stack.length - 1 ? "transparent" : `${C.line}88` }}
                                        >
                                            <p className="kairos-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: C.cyan }}>
                                                {group.group}
                                            </p>
                                            <p className="kairos-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]" style={{ color: `${C.text}b3` }}>
                                                {group.items.map((item, j) => (
                                                    <span key={item} className="inline-flex items-center gap-2">
                                                        {j > 0 && <span style={{ color: `${C.dim}66` }}>·</span>}
                                                        {item}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ───────── arquitectura ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-5xl">
                            <SectionHead
                                index="07 / Arquitectura"
                                title={
                                    <>
                                        La dependencia <span className="brand-gradient-text">siempre hacia dentro</span>
                                    </>
                                }
                            />

                            <Reveal className="mt-8">
                                <div className="kairos-scroll overflow-x-auto">
                                    <div className="flex min-w-[560px] items-stretch gap-2">
                                        {[
                                            { k: "src/presentation", v: "React · 8 contextos apilados" },
                                            { k: "src/application", v: "Servicios: agregador, cartera, analítica" },
                                            { k: "src/core", v: "Entidades, value-objects y puertos · sin framework" },
                                        ].map((layer, i) => (
                                            <div
                                                key={layer.k}
                                                className="flex-1 rounded-lg border p-4"
                                                style={{
                                                    borderColor: i === 2 ? `${C.cyan}55` : C.line,
                                                    background: i === 2 ? `${C.cyan}0f` : C.panel,
                                                }}
                                            >
                                                <p className="kairos-mono text-[11px] font-bold" style={{ color: i === 2 ? C.cyan : C.text }}>
                                                    {layer.k}
                                                </p>
                                                <p className="mt-1.5 text-[11px] leading-snug" style={{ color: C.dim }}>{layer.v}</p>
                                                {i < 2 && (
                                                    <p className="kairos-mono mt-2 text-right text-[11px]" style={{ color: `${C.cyan}aa` }}>→</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 rounded-xl border-l-2 p-6" style={{ borderColor: C.cyan, background: C.panel }}>
                                    <p className="text-sm leading-relaxed md:text-base" style={{ color: `${C.text}b3` }}>
                                        {p.architecture}
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* ───────── retos ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-6xl">
                            <SectionHead
                                index="08 / Retos"
                                title={
                                    <>
                                        Ocho incidencias <span className="brand-gradient-text">y su cierre</span>
                                    </>
                                }
                                lead="Cada una se abrió contra un síntoma medible y se cerró contra una causa. Las que siguen abiertas están anotadas como tales."
                            />

                            <div className="mt-10 space-y-3">
                                {p.challenges.map((c, i) => (
                                    <Reveal key={i} direction="up" delay={i * 0.04}>
                                        <div
                                            className="kairos-card grid overflow-hidden rounded-xl border md:grid-cols-2"
                                            style={{ borderColor: C.line, background: C.panel }}
                                        >
                                            <div className="border-b p-5 md:border-b-0 md:border-r" style={{ borderColor: `${C.line}` }}>
                                                <p className="kairos-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: C.down }}>
                                                    <span
                                                        className="grid h-4 w-4 place-items-center rounded-[3px] text-[9px]"
                                                        style={{ background: `${C.down}22` }}
                                                    >
                                                        {i + 1}
                                                    </span>
                                                    Síntoma
                                                </p>
                                                <p className="mt-3 text-[13px] leading-relaxed md:text-sm" style={{ color: `${C.text}a6` }}>
                                                    {c.problem}
                                                </p>
                                            </div>
                                            <div className="p-5" style={{ background: `${C.up}08` }}>
                                                <p className="kairos-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: C.up }}>
                                                    Cierre
                                                </p>
                                                <p className="mt-3 text-[13px] leading-relaxed md:text-sm" style={{ color: `${C.text}b8` }}>
                                                    {c.solution}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ───────── ingeniería: presupuesto de fotograma ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-6xl">
                            <SectionHead
                                index="09 / Ingeniería"
                                title={
                                    <>
                                        El presupuesto son <span className="brand-gradient-text">16,6 milisegundos</span>
                                    </>
                                }
                                lead="Sesenta fotogramas por segundo no es una promesa de marketing: es un techo de tiempo por fotograma que se mide o no se tiene."
                            />

                            <div className="mt-10 grid gap-4 md:grid-cols-3">
                                {[
                                    { v: "1,25 ms", l: "coste medido de un fotograma con tres indicadores, oscilador, marcadores macro y 140 velas" },
                                    { v: "0", l: "coste de transferencia entre el TA-Engine y el renderizador: leen la misma memoria" },
                                    { v: "O(n)", l: "SMA por suma deslizante; RSI con suavizado de Wilder" },
                                ].map((k, i) => (
                                    <Reveal key={k.v} direction="up" delay={i * 0.08}>
                                        <div className="h-full rounded-xl border p-5" style={{ borderColor: C.line, background: C.panel }}>
                                            <p className="kairos-mono text-3xl font-bold md:text-4xl" style={{ color: C.cyan }}>{k.v}</p>
                                            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: C.dim }}>{k.l}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>

                            <Reveal className="mt-4">
                                <FrameHistogram />
                            </Reveal>

                            <div className="mt-12 grid gap-8 border-t pt-10 sm:grid-cols-2 lg:grid-cols-5" style={{ borderColor: C.line }}>
                                {p.metrics.map((m) => (
                                    <CountMetric key={m.label} value={m.value} label={m.label} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ───────── marca ───────── */}
                    {brandShots.length > 0 && (
                        <section className="px-4 py-16 md:px-6 md:py-20">
                            <div className="mx-auto max-w-6xl">
                                <p className="kairos-mono mb-4 text-[10px] uppercase tracking-[0.28em]" style={{ color: C.dim }}>
                                    Identidad · monograma, lockup y tarjeta social
                                </p>
                                <DragRail>
                                    {brandShots.map((m) => (
                                        <ShotCard
                                            key={m.src}
                                            src={m.src}
                                            alt={m.caption}
                                            caption={m.caption}
                                            className="w-[280px] shrink-0 md:w-[380px]"
                                        />
                                    ))}
                                </DragRail>
                            </div>
                        </section>
                    )}

                    {/* ───────── cierre ───────── */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-4xl">
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/proyectos/kairos/kairos-mark.png"
                                    alt={p.name}
                                    width={488}
                                    height={428}
                                    className="h-10 w-auto"
                                />
                                <RevealWords
                                    text="Lo que no está, se dice."
                                    className="text-xl font-semibold md:text-2xl"
                                />
                            </div>

                            <Stagger className="mt-8 space-y-5" stagger={0.08}>
                                {p.summary.slice(1).map((paragraph, i) => (
                                    <StaggerItem key={i}>
                                        <div className="flex gap-4">
                                            <span className="kairos-mono pt-1 text-[10px]" style={{ color: `${C.cyan}99` }}>
                                                {String(i + 2).padStart(2, "0")}
                                            </span>
                                            <p className="text-sm leading-relaxed md:text-base" style={{ color: `${C.text}a6` }}>
                                                {paragraph}
                                            </p>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                        </div>
                    </section>

                    {/* ───────── barra de estado ───────── */}
                    <div className="px-4 md:px-6">
                        <div
                            className="kairos-mono mx-auto flex max-w-6xl flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-[10px]"
                            style={{ borderColor: C.line, background: C.panel, color: C.dim }}
                        >
                            <span className="kairos-beat inline-block h-[2px] w-8 rounded-full" style={{ background: C.cyan }} />
                            {["Arrastrar", "Rueda", "Arrastrar barra de precios", "Doble clic"].map((k) => (
                                <span key={k} className="kairos-key">{k}</span>
                            ))}
                            <span className="ml-auto flex items-center gap-2" style={{ color: C.up }}>
                                <Radio size={11} /> SharedArrayBuffer: disponible
                            </span>
                            <span style={{ color: C.up }}>Firebase: kairos-74b99</span>
                            <span style={{ color: `${C.dim}99` }}>Nivel 2 · Nivel 3: contratos declarados</span>
                        </div>
                    </div>

                    <div className="pb-32">
                        <ProjectOutro
                            name={p.name}
                            links={p.links}
                            nextSlug={nxt.slug}
                            nextName={nxt.name}
                            note="Un terminal de mercado a 60 fotogramas por segundo en el navegador, con el dominio fuera de React y la seguridad donde de verdad se evalúa. Si tu producto vive de datos que llegan más rápido de lo que se pueden pintar, ése es mi terreno."
                        />
                    </div>
                </div>
            </Clock>
        </ProjectShell>
    );
};

export default Landing;
