import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import "./globals.css";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Navbar from "@/components/navbar";
import Header from "@/components/header";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arturo Sojo · Desarrollador Móvil y Web",
  description:
    "Portafolio de Arturo Sojo: 4 años construyendo aplicaciones móviles con Flutter y plataformas web con React y Next.js. Cada proyecto con su propia landing.",
  keywords: [
    "Arturo Sojo",
    "Flutter",
    "Next.js",
    "React",
    "Firebase",
    "desarrollador móvil",
    "desarrollador web",
    "Venezuela",
  ],
  authors: [{ name: "Arturo Sojo" }],
  openGraph: {
    title: "Arturo Sojo · Desarrollador Móvil y Web",
    description:
      "4 años construyendo apps en Flutter y plataformas en React y Next.js. Mira los proyectos, cada uno con su propia landing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={urbanist.className}>
        <Navbar />
        <Header />
        {children}
      </body>
    </html>
  );
}
