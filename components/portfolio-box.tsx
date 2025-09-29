import Image from "next/image";
import Link from "next/link";

interface PortfolioBoxProps {
    data: {
        id: number;
        title: string;
        image: string;
        urlGithub: string;
        urlDemo: string;
        urlPlayStore: string | null;
    };
}

const PortfolioBox = (props: PortfolioBoxProps) => {
    const { data } = props;
    const { id, title, image, urlDemo, urlGithub, urlPlayStore } = data;

    return (
        <div
            key={id}
            className="flex flex-col p-4 border border-teal-50 rounded-xl h-full"
        >
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl">{title}</h3>
                {urlPlayStore ? (
                    <Link href={urlPlayStore} target="_blank">
                        <Image
                            src="/playstore.png"
                            alt="Open on Play Store"
                            width={100}
                            height={180}
                            className="object-contain"
                        />
                    </Link>
                ) : null}
            </div>
            <div className="flex-1 flex items-center justify-center">
                <Image
                    src={image}
                    alt={title}
                    width={200}
                    height={200}
                    className="w-full md:w-[200px] rounded-2xl h-auto object-contain"
                />
            </div>

            <div className="flex gap-5 mt-5">
                <Link
                    href={urlGithub}
                    target="_blank"
                    className="p-2 transition duration-150 rounded-lg bg-slate-500 hover:bg-slate-500/80"
                >
                    Github
                </Link>

                <Link
                    href={urlDemo}
                    target="_blank"
                    className="p-2 transition duration-150 rounded-lg bg-secondary hover:bg-secondary/80"
                >
                    Live demo
                </Link>
            </div>
        </div>
    );
};

export default PortfolioBox;
