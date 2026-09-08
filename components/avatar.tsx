
"use client"

import Image from "next/image";

import { MotionTransition } from "./transition-component";

export function Avatar() {
    return (
        <MotionTransition position="bottom" className="bottom-0 right-0 hidden pointer-events-none md:inline-block md:absolute -z-10">
            <Image src="/avatar-1.png" width="400" height="400" className="w-full h-full " alt="Particles " />
        </MotionTransition>
    )
}
