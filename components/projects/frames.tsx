"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Carcasa de teléfono. El contenido puede ser una captura real o una recreación en CSS. */
export const PhoneFrame = ({
    children,
    className,
    glow = true,
    notch = true,
}: {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
    notch?: boolean;
}) => (
    <div className={`relative ${className ?? ""}`}>
        {glow && (
            <div
                aria-hidden
                className="absolute -inset-8 rounded-[3rem] opacity-40 blur-3xl"
                style={{ backgroundImage: "var(--brand-gradient)" }}
            />
        )}
        <div className="relative rounded-[2.4rem] border border-white/15 bg-[#0a0a0f] p-[10px] shadow-[0_36px_90px_-24px_rgba(0,0,0,0.85)]">
            <div className="relative overflow-hidden rounded-[1.9rem] bg-black aspect-[9/19.5]">
                {notch && (
                    <div className="absolute z-20 -translate-x-1/2 top-2 left-1/2 h-[22px] w-[92px] rounded-full bg-black/90 border border-white/10" />
                )}
                {children}
            </div>
        </div>
    </div>
);

/** Ventana de navegador para proyectos web. */
export const BrowserFrame = ({
    url,
    children,
    className,
    dark = true,
}: {
    url?: string;
    children: React.ReactNode;
    className?: string;
    dark?: boolean;
}) => (
    <div
        className={`overflow-hidden border rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ${
            dark ? "border-white/12 bg-[#0b0d14]" : "border-black/10 bg-white"
        } ${className ?? ""}`}
    >
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${dark ? "border-white/10" : "border-black/10"}`}>
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            {url && (
                <span
                    className={`ml-3 truncate rounded-md px-3 py-1 text-[11px] ${
                        dark ? "bg-white/5 text-white/55" : "bg-black/5 text-black/50"
                    }`}
                >
                    {url}
                </span>
            )}
        </div>
        <div className="relative">{children}</div>
    </div>
);

/** Imagen que se acerca suavemente al pasar el cursor, con borde de marca. */
export const ShotCard = ({
    src,
    alt,
    caption,
    className,
    priority = false,
}: {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
    priority?: boolean;
}) => (
    <figure className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 ${className ?? ""}`}>
        <Image
            src={src}
            alt={alt}
            width={720}
            height={1560}
            priority={priority}
            className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100"
            style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--brand-primary) 32%, transparent), transparent 55%)" }}
        />
        {caption && (
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-full px-4 py-3 text-xs text-white transition-transform duration-500 bg-black/70 backdrop-blur-sm group-hover:translate-y-0">
                {caption}
            </figcaption>
        )}
    </figure>
);

/** Vídeo que sólo se reproduce cuando está en pantalla. */
export const AutoVideo = ({
    src,
    poster,
    className,
    rounded = "rounded-2xl",
}: {
    src: string;
    poster?: string;
    className?: string;
    rounded?: string;
}) => {
    const ref = useRef<HTMLVideoElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    node.play().catch(() => undefined);
                } else {
                    node.pause();
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden={!visible}
            className={`w-full h-auto border border-white/10 ${rounded} ${className ?? ""}`}
        />
    );
};

/** Carrusel horizontal con arrastre, para galerías de capturas. */
export const DragRail = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [bound, setBound] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        const measure = () => {
            const node = trackRef.current;
            if (!node) return;
            setBound(Math.max(0, node.scrollWidth - node.offsetWidth));
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [children]);

    if (reduce) {
        return (
            <div className={`flex gap-5 overflow-x-auto scrollbar-none ${className ?? ""}`}>{children}</div>
        );
    }

    return (
        <div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <motion.div
                ref={trackRef}
                drag="x"
                dragConstraints={{ left: -bound, right: 0 }}
                dragElastic={0.08}
                className={`flex gap-5 w-max ${className ?? ""}`}
            >
                {children}
            </motion.div>
        </div>
    );
};
