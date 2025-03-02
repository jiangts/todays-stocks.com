"use client";

import Link from "next/link";
import Image from "next/image";
import ButtonAccount from "@/components/ButtonAccount";
import logo from "@/app/icon.png";
import config from "@/config";

export default function Header() {
  return (
    <header className="bg-base-200">
      <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
        <div className="flex">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8"
              placeholder="blur"
              priority={true}
              width={32}
              height={32}
            />
            <span className="font-extrabold text-lg">{config.appName}</span>
          </Link>
        </div>

        {/* Center section - can add links here if needed */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {/* Navigation links could go here */}
        </div>

        {/* Account button on right */}
        <div className="flex justify-end">
          <ButtonAccount />
        </div>
      </nav>
    </header>
  );
}
