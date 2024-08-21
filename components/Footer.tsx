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
                className="w-12"
              />
            </a>
          </div>
          <div className="text-lg font-bold my-primary-color mt-2">
            Nisab Today
          </div>
          <div className="text-md text-muted-foreground">
            Created to find islamic nisab easily, and always up to date!
          </div>
        </div>
        <div className="grid lg:ml-auto">
          <div className="text-md text-gray-700 font-bold">Links</div>
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="grid">
          <div className="text-md text-gray-700 font-bold">Other projects</div>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline pointer-events-none"
          >
            Zakkini (coming soon..)
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
