"use client"

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowUpRight,
    BarChart3,
    Bookmark,
    Calculator,
    Camera,
    ChevronLeft,
    Flame,
    Github,
    Home,
    Menu,
    Pencil,
    Search,
    SlidersHorizontal,
    Star,
    Tag,
    Timer,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";
import { AutoVideo, DragRail, PhoneFrame } from "@/components/projects/frames";

const p = getProject("artlex")!;
const nxt = nextProject("artlex");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Paleta de sala, tomada de AppColor.dart. */
const AZUL = "#416AAF";
const CREMA = "#EDE5CC";
const CIAN = "#2BAFCB";
const NOCHE = "#03112C";
const SALA = "#0E2B57";
const PIZARRA = "#1B2434";

/* Rótulos de sala: los escribo yo, los hechos vienen del dato. */
const SALAS = [
    "Vestíbulo",
    "Sala I · La obra",
    "Sala II · Las maquetas",
    "Gabinete de cartelas",
    "Sala III · Bocetos",
    "Vitrina de cifras",
    "Salida",
];

const css = `
.ax-spot {
  position: fixed;
  top: 0;
  left: 0;
  width: 840px;
  height: 840px;
  z-index: 20;
  pointer-events: none;
  mix-blend-mode: screen;
  transform: translate3d(calc(50vw - 420px), calc(38vh - 420px), 0);
  background: radial-gradient(circle 420px at 420px 420px, rgba(43, 175, 203, 0.16), transparent 70%);
  animation: ax-breathe 6s ease-in-out infinite;
}
@keyframes ax-breathe {
  0%, 100% { opacity: 0.72; }
  50% { opacity: 1; }
}

/* Riel de latón cian del que cuelgan los marcos. */
.ax-rail {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(43, 175, 203, 0.75) 12%, rgba(237, 229, 204, 0.55) 50%, rgba(43, 175, 203, 0.75) 88%, transparent);
  box-shadow: 0 0 18px rgba(43, 175, 203, 0.35);
}
.ax-hook {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #EDE5CC, #2BAFCB 70%);
  box-shadow: 0 0 10px rgba(43, 175, 203, 0.6);
}

/* Marco de bisel crema con passe-partout, colgado de dos cables. */
.ax-cable {
  position: absolute;
  top: 0;
  width: 1px;
  background: linear-gradient(to bottom, rgba(43, 175, 203, 0.75), rgba(237, 229, 204, 0.22));
}
.ax-frame {
  position: relative;
  border: 10px solid ${CREMA};
  border-radius: 3px;
  background: #D9CFB0;
  padding: 9px;
  filter: brightness(0.82);
  transition: filter 600ms ease;
  box-shadow:
    inset 0 0 0 1px rgba(3, 17, 44, 0.35),
    0 44px 74px -30px rgba(0, 0, 0, 0.95),
    0 2px 0 rgba(255, 255, 255, 0.25);
}
.ax-hang:hover .ax-frame {
  filter: brightness(1);
  animation: ax-swing 700ms cubic-bezier(0.36, 0.07, 0.19, 1.6) 1;
}
@keyframes ax-swing {
  0% { transform: rotate(0deg); }
  22% { transform: rotate(1.5deg); }
  52% { transform: rotate(-0.95deg); }
  78% { transform: rotate(0.42deg); }
  100% { transform: rotate(0deg); }
}
.ax-matte {
  overflow: hidden;
  border-radius: 1px;
  background: ${NOCHE};
  box-shadow: inset 0 0 26px rgba(0, 0, 0, 0.6);
}

/* Cartela de museo: placa crema ligeramente rotada. */
.ax-cartela {
  position: relative;
  border-radius: 2px;
  color: ${PIZARRA};
  background: linear-gradient(178deg, #F4EEDC 0%, #E4DABE 100%);
  box-shadow: 0 18px 34px -18px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transform: rotate(-0.4deg);
}
.ax-cartela--r { transform: rotate(0.4deg); }
.ax-cartela::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 12px;
  height: 1px;
  background: rgba(27, 36, 52, 0.18);
}
.ax-smallcaps {
  font-variant: small-caps;
  letter-spacing: 0.24em;
  text-transform: lowercase;
}

/* Placa de bronce para el stack. */
.ax-plaque {
  position: relative;
  border-radius: 4px;
  border: 1px solid rgba(237, 229, 204, 0.20);
  background: linear-gradient(155deg, rgba(237, 229, 204, 0.12), rgba(65, 106, 175, 0.10) 60%, rgba(3, 17, 44, 0.5));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 20px 40px -26px rgba(0, 0, 0, 0.9);
  transition: border-color 500ms ease, transform 500ms ease;
}
.ax-plaque:hover { border-color: rgba(43, 175, 203, 0.55); transform: translateY(-3px); }
.ax-plaque::before {
  content: "";
  position: absolute;
  inset-inline: 14%;
  top: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${CIAN}, transparent);
  opacity: 0.7;
}

/* Vitrina horizontal de cristal para los bocetos. */
.ax-vitrine {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-top: 1px solid rgba(43, 175, 203, 0.55);
  background: rgba(65, 106, 175, 0.10);
  box-shadow: 0 30px 60px -40px rgba(0, 0, 0, 0.9);
}
.ax-vitrine::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -40%;
  width: 28%;
  pointer-events: none;
  background: linear-gradient(105deg, transparent, rgba(255, 255, 255, 0.10), transparent);
  transform: skewX(-14deg);
  transition: left 900ms ease;
}
.ax-vitrine:hover::after { left: 118%; }

/* Pedestal de la vitrina de cifras. */
.ax-pedestal { position: relative; }
.ax-pedestal::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -14px;
  width: 78%;
  height: 12px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(237, 229, 204, 0.16), rgba(237, 229, 204, 0));
  clip-path: polygon(8% 0, 92% 0, 100% 100%, 0 100%);
}
.ax-underline {
  height: 1px;
  background: linear-gradient(90deg, transparent, ${CIAN}, transparent);
}

/* Puertas de salida. */
.ax-door {
  position: relative;
  overflow: hidden;
  border-radius: 140px 140px 6px 6px;
  border: 1px solid rgba(237, 229, 204, 0.22);
  background: linear-gradient(180deg, rgba(43, 175, 203, 0.14), rgba(3, 17, 44, 0.2));
  transition: border-color 500ms ease, transform 500ms ease;
}
.ax-door:hover { border-color: rgba(43, 175, 203, 0.7); transform: translateY(-4px); }
.ax-door::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(70% 45% at 50% 0%, rgba(43, 175, 203, 0.30), transparent 72%);
  opacity: 0.6;
  transition: opacity 600ms ease;
}
.ax-door:hover::before { opacity: 1; }

/* Logotipo circular girando muy lento. */
.ax-turn { animation: ax-turn 60s linear infinite; transform-origin: 50% 50%; }
@keyframes ax-turn { to { transform: rotate(360deg); } }
.ax-turn-rev { animation: ax-turn 90s linear infinite reverse; transform-origin: 50% 50%; }

/* Inventario de sala. */
.ax-inv { transition: background-color 400ms ease; }
.ax-inv:hover { background-color: rgba(65, 106, 175, 0.12); }

.ax-mock { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
.ax-blur { backdrop-filter: blur(4px); }

@media (prefers-reduced-motion: reduce) {
  .ax-spot { animation: none !important; transform: translate3d(calc(50vw - 420px), calc(38vh - 420px), 0) !important; }
  .ax-hang:hover .ax-frame { animation: none !important; }
  .ax-turn, .ax-turn-rev { animation: none !important; }
  .ax-vitrine::after { transition: none !important; }
}
`;

/* ───────────────── Piezas propias de la sala ───────────────── */

/** Foco de museo: persigue al puntero con interpolación suave. */
const Spotlight = () => {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node || reduce) return;
        if (window.matchMedia("(hover: none)").matches) return;

        let tx = window.innerWidth / 2;
        let ty = window.innerHeight * 0.38;
        let x = tx;
        let y = ty;
        let raf = 0;

        const onMove = (event: PointerEvent) => {
            tx = event.clientX;
            ty = event.clientY;
        };
        const tick = () => {
            x += (tx - x) * 0.12;
            y += (ty - y) * 0.12;
            node.style.transform = `translate3d(${Math.round(x - 420)}px, ${Math.round(y - 420)}px, 0)`;
            raf = window.requestAnimationFrame(tick);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        raf = window.requestAnimationFrame(tick);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.cancelAnimationFrame(raf);
        };
    }, [reduce]);

    return <div ref={ref} aria-hidden className="ax-spot" />;
};

/** Parallax vertical desigual: los marcos suben algo menos que sus cartelas. */
const Parallax = ({
    children,
    range = 54,
    className,
}: {
    children: React.ReactNode;
    range?: number;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : range, reduce ? 0 : -range]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
};

/** Riel superior del que cuelga cada sala. */
const Rail = ({ hooks = 4 }: { hooks?: number }) => (
    <div aria-hidden className="relative">
        <div className="ax-rail" />
        <div className="absolute inset-x-0 flex justify-around -top-[2px]">
            {Array.from({ length: hooks }).map((_, i) => (
                <span key={i} className="ax-hook" />
            ))}
        </div>
    </div>
);

/** Marco de bisel crema suspendido de dos cables. */
const Hung = ({
    children,
    drop = 54,
    className,
}: {
    children: React.ReactNode;
    drop?: number;
    className?: string;
}) => (
    <div className={`ax-hang relative ${className ?? ""}`}>
        <span aria-hidden className="ax-cable" style={{ height: drop, left: "27%" }} />
        <span aria-hidden className="ax-cable" style={{ height: drop, right: "27%" }} />
        <div className="ax-frame" style={{ marginTop: drop, transformOrigin: `50% ${-drop}px` }}>
            <div className="ax-matte">{children}</div>
        </div>
    </div>
);

/** Cartela de sala: título en versalitas, cuerpo gris pizarra y ficha técnica. */
const Cartela = ({
    title,
    body,
    tech,
    side = "l",
    className,
}: {
    title: string;
    body: string;
    tech?: string;
    side?: "l" | "r";
    className?: string;
}) => (
    <div className={`ax-cartela px-5 pt-4 pb-6 ${side === "r" ? "ax-cartela--r" : ""} ${className ?? ""}`}>
        <p className="ax-smallcaps text-[11px] font-bold text-[#1B2434]">{title}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-[#3B475C]">{body}</p>
        {tech && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#6A7891]">{tech}</p>
        )}
    </div>
);

/** Logotipo de Artlex: anillo fragmentado de arcos y puntos con núcleo blanco. */
const ArtlexMark = ({ size = 120, uid = "a", className }: { size?: number; uid?: string; className?: string }) => (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden>
        <defs>
            <linearGradient id={`ax-ring-${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={CIAN} />
                <stop offset="100%" stopColor="#3A64AC" />
            </linearGradient>
        </defs>
        <g className="ax-turn" fill="none" stroke={`url(#ax-ring-${uid})`} strokeLinecap="round">
            <circle cx="60" cy="60" r="50" strokeWidth="2.6" strokeDasharray="62 22 34 16 78 14" />
            <circle cx="60" cy="60" r="56" strokeWidth="0.9" strokeDasharray="3 10" opacity="0.5" />
        </g>
        <g className="ax-turn-rev" fill="none" stroke={CIAN} strokeLinecap="round" opacity="0.6">
            <circle cx="60" cy="60" r="40" strokeWidth="1.2" strokeDasharray="12 9" />
        </g>
        <g fill={CIAN}>
            {Array.from({ length: 9 }).map((_, i) => {
                const angle = (i / 9) * Math.PI * 2;
                return (
                    <circle
                        key={i}
                        // Redondeado: sin recorte, servidor y cliente serializan el
                        // ultimo decimal distinto y React reporta un fallo de hidratacion.
                        cx={Number((60 + Math.cos(angle) * 47).toFixed(3))}
                        cy={Number((60 + Math.sin(angle) * 47).toFixed(3))}
                        r={i % 3 === 0 ? 2.4 : 1.3}
                        opacity={i % 3 === 0 ? 0.95 : 0.5}
                    />
                );
            })}
        </g>
        <circle cx="60" cy="60" r="24" fill="none" stroke="#F8F8F8" strokeWidth="0.8" opacity="0.28" />
        <circle cx="60" cy="60" r="15" fill="#F8F8F8" />
        <circle cx="60" cy="60" r="7" fill={AZUL} opacity="0.9" />
    </svg>
);

/* ───────── Producto de bodega dibujado en CSS (no hay fotos en public) ───────── */

const Producto = ({
    bolsa,
    franja,
    marca,
    sub,
}: {
    bolsa: string;
    franja: string;
    marca: string;
    sub?: string;
}) => (
    <span
        className="absolute inset-0 grid place-items-center"
        style={{ background: `radial-gradient(125% 95% at 50% 8%, ${bolsa}38, #061024 76%)` }}
    >
        <span
            className="relative flex h-[70%] w-[50%] flex-col items-center justify-center rounded-[4px] px-1"
            style={{
                background: `linear-gradient(155deg, ${bolsa}, ${franja})`,
                boxShadow: "0 12px 24px -10px rgba(0,0,0,0.9)",
            }}
        >
            <span aria-hidden className="absolute inset-x-0 top-0 h-[12%] rounded-t-[4px] bg-black/25" />
            <span aria-hidden className="absolute inset-y-0 left-[16%] w-px bg-white/20" />
            <span
                className="w-full rounded-[1px] bg-white/95 py-[2px] text-center text-[6px] font-black leading-none"
                style={{ color: franja }}
            >
                {marca}
            </span>
            {sub && (
                <span className="mt-[3px] text-[5px] font-semibold uppercase tracking-[0.08em] text-white/90">
                    {sub}
                </span>
            )}
        </span>
    </span>
);

const CATALOGO = [
    { marca: "P.A.N.", sub: "Harina de maíz", bolsa: "#F5C518", franja: "#D98E00" },
    { marca: "MARY", sub: "Arroz blanco", bolsa: "#3E82D6", franja: "#1E4E8C" },
    { marca: "MONTALBÁN", sub: "Azúcar", bolsa: "#3FB963", franja: "#1C7A38" },
    { marca: "MAVESA", sub: "Mayonesa", bolsa: "#F3C623", franja: "#C08A05" },
    { marca: "CHEESE TRIS", sub: "Snack", bolsa: "#E4572E", franja: "#A83318" },
];

/* ───────────────── Maquetas de pantalla en HTML/CSS ───────────────── */

const StatusBar = ({ tone = "light" }: { tone?: "light" | "dark" }) => (
    <div
        className={`flex items-center justify-between px-4 pt-2 text-[7px] font-semibold ${
            tone === "light" ? "text-white/85" : "text-black/60"
        }`}
    >
        <span>9:41</span>
        <span className="flex items-center gap-[3px]">
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-current opacity-70" />
            <span className="inline-block h-[5px] w-[9px] rounded-[1px] bg-current opacity-70" />
            <span className="inline-block h-[5px] w-[13px] rounded-[2px] border border-current" />
        </span>
    </div>
);

const BottomNav = ({ active = 0 }: { active?: number }) => {
    const items = [Home, BarChart3, Tag, Calculator, Menu];
    return (
        <div className="absolute inset-x-0 bottom-0 z-20">
            <div
                aria-hidden
                className="h-[52px]"
                style={{ background: "linear-gradient(to top, rgba(43,175,203,0.55), rgba(43,175,203,0))" }}
            />
            <div className="px-[18px] pb-[10px]">
                <div className="flex h-[38px] items-center justify-around rounded-[14px] bg-white shadow-[0_10px_26px_-8px_rgba(0,0,0,0.7)]">
                    {items.map((Icon, i) => (
                        <Icon
                            key={i}
                            size={13}
                            strokeWidth={i === active ? 2.4 : 1.8}
                            color={i === active ? AZUL : "#9AA5B4"}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

/** uiScreens[0] — Bienvenida */
const MockBienvenida = () => (
    <div className="ax-mock relative h-full w-full overflow-hidden" style={{ background: NOCHE }}>
        <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${SALA} 0%, ${NOCHE} 58%)` }}
        />
        <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[60%]"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}
        />

        <div className="relative flex h-full flex-col">
            <StatusBar />

            <div className="flex flex-col items-center pt-[16%]">
                <ArtlexMark size={78} uid="mock" />
                <p className="mt-3 text-[13px] font-bold tracking-[0.42em] text-white">ARTLEX</p>
            </div>

            <div className="mt-auto px-4 pb-6">
                <p className="text-[14px] font-bold leading-tight text-white">Gestiona tu Negocio</p>
                <p className="mt-1 text-[8px] leading-snug text-white/90">
                    El control de tu negocio en la palma de tu mano.
                </p>

                <div className="mt-8 space-y-[7px]">
                    <div
                        className="grid h-[30px] place-items-center rounded-[6px] text-[9px] font-semibold"
                        style={{ background: AZUL, color: CREMA }}
                    >
                        ¡Registrate!
                    </div>
                    <div
                        className="grid h-[30px] place-items-center rounded-[6px] border text-[9px] font-semibold"
                        style={{ borderColor: "rgba(237,229,204,0.5)", color: CREMA }}
                    >
                        Iniciar Sesion
                    </div>
                </div>

                <p className="mt-3 text-center text-[6px] leading-[1.5] text-white/60">
                    Al continuar aceptas nuestros <span className="font-bold text-white/80">Terminos de Servicios</span> y
                    nuestras <span className="font-bold text-white/80">Políticas de Privacidad.</span>
                </p>
            </div>
        </div>
    </div>
);

/** uiScreens[1] — Inicio (catálogo del negocio) */
const MockInicio = () => (
    <div className="ax-mock relative h-full w-full overflow-hidden bg-white">
        <span aria-hidden className="absolute inset-x-0 top-0 h-[168px]" style={{ background: AZUL }} />

        <div className="relative flex h-full flex-col">
            <StatusBar />

            <div className="flex items-center justify-between px-4 pt-3">
                <span className="text-[13px] font-extrabold tracking-[0.22em] text-white">ARTLEX</span>
                <span className="grid h-[22px] w-[22px] place-items-center rounded-full border border-white/60 bg-white/20 text-[7px] font-bold text-white">
                    AS
                </span>
            </div>

            <div className="mt-3 flex items-center gap-2 px-4">
                <div className="flex h-[26px] flex-1 items-center gap-1.5 rounded-[6px] bg-white px-2">
                    <Search size={10} color="#9AA5B4" />
                    <span className="text-[7px] text-[#9AA5B4]">Buscar producto…</span>
                </div>
                <div
                    className="grid h-[26px] w-[26px] place-items-center rounded-[6px]"
                    style={{ background: CREMA }}
                >
                    <SlidersHorizontal size={11} color={AZUL} />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-4">
                <span className="text-[9px] font-semibold text-white">Productos más vendidos</span>
                <span className="text-[7px] text-white/75">ver todo</span>
            </div>

            <div className="mt-2 flex gap-2 overflow-hidden px-4">
                {CATALOGO.slice(0, 3).map((item, i) => (
                    <div
                        key={item.marca}
                        className="relative h-[112px] w-[92px] shrink-0 overflow-hidden rounded-[6px]"
                    >
                        <Producto {...item} />
                        <div className="ax-blur absolute inset-x-0 bottom-0 h-[40px] bg-black/[0.26] px-1.5 pt-1">
                            <p className="text-[6px] font-semibold leading-tight text-white">
                                {item.sub}
                                <br />
                                {item.marca}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[5px] text-white/85">
                                <span className="flex items-center gap-[2px]">
                                    <Flame size={6} /> {128 - i * 17} vend.
                                </span>
                                <span className="flex items-center gap-[2px]">
                                    <Timer size={6} /> {2 + i} d
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-3 px-4 text-[7px] font-medium text-[#8A94A4]">Productos de alto rendimiento.</p>

            <div className="mt-1.5 flex gap-2 overflow-hidden px-4">
                {CATALOGO.slice(2, 5).map((item) => (
                    <div key={item.marca} className="w-[74px] shrink-0">
                        <div className="relative h-[52px] overflow-hidden rounded-[6px]">
                            <Producto {...item} />
                        </div>
                        <p className="mt-1 text-[6px] font-semibold leading-tight text-[#1B2434]">{item.marca}</p>
                        <p className="text-[5px] text-[#8A94A4]">{item.sub}</p>
                    </div>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-between px-4">
                <span className="text-[9px] font-semibold text-[#1B2434]">Vendidos recientemente</span>
                <span className="text-[7px]" style={{ color: AZUL }}>
                    ver todo
                </span>
            </div>

            <div className="mt-1.5 space-y-1.5 px-4">
                {CATALOGO.slice(0, 3).map((item, i) => (
                    <div key={item.marca} className="flex items-center gap-2 rounded-[6px] bg-[#F8F8F8] p-1.5">
                        <span className="relative h-[30px] w-[30px] shrink-0 overflow-hidden rounded-[4px]">
                            <Producto {...item} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-[7px] font-semibold text-[#1B2434]">
                                {item.sub} {item.marca}
                            </span>
                            <span className="mt-[2px] flex items-center gap-2 text-[5px] text-[#8A94A4]">
                                <span className="flex items-center gap-[2px]">
                                    <Flame size={6} /> {96 - i * 12} vend.
                                </span>
                                <span className="flex items-center gap-[2px]">
                                    <Timer size={6} /> hace {i + 1} d
                                </span>
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <BottomNav active={0} />
    </div>
);

/** uiScreens[2] — Ficha de producto */
const MockFicha = () => (
    <div className="ax-mock relative flex h-full w-full flex-col overflow-hidden bg-white">
        <div className="relative h-[150px] w-full shrink-0 overflow-hidden">
            <Producto {...CATALOGO[0]} />
            <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 62%)" }}
            />
            <div className="absolute inset-x-0 top-0">
                <StatusBar />
                <div className="flex items-center justify-between px-3 pt-2">
                    <ChevronLeft size={13} color="#ffffff" />
                    <span className="text-[8px] font-normal text-white">Harina P.A.N. · 1 kg</span>
                    <Bookmark size={12} color="#ffffff" />
                </div>
            </div>
        </div>

        <div className="px-4 pb-4 pt-3" style={{ background: AZUL }}>
            <div className="flex items-center gap-3 text-[6px] text-white">
                <span className="flex items-center gap-1">
                    <Flame size={7} /> 128 vendidos
                </span>
                <span className="flex items-center gap-1">
                    <Timer size={7} /> rota en 3 d
                </span>
            </div>
            <p className="mt-1.5 text-[10px] font-semibold text-white">Harina de maíz precocida P.A.N.</p>
            <p className="mt-1 text-[6px] leading-[1.5] text-white/90">
                El producto que más rota del anaquel. Margen del 18 % sobre el costo de reposición y una salida media de
                seis bolsas por día en temporada alta.
            </p>
        </div>

        <div className="flex h-[26px] items-stretch" style={{ background: CREMA }}>
            {["Ingredientes", "Tutoriales", "Reseñas"].map((tab, i) => (
                <div key={tab} className="relative flex flex-1 items-center justify-center">
                    <span className={`text-[7px] font-semibold text-black ${i === 0 ? "" : "opacity-60"}`}>{tab}</span>
                    {i === 0 && <span className="absolute inset-x-3 bottom-0 h-[2px] bg-black" />}
                </div>
            ))}
        </div>

        <div className="space-y-1.5 px-4 pt-2.5">
            {[
                ["Maíz blanco precocido", "1.000 g"],
                ["Costo de reposición", "Bs 38,40"],
                ["Precio de anaquel", "Bs 45,30"],
                ["Existencias en depósito", "24 und"],
                ["Proveedor", "Distribuidora Higuerote"],
            ].map(([nombre, gramaje]) => (
                <div
                    key={nombre}
                    className="flex items-center justify-between border-b border-black/5 pb-1 text-[7px]"
                >
                    <span className="text-[#1B2434]">{nombre}</span>
                    <span className="font-semibold text-[#5B6779]">{gramaje}</span>
                </div>
            ))}
        </div>

        <div className="mt-auto px-4 pb-8">
            <p className="text-[6px] uppercase tracking-[0.18em] text-[#9AA5B4]">Reseña destacada</p>
            <div className="mt-1 rounded-[5px] bg-[#F8F8F8] p-2">
                <div className="flex items-center gap-1.5">
                    <span className="grid h-[14px] w-[14px] place-items-center rounded-full bg-[#DCE4F1] text-[5px] font-bold text-[#416AAF]">
                        MJ
                    </span>
                    <span className="text-[6px] font-semibold text-[#1B2434]">María J.</span>
                    <span className="ml-auto flex gap-[1px]">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={5} fill="#F5C518" color="#F5C518" />
                        ))}
                    </span>
                </div>
                <p className="mt-1 text-[6px] leading-snug text-[#5B6779]">
                    Se vende sola, hay que pedir doble los lunes.
                </p>
            </div>
        </div>

        <div
            className="absolute bottom-4 right-4 grid h-[26px] w-[26px] place-items-center rounded-full shadow-lg"
            style={{ background: AZUL }}
        >
            <Pencil size={11} color="#ffffff" />
        </div>
    </div>
);

/** uiScreens[3] — Explorar por categorías */
const MockExplorar = () => {
    const cats = [
        { name: "Saludable", tono: "#3FB963" },
        { name: "Bebida", tono: "#2BAFCB" },
        { name: "Mariscos", tono: "#4C7ED6" },
        { name: "Postre", tono: "#E48ABE" },
        { name: "Picante", tono: "#E4572E" },
        { name: "Carne", tono: "#B3453B" },
    ];

    return (
        <div className="ax-mock relative h-full w-full overflow-hidden bg-white">
            <div className="px-4 pb-3" style={{ background: AZUL }}>
                <StatusBar />
                <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-semibold text-white">Explorar</span>
                    <Search size={12} color="#ffffff" />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {cats.map((c) => (
                        <div
                            key={c.name}
                            className="relative grid h-[42px] w-[calc(33.333%-6px)] place-items-center overflow-hidden rounded-[5px]"
                            style={{ background: `linear-gradient(150deg, ${c.tono}, rgba(3,17,44,0.85))` }}
                        >
                            <span aria-hidden className="absolute inset-0 bg-black/25" />
                            <span className="relative text-[6px] font-bold text-white">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 pt-3">
                <div className="relative h-[92px] overflow-hidden rounded-[6px]">
                    <Producto {...CATALOGO[1]} />
                    <div className="ax-blur absolute inset-x-0 bottom-0 bg-black/[0.26] px-2 py-1.5">
                        <p className="text-[7px] font-semibold text-white">Arroz Mary · 1 kg</p>
                        <div className="mt-[2px] flex items-center gap-2 text-[5px] text-white/85">
                            <span className="flex items-center gap-[2px]">
                                <Flame size={6} /> 111 vend.
                            </span>
                            <span className="flex items-center gap-[2px]">
                                <Timer size={6} /> rota en 4 d
                            </span>
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-[7px] font-medium text-[#8A94A4]">También te puede interesar reponer.</p>

                <div className="mt-1.5 flex gap-2 overflow-hidden">
                    {CATALOGO.slice(2, 5).map((item) => (
                        <div key={item.marca} className="w-[74px] shrink-0">
                            <div className="relative h-[52px] overflow-hidden rounded-[6px]">
                                <Producto {...item} />
                            </div>
                            <p className="mt-1 text-[6px] font-semibold text-[#1B2434]">{item.marca}</p>
                            <p className="text-[5px] text-[#8A94A4]">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav active={1} />
        </div>
    );
};

/** uiScreens[4] — Mi perfil */
const MockPerfil = () => (
    <div className="ax-mock relative h-full w-full overflow-hidden bg-white">
        <div className="px-4 pb-5" style={{ background: AZUL }}>
            <StatusBar />
            <div className="flex items-center justify-between pt-2">
                <ChevronLeft size={13} color="#ffffff" />
                <span className="text-[8px] text-white">Mi Perfil</span>
                <span className="text-[7px] font-semibold text-white">Editar</span>
            </div>

            <div className="mt-4 flex flex-col items-center">
                <span className="grid h-[60px] w-[60px] place-items-center rounded-full border-2 border-white/70 bg-white/15 text-[13px] font-bold text-white">
                    AS
                </span>
                <span className="mt-2 flex items-center gap-1.5 text-[7px] font-semibold text-white">
                    <Camera size={9} /> Cambiar foto de perfil
                </span>
            </div>
        </div>

        <div className="space-y-2.5 px-4 pt-4">
            {[
                { label: "Correo", value: "arturo@artlex.app", crema: false },
                { label: "Nombre Completo", value: "Arturo Sojo", crema: false },
                { label: "Tipo de Suscripción", value: "Premium", crema: true },
                { label: "Tiempo de Suscripción", value: "Vigente hasta 12/12/2024", crema: false },
            ].map((f) => (
                <div key={f.label}>
                    <p className="text-[6px] uppercase tracking-[0.16em] text-[#9AA5B4]">{f.label}</p>
                    <div
                        className="mt-1 rounded-[5px] px-2.5 py-2 text-[8px] font-medium text-[#1B2434]"
                        style={{
                            background: f.crema ? CREMA : "#FFFFFF",
                            border: `1px solid ${f.crema ? "rgba(65,106,175,0.25)" : "rgba(27,36,52,0.10)"}`,
                        }}
                    >
                        {f.value}
                    </div>
                </div>
            ))}
        </div>

        <BottomNav active={4} />
    </div>
);

/* Los rótulos de cartela los escribo yo; los describe de uiScreens son guía visual, no texto a imprimir. */
const MAQUETAS = [
    {
        screen: 0,
        node: <MockBienvenida />,
        nota: "Acceso · modales al 85 %",
        label:
            "Fondo a sangre en azul noche con el logotipo circular flotando y la marca en versalitas anchas. Abajo, dos botones de 60 px: relleno azul con texto crema para registrarse, contorno crema para entrar. Cualquiera de los dos levanta un modal blanco que cubre el 85 % de la pantalla.",
    },
    {
        screen: 1,
        node: <MockInicio />,
        nota: "Portada · cinco pestañas",
        label:
            "Cabecera azul de 245 px con la marca y el avatar, buscador falso con botón de filtros crema y tres bandas: los más vendidos en tarjetas de 180 × 220 con cartela desenfocada, los de alto rendimiento y los vendidos recientemente. La barra inferior flota sobre un degradado cian.",
    },
    {
        screen: 2,
        node: <MockFicha />,
        nota: "Detalle · IndexedStack",
        label:
            "Imagen de 280 px bajo un encabezado transparente que se vuelve azul en cuanto el scroll pasa de 2 píxeles. Debajo, bloque azul con métricas y descripción, franja crema de tres pestañas y el contenido colgando de un IndexedStack.",
    },
    {
        screen: 3,
        node: <MockExplorar />,
        nota: "Descubrimiento · Wrap de 6",
        label:
            "Bloque azul de 245 px con seis categorías en mosaico separadas 16 px, tarjeta destacada a todo el ancho sobre blanco y un carril de recomendaciones idéntico al de la portada.",
    },
    {
        screen: 4,
        node: <MockPerfil />,
        nota: "Cuenta · plan premium",
        label:
            "Avatar de 130 px sobre la cabecera azul con la fila para cambiar la foto, y cuatro fichas de datos sobre blanco. La del tipo de suscripción se resalta en crema para marcar el plan premium.",
    },
];

/* ───────────────────────────── Landing ───────────────────────────── */

const Landing = () => {
    const shots = p.media.filter((m: { kind: string }) => m.kind !== "video");
    const video = p.media.find((m: { kind: string }) => m.kind === "video");

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* Paredes de la sala: veladura de lucernario y grano de pintura */}
            <span
                aria-hidden
                className="fixed inset-0 z-0 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${SALA} 0%, rgba(3,17,44,0) 52%)`, opacity: 0.85 }}
            />
            <span aria-hidden className="fixed inset-0 z-0 pointer-events-none noise-layer opacity-[0.04]" />
            <Spotlight />

            {/* ═══════════════ 1 · VESTÍBULO ═══════════════ */}
            <section className="relative z-10 px-4 pt-28 pb-24 md:px-6 md:pt-36 md:pb-32">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="ax-smallcaps text-[11px]" style={{ color: CIAN }}>
                        {SALAS[0]}
                    </p>

                    <Reveal direction="scale" className="flex justify-center mt-8">
                        <div className="relative">
                            <span
                                aria-hidden
                                className="absolute rounded-full -inset-16 blur-3xl"
                                style={{ background: "radial-gradient(circle, rgba(43,175,203,0.22), transparent 68%)" }}
                            />
                            <ArtlexMark size={168} uid="hero" className="relative" />
                        </div>
                    </Reveal>

                    <h1 className="mt-10 text-5xl font-bold md:text-8xl" style={{ letterSpacing: "0.22em", color: "#F8F8F8" }}>
                        <span className="inline-block ml-[0.22em]">{p.name.toUpperCase()}</span>
                    </h1>

                    <p className="max-w-2xl mx-auto mt-6 text-lg leading-relaxed md:text-2xl text-white/75">
                        <RevealWords text={p.tagline} />
                    </p>

                    <div className="mx-auto mt-10 max-w-md">
                        <Rail hooks={3} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                        <Chip>{p.status}</Chip>
                    </div>

                    <p className="mt-5 text-[11px] uppercase tracking-[0.26em] text-white/45">{p.role}</p>

                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                        {p.links.web && (
                            <BrandButton href={p.links.web}>
                                <ArrowUpRight size={16} /> Ver el recorrido
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <BrandButton href={p.links.github} variant="outline">
                                <Github size={16} /> Repositorio
                            </BrandButton>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════ TEXTO DE PARED: problema y solución ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="Texto de pared"
                        title={
                            <>
                                De la libreta del mostrador <span className="brand-gradient-text">a la pantalla</span>
                            </>
                        }
                        lead="Dos párrafos como los que preceden a cualquier exposición: qué había antes y qué se decidió construir."
                    />

                    <div className="grid gap-8 mt-12 md:grid-cols-2 md:gap-10">
                        <Reveal direction="right">
                            <div
                                className="relative h-full p-6 md:p-8"
                                style={{
                                    background: "rgba(3,17,44,0.55)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderLeft: `2px solid rgba(237,229,204,0.35)`,
                                }}
                            >
                                <p className="ax-smallcaps text-[11px] text-white/45">Antes de la obra</p>
                                <h3 className="mt-3 text-xl font-semibold md:text-2xl">Papel, hojas sueltas y memoria</h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">{p.problem}</p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <div
                                className="relative h-full p-6 md:p-8"
                                style={{
                                    background: "linear-gradient(160deg, rgba(65,106,175,0.20), rgba(3,17,44,0.5))",
                                    border: "1px solid rgba(43,175,203,0.35)",
                                    borderTop: `2px solid ${CIAN}`,
                                }}
                            >
                                <p className="ax-smallcaps text-[11px]" style={{ color: CIAN }}>
                                    La obra
                                </p>
                                <h3 className="mt-3 text-xl font-semibold md:text-2xl">Cinco pestañas y una ficha</h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">{p.solution}</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════ 2 · SALA I — LA OBRA (media real) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index={SALAS[1]}
                        title={
                            <>
                                Lo que <span className="brand-gradient-text">cuelga de la pared</span>
                            </>
                        }
                        lead="Capturas y grabación tomadas del dispositivo. Cada pieza cuelga de su cable y lleva su cartela al lado."
                    />

                    <div className="mt-14">
                        <Rail hooks={6} />
                    </div>

                    <div className="grid gap-10 mt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {shots.map((shot: { src: string; caption: string }, i: number) => (
                            <div key={shot.src} className="flex flex-col">
                                <Parallax range={i === 0 ? 46 : 66}>
                                    <Reveal direction="up" delay={i * 0.1}>
                                        <Hung drop={i === 0 ? 46 : 74} className="mx-auto max-w-[300px]">
                                            <Image
                                                src={shot.src}
                                                alt={shot.caption}
                                                width={720}
                                                height={1612}
                                                priority={i === 0}
                                                className="block w-full h-auto"
                                            />
                                        </Hung>
                                    </Reveal>
                                </Parallax>

                                <Parallax range={12} className="mt-6">
                                    <Cartela
                                        side={i % 2 === 0 ? "l" : "r"}
                                        title={p.uiScreens[i]?.name ?? p.name}
                                        body={shot.caption}
                                        tech={`Flutter · ${p.year} · Dart`}
                                        className="mx-auto max-w-[300px]"
                                    />
                                </Parallax>
                            </div>
                        ))}

                        {video && (
                            <div className="flex flex-col">
                                <Parallax range={58}>
                                    <Reveal direction="up" delay={0.2}>
                                        <Hung drop={60} className="mx-auto max-w-[300px]">
                                            <AutoVideo src={video.src} rounded="rounded-[1px]" className="!border-0" />
                                        </Hung>
                                    </Reveal>
                                </Parallax>

                                <Parallax range={12} className="mt-6">
                                    <Cartela
                                        side="l"
                                        title="Recorrido en dispositivo"
                                        body={video.caption}
                                        tech="Android · captura de pantalla en vídeo"
                                        className="mx-auto max-w-[300px]"
                                    />
                                </Parallax>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════ PIEZAS DE LA COLECCIÓN (highlights) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="Piezas de la colección"
                        title={
                            <>
                                Cinco decisiones <span className="brand-gradient-text">que sostienen la app</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                        {p.highlights.map((h: { title: string; description: string; icon: string }, i: number) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title} className="h-full">
                                    <div className="ax-plaque h-full p-5 md:p-6">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px]"
                                                style={{
                                                    background: "rgba(43,175,203,0.14)",
                                                    border: "1px solid rgba(43,175,203,0.32)",
                                                    color: CIAN,
                                                }}
                                            >
                                                <Icon size={18} />
                                            </span>
                                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                                                pieza {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-base font-semibold md:text-lg" style={{ color: CREMA }}>
                                            {h.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-white/65">{h.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════ 3 · SALA II — MAQUETAS EN CSS ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index={SALAS[2]}
                        title={
                            <>
                                Las cinco pantallas, <span className="brand-gradient-text">reconstruidas</span>
                            </>
                        }
                        lead="Maquetas dibujadas en HTML y CSS a partir de las medidas reales del proyecto Flutter: cabecera de 245 px, tarjetas de 180 × 220, franja de pestañas crema y barra flotante de 20 px de radio."
                    />

                    {/* Dos maquetas destacadas, colgadas del riel */}
                    <div className="mt-14">
                        <Rail hooks={4} />
                    </div>

                    <div className="grid gap-12 mt-2 md:grid-cols-2 md:gap-10">
                        {MAQUETAS.slice(0, 2).map((m, i) => (
                            <div key={m.nota} className="flex flex-col">
                                <Parallax range={i === 0 ? 40 : 62}>
                                    <Reveal direction="up" delay={i * 0.12}>
                                        <div className="ax-hang relative mx-auto max-w-[288px]">
                                            <span
                                                aria-hidden
                                                className="ax-cable"
                                                style={{ height: i === 0 ? 44 : 70, left: "30%" }}
                                            />
                                            <span
                                                aria-hidden
                                                className="ax-cable"
                                                style={{ height: i === 0 ? 44 : 70, right: "30%" }}
                                            />
                                            <div style={{ marginTop: i === 0 ? 44 : 70 }}>
                                                <PhoneFrame>{m.node}</PhoneFrame>
                                            </div>
                                        </div>
                                    </Reveal>
                                </Parallax>

                                <Parallax range={10} className="mt-8">
                                    <Cartela
                                        side={i === 0 ? "l" : "r"}
                                        title={p.uiScreens[m.screen].name}
                                        body={m.label}
                                        tech={`${m.nota} · Flutter · ${p.year}`}
                                        className="mx-auto max-w-[340px]"
                                    />
                                </Parallax>
                            </div>
                        ))}
                    </div>

                    {/* Las tres restantes, en carril arrastrable */}
                    <div className="mt-24">
                        <p className="ax-smallcaps text-[11px] mb-6" style={{ color: CIAN }}>
                            resto de la sala · arrastra para recorrerla
                        </p>

                        <DragRail className="pb-4">
                            {MAQUETAS.slice(2).map((m) => (
                                <div key={m.nota} className="w-[252px] shrink-0">
                                    <PhoneFrame glow={false}>{m.node}</PhoneFrame>
                                    <Cartela
                                        side="l"
                                        title={p.uiScreens[m.screen].name}
                                        body={m.label}
                                        tech={m.nota}
                                        className="mt-6"
                                    />
                                </div>
                            ))}
                        </DragRail>
                    </div>
                </div>
            </section>

            {/* ═══════════════ INVENTARIO DE SALA (features) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="Catálogo razonado"
                        title={
                            <>
                                Inventario de <span className="brand-gradient-text">la exposición</span>
                            </>
                        }
                        lead="Cada línea es una pieza montada y navegable dentro del prototipo."
                    />

                    <Stagger className="grid mt-12 gap-x-12 md:grid-cols-2" stagger={0.04}>
                        {p.features.map((f: string, i: number) => (
                            <StaggerItem key={f} y={14}>
                                <div className="ax-inv flex items-baseline gap-4 border-b border-white/[0.07] px-2 py-3">
                                    <span
                                        className="shrink-0 font-mono text-[11px] tracking-[0.14em]"
                                        style={{ color: CIAN, opacity: 0.75 }}
                                    >
                                        n.º {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm leading-relaxed text-white/70">{f}</span>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════ 4 · GABINETE DE CARTELAS (stack) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index={SALAS[3]}
                        title={
                            <>
                                Técnica y <span className="brand-gradient-text">materiales</span>
                            </>
                        }
                        lead="El equivalente al cartel que indica soporte, medidas y año, pero en dependencias reales del pubspec."
                    />

                    <Stagger className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                        {p.stack.map((group: { group: string; items: string[] }) => (
                            <StaggerItem key={group.group} className="h-full">
                                <div className="ax-plaque h-full p-5">
                                    <p className="ax-smallcaps text-[11px] font-bold" style={{ color: CREMA }}>
                                        {group.group}
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        {group.items.map((item) => (
                                            <div key={item} className="flex items-baseline gap-2">
                                                <span
                                                    aria-hidden
                                                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                                                    style={{ background: CIAN }}
                                                />
                                                <span className="text-[13px] leading-snug text-white/70">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════ PLANO DE SALA (arquitectura) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="Plano de sala"
                        title={
                            <>
                                Cómo está <span className="brand-gradient-text">montada por dentro</span>
                            </>
                        }
                    />

                    <Reveal className="mt-12">
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                { k: "models/core", v: "Recipe · Ingridient · TutorialStep · Review", n: "4 entidades con fromJson y toMap" },
                                { k: "models/helper", v: "RecipeHelper", n: "7 colecciones estáticas tipadas" },
                                { k: "views/", v: "screens · widgets · utils", n: "13 pantallas, 16 widgets, AppColor" },
                            ].map((box, i) => (
                                <div
                                    key={box.k}
                                    className="relative p-5"
                                    style={{
                                        background: "rgba(65,106,175,0.10)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderTop: `1px solid ${i === 1 ? CIAN : "rgba(43,175,203,0.35)"}`,
                                    }}
                                >
                                    <p className="font-mono text-[11px] tracking-[0.12em]" style={{ color: CIAN }}>
                                        {box.k}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold" style={{ color: CREMA }}>
                                        {box.v}
                                    </p>
                                    <p className="mt-1 text-xs text-white/50">{box.n}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal className="mt-6" delay={0.1}>
                        <div
                            className="p-6 md:p-8"
                            style={{
                                background: "rgba(3,17,44,0.6)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderLeft: `2px solid ${CIAN}`,
                            }}
                        >
                            <p className="text-sm leading-relaxed text-white/70 md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ 5 · SALA III — BOCETOS (retos) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index={SALAS[4]}
                        title={
                            <>
                                Bocetos y <span className="brand-gradient-text">correcciones</span>
                            </>
                        }
                        lead="Cinco vitrinas horizontales: a la izquierda el problema tal como apareció, a la derecha lo que se montó para resolverlo."
                    />

                    <div className="mt-12 space-y-5">
                        {p.challenges.map((c: { problem: string; solution: string }, i: number) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="ax-vitrine grid md:grid-cols-2">
                                    <div className="p-6 border-b md:border-b-0 md:border-r border-white/[0.07]">
                                        <p className="ax-smallcaps text-[11px] text-white/40">
                                            boceto {String(i + 1).padStart(2, "0")}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-white/70">{c.problem}</p>
                                    </div>
                                    <div className="p-6" style={{ background: "rgba(43,175,203,0.06)" }}>
                                        <p className="ax-smallcaps text-[11px]" style={{ color: CIAN }}>
                                            montaje final
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-white/80">{c.solution}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ 6 · VITRINA DE CIFRAS ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index={SALAS[5]}
                        title={
                            <>
                                La obra <span className="brand-gradient-text">en números</span>
                            </>
                        }
                        align="center"
                    />

                    <div className="grid gap-x-6 gap-y-16 mt-16 sm:grid-cols-2 lg:grid-cols-3">
                        {p.metrics.map((m: { value: string; label: string }, i: number) => (
                            <Reveal key={m.label} delay={i * 0.06}>
                                <div className="ax-pedestal text-center">
                                    <CountMetric value={m.value} label={m.label} />
                                    <div className="ax-underline mx-auto mt-4 w-24" />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ PALETA DE LA SALA ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-5xl mx-auto">
                    <SectionHead index="Paleta de sala" title="Los colores de la exposición" lead={p.brand.mood} />

                    <Reveal className="mt-10">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                            {[
                                { name: "primary", hex: p.brand.primary },
                                { name: "secondary", hex: p.brand.secondary },
                                { name: "accent", hex: p.brand.accent },
                                { name: "bg", hex: p.brand.bg },
                                { name: "surface", hex: p.brand.surface },
                                { name: "text", hex: p.brand.text },
                            ].map((c) => (
                                <div key={c.name} className="overflow-hidden rounded-[3px] border border-white/10">
                                    <div className="h-16" style={{ background: c.hex }} />
                                    <div className="px-2 py-2 bg-black/25">
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{c.name}</p>
                                        <p className="font-mono text-[11px]" style={{ color: CREMA }}>
                                            {c.hex}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={0.1} className="mt-6">
                        <div
                            aria-hidden
                            className="h-2 rounded-full anim-pan"
                            style={{ backgroundImage: p.brand.gradient }}
                        />
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ NOTA DEL COMISARIO (summary) ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4">
                        <ArtlexMark size={44} uid="nota" />
                        <p className="ax-smallcaps text-[11px]" style={{ color: CIAN }}>
                            nota del comisario
                        </p>
                    </div>

                    <Stagger className="mt-8 space-y-5" stagger={0.08}>
                        {p.summary.map((paragraph: string, i: number) => (
                            <StaggerItem key={i}>
                                <p
                                    className={`leading-relaxed ${
                                        i === 0 ? "text-lg md:text-xl text-white/90" : "text-sm md:text-base text-white/60"
                                    }`}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            <div className="relative z-10 py-6 border-y border-white/10 text-[11px] uppercase tracking-[0.26em] text-white/40">
                <Marquee
                    items={p.uiScreens.map((s: { name: string }) => s.name)}
                    speed={38}
                    separator="◆"
                />
            </div>

            {/* ═══════════════ 7 · SALIDA ═══════════════ */}
            <section className="relative z-10 px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-4xl mx-auto">
                    <SectionHead index={SALAS[6]} title="Dos puertas al final del pasillo" align="center" />

                    <div className="grid gap-6 mt-12 sm:grid-cols-2">
                        {p.links.web && (
                            <Reveal>
                                <a href={p.links.web} target="_blank" rel="noreferrer" className="block">
                                    <div className="ax-door flex h-56 flex-col items-center justify-end p-6 text-center">
                                        <ArrowUpRight size={22} color={CIAN} className="relative" />
                                        <p className="relative mt-3 text-base font-semibold" style={{ color: CREMA }}>
                                            El recorrido en vídeo
                                        </p>
                                        <p className="relative mt-1 text-xs text-white/50">
                                            La app funcionando en un Android
                                        </p>
                                    </div>
                                </a>
                            </Reveal>
                        )}

                        {p.links.github && (
                            <Reveal delay={0.1}>
                                <a href={p.links.github} target="_blank" rel="noreferrer" className="block">
                                    <div className="ax-door flex h-56 flex-col items-center justify-end p-6 text-center">
                                        <Github size={22} color={CIAN} className="relative" />
                                        <p className="relative mt-3 text-base font-semibold" style={{ color: CREMA }}>
                                            El código en GitHub
                                        </p>
                                        <p className="relative mt-1 text-xs text-white/50">
                                            5.560 líneas de Dart, 13 pantallas
                                        </p>
                                    </div>
                                </a>
                            </Reveal>
                        )}
                    </div>
                </div>
            </section>

            <div className="relative z-10 pb-32">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Artlex es una interfaz completa levantada sobre datos locales: sistema de color propio, widgets reutilizables y un recorrido navegable de punta a punta. Si necesitas validar un producto móvil antes de invertir en backend, éste es exactamente el trabajo."
                />
            </div>
        </ProjectShell>
    );
};

export default Landing;
