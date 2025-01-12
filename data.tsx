import { BookText, CodeSquare, HomeIcon, UserRound, Linkedin, Twitter, Rss, Twitch, Youtube, Crop, Pencil, Computer, Book, Rocket, Speech, Facebook, Instagram} from "lucide-react";

export const socialNetworks = [
    {
        id: 1,
        logo: <Youtube size={30} strokeWidth={1} />,
        src: "https://www.youtube.com/@arturosojovivas1204",
    },
    
    {
        id: 2,
        logo: <Linkedin size={30} strokeWidth={1} />,
        src: "https://www.linkedin.com/in/arturo-sojo-4988a3197/",
    },
    {
        id: 3,
        logo: <Facebook size={30} strokeWidth={1} />,
        src: "https://www.facebook.com/arturo.sojovivas",
    },
    {
        id: 4,
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
        title: "Frontend Developer",
        subtitle: "Servicios Paguetodo C.A.",
        description: "Trabajé con un equipo maravilloso para desarrollar ptoductos digitales de alta calidad que impulsaron el éxito de clientes.",
        date: "2023 - 2025",
    },
    {
        id: 2,
        title: "Administrador de Empresas",
        subtitle: "U.P.T.B.A.L.",
        description: "Estudié en la Universidad Poletécnica Territorial 'Argelia Laya' Administración de empresas durante 2 años.",
        date: "2021 - 2023",
    },
    {
        id: 3,
        title: "Informática",
        subtitle: "U.P.T.B.A.L",
        description: "Estudié en la Universidad Poletécnica Territorial 'Argelia Laya' Informática durante 2 años.",
        date: "2019 - 2021",
    },
    
]

export const dataCounter = [
    {
        id: 0,
        endCounter: 2,
        text: "Años de experiencia",
        lineRight: true,
        lineRightMobile: true,
    },
    {
        id: 1,
        endCounter: 5,
        text: "Lenguajes conocidos",
        lineRight: true,
        lineRightMobile: false,
    },
    {
        id: 2,
        endCounter: 14,
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
        icon: <Crop />,
        title: "Desarrollo móvil",
        description: "Diseño y desarrollo de aplicaciones móviles a interactivas, optimizadas para un buen rendimiento."
        },
    {
        icon: <Pencil />,
        title: "Diseño web",
        description: "Diseño creativo y profesional de interfaces web intuitivas y atractivas, centradas en la experiencia del usuario",
    },
    {
        icon: <Computer />,
        title: "Desarrollo web",
        description: "Diseño y desarrollo de sitios web a medida, adaptados a tus necesidades",
    },
  
];

export const dataPortfolio = [
    {
        id: 1,
        title: "APP Service Payments",
        image: "/image-1.png",
        urlGithub: "https://github.com/ArturoSojo/servicepay-pos",
        urlDemo: "https://www.youtube.com/shorts/sAOwu_-WLBc",
    },
    {
        id: 6,
        title: "Website",
        image: "/image-6.png",
        urlGithub: "https://github.com/ArturoSojo/website_paguetodo",
        urlDemo: "https://paguetodo.com/",
    },
    {
        id: 2,
        title: "CliffPickleball",
        image: "/image-2.jpg",
        urlGithub: "https://github.com/ArturoSojo/cliff_pickleball",
        urlDemo: "https://www.youtube.com/shorts/NitooJQCq6I",
    },
    {
        id: 3,
        title: "Online Store",
        image: "/image-3.png",
        urlGithub: "https://github.com/ArturoSojo/STO",
        urlDemo: "https://youtu.be/odptyxik5Wk",
    },
    {
        id: 4,
        title: "ARTLEX",
        image: "/image-4.jpg",
        urlGithub: "https://github.com/ArturoSojo/artlex",
        urlDemo: "https://www.youtube.com/shorts/W6NppqNkH5Y",
    },
    {
        id: 5,
        title: "ServiciosYa",
        image: "/image-5.jpg",
        urlGithub: "https://github.com/ArturoSojo/servicios_ya_ve",
        urlDemo: "https://www.youtube.com/shorts/B6CBIvyBBSU",
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