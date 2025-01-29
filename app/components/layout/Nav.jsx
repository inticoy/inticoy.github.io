"use client";

import Link from "next/link";
import { useState } from "react";
import { IconButton } from "../ui/buttons";
import { Search, Menu } from "@mui/icons-material";
import { Logo } from "../ui/logo";
import Spacer from "./Spacer";

const navItems = [
  { href: "/about", name: "About" },
  { href: "/posts", name: "Posts" },
  { href: "/projects", name: "Projects" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-40 
        flex items-center
        w-full h-16 pl-8 pr-4 
        bg-white/80 dark:bg-inticoy-dark/80 backdrop-blur-md
        border-b border-main-30 dark:border-inticoy-blue 
        text-slate-500 dark:text-slate-300"
    >
      <Logo />
      <Spacer />

      {/* Desktop Menu */}
      <nav className="hidden md:block">
        <ul className="flex space-x-2">
          {navItems.map(({ href, name }) => (
            <li
              key={href}
              className="
                p-2 
                hover:text-slate-800 
                dark:hover:text-amber-400 
                cursor-pointer"
            >
              <Link href={href}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Icon Buttons */}
      <div className="ml-4 flex items-center">
        <IconButton href="/search">
          <Search />
        </IconButton>

        <IconButton
          className={"md:hidden"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Menu />
        </IconButton>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="
            md:hidden
            absolute top-16 left-0 w-full
            py-4
            bg-white dark:bg-inticoy-dark
            shadow-lg"
        >
          <ul className="flex flex-col items-center space-y-2">
            {navItems.map(({ href, name }) => (
              <li
                key={href}
                className="
                  p-2 
                  hover:text-slate-800 
                  dark:hover:text-amber-400 
                  cursor-pointer"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <Link href={href}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
