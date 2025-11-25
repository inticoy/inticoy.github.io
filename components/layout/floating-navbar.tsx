"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, User, PenNib, MagnifyingGlass } from "@phosphor-icons/react";

export const FloatingNav = ({
  className,
}: {
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [hasScroll, setHasScroll] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkScroll = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight;
      setHasScroll(scrollable);
      if (!scrollable) {
        setVisible(true);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    const observer = new MutationObserver(checkScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkScroll);
      observer.disconnect();
    };
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (!hasScroll) {
      setVisible(true);
      return;
    }

    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <House weight="fill" className="h-6 w-6 sm:h-4 sm:w-4" />, // Slightly larger icons
    },
    {
      name: "About",
      link: "/about",
      icon: <User weight="fill" className="h-6 w-6 sm:h-4 sm:w-4" />,
    },
    {
      name: "Posts",
      link: "/posts",
      icon: <PenNib weight="fill" className="h-6 w-6 sm:h-4 sm:w-4" />,
    },
    {
      name: "Search",
      link: "/search",
      icon: <MagnifyingGlass weight="fill" className="h-6 w-6 sm:h-4 sm:w-4" />,
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-[5000] pointer-events-none", // Container is full width but pointer-events-none
          className
        )}
      >
        {/* Desktop Logo: Absolute Top Left */}
        <div className="absolute top-10 left-18 hidden md:block pointer-events-auto">
             <Link
               href="/"
               className="text-2xl font-bold text-foreground hover:text-muted-foreground transition-all duration-300 tracking-tight font-[family-name:var(--font-poppins)]"
             >
                inticoy
            </Link>
        </div>

        {/* Centered Container for Mobile Logo + Navbar Pill */}
        <div className="flex flex-col items-center mt-8 pointer-events-auto">
            {/* Navbar Pill */}
            <div className="flex max-w-fit rounded-full bg-card shadow-sm shadow-secondary-foreground/5 p-1 items-center justify-center">
                {navItems.map((navItem, idx) => {
                const isActive = pathname === navItem.link || (navItem.link !== '/' && pathname?.startsWith(navItem.link));

                return (
                    <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    className={cn(
                        "relative flex items-center justify-center w-14 sm:w-auto space-x-0 sm:space-x-1 px-4 py-3 rounded-full transition-all duration-200 group sm:justify-start",
                        isActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    >
                    {/* 아이콘 - 항상 표시 */}
                    <span className="relative z-20">
                      {navItem.icon}
                    </span>
                    {/* 텍스트 - 웹에서만 표시 */}
                    <span className="relative z-20 hidden sm:block text-sm font-medium">
                      {navItem.name}
                    </span>

                    {/* Active Pill Animation */}
                    {isActive && (
                        <motion.span
                        layoutId="bubble"
                        className="absolute inset-0 bg-primary-foreground rounded-full z-10 border border-1.5 border-foreground/3"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                    )}

                    {/* Hover Effect for Inactive Items */}
                    {!isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full z-10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    </Link>
                )
                })}
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
