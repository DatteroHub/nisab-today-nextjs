import Image from "next/image";
import LastUpdate from "./LastUpdate";

const Hero = () => {
  return (
    <div className="grid lg:flex w-full gap-8 mb-8 lg:mb-20 justify-start px-4 pt-2 lg:px-0 lg:pt-0">
      <div className="grid items-center">
        <a href="/">
          <Image
            src="/logo.svg"
            alt="zakat today logo"
            width="56"
            height="56"
            className="w-28"
          />
        </a>
      </div>
      <div className="grid gap-3 items-center">
        <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gradient to-gradient">
          Nisab Today
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed lg:leading-normal">
          Find islamic nisab value, for{" "}
          <span className="bg-amber-100 px-2 py-1">every currency</span>,{" "}
          <span className="bg-blue-100 px-2 py-1">every country</span>, updated{" "}
          <span className="bg-green-100 px-2 py-1">everyday</span>.
        </p>
      </div>
      <div className="grid items-center mx-auto lg:mr-0">
        <LastUpdate />
      </div>
    </div>
  );
};

export default Hero;
