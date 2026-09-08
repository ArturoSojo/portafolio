"use client"

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

const offsets: Record<Direction, { x: number; y: number; scale: number }> = {
    up: { x: 0, y: 46, scale: 1 },
    down: { x: 0, y: -46, scale: 1 },
    left: { x: 46, y: 0, scale: 1 },
    right: { x: -46, y: 0, scale: 1 },
    scale: { x: 0, y: 18, scale: 0.92 },
    none: { x: 0, y: 0, scale: 1 },
};

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: Direction;
    delay?: number;
    duration?: number;
    once?: boolean;
    amount?: number;
}

/** Aparición al entrar en viewport. Respeta prefers-reduced-motion. */
export const Reveal = ({
    children,
    className,
    direction = "up",
    delay = 0,
    duration = 0.75,
    once = true,
    amount = 0.25,
}: RevealProps) => {
    const reduce = useReducedMotion();
    const from = reduce ? offsets.none : offsets[direction];

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: from.x, y: from.y, scale: from.scale }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once, amount }}
            transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

interface StaggerProps {
    children: React.ReactNode;
    className?: string;
    stagger?: number;
    delay?: number;
    amount?: number;
}

/** Contenedor que escalona a sus hijos directos envueltos en <StaggerItem>. */
export const Stagger = ({ children, className, stagger = 0.09, delay = 0, amount = 0.2 }: StaggerProps) => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : delay } },
            }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({
    children,
    className,
    y = 30,
}: {
    children: React.ReactNode;
    className?: string;
    y?: number;
}) => (
    <motion.div
        className={className}
        variants={{
            hidden: { opacity: 0, y },
            visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } },
        }}
    >
        {children}
    </motion.div>
);

/** Texto que se revela palabra a palabra. */
export const RevealWords = ({
    text,
    className,
    wordClassName,
    delay = 0,
}: {
    text: string;
    className?: string;
    wordClassName?: string;
    delay?: number;
}) => {
    const reduce = useReducedMotion();
    const words = text.split(" ");

    return (
        <motion.span
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.045, delayChildren: delay } } }}
        >
            {words.map((word, i) => (
                <motion.span
                    key={`${word}-${i}`}
                    className={`inline-block ${wordClassName ?? ""}`}
                    variants={{
                        hidden: { opacity: 0, y: reduce ? 0 : "0.55em", filter: "blur(6px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    }}
                >
                    {word}
                    {i < words.length - 1 ? " " : ""}
                </motion.span>
            ))}
        </motion.span>
    );
};

/** Devuelve true una vez que el nodo entra en pantalla. Útil para arrancar animaciones caras. */
export const useEnteredView = <T extends HTMLElement>(amount = 0.3) => {
    const ref = useRef<T>(null);
    const inView = useInView(ref, { once: true, amount });
    return { ref, inView };
};
