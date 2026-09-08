"use client"

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    BadgeCheck,
    Bell,
    Boxes,
    ChevronDown,
    ChevronRight,
    Crown,
    Filter,
    Github,
    Heart,
    Home,
    KeyRound,
    LayoutGrid,
    Package,
    Palette,
    Play,
    Search,
    ShoppingBag,
    Star,
    Store,
    Truck,
    UserRound,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SampleDataNote, SectionHead, TiltCard } from "@/components/projects/bits";
import { AutoVideo, BrowserFrame, DragRail, ShotCard } from "@/components/projects/frames";
import { Reveal, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("sto")!;
const nxt = nextProject("sto");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Producto de muestra para la vitrina: la unidad de producción es de Birongo, tierra de cacao. */
const VITRINA = [
    { name: "Cacao en grano · 1 kg", price: "Bs 1.240,00", off: "-15%", stock: "En stock: 42", tone: "#6B4A2F" },
    { name: "Chocolate artesanal 70%", price: "Bs 980,50", off: "-10%", stock: "En stock: 18", tone: "#3F2A1C" },
    { name: "Nibs de cacao · 250 g", price: "Bs 640,00", off: "-5%", stock: "En stock: 27", tone: "#7A5636" },
    { name: "Manteca de cacao", price: "Bs 1.870,00", off: "-20%", stock: "En stock: 9", tone: "#8A6B45" },
    { name: "Cacao en polvo · 500 g", price: "Bs 720,25", off: "-8%", stock: "En stock: 34", tone: "#5A3B22" },
    { name: "Bombones de licor", price: "Bs 2.150,00", off: "-12%", stock: "En stock: 6", tone: "#4A2E1E" },
];

/* El recorrido de una petición, tal y como lo describe la arquitectura del proyecto. */
const PIPELINE = [
    {
        step: ".htaccess",
        note: "Una sola RewriteRule con Options All -Indexes canaliza cualquier ruta hacia index.php?views=$1.",
    },
    {
        step: "index.php",
        note: "Único punto de entrada: carga config/APP.php con las constantes de negocio y llama a vistasControlador.",
    },
    {
        step: "vistas/plantilla.php",
        note: "Abre la sesión, parte la URL por «/» y compara el primer segmento contra la constante DASHBOARD.",
    },
    {
        step: "lista blanca",
        note: "vistasModelo valida el nombre contra 40 rutas permitidas y comprueba con is_file() que la vista exista.",
    },
    {
        step: "controlador",
        note: "12 controladores con 38 funciones; las escrituras entran por los 11 endpoints de ajax/ y devuelven JSON.",
    },
    {
        step: "mainModel",
        note: "26 funciones compartidas: guardar, actualizar, eliminar, limpiar, validar, cifrar ids y paginar tablas.",
    },
    {
        step: "PDO · MySQL",
        note: "Consultas preparadas sobre 11 tablas, con SQL_CALC_FOUND_ROWS y FOUND_ROWS() para el paginador.",
    },
];

/* Menú real del panel según la ficha de pantalla. */
const NAV_PANEL = [
    { label: "Inicio", sub: false, active: true },
    { label: "Categorías", sub: true, active: false },
    { label: "Clientes", sub: true, active: false },
    { label: "Productos", sub: true, active: false },
    { label: "Pedidos", sub: true, active: false },
    { label: "Accesibilidad", sub: true, active: false },
    { label: "Administradores", sub: true, active: false },
    { label: "Configuraciones", sub: true, active: false },
];

const TILES_PANEL = [
    { label: "Categorías", count: "8 Registradas", icon: LayoutGrid },
    { label: "Clientes", count: "46 Registrados", icon: UserRound },
    { label: "Productos", count: "132 Registrados", icon: Package },
    { label: "Administradores", count: "3 Registrados", icon: BadgeCheck },
    { label: "Pedidos", count: "57 Registrados", icon: Truck },
];

const css = `
.sto-page { --sto-line: #E1E1E1; --sto-navy: #253556; --sto-link: #3273DC; --sto-coral: #EC5252; }
.sto-page [class*="border-white"] { border-color: rgba(37, 53, 86, 0.16); }
.sto-poppins { font-family: Poppins, "Trebuchet MS", "Segoe UI", system-ui, sans-serif; letter-spacing: 0.01em; }

/* ---------- Vitrina 3D del héroe ---------- */
.sto-stage { perspective: 1100px; perspective-origin: 50% 42%; touch-action: pan-y; }
.sto-drag { transform-style: preserve-3d; }
.sto-cyl {
  position: relative;
  width: 148px;
  height: 214px;
  margin: 0 auto;
  transform-style: preserve-3d;
  --sto-r: 178px;
  animation: sto-vitrina 28s linear infinite;
}
.sto-stage:hover .sto-cyl { animation-play-state: paused; }
@media (min-width: 768px) {
  .sto-cyl { width: 214px; height: 292px; --sto-r: 326px; }
}
@keyframes sto-vitrina { from { transform: rotateY(0deg); } to { transform: rotateY(-360deg); } }
.sto-card3d { position: absolute; inset: 0; backface-visibility: hidden; }
.sto-shopcard {
  height: 100%;
  border-radius: 10px;
  background: #FFFFFF;
  border: 1px solid #E1E1E1;
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.75);
  overflow: hidden;
  color: #253556;
}
.sto-tag {
  position: absolute;
  left: 50%;
  top: 100%;
  width: 78px;
  margin-left: -39px;
  transform-origin: top center;
  animation: sto-vaiven 3.4s ease-in-out infinite;
}
@keyframes sto-vaiven { 0%, 100% { rotate: -6deg; } 50% { rotate: 6deg; } }
.sto-pulse { animation: sto-pulse 2.6s ease-in-out infinite; }
@keyframes sto-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.85; } }

/* ---------- Banner rotativo del mockup de portada ---------- */
.sto-banner { animation: sto-banner 15s infinite linear; background-size: cover; }
@keyframes sto-banner {
  0%, 33% { background-image: linear-gradient(115deg, #7A5636 0%, #2A1B10 100%); }
  34%, 66% { background-image: linear-gradient(115deg, #2F4A3A 0%, #12211A 100%); }
  67%, 100% { background-image: linear-gradient(115deg, #4A2E3A 0%, #1B1016 100%); }
}

/* ---------- Mosaico de funcionalidades: los tiles del dashboard ---------- */
.sto-tile {
  border: 1px solid #E1E1E1;
  background: #FFFFFF;
  border-radius: 10px;
  color: #253556;
  transition: background-color 0.28s ease, border-color 0.28s ease, color 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease;
}
.sto-tile:hover {
  background: #EC5252;
  border-color: #EC5252;
  color: #FFFFFF;
  transform: translateY(-3px);
  box-shadow: 0 20px 34px -22px rgba(236, 82, 82, 0.9);
}
.sto-tile .sto-tile-idx { color: rgba(37, 53, 86, 0.35); transition: color 0.28s ease; }
.sto-tile:hover .sto-tile-idx { color: rgba(255, 255, 255, 0.72); }
.sto-tile .sto-tile-ico { color: #3273DC; transition: color 0.28s ease; }
.sto-tile:hover .sto-tile-ico { color: #FFFFFF; }

/* ---------- Fila de menú del panel ---------- */
.sto-navrow { transition: background 0.25s ease; }
.sto-navrow:hover { background: linear-gradient(to right, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0)); }

/* ---------- Estantería del stack ---------- */
.sto-shelf { position: relative; }
.sto-shelf::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(to right, #253556, rgba(37, 53, 86, 0.12));
}

/* ---------- Acordeón de retos ---------- */
.sto-chev { transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1); }
.sto-open .sto-chev { transform: rotate(180deg); }

/* ---------- Marco de escaparate para la galería ---------- */
.sto-showcase { position: relative; }
.sto-showcase::after {
  content: "";
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: -26px;
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(50% 100% at 50% 0%, rgba(37, 53, 86, 0.24), transparent 72%);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .sto-cyl, .sto-tag, .sto-banner, .sto-pulse { animation: none !important; }
}
`;

/* ══════════════════════ Mockups recreados en HTML/CSS ══════════════════════ */

/** uiScreens[0] — Inicio de la tienda. */
const MockInicio = () => (
    <div className="bg-white text-[#253556]">
        {/* header blanco fijo de 65 px */}
        <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "#E1E1E1" }}>
            <span className="sto-poppins text-[13px] font-extrabold tracking-tight">
                STO<span className="text-[#3273DC]">.</span>
            </span>
            <div className="sto-poppins hidden items-center gap-3 text-[8px] font-bold uppercase sm:flex">
                {["Inicio", "Productos", "Contáctanos", "Regístrate", "Iniciar"].map((item, i) => (
                    <span key={item} className={i === 0 ? "text-[#3273DC]" : "opacity-70"}>
                        {item}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-1.5">
                {[
                    { Ico: ShoppingBag, badge: "3", color: "#3273DC" },
                    { Ico: Star, badge: "5", color: "#F0B429" },
                    { Ico: Bell, badge: "2", color: "#EC5252" },
                    { Ico: Truck, badge: "1", color: "#2FA84F" },
                ].map(({ Ico, badge, color }) => (
                    <span key={color} className="relative grid w-5 h-5 rounded place-items-center bg-[#F6F6F6]">
                        <Ico size={10} style={{ color: "#253556" }} />
                        <span
                            className="absolute -right-1 -top-1 grid h-[11px] min-w-[11px] place-items-center rounded-full px-[3px] text-[6px] font-bold text-white"
                            style={{ background: color }}
                        >
                            {badge}
                        </span>
                    </span>
                ))}
                <span className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg,#3273DC,#253556)" }} />
            </div>
        </div>

        {/* banner calc(100vh - 65px) con velo negro al 50 % */}
        <div className="sto-banner relative h-[168px] md:h-[190px]">
            <span aria-hidden className="absolute inset-0 bg-black/50" />
            <span
                aria-hidden
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 9px)",
                }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <h3 className="sto-poppins text-[11px] font-extrabold uppercase leading-snug text-white md:text-[15px]">
                    Bienvenido a UPF El Sabor de Birongo
                </h3>
                <p className="mt-2 max-w-[240px] text-[8px] leading-relaxed text-white/75 md:text-[9px]">
                    Cacao y derivados de Higuerote-Birongo. Compra en línea, paga y sigue tu pedido.
                </p>
                <div className="flex gap-1 mt-3">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-[3px] w-5 rounded-full"
                            style={{ background: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.35)" }}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* banda NUESTROS SERVICIOS: tres columnas iguales */}
        <div className="px-3 py-5 bg-white">
            <p className="sto-poppins text-center text-[9px] font-extrabold uppercase tracking-[0.2em]">
                Nuestros servicios
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                    { Ico: Truck, t: "Envío", d: "Despacho a domicilio dentro de Higuerote y alrededores." },
                    { Ico: Boxes, t: "Inventario", d: "Stock actualizado y alerta cuando baja del mínimo." },
                    { Ico: Store, t: "Tienda", d: "Catálogo completo, favoritos y pedidos en línea." },
                ].map(({ Ico, t, d }) => (
                    <div key={t} className="text-center">
                        <Ico size={26} className="mx-auto" style={{ color: "#253556" }} />
                        <p className="sto-poppins mt-2 text-[8px] font-extrabold uppercase">{t}</p>
                        <p className="mt-1 text-[7px] leading-relaxed opacity-60">{d}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* bloque CREA TU CUENTA */}
        <div className="px-3 pb-4">
            <div
                className="h-[62px] rounded-[10px] border"
                style={{
                    borderColor: "#E1E1E1",
                    backgroundImage:
                        "linear-gradient(120deg, rgba(50,115,220,0.16), rgba(37,53,86,0.10)), repeating-linear-gradient(45deg, rgba(37,53,86,0.06) 0 8px, transparent 8px 16px)",
                }}
            />
            <p className="sto-poppins mt-3 text-center text-[10px] font-extrabold uppercase">Crea tu cuenta</p>
            <div className="flex justify-center mt-2">
                <span className="rounded px-3 py-1 text-[8px] font-bold text-white" style={{ background: "#3273DC" }}>
                    REGISTRARME
                </span>
            </div>
        </div>

        {/* footer separado por línea #E1E1E1 con 70 px de aire */}
        <div className="px-3 pt-6 pb-4 border-t" style={{ borderColor: "#E1E1E1" }}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[7px] text-[#253556]">
                <span className="font-bold">UPF El Sabor de Birongo · Venezuela</span>
                <span className="opacity-60">Higuerote-Birongo · Bs</span>
            </div>
        </div>
    </div>
);

/** uiScreens[1] — Catálogo de productos. */
const MockCatalogo = () => (
    <div className="px-3 pt-5 pb-4 bg-white text-[#253556]">
        <p className="sto-poppins text-[11px] font-extrabold uppercase">Productos en tienda</p>
        <p className="mt-1 text-[7px] leading-relaxed opacity-60">
            Todos los productos habilitados y con existencia disponible en la tienda.
        </p>

        {/* barra de tres columnas sobre línea gris */}
        <div
            className="mt-3 grid grid-cols-3 items-center gap-2 border-t pt-2 text-[8px] font-semibold"
            style={{ borderColor: "#E1E1E1" }}
        >
            <span className="inline-flex items-center gap-1 text-[#3273DC]">
                <Filter size={9} /> CATEGORÍAS <ChevronDown size={9} />
            </span>
            <span className="inline-flex items-center justify-center gap-1 text-[#3273DC]">
                <Search size={9} /> Buscar
            </span>
            <span className="inline-flex items-center justify-end gap-1 text-[#3273DC]">
                Ordenar por <ChevronDown size={9} />
            </span>
        </div>

        {/* fila de búsqueda activa */}
        <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-[7px] opacity-70">
                Resultados de la búsqueda: <span className="font-bold">CACAO</span>
            </span>
            <span className="rounded px-2 py-[3px] text-[7px] font-bold text-white" style={{ background: "#EC5252" }}>
                Eliminar búsqueda
            </span>
        </div>

        {/* grid flex-wrap de tarjetas de 300 px */}
        <div className="grid grid-cols-2 gap-2 mt-3 sm:grid-cols-3">
            {VITRINA.slice(0, 3).map((prod) => (
                <div
                    key={prod.name}
                    className="overflow-hidden rounded-[10px] border"
                    style={{ borderColor: "#E1E1E1", boxShadow: "0 6px 16px -12px rgba(0,0,0,0.5)" }}
                >
                    <div className="h-[54px]" style={{ background: `linear-gradient(140deg, ${prod.tone}, #1E140C)` }} />
                    <div className="px-2 py-2 text-center">
                        <p className="truncate text-[8px] font-bold">{prod.name}</p>
                        <p className="mt-1 text-[13px] font-extrabold leading-none" style={{ color: "#3273DC" }}>
                            {prod.price}
                        </p>
                        <p className="text-[6px] opacity-45">Bolivares</p>
                        <p className="mt-1 text-[7px] opacity-55">{prod.stock}</p>
                        <div className="mt-2 flex items-center justify-center gap-1 text-[6px] font-bold text-white">
                            <span className="px-2 py-[3px] rounded" style={{ background: "#2FA84F" }}>
                                Agregar
                            </span>
                            <span className="px-2 py-[3px] rounded" style={{ background: "#3273DC" }}>
                                Detalles
                            </span>
                            <span className="grid h-[15px] w-[15px] place-items-center rounded" style={{ background: "#EC5252" }}>
                                <Heart size={7} />
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* pie: conteo y paginador */}
        <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
            <span className="text-[7px] opacity-55">Mostrando productos 1 al 10 de un total de 34</span>
            <div className="flex items-center gap-1">
                {["1", "2", "3", "4"].map((n, i) => (
                    <span
                        key={n}
                        className="grid h-[15px] w-[15px] place-items-center rounded text-[7px] font-bold"
                        style={
                            i === 0
                                ? { background: "#3273DC", color: "#FFFFFF" }
                                : { border: "1px solid #E1E1E1", color: "#253556" }
                        }
                    >
                        {n}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

/** uiScreens[2] — Detalle de producto. */
const MockDetalle = () => (
    <div className="px-3 pt-4 pb-4 bg-white text-[#253556]">
        <div className="flex items-center justify-between">
            <p className="sto-poppins text-[10px] font-extrabold uppercase">Detalles del producto</p>
            <span className="rounded px-2 py-[3px] text-[7px] font-bold text-white" style={{ background: "#253556" }}>
                Volver
            </span>
        </div>
        <div className="mt-2 border-t" style={{ borderColor: "#E1E1E1" }} />

        <div className="grid grid-cols-12 gap-3 mt-3">
            {/* columna 5: portada */}
            <div className="col-span-5">
                <div
                    className="h-[104px] rounded-[10px]"
                    style={{ background: "linear-gradient(140deg, #6B4A2F, #22150C)", border: "1px solid #E1E1E1" }}
                />
            </div>

            {/* columna 7: ficha */}
            <div className="col-span-7">
                <p className="sto-poppins text-[10px] font-extrabold leading-tight">Cacao en grano · 1 kg</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-3">
                    {[
                        { Ico: Palette, k: "Tipo", v: "Materia prima" },
                        { Ico: Package, k: "Stock", v: "42 unidades" },
                        { Ico: BadgeCheck, k: "Fabricante", v: "UPF El Sabor" },
                        { Ico: Crown, k: "Modelo", v: "Criollo-Birongo" },
                    ].map(({ Ico, k, v }) => (
                        <div key={k} className="flex items-start gap-1.5">
                            <Ico size={10} className="mt-[1px]" style={{ color: "#3273DC" }} />
                            <span>
                                <span className="block text-[6px] font-extrabold uppercase tracking-wide">{k}</span>
                                <span className="block text-[7px] opacity-65">{v}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <p className="mt-3 text-[6px] font-extrabold uppercase">Descripción:</p>
        <p className="mt-1 text-justify text-[7px] leading-relaxed opacity-65">
            Grano fermentado y secado al sol en Birongo, seleccionado a mano y empacado en sacos de un kilo. Trazabilidad
            por lote y disponibilidad sujeta a la cosecha de la temporada.
        </p>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 mt-3">
            <p className="text-[9px] font-extrabold uppercase">
                Precio: <span style={{ color: "#3273DC" }}>Bs 1.240,00</span>
            </p>
            <p className="text-[9px] font-extrabold uppercase">
                Costo del envío: <span style={{ color: "#3273DC" }}>Bs 95,00</span>
            </p>
        </div>

        {/* dos formularios AJAX apilados */}
        <div className="mt-3 space-y-2">
            {[
                { label: "Agregar al carrito", bg: "#3273DC" },
                { label: "Actualizar carrito", bg: "#2FA84F" },
            ].map((form) => (
                <div key={form.label} className="flex items-center gap-2">
                    <span className="rounded border px-2 py-1 text-[7px]" style={{ borderColor: "#E1E1E1" }}>
                        <span className="block text-[6px] opacity-50">Cantidad</span>
                        <span className="block font-bold text-center">1</span>
                    </span>
                    <span
                        className="flex-1 rounded py-1.5 text-center text-[8px] font-bold text-white"
                        style={{ background: form.bg }}
                    >
                        {form.label}
                    </span>
                </div>
            ))}
        </div>

        <p className="mt-4 text-[7px] font-extrabold uppercase">Galería de imágenes</p>
        <div className="grid grid-cols-4 gap-1.5 mt-2">
            {["#6B4A2F", "#3F2A1C", "#7A5636", "#5A3B22"].map((tone) => (
                <div
                    key={tone}
                    className="h-[36px] rounded"
                    style={{ background: `linear-gradient(140deg, ${tone}, #1E140C)`, border: "1px solid #E1E1E1" }}
                />
            ))}
        </div>
    </div>
);

/** uiScreens[3] — Dashboard del administrador. */
const MockDashboard = () => (
    <div className="overflow-x-auto">
        <div className="flex min-w-[640px] bg-[#F6F6F6] text-[#253556]">
            {/* nav lateral fijo de 300 px con fotografía cubierta por rgba(36,41,46,.8) */}
            <div
                className="w-[196px] shrink-0 px-3 py-4"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(36,41,46,0.86), rgba(36,41,46,0.92)), linear-gradient(140deg, #3B4A55, #1B2126)",
                }}
            >
                <div className="flex justify-center">
                    <span
                        className="grid w-[74px] h-[74px] rounded-full place-items-center"
                        style={{ border: "4px solid #FFFFFF", background: "linear-gradient(135deg,#3273DC,#253556)" }}
                    >
                        <UserRound size={30} className="text-white" />
                    </span>
                </div>
                <p className="mt-2 text-[9px] font-bold text-center text-white">Arturo Sojo</p>
                <p className="text-[7px] text-center text-white/60">Administrador</p>
                <div className="h-[3px] w-full my-3" style={{ background: "#EC5252" }} />

                <div className="space-y-[2px]">
                    {NAV_PANEL.map((item) => (
                        <div
                            key={item.label}
                            className="sto-navrow flex h-[26px] items-center justify-between rounded-[3px] px-2 text-[9px] text-white"
                            style={item.active ? { background: "#EC5252" } : undefined}
                        >
                            <span className={item.active ? "font-bold" : "opacity-85"}>{item.label}</span>
                            {item.sub && <ChevronDown size={9} className="opacity-60" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* contenido */}
            <div className="flex-1">
                <div
                    className="flex h-[36px] items-center justify-end gap-3 border-b bg-white px-3"
                    style={{ borderColor: "#E1E1E1" }}
                >
                    {[Bell, Store, UserRound].map((Ico, i) => (
                        <Ico key={i} size={12} style={{ color: i === 0 ? "#EC5252" : "#253556" }} />
                    ))}
                </div>

                <div className="px-4 py-4">
                    <p className="sto-poppins text-[10px] font-extrabold uppercase">Panel de control</p>
                    <p className="mt-1 text-[8px] opacity-60">¡Bienvenido ARTURO SOJO!</p>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {TILES_PANEL.map(({ label, count, icon: Ico }) => (
                            <div
                                key={label}
                                className="grid h-[92px] w-[92px] place-items-center rounded-[10px] bg-white px-2 text-center"
                                style={{ border: "1px solid #E1E1E1", boxShadow: "0 6px 16px -12px rgba(0,0,0,0.4)" }}
                            >
                                <div>
                                    <p className="text-[7px] font-extrabold uppercase">{label}</p>
                                    <Ico size={24} className="mx-auto my-1.5" style={{ color: "#253556" }} />
                                    <p className="text-[6px] opacity-55">{count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/** uiScreens[4] — Login del panel. */
const MockLogin = () => (
    <div
        className="relative grid h-[300px] place-items-center px-4"
        style={{ background: "linear-gradient(to right, #24243E, #302B63, #0F0C29)" }}
    >
        <div
            className="w-full max-w-[196px] rounded-[5px] bg-white p-3 text-[#253556]"
            style={{ boxShadow: "0 24px 50px -24px rgba(0,0,0,0.8)" }}
        >
            <div className="flex justify-center">
                <span
                    className="grid w-[70px] h-[70px] rounded-full place-items-center"
                    style={{ background: "#F6F6F6", boxShadow: "0 0 1px 3px #1266F1" }}
                >
                    <UserRound size={30} style={{ color: "#253556" }} />
                </span>
            </div>

            <div className="mt-4 space-y-3">
                {[
                    { Ico: UserRound, label: "Usuario", value: "asojo" },
                    { Ico: KeyRound, label: "Contraseña", value: "••••••••" },
                ].map(({ Ico, label, value }) => (
                    <div key={label} className="flex items-end gap-2">
                        <Ico size={12} className="mb-1" style={{ color: "#253556" }} />
                        <span className="flex-1">
                            <span className="block text-[6px] text-[#3273DC]">{label}</span>
                            <span
                                className="block border-b pb-[2px] text-[8px]"
                                style={{ borderColor: "#B4B4B4" }}
                            >
                                {value}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            <div
                className="mt-4 rounded py-1.5 text-center text-[8px] font-bold tracking-[0.18em] text-white"
                style={{ background: "#3273DC" }}
            >
                LOGIN
            </div>
        </div>

        <span className="absolute bottom-3 right-3">
            <Home size={20} className="text-white" />
        </span>
    </div>
);

/* ══════════════════════════════ Landing ══════════════════════════════ */

const Landing = () => {
    const reduce = useReducedMotion();
    const [spin, setSpin] = useState(0);
    const [openReto, setOpenReto] = useState<number | null>(0);
    const drag = useRef({ active: false, x: 0 });

    const railRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 78%", "end 55%"] });
    const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        drag.current = { active: true, x: e.clientX };
    };
    const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.x;
        drag.current.x = e.clientX;
        setSpin((s) => s + dx * 0.35);
    };
    const onUp = () => {
        drag.current.active = false;
    };

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links} className="sto-page">
            <style>{css}</style>

            {/* ═══════════════ 1 · VITRINA (héroe) ═══════════════ */}
            <section
                className="relative px-4 pt-24 pb-16 overflow-hidden md:px-6 md:pt-28 md:pb-24"
                style={{ backgroundImage: p.brand.gradient, color: "#FFFFFF" }}
            >
                <span
                    aria-hidden
                    className="absolute inset-0 opacity-70"
                    style={{
                        background:
                            "radial-gradient(60% 46% at 50% 34%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(40% 40% at 88% 6%, rgba(50,115,220,0.28), transparent 72%)",
                    }}
                />
                <span aria-hidden className="absolute inset-0 opacity-10 grid-lines" />

                <div className="relative max-w-5xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.42em] text-white/55">
                        UPF El Sabor de Birongo · Higuerote, Venezuela
                    </p>

                    <h1 className="sto-poppins mt-5 text-[15vw] font-extrabold uppercase leading-[0.86] tracking-tight md:text-[9rem]">
                        STO
                    </h1>
                    <p className="sto-poppins mt-1 text-sm font-bold uppercase tracking-[0.34em] text-white/70 md:text-lg">
                        Online Store
                    </p>

                    <span
                        className="inline-flex items-center gap-2 px-4 py-2 mt-6 text-xs font-semibold rounded-full"
                        style={{ border: "1px solid rgba(255,255,255,0.26)", background: "rgba(255,255,255,0.07)" }}
                    >
                        <span className="w-2 h-2 rounded-full sto-pulse" style={{ background: "#EC5252" }} />
                        Tienda + panel en un solo PHP
                    </span>
                </div>

                {/* carrusel 3D: seis tarjetas cada 60° sobre un cilindro */}
                <div
                    className="sto-stage relative mx-auto mt-12 h-[330px] max-w-4xl cursor-grab select-none active:cursor-grabbing md:mt-16 md:h-[440px]"
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerLeave={onUp}
                    onPointerCancel={onUp}
                >
                    <div className="sto-drag" style={{ transform: `rotateY(${spin}deg)` }}>
                        <div className="sto-cyl">
                            {VITRINA.map((prod, i) => (
                                <div
                                    key={prod.name}
                                    className="sto-card3d"
                                    style={{ transform: `rotateY(${i * 60}deg) translateZ(var(--sto-r))` }}
                                >
                                    <div className="sto-shopcard">
                                        <div
                                            className="h-[54%]"
                                            style={{ background: `linear-gradient(140deg, ${prod.tone}, #1E140C)` }}
                                        />
                                        <div className="px-2 py-2 text-center">
                                            <p className="sto-poppins truncate text-[8px] font-bold md:text-[11px]">
                                                {prod.name}
                                            </p>
                                            <p
                                                className="mt-1 text-[15px] font-extrabold leading-none md:text-[22px]"
                                                style={{ color: "#3273DC" }}
                                            >
                                                {prod.price}
                                            </p>
                                            <p className="text-[6px] opacity-45 md:text-[8px]">Bolivares</p>
                                            <p className="mt-1 text-[7px] opacity-55 md:text-[9px]">{prod.stock}</p>
                                            <div className="mt-1.5 flex items-center justify-center gap-1 text-[6px] font-bold text-white md:text-[8px]">
                                                <span className="px-1.5 py-[2px] rounded" style={{ background: "#2FA84F" }}>
                                                    Agregar
                                                </span>
                                                <span className="px-1.5 py-[2px] rounded" style={{ background: "#3273DC" }}>
                                                    Detalles
                                                </span>
                                                <span
                                                    className="grid h-[13px] w-[13px] place-items-center rounded"
                                                    style={{ background: "#EC5252" }}
                                                >
                                                    <Heart size={6} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* etiqueta de precio de cartón, colgada y balanceándose */}
                                    <div className="sto-tag" style={{ animationDelay: `${(i % 4) * 0.42 + 0.15}s` }}>
                                        <span
                                            aria-hidden
                                            className="block h-[22px] w-px mx-auto"
                                            style={{ background: "rgba(255,255,255,0.55)" }}
                                        />
                                        <div
                                            className="relative px-2 pt-3 pb-2 text-center rounded-md"
                                            style={{ background: "#253556", boxShadow: "0 10px 22px -12px rgba(0,0,0,0.9)" }}
                                        >
                                            <span
                                                aria-hidden
                                                className="absolute left-1/2 top-[5px] h-[6px] w-[6px] -translate-x-1/2 rounded-full"
                                                style={{ background: "#0F0C29" }}
                                            />
                                            <p className="text-[8px] font-bold leading-none" style={{ color: "#8FB6F0" }}>
                                                {prod.price}
                                            </p>
                                            <span
                                                className="mt-1 inline-block rounded-full px-1.5 py-[1px] text-[6px] font-bold text-white sto-pulse"
                                                style={{ background: "#EC5252" }}
                                            >
                                                {prod.off}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative max-w-3xl mx-auto mt-10 text-center md:mt-14">
                    <p className="text-sm leading-relaxed text-white/80 md:text-lg">{p.tagline}</p>

                    <div className="flex flex-wrap justify-center gap-2 mt-7">
                        {[p.category, p.year, "MVC hecho a mano"].map((label) => (
                            <span
                                key={label}
                                className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/75"
                                style={{ border: "1px solid rgba(255,255,255,0.24)", background: "rgba(255,255,255,0.06)" }}
                            >
                                {label}
                            </span>
                        ))}
                    </div>

                    <p className="max-w-xl mx-auto mt-5 text-xs leading-relaxed text-white/55 md:text-sm">{p.role}</p>

                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {p.links.web && (
                            <BrandButton href={p.links.web}>
                                <Play size={16} /> Ver el recorrido
                            </BrandButton>
                        )}
                        {p.links.github && (
                            <a href={p.links.github} target="_blank" rel="noreferrer">
                                <span
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 rounded-full"
                                    style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                                >
                                    <Github size={16} /> Código en GitHub
                                </span>
                            </a>
                        )}
                    </div>

                    <p className="mx-auto mt-6 max-w-md text-[10px] leading-relaxed text-white/40">
                        Arrastra la vitrina o pasa el cursor por encima para detenerla.
                    </p>
                </div>
            </section>

            {/* cinta de recorrido comercial */}
            <div
                className="py-4 text-[11px] uppercase tracking-[0.24em] text-[#253556]/55 border-b"
                style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
            >
                <Marquee
                    items={[
                        "Catálogo",
                        "Búsqueda",
                        "Carrito",
                        "Favoritos",
                        "Pedidos",
                        "Registro de pago",
                        "Inventario",
                        "Stock mínimo",
                        "Notificaciones",
                        "Reportes PDF",
                        "Bitácora de visitas",
                    ]}
                    speed={32}
                    separator="·"
                />
            </div>

            {/* ═══════════════ 2 · PROBLEMA / SOLUCIÓN ═══════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28 text-[color:var(--brand-text)]">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="01 / El encargo"
                        title={
                            <span className="sto-poppins">
                                Del cuaderno <span className="brand-gradient-text">a la vitrina</span>
                            </span>
                        }
                        lead="Una unidad de producción familiar que vendía por catálogo informal necesitaba, a la vez, una tienda que mirara hacia afuera y un control que mirara hacia adentro."
                    />

                    <div className="grid gap-6 mt-12 md:grid-cols-2">
                        <Reveal direction="right">
                            <div
                                className="h-full p-6 md:p-8 rounded-[10px]"
                                style={{ background: "#ECECEC", border: "1px solid #DEDEDE" }}
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#253556]/45">
                                    El problema
                                </p>
                                <h3 className="sto-poppins mt-3 text-xl font-extrabold text-[#253556]/70 md:text-2xl">
                                    Precios y stock en cuadernos
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-[#1B1B1B]/60 md:text-base">{p.problem}</p>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <div
                                className="h-full p-6 md:p-8 rounded-[10px] bg-white"
                                style={{
                                    border: "1px solid #E1E1E1",
                                    boxShadow: "0 30px 60px -34px rgba(37,53,86,0.55)",
                                }}
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#EC5252" }}>
                                    La solución
                                </p>
                                <h3 className="sto-poppins mt-3 text-xl font-extrabold text-[#253556] md:text-2xl">
                                    Dos caras servidas por el mismo enrutador
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-[#1B1B1B]/75 md:text-base">{p.solution}</p>
                            </div>
                        </Reveal>
                    </div>

                    {/* nota de estado del repositorio */}
                    <Reveal className="mt-8" delay={0.18}>
                        <div
                            className="p-5 rounded-[10px] md:p-6"
                            style={{ background: "#FFFFFF", borderLeft: "3px solid #EC5252", border: "1px solid #E1E1E1" }}
                        >
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#253556" }}>
                                Estado del repositorio
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[#1B1B1B]/70">{p.status}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ 3 · MÉTRICAS COMO ETIQUETAS DE PRECIO ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-24"
                style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / El tamaño real"
                        title={
                            <span className="sto-poppins">
                                Lo que hay <span className="brand-gradient-text">dentro del repositorio</span>
                            </span>
                        }
                        align="center"
                    />

                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-10 mt-14">
                        {p.metrics.map((m, i) => (
                            <motion.div
                                key={m.label}
                                className="relative w-[140px] pt-6 md:w-[158px]"
                                initial={reduce ? false : { opacity: 0, y: -22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={
                                    reduce
                                        ? { duration: 0 }
                                        : { type: "spring", stiffness: 380, damping: 13, delay: i * 0.055 }
                                }
                            >
                                <span
                                    aria-hidden
                                    className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2"
                                    style={{ background: "#253556" }}
                                />
                                <div
                                    className="relative px-3 pt-5 pb-4 text-center rounded-[10px]"
                                    style={{
                                        background: "#FFFDF7",
                                        border: "1px solid #253556",
                                        boxShadow: "0 14px 30px -20px rgba(37,53,86,0.9)",
                                    }}
                                >
                                    <span
                                        aria-hidden
                                        className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                                        style={{ background: "#F6F6F6", border: "1px solid #253556" }}
                                    />
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ 4 · HIGHLIGHTS ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#F6F6F6" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="03 / Las piezas"
                        title={
                            <span className="sto-poppins">
                                Seis decisiones que <span className="brand-gradient-text">sostienen las dos caras</span>
                            </span>
                        }
                    />

                    <Stagger className="grid gap-5 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.highlights.map((h) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <TiltCard intensity={5} className="h-full">
                                        <div
                                            className="relative h-full p-5 overflow-hidden bg-white group rounded-[10px] md:p-6"
                                            style={{
                                                border: "1px solid #E1E1E1",
                                                boxShadow: "0 18px 38px -30px rgba(37,53,86,0.7)",
                                            }}
                                        >
                                            <span
                                                aria-hidden
                                                className="absolute inset-x-0 top-0 h-[3px] scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"
                                                style={{ background: "#EC5252" }}
                                            />
                                            <span
                                                className="grid rounded-[8px] h-10 w-10 place-items-center"
                                                style={{ background: "rgba(50,115,220,0.12)", color: "#3273DC" }}
                                            >
                                                <Icon size={18} />
                                            </span>
                                            <h3 className="sto-poppins mt-4 text-base font-extrabold text-[#253556]">
                                                {h.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-[#1B1B1B]/65">{h.description}</p>
                                        </div>
                                    </TiltCard>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ═══════════════ 5 · LA TIENDA (mockups públicos) ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / La cara pública"
                        title={
                            <span className="sto-poppins">
                                El escaparate que <span className="brand-gradient-text">ve el cliente</span>
                            </span>
                        }
                        lead="Banner rotativo, catálogo paginado con filtros y ordenamiento, y una ficha de producto con galería en lightbox. Todo servido por el mismo index.php."
                    />

                    <div className="grid gap-8 mt-12 lg:grid-cols-2">
                        <Reveal>
                            <div className="sto-showcase">
                                <BrowserFrame url="http://localhost/tienda/" dark={false}>
                                    <MockInicio />
                                </BrowserFrame>
                            </div>
                            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#253556]/55">
                                {p.uiScreens[0]?.name}
                            </p>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <div className="sto-showcase">
                                <BrowserFrame url="http://localhost/tienda/product/all/ASC/1/" dark={false}>
                                    <MockCatalogo />
                                </BrowserFrame>
                            </div>
                            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#253556]/55">
                                {p.uiScreens[1]?.name}
                            </p>
                        </Reveal>
                    </div>

                    <Reveal className="mt-14" delay={0.06}>
                        <div className="sto-showcase max-w-3xl mx-auto">
                            <BrowserFrame url="http://localhost/tienda/product-details/9f3a…c1b/" dark={false}>
                                <MockDetalle />
                            </BrowserFrame>
                        </div>
                        <p className="mt-8 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#253556]/55">
                            {p.uiScreens[2]?.name}
                        </p>
                    </Reveal>

                    <Reveal className="max-w-3xl mx-auto mt-12">
                        <p className="text-sm leading-relaxed text-center text-[#1B1B1B]/60">
                            El identificador del producto nunca viaja en claro: la URL lleva el token que devuelve
                            <span className="font-semibold text-[#253556]"> mainModel::encryption()</span>, y el controlador
                            lo descifra antes de consultar.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ 6 · EL PANEL (mockups privados) ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#F6F6F6" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="05 / La cara privada"
                        title={
                            <span className="sto-poppins">
                                El backoffice que <span className="brand-gradient-text">ve el encargado</span>
                            </span>
                        }
                        lead="La misma plantilla, otro layout: nav lateral de 300 px, navbar de 50 px y una rejilla de mosaicos con los conteos reales leídos de la base."
                    />

                    <Reveal className="mt-12">
                        <div className="sto-showcase">
                            <BrowserFrame url="http://localhost/tienda/dashboard/" dark={false}>
                                <MockDashboard />
                            </BrowserFrame>
                        </div>
                        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#253556]/55">
                            {p.uiScreens[3]?.name}
                        </p>
                    </Reveal>

                    <div className="grid gap-8 mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center">
                        <Reveal direction="right">
                            <div className="sto-showcase max-w-sm mx-auto md:mx-0">
                                <BrowserFrame url="http://localhost/tienda/login/" dark={false}>
                                    <MockLogin />
                                </BrowserFrame>
                            </div>
                            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#253556]/55">
                                {p.uiScreens[4]?.name}
                            </p>
                        </Reveal>

                        <Reveal direction="left" delay={0.1}>
                            <div
                                className="p-6 bg-white rounded-[10px] md:p-8"
                                style={{ border: "1px solid #E1E1E1", boxShadow: "0 24px 50px -34px rgba(37,53,86,0.6)" }}
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#EC5252" }}>
                                    La frontera
                                </p>
                                <h3 className="sto-poppins mt-3 text-xl font-extrabold text-[#253556] md:text-2xl">
                                    El único momento oscuro
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-[#1B1B1B]/70">
                                    Toda la aplicación vive en gris muy claro con tarjetas blancas. El login es la excepción:
                                    un degradado violeta-noche a pantalla completa que marca visualmente dónde termina la
                                    tienda y dónde empieza el panel. Los errores no se pintan en el formulario, llegan como
                                    modales de SweetAlert2 disparados desde PHP.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {["Administrador", "Usuario", "admin_security.php", "token de sesión"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full px-3 py-1 text-[11px] font-medium"
                                            style={{
                                                border: "1px solid rgba(37,53,86,0.22)",
                                                color: "#253556",
                                                background: "rgba(37,53,86,0.05)",
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            
                    <SampleDataNote className="mt-8" />
                </section>

            {/* ═══════════════ 7 · GALERÍA REAL (si el catálogo trae media) ═══════════════ */}
            {p.media.length > 0 && (
                <section
                    className="relative px-4 py-20 border-t md:px-6 md:py-28"
                    style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
                >
                    <div className="max-w-6xl mx-auto">
                        <SectionHead
                            index="06 / En movimiento"
                            title={
                                <span className="sto-poppins">
                                    Recorridos <span className="brand-gradient-text">grabados</span>
                                </span>
                            }
                        />
                        <DragRail className="mt-12">
                            {p.media.map((m) => (
                                <figure key={m.src} className="sto-showcase w-[280px] shrink-0 md:w-[420px]">
                                    {m.src.endsWith(".mp4") ? (
                                        <AutoVideo src={m.src} rounded="rounded-[10px]" />
                                    ) : (
                                        <ShotCard src={m.src} alt={m.caption} caption={m.caption} />
                                    )}
                                    <figcaption className="mt-4 text-[11px] leading-relaxed text-[#1B1B1B]/55">
                                        {m.caption}
                                    </figcaption>
                                </figure>
                            ))}
                        </DragRail>
                    </div>
                </section>
            )}

            {/* ═══════════════ 8 · CÓMO ESTÁ CONSTRUIDO ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
            >
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="06 / El recorrido"
                        title={
                            <span className="sto-poppins">
                                De la URL <span className="brand-gradient-text">a la consulta</span>
                            </span>
                        }
                        lead="Siete escalones entre lo que escribe el navegador y lo que devuelve MySQL. Ninguno de ellos toca el disco antes de que la ruta pase por la lista blanca."
                    />

                    <div ref={railRef} className="relative pl-8 mt-14 md:pl-12">
                        {/* raíl */}
                        <span
                            aria-hidden
                            className="absolute left-[11px] top-2 bottom-2 w-px md:left-[15px]"
                            style={{ background: "#E1E1E1" }}
                        />
                        {/* punto luminoso coral que viaja al hacer scroll */}
                        <motion.span
                            aria-hidden
                            className="absolute left-[11px] z-10 h-3 w-3 -translate-x-1/2 rounded-full md:left-[15px]"
                            style={{
                                top: dotTop,
                                background: "#EC5252",
                                boxShadow: "0 0 0 5px rgba(236,82,82,0.18), 0 0 18px rgba(236,82,82,0.8)",
                            }}
                        />

                        <div className="space-y-7">
                            {PIPELINE.map((node, i) => (
                                <Reveal key={node.step} delay={i * 0.05}>
                                    <div className="relative">
                                        <span
                                            aria-hidden
                                            className="absolute -left-8 top-1.5 h-[9px] w-[9px] -translate-x-1/2 rounded-full md:-left-12"
                                            style={{ background: "#FFFFFF", border: "2px solid #253556" }}
                                        />
                                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                            <span className="text-[10px] font-bold tracking-[0.24em] text-[#253556]/35">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="sto-poppins text-base font-extrabold text-[#253556] md:text-lg">
                                                {node.step}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#1B1B1B]/65">
                                            {node.note}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    <Reveal className="mt-14">
                        <div
                            className="p-6 md:p-8 rounded-[10px] bg-[#F6F6F6]"
                            style={{ borderLeft: "3px solid #253556" }}
                        >
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#253556]/50">
                                Arquitectura completa
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-[#1B1B1B]/72 md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ 9 · FUNCIONALIDADES COMO MOSAICO DEL PANEL ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#F6F6F6" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="07 / Funcionalidades"
                        title={
                            <span className="sto-poppins">
                                El mosaico <span className="brand-gradient-text">completo</span>
                            </span>
                        }
                        lead="Los mismos mosaicos cuadrados del panel, uno por funcionalidad. Al pasar el cursor se rellenan de rojo, igual que el elemento activo del menú lateral."
                    />

                    <div
                        className="grid gap-3 mt-12"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 190px), 1fr))" }}
                    >
                        {p.features.map((f, i) => (
                            <Reveal key={f} delay={(i % 6) * 0.04}>
                                <div className="sto-tile flex h-full min-h-[190px] flex-col justify-between p-4">
                                    <div className="flex items-start justify-between">
                                        <span className="sto-tile-idx text-[11px] font-bold tracking-[0.2em]">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <ChevronRight size={13} className="sto-tile-ico" />
                                    </div>
                                    <p className="mt-4 text-[12px] leading-relaxed">{f}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ 10 · STACK EN ESTANTERÍAS ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
            >
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="08 / Stack"
                        title={
                            <span className="sto-poppins">
                                Con qué está <span className="brand-gradient-text">hecho</span>
                            </span>
                        }
                        lead="Sin framework, sin gestor de dependencias: cada librería está copiada dentro del repositorio."
                    />

                    <div className="mt-12 space-y-10">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.06}>
                                <div className="sto-shelf pb-3">
                                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#253556]/40">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <h3 className="sto-poppins text-lg font-extrabold text-[#253556] md:text-xl">
                                            {group.group}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap items-end gap-2 mt-4">
                                        {group.items.map((item, j) => (
                                            <span
                                                key={item}
                                                className="rounded-t-[6px] px-3 pb-3 pt-2 text-[12px] font-medium text-[#253556] transition-transform duration-300 hover:-translate-y-1"
                                                style={{
                                                    background: j % 2 === 0 ? "#FFFFFF" : "#F6F6F6",
                                                    border: "1px solid #E1E1E1",
                                                    borderBottom: "none",
                                                }}
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

            {/* ═══════════════ 11 · RETOS PLEGABLES ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#F6F6F6" }}
            >
                <div className="max-w-4xl mx-auto">
                    <SectionHead
                        index="09 / Retos"
                        title={
                            <span className="sto-poppins">
                                Lo que <span className="brand-gradient-text">costó resolver</span>
                            </span>
                        }
                        lead="Seis problemas concretos del código y la decisión que los cerró. Toca cada uno para abrirlo."
                    />

                    <div className="mt-12 space-y-3">
                        {p.challenges.map((c, i) => {
                            const open = openReto === i;
                            return (
                                <Reveal key={c.problem} delay={i * 0.04}>
                                    <div
                                        className={`overflow-hidden rounded-[10px] bg-white ${open ? "sto-open" : ""}`}
                                        style={{
                                            border: `1px solid ${open ? "#EC5252" : "#E1E1E1"}`,
                                            boxShadow: open ? "0 24px 46px -34px rgba(236,82,82,0.8)" : "none",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenReto(open ? null : i)}
                                            className="flex items-start w-full gap-4 p-5 text-left md:p-6"
                                        >
                                            <span
                                                className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] text-[11px] font-bold text-white"
                                                style={{ background: open ? "#EC5252" : "#253556" }}
                                            >
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="flex-1 text-sm font-semibold leading-relaxed text-[#253556] md:text-base">
                                                {c.problem}
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                className="sto-chev mt-0.5 shrink-0"
                                                style={{ color: open ? "#EC5252" : "#253556" }}
                                            />
                                        </button>

                                        <motion.div
                                            initial={false}
                                            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                                            transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 0.61, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div
                                                className="px-5 pt-4 pb-6 md:px-6 md:pb-7"
                                                style={{ borderTop: "1px solid #E1E1E1", background: "#FBFBFB" }}
                                            >
                                                <p
                                                    className="text-[11px] font-bold uppercase tracking-[0.24em]"
                                                    style={{ color: "#3273DC" }}
                                                >
                                                    Solución
                                                </p>
                                                <p className="mt-2 text-sm leading-relaxed text-[#1B1B1B]/72">{c.solution}</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════ 12 · RESUMEN ═══════════════ */}
            <section
                className="relative px-4 py-20 border-t md:px-6 md:py-28"
                style={{ borderColor: "#E1E1E1", background: "#FFFFFF" }}
            >
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3">
                        <Chip>{p.category}</Chip>
                        <Chip>{p.year}</Chip>
                    </div>

                    <h2 className="sto-poppins mt-6 text-3xl font-extrabold leading-tight text-[#253556] md:text-4xl">
                        {p.name}
                    </h2>

                    <Stagger className="mt-8 space-y-5">
                        {p.summary.map((paragraph, i) => (
                            <StaggerItem key={i}>
                                <p
                                    className={
                                        i === 0
                                            ? "text-lg leading-relaxed text-[#1B1B1B]/85 md:text-xl"
                                            : "text-sm leading-relaxed text-[#1B1B1B]/62 md:text-base"
                                    }
                                >
                                    {paragraph}
                                </p>
                            </StaggerItem>
                        ))}
                    </Stagger>

                    <Reveal className="mt-10">
                        <div
                            className="flex flex-wrap items-center gap-4 p-5 rounded-[10px]"
                            style={{ background: "#F6F6F6", border: "1px solid #E1E1E1" }}
                        >
                            <span
                                className="grid w-10 h-10 rounded-full place-items-center"
                                style={{ background: "#253556" }}
                            >
                                <Store size={18} className="text-white" />
                            </span>
                            <p className="flex-1 min-w-[220px] text-sm leading-relaxed text-[#1B1B1B]/65">
                                {p.brand.mood}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <div className="pb-32 border-t" style={{ borderColor: "#E1E1E1" }}>
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Una tienda y un panel completos sobre PHP plano: enrutado propio con lista blanca, ids cifrados en la URL, escrituras por AJAX y reportes en PDF. Si necesitas algo así —o migrarlo a algo moderno sin perder el negocio que ya funciona— es terreno conocido."
                />
                <div className="flex justify-center">
                    <a
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#253556]/45 transition-opacity hover:text-[#253556]"
                    >
                        Volver a la vitrina <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
