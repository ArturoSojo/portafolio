"use client"

import Image from "next/image";
import { useState } from "react";
import type { MouseEvent } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    Bell,
    ChevronDown,
    ChevronRight,
    Clock,
    Eye,
    Layers,
    Menu,
    Package,
    Plus,
    Search,
    ShoppingBag,
    Star,
    TrendingUp,
    TriangleAlert,
    User,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Magnetic, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";
import { AutoVideo, BrowserFrame, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";

const p = getProject("joyeria")!;
const nxt = nextProject("joyeria");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Los assets reales del proyecto, localizados por nombre de fichero. */
const asset = (needle: string): string => p.media.find((m) => m.src.includes(needle))?.src ?? "";

const A = {
    logo: asset("landing/logo.png") || asset("/logo.png"),
    logoColor: asset("logo-color"),
    logoWhite: asset("LOCO-BLANCO"),
    logoMark: asset("logo-1"),
    logoText: asset("logo-texto"),
    video: asset("IMG_5539-1.mp4"),
    poster: asset("MAMA-SANDRACANIZAREZ"),
    bannerMama: asset("IMAGEN-FONDO-1"),
    bannerTend: asset("FONDO-2-1"),
    bannerSets: asset("FONDO-OK-1"),
    disena: asset("IMG_5530"),
    cadenas: asset("j6h5trth"),
    pulseras: asset("rujythr"),
    prodA: asset("prod-ANLA043"),
    prodB: asset("prod-ANLA047"),
    sets: asset("SETS-450x450"),
    anillo: asset("anillo-de-18"),
};

/* La galería usa todo lo que no se consume dentro de los mockups. */
const galleryMedia = p.media.filter((m) => m.kind === "image");

/* Los seis perfiles que monta App.tsx, descritos con lo que trae la ficha. */
const ROLES = [
    { n: "01", role: "Admin general", line: "Da de alta joyerías, categorías globales y la compartición de catálogo entre aliadas." },
    { n: "02", role: "Administrador", line: "Dashboard, ventas, inventario, clientes, catálogo, notificaciones y configuración de su joyería." },
    { n: "03", role: "Vendedor", line: "Ventas de stock y órdenes personalizadas, con chat por orden y por venta desde el mostrador." },
    { n: "04", role: "Joyero", line: "Entra directo a /trabajo: pendientes, en progreso y completadas, con el detalle de cada pieza." },
    { n: "05", role: "Cliente", line: "Tienda con filtros combinables, carrito multi-joyería, checkout y seguimiento de sus compras." },
    { n: "06", role: "Usuario", line: "Catálogo público y detalle de producto compartible por URL, sin necesidad de sesión." },
];

/* El ticker de metales, recreado con el formato en pesos del sistema real. */
const METALS = [
    { dot: "#d4af37", label: "Oro 24K", value: "$ 340.120" },
    { dot: "#d8b95a", label: "Oro 18K", value: "$ 255.090" },
    { dot: "#dcc98a", label: "Oro 14K", value: "$ 198.400" },
    { dot: "#e3d6ab", label: "Oro 10K", value: "$ 141.700" },
    { dot: "#c9ccd1", label: "Plata pura", value: "$ 4.320" },
    { dot: "#bcc0c6", label: "Plata 950", value: "$ 4.108" },
    { dot: "#aeb3ba", label: "Plata 925", value: "$ 3.995" },
    { dot: "#9aa0a6", label: "Platino", value: "$ 148.900" },
    { dot: "#8b9196", label: "Paladio", value: "$ 132.400" },
    { dot: "#2f7d4f", label: "TRM", value: "$ 4.012,55" },
];

/* Las capas de src/, con los números que da la ficha. */
const LAYERS = [
    { k: "App.tsx", t: "Orquestador", d: "Lee token y rol de localStorage, expone AuthContext y elige uno de los cuatro árboles de rutas.", tag: "4 árboles" },
    { k: "pages-routes/", t: "Pantallas", d: "Una carpeta por destino; sólo componen y delegan la lógica en el módulo de dominio.", tag: "21 carpetas" },
    { k: "components/<Modulo>/", t: "Dominio", d: "interfaces · functions · modals · ui y un contexto propio: Inventory, Sales, Clients, Settings, Catalog.", tag: "5 contextos" },
    { k: "components/service/", t: "Datos", d: "Un único apiAxios: baseURL de entorno, JSON o multipart según el payload e interceptor de 401.", tag: "25 módulos" },
    { k: "components/ui/", t: "Base", d: "Componentes tipo shadcn sobre Radix; la paleta vive en brand.css y se registra con @theme inline.", tag: "53 piezas" },
];

const css = `
.jy-page { color: #2b2424; }

/* ── El estuche que se abre al cargar ── */
.jy-case {
  position: fixed;
  inset: 0;
  z-index: 70;
  pointer-events: none;
  perspective: 1400px;
  animation: jy-case-hide 1700ms linear forwards;
}
.jy-case-half { position: absolute; left: 0; right: 0; height: 50.2%; background: linear-gradient(180deg, #2a0505, #1a0303); }
.jy-case-top { top: 0; transform-origin: bottom center; animation: jy-lid-up 900ms cubic-bezier(.16,1,.3,1) 240ms forwards; }
.jy-case-bottom { bottom: 0; transform-origin: top center; animation: jy-lid-down 900ms cubic-bezier(.16,1,.3,1) 240ms forwards; }
@keyframes jy-lid-up {
  0% { transform: rotateX(0deg); opacity: 1; }
  60% { opacity: .92; }
  100% { transform: rotateX(-72deg) translateY(-8px); opacity: 0; }
}
@keyframes jy-lid-down {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(12px); opacity: 0; }
}
.jy-case-line {
  position: absolute; left: 10%; right: 10%; top: 50%; height: 1px;
  background: linear-gradient(90deg, transparent, #e6c374 30%, #f4e2ba 50%, #e6c374 70%, transparent);
  animation: jy-line-fade 1100ms ease-out 240ms forwards;
}
@keyframes jy-line-fade { 0% { opacity: .95; } 100% { opacity: 0; transform: scaleX(1.2); } }
.jy-case-glow {
  position: absolute; left: 50%; top: 50%; width: 130vw; height: 46vh;
  transform: translate(-50%, -50%);
  background: radial-gradient(closest-side, rgba(230,195,116,.62), rgba(230,195,116,0) 72%);
  opacity: 0;
  animation: jy-glow 1250ms ease-out 280ms forwards;
}
@keyframes jy-glow { 0% { opacity: 0; } 34% { opacity: .6; } 100% { opacity: 0; } }
@keyframes jy-case-hide { 0%, 93% { visibility: visible; } 100% { visibility: hidden; } }

/* ── Superficies ── */
.jy-serif { font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif; }
.jy-velvet { background-image: radial-gradient(rgba(43,36,36,.05) 1px, transparent 1px); background-size: 7px 7px; }
.jy-velvet-dark { background-image: radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px); background-size: 7px 7px; }
.jy-hair { border: 1px solid #e7ddd2; }
.jy-plate {
  background: linear-gradient(180deg, #2f0606, #1c0303);
  border: 1px solid rgba(184,137,59,.55);
  box-shadow: inset 0 1px 0 rgba(230,195,116,.28);
}

/* ── Destello dorado sobre los títulos ── */
.jy-gold {
  background-image: linear-gradient(100deg, #8a6222 0%, #b8893b 32%, #f6e4c4 48%, #b8893b 64%, #8a6222 100%);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: jy-sheen 6s ease-in-out infinite;
}
@keyframes jy-sheen {
  0% { background-position: 200% 0; }
  20% { background-position: -200% 0; }
  100% { background-position: -200% 0; }
}
.jy-gold-static {
  background-image: linear-gradient(135deg, #e6c374, #b8893b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* El mismo oro, rebajado para leerse sobre la crema. */
.jy-gold-ink {
  background-image: linear-gradient(135deg, #b8893b, #7d5718);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ── Piezas sobre paño: reflejo diagonal al pasar el ratón ── */
.jy-piece-card {
  position: relative;
  overflow: hidden;
  transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s ease, border-color .5s ease;
}
.jy-piece-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(93,1,1,.18); border-color: rgba(184,137,59,.85); }
.jy-piece-card::after {
  content: "";
  position: absolute; top: -70%; bottom: -70%; width: 38%; left: -60%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
  transform: rotate(20deg);
  opacity: 0;
  pointer-events: none;
}
.jy-piece-card:hover::after { animation: jy-reflect 600ms ease-out 1; }
@keyframes jy-reflect {
  0% { left: -60%; opacity: 0; }
  18% { opacity: .85; }
  100% { left: 120%; opacity: 0; }
}

/* ── Vitrina: foco dorado atado al cursor ── */
.jy-vitrine-card { position: relative; isolation: isolate; }
.jy-vitrine-card::before {
  content: "";
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 0;
  background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgba(184,137,59,.22), transparent 62%);
  opacity: 0;
  transition: opacity .45s ease;
}
.jy-vitrine-card:hover::before { opacity: 1; }

/* ── Cinta de metales ── */
.jy-ticker { overflow: hidden; }
.jy-ticker-track { display: flex; width: max-content; animation: jy-ticker-run 30s linear infinite; }
.jy-ticker:hover .jy-ticker-track { animation-play-state: paused; }
@keyframes jy-ticker-run { to { transform: translateX(-50%); } }

/* ── Cajones de retos ── */
.jy-drawer { transition: background .45s ease, border-color .45s ease, box-shadow .45s ease; }
.jy-drawer-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 520ms cubic-bezier(.16,1,.3,1); }
.jy-drawer-body.jy-open { grid-template-rows: 1fr; }
.jy-drawer-inner { overflow: hidden; }
.jy-drawer-edge { transition: opacity .45s ease; opacity: 0; }
.jy-drawer.jy-lit .jy-drawer-edge { opacity: 1; }
.jy-drawer-chevron { transition: transform .45s cubic-bezier(.16,1,.3,1); }
.jy-drawer.jy-lit .jy-drawer-chevron { transform: rotate(180deg); }

/* ── Bandeja de funcionalidades ── */
.jy-feat { transition: transform .4s ease, background-color .4s ease; }
.jy-feat:hover { transform: translateX(6px); }
.jy-feat .jy-rule { width: 16px; transition: width .5s cubic-bezier(.16,1,.3,1); }
.jy-feat:hover .jy-rule { width: 46px; }

/* ── Esqueleto con brillo del catálogo real ── */
.jy-skel { background: linear-gradient(90deg, #ece3d8 25%, #f8f3ec 50%, #ece3d8 75%); background-size: 200% 100%; animation: jy-skel-run 1.5s linear infinite; }
@keyframes jy-skel-run { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ── El vídeo real dentro del mockup de la landing ── */
.jy-herovid video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border: 0; border-radius: 0; }

/* ── Anillo pulsante del botón de WhatsApp ── */
.jy-ring { animation: brand-pulse-ring 2.2s ease-out infinite; }

/* ── Muestrario: las capturas reales conservan un alto común ── */
.jy-rail figure img { height: 230px; width: 100%; object-fit: cover; }
@media (min-width: 768px) { .jy-rail figure img { height: 280px; } }

/* ── Producto del mockup: zoom al pasar el ratón ── */
.jy-shot { transition: transform .7s cubic-bezier(.16,1,.3,1); }
.jy-shot-wrap:hover .jy-shot { transform: scale(1.14); }

@media (prefers-reduced-motion: reduce) {
  .jy-case { display: none !important; }
  .jy-gold, .jy-ticker-track, .jy-skel, .jy-ring { animation: none !important; }
  .jy-piece-card:hover { transform: none; }
  .jy-piece-card:hover::after { animation: none !important; }
  .jy-feat:hover { transform: none; }
  .jy-shot-wrap:hover .jy-shot { transform: none; }
  .jy-drawer-body { transition: none; }
}
`;

/* ───────────────────────── Piezas propias ───────────────────────── */

/** Placa dorada grabada: el formato de las cifras en portada. */
const Plate = ({ value, label }: { value: string; label: string }) => (
    <div className="jy-plate rounded-[3px] px-4 py-3 text-center">
        <p className="jy-serif jy-gold-static text-2xl font-bold leading-none md:text-3xl">{value}</p>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#f7f2ec]/55">{label}</p>
    </div>
);

/** Rótulo de sección en versalitas doradas. */
const Kicker = ({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) => (
    <span
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.34em]"
        style={{ color: tone === "dark" ? "#8a6222" : "#e6c374" }}
    >
        <span className="inline-block h-px w-6" style={{ background: "currentColor" }} />
        {children}
    </span>
);

/** La cinta de cotizaciones, tal cual la ve el vendedor bajo la cabecera. */
const MetalTicker = ({ compact = false }: { compact?: boolean }) => {
    const line = [...METALS, ...METALS];
    return (
        <div className={`jy-ticker ${compact ? "bg-white" : "bg-[#fffdfa]"} border-y border-[#e7ddd2]`}>
            <div className="jy-ticker-track">
                {line.map((m, i) => (
                    <span
                        key={`${m.label}-${i}`}
                        className={`inline-flex shrink-0 items-center gap-2 border-r border-[#e7ddd2] ${
                            compact ? "px-3 py-1 text-[8px]" : "px-5 py-2 text-[12px]"
                        }`}
                    >
                        <span
                            className={`rounded-full ${compact ? "h-1 w-1" : "h-1.5 w-1.5"}`}
                            style={{ background: m.dot }}
                        />
                        <span className="font-medium text-[#2b2424]/60">{m.label}</span>
                        <span className="font-semibold text-[#2b2424]">{m.value}</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

/* ───────────── Mockup 1 · Landing pública de la joyería ───────────── */

const MockLanding = () => (
    <div className="bg-white text-[#2b2424]">
        {/* marquesina de anuncios */}
        <div className="bg-[#8d0101] py-[7px] text-[9px] font-medium text-white">
            <Marquee
                items={[
                    "Personaliza tus prendas a tu estilo",
                    "Envío gratis en compras superiores a $500.000 COP",
                    "Diseños hechos a mano en nuestro taller",
                    "Asesoría por WhatsApp de lunes a sábado",
                ]}
                speed={26}
                separator="·"
            />
        </div>

        {/* cabecera pegajosa */}
        <div className="flex items-center justify-between border-b border-[#e7ddd2] bg-white/96 px-4 py-2.5">
            {A.logo ? (
                <Image src={A.logo} alt="Sandra Cañizarez" width={140} height={44} className="h-6 w-auto object-contain" />
            ) : (
                <span className="jy-serif text-sm font-bold">Sandra Cañizarez</span>
            )}
            <div className="hidden items-center gap-4 text-[9px] font-medium text-[#2b2424] sm:flex">
                {["Inicio", "Colecciones", "Destacados", "Personaliza", "Reviews"].map((item, i) => (
                    <span key={item} className={i === 0 ? "text-[#8d0101]" : ""}>
                        {item}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-2 text-[9px]">
                <span className="rounded-full border border-[#e7ddd2] px-2 py-0.5">Catálogo</span>
                <span className="inline-flex items-center gap-1 text-[#8d0101]">
                    <User size={9} /> Iniciar sesión
                </span>
            </div>
        </div>

        {/* hero con el vídeo real */}
        <div className="relative h-[228px] overflow-hidden bg-[#1a0303] md:h-[300px]">
            {A.video ? (
                <div className="jy-herovid absolute inset-0">
                    <AutoVideo src={A.video} poster={A.poster || undefined} rounded="rounded-none" />
                </div>
            ) : (
                A.poster && <Image src={A.poster} alt="" fill sizes="600px" className="object-cover" />
            )}
            <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(20,6,6,.35), rgba(20,6,6,.15) 45%, rgba(20,6,6,.55))" }}
            />
            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 text-center">
                <p className="jy-serif text-xl font-bold leading-tight text-white md:text-3xl">
                    Descubre el Brillo
                    <br />
                    <span className="text-[#f6e4c4]">de lo Inolvidable</span>
                </p>
                <p className="mx-auto mt-2 max-w-[280px] text-[9px] leading-relaxed text-white/80 md:text-[11px]">
                    Piezas hechas a mano en nuestro taller de Cúcuta, pensadas para durar toda una vida.
                </p>
            </div>
        </div>

        {/* banda crema con el eslogan */}
        <div className="bg-[#f7f2ec] px-4 py-5 text-center">
            <p className="jy-serif text-[13px] font-semibold leading-snug">
                Joyería Cúcuta · Colombia
                <br />
                <span className="text-[#8a6222]">Oro, Piedras preciosas</span>
            </p>
        </div>

        {/* círculos de colección */}
        <div className="flex items-start justify-center gap-4 px-4 py-6 sm:gap-7">
            {[
                { src: A.sets, name: "Sets" },
                { src: A.anillo, name: "Anillos" },
                { src: A.prodA, name: "Cadenas" },
                { src: A.prodB, name: "Aretes" },
            ].map((c) =>
                c.src ? (
                    <span key={c.name} className="flex w-[52px] flex-col items-center gap-1.5 sm:w-[68px]">
                        <span className="relative block h-[52px] w-[52px] overflow-hidden rounded-full border border-[#e7ddd2] sm:h-[68px] sm:w-[68px]">
                            <Image src={c.src} alt={c.name} fill sizes="70px" className="object-cover" />
                        </span>
                        <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-[#2b2424]/70">{c.name}</span>
                    </span>
                ) : null
            )}
        </div>

        {/* tres banners de colección */}
        <div className="grid grid-cols-3 gap-1.5 px-3">
            {[
                { src: A.bannerMama, title: "Joyas para mamá" },
                { src: A.bannerTend, title: "Tendencias" },
                { src: A.bannerSets, title: "Sets para Regalar" },
            ].map((b) =>
                b.src ? (
                    <div key={b.title} className="group relative h-[92px] overflow-hidden rounded-[3px]">
                        <Image src={b.src} alt={b.title} fill sizes="220px" className="object-cover" />
                        <span className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/55" />
                        <div className="absolute inset-x-0 bottom-0 p-2">
                            <p className="jy-serif text-[10px] font-bold leading-tight text-white">{b.title}</p>
                            <p className="mt-0.5 text-[7px] text-[#f6e4c4]">Ver Colección →</p>
                        </div>
                    </div>
                ) : null
            )}
        </div>

        {/* destacados por categoría */}
        <div className="px-4 py-7">
            <p className="text-center text-[8px] font-semibold uppercase tracking-[0.3em] text-[#b8893b]">Nuestra selección</p>
            <p className="jy-serif mt-1 text-center text-[15px] font-bold">Piezas destacadas</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                {["Anillos", "Cadenas", "Aretes", "Pulseras", "Sets"].map((t, i) => (
                    <span
                        key={t}
                        className={`rounded-full border px-2.5 py-1 text-[8px] font-medium ${
                            i === 0
                                ? "border-[#8d0101] bg-[#8d0101] text-white"
                                : "border-[#e7ddd2] text-[#2b2424]/65"
                        }`}
                    >
                        {t}
                    </span>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                    { src: A.prodA, name: "Anillo ANLA043", cat: "Anillos", price: "$ 1.280.000" },
                    { src: A.prodB, name: "Anillo ANLA047", cat: "Anillos", price: "$ 940.000" },
                    { src: A.anillo, name: "Anillo oro 18k", cat: "Anillos", price: "$ 2.150.000" },
                    { src: "", name: "", cat: "", price: "" },
                ].map((prod, i) => (
                    <div key={i} className="overflow-hidden rounded-[3px] border border-[#efe7dd]">
                        {prod.src ? (
                            <>
                                <div className="jy-shot-wrap relative h-[74px] overflow-hidden bg-[#f7f2ec]">
                                    <Image src={prod.src} alt={prod.name} fill sizes="120px" className="jy-shot object-cover" />
                                </div>
                                <div className="p-1.5">
                                    <p className="text-[6px] uppercase tracking-[0.12em] text-[#2b2424]/45">{prod.cat}</p>
                                    <p className="truncate text-[8px] font-semibold">{prod.name}</p>
                                    <p className="text-[8px] font-bold text-[#8d0101]">{prod.price}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* el esqueleto con brillo mientras responde el API */}
                                <div className="jy-skel h-[74px]" />
                                <div className="space-y-1 p-1.5">
                                    <div className="jy-skel h-1.5 w-8 rounded-full" />
                                    <div className="jy-skel h-1.5 w-full rounded-full" />
                                    <div className="jy-skel h-1.5 w-10 rounded-full" />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* diseña tu propia joya */}
        <div className="relative h-[130px] overflow-hidden">
            {A.disena && <Image src={A.disena} alt="" fill sizes="600px" className="object-cover" />}
            <span aria-hidden className="absolute inset-0 bg-[#1a0303]/62" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <p className="jy-serif text-[15px] font-bold text-white">Diseña tu propia joya</p>
                <p className="max-w-[240px] text-[8px] text-white/75">
                    Cuéntanos qué tienes en mente y lo trabajamos contigo, pieza por pieza.
                </p>
                <span
                    className="rounded-full px-3 py-1 text-[8px] font-bold text-[#2b2424]"
                    style={{ backgroundImage: "linear-gradient(135deg,#e6c374,#b8893b)" }}
                >
                    Asesoría por WhatsApp
                </span>
            </div>
        </div>

        {/* tarjetas de personalización */}
        <div className="grid grid-cols-4 gap-2 px-4 py-6">
            {[
                { src: A.cadenas, name: "Cadenas personalizadas" },
                { src: A.pulseras, name: "Pulseras grabadas" },
                { src: A.sets, name: "Sets a medida" },
                { src: A.anillo, name: "Anillos de compromiso" },
            ].map((c) =>
                c.src ? (
                    <div key={c.name} className="overflow-hidden rounded-[3px] border border-[#efe7dd]">
                        <div className="relative h-[58px] bg-[#f7f2ec]">
                            <Image src={c.src} alt={c.name} fill sizes="120px" className="object-cover" />
                        </div>
                        <p className="p-1.5 text-[7px] font-medium leading-tight">{c.name}</p>
                    </div>
                ) : null
            )}
        </div>

        {/* reseñas de Google */}
        <div className="grid grid-cols-3 gap-2 bg-[#f7f2ec] px-4 py-6">
            {[
                { ini: "MC", name: "María C.", text: "El anillo quedó idéntico al diseño que llevé. Trabajo impecable." },
                { ini: "JR", name: "Jorge R.", text: "Me asesoraron por WhatsApp y me lo enviaron a Bogotá en dos días." },
                { ini: "LP", name: "Laura P.", text: "Compré el set para mi mamá y le encantó. Vuelvo seguro." },
            ].map((r) => (
                <div key={r.ini} className="rounded-[3px] border border-[#e7ddd2] bg-white p-2">
                    <div className="flex items-center gap-1.5">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#8d0101] text-[7px] font-bold text-white">
                            {r.ini}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-[7px] font-semibold">{r.name}</p>
                            <p className="text-[6px] text-[#2f7d4f]">✓ Verificada</p>
                        </div>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                        {[0, 1, 2, 3, 4].map((s) => (
                            <Star key={s} size={6} className="fill-[#e6c374] text-[#e6c374]" />
                        ))}
                    </div>
                    <p className="mt-1 text-[6.5px] leading-relaxed text-[#2b2424]/65">{r.text}</p>
                </div>
            ))}
        </div>

        {/* pie burdeos */}
        <div className="relative bg-[#8d0101] px-4 py-6 text-white">
            {A.logoWhite && (
                <Image src={A.logoWhite} alt="Sandra Cañizarez" width={200} height={47} className="h-4 w-auto object-contain" />
            )}
            <div className="mt-3 grid grid-cols-3 gap-3 text-[7px] leading-relaxed text-white/70">
                <p>Cúcuta, Norte de Santander · Colombia</p>
                <p>Lunes a sábado, 9:00 a 19:00</p>
                <p>Instagram · Facebook · WhatsApp</p>
            </div>
            <span className="absolute bottom-4 right-4 grid h-7 w-7 place-items-center rounded-full bg-[#25D366]">
                <span aria-hidden className="jy-ring absolute inset-0 rounded-full bg-[#25D366]/60" />
                <Icons.MessageCircle size={13} className="relative text-white" />
            </span>
        </div>
    </div>
);

/* ───────────── Mockup 2 · Dashboard del administrador ───────────── */

const MockDashboard = () => (
    <div className="absolute inset-0 overflow-y-auto scrollbar-none bg-[#f7f2ec] text-[#2b2424]">
        <div className="sticky top-0 z-10">
            <div className="flex items-center gap-2 bg-[#8d0101] px-3 pb-2 pt-7 text-white">
                <Menu size={13} />
                <span className="text-[10px] font-semibold">Joyería Sandra Cañizarez</span>
                <Bell size={12} className="ml-auto" />
            </div>
            <MetalTicker compact />
        </div>

        <div className="space-y-2 p-2.5">
            <div className="grid grid-cols-2 gap-2">
                {[
                    { label: "Ventas Mes", value: "$ 42.8M", extra: "+12,4%", color: "#EAB308", tone: "#2f7d4f" },
                    { label: "Total Órdenes", value: "184", extra: "+8 hoy", color: "#22C55E", tone: "#2f7d4f" },
                    { label: "Órdenes Pendientes", value: "23", extra: "−3 vs ayer", color: "#3B82F6", tone: "#b91c1c" },
                    { label: "Clientes", value: "612", extra: "9 nuevos", color: "#A855F7", tone: "#7e22ce" },
                ].map((c) => (
                    <div
                        key={c.label}
                        className="rounded-[10px] bg-white p-2 shadow-[0_1px_2px_rgba(43,36,36,.06)]"
                        style={{ borderLeft: `4px solid ${c.color}` }}
                    >
                        <p className="text-[7px] uppercase tracking-[0.1em] text-[#2b2424]/45">{c.label}</p>
                        <p className="mt-0.5 text-[15px] font-bold leading-none">{c.value}</p>
                        <p className="mt-1 text-[7px] font-semibold" style={{ color: c.tone }}>
                            {c.extra}
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-[10px] bg-white p-2.5">
                <p className="text-[9px] font-semibold">Tendencia de Ventas</p>
                <svg viewBox="0 0 240 76" className="mt-1.5 h-[68px] w-full" preserveAspectRatio="none">
                    {[10, 25, 40, 55, 70].map((y) => (
                        <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#d9d2c8" strokeDasharray="2 3" strokeWidth="0.7" />
                    ))}
                    <path
                        d="M4,62 L36,52 L68,58 L100,38 L132,44 L164,26 L196,32 L232,14"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {[
                        [4, 62],
                        [36, 52],
                        [68, 58],
                        [100, 38],
                        [132, 44],
                        [164, 26],
                        [196, 32],
                        [232, 14],
                    ].map(([cx, cy]) => (
                        <circle key={`${cx}`} cx={cx} cy={cy} r="1.8" fill="#EAB308" />
                    ))}
                </svg>
                <div className="flex justify-between text-[6px] text-[#2b2424]/40">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>
            </div>

            <div className="rounded-[10px] bg-white p-2.5">
                <p className="text-[9px] font-semibold">Productos Más Vendidos</p>
                <div className="mt-2 space-y-1.5">
                    {[
                        { n: "Anillo oro 18k", pct: 82, c: "#EAB308" },
                        { n: "Cadena barbada 14k", pct: 68, c: "#F59E0B" },
                        { n: "Set aretes + dije", pct: 54, c: "#D97706" },
                        { n: "Pulsera grabada", pct: 41, c: "#B45309" },
                        { n: "Argollas de matrimonio", pct: 29, c: "#92400E" },
                    ].map((b) => (
                        <div key={b.n}>
                            <div className="flex items-center justify-between text-[7px]">
                                <span className="text-[#2b2424]/70">{b.n}</span>
                                <span className="font-semibold">{b.pct}%</span>
                            </div>
                            <div className="mt-0.5 h-1 rounded-full bg-[#f0eae2]">
                                <div
                                    className="h-1 rounded-full"
                                    style={{ width: `${b.pct}%`, background: `linear-gradient(90deg, ${b.c}, #EAB308)` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[10px] bg-white p-2.5">
                <p className="text-[9px] font-semibold">Notificaciones</p>
                <div className="mt-1.5 space-y-1">
                    {[
                        { t: "Material bajo mínimo: oro 18k", c: "#ef4444", bg: "rgba(239,68,68,.07)" },
                        { t: "Orden ORD-1188 lista para entrega", c: "#EAB308", bg: "rgba(234,179,8,.09)" },
                        { t: "Nuevo mensaje del cliente en VTA-0421", c: "#3B82F6", bg: "rgba(59,130,246,.08)" },
                    ].map((n) => (
                        <div
                            key={n.t}
                            className="flex items-center gap-1.5 rounded-[4px] py-1 pl-2 pr-1.5 text-[7px]"
                            style={{ background: n.bg, borderLeft: `2px solid ${n.c}` }}
                        >
                            <span className="flex-1 leading-snug text-[#2b2424]/80">{n.t}</span>
                            <span className="h-1 w-1 shrink-0 rounded-full bg-[#3B82F6]" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[10px] bg-white p-2.5">
                <p className="text-[9px] font-semibold">Órdenes Recientes</p>
                <div className="mt-1.5 space-y-1">
                    {[
                        { sku: "ORD-1188 · Anillo a medida", s: "Entregado", c: "#2f7d4f", bg: "rgba(47,125,79,.12)" },
                        { sku: "ORD-1187 · Cadena 60 cm", s: "En proceso", c: "#1d4ed8", bg: "rgba(29,78,216,.10)" },
                        { sku: "ORD-1186 · Set de aretes", s: "Pendiente", c: "#a16207", bg: "rgba(234,179,8,.14)" },
                    ].map((o) => (
                        <div key={o.sku} className="flex items-center justify-between rounded-[4px] bg-[#faf7f3] px-2 py-1.5">
                            <span className="truncate text-[7px] text-[#2b2424]/75">{o.sku}</span>
                            <span
                                className="shrink-0 rounded-full px-1.5 py-0.5 text-[6px] font-semibold"
                                style={{ background: o.bg, color: o.c }}
                            >
                                {o.s}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className="rounded-[10px] p-2.5"
                style={{ backgroundImage: "linear-gradient(90deg,#FDE68A,#EAB308)" }}
            >
                <p className="text-[9px] font-bold text-black">Acciones Rápidas</p>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {["Nueva Venta/Orden", "Ver Inventario"].map((b) => (
                        <span key={b} className="rounded-[5px] bg-black px-2 py-1.5 text-center text-[7px] font-semibold text-[#EAB308]">
                            {b}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ───────────── Mockup 3 · Tienda del cliente ───────────── */

const MockStore = () => (
    <div className="bg-[#faf8f5] p-4 text-[#2b2424]">
        <p className="jy-serif text-[15px] font-bold">Catálogo de joyeria</p>
        <p className="text-[9px] text-[#2b2424]/50">Explora las piezas disponibles en todas las joyerías aliadas.</p>

        <div className="mt-3 rounded-[8px] border border-[#e7ddd2] bg-white p-2.5">
            <div className="flex flex-wrap items-center gap-2">
                <span className="flex min-w-[140px] flex-1 items-center gap-1.5 rounded-[6px] border border-[#EAB308] bg-white px-2 py-1.5 ring-2 ring-[#EAB308]/25">
                    <Search size={11} className="text-[#2b2424]/40" />
                    <span className="text-[9px] text-[#2b2424]/45">Buscar anillo, cadena, set…</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#e7ddd2] px-2 py-1.5 text-[9px]">
                    Todas las categorías <ChevronDown size={10} />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#EAB308] bg-[#FEF9C3] px-2 py-1.5 text-[9px] font-medium">
                    Filtros
                    <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#EAB308] text-[7px] font-bold text-black">
                        3
                    </span>
                </span>
                <span className="ml-auto inline-flex overflow-hidden rounded-[6px] border border-[#e7ddd2]">
                    <span className="bg-[#8d0101] px-2 py-1.5 text-[9px] text-white">Rejilla</span>
                    <span className="border-l border-[#e7ddd2] px-2 py-1.5 text-[9px] text-[#2b2424]/55">Lista</span>
                </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {["Joyería", "Material", "Género", "Ordenar por precio"].map((s) => (
                    <span key={s} className="inline-flex items-center justify-between rounded-[6px] border border-[#e7ddd2] px-2 py-1.5 text-[8px] text-[#2b2424]/65">
                        {s} <ChevronDown size={9} />
                    </span>
                ))}
            </div>

            <div className="mt-2.5 border-t border-[#efe7dd] pt-2.5">
                <div className="flex items-center justify-between text-[8px]">
                    <span className="text-[#2b2424]/55">Rango de precio</span>
                    <span className="font-semibold text-[#8d0101]">$ 1.850.000</span>
                </div>
                <div className="relative mt-2 h-1 rounded-full bg-[#efe7dd]">
                    <span className="absolute inset-y-0 left-0 w-[62%] rounded-full bg-[#8d0101]" />
                    <span className="absolute left-[62%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#8d0101] bg-white" />
                </div>
                <div className="mt-1 flex justify-between text-[7px] text-[#2b2424]/40">
                    <span>$ 0</span>
                    <span>$ 3.000.000</span>
                </div>
            </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
            <p className="text-[10px] font-semibold">Piezas disponibles</p>
            <p className="text-[8px] text-[#2b2424]/45">48 productos</p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
                { src: A.prodA, name: "Anillo ANLA043", shop: "Sandra Cañizarez", price: "$ 1.280.000", star: true, out: false },
                { src: A.prodB, name: "Anillo ANLA047", shop: "Sandra Cañizarez", price: "$ 940.000", star: false, out: false },
                { src: A.anillo, name: "Anillo oro 18k", shop: "Sandra Cañizarez", price: "$ 2.150.000", star: false, out: true },
                { src: A.sets, name: "Set completo", shop: "Joyería aliada", price: "$ 1.640.000", star: true, out: false },
            ].map((prod) =>
                prod.src ? (
                    <div key={prod.name} className="overflow-hidden rounded-[8px] border border-[#e7ddd2] bg-white">
                        <div className="jy-shot-wrap relative aspect-[4/3] overflow-hidden bg-[#f7f2ec]">
                            <Image src={prod.src} alt={prod.name} fill sizes="220px" className="jy-shot object-cover" />
                            <span className="absolute inset-0 bg-black/0 transition-colors duration-500 hover:bg-black/10" />
                            {prod.star && (
                                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-[#EAB308] px-1.5 py-0.5 text-[6px] font-bold text-black">
                                    <Star size={6} className="fill-black text-black" /> Destacado
                                </span>
                            )}
                            <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-white shadow">
                                <Eye size={8} className="text-[#2b2424]/70" />
                            </span>
                            {prod.out && (
                                <span className="absolute inset-0 grid place-items-center bg-black/50">
                                    <span className="rounded-full bg-[#b91c1c] px-2 py-0.5 text-[7px] font-bold text-white">
                                        No Disponible
                                    </span>
                                </span>
                            )}
                        </div>
                        <div className="p-2">
                            <p className="truncate text-[9px] font-semibold">{prod.name}</p>
                            <p className="text-[7px] text-[#2b2424]/45">{prod.shop}</p>
                            <div className="mt-1.5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#8d0101]">{prod.price}</span>
                                <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-[#8d0101] text-white">
                                    <ShoppingBag size={9} />
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null
            )}
        </div>
    </div>
);

/* ───────────── Mockup 4 · Panel de trabajo del joyero ───────────── */

const MockJoyero = () => (
    <div className="absolute inset-0 overflow-y-auto scrollbar-none bg-[#f7f2ec] text-[#2b2424]">
        <div className="px-3 pb-3 pt-9">
            <p className="jy-serif text-[14px] font-bold">Mi Panel de Trabajo</p>
            <p className="text-[8px] text-[#2b2424]/50">Gestiona tus órdenes y comisiones</p>

            <div className="mt-3 space-y-2">
                {[
                    { label: "Pendientes", value: "7", color: "#EAB308", Icon: Clock },
                    { label: "Órdenes Activas", value: "4", color: "#3B82F6", Icon: Package },
                    { label: "Completadas", value: "38", color: "#A855F7", Icon: TrendingUp },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="flex items-center gap-2.5 rounded-[10px] bg-white p-2.5"
                        style={{ borderLeft: `4px solid ${s.color}` }}
                    >
                        <span
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px]"
                            style={{ background: `${s.color}22`, color: s.color }}
                        >
                            <s.Icon size={16} />
                        </span>
                        <div>
                            <p className="text-[7px] uppercase tracking-[0.12em] text-[#2b2424]/45">{s.label}</p>
                            <p className="text-[18px] font-bold leading-none">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 grid grid-cols-1 overflow-hidden rounded-[8px] border border-[#e7ddd2] text-center text-[8px]">
                {["Órdenes Pendientes", "Órdenes en Progreso", "Órdenes Completadas"].map((t, i) => (
                    <span
                        key={t}
                        className={`border-b border-[#e7ddd2] py-1.5 last:border-0 ${
                            i === 0 ? "bg-[#8d0101] font-semibold text-white" : "bg-white text-[#2b2424]/60"
                        }`}
                    >
                        {t}
                    </span>
                ))}
            </div>

            <div className="mt-2.5 space-y-2">
                {[
                    { id: "ORD-1188", pieza: "Anillo a medida · oro 18k", cli: "María C.", peso: "6,4 g", av: 35 },
                    { id: "ORD-1191", pieza: "Argollas grabadas · oro 14k", cli: "Jorge R.", peso: "9,1 g", av: 10 },
                    { id: "ORD-1195", pieza: "Dije con esmeralda 0,8 ct", cli: "Laura P.", peso: "3,2 g", av: 60 },
                ].map((o) => (
                    <div key={o.id} className="rounded-[8px] border border-[#e7ddd2] bg-white p-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold text-[#8d0101]">{o.id}</span>
                            <span className="rounded-full bg-[#FEF9C3] px-1.5 py-0.5 text-[6px] font-semibold text-[#a16207]">
                                Pendiente
                            </span>
                        </div>
                        <p className="mt-1 text-[8px] font-medium">{o.pieza}</p>
                        <p className="text-[7px] text-[#2b2424]/45">
                            {o.cli} · {o.peso}
                        </p>
                        <div className="mt-1.5 h-1 rounded-full bg-[#f0eae2]">
                            <div className="h-1 rounded-full bg-[#8d0101]" style={{ width: `${o.av}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="sticky bottom-0 grid grid-cols-2 border-t border-[#e7ddd2] bg-white text-center text-[7px]">
            <span className="py-2 font-semibold text-[#8d0101]">Trabajo</span>
            <span className="py-2 text-[#2b2424]/45">Perfil</span>
        </div>
    </div>
);

/* ───────────── Mockup 5 · Inventario de materiales ───────────── */

const MockInventario = () => (
    <div className="bg-white p-4 text-[#2b2424]">
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
                <p className="jy-serif text-[14px] font-bold">Inventario de materiales</p>
                <p className="text-[8px] text-[#2b2424]/50">Metales, piedras y componentes del taller</p>
            </div>
            <div className="flex gap-1.5">
                {["Agregar material", "Nuevo préstamo"].map((b, i) => (
                    <span
                        key={b}
                        className={`inline-flex items-center gap-1 rounded-[6px] px-2 py-1.5 text-[8px] font-medium ${
                            i === 0 ? "bg-[#8d0101] text-white" : "border border-[#e7ddd2] text-[#2b2424]/70"
                        }`}
                    >
                        <Plus size={9} /> {b}
                    </span>
                ))}
            </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 rounded-[6px] border border-[#f59e0b]/40 bg-[#FEF9C3] px-2 py-1.5 text-[8px] text-[#92400E]">
            <TriangleAlert size={10} /> 3 materiales por debajo del mínimo
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[
                ["Total materiales", "126"],
                ["Movimientos hoy / ayer", "14 / 9"],
                ["Costo del inventario", "$ 318.940.000"],
            ].map(([k, v]) => (
                <div key={k} className="rounded-[8px] border border-[#e7ddd2] bg-[#faf8f5] p-2">
                    <p className="text-[7px] uppercase tracking-[0.1em] text-[#2b2424]/45">{k}</p>
                    <p className="mt-0.5 text-[12px] font-bold">{v}</p>
                </div>
            ))}
        </div>

        <div className="mt-3 flex gap-1.5 border-b border-[#e7ddd2] text-[8px]">
            {["Materiales", "Movimientos", "Préstamos externos", "Precios"].map((t, i) => (
                <span
                    key={t}
                    className={`px-2 pb-1.5 ${
                        i === 0 ? "border-b-2 border-[#8d0101] font-semibold text-[#8d0101]" : "text-[#2b2424]/50"
                    }`}
                >
                    {t}
                </span>
            ))}
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2 lg:grid-cols-3">
            {[
                { n: "Oro 18K", tipo: "Metal · 18 quilates", ex: "412,60 g", pu: "$ 255.090 / g", low: false },
                { n: "Plata 925", tipo: "Metal · 925", ex: "1.204,00 g", pu: "$ 3.995 / g", low: false },
                { n: "Esmeralda", tipo: "Piedra · 0,8 ct · verde · VS", ex: "12 ct", pu: "$ 1.900.000 / ct", low: true },
                { n: "Oro 14K", tipo: "Metal · 14 quilates", ex: "86,20 g", pu: "$ 198.400 / g", low: true },
                { n: "Broche mosquetón", tipo: "Componente", ex: "240 uds", pu: "$ 5.400 / ud", low: false },
                { n: "Rodio de baño", tipo: "Otros", ex: "0,8 L", pu: "$ 740.000 / L", low: true },
            ].map((m) => (
                <div key={m.n} className="rounded-[8px] border border-[#e7ddd2] p-2">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-[9px] font-semibold">{m.n}</p>
                        <span
                            className="shrink-0 rounded-full px-1.5 py-0.5 text-[6px] font-semibold"
                            style={
                                m.low
                                    ? { background: "rgba(185,28,28,.10)", color: "#b91c1c" }
                                    : { background: "rgba(47,125,79,.12)", color: "#2f7d4f" }
                            }
                        >
                            {m.low ? "Stock bajo" : "En stock"}
                        </span>
                    </div>
                    <p className="text-[7px] text-[#2b2424]/45">{m.tipo}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[8px]">
                        <span className="text-[#2b2424]/65">{m.ex}</span>
                        <span className="font-semibold">{m.pu}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/* ───────────── Cajón de reto ───────────── */

const RetoDrawer = ({
    index,
    problem,
    solution,
    open,
    onToggle,
}: {
    index: number;
    problem: string;
    solution: string;
    open: boolean;
    onToggle: () => void;
}) => (
    <div
        className={`jy-drawer relative overflow-hidden rounded-[4px] border border-[#e7ddd2] bg-white ${open ? "jy-lit" : ""}`}
        style={open ? { boxShadow: "0 18px 40px rgba(93,1,1,.14)" } : undefined}
    >
        <span
            aria-hidden
            className="jy-drawer-edge absolute inset-y-0 left-0 w-[3px]"
            style={{ backgroundImage: "linear-gradient(180deg,#e6c374,#b8893b)" }}
        />
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="flex w-full items-start gap-3 px-4 py-4 text-left md:px-6 md:py-5"
        >
            <span className="jy-serif jy-gold-ink mt-0.5 shrink-0 text-lg font-bold">
                {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm font-semibold leading-relaxed text-[#2b2424] md:text-[15px]">{problem}</span>
            <ChevronDown size={16} className="jy-drawer-chevron mt-1 shrink-0 text-[#8a6222]" />
        </button>
        <div className={`jy-drawer-body ${open ? "jy-open" : ""}`}>
            <div className="jy-drawer-inner">
                <div className="border-t border-[#efe7dd] bg-[#faf7f3] px-4 py-4 pl-[3.25rem] md:px-6 md:py-5 md:pl-[4.5rem]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6222]">La solución</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#2b2424]/78 md:text-[15px]">{solution}</p>
                </div>
            </div>
        </div>
    </div>
);

/* ───────────────────────────── Landing ───────────────────────────── */

const Landing = () => {
    const [openReto, setOpenReto] = useState(0);

    const spot = (event: MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="jy-page">
            <style>{css}</style>

            {/* ── El estuche que se abre ── */}
            <div aria-hidden className="jy-case">
                <span className="jy-case-half jy-case-top" />
                <span className="jy-case-half jy-case-bottom" />
                <span className="jy-case-line" />
                <span className="jy-case-glow" />
            </div>

            {/* ───────────────── 1 · PORTADA ───────────────── */}
            <section className="jy-velvet relative px-4 pb-16 pt-28 md:px-6 md:pb-24 md:pt-36">
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-14 h-[420px]"
                    style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(230,195,116,.28), transparent 70%)" }}
                />

                <div className="relative mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-4">
                        {A.logoColor && (
                            <Image
                                src={A.logoColor}
                                alt={p.name}
                                width={120}
                                height={120}
                                priority
                                className="h-14 w-auto object-contain md:h-16"
                            />
                        )}
                        <Kicker>Estuche abierto · {p.year}</Kicker>
                    </div>

                    <h1 className="jy-serif mt-7 max-w-4xl text-[2.6rem] font-bold leading-[1.02] tracking-tight md:text-7xl">
                        Sistema Administrativo
                        <br />
                        <span className="jy-gold">Joyería</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#2b2424]/72 md:text-xl">{p.tagline}</p>

                    <div className="mt-8 flex flex-wrap gap-2">
                        <Chip>{p.categoryShort}</Chip>
                        <Chip>{p.year}</Chip>
                        <Chip>{p.statusShort}</Chip>
                    </div>

                    <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#2b2424]/60">{p.role}</p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Magnetic>
                            <BrandButton href="#escaparate" className="!text-[#2b2424]">
                                Abrir el escaparate <ArrowRight size={16} />
                            </BrandButton>
                        </Magnetic>
                        <span className="text-[11px] uppercase tracking-[0.24em] text-[#2b2424]/40">
                            {p.category}
                        </span>
                    </div>

                    {/* tres placas grabadas */}
                    <Stagger className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3" stagger={0.08}>
                        {[p.metrics[0], p.metrics[2], p.metrics[4]].map((m) => (
                            <StaggerItem key={m.label} y={18}>
                                <Plate value={m.value} label={m.label} />
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-10 max-w-3xl" delay={0.1}>
                        <div className="jy-hair rounded-[4px] bg-white/70 p-4 md:p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6222]">Estado</p>
                            <p className="mt-2 text-sm leading-relaxed text-[#2b2424]/72">{p.status}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── Cinta de metales ───────────────── */}
            <div className="relative">
                <MetalTicker />
                <p className="bg-[#f7f2ec] px-4 py-2 text-center text-[10px] uppercase tracking-[0.28em] text-[#2b2424]/40">
                    La misma cinta que el vendedor ve bajo la cabecera · pasa el ratón para detenerla
                </p>
            </div>

            {/* ───────────────── 2 · EL PROBLEMA ───────────────── */}
            <section
                className="jy-velvet-dark relative px-4 py-20 md:px-6 md:py-28"
                style={{ background: "linear-gradient(180deg,#5e0101,#2a0505)" }}
            >
                <div className="relative mx-auto max-w-4xl text-[#f7f2ec]">
                    <Kicker tone="light">01 · Lo que no encaja</Kicker>
                    <h2 className="jy-serif mt-5 text-3xl font-bold leading-tight md:text-5xl">
                        Ningún ERP genérico sabe
                        <br />
                        <span className="text-[#e6c374]">cuánto pesa una pieza</span>
                    </h2>
                    <p className="mt-7 text-base leading-relaxed text-[#f7f2ec]/78 md:text-lg">{p.problem}</p>

                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                        {[
                            "Gramos de oro 18K, no unidades",
                            "Precio atado a la cotización y a la TRM",
                            "WhatsApp, hojas de cálculo y tienda aparte",
                        ].map((t) => (
                            <div key={t} className="rounded-[3px] border border-[#e6c374]/28 bg-black/18 px-4 py-3">
                                <p className="text-[13px] leading-snug text-[#f7f2ec]/80">{t}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────── LA SOLUCIÓN ───────────────── */}
            <section className="jy-velvet relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-4xl">
                    <Kicker>02 · Lo que se construyó</Kicker>
                    <h2 className="jy-serif mt-5 text-3xl font-bold leading-tight md:text-5xl">
                        <RevealWords text="Un solo bundle que se reparte en cuatro árboles de rutas" />
                    </h2>

                    <Reveal className="mt-8">
                        <div
                            className="rounded-[4px] bg-white p-6 md:p-8"
                            style={{ borderLeft: "3px solid #b8893b", boxShadow: "0 18px 40px rgba(93,1,1,.08)" }}
                        >
                            <p className="text-base leading-relaxed text-[#2b2424]/78 md:text-lg">{p.solution}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 3 · LOS SEIS ROLES ───────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#f2ebe2" }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="03 / El paño"
                        title={
                            <>
                                Seis piezas <span className="jy-gold-ink">sobre el mismo terciopelo</span>
                            </>
                        }
                        lead="El rol numérico que devuelve el backend decide, en el arranque, qué aplicación monta el navegador. Layout, chat y ticker se comparten; sólo cambian los destinos."
                    />

                    <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
                        {ROLES.map((r) => (
                            <StaggerItem key={r.n} y={22}>
                                <div className="jy-piece-card h-full rounded-[4px] border border-[#d9c9a8] bg-[#fffdfa] p-5">
                                    <div className="flex items-baseline justify-between">
                                        <span className="jy-serif jy-gold-ink text-xl font-bold">{r.n}</span>
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#2b2424]/35">rol</span>
                                    </div>
                                    <h3 className="jy-serif mt-3 text-lg font-bold text-[#2b2424]">{r.role}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#2b2424]/62">{r.line}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-8" delay={0.1}>
                        <p className="text-center text-[11px] uppercase tracking-[0.26em] text-[#2b2424]/40">
                            29 declaraciones de ruta · 17 rutas únicas · un único layout
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 4 · LA VITRINA (highlights) ───────────────── */}
            <section className="jy-velvet relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="04 / La vitrina"
                        title={
                            <>
                                Cinco piezas <span className="jy-gold-ink">bajo el foco</span>
                            </>
                        }
                        lead="Pasa el cursor: la luz sigue a la pieza que estás mirando, como en el mostrador."
                    />

                    <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
                        {p.highlights.map((h) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title} className="h-full">
                                    <div
                                        onMouseMove={spot}
                                        className="jy-vitrine-card h-full rounded-[4px] border border-[#e7ddd2] bg-white p-6 transition-shadow duration-500 hover:shadow-[0_18px_40px_rgba(93,1,1,.12)]"
                                    >
                                        <div className="relative z-[1]">
                                            <span
                                                className="grid h-11 w-11 place-items-center rounded-[4px]"
                                                style={{ background: "linear-gradient(135deg,#e6c374,#b8893b)", color: "#2a0505" }}
                                            >
                                                <Icon size={19} />
                                            </span>
                                            <h3 className="jy-serif mt-5 text-lg font-bold leading-snug text-[#2b2424]">
                                                {h.title}
                                            </h3>
                                            <p className="mt-3 text-sm leading-relaxed text-[#2b2424]/65">{h.description}</p>
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}

                        <StaggerItem className="h-full">
                            <div
                                onMouseMove={spot}
                                className="jy-vitrine-card flex h-full flex-col justify-between rounded-[4px] border border-[#d9c9a8] p-6"
                                style={{ background: "linear-gradient(160deg,#fffdfa,#f4ebdd)" }}
                            >
                                <div className="relative z-[1]">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6222]">
                                        Paleta de la casa
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {[
                                            { c: p.brand.primary, n: "burdeos" },
                                            { c: p.brand.secondary, n: "profundo" },
                                            { c: p.brand.accent, n: "oro" },
                                            { c: p.brand.bg, n: "crema" },
                                            { c: p.brand.surface, n: "vitrina" },
                                            { c: p.brand.text, n: "tinta" },
                                        ].map((s) => (
                                            <span key={s.n} className="flex flex-col items-center gap-1">
                                                <span
                                                    className="block h-8 w-8 rounded-full border border-[#2b2424]/12"
                                                    style={{ background: s.c }}
                                                />
                                                <span className="text-[8px] uppercase tracking-[0.1em] text-[#2b2424]/45">
                                                    {s.n}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                    <span
                                        className="mt-4 block h-2 w-full rounded-full"
                                        style={{ backgroundImage: p.brand.gradient }}
                                    />
                                    <p className="mt-4 text-[13px] leading-relaxed text-[#2b2424]/62">{p.brand.mood}</p>
                                </div>
                                <p className="relative z-[1] mt-4 text-[10px] leading-relaxed text-[#2b2424]/35">
                                    {p.brand.source}
                                </p>
                            </div>
                        </StaggerItem>
                    </Stagger>
                </div>
            </section>

            {/* ───────────────── 5 · EL ESCAPARATE (mockup grande) ───────────────── */}
            <section id="escaparate" className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#f2ebe2" }}>
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="05 / El escaparate"
                        title={
                            <>
                                La cara pública, <span className="jy-gold-ink">recreada entera</span>
                            </>
                        }
                        lead={p.uiScreens[0]?.name}
                    />

                    <Reveal className="mt-12" direction="scale">
                        <BrowserFrame url="sandracanizarezapp.store" dark={false} className="shadow-[0_40px_90px_-40px_rgba(43,36,36,.55)]">
                            <div className="overflow-x-auto">
                                <div className="min-w-[560px]">
                                    <MockLanding />
                                </div>
                            </div>
                        </BrowserFrame>
                    </Reveal>

                    <Reveal className="mt-5" delay={0.1}>
                        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-[#2b2424]/40">
                            Marquesina · vídeo de portada real · colecciones del API · destacados con esqueleto · reseñas · pie burdeos
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 6 · EL MOSTRADOR (tienda) ───────────────── */}
            <section className="jy-velvet relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="06 / El mostrador"
                        title={
                            <>
                                Lo que ve <span className="jy-gold-ink">el cliente</span>
                            </>
                        }
                        lead={p.uiScreens[2]?.name}
                    />

                    <Reveal className="mt-12" direction="up">
                        <BrowserFrame url="sandracanizarezapp.store/tienda" dark={false} className="shadow-[0_40px_90px_-40px_rgba(43,36,36,.5)]">
                            <div className="overflow-x-auto">
                                <div className="min-w-[520px]">
                                    <MockStore />
                                </div>
                            </div>
                        </BrowserFrame>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 7 · EL TALLER (franja oscura) ───────────────── */}
            <section
                className="jy-velvet-dark relative px-4 py-20 md:px-6 md:py-28"
                style={{ background: "linear-gradient(180deg,#2a0505,#1a0303)" }}
            >
                <div className="relative mx-auto max-w-6xl text-[#f7f2ec]">
                    <Kicker tone="light">07 · El taller</Kicker>
                    <h2 className="jy-serif mt-5 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                        Dentro del sistema, <span className="text-[#e6c374]">pieza a pieza</span>
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#f7f2ec]/70">
                        El panel del administrador y el del joyero, recreados sobre el paño oscuro: el mismo layout, el mismo
                        ticker de cotizaciones y dos navegaciones distintas según quién entra.
                    </p>

                    <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-8">
                        {[
                            { node: <MockDashboard />, name: p.uiScreens[1]?.name, note: "Ventas del mes, tendencia, más vendidos, notificaciones y acciones rápidas." },
                            { node: <MockJoyero />, name: p.uiScreens[3]?.name, note: "Tres contadores, tres pestañas y una navegación inferior de sólo dos destinos." },
                        ].map((m, i) => (
                            <Reveal key={m.name} delay={i * 0.12}>
                                <div className="mx-auto max-w-[290px]">
                                    <PhoneFrame>{m.node}</PhoneFrame>
                                    <p className="jy-serif mt-6 text-center text-lg font-bold text-[#e6c374]">{m.name}</p>
                                    <p className="mt-2 text-center text-[13px] leading-relaxed text-[#f7f2ec]/55">{m.note}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-16">
                        <div className="overflow-hidden rounded-[6px] border border-[#e6c374]/25 bg-[#f7f2ec]">
                            <div className="flex items-center justify-between border-b border-[#e7ddd2] bg-white px-4 py-2">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6222]">
                                    {p.uiScreens[4]?.name}
                                </span>
                                <span className="text-[10px] text-[#2b2424]/40">tipo → quilataje → existencias</span>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="min-w-[520px]">
                                    <MockInventario />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 8 · GALERÍA REAL ───────────────── */}
            {galleryMedia.length > 0 && (
                <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#f2ebe2" }}>
                    <div className="mx-auto max-w-6xl">
                        <SectionHead
                            index="08 / El muestrario"
                            title={
                                <>
                                    Los materiales <span className="jy-gold-ink">que trae la marca</span>
                                </>
                            }
                            lead="Banners de colección, fotografía de producto y tarjetas de personalización: los assets reales que consume la landing pública. Arrástralos."
                        />

                        <div className="mt-12">
                            <DragRail className="jy-rail">
                                {galleryMedia.map((m, i) => (
                                    <div key={m.src} className="w-[230px] shrink-0 md:w-[280px]">
                                        <ShotCard
                                            src={m.src}
                                            alt={m.caption}
                                            caption={m.caption}
                                            priority={i === 0}
                                            className="border-[#d9c9a8] bg-[#fffdfa]"
                                        />
                                    </div>
                                ))}
                            </DragRail>
                        </div>

                        {A.logoText && (
                            <Reveal className="mt-12 flex justify-center" delay={0.1}>
                                <Image
                                    src={A.logoText}
                                    alt={p.name}
                                    width={260}
                                    height={90}
                                    className="anim-float h-16 w-auto object-contain opacity-80"
                                />
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {/* ───────────────── 9 · FUNCIONALIDADES ───────────────── */}
            <section className="jy-velvet relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="09 / Las bandejas"
                        title={
                            <>
                                Diecisiete cajones <span className="jy-gold-ink">que ya abren</span>
                            </>
                        }
                        lead="Todo lo que está construido y funcionando dentro del mismo bundle."
                    />

                    <Stagger className="mt-12 grid gap-x-10 md:grid-cols-2" stagger={0.04}>
                        {p.features.map((f, i) => (
                            <StaggerItem key={f} y={14}>
                                <div className="jy-feat flex items-start gap-4 border-b border-[#e7ddd2] py-4 hover:bg-white/60">
                                    <span className="jy-serif jy-gold-ink w-7 shrink-0 pt-0.5 text-base font-bold">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                        aria-hidden
                                        className="jy-rule mt-[0.6rem] h-px shrink-0"
                                        style={{ background: "linear-gradient(90deg,#b8893b,transparent)" }}
                                    />
                                    <span className="flex-1 text-[15px] leading-relaxed text-[#2b2424]/74">{f}</span>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────── 10 · STACK ───────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#f2ebe2" }}>
                <div className="mx-auto max-w-6xl">
                    <SectionHead
                        index="10 / El taller de herramientas"
                        title={
                            <>
                                Con qué está <span className="jy-gold-ink">engastado</span>
                            </>
                        }
                    />

                    <div className="mt-12 grid gap-5 md:grid-cols-2">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.07}>
                                <div className="jy-piece-card h-full rounded-[4px] border border-[#d9c9a8] bg-[#fffdfa] p-6">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-[#2a0505]"
                                            style={{ backgroundImage: "linear-gradient(135deg,#e6c374,#b8893b)" }}
                                        >
                                            {i + 1}
                                        </span>
                                        <p className="jy-serif text-lg font-bold text-[#2b2424]">{group.group}</p>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-[#e7ddd2] bg-white px-3 py-1 text-[12px] text-[#2b2424]/72"
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

            {/* ───────────────── 11 · ARQUITECTURA ───────────────── */}
            <section className="jy-velvet relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="11 / El engaste"
                        title={
                            <>
                                Cinco capas dentro de <span className="jy-gold-ink">src/</span>
                            </>
                        }
                        lead="Cada bandeja delega en la de abajo. Nada habla con el backend fuera de la capa de servicios."
                    />

                    <Stagger className="mt-12 space-y-3" stagger={0.08}>
                        {LAYERS.map((l, i) => (
                            <StaggerItem key={l.k} y={18}>
                                <div className="jy-piece-card flex flex-col gap-3 rounded-[4px] border border-[#e7ddd2] bg-white p-5 md:flex-row md:items-center md:gap-6">
                                    <div className="flex items-center gap-3 md:w-[240px] md:shrink-0">
                                        <span className="jy-serif jy-gold-ink text-lg font-bold">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <p className="font-mono text-[12px] text-[#8d0101]">{l.k}</p>
                                            <p className="jy-serif text-base font-bold text-[#2b2424]">{l.t}</p>
                                        </div>
                                    </div>
                                    <p className="flex-1 text-sm leading-relaxed text-[#2b2424]/65">{l.d}</p>
                                    <span className="shrink-0 self-start rounded-full border border-[#d9c9a8] px-3 py-1 text-[11px] font-semibold text-[#8a6222] md:self-center">
                                        {l.tag}
                                    </span>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-10" delay={0.1}>
                        <div className="rounded-[4px] bg-white p-6 md:p-8" style={{ borderLeft: "3px solid #8d0101" }}>
                            <div className="mb-4 flex items-center gap-2 text-[#8a6222]">
                                <Layers size={15} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Arquitectura</span>
                            </div>
                            <p className="text-sm leading-relaxed text-[#2b2424]/75 md:text-[15px]">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 12 · RETOS (cajones) ───────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28" style={{ background: "#f2ebe2" }}>
                <div className="mx-auto max-w-5xl">
                    <SectionHead
                        index="12 / Los cajones"
                        title={
                            <>
                                Cinco problemas <span className="jy-gold-ink">y su solución dentro</span>
                            </>
                        }
                        lead="Abre cada cajón: arriba lo que se rompía, dentro lo que lo arregló."
                    />

                    <div className="mt-12 space-y-3">
                        {p.challenges.map((c, i) => (
                            <Reveal key={c.problem} delay={i * 0.06}>
                                <RetoDrawer
                                    index={i}
                                    problem={c.problem}
                                    solution={c.solution}
                                    open={openReto === i}
                                    onToggle={() => setOpenReto(openReto === i ? -1 : i)}
                                />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────────── 13 · MÉTRICAS ───────────────── */}
            <section
                className="jy-velvet-dark relative px-4 py-20 md:px-6 md:py-24"
                style={{ background: "linear-gradient(180deg,#5e0101,#2a0505)" }}
            >
                <div className="relative mx-auto max-w-6xl text-[#f7f2ec]">
                    <Kicker tone="light">13 · El recuento</Kicker>
                    <h2 className="jy-serif mt-5 text-3xl font-bold md:text-5xl">Lo que hay en la caja</h2>

                    <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                        {p.metrics.map((m) => (
                            <CountMetric key={m.label} value={m.value} label={m.label} />
                        ))}
                    </div>

                    <div className="mt-14 border-t border-[#e6c374]/25 pt-8">
                        <Marquee
                            items={[
                                "Inventario en gramos",
                                "Órdenes a medida",
                                "Chat por WebSocket",
                                "Ticker de metales",
                                "Tienda del cliente",
                                "Préstamos externos",
                                "Firma digital",
                                "Recorte en el navegador",
                            ]}
                            speed={32}
                            separator="◆"
                            className="text-[12px] uppercase tracking-[0.24em] text-[#f7f2ec]/45"
                        />
                    </div>
                </div>
            </section>

            {/* ───────────────── 14 · EL RELATO ───────────────── */}
            <section className="jy-velvet relative px-4 py-20 md:px-6 md:py-28">
                <div className="mx-auto max-w-3xl">
                    <Kicker>14 · La ficha de la pieza</Kicker>
                    <Stagger className="mt-8 space-y-6" stagger={0.1}>
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={paragraph}>
                                <p
                                    className={
                                        i === 0
                                            ? "jy-serif text-xl leading-relaxed text-[#2b2424] md:text-2xl"
                                            : "text-[15px] leading-relaxed text-[#2b2424]/68 md:text-base"
                                    }
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-12" delay={0.1}>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e7ddd2] pt-6">
                            <div className="flex items-center gap-3">
                                {A.logoMark && (
                                    <Image
                                        src={A.logoMark}
                                        alt={p.name}
                                        width={48}
                                        height={48}
                                        className="h-10 w-10 object-contain"
                                    />
                                )}
                                <span className="text-[11px] uppercase tracking-[0.24em] text-[#2b2424]/45">
                                    {p.name}
                                </span>
                            </div>
                            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#8a6222]">
                                Cúcuta · Colombia <ChevronRight size={13} />
                            </span>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────── 15 · CIERRE: el estuche se cierra ───────────────── */}
            <div
                className="jy-velvet-dark relative pb-24"
                style={{ background: "linear-gradient(180deg,#2a0505,#1a0303)", color: "#f7f2ec" }}
            >
                <span
                    aria-hidden
                    className="mx-auto block h-px max-w-4xl"
                    style={{ background: "linear-gradient(90deg,transparent,#b8893b,transparent)" }}
                />
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Un ERP vertical con e-commerce dentro: seis roles, inventario que entiende de metales y chat en vivo, todo en un solo frontend. Si tu negocio tiene un taller detrás del mostrador, es exactamente este terreno."
                />
                <div className="flex flex-col items-center gap-4 px-4">
                    <span
                        aria-hidden
                        className="block h-px w-40"
                        style={{ background: "linear-gradient(90deg,transparent,#e6c374,transparent)" }}
                    />
                    <p className="jy-serif text-center text-sm text-[#f7f2ec]/45">
                        El estuche se cierra. La pieza queda dentro.
                    </p>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
