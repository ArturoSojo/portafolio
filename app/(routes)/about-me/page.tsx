"use client"

import { Avatar } from "@/components/avatar";
import ContainerPage from "@/components/container-page";
import CounterServices from "@/components/counter-services";
import TimeLine from "@/components/time-line";
import TransitionPage from "@/components/transition-page";

const AboutMePage = () => {
    return (
        <>
            <TransitionPage />
            <ContainerPage>
                <Avatar />
                <h1 className="text-2xl leading-tight text-center md:text-left md:text-5xl md:mt-10">
                    Toda mi{' '}
                    <span className="font-bold text-secondary">
                        trayectoria profesional
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto mt-4 text-center md:mx-0 md:text-left text-white/70">
                    Cuatro años desarrollando software: del frontend web al desarrollo móvil multiplataforma.
                    Hoy construyo apps en Flutter y plataformas en React y Next.js, con Firebase detrás.
                </p>

                <CounterServices />

                <TimeLine />

            </ContainerPage>
        </>
    );
}

export default AboutMePage;