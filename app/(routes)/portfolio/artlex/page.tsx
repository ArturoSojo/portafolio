import type { Metadata } from "next";
import { getProject } from "@/data-projects";
import Landing from "./landing";

const project = getProject("artlex")!;

export const metadata: Metadata = {
    title: `${project.name} · Arturo Sojo`,
    description: project.tagline,
};

const Page = () => <Landing />;

export default Page;
