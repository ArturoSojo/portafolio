"use client"

import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    Bike,
    ChevronDown,
    Filter,
    Github,
    Hammer,
    KeyRound,
    Menu,
    Play,
    Scissors,
    Search,
    Snowflake,
    Trees,
    Truck,
    User,
    Wrench,
    Zap,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Magnetic, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { AutoVideo, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("servicios-ya")!;
const nxt = nextProject("servicios-ya");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Paleta literal del proyecto, para no repetir var() en los mockups. */
const AZUL = "#416AAF";
const CREMA = "#EDE5CC";
const CIAN = "#2BAFCB";
const SUAVE = "#EEF4F4";
const TINTA = "#101A2B";
const GRIS = "#5B6779";

/* ---------------------------------------------------------------------- */
/*  CSS propio de la landing — todo con prefijo sy-                        */
/* ---------------------------------------------------------------------- */

const css = `
.sy-ui { font-family: Inter, "Helvetica Neue", "Segoe UI", system-ui, -apple-system, sans-serif; }

.sy-grid {
  background-image:
    linear-gradient(to right, rgba(65, 106, 175, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(65, 106, 175, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: sy-drift 48s linear infinite;
}
.sy-grid-light {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.10) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.10) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: sy-drift 48s linear infinite;
}
.sy-grid-dense {
  background-image:
    linear-gradient(to right, rgba(65, 106, 175, 0.11) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(65, 106, 175, 0.11) 1px, transparent 1px);
  background-size: 24px 24px;
  animation: sy-drift 48s linear infinite;
}
@keyframes sy-drift {
  from { background-position: 0 0; }
  to { background-position: 48px 0; }
}

@keyframes sy-bob {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}
.sy-bob { animation: sy-bob 6s ease-in-out infinite; }

@keyframes sy-halo {
  0%, 100% { opacity: 0.16; transform: scale(1); }
  50% { opacity: 0.32; transform: scale(1.07); }
}
.sy-halo { animation: sy-halo 5.5s ease-in-out infinite; }

.sy-swatch .sy-hex {
  opacity: 0;
  transform: translateY(7px);
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.sy-swatch:hover .sy-hex,
.sy-swatch:focus-within .sy-hex { opacity: 1; transform: translateY(0); }

.sy-rail { scrollbar-width: none; -ms-overflow-style: none; }
.sy-rail::-webkit-scrollbar { display: none; }

.sy-row { transition: background-color 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.sy-row:hover { background-color: rgba(65, 106, 175, 0.06); transform: translateX(4px); }

.sy-underline {
  background-image: linear-gradient(90deg, ${AZUL}, ${CIAN});
  background-repeat: no-repeat;
  background-size: 0% 2px;
  background-position: 0 100%;
  transition: background-size 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.sy-underline:hover { background-size: 100% 2px; }

@media (prefers-reduced-motion: reduce) {
  .sy-grid, .sy-grid-light, .sy-grid-dense, .sy-bob, .sy-halo { animation: none !important; }
  .sy-row:hover, .sy-underline { transition: none !important; }
}
`;

/* ---------------------------------------------------------------------- */
/*  Fondo: la rejilla del barrio con manzanas apenas insinuadas            */
/* ---------------------------------------------------------------------- */

const MANZANAS: { l: string; t: string; w: number; h: number }[] = [
    { l: "2%", t: "6%", w: 190, h: 118 },
    { l: "25%", t: "3%", w: 118, h: 188 },
    { l: "57%", t: "11%", w: 208, h: 92 },
    { l: "81%", t: "1%", w: 132, h: 158 },
    { l: "7%", t: "46%", w: 152, h: 168 },
    { l: "33%", t: "55%", w: 218, h: 108 },
    { l: "65%", t: "43%", w: 138, h: 198 },
    { l: "85%", t: "61%", w: 176, h: 118 },
    { l: "17%", t: "81%", w: 168, h: 128 },
    { l: "51%", t: "85%", w: 198, h: 98 },
];

const BarrioBg = () => {
    const reduce = useReducedMotion();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, (v) => -((v * 0.3) % 48));

    return (
        <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div className="absolute -inset-24" style={reduce ? undefined : { y }}>
                {MANZANAS.map((m) => (
                    <span
                        key={`${m.l}-${m.t}`}
                        className="absolute rounded-[5px]"
                        style={{ left: m.l, top: m.t, width: m.w, height: m.h, background: SUAVE }}
                    />
                ))}
                <span className="absolute inset-0 sy-grid" />
            </motion.div>
        </div>
    );
};

/* ---------------------------------------------------------------------- */
/*  La ficha de oficio: cuatro capas apiladas en el eje Z                  */
/* ---------------------------------------------------------------------- */

interface Oficio {
    name: string;
    tag: string;
    icon: LucideIcon;
    tint: string;
}

const OFICIOS: Oficio[] = [
    { name: "Plomería", tag: "Hoy mismo", icon: Wrench, tint: "#3C6099" },
    { name: "Electricidad", tag: "3 cerca", icon: Zap, tint: "#48719C" },
    { name: "Refrigeración", tag: "24 h", icon: Snowflake, tint: "#3A6EA5" },
    { name: "Manicura", tag: "A domicilio", icon: Scissors, tint: "#4A6DA8" },
    { name: "Delivery", tag: "20 min", icon: Bike, tint: "#3E639B" },
    { name: "Albañilería", tag: "Presupuesto", icon: Hammer, tint: "#44669E" },
    { name: "Cerrajería", tag: "Urgencias", icon: KeyRound, tint: "#3B65A2" },
    { name: "Mudanzas", tag: "Fin de semana", icon: Truck, tint: "#46709F" },
    { name: "Jardinería", tag: "Por hora", icon: Trees, tint: "#3F6BA6" },
];

const EASE_IN = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Tarjeta 3D de cuatro capas: base azul, ilustración, banda de vidrio y pastilla crema. */
const OficioCard = ({
    oficio,
    className,
    size = "md",
}: {
    oficio: Oficio;
    className?: string;
    size?: "sm" | "md";
}) => {
    const reduce = useReducedMotion();
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
    const [active, setActive] = useState(false);
    const Icon = oficio.icon;

    const onMove = (event: MouseEvent<HTMLDivElement>) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rx: -py * 24, ry: px * 24 });
        setActive(true);
    };

    /* Cada capa se desplaza en contra del giro, con amplitud proporcional a su profundidad. */
    const layer = (depth: number): CSSProperties => ({
        transform: `translateZ(${depth}px) translate3d(${(-tilt.ry / 12) * depth * 0.2}px, ${
            (tilt.rx / 12) * depth * 0.2
        }px, 0)`,
        transition: `transform ${active ? 400 : 700}ms ${EASE_IN}`,
    });

    const small = size === "sm";

    return (
        <div style={{ perspective: 900 }} className={className}>
            <div
                onMouseMove={onMove}
                onMouseLeave={() => {
                    setTilt({ rx: 0, ry: 0 });
                    setActive(false);
                }}
                className="relative w-full select-none"
                style={{
                    aspectRatio: "168 / 220",
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    transition: `transform ${active ? 400 : 700}ms ${EASE_IN}, box-shadow ${
                        active ? 400 : 700
                    }ms ${EASE_IN}`,
                    borderRadius: 14,
                    background: AZUL,
                    boxShadow: active
                        ? `${(-tilt.ry / 12) * 10}px ${24 + (tilt.rx / 12) * 10}px 60px rgba(65, 106, 175, 0.25)`
                        : "0 8px 24px rgba(0, 0, 0, 0.08)",
                }}
            >
                {/* capa 20 — la ilustración del oficio */}
                <div
                    className="absolute overflow-hidden inset-[6px] rounded-[10px]"
                    style={{
                        ...layer(20),
                        background: `linear-gradient(155deg, ${oficio.tint} 0%, #24405F 100%)`,
                    }}
                >
                    <span
                        aria-hidden
                        className="absolute inset-0 opacity-[0.16]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                        }}
                    />
                    <span
                        aria-hidden
                        className="absolute rounded-full sy-halo"
                        style={{
                            inset: "18% 14% 30% 14%",
                            background: `radial-gradient(circle, ${CIAN} 0%, transparent 70%)`,
                        }}
                    />
                    <Icon
                        size={small ? 46 : 62}
                        strokeWidth={1.1}
                        className="absolute -translate-x-1/2 text-white/85 left-1/2 top-[26%]"
                    />
                </div>

                {/* capa 40 — banda de vidrio esmerilado, el patrón real de la app */}
                <div
                    className="absolute left-[10px] right-[10px] bottom-[10px] rounded-[5px] bg-black/26 px-2.5 py-2 backdrop-blur-[4px]"
                    style={layer(40)}
                >
                    <p className={`sy-ui font-semibold leading-tight text-white ${small ? "text-[11px]" : "text-[13px]"}`}>
                        {oficio.name}
                    </p>
                    <p className={`sy-ui mt-0.5 text-white/70 ${small ? "text-[8px]" : "text-[9px]"}`}>
                        ServiciosYa · Venezuela
                    </p>
                </div>

                {/* capa 60 — la única mancha cálida: lo accionable */}
                <div
                    className="absolute right-[10px] top-[10px] rounded-full px-2 py-[3px]"
                    style={{ ...layer(60), background: CREMA, boxShadow: "0 6px 14px rgba(0,0,0,0.18)" }}
                >
                    <span className={`sy-ui font-semibold ${small ? "text-[8px]" : "text-[9px]"}`} style={{ color: "#22344F" }}>
                        {oficio.tag}
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ---------------------------------------------------------------------- */
/*  Piezas menudas de los mockups                                          */
/* ---------------------------------------------------------------------- */

/** Ilustración de la bienvenida: el acuerdo firmado, redibujado en SVG. */
const AcuerdoIlustracion = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 220 132" className={className} fill="none" aria-hidden>
        {/* documento inclinado, detrás */}
        <g transform="rotate(-15 118 58)">
            <rect x="92" y="12" width="54" height="72" rx="3" fill="#FFFFFF" stroke="#C6D0DE" strokeWidth="1.6" />
            {[22, 30, 38, 46].map((y) => (
                <rect key={y} x="99" y={y} width="40" height="2.6" rx="1.3" fill="#DDE3EC" />
            ))}
            <rect x="99" y="54" width="24" height="2.6" rx="1.3" fill="#DDE3EC" />
            <path d="M99 70c4-7 7 4 11-2s6 5 10-3 6 4 11 0" stroke="#2F5AA8" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="136" cy="70" r="8" fill="#6C5DD3" opacity="0.9" />
            <circle cx="136" cy="70" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.9" />
        </g>

        {/* suelo */}
        <line x1="26" y1="118" x2="194" y2="118" stroke="#D9DEE6" strokeWidth="2" strokeLinecap="round" />

        {/* figura izquierda */}
        <g>
            <circle cx="60" cy="44" r="11" fill="#E7BC95" />
            <path d="M49 42c0-7 5-11 11-11s11 4 11 11c-4-3-7-4-11-4s-7 1-11 4z" fill="#26344A" />
            <path d="M46 58h28l7 60H39z" fill="#28374D" />
            <path d="M56 58h8l-1 26h-6z" fill="#F4F7FB" />
            <path d="M60 62l4 6-4 5-4-5z" fill={AZUL} />
            <path d="M74 70l24 12" stroke="#28374D" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* figura derecha */}
        <g>
            <circle cx="160" cy="44" r="11" fill="#D6A277" />
            <path d="M149 42c0-7 5-11 11-11s11 4 11 11c-4-3-7-4-11-4s-7 1-11 4z" fill="#1F2C3F" />
            <path d="M146 58h28l7 60h-42z" fill="#33465F" />
            <path d="M156 58h8l-1 26h-6z" fill="#F4F7FB" />
            <path d="M160 62l4 6-4 5-4-5z" fill={CIAN} />
            <path d="M146 70l-24 12" stroke="#33465F" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* el apretón */}
        <circle cx="110" cy="83" r="8.5" fill="#E7BC95" />
        <path d="M104 83h12" stroke="#C79468" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

/** Campo de línea inferior al estilo Material. */
const CampoLinea = ({
    label,
    counter,
    value,
    masked = false,
}: {
    label: string;
    counter?: string;
    value?: string;
    masked?: boolean;
}) => (
    <div className="mt-2.5">
        <div className="flex items-baseline justify-between border-b border-[#C9CDD4] pb-1">
            <span className="sy-ui text-[8px]" style={{ color: value ? TINTA : "#8B929C" }}>
                {masked && value ? "••••••••" : value || label}
            </span>
        </div>
        {counter && <p className="sy-ui mt-[3px] text-right text-[6.5px] text-[#9BA2AC]">{counter}</p>}
    </div>
);

/** Campo compuesto: caja estrecha con borde azul + caja ancha con borde gris. */
const CampoCompuesto = ({
    prefix,
    label,
    counter,
    withPerson = false,
}: {
    prefix: string;
    label: string;
    counter: string;
    withPerson?: boolean;
}) => (
    <div className="mt-2.5">
        <div className="flex items-stretch gap-1.5">
            <div
                className="flex items-center gap-0.5 rounded-[5px] border px-1.5 py-1"
                style={{ borderColor: AZUL, borderWidth: 1.2 }}
            >
                <span className="sy-ui text-[8px] font-semibold" style={{ color: TINTA }}>
                    {prefix}
                </span>
                <ChevronDown size={7} color={AZUL} />
            </div>
            <div className="flex flex-1 items-center gap-1 rounded-[5px] border border-[#4A4A4A] px-1.5 py-1">
                {withPerson && <User size={7} color="#8B929C" />}
                <span className="sy-ui text-[8px] text-[#8B929C]">{label}</span>
            </div>
        </div>
        <p className="sy-ui mt-[3px] text-right text-[6.5px] text-[#9BA2AC]">{counter}</p>
    </div>
);

/** Tirador de la hoja modal. */
const Tirador = () => <span className="mx-auto block h-[5px] w-[35%] rounded-full bg-[#D9D9D9]" />;

/* ---------------------------------------------------------------------- */
/*  Mockups: las cinco pantallas recreadas en HTML/CSS                     */
/* ---------------------------------------------------------------------- */

const MockBienvenida = ({ dim = false }: { dim?: boolean }) => (
    <div
        className="absolute inset-0 flex flex-col"
        style={{
            background:
                "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 34%, #A7B7CC 58%, #56718F 78%, #1E2E42 100%)",
        }}
    >
        <div className="px-4 pt-8">
            <AcuerdoIlustracion className="w-full h-auto" />
        </div>

        <div className="px-4 mt-2 text-center">
            <p className="sy-ui text-[12px] font-bold leading-tight" style={{ color: "#0B1220" }}>
                Contrata u ofrece servicios
            </p>
            <p className="sy-ui mt-1 text-[8px] leading-snug" style={{ color: "#3E4A5A" }}>
                Optimiza tu tiempo y agiliza la contratación.
            </p>
        </div>

        <div className="flex flex-col justify-end flex-1 px-3 pb-4">
            <div className="rounded-[7px] py-[9px] text-center" style={{ background: AZUL }}>
                <span className="sy-ui text-[9px] font-semibold" style={{ color: CREMA }}>
                    ¡Regístrate!
                </span>
            </div>
            <div
                className="mt-2.5 rounded-[7px] border py-[9px] text-center"
                style={{ borderColor: "rgba(237,229,204,0.5)" }}
            >
                <span className="sy-ui text-[9px] font-semibold" style={{ color: CREMA }}>
                    Iniciar Sesion
                </span>
            </div>
            <p className="sy-ui mt-5 text-center text-[6.5px] leading-[1.5] text-white/60">
                Al usar ServiciosYa, estás aceptando nuestros
                <br />
                <span className="font-bold">Terminos de Servicios y Políticas de Privacidad.</span>
            </p>
        </div>

        {dim && <span className="absolute inset-0" style={{ background: "rgba(58,63,70,0.45)" }} />}
    </div>
);

const MockRegistro = () => (
    <div className="absolute inset-0 bg-black">
        <MockBienvenida dim />
        <div className="absolute inset-x-0 bottom-0 h-[85%] overflow-hidden rounded-t-[20px] bg-white px-3.5 pt-2.5">
            <Tirador />
            <p className="sy-ui mt-3 text-[13px] font-bold" style={{ color: "#0B1220" }}>
                Registro
            </p>

            <CampoCompuesto prefix="V" label="RIF/CI" counter="0/9" withPerson />
            <CampoLinea label="Nombre" />
            <CampoLinea label="Apellido" />
            <CampoLinea label="Correo" />
            <CampoCompuesto prefix="412" label="Número de teléfono" counter="0/8" />
            <CampoLinea label="Ingrese fecha (DDMMYYYY)" counter="0/8" />
            <CampoLinea label="Contraseña" masked />

            <div className="rounded-[7px] py-[9px] text-center mt-3.5" style={{ background: AZUL }}>
                <span className="sy-ui text-[9px] font-semibold" style={{ color: CREMA }}>
                    Registrar
                </span>
            </div>
            <p className="sy-ui mt-2 text-center text-[7px]" style={{ color: GRIS }}>
                ¿Ya tienes una cuenta?{" "}
                <span className="font-bold" style={{ color: AZUL }}>
                    Entrar
                </span>
            </p>
        </div>
    </div>
);

const MockLogin = () => (
    <div className="absolute inset-0 bg-black">
        <MockBienvenida dim />
        <div className="absolute inset-x-0 bottom-0 h-[85%] overflow-hidden rounded-t-[20px] bg-white px-3.5 pt-2.5">
            <Tirador />
            <p className="sy-ui mt-4 text-[13px] font-bold" style={{ color: "#0B1220" }}>
                Iniciar
            </p>

            <CampoLinea label="Correo" />
            <CampoLinea label="Contraseña" masked />

            <div className="rounded-[7px] py-[9px] text-center mt-7" style={{ background: AZUL }}>
                <span className="sy-ui text-[9px] font-semibold" style={{ color: CREMA }}>
                    Entrar
                </span>
            </div>
            <p className="sy-ui mt-2.5 text-center text-[7px]" style={{ color: GRIS }}>
                ¿Olvidaste tu Contraseña?{" "}
                <span className="font-bold" style={{ color: AZUL }}>
                    Restaurar
                </span>
            </p>
        </div>
    </div>
);

const CODIGO = ["4", "8", "2", "9", "1", "3"];

const MockVerificacion = () => {
    const reduce = useReducedMotion();
    return (
        <div className="absolute inset-0 flex flex-col px-4 pt-2 bg-white">
            <div className="pt-[30%]">
                <p className="sy-ui text-[15px] font-light leading-tight" style={{ color: "#2A2A2A" }}>
                    Verificación
                    <br />
                    del código
                </p>
                <p className="sy-ui mt-3 text-[7.5px] leading-[1.6]" style={{ color: "#4A4A4A" }}>
                    Le enviamos un código por correo electrónico, por favor ingréselo a continuación
                </p>
            </div>

            <div className="mt-auto">
                <div className="flex justify-between gap-[5px]">
                    {CODIGO.map((d, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0.35, borderColor: "#E6E6E6", scale: 1 }}
                            whileInView={{
                                opacity: 1,
                                borderColor: reduce ? "#E6E6E6" : AZUL,
                                scale: reduce ? 1 : [1, 1.12, 1],
                            }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.16 }}
                            className="grid flex-1 rounded-[6px] border bg-white place-items-center aspect-square"
                            style={{ borderWidth: 1 }}
                        >
                            <span className="sy-ui text-[10px] font-semibold" style={{ color: TINTA }}>
                                {d}
                            </span>
                        </motion.div>
                    ))}
                </div>
                <p className="sy-ui mt-2 text-center text-[6.5px]" style={{ color: "#8B929C" }}>
                    Ingrese el código recibido por correo electrónico
                </p>
            </div>

            <div className="pb-5 mt-auto">
                <div className="rounded-[7px] py-[9px] text-center" style={{ background: "#2F6BF0" }}>
                    <span className="sy-ui text-[9px] font-semibold text-white">Reenviar código</span>
                </div>
                <p className="sy-ui mt-3 text-center text-[7px]" style={{ color: "#0B1220" }}>
                    ¿Correo incorrecto?{" "}
                    <span className="font-semibold" style={{ color: AZUL }}>
                        Regresar
                    </span>
                </p>
            </div>
        </div>
    );
};

const DESTACADOS = [
    { title: "Instalación de aire", a: "4,8 ★", b: "35 min" },
    { title: "Reparación eléctrica", a: "4,6 ★", b: "1 h" },
];
const RECIENTES = [
    { title: "Pintura de fachada", meta: "Caracas · ayer" },
    { title: "Destape de tuberías", meta: "Maracay · hace 2 d" },
    { title: "Mantenimiento de nevera", meta: "Valencia · hace 3 d" },
];

const MockPanel = () => (
    <div className="absolute inset-0 overflow-hidden bg-white">
        {/* cabecera azul sangrada */}
        <div className="px-3 pt-7 pb-3" style={{ background: AZUL }}>
            <div className="flex items-center justify-between">
                <Menu size={12} color="#fff" />
                <span className="sy-ui text-[10px] font-bold text-white">ServiciosYa</span>
                <span className="h-[16px] w-[16px] rounded-full border border-white/50" style={{ background: "#8FA9CC" }} />
            </div>

            <div className="flex items-center gap-2 mt-3">
                <div className="flex flex-1 items-center gap-1.5 rounded-[7px] px-2 py-[7px]" style={{ background: "#5479B9" }}>
                    <Search size={9} color="#fff" />
                    <span className="sy-ui text-[7.5px] text-white/70">Buscar un oficio…</span>
                </div>
                <div className="grid h-[26px] w-[26px] place-items-center rounded-[7px]" style={{ background: CREMA }}>
                    <Filter size={11} color="#22344F" />
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <span className="sy-ui text-[8px] font-semibold text-white">Productos más vendidos</span>
                <span className="sy-ui text-[6.5px] text-white/70">ver todo</span>
            </div>

            <div className="flex gap-2 mt-2">
                {DESTACADOS.map((d, i) => (
                    <div
                        key={d.title}
                        className="relative h-[70px] flex-1 overflow-hidden rounded-[7px]"
                        style={{ background: `linear-gradient(150deg, ${i === 0 ? "#3E679F" : "#4C7CB3"}, #22374F)` }}
                    >
                        <span
                            aria-hidden
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
                                backgroundSize: "12px 12px",
                            }}
                        />
                        <div className="absolute inset-x-[4px] bottom-[4px] rounded-[4px] bg-black/26 px-1.5 py-1 backdrop-blur-[4px]">
                            <p className="sy-ui text-[6.5px] font-semibold leading-tight text-white">{d.title}</p>
                            <p className="sy-ui mt-[2px] text-[5.5px] text-white/70">
                                {d.a} · {d.b}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* cuerpo blanco */}
        <div className="px-3 pt-3">
            <p className="sy-ui text-[8px] font-semibold" style={{ color: TINTA }}>
                Recomendados
            </p>
            <div className="flex gap-2 mt-1.5">
                {["Cerrajería", "Jardinería"].map((r, i) => (
                    <div
                        key={r}
                        className="h-[38px] flex-1 rounded-[6px] border border-[#E4E9EF] p-1.5"
                        style={{ background: i === 0 ? SUAVE : "#FFFFFF" }}
                    >
                        <span className="sy-ui text-[6.5px] font-semibold" style={{ color: TINTA }}>
                            {r}
                        </span>
                        <span className="sy-ui mt-[2px] block text-[5.5px]" style={{ color: GRIS }}>
                            Desde $8
                        </span>
                    </div>
                ))}
            </div>

            <p className="sy-ui mt-3 text-[8px] font-semibold" style={{ color: TINTA }}>
                Vendidos recientemente
            </p>
            <div className="mt-1.5 space-y-1.5">
                {RECIENTES.map((r) => (
                    <div key={r.title} className="flex items-center gap-2">
                        <span className="h-[22px] w-[22px] shrink-0 rounded-[5px]" style={{ background: "#C9D6E6" }} />
                        <span className="min-w-0">
                            <span className="sy-ui block truncate text-[6.5px] font-semibold" style={{ color: TINTA }}>
                                {r.title}
                            </span>
                            <span className="sy-ui block text-[5.5px]" style={{ color: GRIS }}>
                                {r.meta}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* barra inferior flotante, recortada a 20 px */}
        <div className="absolute bottom-[10px] left-[12%] right-[12%] overflow-hidden rounded-[14px] bg-white shadow-[0_10px_26px_rgba(16,26,43,0.22)]">
            <div className="flex items-center justify-around py-2">
                {[
                    { Icon: Icons.House, label: "Inicio", on: true },
                    { Icon: Icons.ChartLine, label: "Analítica", on: false },
                    { Icon: Icons.Tag, label: "Ventas", on: false },
                    { Icon: Icons.Wallet, label: "Gastos", on: false },
                ].map(({ Icon, label, on }) => (
                    <Icon
                        key={label}
                        size={12}
                        strokeWidth={on ? 2.4 : 1.6}
                        color={on ? AZUL : "#757575"}
                        fill={on ? AZUL : "none"}
                        aria-label={label}
                    />
                ))}
            </div>
        </div>
    </div>
);

/* ---------------------------------------------------------------------- */
/*  Datos ilustrativos de la sección "problema"                            */
/* ---------------------------------------------------------------------- */

const NODOS = [
    { x: 42, y: 58, r: 7 },
    { x: 152, y: 28, r: 5 },
    { x: 268, y: 66, r: 6 },
    { x: 358, y: 40, r: 5 },
    { x: 96, y: 148, r: 6 },
    { x: 212, y: 132, r: 8 },
    { x: 324, y: 168, r: 5 },
    { x: 56, y: 224, r: 5 },
    { x: 178, y: 232, r: 6 },
    { x: 302, y: 244, r: 6 },
];

interface Caja {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    sub?: string;
    fill: string;
    text?: string;
}

/* Mapa de lib/ — la arquitectura por capas, dibujada a escala de viewBox. */
const CAJAS: Caja[] = [
    { x: 12, y: 14, w: 396, h: 40, label: "main.dart · WelcomePage", fill: AZUL, text: "#FFFFFF" },
    { x: 12, y: 86, w: 190, h: 62, label: "models/core", sub: "fromJson · toMap", fill: "#FFFFFF" },
    { x: 218, y: 86, w: 190, h: 62, label: "models/helper", sub: "RecipeHelper (memoria)", fill: "#FFFFFF" },
    { x: 12, y: 180, w: 124, h: 62, label: "views/screens", sub: "11 · auth/", fill: "#FFFFFF" },
    { x: 148, y: 180, w: 124, h: 62, label: "views/widgets", sub: "16 · modals/", fill: "#FFFFFF" },
    { x: 284, y: 180, w: 124, h: 62, label: "views/utils", sub: "AppColor", fill: CREMA },
    { x: 12, y: 268, w: 396, h: 40, label: "PageSwitcher · barra propia", fill: "#EAF0F8" },
];

const CONEXIONES = [
    "M107 54 L107 86",
    "M313 54 L313 86",
    "M107 148 L74 180",
    "M313 148 L210 180",
    "M313 148 L346 180",
    "M74 242 L74 268",
    "M210 242 L210 268",
    "M346 242 L346 268",
];

const ARISTAS: [number, number][] = [
    [0, 4],
    [4, 1],
    [1, 5],
    [5, 2],
    [2, 3],
    [5, 6],
    [4, 7],
    [7, 8],
    [8, 5],
    [8, 9],
    [9, 6],
    [0, 1],
];

/* ---------------------------------------------------------------------- */
/*  Utilidades de sección                                                  */
/* ---------------------------------------------------------------------- */

const Section = ({
    children,
    className,
    style,
}: {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}) => (
    <section className={`relative z-10 px-4 md:px-6 ${className ?? ""}`} style={style}>
        {children}
    </section>
);

const FEATURE_ICONS: LucideIcon[] = [
    Icons.Sparkles,
    Icons.UserPlus,
    Icons.LogIn,
    Icons.MailCheck,
    Icons.LayoutGrid,
    Icons.PanelLeft,
    Icons.GalleryHorizontal,
    Icons.Grid3x3,
    Icons.Search,
    Icons.ArrowDownUp,
    Icons.Bookmark,
    Icons.CircleUser,
    Icons.ListChecks,
    Icons.Maximize2,
    Icons.Blend,
    Icons.Shapes,
    Icons.Type,
    Icons.MonitorSmartphone,
];

/* ---------------------------------------------------------------------- */
/*  Landing                                                                */
/* ---------------------------------------------------------------------- */

const Landing = () => {
    const reduce = useReducedMotion();

    const video = p.media.find((m) => m.kind === "video");
    const shots = p.media.filter((m) => m.kind !== "video");

    const swatches: { key: string; label: string; value: string }[] = [
        { key: "primary", label: "primary", value: p.brand.primary },
        { key: "secondary", label: "secondary", value: p.brand.secondary },
        { key: "accent", label: "accent", value: p.brand.accent },
        { key: "bg", label: "bg", value: p.brand.bg },
        { key: "surface", label: "surface", value: p.brand.surface },
        { key: "text", label: "text", value: p.brand.text },
    ];

    const pasos = [
        { name: p.uiScreens[0].name, node: <MockBienvenida />, nota: "Una puerta, dos caminos" },
        { name: p.uiScreens[1].name, node: <MockRegistro />, nota: "Identidad con formatos del país" },
        { name: p.uiScreens[3].name, node: <MockVerificacion />, nota: "Seis dígitos por correo" },
        { name: p.uiScreens[4].name, node: <MockPanel />, nota: "Cuatro pestañas flotantes" },
    ];

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>
            <BarrioBg />

            {/* ═══════════════════ HERO ═══════════════════ */}
            <Section className="pt-28 pb-16 md:pt-36 md:pb-24">
                <div
                    aria-hidden
                    className="absolute inset-0 overflow-hidden"
                    style={{ background: p.brand.gradient }}
                >
                    <span className="absolute inset-0 sy-grid-light" />
                    <span
                        className="absolute -bottom-24 -left-20 h-[420px] w-[420px] rounded-full sy-halo"
                        style={{ background: `radial-gradient(circle, ${CIAN} 0%, transparent 68%)` }}
                    />
                </div>

                <div className="relative grid items-center max-w-6xl gap-12 mx-auto lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                                style={{ background: CREMA, color: "#22344F" }}
                            >
                                {p.categoryShort}
                            </span>
                            <span className="rounded-full border border-white/35 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/80">
                                {p.year}
                            </span>
                            <span className="rounded-full border border-white/35 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/80">
                                {p.statusShort}
                            </span>
                        </div>

                        <h1 className="mt-7 text-[2.6rem] font-extrabold leading-[1.03] text-white md:text-[4.4rem]">
                            <RevealWords text="Contrata u ofrece" />
                            <br />
                            <span style={{ color: CREMA }}>
                                <RevealWords text="servicios" delay={0.18} />
                            </span>
                        </h1>

                        <p className="max-w-xl mt-6 text-base leading-relaxed text-white/85 md:text-lg">{p.tagline}</p>

                        <p className="max-w-xl mt-5 text-[13px] leading-relaxed text-white/65">{p.category}</p>
                        <p className="max-w-xl mt-1 text-[13px] leading-relaxed text-white/65">{p.role}</p>

                        <div className="flex flex-wrap gap-3 mt-9">
                            {p.links.web && (
                                <Magnetic>
                                    <BrandButton
                                        href={p.links.web}
                                        variant="outline"
                                        className="!border-[#EDE5CC] !bg-[#EDE5CC] !text-[#22344F]"
                                    >
                                        <Play size={16} /> Ver el recorrido
                                    </BrandButton>
                                </Magnetic>
                            )}
                            {p.links.github && (
                                <Magnetic>
                                    <BrandButton
                                        href={p.links.github}
                                        variant="outline"
                                        className="!border-white/50 !text-white"
                                    >
                                        <Github size={16} /> Ver el repositorio
                                    </BrandButton>
                                </Magnetic>
                            )}
                        </div>

                        <p className="max-w-xl mt-8 text-[12px] leading-relaxed text-white/55">{p.status}</p>
                    </div>

                    {/* la baraja en reposo */}
                    <div className="hidden md:block">
                        <div className="relative flex items-center justify-center gap-4 lg:gap-6">
                            {OFICIOS.slice(0, 3).map((o, i) => (
                                <div
                                    key={o.name}
                                    className={reduce ? "" : "sy-bob"}
                                    style={{
                                        animationDelay: `${-i * 2}s`,
                                        marginTop: i === 1 ? -28 : i === 2 ? 16 : 0,
                                    }}
                                >
                                    <OficioCard oficio={o} className="w-[130px] lg:w-[164px]" />
                                </div>
                            ))}
                        </div>
                        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.28em] text-white/45">
                            el directorio, ficha a ficha
                        </p>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ 01 · EL PROBLEMA ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="01 / El barrio"
                        title={
                            <>
                                Cada oficio es <span className="brand-gradient-text">un punto suelto</span>
                            </>
                        }
                        lead="Antes de la app, el directorio de oficios existe: está repartido en cadenas de WhatsApp, grupos de Facebook y la memoria de los vecinos. Lo que no existe es la línea que une un punto con otro."
                    />

                    <div className="grid gap-10 mt-14 lg:grid-cols-[1fr_1fr] lg:items-center">
                        <Reveal direction="right">
                            <div className="overflow-hidden rounded-2xl border border-[#416AAF]/15 bg-white/85 p-4 backdrop-blur-sm">
                                <div className="relative sy-grid-dense rounded-xl">
                                    <svg viewBox="0 0 400 268" className="w-full h-auto">
                                        {ARISTAS.map(([a, b], i) => (
                                            <motion.path
                                                key={`${a}-${b}`}
                                                d={`M${NODOS[a].x} ${NODOS[a].y} L${NODOS[b].x} ${NODOS[b].y}`}
                                                fill="none"
                                                stroke={AZUL}
                                                strokeWidth={1.4}
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                whileInView={{ pathLength: 1, opacity: 0.55 }}
                                                viewport={{ once: true, amount: 0.4 }}
                                                transition={{
                                                    duration: reduce ? 0.2 : 0.9,
                                                    delay: reduce ? 0 : 0.25 + i * 0.06,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                            />
                                        ))}
                                        {NODOS.map((n, i) => (
                                            <g key={i}>
                                                <circle cx={n.x} cy={n.y} r={n.r + 6} fill={AZUL} opacity={0.08} />
                                                <circle cx={n.x} cy={n.y} r={n.r} fill={i === 5 ? CREMA : AZUL} />
                                                {i === 5 && <circle cx={n.x} cy={n.y} r={n.r + 3.5} fill="none" stroke={CREMA} strokeWidth="1.2" />}
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#7C8798]">
                                    de contactos sueltos a directorio
                                </p>
                            </div>
                        </Reveal>

                        <Stagger className="space-y-6">
                            <StaggerItem>
                                <div className="border-l-[3px] pl-5" style={{ borderColor: "#C9D3E1" }}>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B95A5]">
                                        El problema
                                    </p>
                                    <p className="mt-3 text-[15px] leading-relaxed md:text-base" style={{ color: "#2C3A4D" }}>
                                        {p.problem}
                                    </p>
                                </div>
                            </StaggerItem>
                            <StaggerItem>
                                <div
                                    className="rounded-2xl p-6 md:p-7"
                                    style={{ background: SUAVE, border: `1px solid ${AZUL}22` }}
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: AZUL }}>
                                        La solución
                                    </p>
                                    <p className="mt-3 text-[15px] leading-relaxed md:text-base" style={{ color: "#22344F" }}>
                                        {p.solution}
                                    </p>
                                </div>
                            </StaggerItem>
                        </Stagger>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ 02 · LA BARAJA ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / La baraja"
                        title={
                            <>
                                Un mazo de fichas <span className="brand-gradient-text">sobre el plano</span>
                            </>
                        }
                        lead="La metáfora que gobierna toda la interfaz: cada oficio es una carta de cuatro capas —base azul, ilustración, banda de vidrio esmerilado y pastilla crema— repartida sobre la rejilla del barrio. Pasa el cursor por encima."
                    />

                    <Stagger stagger={0.08} className="grid gap-5 mt-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
                        {OFICIOS.slice(0, 5).map((o) => (
                            <StaggerItem key={o.name} y={26}>
                                <OficioCard oficio={o} size="sm" />
                                <p className="mt-3 text-[11px] font-semibold" style={{ color: TINTA }}>
                                    {o.name}
                                </p>
                                <p className="text-[10px]" style={{ color: GRIS }}>
                                    {o.tag}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal delay={0.1}>
                        <div className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { t: "Capa 0", d: "Rectángulo plano en #416AAF: el suelo de la ficha." },
                                { t: "Capa 20", d: "La ilustración del oficio, recortada a 10 px de radio." },
                                { t: "Capa 40", d: "Vidrio esmerilado: desenfoque de 4 px y velo negro al 26 %." },
                                { t: "Capa 60", d: "Pastilla crema #EDE5CC: la única mancha cálida y lo único accionable." },
                            ].map((c) => (
                                <div
                                    key={c.t}
                                    className="p-4 border rounded-xl"
                                    style={{ borderColor: `${AZUL}22`, background: "rgba(255,255,255,0.8)" }}
                                >
                                    <span
                                        className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                                        style={{ background: `${AZUL}14`, color: AZUL }}
                                    >
                                        {c.t}
                                    </span>
                                    <p className="mt-2.5 text-[12px] leading-relaxed" style={{ color: "#3A4757" }}>
                                        {c.d}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </Section>

            {/* ═══════════════════ 03 · HIGHLIGHTS ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / Lo que sostiene"
                        title={
                            <>
                                Seis decisiones que <span className="brand-gradient-text">dan forma al prototipo</span>
                            </>
                        }
                    />

                    <Stagger stagger={0.08} className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div
                                        className="relative h-full overflow-hidden transition-shadow duration-500 group rounded-2xl bg-white/90 hover:shadow-[0_24px_60px_-24px_rgba(65,106,175,0.45)]"
                                        style={{ border: `1px solid ${AZUL}1F` }}
                                    >
                                        <span className="block h-[5px]" style={{ background: p.brand.gradient }} />
                                        <div className="p-5 md:p-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <span
                                                    className="grid rounded-[10px] h-10 w-10 place-items-center"
                                                    style={{ background: `${AZUL}14`, color: AZUL }}
                                                >
                                                    <Icon size={19} />
                                                </span>
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                    style={{ background: CREMA, color: "#22344F" }}
                                                >
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <h3 className="mt-4 text-[17px] font-bold leading-snug" style={{ color: TINTA }}>
                                                {h.title}
                                            </h3>
                                            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "#4A5768" }}>
                                                {h.description}
                                            </p>
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </Section>

            {/* ═══════════════════ 04 · EL FLUJO EN CUATRO PASOS ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ background: SUAVE, color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / El flujo"
                        title={
                            <>
                                De la bienvenida <span className="brand-gradient-text">al panel</span>
                            </>
                        }
                        lead="Los cuatro pasos reales del acceso, recreados pantalla por pantalla. Ninguno es una captura: todo está redibujado en HTML y CSS a partir del código."
                    />

                    <div className="relative mt-14">
                        <motion.span
                            aria-hidden
                            className="absolute left-0 right-0 hidden h-[2px] origin-left lg:block"
                            style={{ top: 18, background: `linear-gradient(90deg, ${AZUL}, ${CIAN})` }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: reduce ? 0.2 : 1.4, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <div className="flex gap-5 pb-4 overflow-x-auto sy-rail lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
                            {pasos.map((paso, i) => (
                                <Reveal key={paso.name} delay={i * 0.08} className="w-[218px] shrink-0 lg:w-auto">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="grid rounded-full h-9 w-9 place-items-center text-[12px] font-bold"
                                            style={{ background: AZUL, color: CREMA }}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: GRIS }}>
                                            {paso.nota}
                                        </span>
                                    </div>
                                    <PhoneFrame className="mt-6" glow={false} notch={false}>
                                        {paso.node}
                                    </PhoneFrame>
                                    <p className="mt-4 text-[13px] font-semibold" style={{ color: TINTA }}>
                                        {paso.name}
                                    </p>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ 05 · ANATOMÍA DEL CAMPO COMPUESTO ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ color: TINTA }}>
                <div className="grid max-w-6xl gap-12 mx-auto lg:grid-cols-[1fr_0.85fr] lg:items-center">
                    <div>
                        <SectionHead
                            index="05 / Anatomía"
                            title={
                                <>
                                    Un formulario <span className="brand-gradient-text">venezolano</span>
                                </>
                            }
                            lead="El RIF y la cédula llevan letra separada del número, el móvil se identifica por prefijo de operadora y la fecha se escribe corrida. Ningún input genérico resuelve eso, así que el registro se armó con campos compuestos."
                        />

                        <Reveal className="mt-10">
                            <div
                                className="rounded-2xl border bg-white p-5 md:p-7"
                                style={{ borderColor: `${AZUL}22`, boxShadow: "0 24px 60px -32px rgba(65,106,175,0.4)" }}
                            >
                                {/* documento */}
                                <div className="flex items-stretch gap-2.5">
                                    <div
                                        className="flex items-center gap-1.5 rounded-lg border px-3 py-3"
                                        style={{ borderColor: AZUL, borderWidth: 1.5 }}
                                    >
                                        <span className="text-sm font-bold" style={{ color: TINTA }}>
                                            V
                                        </span>
                                        <ChevronDown size={13} color={AZUL} />
                                    </div>
                                    <div className="flex items-center flex-1 gap-2 px-3 py-3 border rounded-lg border-[#4A4A4A]">
                                        <User size={13} color="#8B929C" />
                                        <span className="text-sm text-[#8B929C]">RIF/CI</span>
                                    </div>
                                </div>
                                <p className="mt-1.5 text-right text-[11px] text-[#9BA2AC]">0/9</p>

                                {/* teléfono */}
                                <div className="mt-5 flex items-stretch gap-2.5">
                                    <div
                                        className="flex items-center gap-1.5 rounded-lg border px-3 py-3"
                                        style={{ borderColor: AZUL, borderWidth: 1.5 }}
                                    >
                                        <span className="text-sm font-bold" style={{ color: TINTA }}>
                                            412
                                        </span>
                                        <ChevronDown size={13} color={AZUL} />
                                    </div>
                                    <div className="flex items-center flex-1 px-3 py-3 border rounded-lg border-[#4A4A4A]">
                                        <span className="text-sm text-[#8B929C]">Número de teléfono</span>
                                    </div>
                                </div>
                                <p className="mt-1.5 text-right text-[11px] text-[#9BA2AC]">0/8</p>

                                {/* fecha */}
                                <div className="mt-6 border-b border-[#C9CDD4] pb-2">
                                    <span className="text-sm text-[#8B929C]">Ingrese fecha (DDMMYYYY)</span>
                                </div>
                                <p className="mt-1.5 text-right text-[11px] text-[#9BA2AC]">0/8</p>

                                <div className="mt-8 rounded-[10px] py-4 text-center" style={{ background: AZUL }}>
                                    <span className="text-sm font-semibold" style={{ color: CREMA }}>
                                        Registrar
                                    </span>
                                </div>
                                <p className="mt-3 text-center text-[13px]" style={{ color: GRIS }}>
                                    ¿Ya tienes una cuenta?{" "}
                                    <span className="font-bold" style={{ color: AZUL }}>
                                        Entrar
                                    </span>
                                </p>
                            </div>
                        </Reveal>

                        <Stagger className="flex flex-wrap gap-2 mt-6" stagger={0.06}>
                            {[
                                "Borde azul en el selector, gris oscuro en el campo largo",
                                "Contador bajo la línea, alineado a la derecha",
                                "16 px entre campos y rebote elástico al desplazar",
                                "Padding inferior atado a MediaQuery.viewInsets",
                            ].map((t) => (
                                <StaggerItem key={t} y={14}>
                                    <span
                                        className="inline-block rounded-full px-3 py-1.5 text-[11.5px]"
                                        style={{ background: SUAVE, color: "#3A4757", border: `1px solid ${AZUL}1A` }}
                                    >
                                        {t}
                                    </span>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>

                    {/* La hoja de inicio de sesión, la contraparte escueta */}
                    <Reveal direction="left" delay={0.12}>
                        <div className="max-w-[280px] mx-auto">
                            <PhoneFrame notch={false}>
                                <MockLogin />
                            </PhoneFrame>
                            <p className="mt-5 text-center text-[13px] font-semibold" style={{ color: TINTA }}>
                                {p.uiScreens[2].name}
                            </p>
                            <p className="mt-1 text-center text-[12px] leading-relaxed" style={{ color: GRIS }}>
                                Dos campos, un botón y el tercio inferior vacío: el pulgar cae justo encima de «Entrar».
                            </p>
                        </div>
                    </Reveal>
                </div>
            </Section>

            {/* ═══════════════════ 06 · MATERIAL REAL ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ background: SUAVE, color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / En el dispositivo"
                        title={
                            <>
                                Grabado sobre <span className="brand-gradient-text">un Android real</span>
                            </>
                        }
                        lead="Catorce segundos de recorrido y cuatro capturas directas del prototipo compilado."
                    />

                    <div className="grid gap-10 mt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        {video && (
                            <Reveal>
                                <div className="max-w-[300px] mx-auto lg:mx-0">
                                    <AutoVideo src={video.src} rounded="rounded-[26px]" className="!border-[#416AAF]/25" />
                                    <p className="mt-4 text-[12px] leading-relaxed" style={{ color: GRIS }}>
                                        {video.caption}
                                    </p>
                                </div>
                            </Reveal>
                        )}

                        <Reveal delay={0.1}>
                            <DragRail className="pb-2">
                                {shots.map((shot, i) => (
                                    <div key={shot.src} className="w-[190px] shrink-0 md:w-[220px]">
                                        <ShotCard
                                            src={shot.src}
                                            alt={shot.caption}
                                            caption={shot.caption}
                                            priority={i === 0}
                                            className="!border-[#416AAF]/20 !bg-white"
                                        />
                                    </div>
                                ))}
                            </DragRail>
                            <p className="mt-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: "#8B95A5" }}>
                                arrastra para recorrer las capturas
                            </p>
                        </Reveal>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ 07 · FUNCIONALIDADES ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="07 / Funcionalidades"
                        title={
                            <>
                                Dieciocho piezas <span className="brand-gradient-text">ya construidas</span>
                            </>
                        }
                        lead="Presentadas como la lista vertical de la propia app: miniatura a la izquierda, texto a la derecha."
                    />

                    <Stagger stagger={0.045} className="grid gap-x-8 mt-12 md:grid-cols-2">
                        {p.features.map((f, i) => {
                            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                            return (
                                <StaggerItem key={f} y={14}>
                                    <div
                                        className="sy-row flex items-start gap-3.5 rounded-lg px-2 py-3"
                                        style={{ borderBottom: `1px solid ${AZUL}14` }}
                                    >
                                        <span
                                            className="grid shrink-0 h-11 w-11 place-items-center rounded-[9px]"
                                            style={{
                                                background: i % 3 === 0 ? AZUL : i % 3 === 1 ? SUAVE : CREMA,
                                                color: i % 3 === 0 ? "#FFFFFF" : "#22344F",
                                            }}
                                        >
                                            <Icon size={17} strokeWidth={1.7} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-[10px] font-bold tracking-[0.18em]" style={{ color: "#9BA5B3" }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="mt-0.5 block text-[13.5px] leading-relaxed" style={{ color: "#33425A" }}>
                                                {f}
                                            </span>
                                        </span>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </Section>

            {/* ═══════════════════ 08 · STACK ═══════════════════ */}
            <Section className="py-20 md:py-24" style={{ color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead index="08 / Stack" title="Con qué está hecho" />

                    <div className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.07}>
                                <div className="h-full overflow-hidden rounded-2xl bg-white/90" style={{ border: `1px solid ${AZUL}1F` }}>
                                    <div className="px-4 py-2.5" style={{ background: i % 2 === 0 ? `${AZUL}0F` : CREMA }}>
                                        <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#22344F" }}>
                                            {group.group}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 p-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-md px-2.5 py-1 text-[12px]"
                                                style={{ background: SUAVE, color: "#3A4757", border: `1px solid ${AZUL}14` }}
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
            </Section>

            {/* ═══════════════════ 09 · ARQUITECTURA ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ background: SUAVE, color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="09 / Arquitectura"
                        title={
                            <>
                                Datos y presentación, <span className="brand-gradient-text">separados en serio</span>
                            </>
                        }
                    />

                    <div className="grid gap-10 mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                        <Reveal>
                            <div className="p-4 bg-white border rounded-2xl md:p-6" style={{ borderColor: `${AZUL}22` }}>
                                <div className="overflow-x-auto sy-rail">
                                    <svg viewBox="0 0 420 320" className="w-full h-auto min-w-[340px]">
                                        {CAJAS.map((b) => (
                                            <g key={b.label}>
                                                <rect
                                                    x={b.x}
                                                    y={b.y}
                                                    width={b.w}
                                                    height={b.h}
                                                    rx={8}
                                                    fill={b.fill}
                                                    stroke={AZUL}
                                                    strokeOpacity={b.fill === AZUL ? 0 : 0.25}
                                                    strokeWidth={1.2}
                                                />
                                                <text
                                                    x={b.x + 12}
                                                    y={b.sub ? b.y + 26 : b.y + b.h / 2 + 4}
                                                    fill={b.text ?? TINTA}
                                                    fontSize="12"
                                                    fontWeight="600"
                                                >
                                                    {b.label}
                                                </text>
                                                {b.sub && (
                                                    <text x={b.x + 12} y={b.y + 44} fill={GRIS} fontSize="10">
                                                        {b.sub}
                                                    </text>
                                                )}
                                            </g>
                                        ))}

                                        {CONEXIONES.map((d, i) => (
                                            <motion.path
                                                key={d}
                                                d={d}
                                                stroke={AZUL}
                                                strokeWidth={1.4}
                                                strokeOpacity={0.5}
                                                fill="none"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                viewport={{ once: true, amount: 0.4 }}
                                                transition={{
                                                    duration: reduce ? 0.2 : 0.75,
                                                    delay: reduce ? 0 : 0.2 + i * 0.09,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                            />
                                        ))}
                                    </svg>
                                </div>
                                <p className="mt-3 text-[11px] uppercase tracking-[0.2em]" style={{ color: "#8B95A5" }}>
                                    lib/ — el mapa completo
                                </p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <p className="text-[15px] leading-relaxed md:text-base" style={{ color: "#2C3A4D" }}>
                                {p.architecture}
                            </p>
                        </Reveal>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ 10 · RETOS ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ color: TINTA }}>
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="10 / Retos"
                        title={
                            <>
                                Cinco tropiezos <span className="brand-gradient-text">y sus salidas</span>
                            </>
                        }
                    />

                    <div className="mt-12 space-y-6">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="grid overflow-hidden rounded-2xl md:grid-cols-2" style={{ border: `1px solid ${AZUL}20` }}>
                                    <div className="p-6 bg-white md:p-7">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="grid rounded-full h-7 w-7 place-items-center text-[11px] font-bold"
                                                style={{ background: "#E7EBF1", color: "#5B6779" }}
                                            >
                                                {i + 1}
                                            </span>
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#8B95A5" }}>
                                                El tropiezo
                                            </span>
                                        </div>
                                        <p className="mt-3.5 text-[14px] leading-relaxed" style={{ color: "#3A4757" }}>
                                            {c.problem}
                                        </p>
                                    </div>
                                    <div className="p-6 md:p-7" style={{ background: SUAVE }}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="grid rounded-full h-7 w-7 place-items-center"
                                                style={{ background: AZUL, color: CREMA }}
                                            >
                                                <ArrowRight size={13} />
                                            </span>
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: AZUL }}>
                                                La salida
                                            </span>
                                        </div>
                                        <p className="mt-3.5 text-[14px] leading-relaxed" style={{ color: "#22344F" }}>
                                            {c.solution}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ 11 · FICHA TÉCNICA ═══════════════════ */}
            <Section className="py-20 md:py-28" style={{ background: SUAVE, color: TINTA }}>
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="11 / Ficha técnica"
                        title={
                            <>
                                El prototipo <span className="brand-gradient-text">en números y en color</span>
                            </>
                        }
                    />

                    <Reveal className="mt-12">
                        <div className="p-6 bg-white border rounded-2xl md:p-10" style={{ borderColor: `${AZUL}20` }}>
                            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
                                {p.metrics.map((m) => (
                                    <CountMetric key={m.label} value={m.value} label={m.label} />
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <div className="grid gap-8 mt-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <Reveal>
                            <div className="p-6 bg-white border rounded-2xl md:p-8" style={{ borderColor: `${AZUL}20` }}>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: AZUL }}>
                                    La paleta
                                </p>
                                <div className="grid grid-cols-3 gap-3 mt-5 sm:grid-cols-6">
                                    {swatches.map((s) => (
                                        <div key={s.key} className="sy-swatch" tabIndex={0}>
                                            <span
                                                className="block w-full rounded-lg aspect-square"
                                                style={{ background: s.value, border: "1px solid rgba(16,26,43,0.12)" }}
                                            />
                                            <span className="block mt-2 text-[10px] uppercase tracking-[0.12em]" style={{ color: "#8B95A5" }}>
                                                {s.label}
                                            </span>
                                            <span className="sy-hex block text-[10.5px] font-bold" style={{ color: TINTA }}>
                                                {s.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-10 mt-6 rounded-lg" style={{ background: p.brand.gradient }} />
                                <p className="mt-2 text-[10.5px] font-medium" style={{ color: "#8B95A5" }}>
                                    {p.brand.gradient}
                                </p>

                                <p className="mt-6 text-[14px] leading-relaxed" style={{ color: "#3A4757" }}>
                                    {p.brand.mood}
                                </p>
                                <p className="mt-4 text-[11.5px] leading-relaxed" style={{ color: "#8B95A5" }}>
                                    {p.brand.source}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <div className="h-full p-6 bg-white border rounded-2xl md:p-8" style={{ borderColor: `${AZUL}20` }}>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: AZUL }}>
                                    En una página
                                </p>
                                <div className="flex flex-wrap gap-2 mt-5">
                                    <Chip>{p.categoryShort}</Chip>
                                    <Chip>{p.year}</Chip>
                                    <Chip>{p.statusShort}</Chip>
                                </div>
                                <Stagger className="mt-6 space-y-4">
                                    {p.summary.map((s, i) => (
                                        <StaggerItem key={i} y={16}>
                                            <p
                                                className={`leading-relaxed ${i === 0 ? "text-[15px] md:text-base" : "text-[13.5px]"}`}
                                                style={{ color: i === 0 ? "#22344F" : "#4A5768" }}
                                            >
                                                {s}
                                            </p>
                                        </StaggerItem>
                                    ))}
                                </Stagger>
                                <p className="mt-6 text-[12px] leading-relaxed" style={{ color: "#8B95A5" }}>
                                    {p.role}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════ CINTA + CIERRE ═══════════════════ */}
            <div
                className="relative z-10 py-5 text-[11px] uppercase tracking-[0.24em]"
                style={{ background: AZUL, color: CREMA }}
            >
                <Marquee
                    items={OFICIOS.map((o) => o.name).concat(["Contrata u ofrece", "Directorio de oficios", "Venezuela"])}
                    speed={38}
                    separator="◆"
                />
            </div>

            <div className="relative z-10 pb-32 bg-white">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un marketplace de oficios con doble rol, formularios pensados para el país y un sistema de diseño en un solo archivo. Si necesitas una app móvil con flujo de acceso serio y una interfaz que se sostenga sola, es terreno conocido."
                />
                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="sy-underline inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em]"
                        style={{ color: GRIS }}
                    >
                        volver al directorio <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
