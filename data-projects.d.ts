// GENERADO — tipos del catálogo de proyectos (el dato vive en data-projects.js).

export interface ProjectMedia {
    src: string;
    kind: string;
    caption: string;
}

export interface ProjectBrandData {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
    gradient: string;
    textGradient: string;
    ink: string;
    onBrand: string;
    mood: string;
    source: string;
}

export interface ProjectEntry {
    slug: string;
    name: string;
    tagline: string;
    category: string;
    categoryShort: string;
    year: string;
    role: string;
    status: string;
    statusShort: string;
    summary: string[];
    problem: string;
    solution: string;
    highlights: { title: string; description: string; icon: string }[];
    features: string[];
    stack: { group: string; items: string[] }[];
    architecture: string;
    challenges: { problem: string; solution: string }[];
    metrics: { value: string; label: string }[];
    brand: ProjectBrandData;
    links: { github?: string; web?: string; play?: string; demo?: string };
    media: ProjectMedia[];
    uiScreens: { name: string; describe: string }[];
    visualConcept: string;
}

export declare const projects: ProjectEntry[];
export declare const getProject: (slug: string) => ProjectEntry | undefined;
export declare const nextProject: (slug: string) => ProjectEntry;
export declare const dataPortfolio: {
    id: number;
    title: string;
    image: string;
    urlGithub: string;
    urlDemo: string;
}[];
