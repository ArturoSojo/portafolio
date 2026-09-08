"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    ArrowUpRight,
    Bell,
    Check,
    ChevronDown,
    Database,
    Globe,
    Lock,
    MonitorSmartphone,
    RefreshCw,
    Search,
    Server,
    Sparkles,
    TriangleAlert,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Magnetic, Marquee, ProjectOutro, SampleDataNote, SectionHead, TiltCard } from "@/components/projects/bits";
import { BrowserFrame, DragRail, PhoneFrame } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("zocialy")!;
const nxt = nextProject("zocialy");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

const media = (file: string) => p.media.find((m) => m.src.endsWith(file));
const wordmark = media("zocialy-wordmark.png");
const isotipo = media("zocialy-isotipo.png");
const lockup = media("logo-zocialy.png");
const iconArt = media("icon-zocialy.png");

/* Tinta y neutros entintados de violeta: el fondo de marca es claro, así que el
   color del texto se fija aquí y no se hereda. */
const INK = "#211a2e";
const MUTED = "#6b6480";
const LINE = "rgba(33,26,46,0.09)";

/* Muro de barras: la altura sale de las propias métricas del repositorio,
   en escala logarítmica para que «~40.000 líneas» no aplaste a «6 métodos». */
const numberOf = (value: string) => {
    const n = parseFloat(value.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : 1;
};
const logs = p.metrics.map((m) => Math.log10(numberOf(m.value) + 1));
const maxLog = Math.max(...logs);
const barHeights = logs.map((l) => Math.round(26 + 72 * (l / maxLog)));

const PLATFORMS = [
    { name: "Instagram", gradient: "linear-gradient(135deg,#f9ce34,#ee2a7b 52%,#6228d7)", note: "Seguidores · Reels" },
    { name: "TikTok", gradient: "linear-gradient(135deg,#25f4ee,#12121a 55%,#fe2c55)", note: "Views · Likes" },
    { name: "YouTube", gradient: "linear-gradient(135deg,#ff5f57,#c4302b)", note: "Suscriptores" },
    { name: "Facebook", gradient: "linear-gradient(135deg,#4293ff,#0b5fd0)", note: "Página · Post" },
    { name: "X", gradient: "linear-gradient(135deg,#6b7280,#111114)", note: "Followers" },
    { name: "Telegram", gradient: "linear-gradient(135deg,#5ec8f5,#1c8fd6)", note: "Miembros · Vistas" },
];

const css = `
.zo-ink { color: ${INK}; }
.zo-grid {
  background-image:
    linear-gradient(to right, rgba(122,63,196,0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(122,63,196,0.07) 1px, transparent 1px);
  background-size: 56px 56px;
}
.zo-aurora { position: absolute; border-radius: 9999px; filter: blur(90px); pointer-events: none; will-change: transform; }
.zo-aurora-a { animation: zo-drift-a 22s ease-in-out infinite; }
.zo-aurora-b { animation: zo-drift-b 22s ease-in-out infinite; }
@keyframes zo-drift-a {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(7%, -6%, 0) scale(1.16); }
}
@keyframes zo-drift-b {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1.1); }
  50% { transform: translate3d(-8%, 7%, 0) scale(0.92); }
}
.zo-glass {
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(122,63,196,0.16);
  box-shadow: 0 40px 90px -40px rgba(66,31,110,0.55), 0 2px 10px -4px rgba(66,31,110,0.18);
}
.zo-card {
  background: #ffffff;
  border: 1px solid ${LINE};
  box-shadow: 0 24px 60px -40px rgba(66,31,110,0.5);
}
.zo-draw path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: zo-draw 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s forwards; }
@keyframes zo-draw { to { stroke-dashoffset: 0; } }
.zo-pill-a { animation: zo-bob 4.6s ease-in-out infinite; }
.zo-pill-b { animation: zo-bob 5.9s ease-in-out infinite 0.8s; }
@keyframes zo-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}
.zo-marquee { -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
.zo-track { display: flex; width: max-content; animation: zo-scroll 38s linear infinite; }
.zo-track-rev { animation-direction: reverse; }
.zo-marquee:hover .zo-track { animation-play-state: paused; }
@keyframes zo-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.zo-bar { transition: height 1.05s cubic-bezier(0.22,1,0.36,1); }
.zo-ring { animation: zo-ring 2.4s ease-out infinite; }
@keyframes zo-ring {
  0% { transform: scale(0.85); opacity: 0.75; }
  100% { transform: scale(1.6); opacity: 0; }
}
.zo-comet { animation: zo-comet 2.6s linear infinite; }
@keyframes zo-comet {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}
.zo-tab { font-variant-numeric: tabular-nums; }
.zo-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }
@media (prefers-reduced-motion: reduce) {
  .zo-aurora-a, .zo-aurora-b, .zo-pill-a, .zo-pill-b, .zo-track, .zo-ring, .zo-comet { animation: none !important; }
  .zo-draw path { animation: none !important; stroke-dashoffset: 0; }
  .zo-bar { transition: none !important; }
}
`;

/* Contador con easeOutExpo: sube al entrar en pantalla y se desconecta al disparar. */
const ZoCount = ({ to, className }: { to: number; className?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [shown, setShown] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (reduce) {
            setShown(to);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / 1600);
                    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                    setShown(Math.round(to * eased));
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.4 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [to, reduce]);

    return (
        <span ref={ref} className={`zo-tab ${className ?? ""}`}>
            {String(shown).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        </span>
    );
};

/* Rótulo de sección: número, título y bajada, en la tinta de la marca. */
const Head = ({ index, title, lead }: { index: string; title: React.ReactNode; lead?: string }) => (
    <div style={{ color: INK }}>
        <SectionHead index={index} title={title} lead={lead} />
    </div>
);

const Dot = ({ color }: { color: string }) => (
    <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
);

/* ─────────────── Mockups recreados en CSS a partir de p.uiScreens ─────────────── */

const NAV_CLIENTE = [
    "Dashboard",
    "Los más pedidos",
    "Nueva orden",
    "Historial",
    "Saldo",
    "Afiliados",
    "API",
    "Garantía (refill)",
    "Soporte",
];

const MockPanel = () => (
    <div className="overflow-x-auto scrollbar-none">
        <div className="min-w-[780px] flex text-[11px]" style={{ background: "#faf9fd", color: INK }}>
            {/* Barra lateral */}
            <aside className="w-[190px] shrink-0 bg-white border-r p-3" style={{ borderColor: LINE }}>
                <div className="flex items-center gap-1.5 px-1 pb-3">
                    {isotipo && <Image src={isotipo.src} alt="" width={20} height={21} className="w-[18px] h-auto" />}
                    <span className="text-[13px] font-extrabold tracking-tight" style={{ color: "#421f6e" }}>
                        Zocialy
                    </span>
                </div>
                <div className="space-y-[3px]">
                    {NAV_CLIENTE.map((item, i) => (
                        <div
                            key={item}
                            className="rounded-full px-2.5 py-1.5 text-[10px] font-medium"
                            style={
                                i === 0
                                    ? { backgroundImage: p.brand.gradient, color: "#fff" }
                                    : { color: MUTED }
                            }
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <p
                    className="mt-4 rounded-xl p-2 text-[8.5px] leading-relaxed"
                    style={{ background: "rgba(252,132,132,0.12)", color: "#9f3a52" }}
                >
                    Las métricas pueden fluctuar tras la entrega. Consulta la política de refill antes de comprar.
                </p>
            </aside>

            {/* Contenido */}
            <div className="flex-1 p-4 space-y-3">
                <div>
                    <p className="text-[15px] font-extrabold leading-none">Dashboard</p>
                    <p className="text-[9px] mt-1" style={{ color: MUTED }}>
                        Resumen de tu cuenta · cifras calculadas en servidor
                    </p>
                </div>

                <div
                    className="flex items-center justify-between rounded-2xl px-4 py-3"
                    style={{ background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 16px 40px -30px rgba(66,31,110,.6)" }}
                >
                    <div>
                        <p className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                            Saldo disponible
                        </p>
                        <p className="zo-tab text-2xl font-extrabold leading-tight">$ 128,40</p>
                    </div>
                    <span
                        className="rounded-full px-3 py-1.5 text-[10px] font-bold text-white"
                        style={{ backgroundImage: p.brand.gradient }}
                    >
                        Recargar
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {[
                        ["Pedidos activos", "7"],
                        ["Completados", "241"],
                        ["Tasa de entrega", "98,4 %"],
                        ["Refills aprobados", "12"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-white p-2.5" style={{ border: `1px solid ${LINE}` }}>
                            <span
                                className="inline-grid h-5 w-5 place-items-center rounded-full text-[9px]"
                                style={{ background: "rgba(122,63,196,0.12)", color: "#7a3fc4" }}
                            >
                                ◈
                            </span>
                            <p className="zo-tab mt-1.5 text-[15px] font-extrabold leading-none">{value}</p>
                            <p className="text-[8.5px] mt-1" style={{ color: MUTED }}>
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-[10px] font-bold mb-1.5">Productos destacados</p>
                    <div className="flex gap-2">
                        {[
                            ["Instagram", "Seguidores reales · 30d refill", "$ 1,20"],
                            ["TikTok", "Views rápidas HQ", "$ 0,08"],
                            ["YouTube", "Suscriptores estables", "$ 4,60"],
                        ].map(([net, name, price], i) => (
                            <div key={name} className="flex-1 rounded-xl bg-white p-2.5" style={{ border: `1px solid ${LINE}` }}>
                                <span
                                    className="rounded-full px-1.5 py-0.5 text-[7.5px] font-bold text-white"
                                    style={{ backgroundImage: PLATFORMS[i === 0 ? 0 : i === 1 ? 1 : 2].gradient }}
                                >
                                    {net}
                                </span>
                                <p className="text-[9px] font-semibold mt-1.5 leading-tight">{name}</p>
                                <div className="flex gap-1 mt-1.5">
                                    {["500", "1K", "5K"].map((q, qi) => (
                                        <span
                                            key={q}
                                            className="rounded-full px-1.5 py-[2px] text-[7.5px]"
                                            style={
                                                qi === 1
                                                    ? { background: "rgba(122,63,196,0.14)", color: "#7a3fc4", fontWeight: 700 }
                                                    : { background: "rgba(33,26,46,0.05)", color: MUTED }
                                            }
                                        >
                                            {q}
                                        </span>
                                    ))}
                                </div>
                                <p className="zo-tab text-[10px] font-extrabold mt-1.5" style={{ color: "#f0547e" }}>
                                    {price}
                                    <span className="text-[7.5px] font-normal" style={{ color: MUTED }}>
                                        {" "}
                                        / 1.000
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl bg-white overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
                    <div className="grid grid-cols-[70px_1fr_54px_58px_74px] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em]" style={{ color: MUTED, borderBottom: `1px solid ${LINE}` }}>
                        <span>Pedido</span>
                        <span>Servicio</span>
                        <span className="text-right">Cantidad</span>
                        <span className="text-right">Importe</span>
                        <span className="text-right">Estado</span>
                    </div>
                    {[
                        ["a91f4c7d", "IG · Seguidores 30d", "1.000", "$ 1,20", "Completado", "#059669", "rgba(5,150,105,0.12)"],
                        ["7b0e22aa", "TT · Views HQ", "10.000", "$ 0,80", "En progreso", "#7a3fc4", "rgba(122,63,196,0.12)"],
                        ["c4d81903", "YT · Suscriptores", "250", "$ 1,15", "Pendiente", "#b45309", "rgba(245,158,11,0.16)"],
                        ["2f6ab5e1", "FB · Likes de página", "500", "$ 0,45", "Cancelado", "#e11d48", "rgba(225,29,72,0.10)"],
                    ].map(([id, service, qty, amount, state, color, bg]) => (
                        <div key={id} className="grid grid-cols-[70px_1fr_54px_58px_74px] items-center px-3 py-1.5 text-[9px]" style={{ borderBottom: `1px solid ${LINE}` }}>
                            <span className="zo-mono" style={{ color: MUTED }}>{id}</span>
                            <span className="truncate">{service}</span>
                            <span className="zo-tab text-right" style={{ color: MUTED }}>{qty}</span>
                            <span className="zo-tab text-right font-semibold">{amount}</span>
                            <span className="text-right">
                                <span className="rounded-full px-1.5 py-[2px] text-[7.5px] font-bold" style={{ color, background: bg }}>
                                    {state}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const MockOrder = () => (
    <div className="overflow-x-auto scrollbar-none">
        <div className="min-w-[720px] grid grid-cols-[1.15fr_1fr] gap-3 p-4 text-[11px]" style={{ background: "#faf9fd", color: INK }}>
            {/* Cascada */}
            <div className="rounded-2xl bg-white p-3.5" style={{ border: `1px solid ${LINE}` }}>
                <p className="text-[12px] font-extrabold">Nueva orden</p>
                <p className="text-[9px] mt-0.5" style={{ color: MUTED }}>
                    Red → categoría → servicio
                </p>

                <p className="text-[8.5px] uppercase tracking-[0.16em] mt-3 mb-1.5" style={{ color: MUTED }}>
                    Red social
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {PLATFORMS.map((net, i) => (
                        <span
                            key={net.name}
                            className="rounded-full px-2.5 py-1 text-[9px] font-bold"
                            style={
                                i === 0
                                    ? { backgroundImage: net.gradient, color: "#fff" }
                                    : { background: "rgba(33,26,46,0.04)", color: MUTED }
                            }
                        >
                            {net.name}
                        </span>
                    ))}
                </div>

                <p className="text-[8.5px] uppercase tracking-[0.16em] mt-3 mb-1.5" style={{ color: MUTED }}>
                    Categoría
                </p>
                <div className="flex items-center justify-between rounded-xl px-2.5 py-2 text-[10px]" style={{ border: `1px solid ${LINE}` }}>
                    <span>Instagram · Seguidores</span>
                    <ChevronDown size={12} color={MUTED} />
                </div>

                <p className="text-[8.5px] uppercase tracking-[0.16em] mt-3 mb-1.5" style={{ color: MUTED }}>
                    Servicio
                </p>
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(122,63,196,0.35)" }}>
                    <div className="flex items-center gap-1.5 px-2.5 py-2">
                        <Search size={11} color="#7a3fc4" />
                        <span className="text-[10px]" style={{ color: MUTED }}>
                            seguidores 30d…
                        </span>
                    </div>
                    <div style={{ borderTop: `1px solid ${LINE}` }}>
                        {[
                            ["1842 · IG Followers Real | 30d Refill", "$ 1,20 / 1.000", true],
                            ["1907 · IG Followers Mix | No refill", "$ 0,74 / 1.000", false],
                        ].map(([label, price, active]) => (
                            <div
                                key={String(label)}
                                className="flex items-center justify-between px-2.5 py-1.5 text-[9px]"
                                style={active ? { background: "rgba(122,63,196,0.09)" } : undefined}
                            >
                                <span className="truncate">{label}</span>
                                <span className="zo-tab shrink-0 pl-2 font-semibold" style={{ color: "#7a3fc4" }}>
                                    {price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-[8.5px] uppercase tracking-[0.16em] mt-3 mb-1" style={{ color: MUTED }}>
                    Enlace
                </p>
                <p className="text-[8.5px] mb-1.5" style={{ color: MUTED }}>
                    El enlace debe apuntar al perfil, no a una publicación.
                </p>
                <div className="rounded-xl px-2.5 py-2 text-[10px]" style={{ border: "1px solid rgba(225,29,72,0.45)", color: INK }}>
                    instagram.com/p/C8xk…
                </div>
                <p className="text-[8.5px] mt-1" style={{ color: "#e11d48" }}>
                    Eso es una publicación. Pega la URL del perfil.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                        <p className="text-[8.5px] uppercase tracking-[0.16em] mb-1" style={{ color: MUTED }}>
                            Cantidad
                        </p>
                        <div className="zo-tab rounded-xl px-2.5 py-2 text-[10px] font-semibold" style={{ border: `1px solid ${LINE}` }}>
                            1.000
                        </div>
                    </div>
                    <div className="self-end pb-2 text-[8.5px]" style={{ color: MUTED }}>
                        mín. 100 · máx. 100.000
                    </div>
                </div>
            </div>

            {/* Columna de pago */}
            <div className="space-y-2.5">
                <div className="rounded-2xl bg-white p-3.5" style={{ border: `1px solid ${LINE}` }}>
                    {[
                        ["Tarifa por 1.000", "$ 1,20"],
                        ["Cantidad", "1.000"],
                        ["Descuento aplicado", "− $ 0,06"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between py-1 text-[9.5px]">
                            <span style={{ color: MUTED }}>{k}</span>
                            <span className="zo-tab font-semibold">{v}</span>
                        </div>
                    ))}
                    <div className="flex items-end justify-between pt-2 mt-1" style={{ borderTop: `1px solid ${LINE}` }}>
                        <span className="text-[9.5px]" style={{ color: MUTED }}>
                            Total
                        </span>
                        <span className="zo-tab text-xl font-extrabold">$ 1,14</span>
                    </div>
                </div>

                <div className="rounded-2xl p-3" style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
                    <div className="flex items-start gap-1.5">
                        <TriangleAlert size={12} color="#b45309" className="mt-[1px] shrink-0" />
                        <p className="text-[9px] leading-relaxed" style={{ color: "#7c4a06" }}>
                            <strong>Aviso importante:</strong> las métricas pueden fluctuar o descender tras la entrega.{" "}
                            <span className="underline">Ver política de refill</span>
                        </p>
                    </div>
                    <ul className="mt-1.5 space-y-[3px] text-[8.5px] pl-[18px]" style={{ color: "#7c4a06" }}>
                        <li>· Entrega estimada entre 1 y 24 horas.</li>
                        <li>· Fluctuación normal durante las primeras 72 h.</li>
                        <li>· Ventana de garantía según el servicio elegido.</li>
                    </ul>
                </div>

                <div className="flex items-start gap-2 text-[9px]">
                    <span className="mt-[1px] inline-block h-3 w-3 rounded shrink-0" style={{ border: "1.5px solid #b45309" }} />
                    <span style={{ color: INK }}>Entiendo y acepto el aviso sobre la fluctuación de métricas.</span>
                </div>

                <div
                    className="rounded-full py-2 text-center text-[10px] font-bold"
                    style={{ background: "rgba(33,26,46,0.08)", color: "rgba(33,26,46,0.35)" }}
                >
                    Confirmar pedido
                </div>
                <p className="text-[8.5px] text-center" style={{ color: MUTED }}>
                    Saldo $ 128,40 · quedarán $ 127,26
                </p>
            </div>
        </div>
    </div>
);

const NAV_ADMIN = [
    "Resumen",
    "Métricas",
    "Recargas",
    "Pedidos",
    "Retiros",
    "Usuarios",
    "Servicios",
    "Destacados",
    "Transacciones",
    "Tickets",
    "Auditoría",
    "Ajustes",
];

const MockAdmin = () => (
    <div className="overflow-x-auto scrollbar-none">
        <div className="min-w-[820px] flex text-[11px]" style={{ background: "#faf9fd", color: INK }}>
            <aside className="w-[178px] shrink-0 p-3" style={{ background: INK }}>
                <div className="flex items-center gap-1.5 px-1 pb-3">
                    {isotipo && <Image src={isotipo.src} alt="" width={20} height={21} className="w-[16px] h-auto" />}
                    <span className="text-[12px] font-extrabold text-white">Zocialy</span>
                    <span className="text-[8px] uppercase tracking-[0.14em] text-white/45">admin</span>
                </div>
                <div className="space-y-[2px]">
                    {NAV_ADMIN.map((item, i) => (
                        <div
                            key={item}
                            className={`rounded-lg px-2.5 py-[5px] text-[9.5px] ${i === 0 ? "bg-white/10 text-white font-semibold" : "text-white/55"}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </aside>

            <div className="flex-1 p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[15px] font-extrabold leading-none">Resumen</p>
                        <p className="text-[9px] mt-1" style={{ color: MUTED }}>
                            Cifras calculadas en servidor sobre todo el histórico
                        </p>
                    </div>
                    <span
                        className="rounded-full px-3 py-1.5 text-[9.5px] font-bold text-white"
                        style={{ backgroundImage: p.brand.gradient }}
                    >
                        Sincronizar catálogo
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {[
                        ["Facturación total", "$ 9.482,10", INK],
                        ["Pedidos activos", "34", "#b45309"],
                        ["Tasa de entrega", "97,6 %", "#059669"],
                        ["Refills en revisión", "3", "#e11d48"],
                        ["Pedidos totales", "4.117", INK],
                        ["Usuarios registrados", "612", INK],
                        ["Cuentas suspendidas", "—", MUTED],
                        ["Saldo en circulación", "$ 1.204,55", INK],
                    ].map(([label, value, color]) => (
                        <div key={label} className="rounded-xl bg-white p-2.5" style={{ border: `1px solid ${LINE}`, boxShadow: "0 12px 30px -28px rgba(66,31,110,.7)" }}>
                            <p className="text-[8px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                                {label}
                            </p>
                            <p className="zo-tab text-[15px] font-extrabold mt-1 leading-none" style={{ color }}>
                                {value}
                            </p>
                            {label === "Saldo en circulación" && (
                                <p className="text-[7.5px] mt-1" style={{ color: MUTED }}>
                                    Deuda pendiente con clientes
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="rounded-xl bg-white overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
                    <div className="flex items-center justify-between px-3 py-2">
                        <p className="text-[10px] font-bold">Últimos pedidos</p>
                        <span className="text-[9px] font-semibold" style={{ color: "#7a3fc4" }}>
                            Ver todos
                        </span>
                    </div>
                    {[
                        ["a91f4c7d", "ana.***@gmail.com", "IG · Seguidores 30d", "$ 1,20", "Completado", "#059669"],
                        ["7b0e22aa", "jos***@hotmail.com", "TT · Views HQ 10K", "$ 0,80", "En progreso", "#7a3fc4"],
                        ["c4d81903", "mar***@gmail.com", "YT · Suscriptores 250", "$ 1,15", "Pendiente", "#b45309"],
                    ].map(([id, user, service, amount, state, color]) => (
                        <div key={id} className="grid grid-cols-[70px_120px_1fr_58px_74px_58px] items-center px-3 py-1.5 text-[9px]" style={{ borderTop: `1px solid ${LINE}` }}>
                            <span className="zo-mono" style={{ color: MUTED }}>{id}</span>
                            <span className="truncate" style={{ color: MUTED }}>{user}</span>
                            <span className="truncate">{service}</span>
                            <span className="zo-tab text-right font-semibold">{amount}</span>
                            <span className="text-right">
                                <span className="rounded-full px-1.5 py-[2px] text-[7.5px] font-bold" style={{ color, background: `${color}1f` }}>
                                    {state}
                                </span>
                            </span>
                            <span className="zo-tab text-right text-[8px]" style={{ color: MUTED }}>
                                14:02
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const SPARK = [12, 18, 15, 24, 21, 33, 29, 41, 38, 52, 47, 61, 58, 72];
const sparkPath = (values: number[], w = 300, h = 72) => {
    const max = Math.max(...values);
    const step = w / (values.length - 1);
    return values.map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - (v / max) * (h - 8) - 4).toFixed(1)}`).join(" ");
};

const MockMetrics = () => (
    <div className="overflow-x-auto scrollbar-none">
        <div className="min-w-[700px] p-4 text-[11px]" style={{ background: "#faf9fd", color: INK }}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[15px] font-extrabold leading-none">Métricas</p>
                    <p className="text-[9px] mt-1" style={{ color: MUTED }}>
                        Tráfico, embudo de conversión e ingresos. Los días se cortan en UTC
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex rounded-full bg-white p-[3px]" style={{ border: `1px solid ${LINE}` }}>
                        {["7", "14", "30"].map((r, i) => (
                            <span
                                key={r}
                                className="rounded-full px-2.5 py-1 text-[9px] font-bold"
                                style={i === 1 ? { backgroundImage: p.brand.gradient, color: "#fff" } : { color: MUTED }}
                            >
                                {r} días
                            </span>
                        ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[9px] font-semibold" style={{ border: `1px solid ${LINE}` }}>
                        <RefreshCw size={10} color="#7a3fc4" /> Actualizar
                    </span>
                </div>
            </div>

            <p className="text-[9px] font-bold mt-3 mb-1.5">Hoy, comparado</p>
            <div className="grid grid-cols-3 gap-2">
                {[
                    ["Vistas de página", "1.284", "1.107", "1.036", "+16,0 %", "#059669"],
                    ["Sesiones", "612", "588", "551", "+4,1 %", "#059669"],
                    ["Visitantes nuevos", "204", "233", "241", "−12,4 %", "#e11d48"],
                ].map(([label, today, yday, avg, delta, color]) => (
                    <div key={label} className="rounded-xl bg-white p-2.5" style={{ border: `1px solid ${LINE}` }}>
                        <p className="text-[8px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                            {label}
                        </p>
                        <div className="flex items-end gap-1.5 mt-1">
                            <span className="zo-tab text-[17px] font-extrabold leading-none">{today}</span>
                            <span className="text-[8.5px] font-bold" style={{ color }}>
                                {delta}
                            </span>
                        </div>
                        <p className="text-[8px] mt-1" style={{ color: MUTED }}>
                            Ayer {yday} · media 7 d {avg}
                        </p>
                    </div>
                ))}
            </div>
            <p className="text-[8px] mt-1.5" style={{ color: MUTED }}>
                El día va por las 14 h de 24 (UTC)
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                    ["Vistas de página", "máx. 72 · media 37 · total 521"],
                    ["Sesiones", "máx. 41 · media 22 · total 308"],
                ].map(([title, note], gi) => (
                    <div key={title} className="rounded-xl bg-white p-2.5" style={{ border: `1px solid ${LINE}` }}>
                        <p className="text-[9px] font-bold">{title}</p>
                        <svg viewBox="0 0 300 72" className="w-full h-[54px] mt-1" preserveAspectRatio="none" aria-hidden>
                            <defs>
                                <linearGradient id={`zo-spark-${gi}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7a3fc4" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#7a3fc4" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={`${sparkPath(gi === 0 ? SPARK : SPARK.map((v) => v * 0.6))} L300,72 L0,72 Z`} fill={`url(#zo-spark-${gi})`} />
                            <path d={sparkPath(gi === 0 ? SPARK : SPARK.map((v) => v * 0.6))} fill="none" stroke="#7a3fc4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p className="text-[8px]" style={{ color: MUTED }}>
                            {note}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                    ["Páginas más vistas", [["/", "412", 100], ["/precios", "268", 65], ["/panel", "141", 34]]],
                    ["Países", [["Venezuela", "381", 100], ["Colombia", "144", 38], ["México", "96", 25]]],
                    ["Fuentes", [["Directo", "302", 100], ["Instagram", "188", 62], ["Google", "97", 32]]],
                ].map(([title, rows]) => (
                    <div key={String(title)} className="rounded-xl bg-white p-2.5" style={{ border: `1px solid ${LINE}` }}>
                        <p className="text-[9px] font-bold mb-1.5">{String(title)}</p>
                        {(rows as [string, string, number][]).map(([name, value, pct]) => (
                            <div key={name} className="mb-1.5">
                                <div className="flex items-center justify-between text-[8.5px]">
                                    <span className="truncate">{name}</span>
                                    <span className="zo-tab" style={{ color: MUTED }}>
                                        {value}
                                    </span>
                                </div>
                                <div className="h-1 rounded-full mt-[3px]" style={{ background: "rgba(33,26,46,0.06)" }} aria-hidden>
                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#7a3fc4" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* App Flutter de administración: aprobar recargas desde el teléfono. */
const MockFlutter = () => (
    <div className="h-full w-full flex flex-col text-[11px]" style={{ background: "#faf9fd", color: INK }}>
        <div className="px-4 pt-8 pb-3" style={{ backgroundImage: p.brand.gradient }}>
            <div className="flex items-center justify-between text-white">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] opacity-80">Zocialy admin</p>
                    <p className="text-[15px] font-extrabold leading-tight">Recargas</p>
                </div>
                <span className="relative inline-grid h-7 w-7 place-items-center rounded-full bg-white/20">
                    <Bell size={13} />
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full text-[7px] font-bold grid place-items-center" style={{ background: "#f0547e" }}>
                        3
                    </span>
                </span>
            </div>
        </div>

        <div className="flex gap-1.5 px-3 py-2">
            {["Pendientes", "Aprobadas", "Rechazadas"].map((t, i) => (
                <span
                    key={t}
                    className="rounded-full px-2.5 py-1 text-[9px] font-semibold"
                    style={i === 0 ? { background: "rgba(122,63,196,0.14)", color: "#7a3fc4" } : { color: MUTED }}
                >
                    {t}
                </span>
            ))}
        </div>

        <div className="flex-1 px-3 space-y-2 overflow-hidden">
            {[
                ["Pago Móvil", "$ 20,00", "Bs 3.284,00", "ref. 004417832", true],
                ["Binance Pay", "$ 50,00", "USDT 50,00", "ref. 8812-KQ", false],
                ["Zinli", "$ 10,00", "$ 10,00", "ref. ZN-4471", false],
            ].map(([method, usd, local, ref, first]) => (
                <div key={String(ref)} className="rounded-2xl bg-white p-3" style={{ border: `1px solid ${LINE}`, boxShadow: "0 14px 34px -30px rgba(66,31,110,.8)" }}>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold">{method}</span>
                        <span className="zo-tab text-[13px] font-extrabold">{usd}</span>
                    </div>
                    <p className="text-[8.5px] mt-0.5" style={{ color: MUTED }}>
                        {local} · tasa congelada · {ref}
                    </p>
                    {first ? (
                        <div className="flex gap-1.5 mt-2">
                            <span className="flex-1 rounded-full py-1.5 text-center text-[9px] font-bold text-white" style={{ backgroundImage: p.brand.gradient }}>
                                Aprobar
                            </span>
                            <span className="rounded-full px-3 py-1.5 text-[9px] font-bold" style={{ border: "1px solid rgba(225,29,72,0.4)", color: "#e11d48" }}>
                                Rechazar
                            </span>
                        </div>
                    ) : (
                        <p className="text-[8px] mt-1.5" style={{ color: MUTED }}>
                            Toca para revisar el comprobante
                        </p>
                    )}
                </div>
            ))}
        </div>

        <div className="flex justify-around py-2" style={{ background: "#fff", borderTop: `1px solid ${LINE}` }}>
            {["Resumen", "Recargas", "Pedidos", "Más"].map((t, i) => (
                <span key={t} className="text-[8px] font-semibold" style={{ color: i === 1 ? "#7a3fc4" : MUTED }}>
                    {t}
                </span>
            ))}
        </div>
    </div>
);

/* ─────────────────────────────── Landing ─────────────────────────────── */

const Landing = () => {
    const [accepted, setAccepted] = useState(false);
    const wall = useEnteredView<HTMLDivElement>(0.25);

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ───────────────── HERO PARTIDO ───────────────── */}
            <section className="relative px-4 pt-28 pb-16 overflow-hidden md:px-6 md:pt-36 md:pb-24" style={{ color: INK }}>
                <div aria-hidden className="absolute inset-0 zo-grid" />
                <span aria-hidden className="zo-aurora zo-aurora-a" style={{ width: 520, height: 520, top: -160, left: -120, background: "rgba(122,63,196,0.30)" }} />
                <span aria-hidden className="zo-aurora zo-aurora-b" style={{ width: 460, height: 460, top: 40, right: -140, background: "rgba(252,132,132,0.34)" }} />

                <div className="relative grid max-w-6xl gap-12 mx-auto lg:grid-cols-[1.05fr_1fr] lg:items-center">
                    <div>
                        {wordmark && (
                            <Image
                                src={wordmark.src}
                                alt={p.name}
                                width={645}
                                height={201}
                                priority
                                className="h-9 w-auto md:h-11"
                            />
                        )}

                        <span
                            className="inline-flex items-center gap-2 px-3 py-1.5 mt-6 text-[11px] font-medium rounded-full"
                            style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(122,63,196,0.22)", color: "#421f6e" }}
                        >
                            <Sparkles size={13} color="#f0547e" />
                            Más de 5.000 servicios en 6 plataformas
                        </span>

                        <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                            Haz que tus redes{" "}
                            <span className="relative inline-block">
                                <span className="brand-gradient-text">despeguen</span>
                                <svg
                                    className="zo-draw absolute left-0 -bottom-2 w-full h-[14px]"
                                    viewBox="0 0 300 14"
                                    preserveAspectRatio="none"
                                    aria-hidden
                                >
                                    <defs>
                                        <linearGradient id="zo-uline" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#7a3fc4" />
                                            <stop offset="60%" stopColor="#f0547e" />
                                            <stop offset="100%" stopColor="#fc8484" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        pathLength={1}
                                        d="M4,11 C64,3 136,13 296,4"
                                        fill="none"
                                        stroke="url(#zo-uline)"
                                        strokeWidth={5}
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p className="max-w-xl mt-7 text-base leading-relaxed md:text-lg" style={{ color: MUTED }}>
                            <RevealWords text={p.tagline} />
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-6">
                            <Chip>{p.categoryShort}</Chip>
                            <Chip>{p.year}</Chip>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8">
                            {p.links.web && (
                                <Magnetic>
                                    <BrandButton href={p.links.web}>
                                        <Globe size={16} /> Abrir el panel
                                    </BrandButton>
                                </Magnetic>
                            )}
                            <a
                                href="#servicios"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors rounded-full"
                                style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${LINE}`, color: INK }}
                            >
                                Ver los servicios <ArrowRight size={15} />
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-7 text-[13px]" style={{ color: MUTED }}>
                            {["Sin suscripción", "Sin pedir tu contraseña", "Soporte en español"].map((g) => (
                                <span key={g} className="inline-flex items-center gap-1.5">
                                    <Check size={14} color="#059669" strokeWidth={3} /> {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pieza firma: tarjeta de cristal con el contador y la curva honesta */}
                    <div className="relative">
                        <TiltCard intensity={6}>
                            <div className="zo-glass rounded-[2rem] p-6 md:p-7">
                                <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                                    Seguidores · últimas 12 semanas
                                </p>
                                <div className="flex items-end gap-3 mt-2">
                                    <p className="text-4xl font-extrabold md:text-5xl" style={{ color: INK }}>
                                        <ZoCount to={48920} />
                                    </p>
                                    <span
                                        className="mb-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold"
                                        style={{ background: "rgba(5,150,105,0.12)", color: "#059669" }}
                                    >
                                        ▲ 312 %
                                    </span>
                                </div>

                                <svg viewBox="0 0 300 120" className="w-full mt-5 h-28" preserveAspectRatio="none" aria-hidden>
                                    <defs>
                                        <linearGradient id="zo-area" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7a3fc4" stopOpacity="0.28" />
                                            <stop offset="100%" stopColor="#f0547e" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="zo-line" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#421f6e" />
                                            <stop offset="55%" stopColor="#7a3fc4" />
                                            <stop offset="100%" stopColor="#f0547e" />
                                        </linearGradient>
                                    </defs>
                                    {[30, 60, 90].map((y) => (
                                        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke={INK} strokeOpacity="0.06" />
                                    ))}
                                    <path
                                        d="M0,108 C34,100 52,92 78,82 C104,72 118,58 146,50 C174,42 190,26 220,18 C242,12 252,10 266,9 L300,34 L300,120 L0,120 Z"
                                        fill="url(#zo-area)"
                                    />
                                    <g className="zo-draw">
                                        <path
                                            pathLength={1}
                                            d="M0,108 C34,100 52,92 78,82 C104,72 118,58 146,50 C174,42 190,26 220,18 C242,12 252,10 266,9 L300,34"
                                            fill="none"
                                            stroke="url(#zo-line)"
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                        />
                                    </g>
                                    <circle cx="266" cy="9" r="4" fill="#6bc5dc" />
                                </svg>

                                <p className="mt-3 text-[11px] leading-relaxed" style={{ color: MUTED }}>
                                    Incluida la corrección natural del final: así se comporta una cuenta real.
                                </p>
                            </div>
                        </TiltCard>

                        <span
                            className="zo-pill-a absolute -left-2 top-6 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[11px] font-medium shadow-[0_18px_40px_-24px_rgba(66,31,110,0.9)] md:-left-6"
                            style={{ color: INK, border: `1px solid ${LINE}` }}
                        >
                            <span className="inline-grid rounded-lg h-6 w-6 place-items-center text-white text-[11px]" style={{ background: "#f0547e" }}>
                                ↑
                            </span>
                            Entrega iniciada · hace 2 s
                        </span>
                        <span
                            className="zo-pill-b absolute -right-1 bottom-8 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[11px] font-medium shadow-[0_18px_40px_-24px_rgba(66,31,110,0.9)] md:-right-5"
                            style={{ color: INK, border: `1px solid ${LINE}` }}
                        >
                            <span className="inline-grid rounded-lg h-6 w-6 place-items-center text-white text-[11px]" style={{ background: "#7a3fc4" }}>
                                ✓
                            </span>
                            Precio recalculado en servidor
                        </span>
                    </div>
                </div>

                <p className="relative max-w-6xl mx-auto mt-14 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                    <span className="inline-flex items-center gap-2 mr-2 font-semibold" style={{ color: "#059669" }}>
                        <span className="w-2 h-2 rounded-full anim-blink" style={{ background: "#059669" }} />
                        {p.status}
                    </span>
                </p>
                <p className="relative max-w-6xl mx-auto mt-2 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                    <span className="font-semibold" style={{ color: INK }}>
                        {p.category}
                    </span>{" "}
                    · {p.role}
                </p>
            </section>

            {/* ───────────────── MURO DE BARRAS ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head
                        index="01 / El repositorio"
                        title={
                            <>
                                Ocho barras que <span className="brand-gradient-text">se levantan solas</span>
                            </>
                        }
                        lead="Un panel de métricas contado como panel de métricas: cada columna es una cifra real del proyecto, en escala logarítmica para que la más grande no aplaste a las demás."
                    />

                    <div ref={wall.ref} className="grid grid-cols-2 gap-4 mt-12 sm:grid-cols-4 md:gap-6">
                        {p.metrics.map((m, i) => (
                            <div key={m.label} className="flex flex-col">
                                <div className="relative flex items-end h-32 md:h-44">
                                    <div
                                        className="zo-bar w-full rounded-t-2xl"
                                        style={{
                                            height: wall.inView ? `${barHeights[i]}%` : "0%",
                                            transitionDelay: `${i * 60}ms`,
                                            backgroundImage: "linear-gradient(180deg,#f0547e,#7a3fc4 65%,#421f6e)",
                                            boxShadow: "0 18px 40px -22px rgba(122,63,196,0.9)",
                                        }}
                                    />
                                </div>
                                <div className="pt-4 mt-1 border-t" style={{ borderColor: LINE }}>
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────── MARQUESINA DE PLATAFORMAS ───────────────── */}
            <section className="relative py-10 md:py-14" id="servicios">
                <div className="zo-marquee space-y-3">
                    {[false, true].map((rev) => (
                        <div key={String(rev)} className="overflow-hidden">
                            <div className={`zo-track ${rev ? "zo-track-rev" : ""}`}>
                                {[0, 1].map((copy) => (
                                    <div key={copy} className="flex gap-3 pr-3">
                                        {PLATFORMS.map((net) => (
                                            <span
                                                key={`${copy}-${net.name}`}
                                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap"
                                                style={{ backgroundImage: net.gradient, color: "#fff" }}
                                            >
                                                <span className="text-sm font-bold md:text-base">{net.name}</span>
                                                <span className="text-[11px] opacity-80">{net.note}</span>
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───────────────── PROBLEMA → SOLUCIÓN ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head
                        index="02 / El encargo"
                        title={
                            <>
                                Tres vicios del mercado y{" "}
                                <span className="brand-gradient-text">dos exigencias del contexto</span>
                            </>
                        }
                    />

                    <div className="grid gap-5 mt-12 lg:grid-cols-[1fr_1.1fr]">
                        <Reveal direction="right">
                            <div className="h-full p-6 rounded-3xl md:p-8" style={{ background: "rgba(33,26,46,0.04)", border: `1px solid ${LINE}` }}>
                                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#e11d48" }}>
                                    <Dot color="#e11d48" /> El problema
                                </span>
                                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: MUTED }}>
                                    {p.problem}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <div
                                className="h-full p-6 rounded-3xl md:p-8"
                                style={{
                                    background: "#fff",
                                    border: "1px solid rgba(122,63,196,0.22)",
                                    boxShadow: "0 40px 90px -50px rgba(66,31,110,0.65)",
                                }}
                            >
                                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#7a3fc4" }}>
                                    <Dot color="#7a3fc4" /> La solución
                                </span>
                                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: INK }}>
                                    {p.solution}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ───────────────── LA BARRERA ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24">
                <div className="max-w-5xl mx-auto overflow-hidden rounded-[2rem]" style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
                    <div className="grid gap-8 p-6 md:p-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
                        <div style={{ color: "#5c3606" }}>
                            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#b45309" }}>
                                <TriangleAlert size={14} /> 03 / La barrera
                            </span>
                            <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                                Aquí no se lee una advertencia: se choca contra ella
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "#7c4a06" }}>
                                {p.highlights[0].description}
                            </p>
                            <div className="grid gap-2 mt-6 text-[13px] sm:grid-cols-3">
                                {["El hook no habilita", "El submit corta", "La API responde 400"].map((lock, i) => (
                                    <span
                                        key={lock}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                                        style={{ background: "rgba(180,83,9,0.10)", color: "#7c4a06" }}
                                    >
                                        <Lock size={13} /> {i + 1}. {lock}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recreación jugable del bloque de aviso */}
                        <div className="p-5 bg-white rounded-3xl" style={{ border: "1px solid #fcd34d" }}>
                            <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                                Puerta de pago
                            </p>
                            <div className="flex items-end justify-between mt-3">
                                <span className="text-sm" style={{ color: MUTED }}>
                                    Total del pedido
                                </span>
                                <span className="zo-tab text-2xl font-extrabold" style={{ color: INK }}>
                                    $ 1,14
                                </span>
                            </div>

                            <div className="p-4 mt-4 rounded-2xl" style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
                                <p className="text-[13px] leading-relaxed" style={{ color: "#7c4a06" }}>
                                    <strong>Aviso importante:</strong> las métricas pueden fluctuar o descender tras la
                                    entrega. Las plataformas depuran cuentas y parte de lo entregado puede caer.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setAccepted((v) => !v)}
                                aria-pressed={accepted}
                                className="flex items-start w-full gap-3 mt-4 text-left"
                            >
                                <span
                                    className="grid mt-0.5 rounded h-5 w-5 place-items-center shrink-0 transition-colors duration-300"
                                    style={
                                        accepted
                                            ? { backgroundImage: p.brand.gradient, color: "#fff" }
                                            : { border: "2px solid #b45309" }
                                    }
                                >
                                    {accepted && <Check size={13} strokeWidth={3} />}
                                </span>
                                <span className="text-[13px] leading-snug" style={{ color: INK }}>
                                    Entiendo y acepto el aviso sobre la fluctuación de métricas.
                                </span>
                            </button>

                            <div
                                className="py-3 mt-4 text-sm font-bold text-center transition-all duration-500 rounded-full"
                                style={
                                    accepted
                                        ? { backgroundImage: p.brand.gradient, color: "#fff", boxShadow: "0 20px 40px -22px rgba(122,63,196,0.9)" }
                                        : { background: "rgba(33,26,46,0.08)", color: "rgba(33,26,46,0.35)" }
                                }
                            >
                                Confirmar pedido
                            </div>
                            <p className="mt-3 text-[11px] text-center" style={{ color: MUTED }}>
                                {accepted
                                    ? "Aceptación firmada: el pedido guardará riskAcknowledgedAt y riskNoticeVersion."
                                    : "Marca la casilla para desbloquear el botón. Es la única llave."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────── HIGHLIGHTS ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head
                        index="04 / Decisiones"
                        title={
                            <>
                                Seis piezas donde <span className="brand-gradient-text">se juega la confianza</span>
                            </>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h, i) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="zo-card group relative h-full overflow-hidden rounded-[1.6rem] p-6 transition-transform duration-500 hover:-translate-y-1.5">
                                        <span
                                            aria-hidden
                                            className="absolute inset-x-0 top-0 h-1 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                                            style={{ backgroundImage: p.brand.gradient }}
                                        />
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="inline-grid rounded-2xl h-11 w-11 place-items-center text-white shrink-0"
                                                style={{ backgroundImage: p.brand.gradient }}
                                            >
                                                <Icon size={19} />
                                            </span>
                                            <span className="zo-mono text-[11px]" style={{ color: "rgba(33,26,46,0.28)" }}>
                                                0{i + 1}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-lg font-bold leading-snug" style={{ color: INK }}>
                                            {h.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                                            {h.description}
                                        </p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────── MOCKUPS ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div aria-hidden className="absolute inset-0 zo-grid opacity-70" />
                <div className="relative max-w-6xl mx-auto">
                    <Head
                        index="05 / La interfaz"
                        title={
                            <>
                                Un producto, <span className="brand-gradient-text">tres puertas</span>
                            </>
                        }
                        lead="Cliente, administración y teléfono comparten paleta, tipografía y reglas. Todo en tema claro forzado, todo en español, incluidas las rutas."
                    />

                    <div className="mt-12 space-y-10">
                        {[
                            { url: "zocialy-47c9c.web.app/panel", node: <MockPanel />, screen: p.uiScreens[1] },
                            { url: "zocialy-47c9c.web.app/panel/nueva-orden", node: <MockOrder />, screen: p.uiScreens[2] },
                            { url: "zocialy-47c9c.web.app/admin", node: <MockAdmin />, screen: p.uiScreens[3] },
                        ].map((m, i) => (
                            <Reveal key={m.url} direction="up" delay={i * 0.05}>
                                <BrowserFrame url={m.url} dark={false}>
                                    {m.node}
                                </BrowserFrame>
                                <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
                                    <span className="font-semibold" style={{ color: INK }}>
                                        {m.screen.name}
                                    </span>
                                </p>
                            </Reveal>
                        ))}
                    </div>

                    <div className="grid gap-8 mt-14 lg:grid-cols-[1.6fr_1fr] lg:items-center">
                        <Reveal direction="right">
                            <BrowserFrame url="zocialy-47c9c.web.app/admin/metricas" dark={false}>
                                <MockMetrics />
                            </BrowserFrame>
                            <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
                                <span className="font-semibold" style={{ color: INK }}>
                                    {p.uiScreens[4].name}
                                </span>{" "}
                                — sparklines dibujados a mano, sin librería de gráficas.
                            </p>
                        </Reveal>

                        <Reveal direction="left" delay={0.1} className="max-w-[240px] mx-auto lg:mx-0">
                            <PhoneFrame notch={false}>
                                <MockFlutter />
                            </PhoneFrame>
                            <p className="mt-4 text-[12px]" style={{ color: MUTED }}>
                                <span className="font-semibold" style={{ color: INK }}>
                                    App Flutter de administración
                                </span>{" "}
                                — la misma paleta, para aprobar recargas desde el teléfono.
                            </p>
                        </Reveal>
                    </div>
                </div>
            
                    <SampleDataNote className="mt-8" />
                </section>

            {/* ───────────────── MARCA ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-20" style={{ background: INK }}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                        <div className="text-white">
                            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/45">06 / La marca</span>
                            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                                Una <span className="brand-gradient-text">Z que despega</span> hasta un punto cian
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-white/65">{p.brand.mood}</p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {[
                                    ["primary", p.brand.primary],
                                    ["secondary", p.brand.secondary],
                                    ["accent", p.brand.accent],
                                    ["bg", p.brand.bg],
                                    ["surface", p.brand.surface],
                                    ["text", p.brand.text],
                                ].map(([name, hex]) => (
                                    <span key={name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/8 text-[11px] text-white/70">
                                        <span className="w-4 h-4 rounded-full" style={{ background: hex, border: "1px solid rgba(255,255,255,0.25)" }} />
                                        <span className="zo-mono">{hex}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            {lockup && (
                                <Image
                                    src={lockup.src}
                                    alt={lockup.caption}
                                    width={645}
                                    height={641}
                                    className="w-40 h-auto md:w-56 anim-float"
                                />
                            )}
                        </div>
                    </div>

                    <div className="mt-10">
                        <DragRail>
                            {p.media.map((m) => (
                                <figure
                                    key={m.src}
                                    className="w-[210px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.04] p-4"
                                >
                                    <div className="grid h-24 rounded-xl place-items-center bg-white/90">
                                        <Image src={m.src} alt={m.caption} width={200} height={200} className="object-contain w-auto max-h-20" />
                                    </div>
                                    <figcaption className="mt-3 text-[10.5px] leading-relaxed text-white/55">{m.caption}</figcaption>
                                </figure>
                            ))}
                        </DragRail>
                        <p className="mt-4 text-[11px] text-white/35">
                            Arrastra la tira · {p.media.length} piezas de marca, todas derivadas del mismo isotipo.
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────────────── ARQUITECTURA ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head
                        index="07 / Arquitectura"
                        title={
                            <>
                                El navegador <span className="brand-gradient-text">no escribe dinero</span>
                            </>
                        }
                        lead="El importe que llega del cliente se descarta. La misma función pura que pintó el precio en pantalla lo recalcula en el servidor, y el saldo se mueve dentro de una transacción."
                    />

                    <Reveal className="mt-12">
                        <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
                            {/* Navegador */}
                            <div className="zo-card rounded-[1.6rem] p-5">
                                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                                    <MonitorSmartphone size={14} /> Navegador
                                </span>
                                <p className="mt-3 text-sm font-semibold">POST /api/orders</p>
                                <ul className="zo-mono mt-2 space-y-1 text-[12px]" style={{ color: MUTED }}>
                                    <li>serviceId: 1842</li>
                                    <li>quantity: 1000</li>
                                    <li className="line-through" style={{ color: "#e11d48" }}>
                                        amount: 0.01
                                    </li>
                                </ul>
                                <p className="mt-3 text-[11px]" style={{ color: "#e11d48" }}>
                                    El importe se ignora.
                                </p>
                            </div>

                            <div className="relative flex items-center justify-center py-2 lg:py-0">
                                <div className="relative w-full h-px overflow-hidden lg:w-16" style={{ background: LINE }}>
                                    <span aria-hidden className="zo-comet absolute inset-y-0 w-[40%]" style={{ background: "linear-gradient(90deg,transparent,#f0547e,transparent)" }} />
                                </div>
                            </div>

                            {/* Cloud Run */}
                            <div className="relative rounded-[1.6rem] p-5 text-white overflow-hidden" style={{ backgroundImage: p.brand.gradient }}>
                                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                                    <Server size={14} /> Cloud Run · Next.js
                                </span>
                                <p className="zo-mono mt-3 text-sm font-semibold">calculateCharge(serviceId, quantity)</p>
                                <p className="mt-2 text-[12px] leading-relaxed text-white/80">
                                    La misma función pura que usa la tarjeta de producto, el formulario y la API de reventa.
                                    Lo que se muestra y lo que se cobra no pueden divergir.
                                </p>
                                <div className="relative flex items-center gap-2 mt-4">
                                    <span className="relative grid w-6 h-6 rounded-full place-items-center bg-white/25">
                                        <span aria-hidden className="zo-ring absolute inset-0 rounded-full border border-white/70" />
                                        <Lock size={12} />
                                    </span>
                                    <span className="text-[11px] font-semibold">runTransaction · cobro atómico</span>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-center py-2 lg:py-0">
                                <div className="relative w-full h-px overflow-hidden lg:w-16" style={{ background: LINE }}>
                                    <span aria-hidden className="zo-comet absolute inset-y-0 w-[40%]" style={{ background: "linear-gradient(90deg,transparent,#7a3fc4,transparent)", animationDelay: "0.6s" }} />
                                </div>
                            </div>

                            {/* Firestore */}
                            <div className="zo-card rounded-[1.6rem] p-5">
                                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                                    <Database size={14} /> Firestore
                                </span>
                                <ul className="mt-3 space-y-1.5 text-[12px]">
                                    {[
                                        ["users/{uid}.balance", "− 1,14"],
                                        ["orders/{id}", "creado"],
                                        ["transactions/{id}", "movimiento"],
                                    ].map(([path, note]) => (
                                        <li key={path} className="flex items-center justify-between gap-2">
                                            <span className="zo-mono truncate" style={{ color: MUTED }}>
                                                {path}
                                            </span>
                                            <span className="font-semibold shrink-0" style={{ color: "#059669" }}>
                                                {note}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-3 text-[11px]" style={{ color: MUTED }}>
                                    Si Peakerr rechaza, el importe vuelve con su movimiento trazado.
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="p-6 mt-8 rounded-[1.6rem] md:p-8" style={{ background: "rgba(122,63,196,0.06)", borderLeft: "3px solid #7a3fc4" }}>
                            <p className="text-sm leading-relaxed md:text-base" style={{ color: MUTED }}>
                                {p.architecture}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── FUNCIONALIDADES ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head
                        index="08 / Entregado"
                        title={
                            <>
                                Lista de entrega:{" "}
                                <span className="brand-gradient-text">
                                    {p.features.length} de {p.features.length}
                                </span>
                            </>
                        }
                        lead="No es una lista de deseos: es lo que ya está en producción, contado como el panel cuenta un pedido completado."
                    />

                    <div className="h-2 mt-8 overflow-hidden rounded-full" style={{ background: "rgba(33,26,46,0.07)" }}>
                        <Reveal direction="none" duration={1.4}>
                            <div className="h-2 rounded-full" style={{ backgroundImage: p.brand.gradient }} />
                        </Reveal>
                    </div>

                    <Stagger className="grid gap-x-6 mt-8 md:grid-cols-2" stagger={0.04}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={14}>
                                <div className="flex items-start gap-3 py-3 border-b" style={{ borderColor: LINE }}>
                                    <span
                                        className="grid mt-0.5 rounded-full h-5 w-5 place-items-center shrink-0 text-white"
                                        style={{ backgroundImage: p.brand.gradient }}
                                    >
                                        <Check size={11} strokeWidth={3.5} />
                                    </span>
                                    <span className="zo-mono text-[11px] pt-0.5 shrink-0" style={{ color: "rgba(33,26,46,0.25)" }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm leading-relaxed" style={{ color: MUTED }}>
                                        {f}
                                    </span>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────── STACK ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head index="09 / Stack" title="Con qué está construido" />
                    <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06}>
                                <div className="zo-card h-full rounded-[1.6rem] p-5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-6 rounded-full" style={{ backgroundImage: p.brand.gradient }} />
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#421f6e" }}>
                                            {group.group}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full px-2.5 py-1 text-[11.5px]"
                                                style={{ background: "rgba(122,63,196,0.07)", color: MUTED }}
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

            {/* ───────────────── RETOS ───────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24" style={{ color: INK }}>
                <div className="max-w-6xl mx-auto">
                    <Head
                        index="10 / Lo que costó"
                        title={
                            <>
                                Nueve piedras y <span className="brand-gradient-text">cómo se apartaron</span>
                            </>
                        }
                    />

                    <div className="mt-12 space-y-4">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={(i % 3) * 0.06}>
                                <div className="grid overflow-hidden rounded-[1.6rem] md:grid-cols-2" style={{ border: `1px solid ${LINE}`, background: "#fff" }}>
                                    <div className="p-5 md:p-6" style={{ background: "rgba(33,26,46,0.035)" }}>
                                        <span className="zo-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#e11d48" }}>
                                            reto {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                                            {c.problem}
                                        </p>
                                    </div>
                                    <div className="relative p-5 md:p-6">
                                        <span
                                            aria-hidden
                                            className="absolute left-0 top-0 bottom-0 w-[3px] hidden md:block"
                                            style={{ backgroundImage: p.brand.gradient }}
                                        />
                                        <span className="zo-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#7a3fc4" }}>
                                            solución
                                        </span>
                                        <p className="mt-2 text-sm leading-relaxed" style={{ color: INK }}>
                                            {c.solution}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────── RESUMEN ───────────────── */}
            <section className="relative px-4 py-16 overflow-hidden md:px-6 md:py-24" style={{ color: INK }}>
                <span aria-hidden className="zo-aurora zo-aurora-b" style={{ width: 420, height: 420, bottom: -150, left: "20%", background: "rgba(122,63,196,0.20)" }} />
                <div className="relative max-w-3xl mx-auto">
                    {iconArt && (
                        <Image src={iconArt.src} alt={p.name} width={784} height={842} className="w-16 h-auto mb-8 anim-float" />
                    )}
                    <Stagger className="space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={i === 0 ? "text-lg leading-relaxed md:text-xl" : "text-sm leading-relaxed md:text-base"}
                                    style={{ color: i === 0 ? INK : MUTED }}
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <div className="flex flex-wrap gap-3 mt-10">
                        {p.links.web && (
                            <BrandButton href={p.links.web}>
                                <ArrowUpRight size={16} /> Ver Zocialy en producción
                            </BrandButton>
                        )}
                    </div>
                </div>
            </section>

            <div className="py-5 text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
                <Marquee
                    items={["Peakerr", "Firestore", "Cloud Run", "Telegram Bot API", "Tasa del BCV", "API de reventa", "Riverpod", "node:test"]}
                    speed={30}
                    separator="·"
                />
            </div>

            {/* ───────────────── CIERRE ───────────────── */}
            <div className="pb-32" style={{ background: INK, color: "#faf9fd" }}>
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un panel donde el precio se decide en el servidor, el saldo se mueve en una transacción y la advertencia al cliente es una regla del sistema, no un párrafo decorativo. Si necesitas producto, pasarela y panel de gestión en el mismo repositorio, es exactamente este terreno."
                />
            </div>
        </ProjectShell>
    );
};

export default Landing;
