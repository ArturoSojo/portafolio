"use client"

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Globe, Play } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import type { ProjectEntry } from "@/data-projects";

const statusTone = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("play")) return "bg-emerald-400/15 text-emerald-300 border-emerald-400/30";
    if (s.includes("produc")) return "bg-sky-400/15 text-sky-300 border-sky-400/30";
    if (s.includes("mvp")) return "bg-amber-400/15 text-amber-300 border-amber-400/30";
    return "bg-white/10 text-white/70 border-white/20";
};

const ProjectCard = ({ project, index }: { project: ProjectEntry; index: number }) => {
    const reduce = useReducedMotion();
    const cover = project.media.find((m) => m.kind !== "video");

    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 210, damping: 22 });
    const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 210, damping: 22 });

    const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        mx.set((event.clientX - rect.left) / rect.width);
        my.set((event.clientY - rect.top) / rect.height);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={`/portfolio/${project.slug}`}
                onMouseMove={onMove}
                onMouseLeave={() => {
                    mx.set(0.5);
                    my.set(0.5);
                }}
                className="block h-full group"
            >
                <motion.article
                    style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative flex flex-col h-full overflow-hidden transition-shadow duration-500 border rounded-2xl border-white/10 bg-white/[0.03] hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]"
                >
                    {/* borde que se enciende con el color del proyecto */}
                    <span
                        aria-hidden
                        className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none rounded-2xl group-hover:opacity-100"
                        style={{ boxShadow: `inset 0 0 0 1px ${project.brand.primary}`, }}
                    />

                    <div className="relative overflow-hidden aspect-[16/10]">
                        <span aria-hidden className="absolute inset-0" style={{ backgroundImage: project.brand.gradient }} />
                        {cover ? (
                            <Image
                                src={cover.src}
                                alt={project.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out opacity-90 group-hover:scale-110"
                            />
                        ) : (
                            <span aria-hidden className="absolute inset-0 grid-lines opacity-40" />
                        )}
                        <span
                            aria-hidden
                            className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                        />

                        <span
                            className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md ${statusTone(
                                project.statusShort
                            )}`}
                        >
                            {project.links.play ? <Play size={10} /> : project.links.web ? <Globe size={10} /> : <Github size={10} />}
                            {project.statusShort}
                        </span>

                        <span className="absolute grid transition-all duration-500 rounded-full opacity-0 bottom-3 right-3 h-9 w-9 place-items-center bg-white/15 backdrop-blur-md group-hover:opacity-100 group-hover:-translate-y-1">
                            <ArrowUpRight size={16} />
                        </span>
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                            <span style={{ color: project.brand.primary }}>{project.categoryShort}</span>
                            <span className="opacity-40">·</span>
                            <span>{project.year}</span>
                        </div>

                        <h3 className="mt-2 text-xl font-bold leading-snug">{project.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60 line-clamp-3">{project.tagline}</p>

                        <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
                            {project.stack[0]?.items.slice(0, 3).map((item) => (
                                <span
                                    key={item}
                                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/55"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
};

export default ProjectCard;
