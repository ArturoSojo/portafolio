"use client"

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { projects } from "@/data-projects";
import ProjectCard from "@/components/projects/project-card";
import TransitionPage from "@/components/transition-page";

const PortfolioPage = () => {
    const categories = useMemo(() => {
        const set = new Set(projects.map((p) => p.categoryShort));
        return ["Todos", ...Array.from(set)];
    }, []);

    const [active, setActive] = useState("Todos");

    const shown = active === "Todos" ? projects : projects.filter((p) => p.categoryShort === active);

    return (
        <>
            <TransitionPage />

            {/* decoración fija, al estilo del resto del sitio */}
            <div aria-hidden className="fixed bottom-0 right-0 z-0 hidden pointer-events-none md:block opacity-70">
                <Image src="/circles.png" width={300} height={300} alt="" />
            </div>
            <div aria-hidden className="fixed bottom-0 left-0 z-0 hidden pointer-events-none lg:block opacity-80">
                <Image src="/avatar-works.png" width={280} height={280} alt="" />
            </div>

            <div className="relative z-10 w-full max-w-6xl px-4 pb-40 mx-auto mt-32 md:px-6 md:mt-40">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-2xl leading-tight text-center md:text-4xl">
                        Mis últimos <span className="font-bold text-secondary">trabajos realizados</span>
                    </h1>
                    <p className="max-w-2xl mx-auto mt-4 text-sm text-center md:text-base text-white/60">
                        {projects.length} proyectos entre aplicaciones móviles, plataformas web y paneles de
                        administración. Entra en cualquiera: cada uno tiene su propia landing, con los colores y el
                        carácter del producto.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-2 mt-8 mb-10">
                    {categories.map((category) => {
                        const isActive = category === active;
                        return (
                            <button
                                key={category}
                                onClick={() => setActive(category)}
                                className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-300 ${
                                    isActive ? "text-darkBg" : "text-white/60 hover:text-white"
                                }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="filter-pill"
                                        className="absolute inset-0 rounded-full bg-secondary"
                                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                    />
                                )}
                                <span className="relative z-10">{category}</span>
                            </button>
                        );
                    })}
                </div>

                <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {shown.map((project, index) => (
                            <motion.div key={project.slug} layout exit={{ opacity: 0, scale: 0.94 }}>
                                <ProjectCard project={project} index={index} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
};

export default PortfolioPage;
