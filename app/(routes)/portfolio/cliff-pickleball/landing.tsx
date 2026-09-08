"use client"

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowLeft,
    Bell,
    Camera,
    ChevronDown,
    ChevronRight,
    FileText,
    Github,
    Image as ImageIcon,
    Info,
    Mail,
    MapPin,
    Menu,
    Mic,
    Paperclip,
    Pencil,
    Play,
    Plus,
    Search,
    Send,
    User,
    Video,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { BrandButton, Chip, CountMetric, Marquee, ProjectOutro, SectionHead } from "@/components/projects/bits";
import { AutoVideo, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/projects/reveal";

const p = getProject("cliff-pickleball")!;
const nxt = nextProject("cliff-pickleball");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Paleta literal de la app (lib/config/colors_collection.dart). */
const AZUL = "#0152CD";
const AZUL_CLARO = "#0186FE";
const VERDE = "#01BD47";
const VERDE_RING = "#02BA4B";
const NARANJA = "#F26109";
const FONDO = "#15162D";
const SUP = "#2E2D42";
const GRIS = "#9FA0A1";

/* El vuelo de un mensaje por las capas de lib/, contado como un peloteo. */
const FLOW = [
    { lane: "screens", label: "Se escribe", note: "ChatScreen · 7 tipos de mensaje" },
    { lane: "providers", label: "Notifica", note: "31 ChangeNotifier en el MultiProvider" },
    { lane: "services", label: "Se cifra", note: "clase Secure · AES-CBC + PKCS7" },
    { lane: "local", label: "Se guarda", note: "sqflite · 4 tablas cifradas" },
    { lane: "firebase", label: "Se sincroniza", note: "Firestore + Storage por par de usuarios" },
    { lane: "firebase", label: "Se avisa", note: "FCM en primer plano y con la app cerrada" },
];

const LANES = [
    {
        tag: "Interfaz",
        color: AZUL_CLARO,
        title: "screens/ · 120 archivos",
        items: [
            "entry_screens: splash, intro, registro y toma de datos",
            "chat, actividades, conexiones y ajustes",
            "social_media con su propio MVVM (models, services, view_models, widgets)",
            "MainScreen como shell con Drawer de cuatro destinos",
        ],
    },
    {
        tag: "Estado y servicios",
        color: VERDE,
        title: "providers/ · services/ · auth/",
        items: [
            "31 ChangeNotifier registrados en el MultiProvider raíz",
            "MainScreenNavigationProvider conmuta el módulo visible",
            "services: cifrado, base local, permisos, descargas, mapas y navegación",
            "db_operations con rutas tipadas en DBPath y StorageHelper",
        ],
    },
    {
        tag: "Persistencia",
        color: NARANJA,
        title: "sqflite cifrado + Firebase",
        items: [
            "4 tablas locales: usuario, conexiones, chats por conexión y actividades",
            "Firestore y Storage como canal de sincronización remota",
            "Workmanager caduca las actividades cada 15 minutos",
            "Firebase Messaging entrega las notificaciones",
        ],
    },
];

const css = `
/* ── Cliff Pickleball · toda la retícula deriva de las líneas de la cancha ── */
.cp-lines {
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.045) 2px, transparent 2px),
    linear-gradient(to bottom, rgba(255,255,255,0.045) 2px, transparent 2px);
  background-size: 96px 96px;
}
.cp-card {
  border: 2px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  background: color-mix(in srgb, ${SUP} 62%, transparent);
}
.cp-hit { transition: transform .55s cubic-bezier(.34,1.56,.64,1), border-color .4s ease; }
.cp-hit:hover { transform: translateY(-8px); border-color: rgba(242,97,9,.55); }

/* Trazo del peloteo del hero */
.cp-trail { stroke-dasharray: 1; stroke-dashoffset: 1; animation: cp-rally 3.2s ease-in-out infinite; }
@keyframes cp-rally {
  0%   { stroke-dashoffset: 1; opacity: 1; }
  87%  { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
.cp-ball { transform-box: fill-box; transform-origin: 50% 50%; animation: cp-squash 3.2s linear infinite; }
@keyframes cp-squash {
  0%, 33%, 44%, 65%, 76%, 100% { transform: scale(1, 1); }
  38% { transform: scale(1.32, .6); }
  70% { transform: scale(1.32, .6); }
}
.cp-ripple { transform-box: fill-box; transform-origin: 50% 50%; opacity: 0; animation: cp-ripple 3.2s ease-out infinite; }
@keyframes cp-ripple {
  0%   { opacity: .8; transform: scale(.3); }
  16%  { opacity: 0;  transform: scale(3.8); }
  100% { opacity: 0;  transform: scale(3.8); }
}

/* La red: separador vertical y horizontal */
.cp-net {
  background-image: repeating-linear-gradient(to right, rgba(255,255,255,.20) 0 1px, transparent 1px 7px);
}
.cp-net-h {
  background-image: repeating-linear-gradient(to bottom, rgba(255,255,255,.20) 0 1px, transparent 1px 7px);
}
.cp-serve { animation: cp-serve 2.8s ease-in-out infinite; }
@keyframes cp-serve {
  0%, 100% { transform: translateY(0);     opacity: .3; }
  50%      { transform: translateY(-11px); opacity: 1; }
}

/* Marcador: los números en naranja de pelota */
.cp-score .brand-gradient-text { background-image: linear-gradient(135deg, ${NARANJA} 0%, #FF9D4A 100%); }

/* Botones del hero: verde de acción y fantasma naranja */
.cp-btn-green > a > span { background-image: linear-gradient(135deg, ${VERDE} 0%, #02D95A 100%); color: #0B0C1B; }
.cp-btn-orange > a > span { border-color: rgba(242,97,9,.65); color: ${NARANJA}; }

/* Diagrama de arquitectura: la pelota recorre el flujo */
.cp-flow-ball { animation: cp-flow 7s linear infinite; }
@keyframes cp-flow { 0% { left: 4%; } 100% { left: 96%; } }
.cp-hop { animation: cp-hop 1.1666s ease-in-out infinite; }
@keyframes cp-hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-22px); } }

.cp-mock { font-family: ui-sans-serif, "Poppins", system-ui, sans-serif; }
.cp-clip { position: relative; overflow: hidden; }

@media (prefers-reduced-motion: reduce) {
  .cp-trail, .cp-ball, .cp-ripple, .cp-serve, .cp-flow-ball, .cp-hop { animation: none !important; }
  .cp-trail { stroke-dashoffset: 0; }
  .cp-ripple { opacity: 0; }
  .cp-hit:hover { transform: none; }
}
`;

/* La trayectoria del peloteo, en coordenadas del viewBox del hero. */
const RALLY = "M 60 580 Q 400 60 860 300 Q 560 80 240 520 Q 520 90 820 240";

/* ---------------------------------------------------------------------------
   La cancha en perspectiva. Todas las líneas salen de la misma geometría.
   --------------------------------------------------------------------------- */
const Court = ({ animated }: { animated: boolean }) => (
    <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden>
        <defs>
            <linearGradient id="cp-rally-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor={NARANJA} />
                <stop offset="55%" stopColor="#FF9D4A" />
                <stop offset="100%" stopColor={VERDE} />
            </linearGradient>
            <linearGradient id="cp-court-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AZUL} stopOpacity="0.12" />
                <stop offset="100%" stopColor={AZUL} stopOpacity="0.3" />
            </linearGradient>
            <filter id="cp-blur">
                <feGaussianBlur stdDeviation="6" />
            </filter>
        </defs>

        {/* superficie */}
        <polygon points="430,150 770,150 1280,600 -80,600" fill="url(#cp-court-fill)" />
        {/* cocina (zona de no volea), un punto más clara */}
        <polygon points="271,290 929,290 1031,380 169,380" fill={AZUL} fillOpacity="0.16" />
        <polygon points="169,380 1031,380 1133,470 67,470" fill={AZUL} fillOpacity="0.16" />

        <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round">
            <polygon points="430,150 770,150 1280,600 -80,600" />
            <line x1="271" y1="290" x2="929" y2="290" />
            <line x1="67" y1="470" x2="1133" y2="470" />
            <line x1="600" y1="150" x2="600" y2="290" />
            <line x1="600" y1="470" x2="600" y2="600" />
        </g>

        {/* red */}
        <g>
            {Array.from({ length: 37 }, (_, i) => 169 + i * 24).map((x) => (
                <line key={x} x1={x} y1="318" x2={x} y2="380" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
            ))}
            <line x1="169" y1="318" x2="1031" y2="318" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" />
            <line x1="169" y1="380" x2="1031" y2="380" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
            <line x1="169" y1="318" x2="169" y2="392" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" />
            <line x1="1031" y1="318" x2="1031" y2="392" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" />
        </g>

        {/* ondas de los dos botes */}
        <circle className={animated ? "cp-ripple" : undefined} cx="860" cy="300" r="9" fill="none" stroke={NARANJA} strokeWidth="2.5" style={{ animationDelay: "1.22s" }} />
        <circle className={animated ? "cp-ripple" : undefined} cx="240" cy="520" r="9" fill="none" stroke={NARANJA} strokeWidth="2.5" style={{ animationDelay: "2.24s" }} />

        {/* rastro difuminado + trazo del peloteo */}
        <path d={RALLY} fill="none" stroke="url(#cp-rally-grad)" strokeWidth="7" strokeLinecap="round" opacity="0.25" filter="url(#cp-blur)" pathLength={1} className={animated ? "cp-trail" : undefined} />
        <path d={RALLY} fill="none" stroke="url(#cp-rally-grad)" strokeWidth="3" strokeLinecap="round" pathLength={1} className={animated ? "cp-trail" : undefined} />

        {/* la pelota */}
        {animated ? (
            <g>
                <animateMotion dur="3.2s" repeatCount="indefinite" path={RALLY} />
                <circle r="17" fill={NARANJA} fillOpacity="0.3" />
                <circle className="cp-ball" r="7" fill={NARANJA} />
            </g>
        ) : (
            <g transform="translate(820 240)">
                <circle r="17" fill={NARANJA} fillOpacity="0.3" />
                <circle r="7" fill={NARANJA} />
            </g>
        )}
    </svg>
);

/* ---------------------------------------------------------------------------
   Mockups recreados en HTML/CSS a partir de p.uiScreens.
   --------------------------------------------------------------------------- */

const Avatar = ({ size, initials, ring = VERDE_RING }: { size: number; initials: string; ring?: string }) => (
    <span
        className="inline-grid font-semibold text-white rounded-full shrink-0 place-items-center"
        style={{
            width: size,
            height: size,
            border: `${Math.max(2, Math.round(size / 22))}px solid ${ring}`,
            background: `linear-gradient(140deg, ${AZUL} 0%, ${AZUL_CLARO} 100%)`,
            fontSize: Math.round(size / 2.6),
        }}
    >
        {initials}
    </span>
);

/* 1 · Splash de arranque */
const MockSplash = () => (
    <div className="cp-mock absolute inset-0 flex flex-col items-center justify-center" style={{ background: AZUL }}>
        <div className="relative grid w-[62%] aspect-square place-items-center bg-white">
            <svg viewBox="0 0 100 100" className="w-[58%]" aria-hidden>
                <polygon points="6,16 44,50 6,84" fill={NARANJA} />
                <polygon points="46,16 84,50 46,84" fill={NARANJA} />
            </svg>
            <span className="absolute bottom-[6%] right-[7%] text-[7px] font-medium" style={{ color: "#8FBEF7" }}>
                TM
            </span>
        </div>
        <p className="mt-7 text-[19px] font-normal tracking-[-0.01em] text-white">CliffPickleball</p>
    </div>
);

/* 2 · Inicio: actividades y mensajes */
const MockHome = () => (
    <div className="cp-mock absolute inset-0 overflow-hidden" style={{ background: FONDO }}>
        <div className="flex items-center justify-between px-4 pt-[26px] pb-1 text-[7px] text-white/45">
            <span>9:41</span>
            <span>▮▮▮ ⌁</span>
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5">
            <Menu size={15} color="#fff" />
            <span className="text-[13px] font-medium text-white">CliffPickleball</span>
        </div>

        <div className="px-4">
            <div className="flex h-[33px] items-center gap-2 rounded-full px-3" style={{ background: SUP }}>
                <Search size={13} color="#fff" />
                <span className="text-[10px]" style={{ color: "#B7B8C4" }}>
                    Search
                </span>
            </div>
        </div>

        <p className="px-4 mt-4 text-[12px] font-semibold text-white">Activities</p>
        <div className="flex gap-3.5 px-4 mt-2.5">
            {[
                { n: "AS", label: "Arturo so…", plus: true },
                { n: "MG", label: "María g…", plus: false },
                { n: "JP", label: "Juan p…", plus: false },
            ].map((a) => (
                <span key={a.n} className="flex flex-col items-center gap-1.5">
                    <span className="relative">
                        <Avatar size={49} initials={a.n} />
                        {a.plus && (
                            <span
                                className="absolute -bottom-0.5 -right-0.5 grid h-[17px] w-[17px] place-items-center rounded-full border-2"
                                style={{ background: VERDE_RING, borderColor: FONDO }}
                            >
                                <Plus size={9} color="#fff" strokeWidth={3} />
                            </span>
                        )}
                    </span>
                    <span className="text-[8px] text-white max-w-[52px] truncate">{a.label}</span>
                </span>
            ))}
        </div>

        <p className="px-4 mt-5 text-[12px] font-semibold text-white">Messages</p>
        <div className="mt-1">
            {[
                { n: "MG", name: "María g", last: "🗺️ Location", time: "10:26" },
                { n: "JP", name: "Juan p", last: "Nos vemos en la 3", time: "09:14" },
                { n: "CL", name: "Cliff", last: "🎵 Audio", time: "Ayer" },
            ].map((c) => (
                <div key={c.n} className="flex items-center gap-3 px-4 py-2">
                    <Avatar size={37} initials={c.n} />
                    <span className="flex-1 min-w-0">
                        <span className="block text-[12px] font-semibold text-white truncate">{c.name}</span>
                        <span className="block text-[9px] truncate" style={{ color: GRIS }}>
                            {c.last}
                        </span>
                    </span>
                    <span className="text-[8px]" style={{ color: GRIS }}>
                        {c.time}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

/* 3 · Gestión de conexiones */
const MockConnections = () => (
    <div className="cp-mock absolute inset-0 flex flex-col overflow-hidden" style={{ background: FONDO }}>
        <div className="flex items-center justify-between px-4 pt-[26px] pb-1 text-[7px] text-white/45">
            <span>9:41</span>
            <span>▮▮▮ ⌁</span>
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5">
            <Menu size={15} color="#fff" />
            <span className="text-[13px] font-medium text-white">CliffPickleball</span>
        </div>

        <p className="text-[11px] text-center text-white mt-1.5">Connection Management</p>

        <div className="mt-3">
            <div className="grid grid-cols-3">
                {["Available", "Incoming", "Sent"].map((t, i) => (
                    <span key={t} className="pb-2 text-center">
                        <span className="text-[10px] font-medium" style={{ color: i === 0 ? AZUL_CLARO : "#fff" }}>
                            {t}
                        </span>
                        <span
                            className="block h-[3px] mt-1.5 mx-auto w-[70%] rounded-full"
                            style={{ background: i === 0 ? AZUL_CLARO : "transparent" }}
                        />
                    </span>
                ))}
            </div>
            <span className="block h-px bg-white/85" />
        </div>

        <div className="px-4 mt-3.5">
            <div className="flex h-[33px] items-center gap-2 rounded-full px-3" style={{ background: SUP }}>
                <Search size={13} color="#fff" />
                <span className="text-[10px]" style={{ color: "#B7B8C4" }}>
                    Search
                </span>
            </div>
        </div>

        <div className="grid flex-1 place-items-center">
            <p className="text-[15px] font-semibold text-white">Not Found</p>
        </div>
    </div>
);

/* 4 · Conversación con panel de adjuntos */
const ATTACH = [
    { label: "Camera", color: "#B45BE7", Icon: Camera },
    { label: "Gallery", color: "#3160F5", Icon: ImageIcon },
    { label: "Video", color: "#35C2EE", Icon: Video },
    { label: "Document", color: "#EF458D", Icon: FileText },
    { label: "Audio", color: "#EFBF40", Icon: Mic },
    { label: "Location", color: "#3FBC6C", Icon: MapPin },
    { label: "Contact", color: NARANJA, Icon: User },
];

const MockChat = () => (
    <div className="cp-mock absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#14172D" }}>
        <div className="flex items-center justify-between px-4 pt-[26px] pb-1 text-[7px] text-white/45">
            <span>9:41</span>
            <span>▮▮▮ ⌁</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2" style={{ background: "#1B1E36" }}>
            <ArrowLeft size={14} color="#fff" />
            <Avatar size={26} initials="MG" />
            <span className="min-w-0">
                <span className="block text-[11px] font-semibold text-white truncate">María g</span>
                <span className="block text-[7px]" style={{ color: VERDE }}>
                    online
                </span>
            </span>
        </div>

        <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
            <div className="flex">
                <span className="max-w-[76%] rounded-[14px] rounded-tl-[4px] px-2.5 py-1.5" style={{ background: "#303250" }}>
                    <span className="block text-[10px] leading-snug text-white">¿Jugamos a las 6 en la cancha 3?</span>
                    <span className="block text-[7px] text-right text-white/45">6:02 PM</span>
                </span>
            </div>
            <div className="flex justify-end">
                <span className="max-w-[76%] rounded-[14px] rounded-tr-[4px] px-2.5 py-1.5" style={{ background: "#6145D2" }}>
                    <span className="block text-[10px] leading-snug text-white">Va. Te mando la ubicación del club</span>
                    <span className="block text-[7px] text-right text-white/55">6:03 PM</span>
                </span>
            </div>
            <div className="flex justify-end">
                <span className="rounded-[14px] rounded-tr-[4px] px-2.5 py-1.5" style={{ background: "#6145D2" }}>
                    <span className="block text-[10px] text-white">🗺️ Location</span>
                    <span className="block text-[7px] text-right text-white/55">6:03 PM</span>
                </span>
            </div>
            <div className="flex">
                <span className="rounded-[14px] rounded-tl-[4px] px-2.5 py-1.5" style={{ background: "#303250" }}>
                    <span className="block text-[10px] text-white">🎵 Audio · 0:12</span>
                    <span className="block text-[7px] text-right text-white/45">6:05 PM</span>
                </span>
            </div>
        </div>

        {/* hoja inferior de adjuntos */}
        <div className="px-3 pt-3.5 pb-3 rounded-t-[18px]" style={{ background: "#22243C" }}>
            <span className="block h-[3px] w-9 mx-auto rounded-full bg-white/25" />
            <div className="grid grid-cols-4 gap-y-3 mt-3.5">
                {ATTACH.map(({ label, color, Icon }) => (
                    <span key={label} className="flex flex-col items-center gap-1">
                        <span className="grid rounded-full h-[30px] w-[30px] place-items-center" style={{ background: color }}>
                            <Icon size={14} color="#fff" />
                        </span>
                        <span className="text-[7px] text-white/75">{label}</span>
                    </span>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-2" style={{ background: "#484850" }}>
            <span className="flex items-center flex-1 gap-2 px-2.5 py-1.5 rounded-full" style={{ background: "#2E2D42" }}>
                <span className="flex-1 text-[9px] text-white/40">Type a message</span>
                <Paperclip size={12} color="#fff" />
                <Camera size={12} color="#fff" />
            </span>
            <span className="grid h-[27px] w-[27px] place-items-center rounded-full" style={{ background: VERDE }}>
                <Send size={13} color="#fff" />
            </span>
        </div>
    </div>
);

/* 5 · Ajustes en modo claro con el selector de tema desplegado */
const SETTINGS_ROWS: { label: string; Icon: LucideIcon; caret?: boolean }[] = [
    { label: "App theme", Icon: Icons.Palette, caret: true },
    { label: "Profile", Icon: User },
    { label: "Settings", Icon: Icons.Settings },
    { label: "Chat WallPaper", Icon: ImageIcon },
    { label: "Chat History", Icon: Icons.History },
    { label: "Storage", Icon: Icons.Database },
    { label: "Support", Icon: Icons.LifeBuoy },
    { label: "About", Icon: Info },
    { label: "Invite a Friend", Icon: Icons.Share2 },
];

const MockSettings = () => (
    <div className="cp-mock absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#FEFEFF", color: "#2B2C33" }}>
        <div className="flex items-center justify-between px-4 pt-[26px] pb-1 text-[7px]" style={{ background: "#DDE5E6", color: "#6D6E75" }}>
            <span>9:41</span>
            <span>▮▮▮ ⌁</span>
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5" style={{ background: "#DDE5E6" }}>
            <Menu size={15} color="#6D6E75" />
            <span className="text-[13px] font-medium" style={{ color: "#6D6E75" }}>
                CliffPickleball
            </span>
        </div>

        <p className="px-4 mt-3 text-[13px]" style={{ color: "#6D6E75" }}>
            Settings
        </p>

        <div className="flex-1 mt-1 overflow-hidden">
            {SETTINGS_ROWS.map((row) => (
                <div key={row.label}>
                    <div className="flex items-center gap-3 px-4 py-[7px]">
                        <row.Icon size={15} color={VERDE} />
                        <span className="flex-1 text-[11px]" style={{ color: "#2B2C33" }}>
                            {row.label}
                        </span>
                        {row.caret ? <ChevronDown size={13} color={VERDE} /> : <ChevronRight size={13} color={VERDE} />}
                    </div>

                    {row.caret && (
                        <div className="pb-1.5 pl-11 pr-4">
                            {["System Theme", "Dark Theme", "Light Theme"].map((t, i) => (
                                <span key={t} className="flex items-center gap-2.5 py-[3px]">
                                    <span
                                        className="grid rounded-full h-[11px] w-[11px] place-items-center"
                                        style={{ border: `1.5px solid ${VERDE}` }}
                                    >
                                        {i === 0 && <span className="h-[5px] w-[5px] rounded-full" style={{ background: VERDE }} />}
                                    </span>
                                    <span className="text-[10px]" style={{ color: "#2B2C33" }}>
                                        {t}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>

        <p className="pb-4 text-[8px] text-center" style={{ color: "#8A8B93" }}>
            Created By <span style={{ color: VERDE }}>Arturo Sojo</span>
        </p>
    </div>
);

const MOCKS = [
    { node: <MockSplash />, screen: 0, tag: "Splash" },
    { node: <MockHome />, screen: 1, tag: "Home" },
    { node: <MockConnections />, screen: 2, tag: "Connections" },
    { node: <MockChat />, screen: 5, tag: "Chat" },
    { node: <MockSettings />, screen: 3, tag: "Settings · light" },
];

/* ------------------------------- Landing ------------------------------- */

const Landing = () => {
    const reduce = useReducedMotion();
    const animated = !reduce;
    const [open, setOpen] = useState(0);

    const railRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 0.9", "end 0.4"] });
    const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

    const shots = p.media.filter((m) => m.src.endsWith(".png") || m.src.endsWith(".jpg") || m.src.endsWith(".webp"));
    const clip = p.media.find((m) => m.src.endsWith(".mp4"));

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ═════════════ 1 · HERO: la cancha y el peloteo ═════════════ */}
            <section className="cp-clip flex min-h-[100svh] flex-col justify-center px-4 pt-28 pb-24 md:px-6 md:pt-32">
                <div aria-hidden className="absolute inset-0 cp-lines opacity-70" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[78%]">
                    <Court animated={animated} />
                </div>
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[420px]"
                    style={{ background: `radial-gradient(58% 60% at 50% 0%, ${AZUL}33, transparent 72%)` }}
                />

                <div className="relative w-full max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-white/12 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: NARANJA }} />
                        {p.category}
                    </span>

                    <h1 className="mt-7 text-[13vw] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-[84px]">
                        <span className="block text-white">Cliff</span>
                        <span className="block brand-gradient-text">Pickleball</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "#B5B4B7" }}>
                        {p.tagline}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                        <Chip>{p.year}</Chip>
                        <Chip>{p.status}</Chip>
                    </div>
                    <p className="mx-auto mt-4 max-w-lg text-[12px] leading-relaxed text-white/45">{p.role}</p>

                    <div className="flex flex-wrap justify-center gap-3 mt-9">
                        {p.links.web && (
                            <span className="cp-btn-green">
                                <BrandButton href={p.links.web}>
                                    <Play size={16} /> Ver la app en vídeo
                                </BrandButton>
                            </span>
                        )}
                        {p.links.github && (
                            <span className="cp-btn-orange">
                                <BrandButton href={p.links.github} variant="outline">
                                    <Github size={16} /> Código en GitHub
                                </BrandButton>
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* ═════════════ 2 · EL PARTIDO: problema y solución ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="01 / El partido"
                        align="center"
                        title={
                            <>
                                Un club repartido <span className="brand-gradient-text">y un binario que lo junta</span>
                            </>
                        }
                    />

                    <div className="grid gap-8 mt-14 md:grid-cols-[1fr_auto_1fr] md:gap-6">
                        <Reveal direction="right">
                            <div className="h-full p-6 cp-card md:p-8">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                                    Lado A · el problema
                                </p>
                                <h3 className="mt-3 text-xl font-bold text-white md:text-2xl">
                                    Tres canales para una sola comunidad
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">{p.problem}</p>
                            </div>
                        </Reveal>

                        {/* la red */}
                        <div aria-hidden className="relative hidden w-14 md:block">
                            <span className="absolute inset-y-8 left-1/2 w-9 -translate-x-1/2 cp-net border-t-[3px] border-white/55" />
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="cp-serve absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
                                    style={{
                                        background: i === 1 ? NARANJA : VERDE,
                                        top: `${24 + i * 26}%`,
                                        animationDelay: `${i * 0.55}s`,
                                    }}
                                />
                            ))}
                        </div>
                        <div aria-hidden className="relative h-10 md:hidden">
                            <span className="absolute inset-x-8 top-1/2 h-8 -translate-y-1/2 cp-net-h border-l-[3px] border-white/55" />
                        </div>

                        <Reveal direction="left" delay={0.12}>
                            <div
                                className="h-full p-6 md:p-8"
                                style={{
                                    border: `2px solid ${VERDE}55`,
                                    borderRadius: 24,
                                    background: `linear-gradient(165deg, ${VERDE}14, ${SUP}88)`,
                                }}
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: VERDE }}>
                                    Lado B · la solución
                                </p>
                                <h3 className="mt-3 text-xl font-bold text-white md:text-2xl">
                                    Dos módulos, una sesión, cifrado en el teléfono
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">{p.solution}</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═════════════ 3 · MARCADOR: métricas ═════════════ */}
            <section className="relative px-4 py-16 md:px-6 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-end justify-between gap-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/40">02 / Marcador</p>
                        <span aria-hidden className="flex-1 h-[2px] bg-white/12" />
                        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: NARANJA }}>
                            rama dev
                        </p>
                    </div>

                    <div className="cp-score grid grid-cols-2 gap-3 mt-8 sm:grid-cols-4 md:gap-4">
                        {p.metrics.map((m, i) => (
                            <Reveal key={m.label} direction="scale" delay={i * 0.05}>
                                <div className="h-full p-4 cp-card cp-hit md:p-6">
                                    <CountMetric value={m.value} label={m.label} />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═════════════ 4 · GOLPES: highlights en zigzag ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="03 / Golpes"
                        title={
                            <>
                                Seis golpes que <span className="brand-gradient-text">sostienen el peloteo</span>
                            </>
                        }
                        lead="Cada tarjeta aparece cuando la línea de la pelota la alcanza."
                    />

                    <div ref={railRef} className="relative mt-14">
                        <svg
                            aria-hidden
                            className="absolute inset-0 hidden w-full h-full md:block"
                            viewBox="0 0 100 1000"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M 50 10 C 92 140 8 250 50 370 C 92 490 8 600 50 720 C 92 840 8 920 50 990"
                                fill="none"
                                stroke="rgba(255,255,255,0.14)"
                                strokeWidth="2"
                                strokeDasharray="4 9"
                                vectorEffect="non-scaling-stroke"
                            />
                            <motion.path
                                d="M 50 10 C 92 140 8 250 50 370 C 92 490 8 600 50 720 C 92 840 8 920 50 990"
                                fill="none"
                                stroke={NARANJA}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                                style={{ pathLength: drawn }}
                            />
                        </svg>

                        <div className="relative space-y-6 md:space-y-10">
                            {p.highlights.map((h, i) => {
                                const Icon = iconOf(h.icon);
                                const right = i % 2 === 1;
                                return (
                                    <Reveal key={h.title} direction={right ? "left" : "right"} amount={0.4}>
                                        <div className={`md:w-[45%] ${right ? "md:ml-auto" : ""}`}>
                                            <div className="p-5 cp-card cp-hit md:p-6">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="grid rounded-full h-11 w-11 place-items-center shrink-0"
                                                        style={{ background: `${NARANJA}1F`, color: NARANJA }}
                                                    >
                                                        <Icon size={19} />
                                                    </span>
                                                    <span className="text-[10px] font-mono tracking-[0.3em] text-white/30">
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                </div>
                                                <h3 className="mt-4 text-base font-bold leading-snug text-white md:text-lg">
                                                    {h.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-white/65">{h.description}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════ 5 · EN LA CANCHA: mockups en CSS ═════════════ */}
            <section className="relative px-4 py-20 cp-clip md:px-6 md:py-28">
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] opacity-[0.35]">
                    <Court animated={false} />
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="04 / En la cancha"
                        title={
                            <>
                                Las pantallas, <span className="brand-gradient-text">pixel a pixel</span>
                            </>
                        }
                        lead="Recreadas en HTML y CSS con los colores exactos de lib/config/colors_collection.dart: azul de splash, verde de acción, naranja de contacto y los violetas del chat."
                    />

                    <div className="mt-12 -mx-4 px-4 md:mx-0 md:px-0">
                        <DragRail className="py-2">
                            {MOCKS.map((m) => (
                                <div key={m.tag} className="w-[248px] shrink-0 sm:w-[262px]">
                                    <PhoneFrame glow={false}>{m.node}</PhoneFrame>
                                    <p
                                        className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em]"
                                        style={{ color: NARANJA }}
                                    >
                                        {m.tag}
                                    </p>
                                    <p className="mt-1 text-[12px] leading-snug text-white/55">
                                        {p.uiScreens[m.screen]?.name}
                                    </p>
                                </div>
                            ))}
                        </DragRail>
                    </div>

                    <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-white/30">
                        ← arrastra para recorrer las cinco pantallas →
                    </p>
                </div>
            </section>

            {/* ═════════════ 6 · CAPTURAS REALES ═════════════ */}
            {shots.length > 0 && (
                <section className="relative px-4 py-20 md:px-6 md:py-24">
                    <div className="max-w-6xl mx-auto">
                        <SectionHead
                            index="05 / Capturas"
                            title={
                                <>
                                    Y así se ve <span className="brand-gradient-text">en el teléfono</span>
                                </>
                            }
                            lead="Capturas del build de la rama dev corriendo en Android."
                        />

                        <div className="mt-12 -mx-4 px-4 md:mx-0 md:px-0">
                            <DragRail className="py-2">
                                {shots.map((m, i) => (
                                    <ShotCard
                                        key={m.src}
                                        src={m.src}
                                        alt={m.caption}
                                        caption={m.caption}
                                        priority={i === 0}
                                        className="w-[210px] shrink-0 sm:w-[240px]"
                                    />
                                ))}
                            </DragRail>
                        </div>

                        {clip && (
                            <Reveal className="max-w-2xl mx-auto mt-14">
                                <AutoVideo src={clip.src} />
                                <p className="mt-3 text-[11px] text-center text-white/45">{clip.caption}</p>
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {/* ═════════════ 7 · EL PUNTO COMPLETO: funcionalidades ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / El punto completo"
                        title={
                            <>
                                Todo lo que <span className="brand-gradient-text">ya juega</span>
                            </>
                        }
                        lead={`${p.features.length} funcionalidades repartidas por la cancha, cada una en su casilla.`}
                    />

                    <Stagger
                        stagger={0.035}
                        className="mt-12 overflow-hidden rounded-[28px] border-t-2 border-l-2 border-white/12 sm:grid sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {p.features.map((f, i) => (
                            <StaggerItem
                                key={f}
                                y={16}
                                className="relative border-b-2 border-r-2 border-white/12 p-5 transition-colors duration-500 hover:bg-white/[0.03] group"
                            >
                                <span className="font-mono text-[10px] tracking-[0.24em]" style={{ color: `${NARANJA}B3` }}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span
                                    aria-hidden
                                    className="absolute right-5 top-5 h-2 w-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{ background: VERDE }}
                                />
                                <p className="mt-2 text-sm leading-relaxed text-white/75">{f}</p>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* ═════════════ 8 · CÓMO ESTÁ ARMADO ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="07 / Cómo está armado"
                        title={
                            <>
                                El vuelo de <span className="brand-gradient-text">un mensaje</span>
                            </>
                        }
                        lead="De la burbuja que escribes al documento que aterriza en Firestore, pasando por el cifrado local."
                    />

                    {/* rail del flujo */}
                    <Reveal className="mt-12">
                        <div className="p-5 cp-card md:p-8">
                            <div className="overflow-x-auto scrollbar-none">
                                <div className="relative min-w-[720px] pt-12 pb-2">
                                    <span aria-hidden className="absolute left-0 right-0 top-[70px] h-[2px] bg-white/12" />
                                    {animated && (
                                        <span aria-hidden className="cp-flow-ball absolute top-[46px] -translate-x-1/2">
                                            <span className="block cp-hop">
                                                <span
                                                    className="block rounded-full h-3.5 w-3.5"
                                                    style={{ background: NARANJA, boxShadow: `0 0 0 6px ${NARANJA}33` }}
                                                />
                                            </span>
                                        </span>
                                    )}

                                    <div className="relative grid grid-cols-6 gap-3">
                                        {FLOW.map((s, i) => (
                                            <div key={s.label} className="text-center">
                                                <span
                                                    className="block h-4 w-[2px] mx-auto"
                                                    style={{ background: "rgba(255,255,255,0.18)" }}
                                                />
                                                <span
                                                    className="grid mx-auto rounded-full h-9 w-9 place-items-center text-[11px] font-bold"
                                                    style={{
                                                        background: i % 2 === 0 ? `${AZUL_CLARO}26` : `${VERDE}22`,
                                                        color: i % 2 === 0 ? AZUL_CLARO : VERDE,
                                                        border: "2px solid rgba(255,255,255,0.12)",
                                                    }}
                                                >
                                                    {i + 1}
                                                </span>
                                                <p className="mt-3 text-[12px] font-semibold text-white">{s.label}</p>
                                                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/30">
                                                    {s.lane}
                                                </p>
                                                <p className="mt-1.5 text-[11px] leading-snug text-white/55">{s.note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* tres carriles */}
                    <div className="grid gap-4 mt-8 md:grid-cols-3">
                        {LANES.map((lane, i) => (
                            <Reveal key={lane.tag} direction="up" delay={i * 0.08}>
                                <div className="h-full p-5 cp-card cp-hit md:p-6">
                                    <p
                                        className="text-[10px] font-semibold uppercase tracking-[0.26em]"
                                        style={{ color: lane.color }}
                                    >
                                        {lane.tag}
                                    </p>
                                    <h3 className="mt-2 text-base font-bold text-white">{lane.title}</h3>
                                    <ul className="mt-4 space-y-2.5">
                                        {lane.items.map((it) => (
                                            <li key={it} className="flex gap-2.5 text-[13px] leading-relaxed text-white/65">
                                                <span
                                                    aria-hidden
                                                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                                                    style={{ background: lane.color }}
                                                />
                                                {it}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal className="mt-8">
                        <div className="p-6 md:p-8" style={{ borderLeft: `3px solid ${NARANJA}`, background: "rgba(255,255,255,0.02)" }}>
                            <p className="text-sm leading-relaxed text-white/70 md:text-base">{p.architecture}</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═════════════ 9 · EQUIPACIÓN: stack ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="08 / Equipación"
                        title={
                            <>
                                78 dependencias, <span className="brand-gradient-text">siete bolsas</span>
                            </>
                        }
                    />

                    <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} direction="scale" delay={i * 0.06}>
                                <div className="h-full p-5 cp-card cp-hit md:p-6">
                                    <div className="flex items-center gap-2">
                                        <span
                                            aria-hidden
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ background: i % 3 === 0 ? AZUL_CLARO : i % 3 === 1 ? VERDE : NARANJA }}
                                        />
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                                            {group.group}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70"
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

            {/* ═════════════ 10 · BOLA MUERTA: retos ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-4xl mx-auto">
                    <SectionHead
                        index="09 / Bola muerta"
                        title={
                            <>
                                Los puntos que <span className="brand-gradient-text">costaron el partido</span>
                            </>
                        }
                        lead="Cinco problemas reales del código y cómo se resolvieron. Toca cada uno para abrirlo."
                    />

                    <div className="mt-12 space-y-3">
                        {p.challenges.map((c, i) => {
                            const isOpen = open === i;
                            return (
                                <Reveal key={i} direction="up" delay={i * 0.05} amount={0.2}>
                                    <div
                                        className="overflow-hidden cp-card"
                                        style={isOpen ? { borderColor: `${NARANJA}66` } : undefined}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpen(isOpen ? -1 : i)}
                                            aria-expanded={isOpen}
                                            className="flex w-full items-start gap-4 p-5 text-left md:p-6"
                                        >
                                            <span
                                                className="grid rounded-full h-8 w-8 shrink-0 place-items-center text-[12px] font-bold"
                                                style={{
                                                    background: isOpen ? NARANJA : "rgba(255,255,255,0.07)",
                                                    color: isOpen ? "#101124" : "rgba(255,255,255,0.55)",
                                                }}
                                            >
                                                {i + 1}
                                            </span>
                                            <span className="flex-1 text-sm leading-relaxed text-white/80 md:text-base">
                                                {c.problem}
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                className="mt-1 transition-transform duration-500 shrink-0"
                                                color={isOpen ? NARANJA : "rgba(255,255,255,0.4)"}
                                                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                                            />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key="body"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={
                                                        reduce
                                                            ? { duration: 0 }
                                                            : { type: "spring", stiffness: 190, damping: 17, mass: 0.7 }
                                                    }
                                                    className="overflow-hidden"
                                                >
                                                    <div
                                                        className="px-5 pt-5 pb-6 md:px-6"
                                                        style={{
                                                            borderTop: "2px solid rgba(255,255,255,0.10)",
                                                            background: `linear-gradient(180deg, ${VERDE}0F, transparent)`,
                                                        }}
                                                    >
                                                        <p
                                                            className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                                                            style={{ color: VERDE }}
                                                        >
                                                            Cómo se devolvió
                                                        </p>
                                                        <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">
                                                            {c.solution}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═════════════ 11 · PALETA Y RESUMEN ═════════════ */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="p-6 cp-card md:p-10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                            10 / Paleta de la app
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            {[
                                { hex: p.brand.primary, name: "splashScreenColor" },
                                { hex: AZUL_CLARO, name: "lightModeBlueColor" },
                                { hex: p.brand.secondary, name: "lightBorderGreenColor" },
                                { hex: p.brand.accent, name: "personIconBgColor" },
                                { hex: p.brand.bg, name: "backgroundDarkMode" },
                                { hex: p.brand.surface, name: "searchBarBgDarkMode" },
                                { hex: p.brand.text, name: "backgroundLightMode" },
                            ].map((c) => (
                                <span key={c.name} className="flex items-center gap-2.5">
                                    <span
                                        className="block rounded-full h-9 w-9 border-2 border-white/15"
                                        style={{ background: c.hex }}
                                    />
                                    <span className="leading-tight">
                                        <span className="block font-mono text-[11px] text-white/75">{c.hex}</span>
                                        <span className="block text-[10px] text-white/35">{c.name}</span>
                                    </span>
                                </span>
                            ))}
                        </div>
                        <p className="mt-7 text-sm leading-relaxed text-white/60 md:text-base">{p.brand.mood}</p>
                        <p className="mt-4 font-mono text-[11px] leading-relaxed text-white/30">{p.brand.source}</p>
                    </div>

                    <div className="mt-14">
                        <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">
                            <RevealWords text="Un club con su propia app, no una carpeta de capturas." />
                        </h2>
                        <Stagger className="mt-8 space-y-5">
                            {p.summary.map((paragraph, i) => (
                                <StaggerItem key={i}>
                                    <p
                                        className={`leading-relaxed ${
                                            i === 0 ? "text-lg text-white/85 md:text-xl" : "text-sm text-white/60 md:text-base"
                                        }`}
                                    >
                                        {paragraph}
                                    </p>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </div>
            </section>

            <div className="py-6 border-y-2 border-white/12 text-[11px] uppercase tracking-[0.24em] text-white/40">
                <Marquee
                    items={[
                        "AES-CBC + PKCS7",
                        "sqflite offline",
                        "Workmanager cada 15 min",
                        "Firestore",
                        "Firebase Storage",
                        "FCM",
                        "Google Sign-In",
                        "7 tipos de mensaje",
                    ]}
                    speed={30}
                    separator="●"
                />
            </div>

            <div className="pb-32">
                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Mensajería cifrada en el dispositivo, contenido que caduca solo y un muro social sobre la misma sesión de Firebase. Si tu comunidad necesita su propio espacio en vez de tres grupos de WhatsApp, éste es exactamente el terreno que conozco."
                />
                <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-white/30">
                    <span className="inline-flex items-center gap-2">
                        <Bell size={12} /> FCM
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <Mail size={12} /> verificación por correo
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <Pencil size={12} /> perfil editable
                    </span>
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
