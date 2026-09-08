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
      Mis <span className="font-bold text-secondary"> habilidades.</span>
    </h1>
    <p className="mb-3 text-xl text-gray-300 aling-justify">
      Cuatro años de desarrollo móvil y web: apps multiplataforma en Flutter,
      plataformas en React y Next.js, y el backend serverless que las sostiene
      sobre Firebase. Diseño interfaces intuitivas y responsivas, integro pagos
      y APIs, y llevo el producto hasta la tienda.
    </p>
    <a href="https://wa.me/584168624450" 
        className="px-3 py-2 my-5 transition-all border-2 cursor-pointer text-md w-fit text-secondary border-secondary rounded-xl hover:shadow-xl hover:shadow-secondary">
        Contacta conmigo
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