"use client"

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github, Globe, MessageCircle, Play } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ProjectLinks } from "./project-shell";

/** Etiqueta pequeña con el color de la marca. */
export const Chip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${className ?? ""}`}
        style={{
            borderColor: "color-mix(in srgb, var(--brand-ink) 42%, transparent)",
            color: "var(--brand-ink)",
            background: "color-mix(in srgb, var(--brand-ink) 12%, transparent)",
        }}
    >
        {children}
    </span>
);

/** Encabezado de sección: número, título y bajada. */
export const SectionHead = ({
    index,
    title,
    lead,
    align = "left",
}: {
    index?: string;
    title: React.ReactNode;
    lead?: string;
    align?: "left" | "center";
}) => (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
        {index && (
            <span className="block mb-3 text-xs font-mono tracking-[0.4em] uppercase opacity-45">{index}</span>
        )}
        <h2 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
        {lead && <p className="mt-4 text-base leading-relaxed opacity-70 md:text-lg">{lead}</p>}
    </div>
);

/** Contador que arranca al entrar en pantalla. Acepta valores tipo "12", "+40", "3 apps". */
export const CountMetric = ({ value, label }: { value: string; label: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(0);
    const reduce = useReducedMotion();
    const match = value.match(/\d+/);
    const target = match ? parseInt(match[0], 10) : 0;

    useEffect(() => {
        const node = ref.current;
        if (!node || !target) return;
        if (reduce) {
            setShown(target);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const duration = 1200;
                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / duration);
                    setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.5 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [target, reduce]);

    return (
        <div ref={ref}>
            <p className="text-3xl font-extrabold md:text-5xl brand-gradient-text">
                {target ? value.replace(/\d+/, String(shown)) : value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-55">{label}</p>
        </div>
    );
};

/** Tarjeta con inclinación 3D siguiendo el cursor. */
export const TiltCard = ({
    children,
    className,
    intensity = 10,
}: {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}) => {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 220, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 220, damping: 20 });

    const onMove = (event: MouseEvent<HTMLDivElement>) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            onMouseMove={onMove}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/** Botón/elemento que se acerca al cursor. */
export const Magnetic = ({
    children,
    className,
    strength = 0.28,
}: {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}) => {
    const reduce = useReducedMotion();
    const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
    const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

    return (
        <motion.div
            style={reduce ? undefined : { x, y }}
            className={className}
            onMouseMove={(event) => {
                if (reduce) return;
                const rect = event.currentTarget.getBoundingClientRect();
                x.set((event.clientX - rect.left - rect.width / 2) * strength);
                y.set((event.clientY - rect.top - rect.height / 2) * strength);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            {children}
        </motion.div>
    );
};

/** Cinta infinita de texto. */
export const Marquee = ({
    items,
    speed = 28,
    reverse = false,
    className,
    separator = "◆",
}: {
    items: string[];
    speed?: number;
    reverse?: boolean;
    className?: string;
    separator?: string;
}) => {
    const line = [...items, ...items];
    return (
        <div className={`relative flex overflow-hidden select-none ${className ?? ""}`}>
            <div
                className="flex shrink-0 gap-8 pr-8"
                style={{
                    animation: `brand-marquee ${speed}s linear infinite`,
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                {line.map((item, i) => (
                    <span key={`${item}-${i}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                        {item}
                        <span aria-hidden style={{ color: "var(--brand-primary)" }}>
                            {separator}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

/** Botón principal con el degradado de la marca. */
export const BrandButton = ({
    href,
    children,
    variant = "solid",
    className,
}: {
    href: string;
    children: React.ReactNode;
    variant?: "solid" | "outline";
    className?: string;
}) => {
    const external = href.startsWith("http");
    const classes =
        variant === "solid"
            ? "text-[color:var(--brand-on-brand)] shadow-lg hover:brightness-110"
            : "border border-white/25 hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]";

    const content = (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 shine-sweep ${classes} ${className ?? ""}`}
            style={variant === "solid" ? { backgroundImage: "var(--brand-text-gradient)" } : undefined}
        >
            {children}
        </span>
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noreferrer">
                {content}
            </a>
        );
    }
    return <Link href={href}>{content}</Link>;
};

/** Cierre común de cada landing: enlaces del proyecto, contacto y vuelta al índice. */
export const ProjectOutro = ({
    name,
    links,
    nextSlug,
    nextName,
    note,
}: {
    name: string;
    links?: ProjectLinks;
    nextSlug?: string;
    nextName?: string;
    note?: string;
}) => (
    <section className="relative px-4 py-24 md:px-6 md:py-32">
        <div className="max-w-5xl mx-auto">
            <div className="relative p-8 overflow-hidden border rounded-3xl border-white/10 md:p-14">
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-20 anim-pan"
                    style={{ backgroundImage: "var(--brand-gradient)" }}
                />
                <div className="relative">
                    <p className="text-xs uppercase tracking-[0.32em] opacity-55">{name}</p>
                    <h2 className="max-w-xl mt-4 text-3xl font-bold leading-tight md:text-5xl">
                        ¿Quieres algo así <span className="brand-gradient-text">para tu producto?</span>
                    </h2>
                    {note && <p className="max-w-xl mt-4 text-sm leading-relaxed opacity-70">{note}</p>}

                    <div className="flex flex-wrap gap-3 mt-8">
                        {links?.play && (
                            <BrandButton href={links.play}>
                                <Play size={16} /> Descargar en Google Play
                            </BrandButton>
                        )}
                        {links?.web && (
                            <BrandButton href={links.web} variant={links.play ? "outline" : "solid"}>
                                <Globe size={16} /> Ver el sitio
                            </BrandButton>
                        )}
                        {links?.demo && !links.web && (
                            <BrandButton href={links.demo} variant={links.play ? "outline" : "solid"}>
                                <ArrowUpRight size={16} /> Ver demo
                            </BrandButton>
                        )}
                        {links?.github && (
                            <BrandButton href={links.github} variant="outline">
                                <Github size={16} /> Código
                            </BrandButton>
                        )}
                        <BrandButton href="https://wa.me/584168624450" variant="outline">
                            <MessageCircle size={16} /> Hablemos
                        </BrandButton>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-12 border-t border-white/10">
                        <Link href="/portfolio" className="text-sm transition-opacity opacity-60 hover:opacity-100">
                            ← Todos los proyectos
                        </Link>
                        {nextSlug && nextName && (
                            <Link
                                href={`/portfolio/${nextSlug}`}
                                className="inline-flex items-center gap-2 text-sm font-semibold transition-transform group hover:translate-x-1"
                            >
                                <span className="opacity-60">Siguiente</span>
                                <span className="brand-gradient-text">{nextName}</span>
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
);
