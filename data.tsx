import { BookText, CodeSquare, HomeIcon, UserRound, Linkedin, Crop, Pencil, Computer, Facebook, Instagram, Youtube, Github, Smartphone, Flame, ShieldCheck} from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok-icon";

export const socialNetworks = [
    {
        id: 0,
        logo: <TikTokIcon size={26} />,
        src: "https://www.tiktok.com/@arturo.sojo.vivas",
    },
    {
        id: 1,
        logo: <Youtube size={30} strokeWidth={1} />,
        src: "https://www.youtube.com/@arturosojovivas1204",
    },

    {
        id: 2,
        logo: <Linkedin size={30} strokeWidth={1} />,
        src: "https://www.linkedin.com/in/arturo-sojo-57b913364",
    },
    {
        id: 3,
        logo: <Github size={30} strokeWidth={1} />,
        src: "https://github.com/ArturoSojo",
    },
    {
        id: 4,
        logo: <Facebook size={30} strokeWidth={1} />,
        src: "https://www.facebook.com/arturo.sojovivas",
    },
    {
        id: 5,
        logo: <Instagram size={30} strokeWidth={1} />,
        src: "https://www.instagram.com/arturosojovivas/",
    },

];


export const itemsNavbar = [
    {
        id: 1,
        title: "Home",
        icon: <HomeIcon size={25} color="#fff" strokeWidth={1} />,
        link: "/",
    },
    {
        id: 2,
        title: "User",
        icon: <UserRound size={25} color="#fff" strokeWidth={1} />,
        link: "/about-me",
    },
    {
        id: 3,
        title: "Book",
        icon: <BookText size={25} color="#fff" strokeWidth={1} />,
        link: "/services",
    },
    {
        id: 4,
        title: "Target",
        icon: <CodeSquare size={25} color="#fff" strokeWidth={1} />,
        link: "/portfolio",
    },

];

export const dataAboutPage = [
    {
        id: 1,
        title: "Desarrollador Móvil (Android & iOS)",
        subtitle: "Soluciones Tecnológicas Epale",
        description: "Diseño y desarrollo aplicaciones multiplataforma con Flutter y Dart: mensajería, pagos y verificación de identidad. Llevo el ciclo completo, desde la interfaz hasta el despliegue en las tiendas.",
        date: "2025 - Hoy",
    },
    {
        id: 2,
        title: "Analista de Sistemas",
        subtitle: "Pegaso Consulting C.A.",
        description: "Analicé requerimientos complejos para diseñar soluciones escalables, traduje necesidades de negocio a especificaciones técnicas y depuré sistemas en producción.",
        date: "2025",
    },
    {
        id: 3,
        title: "Desarrollador Frontend",
        subtitle: "Servicios Paguetodo C.A.",
        description: "Lideré el frontend de aplicaciones web y del punto de venta móvil, integrando servicios de pago y APIs de terceros con metodologías ágiles.",
        date: "2023 - 2025",
    },
    {
        id: 4,
        title: "Ingeniería Informática",
        subtitle: "U.P.T. 'Argelia Laya'",
        description: "Formación en desarrollo de software y arquitectura de sistemas en la Universidad Politécnica Territorial 'Argelia Laya'.",
        date: "2021 - 2023",
    },
    {
        id: 5,
        title: "Administración de Empresas",
        subtitle: "U.P.T. 'Argelia Laya'",
        description: "Formación en gestión de proyectos y optimización de recursos, la base con la que entiendo el negocio detrás de cada producto.",
        date: "2019 - 2021",
    },

]

export const dataCounter = [
    {
        id: 0,
        endCounter: 4,
        text: "Años de experiencia",
        lineRight: true,
        lineRightMobile: true,
    },
    {
        id: 1,
        endCounter: 8,
        text: "Lenguajes conocidos",
        lineRight: true,
        lineRightMobile: false,
    },
    {
        id: 2,
        endCounter: 24,
        text: "Proyectos finalizados",
        lineRight: true,
        lineRightMobile: true,
    },
    {
        id: 3,
        endCounter: 30,
        text: "Cursos realizados",
        lineRight: false,
        lineRightMobile: false,
    },
];

export const serviceData = [
    {
        icon: <Smartphone />,
        title: "Desarrollo móvil",
        description: "Apps nativas para Android e iOS con Flutter y Dart, publicadas en las tiendas y optimizadas para rendimiento real."
    },
    {
        icon: <Computer />,
        title: "Desarrollo web",
        description: "Aplicaciones web a medida con React, Next.js y TypeScript, desde la landing pública hasta el panel de administración.",
    },
    {
        icon: <Crop />,
        title: "Backend y Firebase",
        description: "Cloud Functions, Firestore, reglas de seguridad y autenticación: la trastienda que hace que el producto funcione.",
    },
    {
        icon: <Flame />,
        title: "Integración de pagos",
        description: "Pasarelas, Pago Móvil, verificación bancaria y compras dentro de la app conectadas de extremo a extremo.",
    },
    {
        icon: <Pencil />,
        title: "Diseño de interfaces",
        description: "Interfaces intuitivas y responsivas que reflejan la identidad de marca y se sienten bien en la mano.",
    },
    {
        icon: <ShieldCheck />,
        title: "Seguridad y KYC",
        description: "Verificación de identidad, control de acceso por roles y reglas que cierran la puerta desde el servidor.",
    },

];

export const dataTestimonials = [
    {
        id: 1,
        name: "George Snow",
        description:
            "¡Increíble plataforma! Los testimonios aquí son genuinos y me han ayudado a tomar decisiones informadas. ¡Altamente recomendado!",
        imageUrl: "/profile1.png",
    },
    {
        id: 2,
        name: "Juan Pérez",
        description:
            "Me encanta la variedad de testimonios disponibles en esta página. Es inspirador ver cómo otras personas han superado desafíos similares a los míos. ¡Gracias por esta invaluable fuente de motivación!",
        imageUrl: "/profile2.png",
    },
    {
        id: 3,
        name: "María García",
        description:
            "Excelente recurso para obtener opiniones auténticas sobre diferentes productos y servicios. Me ha ayudado mucho en mis compras en línea. ¡Bravo por este sitio!",
        imageUrl: "/profile3.png",
    },
    {
        id: 4,
        name: "Laura Snow",
        description:
            "¡Qué descubrimiento tan fantástico! Los testimonios aquí son honestos y detallados. Me siento más seguro al tomar decisiones después de leer las experiencias compartidas por otros usuarios.",
        imageUrl: "/profile4.png",
    },
    {
        id: 5,
        name: "Carlos Sánchez",
        description:
            "Una joya en la web. Los testimonios son fáciles de encontrar y están bien organizados. ¡Definitivamente mi destino número uno cuando necesito referencias confiables!",
        imageUrl: "/profile5.png",
    },
    {
        id: 6,
        name: "Antonio Martínez",
        description:
            "¡Fantástico recurso para aquellos que buscan validación antes de tomar decisiones importantes! Los testimonios aquí son veraces y realmente útiles. ¡Gracias por simplificar mi proceso de toma de decisiones!",
        imageUrl: "/profile6.png",
    },
];

export { dataPortfolio } from "@/data-projects";
