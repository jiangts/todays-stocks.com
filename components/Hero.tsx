import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import ButtonLead from "./ButtonLead";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          AI-Powered Stock Research
        </h1>
        <p className="text-lg opacity-80 leading-relaxed prose">
          Stay on top of your trading strategy with daily market insights for
          your chosen stocks, with alerts and analysis on price changes, news,
          and more!
          {/* Our AI scans the market daily, delivering automated fundamental &
          technical analysis on pre-defined stock sets (e.g., daily top gainers
          & losers) or your custom stock watchlist. Get alerts based on your
          criteria & never miss a key market move. */}
        </p>
        {/* <button className="btn btn-primary btn-wide">
          Get {config.appName}
        </button> */}
        <div className="m-auto">
          <ButtonLead />
        </div>

        {/* <TestimonialsAvatars priority={true} /> */}
      </div>
      {/* <div className="lg:w-full">
        <Image
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={500}
          height={500}
        />
      </div> */}
    </section>
  );
};

export default Hero;
