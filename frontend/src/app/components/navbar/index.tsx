"use client"; 

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const pathname = usePathname();

  function linkStyle(href: string) {
    return pathname === href ? "text-[#85A5DF] font-semibold" : "text-black";
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 py-6 px-6 bg-transparent">
      <div className="flex justify-between items-center mx-auto w-7/8">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={100} height={40} priority />
        </Link>

        {/* Navigation links (hidden on small screens) */}
        <div className="hidden md:flex justify-between items-center gap-8 text-sm">
          <Link href="/pages/about" className={linkStyle("/pages/about")}>
            about
          </Link>
          <Link href="/pages/journal" className={linkStyle("/pages/journal")}>
            journal
          </Link>
          <Link href="/pages/dashboard" className={linkStyle("/pages/dashboard")}>
            dashboard
          </Link>
          <Link href="/pages/login" className={linkStyle("/pages/login")}>
            login
          </Link>
          <Link href="/pages/join" className={linkStyle("/pages/join")}>
            join
          </Link>
        </div>

        {/* Hamburger icon (for mobile) */}
        <div className="md:hidden flex justify-end">
          <Bars3Icon className="h-6 w-6 text-[#ff6600]" />
        </div>
      </div>
    </nav>
  );
}