"use client";

import { GitHub, DarkMode, LinkedIn } from "@mui/icons-material";
import { Logo } from "../ui/logo";
import { IconButton } from "../ui/buttons";
import Spacer from "./Spacer";

export function Footer() {
  const handleDarkModeToggle = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <footer className="w-full h-16 pl-8 pr-4 bg-transparent flex flex-row items-center border-t border-main-30 dark:border-inticoy-blue text-slate-500 dark:text-slate-300">
      <Logo />
      <Spacer />

      <div className="hidden md:block">
        <div className="text-xs whitespace-nowrap">
          INTICOY © 2024. 윤건우. ALL RIGHTS RESERVED
        </div>
      </div>

      <Spacer />

      <div className="flex flex-row items-center">
        <IconButton href="https://github.com/inticoy">
          <GitHub />
        </IconButton>

        <IconButton href="https://linkedin.com/in/inticoy">
          <LinkedIn />
        </IconButton>

        <IconButton onClick={handleDarkModeToggle}>
          <DarkMode />
        </IconButton>
      </div>
    </footer>
  );
}
