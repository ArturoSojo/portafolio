"use client"

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    ArrowLeft,
    Bell,
    Camera,
    CheckCheck,
    ChevronRight,
    Contact as ContactIcon,
    CreditCard,
    FileText,
    Fingerprint,
    Images,
    Landmark,
    MapPin,
    MessageCircle,
    MessagesSquare,
    Mic,
    MoreVertical,
    Pin,
    Plus,
    QrCode,
    Receipt,
    ScanLine,
    Search,
    Send,
    ShieldCheck,
    Smile,
    User,
} from "lucide-react";

import { getProject, nextProject } from "@/data-projects";
import ProjectShell from "@/components/projects/project-shell";
import { Chip, CountMetric, Magnetic, Marquee, ProjectOutro, SampleDataNote, SectionHead, TiltCard } from "@/components/projects/bits";
import { AutoVideo, DragRail, PhoneFrame, ShotCard } from "@/components/projects/frames";
import { Reveal, RevealWords, Stagger, StaggerItem, useEnteredView } from "@/components/projects/reveal";

const p = getProject("epale")!;
const nxt = nextProject("epale");

const iconOf = (name: string): LucideIcon =>
    (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;

/* Paleta literal de la app (AppColors) para los mockups. */
const TEAL = "#02AFAA";
const DEEP = "#345A66";
const MINT = "#47EBAF";
const INK = "#181D27";
const TITLE = "#252B37";
const GREY = "#717680";
const LINE = "#E9EAEB";
const PAPER = "#FDFDFD";
const REQUEST = "#0E9F6E";

/* Medidas reales de los assets, para que next/image conserve su proporción. */
const DIMS: Record<string, [number, number]> = {
    "epale_logo.png": [800, 300],
    "epale_logo.webp": [1280, 482],
    "app_icon.png": [1024, 1014],
    "app_icon_12_support_white.webp": [1024, 1024],
    "light_gradient_background.png": [880, 1912],
    "gradient_background.webp": [880, 1912],
    "light_gradient_background.webp": [1000, 1000],
    "fondo-1.png": [1081, 1921],
    "message_loading.gif": [580, 580],
};
const fileOf = (src: string) => src.split("/").pop() ?? "";
const dimsOf = (src: string): [number, number] => DIMS[fileOf(src)] ?? [600, 600];
const asset = (file: string) => p.media.find((m) => fileOf(m.src) === file);
const DARK_TILES = ["epale_logo.png", "epale_logo.webp", "app_icon_12_support_white.webp", "devices.svg"];

const logoLight = asset("epale_logo.png");
const appIcon = asset("app_icon.png");
const splash = asset("light_gradient_background.png");
const chatWall = asset("fondo-1.png");
const coin = asset("epale_coin.svg");
const loader = asset("message_loading.gif");
const videos = p.media.filter((m) => m.src.endsWith(".mp4"));

/* La frase que sigue a los dos puntos del primer párrafo del resumen. */
const heroClause = (() => {
    const tail = p.summary[0].split(": ")[1] ?? p.summary[0];
    return tail.charAt(0).toUpperCase() + tail.slice(1);
})();

/* ---------------------------------------------------------------- estilos */

const css = `
.epale-display {
  font-family: ui-rounded, "SF Pro Rounded", "Segoe UI Variable Display", system-ui, -apple-system, sans-serif;
  letter-spacing: -0.026em;
}
.epale-card {
  background: #FFFFFF;
  border: 1px solid rgba(52, 90, 102, 0.10);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(52, 90, 102, 0.08);
}
.epale-halo {
  background:
    radial-gradient(46% 58% at 10% 0%, rgba(2, 175, 170, 0.18), transparent 72%),
    radial-gradient(38% 46% at 92% 12%, rgba(71, 235, 175, 0.16), transparent 72%);
}
.epale-dot { animation: epale-typing 1.15s ease-in-out infinite; }
@keyframes epale-typing {
  0%, 62%, 100% { transform: translateY(0); opacity: 0.45; }
  30% { transform: translateY(-3px); opacity: 1; }
}
.epale-ring { animation: epale-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
@keyframes epale-ring {
  0% { transform: scale(0.86); opacity: 0.5; }
  70%, 100% { transform: scale(1.32); opacity: 0; }
}
.epale-qr-cell { opacity: 0; transform: scale(0.35); }
.epale-qr-on .epale-qr-cell { animation: epale-qr 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes epale-qr { to { opacity: 1; transform: scale(1); } }
.epale-perf {
  position: relative;
  border-top: 1px dashed rgba(52, 90, 102, 0.32);
}
.epale-perf::before,
.epale-perf::after {
  content: "";
  position: absolute;
  top: -9px;
  height: 18px;
  width: 18px;
  border-radius: 9999px;
  background: var(--epale-notch, #FDFDFD);
}
.epale-perf::before { left: -10px; }
.epale-perf::after { right: -10px; }
.epale-enc { position: relative; border-radius: 20px; isolation: isolate; }
.epale-enc::before {
  content: "";
  position: absolute;
  inset: -1.5px;
  border-radius: 21px;
  z-index: -2;
  background: conic-gradient(from 0deg, transparent 0 54%, #47EBAF 70%, #02AFAA 82%, transparent 94%);
  animation: epale-orbit 4.5s linear infinite;
}
.epale-enc::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  z-index: -1;
  background: #0A0D12;
}
@keyframes epale-orbit { to { transform: rotate(1turn); } }
.epale-socket { animation: epale-dash 1.4s linear infinite; }
@keyframes epale-dash { to { stroke-dashoffset: -24; } }
.epale-travel { animation: epale-travel 3.2s ease-in-out infinite; }
@keyframes epale-travel {
  0% { transform: translateY(0); opacity: 0; }
  12% { opacity: 1; }
  50% { transform: translateY(72px); opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateY(0); opacity: 0; }
}
.epale-mod { transition: opacity 0.35s ease; }
.epale-leather {
  background-image: var(--brand-gradient);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 22px 48px -26px rgba(52, 90, 102, 0.85);
}
.epale-bubble-in {
  background: #FFFFFF;
  border: 1px solid rgba(52, 90, 102, 0.09);
  box-shadow: 0 2px 8px rgba(52, 90, 102, 0.07);
}
@media (prefers-reduced-motion: reduce) {
  .epale-dot,
  .epale-ring,
  .epale-qr-on .epale-qr-cell,
  .epale-enc::before,
  .epale-socket,
  .epale-travel { animation: none !important; }
  .epale-qr-cell { opacity: 1; transform: none; }
}
`;

/* -------------------------------------------------- utilidades del mockup */

const Avatar = ({ letter, color, size = 34 }: { letter: string; color: string; size?: number }) => (
    <span
        className="grid font-semibold text-white rounded-full shrink-0 place-items-center"
        style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.38) }}
    >
        {letter}
    </span>
);

const Dots = ({ color = GREY }: { color?: string }) => (
    <span className="inline-flex items-end gap-[3px]">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="epale-dot block h-[3px] w-[3px] rounded-full"
                style={{ background: color, animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </span>
);

/** Compone un texto carácter a carácter cuando entra en pantalla. */
const Composed = ({ text, className, speed = 55, delay = 0 }: { text: string; className?: string; speed?: number; delay?: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [shown, setShown] = useState("");
    const reduce = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (reduce) {
            setShown(text);
            return;
        }
        let timer = 0;
        let ticker = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let i = 0;
                timer = window.setTimeout(() => {
                    ticker = window.setInterval(() => {
                        i += 1;
                        setShown(text.slice(0, i));
                        if (i >= text.length) window.clearInterval(ticker);
                    }, speed);
                }, delay);
            },
            { threshold: 0.35 }
        );
        observer.observe(node);
        return () => {
            observer.disconnect();
            window.clearTimeout(timer);
            window.clearInterval(ticker);
        };
    }, [text, speed, delay, reduce]);

    return (
        <span ref={ref} className={className}>
            {shown}
            <span className="opacity-0">{shown.length < text.length ? text.slice(shown.length) : ""}</span>
        </span>
    );
};

/* ------------------------------------------------- burbujas y componentes */

const PayBubble = ({ amount }: { amount: ReactNode }) => (
    <div
        className="relative w-[82%] rounded-[14px] rounded-br-[4px] p-2.5 text-white"
        style={{ background: TEAL, boxShadow: "0 8px 20px rgba(2,175,170,0.30)" }}
    >
        <span
            aria-hidden
            className="epale-ring absolute inset-0 rounded-[14px] rounded-br-[4px] border-2 pointer-events-none"
            style={{ borderColor: MINT }}
        />
        <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/85">
            <Receipt size={10} /> Pago
        </div>
        <p className="epale-display mt-1 text-[18px] font-bold leading-none">{amount}</p>
        <div className="mt-2 space-y-[3px] text-[8px] text-white/85">
            <div className="flex justify-between gap-2">
                <span>Subtotal</span>
                <span>Bs. 1.225,00</span>
            </div>
            <div className="flex justify-between gap-2">
                <span>Comisión Bancaria (2%)</span>
                <span>Bs. 25,00</span>
            </div>
        </div>
        <div className="my-1.5 h-px bg-white/30" />
        <div className="flex items-center justify-between text-[8px] text-white/85">
            <span>≈ 6,94 $</span>
            <span className="truncate">Almuerzo del viernes</span>
        </div>
        <div className="mt-2 rounded-md bg-white/20 py-1 text-center text-[9px] font-semibold">Ver detalle</div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[7px] text-white/75">
            9:41 <CheckCheck size={9} />
        </div>
    </div>
);

const RequestBubble = () => (
    <div className="w-[74%] rounded-[14px] rounded-bl-[4px] p-2.5 text-white" style={{ background: REQUEST }}>
        <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/85">
            <QrCode size={10} /> Solicitud de pago
        </div>
        <p className="epale-display mt-1 text-[15px] font-bold leading-none">Bs. 380,00</p>
        <p className="mt-1 text-[8px] text-white/80">Cuota del condominio</p>
        <div className="mt-2 rounded-md bg-white py-1 text-center text-[9px] font-bold" style={{ color: REQUEST }}>
            Pagar
        </div>
    </div>
);

const ChatBackdrop = () => (
    <>
        <span aria-hidden className="absolute inset-0" style={{ background: PAPER }} />
        {chatWall && (
            <Image src={chatWall.src} alt="" fill sizes="320px" className="object-cover opacity-[0.13]" />
        )}
    </>
);

const ChatTopBar = () => (
    <div
        className="relative z-10 flex items-center gap-2 px-2.5 pt-9 pb-2"
        style={{ background: "rgba(255,255,255,0.94)", borderBottom: `1px solid ${LINE}` }}
    >
        <ArrowLeft size={13} style={{ color: TITLE }} />
        <Avatar letter="M" color={DEEP} size={26} />
        <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold" style={{ color: TITLE }}>
                Mariana Ruiz
            </p>
            <p className="text-[8px]" style={{ color: TEAL }}>
                Escribiendo...
            </p>
        </div>
        <Search size={12} style={{ color: GREY }} />
        <MoreVertical size={12} style={{ color: GREY }} />
    </div>
);

const ChatInputBar = ({ menu = false }: { menu?: boolean }) => (
    <div className="relative z-10 px-2 pb-3 pt-1.5">
        {menu && (
            <div className="epale-card mb-1.5 grid grid-cols-3 gap-1 p-1.5" style={{ borderRadius: 12 }}>
                {[
                    { label: "Cámara", icon: Camera },
                    { label: "Galería", icon: Images },
                    { label: "Documento", icon: FileText },
                    { label: "Contacto", icon: ContactIcon },
                    { label: "Pago", icon: Receipt },
                    { label: "Solicitar", icon: QrCode },
                ].map((item) => (
                    <span key={item.label} className="flex flex-col items-center gap-0.5 rounded-lg py-1">
                        <span
                            className="grid rounded-full h-6 w-6 place-items-center"
                            style={{ background: "rgba(2,175,170,0.12)", color: TEAL }}
                        >
                            <item.icon size={11} />
                        </span>
                        <span className="text-[6.5px]" style={{ color: GREY }}>
                            {item.label}
                        </span>
                    </span>
                ))}
            </div>
        )}
        <div className="flex items-center gap-1.5">
            <div
                className="flex flex-1 items-center gap-1.5 rounded-full bg-white px-2 py-1.5"
                style={{ border: `1px solid ${LINE}` }}
            >
                <Plus size={12} style={{ color: TEAL }} />
                <span className="flex-1 text-[8.5px]" style={{ color: "#A4A7AE" }}>
                    Escribe un mensaje...
                </span>
                <Smile size={11} style={{ color: GREY }} />
                <Camera size={11} style={{ color: GREY }} />
            </div>
            <span className="grid rounded-full h-7 w-7 place-items-center shrink-0" style={{ background: TEAL }}>
                <Mic size={12} className="text-white" />
            </span>
        </div>
    </div>
);

/* ------------------------------------------------------- MOCKUP 1 · chats */

const CHAT_ROWS = [
    { name: "Mariana Ruiz", preview: "Escribiendo...", tone: "typing", time: "9:41", unread: 2, pinned: true, color: TEAL },
    { name: "Grupo Familia", preview: "Foto", tone: "media", time: "9:12", unread: 0, pinned: true, color: DEEP },
    { name: "Carlos Medina", preview: "Pago #1042", tone: "pay", time: "8:57", unread: 1, pinned: false, color: "#7A5AF8" },
    { name: "Andreína P.", preview: "nos vemos a las 6", tone: "draft", time: "Ayer", unread: 0, pinned: false, color: "#F97066" },
    { name: "Luis Ferrer", preview: "Nota de voz", tone: "voice", time: "Ayer", unread: 0, pinned: false, color: "#2E90FA" },
    { name: "Asistente Épale", preview: "¿En qué te ayudo hoy?", tone: "", time: "Lun", unread: 0, pinned: false, color: MINT },
    { name: "Yudith Rojas", preview: "Ubicación", tone: "place", time: "Lun", unread: 0, pinned: false, color: "#F79009" },
];

const MockChats = () => (
    <div className="flex flex-col w-full h-full" style={{ background: PAPER, color: INK }}>
        <div className="px-3 pt-9">
            <div className="flex items-center justify-between">
                <p className="epale-display text-[17px] font-semibold" style={{ color: TITLE }}>
                    Mensajes
                </p>
                <span className="grid rounded-full h-7 w-7 place-items-center" style={{ background: TEAL }}>
                    <MessagesSquare size={13} className="text-white" />
                </span>
            </div>

            <div
                className="mt-2 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5"
                style={{ border: `0.6px solid ${LINE}` }}
            >
                <Search size={11} style={{ color: "#A4A7AE" }} />
                <span className="text-[9px]" style={{ color: "#A4A7AE" }}>
                    Buscar...
                </span>
            </div>

            <div className="flex gap-1 mt-2 overflow-hidden">
                {["Todos", "Borradores", "No leídos (3)", "Grupos (2)"].map((f, i) => (
                    <span
                        key={f}
                        className="whitespace-nowrap rounded-full px-2 py-[3px] text-[7.5px] font-medium"
                        style={
                            i === 0
                                ? { background: TEAL, color: "#fff" }
                                : { background: "#fff", color: GREY, border: `0.6px solid ${LINE}` }
                        }
                    >
                        {f}
                    </span>
                ))}
            </div>
        </div>

        <div className="flex-1 mt-1 overflow-hidden">
            {CHAT_ROWS.map((row) => (
                <div
                    key={row.name}
                    className="flex items-center gap-2 px-3 py-[7px]"
                    style={{ background: row.pinned ? "rgba(52,90,102,0.035)" : "transparent" }}
                >
                    <Avatar letter={row.name.slice(0, 1)} color={row.color} size={30} />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-semibold" style={{ color: TITLE }}>
                            {row.name}
                        </p>
                        <p className="truncate text-[8px]" style={{ color: row.tone === "typing" ? TEAL : GREY }}>
                            {row.tone === "draft" && <span style={{ color: "#F97066" }}>Borrador: </span>}
                            {row.tone === "media" && "🖼 "}
                            {row.tone === "voice" && "🎙 "}
                            {row.tone === "place" && "📍 "}
                            {row.tone === "pay" && "🧾 "}
                            {row.preview}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-[3px]">
                        <span className="text-[7px]" style={{ color: GREY }}>
                            {row.time}
                        </span>
                        {row.unread > 0 ? (
                            <span
                                className="grid h-[13px] w-[13px] place-items-center rounded-full text-[7px] font-bold text-white"
                                style={{ background: TEAL }}
                            >
                                {row.unread}
                            </span>
                        ) : row.pinned ? (
                            <Pin size={8} style={{ color: GREY }} />
                        ) : (
                            <span className="h-[13px]" />
                        )}
                    </div>
                </div>
            ))}
        </div>

        <div
            className="flex items-center justify-around px-2 pt-1.5 pb-3"
            style={{ background: "#fff", borderTop: `1px solid ${LINE}` }}
        >
            {[
                { label: "Chats", icon: MessagesSquare, on: true },
                { label: "Pagos", icon: CreditCard, on: false },
                { label: "Perfil", icon: User, on: false },
            ].map((tab) => (
                <span key={tab.label} className="flex flex-col items-center gap-[2px]">
                    <tab.icon size={14} style={{ color: tab.on ? TEAL : "#A4A7AE" }} />
                    <span className="text-[7px]" style={{ color: tab.on ? TEAL : "#A4A7AE" }}>
                        {tab.label}
                    </span>
                </span>
            ))}
        </div>
    </div>
);

/* ------------------------------------------- MOCKUP 2 · chat con el pago */

const MockChatPay = () => (
    <div className="relative flex flex-col w-full h-full overflow-hidden">
        <ChatBackdrop />
        <ChatTopBar />

        <div className="relative z-10 flex flex-col justify-end flex-1 gap-1.5 px-2.5 py-2">
            <div className="epale-bubble-in max-w-[70%] self-start rounded-[14px] rounded-bl-[4px] px-2.5 py-1.5">
                <p className="text-[9px]" style={{ color: INK }}>
                    ¿Me pasas lo del almuerzo?
                </p>
                <p className="text-right text-[6.5px]" style={{ color: GREY }}>
                    9:38
                </p>
            </div>

            <div
                className="max-w-[70%] self-end rounded-[14px] rounded-br-[4px] px-2.5 py-1.5 text-white"
                style={{ background: TEAL }}
            >
                <p className="text-[9px]">Va por aquí mismo, no hago transferencia 😌</p>
                <p className="flex items-center justify-end gap-1 text-[6.5px] text-white/70">
                    9:39 <CheckCheck size={8} />
                </p>
            </div>

            <div className="flex justify-end">
                <PayBubble amount="Bs. 1.250,00" />
            </div>

            <div className="flex justify-start">
                <RequestBubble />
            </div>

            <div className="epale-bubble-in self-start rounded-full px-2.5 py-1.5">
                <Dots />
            </div>
        </div>

        <ChatInputBar menu />
    </div>
);

/* --------------------------------------------- MOCKUP 3 · centro de pagos */

const WALLET_ROWS = [
    { title: "Generar QR de cobro", sub: "Crea un código QR para recibir un pago.", icon: QrCode, badge: 0 },
    { title: "Pago o cobro por QR", sub: "Escanea un QR para pagar o cobrar.", icon: ScanLine, badge: 0 },
    { title: "Pagos agendados", sub: "Programa pagos a tus contactos de épale.", icon: Bell, badge: 2 },
    { title: "Pago a usuario", sub: "Realiza pagos a tus contactos de épale.", icon: Send, badge: 0 },
    { title: "Pago de servicios", sub: "Realiza pagos de tus servicios.", icon: Receipt, badge: 0 },
    { title: "Cuentas vinculadas", sub: "Administre sus cuentas bancarias.", icon: Landmark, badge: 0 },
    { title: "Historial", sub: "Transacciones enviadas y recibidas.", icon: FileText, badge: 0 },
    { title: "Ajustes", sub: "Gestione su PIN y autenticación biométrica.", icon: Fingerprint, badge: 0 },
];

const MockWallet = () => (
    <div className="flex flex-col w-full h-full" style={{ background: PAPER, color: INK }}>
        <div className="px-3 pt-9">
            <p className="epale-display text-[17px] font-semibold" style={{ color: TITLE }}>
                Pagos
            </p>

            <div className="flex items-center gap-2 p-2.5 mt-2 rounded-xl" style={{ background: TEAL }}>
                <span className="relative">
                    <QrCode size={26} className="text-white" />
                    <span
                        className="absolute -right-1.5 -top-1.5 grid h-[13px] w-[13px] place-items-center rounded-full text-[7px] font-bold text-white"
                        style={{ background: "#00C853" }}
                    >
                        2
                    </span>
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-bold text-white">QR de Mesa 4</p>
                    <p className="text-[8px] text-white/80">2 códigos QR</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-white">Bs.1.250,00</p>
                    <p className="text-[7px] text-white/80">QR Finaliza en 1h 20min</p>
                </div>
            </div>

            <div className="p-2 mt-2 rounded-xl" style={{ background: "#F5F6F7" }}>
                <p className="text-[7.5px]" style={{ color: GREY }}>
                    Tasas del día 07/09/2026 valor BCV
                </p>
                <div className="flex gap-4 mt-1">
                    <p className="epale-display text-[13px] font-bold" style={{ color: TITLE }}>
                        USD 36,45
                    </p>
                    <p className="epale-display text-[13px] font-bold" style={{ color: TITLE }}>
                        EUR 39,80
                    </p>
                </div>
            </div>
        </div>

        <div className="flex-1 px-3 pt-1.5 overflow-hidden">
            {WALLET_ROWS.map((row) => (
                <div key={row.title} className="flex items-center gap-2 py-[5px]">
                    <span
                        className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full"
                        style={{ background: "#F2F4F5", color: DEEP }}
                    >
                        <row.icon size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-semibold" style={{ color: TITLE }}>
                            {row.title}
                        </p>
                        <p className="truncate text-[7.5px]" style={{ color: GREY }}>
                            {row.sub}
                        </p>
                    </div>
                    {row.badge > 0 && (
                        <span className="grid h-[12px] w-[12px] place-items-center rounded-full bg-[#F97066] text-[6.5px] font-bold text-white">
                            {row.badge}
                        </span>
                    )}
                    <ChevronRight size={11} style={{ color: "#A4A7AE" }} />
                </div>
            ))}
        </div>

        <div
            className="flex items-center justify-around px-2 pt-1.5 pb-3"
            style={{ background: "#fff", borderTop: `1px solid ${LINE}` }}
        >
            {[
                { label: "Chats", icon: MessagesSquare, on: false },
                { label: "Pagos", icon: CreditCard, on: true },
                { label: "Perfil", icon: User, on: false },
            ].map((tab) => (
                <span key={tab.label} className="flex flex-col items-center gap-[2px]">
                    <tab.icon size={14} style={{ color: tab.on ? TEAL : "#A4A7AE" }} />
                    <span className="text-[7px]" style={{ color: tab.on ? TEAL : "#A4A7AE" }}>
                        {tab.label}
                    </span>
                </span>
            ))}
        </div>
    </div>
);

/* ------------------------------------------- MOCKUP 4 · hoja de pago + PIN */

const MockSheet = () => (
    <div className="relative flex flex-col w-full h-full overflow-hidden">
        <ChatBackdrop />
        <span aria-hidden className="absolute inset-0 z-10 bg-[#0A0D12]/45" />

        <div className="relative z-20 flex flex-col justify-end flex-1">
            <div className="rounded-t-[20px] bg-white px-3 pb-3 pt-2">
                <span className="mx-auto mb-2 block h-1 w-9 rounded-full" style={{ background: "#D5D7DA" }} />
                <p className="epale-display text-[13px] font-semibold" style={{ color: TITLE }}>
                    Pago
                </p>

                <p className="mt-2 text-[8px] font-medium" style={{ color: GREY }}>
                    Monto
                </p>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <div className="rounded-lg px-2 py-1.5" style={{ border: `1px solid ${TEAL}` }}>
                        <span className="text-[8px]" style={{ color: GREY }}>
                            Bs.
                        </span>
                        <span className="epale-display ml-1 text-[11px] font-bold" style={{ color: TITLE }}>
                            1.250,00
                        </span>
                    </div>
                    <div className="rounded-lg px-2 py-1.5" style={{ border: `1px solid ${LINE}` }}>
                        <span className="text-[8px]" style={{ color: GREY }}>
                            $
                        </span>
                        <span className="epale-display ml-1 text-[11px] font-bold" style={{ color: TITLE }}>
                            34,29
                        </span>
                    </div>
                </div>

                <div className="mt-2 space-y-[3px] text-[8px]" style={{ color: GREY }}>
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Bs. 1.225,00</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Comisión Bancaria (2%)</span>
                        <span>Bs. 25,00</span>
                    </div>
                    <div className="h-px my-1" style={{ background: LINE }} />
                    <div className="flex justify-between">
                        <span className="text-[9px] font-bold" style={{ color: INK }}>
                            Total:
                        </span>
                        <span className="epale-display text-[10px] font-bold" style={{ color: TEAL }}>
                            Bs. 1.250,00
                        </span>
                    </div>
                </div>

                <div className="mt-2 rounded-lg px-2 py-1.5 text-[8px]" style={{ border: `1px solid ${LINE}`, color: "#A4A7AE" }}>
                    Concepto (Opcional)
                </div>

                <div
                    className="mt-1.5 flex items-center gap-1.5 rounded-lg px-2 py-1.5"
                    style={{ border: `1px solid ${LINE}` }}
                >
                    <Landmark size={11} style={{ color: DEEP }} />
                    <span className="flex-1 text-[8px] font-medium" style={{ color: TITLE }}>
                        Banesco · Cuenta favorita
                    </span>
                    <ChevronRight size={10} style={{ color: "#A4A7AE" }} />
                </div>

                <div
                    className="mt-2.5 rounded-xl py-2 text-center text-[10px] font-bold text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, ${DEEP}, ${TEAL})` }}
                >
                    Confirmar pago
                </div>

                <div className="epale-card mt-2.5 p-2" style={{ borderRadius: 12 }}>
                    <p className="text-center text-[8px] font-semibold" style={{ color: TITLE }}>
                        Introduce tu PIN
                    </p>
                    <div className="flex justify-center gap-1.5 mt-1.5">
                        {[0, 1, 2, 3].map((i) => (
                            <span
                                key={i}
                                className="grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold"
                                style={{
                                    border: `1px solid ${i < 3 ? TEAL : LINE}`,
                                    color: TITLE,
                                    background: i < 3 ? "rgba(2,175,170,0.08)" : "#fff",
                                }}
                            >
                                {i < 3 ? "•" : ""}
                            </span>
                        ))}
                    </div>
                    <p className="mt-1.5 flex items-center justify-center gap-1 text-[7px]" style={{ color: GREY }}>
                        <Fingerprint size={9} /> o usa tu huella
                    </p>
                </div>
            </div>
        </div>
    </div>
);

/* ------------------------------------------------- MOCKUP 5 · pago exitoso */

const MockSuccess = () => (
    <div className="flex flex-col w-full h-full" style={{ background: PAPER, color: INK }}>
        <div className="flex flex-col items-center flex-1 px-3 pt-12">
            <span className="grid rounded-full h-12 w-12 place-items-center" style={{ background: "rgba(0,200,83,0.12)" }}>
                <span className="grid rounded-full h-9 w-9 place-items-center" style={{ background: "#00C853" }}>
                    <CheckCheck size={17} className="text-white" />
                </span>
            </span>
            <p className="epale-display mt-2.5 text-[14px] font-bold" style={{ color: TITLE }}>
                Pago exitoso
            </p>
            <p className="epale-display text-[20px] font-bold" style={{ color: TEAL }}>
                Bs. 1.250,00
            </p>

            <div className="w-full mt-3 bg-white epale-card" style={{ ["--epale-notch" as string]: PAPER }}>
                <div className="px-3 py-2.5 space-y-1">
                    {[
                        ["Referencia", "EP-2409183"],
                        ["Fecha", "07/09/2026 · 9:41"],
                        ["Destinatario", "Mariana Ruiz"],
                        ["Cuenta", "Banesco ****4417"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-[8px]">
                            <span style={{ color: GREY }}>{k}</span>
                            <span className="font-semibold" style={{ color: TITLE }}>
                                {v}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="epale-perf" />
                <div className="px-3 py-2.5">
                    <div className="flex items-center justify-between text-[8px]">
                        <span style={{ color: GREY }}>Comisión</span>
                        <span style={{ color: TITLE }}>Bs. 25,00</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[9px] font-bold">
                        <span style={{ color: INK }}>Total</span>
                        <span style={{ color: TEAL }}>Bs. 1.250,00</span>
                    </div>
                </div>
            </div>

            <div
                className="mt-2.5 w-full rounded-xl py-2 text-center text-[9px] font-bold text-white"
                style={{ backgroundImage: `linear-gradient(135deg, ${DEEP}, ${TEAL})` }}
            >
                Compartir comprobante
            </div>
            {loader && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={loader.src} alt={loader.caption} className="mt-3 h-7 w-7 opacity-70" />
            )}
        </div>
    </div>
);

/* ------------------------------------------------- MOCKUP 6 · prueba de vida */

const MockKyc = () => (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#0B1417" }}>
        <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: `radial-gradient(58% 34% at 50% 34%, rgba(2,175,170,0.28), rgba(10,13,18,0.92) 72%)` }}
        />
        <div className="relative flex flex-col items-center h-full px-4 pt-10 pb-5">
            <p className="text-[10px] font-semibold text-white">Verificación de identidad</p>
            <p className="mt-0.5 text-[7.5px] text-white/55">Paso 3 de 5 · Prueba de vida</p>

            <div className="relative mt-6">
                <span
                    className="block h-[132px] w-[104px] rounded-[52px]"
                    style={{ border: `3px solid ${TEAL}`, background: "rgba(255,255,255,0.05)" }}
                />
                <svg viewBox="0 0 104 132" className="absolute inset-0" aria-hidden>
                    <rect
                        x="1.5"
                        y="1.5"
                        width="101"
                        height="129"
                        rx="50.5"
                        fill="none"
                        stroke={MINT}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="420"
                        strokeDashoffset="150"
                    />
                </svg>
                <span className="absolute inset-0 grid place-items-center">
                    <User size={44} className="text-white/25" />
                </span>
            </div>

            <p className="epale-display mt-5 text-[15px] font-bold text-white">Sonríe</p>
            <p className="mt-1 text-[7.5px] text-white/55">Mantén el rostro dentro del óvalo</p>

            <div className="w-full mt-5 space-y-1">
                {[
                    ["Parpadea", true],
                    ["Gira la cabeza a la izquierda", true],
                    ["Sonríe", false],
                    ["Acércate un poco", false],
                ].map(([label, done]) => (
                    <div
                        key={String(label)}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                        style={{ background: done ? "rgba(0,200,83,0.14)" : "rgba(255,255,255,0.06)" }}
                    >
                        <span
                            className="grid h-[13px] w-[13px] place-items-center rounded-full"
                            style={{ background: done ? "#00C853" : "rgba(255,255,255,0.16)" }}
                        >
                            {done ? <CheckCheck size={8} className="text-white" /> : null}
                        </span>
                        <span className="text-[7.5px] text-white/80">{label}</span>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: "rgba(249,112,102,0.14)" }}>
                <ScanLine size={11} style={{ color: "#F97066" }} />
                <span className="text-[7px]" style={{ color: "#F97066" }}>
                    Si falla, se reintenta desde el escaneo de la cédula
                </span>
            </div>
        </div>
    </div>
);

const SCREENS = [
    { mock: <MockChats />, name: p.uiScreens[0]?.name ?? "Mensajes", note: "Filtros, borradores, fijados y no leídos" },
    { mock: <MockChatPay />, name: p.uiScreens[1]?.name ?? "Conversación", note: "El pago como un mensaje más" },
    { mock: <MockWallet />, name: p.uiScreens[2]?.name ?? "Pagos", note: "QR activos, tasa BCV y accesos" },
    { mock: <MockSheet />, name: p.uiScreens[3]?.name ?? "Hoja de pago", note: "Doble moneda, comisión y PIN" },
    { mock: <MockSuccess />, name: "Comprobante del pago", note: "Ticket con recorte perforado" },
    { mock: <MockKyc />, name: p.uiScreens[4]?.name ?? "KYC", note: "Retos de prueba de vida" },
];

/* ---------------------------------------------- el QR que se dibuja solo */

const qrFilled = (r: number, c: number) => {
    const ring = (r0: number, c0: number) => {
        const rr = r - r0;
        const cc = c - c0;
        if (rr < 0 || rr > 2 || cc < 0 || cc > 2) return null;
        return rr === 0 || rr === 2 || cc === 0 || cc === 2;
    };
    const corner = ring(0, 0) ?? ring(0, 10) ?? ring(10, 0);
    if (corner !== null) return corner;
    return ((r * 3 + 1) * (c * 5 + 2) + r * c) % 7 < 3;
};

const QrCard = ({ on }: { on: boolean }) => (
    <div className={`epale-card w-[104px] p-2 sm:w-[136px] sm:p-3 ${on ? "epale-qr-on" : ""}`}>
        <div className="grid gap-[1px]" style={{ gridTemplateColumns: "repeat(13, 1fr)" }}>
            {Array.from({ length: 169 }, (_, i) => {
                const r = Math.floor(i / 13);
                const c = i % 13;
                const filled = qrFilled(r, c);
                return (
                    <span
                        key={i}
                        className="epale-qr-cell aspect-square rounded-[1px]"
                        style={{
                            background: filled ? DEEP : "transparent",
                            animationDelay: `${(r + c) * 18}ms`,
                        }}
                    />
                );
            })}
        </div>
        <p className="mt-1.5 text-center text-[8px] font-semibold" style={{ color: DEEP }}>
            EPQ1·AES-256-GCM
        </p>
    </div>
);

const BankCard = () => (
    <div
        className="w-[104px] rounded-2xl p-2.5 text-white sm:w-[136px] sm:p-3"
        style={{ background: `linear-gradient(150deg, ${DEEP}, #0A0D12)` }}
    >
        <div className="flex items-center justify-between">
            <Landmark size={13} />
            <span className="text-[7px] uppercase tracking-[0.2em] opacity-70">favorita</span>
        </div>
        <p className="epale-display mt-4 text-[11px] font-bold tracking-[0.14em]">**** 4417</p>
        <p className="mt-1 text-[7.5px] opacity-70">Cuenta vinculada</p>
        <p className="text-[7.5px] opacity-70">Bs. · Banesco</p>
    </div>
);

const TicketPiece = () => (
    <div className="epale-card w-[104px] overflow-visible sm:w-[136px]" style={{ ["--epale-notch" as string]: PAPER }}>
        <div className="px-2.5 pt-2.5 sm:px-3">
            <p className="text-[7px] uppercase tracking-[0.18em]" style={{ color: GREY }}>
                comprobante
            </p>
            <p className="epale-display text-[13px] font-bold" style={{ color: TEAL }}>
                Bs. 1.250,00
            </p>
            <p className="text-[7.5px]" style={{ color: GREY }}>
                Mariana Ruiz
            </p>
        </div>
        <div className="my-2 epale-perf" />
        <div className="px-2.5 pb-2.5 sm:px-3">
            <p className="text-[7px]" style={{ color: GREY }}>
                Ref. EP-2409183
            </p>
            <p className="text-[7px]" style={{ color: GREY }}>
                07/09/2026 · 9:41
            </p>
        </div>
    </div>
);

/** El único elemento tridimensional de la página: la billetera que se abre. */
const WalletFold = () => {
    const reduce = useReducedMotion();
    const { ref, inView } = useEnteredView<HTMLDivElement>(0.4);
    const open = reduce ? { rotateX: 0 } : undefined;

    return (
        <div ref={ref} className="relative mx-auto max-w-2xl" style={{ perspective: 1200 }}>
            <div className="relative h-[380px] sm:h-[400px]">
                <div className="absolute inset-x-0 bottom-1/2 z-10 flex flex-wrap items-end justify-center gap-2 px-2 pb-3 sm:gap-4">
                    {[<QrCard key="qr" on={inView} />, <BankCard key="bank" />, <TicketPiece key="ticket" />].map(
                        (piece, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 46, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{
                                    duration: reduce ? 0 : 0.75,
                                    delay: reduce ? 0 : 0.42 + i * 0.12,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                {piece}
                            </motion.div>
                        )
                    )}
                </div>

                <motion.div
                    aria-hidden
                    className="epale-leather absolute inset-x-0 top-0 z-20 h-1/2 rounded-t-[26px] rounded-b-[6px]"
                    style={{ transformOrigin: "bottom center" }}
                    initial={{ rotateX: 0 }}
                    whileInView={open ?? { rotateX: -58 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="absolute inset-x-0 bottom-0 h-px bg-white/35" />
                    {logoLight && (
                        <Image
                            src={logoLight.src}
                            alt={p.name}
                            width={800}
                            height={300}
                            className="absolute w-24 h-auto -translate-x-1/2 opacity-90 left-1/2 top-6 sm:w-32"
                        />
                    )}
                </motion.div>

                <motion.div
                    aria-hidden
                    className="epale-leather absolute inset-x-0 bottom-0 z-20 h-1/2 rounded-b-[26px] rounded-t-[6px]"
                    style={{ transformOrigin: "top center" }}
                    initial={{ rotateX: 0 }}
                    whileInView={open ?? { rotateX: 58 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="absolute mx-auto rounded-full inset-x-6 bottom-6 h-11 bg-black/15" />
                    <span className="absolute text-white left-6 bottom-9 text-[10px] uppercase tracking-[0.3em] opacity-70">
                        billetera
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

/* ------------------------------------------ la malla que se cifra sola */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const cipherRow = (seed: number, len: number) => {
    let x = seed * 9301 + 49297;
    let out = "";
    for (let i = 0; i < len; i += 1) {
        x = (x * 1103515245 + 12345) % 2147483647;
        out += ALPHABET[Math.abs(x) % ALPHABET.length];
    }
    return out;
};
const CIPHER_ROWS = Array.from({ length: 8 }, (_, i) => cipherRow(i + 7, 64));

const CipherMesh = () => {
    const [rows, setRows] = useState(CIPHER_ROWS);
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node || reduce) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                let frame = 0;
                const id = window.setInterval(() => {
                    frame += 1;
                    if (frame > 14) {
                        window.clearInterval(id);
                        setRows(CIPHER_ROWS);
                        return;
                    }
                    setRows(CIPHER_ROWS.map((_, i) => cipherRow(i * 31 + frame * 17 + 5, 64)));
                }, 55);
            },
            { threshold: 0.3 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [reduce]);

    return (
        <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden select-none rounded-[20px]">
            <div className="p-3 font-mono text-[11px] leading-[1.6] text-[#47EBAF]/25">
                {rows.map((row, i) => (
                    <p key={i} className="whitespace-nowrap">
                        {row}
                    </p>
                ))}
            </div>
        </div>
    );
};

/* ------------------------------------------------ diagrama de arquitectura */

const MODULES = ["auth", "chat", "payments", "ai_chat", "camera", "home", "shared"];
const LAYERS = [
    { name: "domain", note: "entidades · contratos · casos de uso", y: 96 },
    { name: "infrastructure", note: "datasources · mappers · Dio · Socket.IO · SQLCipher", y: 168 },
    { name: "presentation", note: "pantallas · widgets · 143 providers Riverpod", y: 240 },
];

const ArchDiagram = () => {
    const [hover, setHover] = useState<string | null>(null);

    return (
        <div className="overflow-x-auto scrollbar-none">
            <svg viewBox="0 0 720 316" className="w-full min-w-[600px]" role="img" aria-label="Arquitectura por capas de Épale">
                {LAYERS.map((layer) => (
                    <g key={layer.name}>
                        <rect
                            x="14"
                            y={layer.y}
                            width="692"
                            height="56"
                            rx="14"
                            fill="#FFFFFF"
                            stroke="rgba(52,90,102,0.14)"
                        />
                        <text x="30" y={layer.y + 24} fontSize="13" fontWeight="700" fill={DEEP}>
                            {layer.name}
                        </text>
                        <text x="30" y={layer.y + 41} fontSize="10" fill={GREY}>
                            {layer.note}
                        </text>
                    </g>
                ))}

                {MODULES.map((mod, i) => {
                    const x = 20 + i * 98;
                    const cx = x + 43;
                    const active = hover === mod;
                    const dim = hover !== null && !active;
                    return (
                        <g
                            key={mod}
                            className="epale-mod cursor-pointer"
                            style={{ opacity: dim ? 0.25 : 1 }}
                            onMouseEnter={() => setHover(mod)}
                            onMouseLeave={() => setHover(null)}
                        >
                            <line
                                x1={cx}
                                y1="48"
                                x2={cx}
                                y2="296"
                                stroke={active ? TEAL : "rgba(52,90,102,0.16)"}
                                strokeWidth={active ? 2.4 : 1.4}
                            />
                            <rect
                                x={x}
                                y="16"
                                width="86"
                                height="30"
                                rx="15"
                                fill={active ? TEAL : "#FFFFFF"}
                                stroke={active ? TEAL : "rgba(52,90,102,0.18)"}
                            />
                            <text
                                x={cx}
                                y="35"
                                fontSize="11"
                                fontWeight="600"
                                textAnchor="middle"
                                fill={active ? "#FFFFFF" : DEEP}
                            >
                                {mod}
                            </text>
                            {LAYERS.map((layer) => (
                                <circle
                                    key={layer.name}
                                    cx={cx}
                                    cy={layer.y + 28}
                                    r={active ? 5 : 3.4}
                                    fill={active ? TEAL : "rgba(52,90,102,0.3)"}
                                />
                            ))}
                        </g>
                    );
                })}

                <g>
                    <path
                        className="epale-socket"
                        d="M694 196 L694 268"
                        stroke={MINT}
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        fill="none"
                    />
                    <circle className="epale-travel" cx="694" cy="196" r="3.5" fill={TEAL} />
                    <text x="688" y="308" fontSize="9" textAnchor="end" fill={GREY}>
                        socket.io · 15 eventos · cola de emisiones pendientes
                    </text>
                </g>
            </svg>
        </div>
    );
};

/* ---------------------------------------------------------------- landing */

const Landing = () => {
    const reduce = useReducedMotion();
    const heroBubbles = [
        { side: "in", text: "¿Me pasas lo del almuerzo?" },
        { side: "out", text: "Dale, ¿te lo mando por aquí?" },
        { side: "in", text: "¿No tienes que abrir el banco?" },
        { side: "out", text: "No. Se paga en el mismo chat." },
    ];

    return (
        <ProjectShell name={p.name} brand={p.brand} links={p.links}>
            <style>{css}</style>

            {/* ─────────────────────────────── HERO ─────────────────────────────── */}
            <section className="relative px-4 pt-28 pb-16 md:px-6 md:pt-32 md:pb-24">
                <span aria-hidden className="absolute inset-x-0 top-0 h-[620px] epale-halo" />

                <div className="relative grid max-w-6xl gap-12 mx-auto lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            {appIcon && (
                                <Image
                                    src={appIcon.src}
                                    alt={appIcon.caption}
                                    width={1024}
                                    height={1014}
                                    priority
                                    className="h-12 w-12 rounded-[14px] shadow-[0_8px_24px_rgba(52,90,102,0.18)]"
                                />
                            )}
                            <div>
                                <p className="epale-display text-2xl font-bold leading-none" style={{ color: DEEP }}>
                                    épale
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.24em]" style={{ color: GREY }}>
                                    {p.categoryShort} · {p.year}
                                </p>
                            </div>
                        </div>

                        <h1 className="epale-display mt-8 text-4xl font-bold leading-[1.04] md:text-6xl" style={{ color: INK }}>
                            Chatea. Paga.{" "}
                            <span className="brand-gradient-text">Sin salir de la conversación.</span>
                        </h1>

                        <p className="max-w-xl mt-6 text-base leading-relaxed md:text-lg" style={{ color: "#4A5261" }}>
                            {p.tagline}. {heroClause}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-8">
                            {[p.category, p.year, p.status].map((meta) => (
                                <span
                                    key={meta}
                                    className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium"
                                    style={{ border: `1px solid ${LINE}`, color: DEEP }}
                                >
                                    {meta}
                                </span>
                            ))}
                        </div>

                        <p className="max-w-md mt-4 text-sm leading-relaxed" style={{ color: GREY }}>
                            {p.role}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-9">
                            {p.links.play && (
                                <Magnetic>
                                    <a
                                        href={p.links.play}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full shine-sweep"
                                        style={{ backgroundImage: "var(--brand-gradient)" }}
                                    >
                                        Google Play
                                    </a>
                                </Magnetic>
                            )}
                            {p.links.web && (
                                <a
                                    href={p.links.web}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full shine-sweep"
                                    style={{ backgroundImage: "var(--brand-gradient)" }}
                                >
                                    Ver el sitio
                                </a>
                            )}
                            {p.links.github && (
                                <a
                                    href={p.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full"
                                    style={{ border: `1px solid ${DEEP}33`, color: DEEP }}
                                >
                                    Ver el código
                                </a>
                            )}
                            <Magnetic>
                                <a
                                    href="#pantallas"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full shine-sweep"
                                    style={{ backgroundImage: "var(--brand-gradient)" }}
                                >
                                    <MessagesSquare size={16} /> Ver las pantallas
                                </a>
                            </Magnetic>
                            <a
                                href="https://wa.me/584168624450"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold transition-colors hover:border-[color:var(--brand-primary)]"
                                style={{ border: `1px solid ${LINE}`, color: DEEP }}
                            >
                                <MessageCircle size={16} /> Hablemos del proyecto
                            </a>
                        </div>

                        {!p.links.play && !p.links.web && !p.links.github && (
                            <p className="mt-4 text-xs" style={{ color: GREY }}>
                                Producto privado en desarrollo: el código y la ficha de tienda todavía no son públicos.
                            </p>
                        )}
                    </div>

                    {/* teléfono en perspectiva con la conversación entrando en cascada */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div style={{ perspective: 1400 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                style={reduce ? undefined : { rotateY: -8, rotateX: 2 }}
                            >
                                <PhoneFrame className="w-[268px] sm:w-[300px]">
                                    <div className="relative flex flex-col w-full h-full overflow-hidden">
                                        <ChatBackdrop />
                                        <ChatTopBar />

                                        <div className="relative z-10 flex flex-col justify-end flex-1 gap-1.5 px-2.5 py-2">
                                            {heroBubbles.map((b, i) => (
                                                <motion.div
                                                    key={b.text}
                                                    initial={{ opacity: 0, y: 14, scale: 0.94, x: b.side === "in" ? -12 : 12 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                                    transition={{
                                                        duration: reduce ? 0 : 0.55,
                                                        delay: reduce ? 0 : 0.5 + i * 0.45,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className={b.side === "in" ? "self-start" : "self-end"}
                                                >
                                                    {b.side === "in" ? (
                                                        <div className="epale-bubble-in max-w-[78%] rounded-[14px] rounded-bl-[4px] px-2.5 py-1.5">
                                                            <p className="text-[9.5px]" style={{ color: INK }}>
                                                                {b.text}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="max-w-[78%] rounded-[14px] rounded-br-[4px] px-2.5 py-1.5 text-white"
                                                            style={{ background: TEAL }}
                                                        >
                                                            <p className="text-[9.5px]">{b.text}</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}

                                            <motion.div
                                                className="flex justify-end"
                                                initial={{ opacity: 0, y: 18, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{
                                                    duration: reduce ? 0 : 0.7,
                                                    delay: reduce ? 0 : 2.35,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                            >
                                                <PayBubble
                                                    amount={
                                                        reduce ? (
                                                            "Bs. 1.250,00"
                                                        ) : (
                                                            <Composed text="Bs. 1.250,00" speed={70} delay={2600} />
                                                        )
                                                    }
                                                />
                                            </motion.div>

                                            <motion.div
                                                className="epale-bubble-in self-start rounded-full px-2.5 py-1.5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: reduce ? 0 : 3.4, duration: 0.4 }}
                                            >
                                                <Dots />
                                            </motion.div>
                                        </div>

                                        <ChatInputBar />
                                    </div>
                                </PhoneFrame>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────────────── PROBLEMA / SOLUCIÓN como conversación ────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-3xl mx-auto">
                    <SectionHead
                        index="01 / El ida y vuelta"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Salir del chat <span className="brand-gradient-text">cuesta dinero</span>
                            </span>
                        }
                    />

                    <div className="mt-12 space-y-4">
                        <Reveal direction="right">
                            <div className="flex items-start gap-3">
                                <Avatar letter="?" color={DEEP} size={38} />
                                <div className="epale-card max-w-[86%] rounded-tl-[6px] p-5 md:p-6">
                                    <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: GREY }}>
                                        el problema
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: "#3B4351" }}>
                                        {p.problem}
                                    </p>
                                    <p className="mt-3 text-[11px]" style={{ color: GREY }}>
                                        9:38
                                    </p>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <div className="flex items-start justify-end gap-3">
                                <div
                                    className="max-w-[88%] rounded-2xl rounded-tr-[6px] p-5 text-white md:p-6"
                                    style={{
                                        backgroundImage: "var(--brand-gradient)",
                                        boxShadow: "0 18px 40px -22px rgba(2,175,170,0.9)",
                                    }}
                                >
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/75">la solución</p>
                                    <p className="mt-3 text-sm leading-relaxed md:text-base">{p.solution}</p>
                                    <p className="mt-3 flex items-center justify-end gap-1 text-[11px] text-white/75">
                                        9:41 <CheckCheck size={13} />
                                    </p>
                                </div>
                                {logoLight && (
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full h-[38px] w-[38px]"
                                        style={{ backgroundImage: "var(--brand-gradient)" }}
                                    >
                                        <Image src={logoLight.src} alt={p.name} width={800} height={300} className="w-6 h-auto" />
                                    </span>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ────────────────────────────── HIGHLIGHTS ────────────────────────────── */}
            <section className="relative px-4 py-16 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="02 / Lo que la sostiene"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Ocho piezas que hacen viable{" "}
                                <span className="brand-gradient-text">un chat con dinero dentro</span>
                            </span>
                        }
                    />

                    <Stagger className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-4">
                        {p.highlights.map((h) => {
                            const Icon = iconOf(h.icon);
                            return (
                                <StaggerItem key={h.title}>
                                    <div className="h-full p-5 transition-transform duration-500 epale-card hover:-translate-y-1">
                                        <span
                                            className="grid rounded-xl h-10 w-10 place-items-center"
                                            style={{ background: "rgba(2,175,170,0.10)", color: TEAL }}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        <h3 className="epale-display mt-4 text-[15px] font-bold" style={{ color: INK }}>
                                            {h.title}
                                        </h3>
                                        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#5A6270" }}>
                                            {h.description}
                                        </p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────────── LA BILLETERA QUE SE ABRE (3D) ───────────────────── */}
            <section className="relative px-4 py-20 overflow-hidden md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="03 / De la burbuja al dinero"
                        align="center"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                La burbuja se despega y{" "}
                                <span className="brand-gradient-text">abre la billetera</span>
                            </span>
                        }
                        lead="Dentro del mismo módulo viven el QR cifrado, las cuentas vinculadas y el comprobante del pago."
                    />

                    <div className="mt-14">
                        <WalletFold />
                    </div>

                    <Reveal className="grid gap-4 mt-10 sm:grid-cols-3">
                        {[
                            { t: "QR cifrado", d: "Payload AES-256-GCM con IV de 12 bytes y prefijo EPQ1 en base64url.", icon: QrCode },
                            { t: "Cuentas vinculadas", d: "Cuenta favorita preseleccionada y comisión bancaria desglosada.", icon: Landmark },
                            { t: "Comprobante", d: "Ticket con recorte perforado: referencia, fecha y destinatario.", icon: Receipt },
                        ].map((item) => (
                            <div key={item.t} className="p-5 epale-card">
                                <item.icon size={18} style={{ color: TEAL }} />
                                <p className="epale-display mt-3 text-[15px] font-bold" style={{ color: INK }}>
                                    {item.t}
                                </p>
                                <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "#5A6270" }}>
                                    {item.d}
                                </p>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ─────────────────────────── MÉTRICAS (franja) ─────────────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl" style={{ background: "#0A0D12" }}>
                    <span
                        aria-hidden
                        className="absolute inset-0 opacity-40"
                        style={{ background: `radial-gradient(60% 70% at 15% 0%, rgba(2,175,170,0.35), transparent 70%)` }}
                    />
                    <div className="relative p-8 md:p-14">
                        <Chip>El repositorio, en cifras</Chip>
                        <div className="grid gap-8 mt-10 text-white sm:grid-cols-2 lg:grid-cols-4">
                            {p.metrics.map((m) => (
                                <CountMetric key={m.label} value={m.value} label={m.label} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────────── SEGURIDAD ───────────────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="04 / El candado"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                El historial vive cifrado{" "}
                                <span className="brand-gradient-text">en el propio teléfono</span>
                            </span>
                        }
                        lead="La base local es la fuente de verdad de la interfaz, así que también es el sitio donde hay que poner el candado."
                    />

                    <Reveal className="mt-12">
                        <div className="relative epale-enc">
                            <CipherMesh />
                            <div className="relative p-6 md:p-10">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {[
                                        {
                                            t: "SQLCipher, clave por dispositivo",
                                            d: "9 tablas y esquema en la versión 30. La clave de 32 bytes se genera una sola vez con Random.secure() y se guarda en flutter_secure_storage: nunca está en el código ni en el servidor.",
                                            icon: ShieldCheck,
                                        },
                                        {
                                            t: "AES-256-GCM en los QR de cobro",
                                            d: "IV aleatorio de 12 bytes, base64url y prefijo EPQ1. Un lector genérico sólo ve una cadena opaca que no puede interpretar ni alterar.",
                                            icon: QrCode,
                                        },
                                        {
                                            t: "PIN, biometría y OTP",
                                            d: "Cada operación de dinero se confirma con PIN de 4 dígitos, local_auth o un código de un solo uso autocompletado con smart_auth.",
                                            icon: Fingerprint,
                                        },
                                        {
                                            t: "Mensajes de una sola vista",
                                            d: "El visor seguro bloquea capturas con screen_protector, se apoya en el sensor de proximidad y marca el contenido como visto al cerrarse.",
                                            icon: ScanLine,
                                        },
                                    ].map((item) => (
                                        <div key={item.t} className="p-5 border rounded-2xl border-white/10 bg-white/[0.04]">
                                            <item.icon size={18} style={{ color: MINT }} />
                                            <p className="epale-display mt-3 text-[15px] font-bold text-white">{item.t}</p>
                                            <p className="mt-2 text-[13px] leading-relaxed text-white/65">{item.d}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 font-mono text-[11px] text-white/40">
                                    sqflite_sqlcipher · flutter_secure_storage · encrypt · local_auth · screen_protector
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ──────────────────────────── ARQUITECTURA ──────────────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="05 / Arquitectura"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Siete módulos, <span className="brand-gradient-text">tres capas cada uno</span>
                            </span>
                        }
                        lead="Pasa el cursor por un módulo para seguir su columna: cada feature atraviesa dominio, infraestructura y presentación sin saltarse ninguna."
                    />

                    <Reveal className="p-4 mt-12 epale-card md:p-8">
                        <ArchDiagram />
                    </Reveal>

                    <Reveal delay={0.1} className="mt-8">
                        <div className="p-6 border-l-2 md:p-8" style={{ borderColor: TEAL, background: "rgba(2,175,170,0.05)" }}>
                            <p className="text-sm leading-relaxed md:text-base" style={{ color: "#3B4351" }}>
                                {p.architecture}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ───────────────────────── PANTALLAS (carrusel) ───────────────────────── */}
            <section id="pantallas" className="relative px-4 py-20 md:px-6 md:py-28">
                <span aria-hidden className="absolute inset-0 epale-halo opacity-70" />
                <div className="relative max-w-6xl mx-auto">
                    <SectionHead
                        index="06 / Las pantallas"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Seis pantallas, <span className="brand-gradient-text">una sola conversación</span>
                            </span>
                        }
                        lead="Recreadas en HTML y CSS con los colores, los textos y la disposición reales de la app. Arrastra para recorrerlas."
                    />

                    <div className="mt-12">
                        <DragRail className="px-1 py-4">
                            {SCREENS.map((screen, i) => (
                                <div key={screen.name} className="shrink-0 w-[224px] sm:w-[252px]">
                                    <PhoneFrame glow={i === 1}>{screen.mock}</PhoneFrame>
                                    <p className="epale-display mt-4 text-[13px] font-bold" style={{ color: INK }}>
                                        {screen.name}
                                    </p>
                                    <p className="mt-1 text-[12px]" style={{ color: GREY }}>
                                        {screen.note}
                                    </p>
                                </div>
                            ))}
                        </DragRail>
                        <p className="mt-4 text-[12px]" style={{ color: GREY }}>
                            ← arrastra →
                        </p>
                    </div>
                </div>
            
                    <SampleDataNote className="mt-8" />
                </section>

            {/* ─────────────────── FUNCIONALIDADES como transcripción ─────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-4xl mx-auto">
                    <SectionHead
                        index="07 / Funcionalidades"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Todo lo que ya <span className="brand-gradient-text">contesta la app</span>
                            </span>
                        }
                        lead="Dieciocho capacidades que hoy están dentro del binario, contadas como lo que son: mensajes de ida y vuelta."
                    />

                    <Stagger className="mt-12 space-y-2.5" stagger={0.05}>
                        {p.features.map((f, i) => {
                            const out = i % 2 === 1;
                            return (
                                <StaggerItem key={f} y={14}>
                                    <div className={`flex ${out ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[88%] px-4 py-3 text-[13px] leading-relaxed md:max-w-[74%] md:text-sm ${
                                                out
                                                    ? "rounded-2xl rounded-br-[6px] text-white"
                                                    : "epale-bubble-in rounded-2xl rounded-bl-[6px]"
                                            }`}
                                            style={out ? { background: TEAL } : { color: "#3B4351" }}
                                        >
                                            {f}
                                            {out && (
                                                <span className="ml-2 inline-flex translate-y-[2px] text-white/70">
                                                    <CheckCheck size={12} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>
                </div>
            </section>

            {/* ───────────────────────────── RETOS (tickets) ───────────────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <SectionHead
                        index="08 / Lo que costó"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Siete problemas <span className="brand-gradient-text">y su recibo</span>
                            </span>
                        }
                    />

                    <div className="grid gap-6 mt-12 md:grid-cols-2">
                        {p.challenges.map((c, i) => (
                            <Reveal key={i} delay={(i % 2) * 0.08}>
                                <TiltCard intensity={4}>
                                    <div className="h-full epale-card" style={{ ["--epale-notch" as string]: PAPER }}>
                                        <div className="p-5 md:p-6">
                                            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "#F97066" }}>
                                                reto {String(i + 1).padStart(2, "0")}
                                            </p>
                                            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#3B4351" }}>
                                                {c.problem}
                                            </p>
                                        </div>
                                        <div className="epale-perf" />
                                        <div className="p-5 md:p-6" style={{ background: "rgba(2,175,170,0.05)" }}>
                                            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: TEAL }}>
                                                cómo se resolvió
                                            </p>
                                            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#3B4351" }}>
                                                {c.solution}
                                            </p>
                                        </div>
                                    </div>
                                </TiltCard>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────── STACK ─────────────────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <SectionHead
                        index="09 / Stack"
                        title={
                            <span className="epale-display" style={{ color: INK }}>
                                Con qué está <span className="brand-gradient-text">construida</span>
                            </span>
                        }
                    />

                    <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-4">
                        {p.stack.map((group, i) => (
                            <Reveal key={group.group} delay={i * 0.05}>
                                <div className="h-full p-5 epale-card">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: TEAL }}>
                                        {group.group}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full px-2.5 py-1 text-[11px]"
                                                style={{ background: "#F4F6F7", color: "#4A5261" }}
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

            {/* ────────────────────────── RESUMEN + PIEZAS ────────────────────────── */}
            <section className="relative px-4 py-20 md:px-6 md:py-28">
                <div className="max-w-5xl mx-auto">
                    <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
                        <Stagger className="space-y-5">
                            {p.summary.map((paragraph, i) => (
                                <StaggerItem key={i}>
                                    <p
                                        className={`leading-relaxed ${i === 0 ? "text-lg md:text-xl" : "text-sm md:text-base"}`}
                                        style={{ color: i === 0 ? INK : "#5A6270" }}
                                    >
                                        {paragraph}
                                    </p>
                                </StaggerItem>
                            ))}
                        </Stagger>

                        {coin && (
                            <div className="flex justify-center md:justify-end">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={coin.src} alt={coin.caption} className="h-24 anim-float w-auto md:h-36" />
                            </div>
                        )}
                    </div>

                    <div className="mt-16">
                        <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: GREY }}>
                            Piezas de marca
                        </p>
                        <p className="max-w-3xl mt-3 text-sm leading-relaxed" style={{ color: "#5A6270" }}>
                            {p.brand.mood}
                        </p>

                        {videos.length > 0 && (
                            <div className="grid gap-4 mt-8 md:grid-cols-2">
                                {videos.map((v) => (
                                    <AutoVideo key={v.src} src={v.src} />
                                ))}
                            </div>
                        )}

                        <div className="grid gap-4 mt-8 sm:grid-cols-3 lg:grid-cols-4">
                            {p.media.map((m) => {
                                const file = fileOf(m.src);
                                const dark = DARK_TILES.includes(file);
                                const isSvg = m.src.endsWith(".svg");
                                const isGif = m.src.endsWith(".gif");
                                const [w, h] = dimsOf(m.src);

                                return (
                                    <figure key={m.src} className="overflow-hidden epale-card">
                                        {m.kind === "background" && !isSvg ? (
                                            <ShotCard src={m.src} alt={m.caption} className="!rounded-none !border-0 h-[150px]" />
                                        ) : (
                                            <div
                                                className="grid h-[150px] place-items-center p-4"
                                                style={{ background: dark ? "#0A0D12" : "#F4F6F7" }}
                                            >
                                                {isSvg || isGif ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={m.src} alt={m.caption} className="max-h-[110px] w-auto" />
                                                ) : (
                                                    <Image
                                                        src={m.src}
                                                        alt={m.caption}
                                                        width={w}
                                                        height={h}
                                                        className="max-h-[110px] w-auto object-contain"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <figcaption className="p-3 text-[11px] leading-relaxed" style={{ color: GREY }}>
                                            {m.caption}
                                        </figcaption>
                                    </figure>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <div className="py-5 text-[11px] uppercase tracking-[0.22em]" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, color: GREY }}>
                <Marquee
                    items={[
                        "Flutter",
                        "Riverpod",
                        "Socket.IO",
                        "SQLCipher",
                        "AES-256-GCM",
                        "KYC + prueba de vida",
                        "Tasa BCV",
                        "es · en · pt",
                        "Patrol E2E",
                    ]}
                    speed={38}
                    separator="•"
                />
            </div>

            {/* ─────────────────────────────── CIERRE ─────────────────────────────── */}
            <div className="relative pb-32 overflow-hidden text-white">
                {splash && <Image src={splash.src} alt="" fill sizes="100vw" className="object-cover" />}
                <span aria-hidden className="absolute inset-0 bg-[#06181C]/60" />

                <div className="relative px-4 pt-24 md:px-6 md:pt-32">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-start gap-3">
                            <Avatar letter="é" color="rgba(255,255,255,0.18)" size={40} />
                            <div className="max-w-[86%] rounded-2xl rounded-tl-[6px] px-5 py-4" style={{ background: TEAL }}>
                                <p className="epale-display text-xl leading-snug md:text-3xl">
                                    <Composed text={p.tagline} speed={34} />
                                </p>
                                <motion.p
                                    className="flex items-center justify-end gap-1 mt-3 text-xs text-white/80"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: reduce ? 0 : 2.4, duration: 0.5 }}
                                >
                                    entregado <CheckCheck size={15} />
                                </motion.p>
                            </div>
                        </div>

                        <RevealWords
                            text="Una conversación que, al bajar, se convierte en dinero."
                            className="block mt-10 text-sm text-white/70"
                        />
                    </div>
                </div>

                <ProjectOutro
                    name={p.name}
                    links={p.links}
                    nextSlug={nxt.slug}
                    nextName={nxt.name}
                    note="Mensajería en tiempo real, base local cifrada, KYC con prueba de vida y pagos dentro del chat: si tu producto necesita mover dinero donde la gente ya está hablando, ése es el terreno que conozco."
                />

                <div className="relative flex items-center justify-center gap-2 text-xs text-white/55">
                    <MapPin size={13} /> Hecho para Venezuela · {p.statusShort}
                </div>
            </div>
        </ProjectShell>
    );
};

export default Landing;
