"use client"

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    Calendar,
    CreditCard,
    Eye,
    Fingerprint,
    Github,
    HelpCircle,
    Home,
    LogOut,
    Play,
    Printer,
    RefreshCw,
    Scissors,
    Search,
    Store,
    Trash2,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("servicepay-pos")!;
const nxt = nextProject("servicepay-pos");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const media = (file: string) => p.media.find((m) => m.src.endsWith(file));
const srcOf = (file: string) => media(file)?.src ?? "";

/* ───────────────────────────── Paleta del proyecto ───────────────────────────── */

const BLUE = p.brand.primary;      // #0C7CEC
const YELLOW = p.brand.accent;     // #ECCC04
const ORANGE = p.brand.secondary;  // #FF6000
const ORANGE_SOFT = "#FCA069";
const PAPER = p.brand.surface;     // #FFFFFF
const GRAY = p.brand.bg;           // #F2F3F5
const INK = p.brand.text;          // #353535
const MUTE = "#7C818A";
const LINE = "#E3E5E9";
const RED = "#E4342E";
const GREEN = "#17945B";

/* Las dos identidades que viven en themes.json. */
interface Theme {
    key: "pt" | "sunmi";
    label: string;
    file: string;
    primary: string;
    accent: string;
    gradient: string;
    logo: string;
    mark: string;
    swatches: [string, string];
    entry: string;
}

const THEMES: Record<"pt" | "sunmi", Theme> = {
    pt: {
        key: "pt",
        label: "PagueTodo",
        file: "pt-theme",
        primary: BLUE,
        accent: YELLOW,
        gradient: `linear-gradient(120deg, ${BLUE} 0%, #1F8BF0 60%, #1668C4 100%)`,
        logo: srcOf("paguetodo.png"),
        mark: srcOf("paguetodo_icon.png"),
        swatches: [BLUE, YELLOW],
        entry: "lib/mains/pt",
    },
    sunmi: {
        key: "sunmi",
        label: "Sunmi",
        file: "sunmi-theme",
        primary: ORANGE,
        accent: ORANGE_SOFT,
        gradient: `linear-gradient(120deg, ${ORANGE} 0%, #FB7A2A 60%, #DB5200 100%)`,
        logo: srcOf("sunmi.png"),
        mark: srcOf("sunmi_orange.png"),
        swatches: [ORANGE, ORANGE_SOFT],
        entry: "lib/mains/sunmi",
    },
};

const themeVars = (t: Theme) =>
    ({
        "--sp-pri": t.primary,
        "--sp-acc": t.accent,
        "--brand-primary": t.primary,
        "--brand-accent": t.accent,
        "--brand-gradient": t.gradient,
    } as unknown as CSSProperties);

/* Bordes dentados del papel, calculados una sola vez (sin azar: hidratación estable). */
const zigBottom = (teeth: number) => {
    const pts: string[] = ["0% 0%", "100% 0%"];
    for (let i = teeth; i > 0; i -= 1) {
        pts.push(`${(((i - 0.5) / teeth) * 100).toFixed(3)}% 100%`);
        pts.push(`${(((i - 1) / teeth) * 100).toFixed(3)}% 0%`);
    }
    return `polygon(${pts.join(",")})`;
};

const zigTop = (teeth: number) => {
    const pts: string[] = [];
    for (let i = 0; i < teeth; i += 1) {
        pts.push(`${((i / teeth) * 100).toFixed(3)}% 100%`);
        pts.push(`${(((i + 0.5) / teeth) * 100).toFixed(3)}% 0%`);
    }
    pts.push("100% 100%");
    return `polygon(${pts.join(",")})`;
};

const ZIG_BOTTOM = zigBottom(30);
const ZIG_TOP = zigTop(30);

/* Operadores que aparecen en el catálogo de servicios (mockups). */
const OPERATORS: { name: string; kind: string; color: string; tint: string }[] = [
    { name: "CANTV", kind: "POSPAGO", color: "#0B4F9E", tint: "#E8F0FB" },
    { name: "MOVISTAR", kind: "PREPAGO", color: "#019DF4", tint: "#E6F6FE" },
    { name: "CORPOELEC", kind: "POSPAGO", color: "#1D71B8", tint: "#E9F1FA" },
    { name: "DIGITEL", kind: "PREPAGO", color: "#E4002B", tint: "#FDEAED" },
    { name: "SIMPLETV", kind: "POSPAGO", color: "#5B2D8E", tint: "#F0EAF8" },
    { name: "MOVILNET", kind: "PREPAGO", color: "#00843D", tint: "#E6F3EC" },
];

/* Campos del voucher tal como los muestra la pantalla de recibo. */
const VOUCHER: [string, string][] = [
    ["Nro:", "0000004871"],
    ["Fecha:", "07/03/2025 11:42"],
    ["Operador:", "caja01@laesquina.com"],
    ["Empresa:", "CANTV"],
    ["Servicio:", "CANTV POSPAGO"],
    ["Cuenta:", "02123456789"],
    ["Monto:", "1.234,56 bs"],
    ["Nro. aprobación:", "884213"],
];

/* Ambientes que combinan con cada marca para dar los seis puntos de entrada. */
const ENVS = [
    { file: "main_dev.dart", env: "env.demo", note: "desarrollo" },
    { file: "main_demo.dart", env: "env.qa", note: "QA / demo" },
    { file: "main_prod.dart", env: "env.prod", note: "producción" },
];

/* Movimientos del reporte de inventario. */
const MOVEMENTS: { date: string; type: string; desc: string; in?: string; out?: string; balance: string }[] = [
    { date: "07/03 11:42", type: "SALIDA", desc: "CANTV POSPAGO · 02123456789", out: "1", balance: "1.250" },
    { date: "07/03 10:15", type: "SALIDA", desc: "MOVISTAR PREPAGO · 0414-8624450", out: "1", balance: "1.251" },
    { date: "06/03 17:02", type: "ENTRADA", desc: "Compra de inventario · C2P Bancaribe", in: "500", balance: "1.252" },
    { date: "06/03 09:38", type: "SALIDA", desc: "CORPOELEC POSPAGO · 30014482", out: "1", balance: "752" },
    { date: "05/03 16:20", type: "ENTRADA", desc: "Compra de inventario · Pago Móvil", in: "250", balance: "753" },
];

const css = `
.sp-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Courier New", monospace;
  font-variant-ligatures: none;
}
.sp-paper { background: ${PAPER}; }
.sp-dots {
  flex: 1 1 auto;
  min-width: 10px;
  border-bottom: 1px dotted currentColor;
  opacity: .42;
  transform: translateY(-4px);
}
.sp-scan {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  z-index: 6;
  pointer-events: none;
  background: var(--sp-pri, ${BLUE});
  animation: sp-scan 1.5s cubic-bezier(.36,.06,.2,1) 1 both;
}
@keyframes sp-scan {
  0% { top: 0; opacity: .95; }
  88% { opacity: .5; }
  100% { top: 100%; opacity: 0; }
}
.sp-caret {
  display: inline-block;
  width: .58em;
  height: 1.02em;
  vertical-align: -.14em;
  background: var(--sp-acc, ${YELLOW});
  animation: sp-blink 1s steps(1) infinite;
}
@keyframes sp-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
.sp-card { position: relative; overflow: hidden; background: ${PAPER}; }
.sp-card::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 3px;
  background: var(--sp-stripe, ${BLUE});
  opacity: .22;
}
.sp-card::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 3px;
  background: var(--sp-stripe, ${BLUE});
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform .22s linear;
}
.sp-card:hover::after { transform: scaleX(1); }
.sp-barcode {
  background-image: repeating-linear-gradient(
    90deg,
    #ffffff 0 2px, transparent 2px 4px,
    #ffffff 4px 5px, transparent 5px 9px,
    #ffffff 9px 12px, transparent 12px 13px,
    #ffffff 13px 14px, transparent 14px 18px
  );
}
.sp-thermal {
  background:
    repeating-linear-gradient(0deg, rgba(0,0,0,.045) 0 1px, transparent 1px 3px),
    ${PAPER};
}
.sp-drop { animation: sp-drop .85s cubic-bezier(.22,1.4,.36,1) 1 both; }
@keyframes sp-drop {
  0% { transform: translateY(0); }
  55% { transform: translateY(16px); }
  100% { transform: translateY(12px); }
}
.sp-slot {
  background: linear-gradient(180deg, #2A2E33 0%, #16191D 60%, #0E1013 100%);
}
.sp-toggle-knob { box-shadow: 0 1px 3px rgba(0,0,0,.28); }
.sp-tint {
  transition: background-color .4s ease, color .4s ease, border-color .4s ease, box-shadow .4s ease;
}
.sp-feed-line { animation: sp-feed 1.6s linear infinite; }
@keyframes sp-feed {
  0% { background-position: 0 0; }
  100% { background-position: 0 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .sp-scan, .sp-caret, .sp-drop, .sp-feed-line { animation: none !important; }
  .sp-scan { display: none; }
}
`;

/* ──────────────────────────────── Piezas del ticket ──────────────────────────────── */

/** Una línea que “se imprime”: entra desde arriba con el desenfoque del arrastre del papel. */
const PrintLine = ({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(1.1px)" }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.2 : 0.34, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

/** Rollo de papel: fondo blanco, sombra corta y dura, dentado arriba/abajo y cabezal térmico. */
const Ticket = ({
    children,
    className,
    top = false,
    bottom = true,
    scan = true,
    drop = false,
}: {
    children: React.ReactNode;
    className?: string;
    top?: boolean;
    bottom?: boolean;
    scan?: boolean;
    drop?: boolean;
}) => {
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.15);

    return (
        <div ref={ref} className={`relative ${drop && inView ? "sp-drop" : ""} ${className ?? ""}`}>
            {top && (
                <div
                    aria-hidden
                    className="sp-paper h-[9px] w-full"
                    style={{ clipPath: ZIG_TOP, WebkitClipPath: ZIG_TOP } as CSSProperties}
                />
            )}
            <div
                className="sp-paper relative overflow-hidden"
                style={{ boxShadow: `9px 9px 0 rgba(53,53,53,0.07), 0 1px 0 ${LINE}` }}
            >
                {scan && inView && <span aria-hidden className="sp-scan" />}
                {children}
            </div>
            {bottom && (
                <div
                    aria-hidden
                    className="sp-paper h-[9px] w-full"
                    style={{
                        clipPath: ZIG_BOTTOM,
                        WebkitClipPath: ZIG_BOTTOM,
                        filter: "drop-shadow(9px 6px 0 rgba(53,53,53,0.07))",
                    } as CSSProperties}
                />
            )}
        </div>
    );
};

/** Par etiqueta/valor con puntos suspensivos, como en el voucher impreso. */
const Leader = ({
    label,
    value,
    strong = false,
    className,
}: {
    label: string;
    value: string;
    strong?: boolean;
    className?: string;
}) => (
    <div className={`sp-mono flex items-baseline gap-1.5 text-[12px] leading-6 ${className ?? ""}`}>
        <span className="font-bold uppercase shrink-0">{label}</span>
        <span aria-hidden className="sp-dots" />
        <span className={`shrink-0 text-right ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
);

/** Etiqueta arriba, valor largo debajo: para roles y estados que no caben en una línea. */
const StackedLeader = ({ label, value }: { label: string; value: string }) => (
    <div className="sp-mono text-[12px] leading-6">
        <div className="flex items-baseline gap-1.5">
            <span className="font-bold uppercase shrink-0">{label}</span>
            <span aria-hidden className="sp-dots" />
        </div>
        <p className="pl-3 text-[11.5px] leading-5" style={{ color: MUTE }}>
            {value}
        </p>
    </div>
);

/** Línea de corte entre recibos, con su tijera. */
const CutLine = ({ label }: { label?: string }) => (
    <div className="relative flex items-center max-w-5xl gap-3 px-4 mx-auto md:px-6" style={{ color: MUTE }}>
        <Scissors size={15} className="rotate-90 shrink-0" />
        <span className="flex-1 border-t border-dashed" style={{ borderColor: "rgba(53,53,53,0.3)" }} />
        {label && (
            <span className="sp-mono text-[10px] uppercase tracking-[0.28em] shrink-0">{label}</span>
        )}
    </div>
);

/** Cabecera de sección con el rótulo compacto en mayúsculas de la app. */
const Rule = ({ children }: { children: React.ReactNode }) => (
    <p className="sp-mono text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--sp-pri)" }}>
        {children}
    </p>
);

/** Máquina de escribir por caracteres, con cursor de bloque. */
const Typed = ({
    text,
    className,
    speed = 34,
    start = 0,
    caret = false,
}: {
    text: string;
    className?: string;
    speed?: number;
    start?: number;
    caret?: boolean;
}) => {
    const [shown, setShown] = useState("");
    const reduce = useReducedMotion();

    useEffect(() => {
        if (reduce) {
            setShown(text);
            return;
        }
        let i = 0;
        let interval = 0;
        const timeout = window.setTimeout(() => {
            interval = window.setInterval(() => {
                i += 1;
                setShown(text.slice(0, i));
                if (i >= text.length) window.clearInterval(interval);
            }, speed);
        }, start);
        return () => {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
        };
    }, [text, speed, start, reduce]);

    return (
        <span className={className}>
            {shown}
            {caret && shown.length < text.length && <span className="sp-caret" />}
        </span>
    );
};

/* ───────────────────────── Mockups de la app (HTML/CSS) ───────────────────────── */

const AppBar = ({ title, t, exit = true }: { title: string; t: Theme; exit?: boolean }) => (
    <div
        className="sp-tint relative flex items-center h-9 px-2 shrink-0"
        style={{ background: t.primary }}
    >
        <span className="flex-1 text-center text-[10.5px] font-semibold tracking-[0.12em] text-white truncate px-5">
            {title}
        </span>
        {exit && <LogOut size={14} className="absolute text-white right-2" />}
    </div>
);

const BottomNav = ({ t, active }: { t: Theme; active: 0 | 1 | 2 }) => {
    const items = [
        { label: "Inicio", Icon: Home },
        { label: "Inventario", Icon: Store },
        { label: "Ayuda", Icon: HelpCircle },
    ];
    return (
        <div
            className="sp-tint flex items-end justify-around h-[42px] px-1 pb-1 shrink-0"
            style={{ background: t.primary }}
        >
            {items.map((item, i) => (
                <span key={item.label} className="flex flex-col items-center gap-0.5 py-1">
                    <span
                        className="sp-tint inline-grid h-[18px] w-9 place-items-center rounded-full"
                        style={{ background: i === active ? t.accent : "transparent" }}
                    >
                        <item.Icon size={11} color={i === active ? INK : "rgba(255,255,255,0.85)"} />
                    </span>
                    <span
                        className="text-[7.5px]"
                        style={{ color: i === active ? "#FFFFFF" : "rgba(255,255,255,0.7)" }}
                    >
                        {item.label}
                    </span>
                </span>
            ))}
        </div>
    );
};

const Field = ({
    label,
    value,
    icon,
    t,
}: {
    label: string;
    value?: string;
    icon?: React.ReactNode;
    t: Theme;
}) => (
    <div className="relative">
        <span
            className="absolute -top-[6px] left-2 bg-white px-1 text-[7.5px]"
            style={{ color: value ? t.primary : MUTE }}
        >
            {label}
        </span>
        <div
            className="flex items-center justify-between rounded-[5px] border px-2 py-[7px]"
            style={{ borderColor: value ? t.primary : "#B9BDC4" }}
        >
            <span className="text-[10px]" style={{ color: value ? INK : "#B9BDC4" }}>
                {value ?? label}
            </span>
            {icon}
        </div>
    </div>
);

/** 01 · Inicio de sesión */
const MockLogin = ({ t }: { t: Theme }) => (
    <div className="flex flex-col h-full px-4 pt-6 pb-4 bg-white" style={{ color: INK }}>
        <div className="flex justify-center">
            <Image src={t.logo} alt={t.label} width={280} height={120} className="object-contain w-auto h-9" />
        </div>
        <p className="mt-3 text-[12px] font-light text-center">Pago de servicios</p>
        <div className="flex items-center justify-center gap-1 mt-1">
            <span className="sp-tint text-[10px] font-bold" style={{ color: t.primary }}>
                v1.0.7 (63)
            </span>
            <RefreshCw size={10} color={t.primary} />
        </div>

        <div className="flex items-center gap-2 mt-5">
            <span
                className="sp-tint relative inline-flex h-[19px] w-[34px] items-center rounded-full px-[2px]"
                style={{ background: "#D7DAE0" }}
            >
                <span
                    className="sp-toggle-knob sp-tint h-[15px] w-[15px] rounded-full"
                    style={{ background: t.primary, transform: "translateX(0px)" }}
                />
            </span>
            <span className="text-[9.5px]" style={{ color: MUTE }}>
                Iniciar con RIF/Cédula
            </span>
        </div>

        <div className="mt-5 space-y-4">
            <Field label="RIF/CI" value="J-403399646" t={t} />
            <Field
                label="Contraseña"
                value="••••••••"
                t={t}
                icon={<Eye size={12} color={MUTE} />}
            />
        </div>

        <div className="flex items-center gap-2 mt-5">
            <span
                className="sp-tint flex-1 rounded-[10px] py-[9px] text-center text-[10.5px] font-semibold text-white"
                style={{ background: t.primary }}
            >
                INICIAR SESIÓN
            </span>
            <span
                className="sp-tint grid h-[32px] w-[32px] place-items-center rounded-[10px]"
                style={{ background: t.primary }}
            >
                <Fingerprint size={16} color="#FFFFFF" />
            </span>
        </div>

        <p className="mt-4 text-[8.5px] text-center leading-4" style={{ color: MUTE }}>
            ¿Olvidaste tu contraseña? · Registrarme
        </p>

        <div className="mt-auto pt-4 text-center text-[8px] leading-4" style={{ color: MUTE }}>
            <p className="underline">Política de seguridad</p>
            <p className="underline">Términos y condiciones</p>
        </div>
    </div>
);

/** 02 · Servicios disponibles */
const MockServices = ({ t }: { t: Theme }) => (
    <div className="flex flex-col h-full bg-white" style={{ color: INK }}>
        <AppBar title="SERVICIOS DISPONIBLES" t={t} />

        <div className="flex-1 px-2 pt-2 overflow-hidden">
            <div
                className="flex items-center gap-2 px-2 py-2 rounded-[5px]"
                style={{ background: GRAY, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
            >
                <div className="flex-1 min-w-0">
                    <p className="text-[9.5px] font-bold truncate">COMERCIAL LA ESQUINA, C.A</p>
                    <p className="text-[8px] truncate" style={{ color: MUTE }}>
                        caja01@laesquina.com
                    </p>
                    <p className="text-[8px]" style={{ color: INK }}>
                        J-40339964-6
                    </p>
                </div>
                <Image src={t.mark} alt={t.label} width={120} height={120} className="object-contain w-auto h-8" />
            </div>

            <div className="flex items-center justify-between px-1 mt-2 mb-1.5">
                <span className="text-[9px]">SERVICIOS DISPONIBLES</span>
                <RefreshCw size={10} color={t.primary} />
            </div>

            <div className="grid grid-cols-2 gap-[7px]">
                {OPERATORS.map((op) => (
                    <div
                        key={op.name}
                        className="rounded-[5px] bg-white px-1 py-2 text-center"
                        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.16)" }}
                    >
                        <span
                            className="inline-flex items-center justify-center w-full rounded-[3px] py-2 text-[9px] font-black tracking-[0.06em]"
                            style={{ background: op.tint, color: op.color }}
                        >
                            {op.name}
                        </span>
                        <p className="mt-1.5 text-[8px] font-bold" style={{ color: "#4A4F57" }}>
                            {op.name} {op.kind}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        <BottomNav t={t} active={0} />
    </div>
);

/** 03 · Cobro pospago */
const MockPospago = ({ t }: { t: Theme }) => (
    <div className="flex flex-col h-full bg-white" style={{ color: INK }}>
        <AppBar title="CANTV" t={t} />

        <div className="flex-1 px-3 pt-3 overflow-hidden">
            <div className="flex justify-center">
                <span
                    className="inline-flex items-center justify-center rounded-[4px] px-6 py-2.5 text-[13px] font-black tracking-[0.08em]"
                    style={{ background: "#E8F0FB", color: "#0B4F9E" }}
                >
                    CANTV
                </span>
            </div>

            <p className="mt-2 text-[8px] leading-[13px] text-center" style={{ color: RED }}>
                El servicio no es anulable, por favor verifique el número de cuenta a pagar ya que el pago no puede ser
                reversado
            </p>
            <div className="my-2 border-t" style={{ borderColor: LINE }} />

            <div className="flex gap-2">
                <div
                    className="flex items-center gap-1 rounded-[5px] border px-2 py-[7px]"
                    style={{ borderColor: "#B9BDC4" }}
                >
                    <span className="text-[10px] font-semibold">J</span>
                    <Icons.ChevronDown size={10} color={MUTE} />
                </div>
                <div className="flex-1">
                    <Field label="RIF/CI" value="403399646" t={t} icon={<Search size={12} color={t.primary} />} />
                </div>
            </div>

            <div className="mt-4">
                <Field
                    label="Número de contrato"
                    value="02123456789"
                    t={t}
                    icon={<Search size={12} color={t.primary} />}
                />
            </div>

            <div className="mt-3 space-y-1.5">
                {[
                    { label: "Deuda vencida:", amount: "1.234,56 Bs", on: true },
                    { label: "Deuda actual:", amount: "987,00 Bs", on: false },
                ].map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center gap-2 rounded-[5px] px-2 py-2"
                        style={{ background: row.on ? "rgba(12,124,236,0.06)" : "transparent" }}
                    >
                        <span
                            className="sp-tint grid h-[13px] w-[13px] place-items-center rounded-full border-2"
                            style={{ borderColor: row.on ? t.primary : "#B9BDC4" }}
                        >
                            {row.on && (
                                <span
                                    className="sp-tint h-[6px] w-[6px] rounded-full"
                                    style={{ background: t.primary }}
                                />
                            )}
                        </span>
                        <span className="text-[9.5px] flex-1">{row.label}</span>
                        <span className="text-[10px] font-bold">{row.amount}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex gap-2 px-3 pb-3">
            <span
                className="flex items-center justify-center flex-1 gap-1 rounded-[5px] py-2 text-[9.5px] font-semibold text-white"
                style={{ background: "#9AA0A8" }}
            >
                <Trash2 size={11} /> LIMPIAR
            </span>
            <span
                className="sp-tint flex flex-1 items-center justify-center gap-1 rounded-[5px] py-2 text-[9.5px] font-semibold text-white"
                style={{ background: t.primary }}
            >
                <CreditCard size={11} /> PAGAR
            </span>
        </div>
    </div>
);

/** 04 · Inventario */
const MockInventario = ({ t }: { t: Theme }) => (
    <div className="flex flex-col h-full bg-white" style={{ color: INK }}>
        <AppBar title="INVENTARIO" t={t} />

        <div className="flex-1 px-3 pt-2 overflow-hidden">
            <div className="flex items-center justify-end gap-1">
                <RefreshCw size={10} color={t.primary} />
                <span className="sp-tint text-[9.5px] font-bold" style={{ color: t.primary }}>
                    Actualizar
                </span>
            </div>

            <div className="mt-5 text-center">
                <p className="text-[11.5px] font-bold">INVENTARIO DISPONIBLE</p>
                <p className="text-[8px]" style={{ color: MUTE }}>
                    (Prepago)
                </p>
                <p className="sp-tint mt-1 text-[19px] font-bold" style={{ color: t.primary }}>
                    1.250 unid.
                </p>
                <span
                    className="sp-tint mt-0.5 inline-flex items-center gap-1 text-[9px]"
                    style={{ color: t.primary }}
                >
                    Ver detalles <ArrowRight size={9} />
                </span>
            </div>

            <div className="pt-4 mt-4 text-center border-t" style={{ borderColor: LINE }}>
                <p className="text-[11.5px] font-bold">INVENTARIO EN CONSIGNACIÓN</p>
                <p className="text-[8px]" style={{ color: MUTE }}>
                    (Pospago)
                </p>
                <div className="flex justify-around mt-2">
                    <span className="block">
                        <span className="block text-[7.5px]" style={{ color: MUTE }}>
                            Cantidad límite
                        </span>
                        <span className="text-[15px] font-bold">500</span>
                    </span>
                    <span className="block">
                        <span className="block text-[7.5px]" style={{ color: MUTE }}>
                            Disponibles
                        </span>
                        <span className="text-[15px] font-bold">320</span>
                    </span>
                </div>
            </div>
        </div>

        <div className="px-3 pb-2 space-y-1.5">
            <span
                className="sp-tint flex items-center justify-center gap-1.5 rounded-[5px] py-2 text-[10px] font-semibold text-white"
                style={{ background: t.primary }}
            >
                <CreditCard size={12} /> COMPRA
            </span>
            <span
                className="sp-tint flex items-center justify-center gap-1.5 rounded-[5px] py-2 text-[10px] font-semibold"
                style={{ background: t.accent, color: INK }}
            >
                <Icons.Smartphone size={12} /> RETIRO
            </span>
        </div>

        <BottomNav t={t} active={1} />
    </div>
);

/** Terminal POS dibujado en CSS: ranura de papel arriba y el mockup dentro del marco. */
const PosTerminal = ({
    screen,
    caption,
    children,
    delay = 0,
}: {
    screen: string;
    caption: string;
    children: React.ReactNode;
    delay?: number;
}) => (
    <Reveal delay={delay} className="w-full max-w-[280px] mx-auto">
        <div className="relative">
            <div className="sp-slot relative mx-auto h-[26px] w-[90%] rounded-t-[14px] border border-black/50">
                <span className="absolute inset-x-4 top-[9px] h-[3px] rounded-full bg-black/70" />
                <span className="absolute right-3 top-[6px] h-[9px] w-[9px] rounded-full" style={{ background: "#52FF8F" }} />
                <span className="sp-mono absolute left-3 top-[5px] text-[7px] uppercase tracking-[0.2em] text-white/45">
                    80 mm
                </span>
            </div>

            <PhoneFrame glow={false} notch={false} className="-mt-[10px]">
                {children}
            </PhoneFrame>

            <div className="relative z-10 mx-auto -mt-4 w-[86%]">
                <div
                    className="sp-paper sp-mono px-3 py-2 text-[9px] leading-4"
                    style={{ color: INK, boxShadow: "6px 6px 0 rgba(53,53,53,0.08)" }}
                >
                    <p className="font-bold uppercase tracking-[0.1em]">{screen}</p>
                    <p className="mt-0.5" style={{ color: MUTE }}>
                        {caption}
                    </p>
                </div>
                <div
                    aria-hidden
                    className="sp-paper h-[8px] w-full"
                    style={{
                        clipPath: ZIG_BOTTOM,
                        WebkitClipPath: ZIG_BOTTOM,
                        filter: "drop-shadow(6px 5px 0 rgba(53,53,53,0.08))",
                    } as CSSProperties}
                />
            </div>
        </div>
    </Reveal>
);

/** El AnimatedToggleSwitch del login, aquí conmutando la marca de toda la página. */
const BrandToggle = ({
    brandKey,
    onChange,
    t,
    compact = false,
}: {
    brandKey: "pt" | "sunmi";
    onChange: (key: "pt" | "sunmi") => void;
    t: Theme;
    compact?: boolean;
}) => {
    const reduce = useReducedMotion();
    return (
        <div className="inline-flex flex-wrap items-center justify-center gap-3">
            <span
                className={`sp-mono text-[10px] uppercase tracking-[0.18em] transition-opacity ${
                    brandKey === "pt" ? "opacity-100 font-bold" : "opacity-45"
                }`}
                style={{ color: INK }}
            >
                PagueTodo
            </span>
            <button
                type="button"
                aria-label={`Cambiar a ${brandKey === "pt" ? "sunmi-theme" : "pt-theme"}`}
                onClick={() => onChange(brandKey === "pt" ? "sunmi" : "pt")}
                className="sp-tint relative inline-flex h-[35px] w-[60px] shrink-0 items-center rounded-full px-[3px]"
                style={{ background: "#D7DAE0", border: `1px solid ${LINE}` }}
            >
                <motion.span
                    className="sp-toggle-knob h-[27px] w-[27px] rounded-full"
                    style={{ background: t.primary }}
                    animate={{ x: brandKey === "pt" ? 0 : 27 }}
                    transition={
                        reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 28 }
                    }
                />
            </button>
            <span
                className={`sp-mono text-[10px] uppercase tracking-[0.18em] transition-opacity ${
                    brandKey === "sunmi" ? "opacity-100 font-bold" : "opacity-45"
                }`}
                style={{ color: INK }}
            >
                Sunmi
            </span>
            {!compact && (
                <span className="sp-mono hidden text-[10px] sm:inline" style={{ color: MUTE }}>
                    themes.json → {t.file}
                </span>
            )}
        </div>
    );
};

/* ─────────────────────────────────── Landing ─────────────────────────────────── */

const Landing = () => {
    const [brandKey, setBrandKey] = useState<"pt" | "sunmi">("pt");
    const t = THEMES[brandKey];
    const reduce = useReducedMotion();
    const methodShots = p.media.filter((m) =>
        ["pm.png", "c2p.png", "tdd.png", "transfer.png"].some((f) => m.src.endsWith(f))
    );
    const helpShots = p.media.filter((m) => ["tutorials.png", "questions.png"].some((f) => m.src.endsWith(f)));
    const brandAssets = p.media.filter((m) => m.kind === "logo" || m.kind === "icon");

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            <div style={themeVars(t)} className="relative">
                <span
                    aria-hidden
                    className="fixed inset-0 pointer-events-none noise-layer opacity-[0.035] z-[1]"
                />

                {/* ═══════════════════════════ HERO ═══════════════════════════ */}
                <section className="relative pt-24" style={{ color: INK }}>
                    {/* AppBar de la app, citado literal */}
                    <div
                        className="sp-tint relative flex items-center justify-center h-14 px-4"
                        style={{ background: t.primary }}
                    >
                        <span className="text-[13px] font-semibold uppercase tracking-[0.36em] text-white md:text-[15px]">
                            ServicePay POS
                        </span>
                        <LogOut size={22} className="absolute text-white right-4 md:right-8" />
                    </div>

                    <div className="px-4 pt-10 pb-16 md:px-6 md:pt-14">
                        <div className="flex justify-center mb-8">
                            <BrandToggle brandKey={brandKey} onChange={setBrandKey} t={t} />
                        </div>

                        <Ticket className="mx-auto w-full max-w-[420px]" top scan>
                            <div className="px-6 py-7 sp-mono" style={{ color: INK }}>
                                <div className="flex justify-center h-12">
                                    <motion.div
                                        key={t.key}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: reduce ? 0 : 0.4 }}
                                        className="flex items-center"
                                    >
                                        <Image
                                            src={t.logo}
                                            alt={`${t.label} — ${t.file}`}
                                            width={280}
                                            height={120}
                                            priority
                                            className="object-contain w-auto h-12"
                                        />
                                    </motion.div>
                                </div>

                                <p className="mt-4 text-[12px] font-bold text-center">SERVICIOS PAGUETODO, C.A</p>
                                <p className="text-[11px] text-center" style={{ color: MUTE }}>
                                    RIF: J-40339964-6
                                </p>

                                <p className="mt-3 overflow-hidden text-[12px] leading-4 whitespace-nowrap" style={{ color: "#B9BDC4" }}>
                                    {"-".repeat(80)}
                                </p>

                                <p className="mt-3 text-[13px] font-bold text-center tracking-[0.14em]">
                                    <Typed text="SERVICIOS DISPONIBLES" speed={28} start={280} caret />
                                </p>

                                <h1 className="mt-5 text-3xl font-black leading-tight text-center md:text-4xl">
                                    {p.name}
                                </h1>

                                <p className="mt-4 text-[12.5px] leading-[22px] text-center" style={{ color: "#54585F" }}>
                                    {p.tagline}
                                </p>

                                <p className="mt-4 overflow-hidden text-[12px] leading-4 whitespace-nowrap" style={{ color: "#B9BDC4" }}>
                                    {"-".repeat(80)}
                                </p>

                                <div className="mt-4 space-y-0.5">
                                    <Leader label="Categoría" value={p.category} />
                                    <Leader label="Año" value={p.year} />
                                    <StackedLeader label="Rol" value={p.role} />
                                    <StackedLeader label="Estado" value={p.status} />
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 mt-6">
                                    {p.links.demo && (
                                        <BrandButton href={p.links.demo}>
                                            <Play size={15} /> Ver la app en video
                                        </BrandButton>
                                    )}
                                    {p.links.github && (
                                        <a
                                            href={p.links.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors border rounded-full"
                                            style={{ borderColor: "rgba(53,53,53,0.28)", color: INK }}
                                        >
                                            <Github size={15} /> Ver el código
                                        </a>
                                    )}
                                </div>

                                <p className="mt-6 text-[10.5px] text-center uppercase tracking-[0.2em]" style={{ color: "#B9BDC4" }}>
                                    * * * gracias por su compra * * *
                                </p>
                            </div>
                        </Ticket>

                        <p className="sp-mono mt-8 text-center text-[10.5px] uppercase tracking-[0.24em]" style={{ color: MUTE }}>
                            com.paguetodo.servicepay.pos · {t.entry}
                        </p>
                    </div>
                </section>

                <CutLine label="01 · el mostrador" />

                {/* ═══════════════════ PROBLEMA / SOLUCIÓN ═══════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-5xl mx-auto">
                        <SectionHead
                            index="01 / El mostrador"
                            title={
                                <>
                                    Antes se anotaba a mano.{" "}
                                    <span className="brand-gradient-text">Ahora sale impreso.</span>
                                </>
                            }
                            lead="El mismo comercio, la misma venta, dos comprobantes muy distintos."
                        />

                        <div className="grid gap-8 mt-12 md:grid-cols-2 md:gap-6">
                            <Reveal direction="right">
                                <Ticket top scan={false} className="relative">
                                    <div className="sp-mono px-5 py-6 text-[12px] leading-5" style={{ color: INK }}>
                                        <p className="font-bold text-center tracking-[0.16em]">COMPROBANTE MANUAL</p>
                                        <p className="mt-1 text-center text-[11px]" style={{ color: MUTE }}>
                                            escrito a mano · sin número
                                        </p>
                                        <p className="mt-3 overflow-hidden whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                            {"-".repeat(60)}
                                        </p>
                                        <p className="mt-4 leading-[22px]" style={{ color: "#54585F" }}>
                                            {p.problem}
                                        </p>
                                        <div className="mt-6 space-y-0.5" style={{ color: "#8A8F97" }}>
                                            <Leader label="Nro." value="—" />
                                            <Leader label="Aprobación" value="—" />
                                            <Leader label="Inventario" value="?" />
                                            <Leader label="Estatus" value="SIN VERIFICAR" />
                                        </div>
                                        <span
                                            className="absolute right-4 top-1/2 inline-block rotate-[-14deg] rounded border-[3px] px-3 py-1 text-[13px] font-black tracking-[0.18em]"
                                            style={{ borderColor: RED, color: RED, opacity: 0.85 }}
                                        >
                                            ANULADO
                                        </span>
                                    </div>
                                </Ticket>
                            </Reveal>

                            <Reveal direction="left" delay={0.1}>
                                <Ticket top>
                                    <div className="sp-mono px-5 py-6 text-[12px] leading-5" style={{ color: INK }}>
                                        <p className="font-bold text-center tracking-[0.16em]">RECIBO DE COMPRA</p>
                                        <p className="mt-1 text-center text-[11px]" style={{ color: MUTE }}>
                                            impreso en la térmica del terminal
                                        </p>
                                        <p className="mt-3 overflow-hidden whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                            {"-".repeat(60)}
                                        </p>
                                        <p className="mt-4 leading-[22px]" style={{ color: "#54585F" }}>
                                            {p.solution}
                                        </p>
                                        <div className="mt-6 space-y-0.5">
                                            <Leader label="Nro." value="0000004871" />
                                            <Leader label="Aprobación" value="884213" />
                                            <Leader label="Inventario" value="1.250 unid." />
                                            <Leader label="Estatus" value="APROBADO" strong />
                                        </div>
                                        <p
                                            className="mt-5 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                                            style={{ background: GREEN }}
                                        >
                                            Operación conforme
                                        </p>
                                    </div>
                                </Ticket>
                            </Reveal>
                        </div>
                    </div>
                </section>

                <CutLine label="02 · lo que sostiene la caja" />

                {/* ═══════════════════════ HIGHLIGHTS ═══════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-6xl mx-auto">
                        <Rule>Destacados</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Cinco piezas que hacen que el terminal{" "}
                            <span className="brand-gradient-text">cobre solo</span>
                        </h2>

                        <Stagger className="grid gap-4 mt-10 md:grid-cols-2 lg:grid-cols-3">
                            {p.highlights.map((h, i) => {
                                const Icon = iconOf(h.icon);
                                const stripe = i % 2 === 0 ? t.primary : t.accent;
                                return (
                                    <StaggerItem key={h.title} className="h-full">
                                        <div
                                            className="sp-card sp-tint h-full p-5 pt-6"
                                            style={
                                                {
                                                    "--sp-stripe": stripe,
                                                    boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 10px 24px -18px rgba(53,53,53,0.5)",
                                                } as CSSProperties
                                            }
                                        >
                                            <span
                                                className="sp-tint inline-grid rounded-[6px] h-9 w-9 place-items-center"
                                                style={{ background: `${stripe}1F`, color: i % 2 === 0 ? t.primary : "#8A7500" }}
                                            >
                                                <Icon size={17} />
                                            </span>
                                            <h3 className="mt-4 text-[15px] font-bold leading-snug">{h.title}</h3>
                                            <p className="mt-2 text-[13px] leading-[21px]" style={{ color: "#5C616A" }}>
                                                {h.description}
                                            </p>
                                            <p className="sp-mono mt-4 text-[10px] uppercase tracking-[0.2em]" style={{ color: "#B9BDC4" }}>
                                                {String(i + 1).padStart(2, "0")} / {String(p.highlights.length).padStart(2, "0")}
                                            </p>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </Stagger>
                    </div>
                </section>

                <CutLine label="03 · las pantallas" />

                {/* ═════════════════════════ MOCKUPS ═════════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-6xl mx-auto">
                        <Rule>Interfaz</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Cuatro pantallas del terminal,{" "}
                            <span className="brand-gradient-text">recreadas tal cual</span>
                        </h2>
                        <p className="max-w-2xl mt-4 text-[15px] leading-relaxed" style={{ color: "#5C616A" }}>
                            Mueve el interruptor de arriba y las cuatro cambian de marca a la vez: es lo mismo que hace
                            <span className="sp-mono"> ThemeProvider</span> al arrancar la app.
                        </p>

                        <div className="grid gap-10 mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                            <PosTerminal
                                screen={p.uiScreens[0].name}
                                caption="Toggle RIF/correo, versión de la app y huella para volver a entrar."
                            >
                                <MockLogin t={t} />
                            </PosTerminal>
                            <PosTerminal
                                delay={0.08}
                                screen={p.uiScreens[1].name}
                                caption="Catálogo del backend en cuadrícula y barra inferior de tres destinos."
                            >
                                <MockServices t={t} />
                            </PosTerminal>
                            <PosTerminal
                                delay={0.16}
                                screen={p.uiScreens[2].name}
                                caption="Consulta de deuda por contrato y aviso de servicio no anulable."
                            >
                                <MockPospago t={t} />
                            </PosTerminal>
                            <PosTerminal
                                delay={0.24}
                                screen={p.uiScreens[4].name}
                                caption="Saldo disponible, consignación y el botón de compra de inventario."
                            >
                                <MockInventario t={t} />
                            </PosTerminal>
                        </div>
                    </div>
                </section>

                <CutLine label="04 · el recibo" />

                {/* ═══════════════════ RECIBO + IMPRESIÓN NATIVA ═══════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-6xl mx-auto">
                        <Rule>Del voucher al papel</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            La misma información,{" "}
                            <span className="brand-gradient-text">dos veces</span>
                        </h2>
                        <p className="max-w-2xl mt-4 text-[15px] leading-relaxed" style={{ color: "#5C616A" }}>
                            {p.uiScreens[3].name}: primero se dibuja en pantalla y después sale por la ranura. En medio hay
                            un canal nativo y quince campos que viajan uno por uno.
                        </p>

                        <div className="grid gap-8 mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
                            {/* El voucher en pantalla */}
                            <Reveal>
                                <Ticket top className="mx-auto w-full max-w-[380px]">
                                    <div className="sp-mono px-6 py-6" style={{ color: INK }}>
                                        <div className="flex justify-center">
                                            <span
                                                className="inline-flex items-center justify-center rounded-[4px] px-8 py-3 text-[15px] font-black tracking-[0.1em]"
                                                style={{ background: "#E8F0FB", color: "#0B4F9E" }}
                                            >
                                                CANTV
                                            </span>
                                        </div>
                                        <p className="mt-4 text-[13px] font-bold text-center">SERVICIOS PAGUETODO, C.A</p>
                                        <p className="text-[12px] text-center">RIF: J-40339964-6</p>
                                        <p className="mt-3 text-[12px] font-bold text-center tracking-[0.12em]">
                                            RECIBO DE COMPRA
                                        </p>
                                        <p className="mt-2 overflow-hidden text-[12px] whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                            {"-".repeat(60)}
                                        </p>

                                        <div className="mt-3 space-y-1.5 text-[12px] leading-5">
                                            {VOUCHER.map(([k, v], i) => (
                                                <PrintLine key={k} delay={i * 0.09}>
                                                    <p>
                                                        <span className="font-bold">{k} </span>
                                                        <span>{v}</span>
                                                    </p>
                                                </PrintLine>
                                            ))}
                                        </div>

                                        <p className="mt-3 overflow-hidden text-[12px] whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                            {"-".repeat(60)}
                                        </p>
                                        <PrintLine delay={0.8}>
                                            <p className="mt-2 text-[13px]">
                                                <span className="font-bold">Total a pagar: </span>1.234,56 bs
                                            </p>
                                            <p className="text-[13px]">
                                                <span className="font-bold">Estatus: </span>
                                                <span className="font-bold" style={{ color: GREEN }}>
                                                    APROBADO
                                                </span>
                                            </p>
                                        </PrintLine>

                                        <div
                                            className="mt-5 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                                            style={{ background: "#9AA0A8" }}
                                        >
                                            Cerrar
                                        </div>
                                    </div>
                                </Ticket>
                            </Reveal>

                            {/* El puente nativo */}
                            <Reveal delay={0.12}>
                                <div
                                    className="sp-tint p-6 md:p-8"
                                    style={{
                                        background: PAPER,
                                        boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 14px 30px -24px rgba(53,53,53,0.6)",
                                    }}
                                >
                                    <span
                                        className="sp-tint inline-grid rounded-[6px] h-10 w-10 place-items-center"
                                        style={{ background: `${t.primary}18`, color: t.primary }}
                                    >
                                        <Printer size={19} />
                                    </span>
                                    <h3 className="mt-4 text-xl font-bold">El único puente nativo del proyecto</h3>

                                    <div className="mt-6 space-y-3">
                                        {[
                                            { k: "Dart", v: "Voucher declara el canal y arma los campos", n: "lib · Flutter" },
                                            { k: "MethodChannel", v: "samples.flutter.dev/print", n: "quince campos, en orden" },
                                            { k: "Java", v: "MainActivity.java traduce cada campo", n: "android/app" },
                                            { k: "SDK", v: "com.sunmi:printerlibrary 1.0.18", n: "SunmiPrintHelper" },
                                            { k: "Papel", v: "bitmap + cabecera + cuerpo + pie + avance", n: "80 mm" },
                                        ].map((step, i) => (
                                            <div key={step.k} className="flex gap-3">
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span
                                                        className="sp-tint sp-mono grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white"
                                                        style={{ background: i % 2 === 0 ? t.primary : "#4A4F57" }}
                                                    >
                                                        {i + 1}
                                                    </span>
                                                    {i < 4 && (
                                                        <span
                                                            className="w-px flex-1 min-h-[18px]"
                                                            style={{ background: LINE }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="pb-3">
                                                    <p className="sp-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: MUTE }}>
                                                        {step.k}
                                                    </p>
                                                    <p className="sp-mono text-[13px] font-semibold leading-5">{step.v}</p>
                                                    <p className="text-[12px]" style={{ color: MUTE }}>
                                                        {step.n}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-5 mt-2 border-t" style={{ borderColor: LINE }}>
                                        <p className="sp-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTE }}>
                                            Logos que se imprimen como bitmap
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {["CANTV", "MOVISTAR", "DIGITEL", "SIMPLETV", "MOVILNET"].map((op) => (
                                                <span
                                                    key={op}
                                                    className="sp-mono rounded-[3px] border px-2 py-1 text-[11px]"
                                                    style={{ borderColor: LINE, color: "#5C616A" }}
                                                >
                                                    {op}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Mini recibo térmico saliendo de la ranura */}
                                <div className="mt-8">
                                    <div className="sp-slot relative mx-auto h-[22px] w-[70%] max-w-[280px] rounded-t-[12px] border border-black/50">
                                        <span className="absolute inset-x-5 top-[8px] h-[3px] rounded-full bg-black/70" />
                                    </div>
                                    <div
                                        className="sp-thermal sp-mono mx-auto w-[70%] max-w-[280px] px-4 py-3 text-[10px] leading-[17px]"
                                        style={{ color: "#2B2B2B", boxShadow: "6px 6px 0 rgba(53,53,53,0.07)" }}
                                    >
                                        <p className="font-bold text-center">SERVICIOS PAGUETODO, C.A</p>
                                        <p className="text-center">RIF: J-40339964-6</p>
                                        <p className="text-center">RECIBO DE COMPRA</p>
                                        <p className="overflow-hidden whitespace-nowrap" style={{ color: "#A9ADB3" }}>
                                            {"-".repeat(48)}
                                        </p>
                                        {VOUCHER.slice(0, 5).map(([k, v]) => (
                                            <p key={k}>
                                                <span className="font-bold">{k} </span>
                                                {v}
                                            </p>
                                        ))}
                                        <p>
                                            <span className="font-bold">Total a pagar: </span>1.234,56 bs
                                        </p>
                                        <p>
                                            <span className="font-bold">Estatus: </span>APROBADO
                                        </p>
                                    </div>
                                    <div
                                        aria-hidden
                                        className="sp-thermal mx-auto h-[9px] w-[70%] max-w-[280px]"
                                        style={{
                                            clipPath: ZIG_BOTTOM,
                                            WebkitClipPath: ZIG_BOTTOM,
                                            filter: "drop-shadow(6px 5px 0 rgba(53,53,53,0.07))",
                                        } as CSSProperties}
                                    />
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                <CutLine label="05 · la marca" />

                {/* ═════════════════════════ MULTIMARCA ═════════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-5xl mx-auto">
                        <Rule>themes.json</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Un mismo código,{" "}
                            <span className="brand-gradient-text">dos identidades</span>
                        </h2>
                        <p className="max-w-2xl mt-4 text-[15px] leading-relaxed" style={{ color: "#5C616A" }}>
                            {p.brand.mood}
                        </p>

                        <div className="flex justify-center mt-10">
                            <BrandToggle brandKey={brandKey} onChange={setBrandKey} t={t} compact />
                        </div>

                        <div className="grid gap-5 mt-10 md:grid-cols-2">
                            {(["pt", "sunmi"] as const).map((key) => {
                                const th = THEMES[key];
                                const active = key === brandKey;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setBrandKey(key)}
                                        className="sp-tint p-6 text-left"
                                        style={{
                                            background: PAPER,
                                            outline: active ? `2px solid ${th.primary}` : `1px solid ${LINE}`,
                                            outlineOffset: active ? "-2px" : "-1px",
                                            boxShadow: active
                                                ? "0 16px 34px -26px rgba(53,53,53,0.75)"
                                                : "0 1px 0 rgba(53,53,53,0.08)",
                                            opacity: active ? 1 : 0.72,
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <Image
                                                src={th.logo}
                                                alt={th.label}
                                                width={280}
                                                height={120}
                                                className="object-contain w-auto h-10"
                                            />
                                            <span className="sp-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: MUTE }}>
                                                {th.file}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 mt-5">
                                            {th.swatches.map((hex) => (
                                                <span key={hex} className="flex-1">
                                                    <span
                                                        className="block h-10 rounded-[4px]"
                                                        style={{ background: hex, border: `1px solid ${LINE}` }}
                                                    />
                                                    <span className="sp-mono mt-1 block text-[10.5px]" style={{ color: MUTE }}>
                                                        {hex}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-5 space-y-0.5">
                                            <Leader label="Entry point" value={th.entry} />
                                            <Leader label="Ícono" value="flutter_launcher_icons" />
                                            <Leader label="Filtro" value="por RIF" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Matriz marca × ambiente: los seis mains */}
                        <div className="mt-12 overflow-x-auto">
                            <table className="w-full min-w-[620px] border-collapse text-left">
                                <thead>
                                    <tr>
                                        <th className="sp-mono py-2 pr-4 text-[10.5px] uppercase tracking-[0.2em]" style={{ color: MUTE }}>
                                            marca / ambiente
                                        </th>
                                        {ENVS.map((e) => (
                                            <th
                                                key={e.file}
                                                className="sp-mono py-2 pr-4 text-[10.5px] uppercase tracking-[0.2em]"
                                                style={{ color: MUTE }}
                                            >
                                                {e.note}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(["pt", "sunmi"] as const).map((key) => {
                                        const th = THEMES[key];
                                        return (
                                            <tr key={key}>
                                                <th
                                                    className="sp-mono py-3 pr-4 text-[12px] font-bold align-top border-t"
                                                    style={{ borderColor: LINE, color: th.primary }}
                                                >
                                                    {th.file}
                                                </th>
                                                {ENVS.map((e) => (
                                                    <td
                                                        key={e.file}
                                                        className="py-3 pr-4 border-t align-top"
                                                        style={{ borderColor: LINE }}
                                                    >
                                                        <p className="sp-mono text-[12px]">
                                                            {th.entry}/{e.file}
                                                        </p>
                                                        <p className="sp-mono text-[11px]" style={{ color: MUTE }}>
                                                            {e.env}
                                                        </p>
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <CutLine label="06 · el inventario" />

                {/* ═══════════════════ INVENTARIO Y COMPRA ═══════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-6xl mx-auto">
                        <Rule>Cuadre de caja</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            El comercio compra unidades y las{" "}
                            <span className="brand-gradient-text">va gastando</span>
                        </h2>
                        <p className="max-w-2xl mt-4 text-[15px] leading-relaxed" style={{ color: "#5C616A" }}>
                            Cuatro maneras de recargar el inventario, tomadas de la propia app, y un reporte que deja la
                            caja cuadrada sin salir del terminal.
                        </p>

                        <Stagger className="grid grid-cols-2 gap-4 mt-10 lg:grid-cols-4">
                            {methodShots.map((m) => (
                                <StaggerItem key={m.src} className="h-full">
                                    <figure
                                        className="sp-tint h-full p-4 text-center"
                                        style={{
                                            background: PAPER,
                                            boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 12px 26px -22px rgba(53,53,53,0.6)",
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center h-20">
                                            <Image
                                                src={m.src}
                                                alt={m.caption}
                                                width={220}
                                                height={140}
                                                className="object-contain w-auto h-16"
                                            />
                                        </div>
                                        <figcaption className="mt-3 text-[12px] leading-[18px]" style={{ color: "#5C616A" }}>
                                            {m.caption.replace("Tarjeta del método de compra ", "")}
                                        </figcaption>
                                    </figure>
                                </StaggerItem>
                            ))}
                        </Stagger>

                        <div className="grid gap-6 mt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                            {/* Reporte de movimientos */}
                            <Reveal>
                                <div
                                    className="sp-tint p-5 md:p-6"
                                    style={{
                                        background: PAPER,
                                        boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 14px 30px -24px rgba(53,53,53,0.6)",
                                    }}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="sp-mono text-[11px] font-bold uppercase tracking-[0.22em]">
                                            Reporte de movimientos
                                        </p>
                                        <div className="flex gap-2">
                                            {["Período (inicio)", "Período (fin)"].map((f) => (
                                                <span
                                                    key={f}
                                                    className="inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1.5 text-[11px]"
                                                    style={{ borderColor: LINE, color: MUTE }}
                                                >
                                                    <Calendar size={12} /> {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 overflow-x-auto">
                                        <table className="w-full min-w-[560px] border-collapse text-left sp-mono text-[12px]">
                                            <thead>
                                                <tr style={{ color: MUTE }}>
                                                    {["Fecha", "Tipo", "Descripción", "Entrada", "Salida", "Saldo"].map((h) => (
                                                        <th key={h} className="py-2 pr-3 text-[10.5px] uppercase tracking-[0.14em] font-normal">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {MOVEMENTS.map((row) => (
                                                    <tr key={row.date} className="border-t" style={{ borderColor: LINE }}>
                                                        <td className="py-2 pr-3 whitespace-nowrap">{row.date}</td>
                                                        <td className="py-2 pr-3">{row.type}</td>
                                                        <td className="py-2 pr-3" style={{ color: "#5C616A" }}>
                                                            {row.desc}
                                                        </td>
                                                        <td className="py-2 pr-3 font-bold" style={{ color: row.in ? GREEN : "#C9CDD3" }}>
                                                            {row.in ?? "—"}
                                                        </td>
                                                        <td className="py-2 pr-3 font-bold" style={{ color: row.out ? RED : "#C9CDD3" }}>
                                                            {row.out ?? "—"}
                                                        </td>
                                                        <td className="py-2 pr-3 font-bold">{row.balance}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-4">
                                        {["1", "2", "3", "4"].map((n, i) => (
                                            <span
                                                key={n}
                                                className="sp-tint sp-mono grid h-7 w-7 place-items-center rounded-[4px] text-[11px]"
                                                style={{
                                                    background: i === 0 ? t.primary : "transparent",
                                                    color: i === 0 ? "#FFFFFF" : MUTE,
                                                    border: i === 0 ? "none" : `1px solid ${LINE}`,
                                                }}
                                            >
                                                {n}
                                            </span>
                                        ))}
                                        <span className="sp-mono text-[11px] ml-1" style={{ color: MUTE }}>
                                            ›
                                        </span>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Ticket de saldo */}
                            <Reveal delay={0.1}>
                                <Ticket top className="w-full">
                                    <div className="sp-mono px-5 py-6" style={{ color: INK }}>
                                        <p className="text-[12px] font-bold text-center tracking-[0.14em]">
                                            CUADRE DE INVENTARIO
                                        </p>
                                        <p className="mt-2 overflow-hidden text-[12px] whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                            {"-".repeat(48)}
                                        </p>
                                        <div className="mt-3 space-y-0.5">
                                            <Leader label="Disponible" value="1.250 unid." strong />
                                            <Leader label="Consignación" value="320 unid." />
                                            <Leader label="Límite" value="500 unid." />
                                            <Leader label="Bancos" value="27" />
                                            <Leader label="Métodos" value="4" />
                                        </div>
                                        <p className="mt-4 text-[11px] leading-[18px]" style={{ color: MUTE }}>
                                            Pago móvil, C2P Bancaribe, Credicard Pagos débito y transferencia inmediata, con
                                            token bancario y clave de operaciones especiales.
                                        </p>
                                    </div>
                                </Ticket>
                            </Reveal>
                        </div>
                    </div>
                </section>

                <CutLine label="07 · funcionalidades" />

                {/* ═══════════════════════ FUNCIONALIDADES ═══════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-5xl mx-auto">
                        <Rule>Detalle de la compra</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Quince renglones{" "}
                            <span className="brand-gradient-text">en el mismo ticket</span>
                        </h2>

                        <Ticket top className="mt-10">
                            <div className="px-5 py-6 md:px-8 md:py-8 sp-mono" style={{ color: INK }}>
                                <div className="flex items-baseline justify-between text-[11px]" style={{ color: MUTE }}>
                                    <span className="uppercase tracking-[0.2em]">Cant. Descripción</span>
                                    <span className="uppercase tracking-[0.2em]">Estado</span>
                                </div>
                                <p className="mt-1 overflow-hidden text-[12px] whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                    {"=".repeat(90)}
                                </p>

                                <Stagger stagger={0.045} className="mt-2">
                                    {p.features.map((f, i) => (
                                        <StaggerItem key={f} y={10}>
                                            <div
                                                className="flex items-start gap-3 py-2 border-b"
                                                style={{ borderColor: "rgba(53,53,53,0.07)" }}
                                            >
                                                <span className="text-[11.5px] shrink-0 pt-[2px]" style={{ color: MUTE }}>
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span
                                                    className="sp-tint text-[12px] font-bold shrink-0 pt-[1px]"
                                                    style={{ color: t.primary }}
                                                >
                                                    [x]
                                                </span>
                                                <span className="text-[12.5px] leading-[20px] flex-1">{f}</span>
                                                <span
                                                    className="hidden text-[11px] shrink-0 pt-[2px] sm:inline"
                                                    style={{ color: GREEN }}
                                                >
                                                    OK
                                                </span>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </Stagger>

                                <div className="flex items-baseline justify-between mt-5 text-[13px] font-bold">
                                    <span>TOTAL DE RENGLONES</span>
                                    <span>{p.features.length}</span>
                                </div>
                            </div>
                        </Ticket>

                        {helpShots.length > 0 && (
                            <div className="grid gap-4 mt-8 sm:grid-cols-2">
                                {helpShots.map((m, i) => (
                                    <Reveal key={m.src} delay={i * 0.08}>
                                        <figure
                                            className="sp-tint flex items-center gap-4 p-4"
                                            style={{
                                                background: PAPER,
                                                boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 12px 26px -22px rgba(53,53,53,0.6)",
                                            }}
                                        >
                                            <Image
                                                src={m.src}
                                                alt={m.caption}
                                                width={200}
                                                height={200}
                                                className="object-contain w-auto h-16 shrink-0"
                                            />
                                            <figcaption className="text-[12.5px] leading-[19px]" style={{ color: "#5C616A" }}>
                                                {m.caption}
                                            </figcaption>
                                        </figure>
                                    </Reveal>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <CutLine label="08 · stack" />

                {/* ═════════════════════════ STACK ═════════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-6xl mx-auto">
                        <Rule>Materiales</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Con qué está hecho el terminal
                        </h2>

                        <div className="grid gap-5 mt-10 md:grid-cols-2 lg:grid-cols-3">
                            {p.stack.map((group, i) => (
                                <Reveal key={group.group} delay={i * 0.05}>
                                    <div
                                        className="sp-tint h-full p-5"
                                        style={{
                                            background: PAPER,
                                            boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 12px 26px -22px rgba(53,53,53,0.6)",
                                        }}
                                    >
                                        <p
                                            className="sp-mono text-[11px] font-bold uppercase tracking-[0.22em]"
                                            style={{ color: i % 2 === 0 ? t.primary : "#8A7500" }}
                                        >
                                            {group.group}
                                        </p>
                                        <div className="mt-3 space-y-0.5">
                                            {group.items.map((item, j) => (
                                                <Leader
                                                    key={item}
                                                    label={String(j + 1).padStart(2, "0")}
                                                    value={item}
                                                    className="text-[11.5px]"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                <CutLine label="09 · arquitectura" />

                {/* ═══════════════════ ARQUITECTURA + RETOS ═══════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-5xl mx-auto">
                        <Rule>Bajo el capó</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Cómo está armado{" "}
                            <span className="brand-gradient-text">por dentro</span>
                        </h2>

                        <Reveal className="mt-8">
                            <div
                                className="sp-tint p-6 md:p-8"
                                style={{
                                    background: PAPER,
                                    borderLeft: `3px solid ${t.primary}`,
                                    boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 14px 30px -24px rgba(53,53,53,0.6)",
                                }}
                            >
                                <p className="text-[14.5px] leading-[24px]" style={{ color: "#4A4F57" }}>
                                    {p.architecture}
                                </p>
                            </div>
                        </Reveal>

                        <div className="grid gap-3 mt-6 sm:grid-cols-3">
                            {[
                                { k: "get_it + injectable", v: "31 registros" },
                                { k: "lib/pages", v: "12 módulos con BLoC" },
                                { k: "go_router", v: "1 ShellRoute · 3 pestañas" },
                            ].map((item) => (
                                <div
                                    key={item.k}
                                    className="sp-tint p-4"
                                    style={{ background: PAPER, boxShadow: "0 1px 0 rgba(53,53,53,0.10)" }}
                                >
                                    <p className="sp-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: MUTE }}>
                                        {item.k}
                                    </p>
                                    <p className="sp-mono mt-1 text-[14px] font-bold">{item.v}</p>
                                </div>
                            ))}
                        </div>

                        <h3 className="mt-16 text-2xl font-bold md:text-3xl">Lo que costó resolver</h3>
                        <p className="mt-2 text-[14px]" style={{ color: MUTE }}>
                            Cuatro incidencias del proyecto, con su resolución.
                        </p>

                        <div className="mt-8 space-y-5">
                            {p.challenges.map((c, i) => (
                                <Reveal key={c.problem} delay={i * 0.06}>
                                    <div
                                        className="sp-tint overflow-hidden"
                                        style={{ background: PAPER, boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 14px 30px -26px rgba(53,53,53,0.6)" }}
                                    >
                                        <div className="grid md:grid-cols-2">
                                            <div className="p-5 md:p-6" style={{ background: "rgba(228,52,46,0.05)" }}>
                                                <p className="sp-mono text-[10.5px] font-bold uppercase tracking-[0.24em]" style={{ color: RED }}>
                                                    Incidencia {String(i + 1).padStart(2, "0")}
                                                </p>
                                                <p className="mt-3 text-[13.5px] leading-[22px]" style={{ color: "#4A4F57" }}>
                                                    {c.problem}
                                                </p>
                                            </div>
                                            <div
                                                className="sp-tint p-5 md:p-6"
                                                style={{ background: `${t.primary}0D` }}
                                            >
                                                <p
                                                    className="sp-mono text-[10.5px] font-bold uppercase tracking-[0.24em]"
                                                    style={{ color: t.primary }}
                                                >
                                                    Resolución
                                                </p>
                                                <p className="mt-3 text-[13.5px] leading-[22px]" style={{ color: "#4A4F57" }}>
                                                    {c.solution}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                <CutLine label="10 · totales" />

                {/* ═════════════════════════ MÉTRICAS ═════════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-5xl mx-auto">
                        <Rule>Resumen de operación</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            El proyecto, en cifras
                        </h2>

                        <div className="grid gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-4">
                            {p.metrics.slice(0, 4).map((m) => (
                                <CountMetric key={m.label} value={m.value} label={m.label} />
                            ))}
                        </div>

                        <Ticket top className="mt-12 mx-auto w-full max-w-[440px]">
                            <div className="px-6 py-6 sp-mono" style={{ color: INK }}>
                                <p className="text-[12px] font-bold text-center tracking-[0.16em]">DETALLE DEL PROYECTO</p>
                                <p className="mt-2 overflow-hidden text-[12px] whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                    {"-".repeat(52)}
                                </p>
                                <div className="mt-3 space-y-0.5">
                                    {p.metrics.map((m, i) => (
                                        <PrintLine key={m.label} delay={i * 0.06}>
                                            <Leader label={m.label} value={m.value} strong={i > 3} />
                                        </PrintLine>
                                    ))}
                                </div>
                                <p className="mt-3 overflow-hidden text-[12px] whitespace-nowrap" style={{ color: "#C9CDD3" }}>
                                    {"=".repeat(52)}
                                </p>
                                <div className="flex items-baseline justify-between mt-2 text-[13px] font-bold">
                                    <span>VERSIÓN</span>
                                    <span>1.0.7 · build 63</span>
                                </div>
                            </div>
                        </Ticket>
                    </div>
                </section>

                <CutLine label="11 · la letra pequeña" />

                {/* ═════════════════════════ RESUMEN ═════════════════════════ */}
                <section className="relative px-4 py-20 md:px-6 md:py-24" style={{ color: INK }}>
                    <div className="max-w-4xl mx-auto">
                        <Rule>La letra pequeña</Rule>
                        <h2 className="max-w-2xl mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            De qué va {p.name}
                        </h2>

                        <Stagger className="mt-8 space-y-5">
                            {p.summary.map((paragraph, i) => (
                                <StaggerItem key={paragraph.slice(0, 24)}>
                                    <p
                                        className={
                                            i === 0
                                                ? "text-[17px] leading-[28px] md:text-[19px] md:leading-[31px]"
                                                : "text-[14.5px] leading-[24px]"
                                        }
                                        style={{ color: i === 0 ? INK : "#5C616A" }}
                                    >
                                        {paragraph}
                                    </p>
                                </StaggerItem>
                            ))}
                        </Stagger>

                        {brandAssets.length > 0 && (
                            <div className="mt-12">
                                <p className="sp-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: MUTE }}>
                                    Marcas e íconos del proyecto · arrastra
                                </p>
                                <DragRail className="mt-4">
                                    {brandAssets.map((m) => (
                                        <figure
                                            key={m.src}
                                            className="sp-tint w-[220px] shrink-0 p-4"
                                            style={{
                                                background: PAPER,
                                                boxShadow: "0 1px 0 rgba(53,53,53,0.10), 0 12px 26px -22px rgba(53,53,53,0.6)",
                                            }}
                                        >
                                            <div className="grid h-20 place-items-center" style={{ background: GRAY }}>
                                                <Image
                                                    src={m.src}
                                                    alt={m.caption}
                                                    width={220}
                                                    height={120}
                                                    className="object-contain w-auto h-14"
                                                />
                                            </div>
                                            <figcaption className="mt-3 text-[11.5px] leading-[18px]" style={{ color: "#5C616A" }}>
                                                {m.caption}
                                            </figcaption>
                                        </figure>
                                    ))}
                                </DragRail>
                            </div>
                        )}
                    </div>
                </section>

                {/* ═════════════════════════ CINTA ═════════════════════════ */}
                <div
                    className="sp-mono py-5 text-[11px] uppercase tracking-[0.24em]"
                    style={{
                        color: MUTE,
                        borderTop: "1px solid rgba(53,53,53,0.12)",
                        borderBottom: "1px solid rgba(53,53,53,0.12)",
                    }}
                >
                    <Marquee
                        items={[
                            "CANTV",
                            "CORPOELEC",
                            "MOVISTAR",
                            "MOVILNET",
                            "DIGITEL",
                            "SIMPLETV",
                            "INTER",
                            "Sunmi",
                            "Pago móvil",
                            "C2P Bancaribe",
                        ]}
                        speed={40}
                        separator="·"
                    />
                </div>

                {/* ═════════════════════════ CIERRE ═════════════════════════ */}
                <div className="relative pb-32" style={{ background: "#101215" }}>
                    <div className="px-4 pt-16 md:px-6">
                        <div className="max-w-[440px] mx-auto text-center">
                            <div className="sp-mono text-[12px] leading-6 text-white/70">
                                <p className="overflow-hidden whitespace-nowrap text-white/25">{"-".repeat(52)}</p>
                                <div className="mt-2 space-y-0.5 text-left text-white/75">
                                    <Leader label="Total a pagar" value="1.234,56 bs" strong />
                                    <Leader label="Nro. aprobación" value="884213" />
                                </div>
                                <p className="mt-3 text-[13px] font-bold tracking-[0.2em]" style={{ color: "#52FF8F" }}>
                                    ESTATUS: APROBADO
                                </p>
                                <div className="sp-barcode h-14 w-full mt-5 opacity-90" />
                                <p className="mt-2 text-[10.5px] tracking-[0.32em] text-white/45">
                                    0000004871 · 07 03 2025
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 mt-8">
                                {p.links.web && (
                                    <a
                                        href={p.links.web}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors border rounded-full border-white/25 hover:border-white/60"
                                    >
                                        <Play size={14} /> Video de la app
                                    </a>
                                )}
                                {p.links.github && (
                                    <a
                                        href={p.links.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors border rounded-full border-white/25 hover:border-white/60"
                                    >
                                        <Github size={14} /> Repositorio
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 mt-8">
                                <Chip>{p.categoryShort}</Chip>
                                <Chip>{p.statusShort}</Chip>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-white">
                        <ProjectOutro
                            name={p.name}
                            links={p.links}
                            nextSlug={nxt.slug}
                            nextName={nxt.name}
                            note="Una terminal de pago de servicios que cobra, cuadra inventario e imprime el recibo en el propio equipo, bajo dos marcas y tres ambientes. Si necesitas algo así —Flutter con puente nativo, dinero de por medio y hardware real— es terreno conocido."
                        />
                    </div>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
