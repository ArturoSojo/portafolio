import AvatarServices from "@/components/avatar-services";
import CircleImage from "@/components/circle-image";
import SliderServices from "@/components/slider-services";
import TransitionPage from "@/components/transition-page";

const ServicesPage = () => {
    return (
        <>

            <TransitionPage />
            <CircleImage />

            <div className="grid items-center justify-center h-screen max-w-5xl gap-6 mx-auto md:grid-cols-2">
  <div className="max-w-[450px]">
    <h1 className="mt-32 md:mt-0 text-2xl leading-tight text-center md:text-left md:text-4xl md:mb-5">
      My <span className="font-bold text-secondary">skills.</span>
    </h1>
    <p className="mb-3 text-xl text-gray-300 aling-justify">
      I bring mobile and front-end web development expertise focused on building engaging, high-performing products. Leveraging modern technologies, I design intuitive, responsive interfaces that reflect each brand&apos;s identity and strengthen its presence.
    </p>
    <a href="https://wa.me/584168624450"
        className="px-3 py-2 my-5 transition-all border-2 cursor-pointer text-md w-fit text-secondary border-secondary rounded-xl hover:shadow-xl hover:shadow-secondary">
        Let&apos;s connect
    </a>
  </div>

  {/* SLIDER */}
  <div>
    <SliderServices />
  </div>
</div>

        </>
    );
}

export default ServicesPage;
