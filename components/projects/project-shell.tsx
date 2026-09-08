"use client"

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github, Globe, Play, Youtube } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { CSSProperties } from "react";

export interface ProjectBrand {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
    gradient: string;
    /** Degradado apto para rellenar texto: ninguna parada se confunde con el fondo. */
    textGradient: string;
    /** Primario ajustado hasta ser legible sobre el fondo. Para chips y textos pequeños. */
    ink: string;
    /** Color de rótulo que se lee sobre TODAS las paradas del degradado. */
    onBrand: string;
}

export interface ProjectLinks {
    github?: string;
    web?: string;
    play?: string;
    demo?: string;
}

interface ProjectShellProps {
    name: string;
    brand: ProjectBrand;
    links?: ProjectLinks;
    children: React.ReactNode;
    className?: string;
}

type BrandStyle = CSSProperties & Record<`--brand-${string}`, string>;

export const brandVars = (brand: ProjectBrand): BrandStyle => ({
    "--brand-primary": brand.primary,
    "--brand-secondary": brand.secondary,
    "--brand-accent": brand.accent,
    "--brand-bg": brand.bg,
    "--brand-surface": brand.surface,
    "--brand-text": brand.text,
    "--brand-gradient": brand.gradient,
    "--brand-text-gradient": brand.textGradient ?? brand.gradient,
    "--brand-ink": brand.ink ?? brand.primary,
    "--brand-on-brand": brand.onBrand ?? brand.bg,
});

/**
 * Envoltura común de toda landing de proyecto: expone la paleta de la marca como
 * variables CSS, pinta la barra de progreso de lectura y la botonera de enlaces.
 * El interior de cada landing es libre — ahí vive el diseño propio del proyecto.
 */
const ProjectShell = ({ name, brand, links, children, className }: ProjectShellProps) => {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

    return (
        <main className={`brand-scope relative overflow-x-clip ${className ?? ""}`} style={brandVars(brand)}>
            <motion.div
                aria-hidden
                className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left"
                style={{ scaleX: progress, background: brand.gradient }}
            />

            <ProjectTopBar name={name} links={links} />

            {children}
        </main>
    );
};

/** Varios proyectos no tienen web publicada: su `links.web` es un vídeo de demostración. */
export const isVideoLink = (url?: string) =>
    !!url && /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url);

export const ProjectTopBar = ({ name, links }: { name: string; links?: ProjectLinks }) => (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[color-mix(in_srgb,var(--brand-bg)_78%,transparent)] border-b border-white/10">
        <div className="flex items-center justify-between max-w-6xl gap-3 px-4 mx-auto h-14 md:px-6">
            <Link
                href="/portfolio"
                aria-label="Volver a todos los proyectos"
                className="inline-flex items-center gap-2 text-sm transition-colors opacity-90 hover:opacity-100 shrink-0"
            >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Proyectos</span>
            </Link>

            <span className="text-xs font-semibold tracking-[0.28em] uppercase truncate opacity-80">{name}</span>

            <div className="flex items-center gap-2 shrink-0">
                {links?.play && (
                    <TopLink href={links.play} label="Google Play" tone="solid">
                        <Play size={14} />
                    </TopLink>
                )}
                {links?.web && (
                    <TopLink
                        href={links.web}
                        label={isVideoLink(links.web) ? "Vídeo" : "Sitio"}
                        tone="ghost"
                    >
                        {isVideoLink(links.web) ? <Youtube size={14} /> : <Globe size={14} />}
                    </TopLink>
                )}
                {links?.demo && !links.web && (
                    <TopLink href={links.demo} label="Demo" tone="ghost">
                        <ArrowUpRight size={14} />
                    </TopLink>
                )}
                {links?.github && (
                    <TopLink href={links.github} label="Código" tone="ghost">
                        <Github size={14} />
                    </TopLink>
                )}
            </div>
        </div>
    </div>
);

const TopLink = ({
    href,
    label,
    tone,
    children,
}: {
    href: string;
    label: string;
    tone: "solid" | "ghost";
    children: React.ReactNode;
}) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
            tone === "solid"
                ? "text-[color:var(--brand-on-brand)] hover:brightness-110"
                : "border border-white/20 hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
        }`}
        style={tone === "solid" ? { backgroundImage: "var(--brand-text-gradient)" } : undefined}
    >
        {children}
        <span className="hidden sm:inline">{label}</span>
    </a>
);

export default ProjectShell;
