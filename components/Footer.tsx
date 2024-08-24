import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

const Footer = () => {
  return (
    <div className="grid mt-8 py-12 px-6 lg:px-28 w-full bg-gray-100">
      <div className="grid lg:flex gap-8 lg:gap-24">
        <div className="grid">
          <div className="grid items-center">
            <a href="/">
              <Image
                src="/logo.svg"
                alt="zakat today logo"
                width="48"
                height="48"
                className="w-16"
              />
            </a>
          </div>
          <div className="text-lg mt-1 font-bold bg-clip-text text-transparent bg-gradient-to-r from-gradient to-gradient">
            Nisab Today
          </div>
          <div className="text-md mt-1 text-muted-foreground">
            Created to find islamic nisab easily, and always up to date!
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:ml-auto">
          <div className="text-md mb-4 lg:mb-5 text-gray-700 font-bold">
            Links
          </div>
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-md mb-4 text-gray-700 font-bold">
            Other projects
          </div>
          <Link
            href="#"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground hover:underline pointer-events-none"
          >
            <Image
              src="/zakkini-logo.png"
              alt="zakkini logo"
              width="48"
              height="48"
              className="w-10 h-10 mr-2"
            />
            Zakkini (soon..)
          </Link>
        </div>
      </div>
      <div className="grid gap-1.5 lg:gap-0 lg:flex mt-12 text-muted-foreground">
        <div className="flex mx-auto lg:mx-0">
          Copyright © {format(new Date(), "y")} Nisab Today
          <div className="hidden lg:block mx-2">‧</div>
        </div>
        <div className="flex mx-auto lg:mx-0">
          Powered by
          <Link
            href="https://dattero.org"
            target="blank"
            className="flex hover:underline"
          >
            <Image
              src="/dattero-logo.png"
              alt="dattero logo"
              width="48"
              height="48"
              className="w-6 mx-1"
            />
            Dattero
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
