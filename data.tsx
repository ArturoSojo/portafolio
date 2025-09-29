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
        src: "https://www.linkedin.com/in/arturo-sojo-57b913364",
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
        title: "Systems Analyst",
        subtitle: "Pegaso Consulting C.A.",
        description: "Currently working at a software development company where I play a key role in creating and maintaining technology solutions.",
        date: "2025",
    },
    {
        id: 2,
        title: "Frontend Developer",
        subtitle: "Servicios Paguetodo C.A.",
        description: "Collaborated with an outstanding team to build high-quality digital products that accelerated client success.",
        date: "2023 - 2025",
    },
  
    {
        id: 3,
        title: "Computer Science",
        subtitle: "U.P.T.B.A.L",
        description: "Studied Computer Science at Universidad Politecnica Territorial 'Argelia Laya' for two years.",
        date: "2019 - 2021",
    },
    
]

export const dataCounter = [
    {
        id: 0,
        endCounter: 2,
        text: "Years of experience",
        lineRight: true,
        lineRightMobile: true,
    },
    {
        id: 1,
        endCounter: 5,
        text: "Languages mastered",
        lineRight: true,
        lineRightMobile: false,
    },
    {
        id: 2,
        endCounter: 14,
        text: "Projects delivered",
        lineRight: true,
        lineRightMobile: true,
    },
    {
        id: 3,
        endCounter: 30,
        text: "Courses completed",
        lineRight: false,
        lineRightMobile: false,
    },
];

export const serviceData = [
    {
        icon: <Crop />,
        title: "Mobile development",
        description: "Design and build interactive mobile applications optimized for performance.",
        },
    {
        icon: <Pencil />,
        title: "Web design",
        description: "Create intuitive, attractive web interfaces centered on seamless user experiences.",
    },
    {
        icon: <Computer />,
        title: "Web development",
        description: "Develop tailor-made websites aligned with your goals and requirements.",
    },
  
];

export const dataPortfolio = [
        {
        id: 1,
        title: "Learning English AI",
        image: "/learningenglihsia.png",
        urlGithub: "https://github.com/ArturoSojo/learning_english_ai",
        urlDemo: "https://drive.google.com/drive/folders/1v4mDQW8Dh3sqZTXc4-Jqr0Rs83J6Nout?usp=sharing",
        urlPlayStore: null,
    },
    {
        id: 2,
        title: "Eduletter",
        image: "/eduletter.png",
        urlGithub: "https://github.com/ArturoSojo/eduletter",
        urlDemo: "https://www.youtube.com/watch?v=8dRXQF4eYJA&t=65s",
        urlPlayStore: "https://play.google.com/store/apps/details?id=com.artlex.eduletter_app",
    },
    
    {
        id: 3,
        title: "APP Service Payments",
        image: "/image-1.png",
        urlGithub: "https://github.com/ArturoSojo/servicepay-pos",
        urlDemo: "https://www.youtube.com/shorts/sAOwu_-WLBc",
        urlPlayStore: null,
    },
    {
        id: 4,
        title: "Website",
        image: "/image-6.png",
        urlGithub: "https://github.com/ArturoSojo/website_paguetodo",
        urlDemo: "https://paguetodo.com/",
        urlPlayStore: null,
    },
    {
        id: 5,
        title: "CliffPickleball",
        image: "/image-2.jpg",
        urlGithub: "https://github.com/ArturoSojo/cliff_pickleball",
        urlDemo: "https://www.youtube.com/shorts/NitooJQCq6I",
        urlPlayStore: null,
    },
    {
        id: 6,
        title: "Robust PickleBall",
        image: "/robustpickleball.png",
        urlGithub: "https://www.robustpickleball.com/",
        urlDemo: "https://www.robustpickleball.com/",
        urlPlayStore: null,
    },

   
];

export const dataTestimonials = [
    {
        id: 1,
        name: "George Snow",
        description:
            "Incredible platform! The testimonials here are genuine and helped me make informed decisions. Highly recommended!",
        imageUrl: "/profile1.png",
    },
    {
        id: 2,
        name: "Juan Perez",
        description:
            "I love the variety of testimonials available on this page. It is inspiring to see how others overcame challenges similar to mine. Thanks for this invaluable source of motivation!",
        imageUrl: "/profile2.png",
    },
    {
        id: 3,
        name: "Maria Garcia",
        description:
            "Excellent resource for authentic opinions on different products and services. It has helped me a lot with my online purchases. Bravo to the team!",
        imageUrl: "/profile3.png",
    },
    {
        id: 4,
        name: "Laura Snow",
        description:
            "What a fantastic discovery! The testimonials here are honest and detailed. I feel more confident making decisions after reading the experiences other users share.",
        imageUrl: "/profile4.png",
    },
    {
        id: 5,
        name: "Carlos Sanchez",
        description:
            "A hidden gem on the web. The testimonials are easy to find and well organized. Definitely my number one destination when I need trustworthy references!",
        imageUrl: "/profile5.png",
    },
    {
        id: 6,
        name: "Antonio Martinez",
        description:
            "Fantastic resource for anyone seeking validation before making important decisions! The testimonials here are honest and truly useful. Thanks for simplifying my decision-making process!",
        imageUrl: "/profile6.png",
    },
];
