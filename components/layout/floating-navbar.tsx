"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);

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

  // Helper to find active tab based on pathname
  const getActiveTab = (path: string | null) => {
    if (!path) return null;
    return navItems.find(item => 
      path === item.link || (item.link !== '/' && path.startsWith(item.link))
    )?.link || null;
  };

  // Reset hovered tab when pathname changes (navigation complete)
  useEffect(() => {
    setHoveredTab(getActiveTab(pathname));
    isNavigatingRef.current = false; // Reset navigation flag
  }, [pathname]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // If not touching (mouse hover), standard behavior is fine (elementsFromPoint works)
    // But for touch scrubbing (captured), we need X-axis logic
    if (isTouching && navRef.current) {
      const container = navRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      const clientX = e.clientX;

      // Find the item whose X range contains the pointer, or is closest
      // Actually, just finding the one we are "over" horizontally is enough
      // If we are outside vertically, we still want to select based on X.
      
      let targetTabId: string | null = null;
      let minDistance = Infinity;

      children.forEach((child) => {
        const rect = child.getBoundingClientRect();
        const tabId = child.getAttribute('data-tab-id');
        if (!tabId) return;

        // Check if within horizontal bounds
        if (clientX >= rect.left && clientX <= rect.right) {
          targetTabId = tabId;
          minDistance = 0;
        } else {
          // Calculate distance to center if not directly over
          const center = rect.left + rect.width / 2;
          const dist = Math.abs(clientX - center);
          if (dist < minDistance) {
            minDistance = dist;
            targetTabId = tabId;
          }
        }
      });

      if (targetTabId) {
        setHoveredTab(targetTabId);
      }
    } else {
      // Mouse hover behavior (fallback to elementsFromPoint or just let CSS handle it? 
      // We need state update for the bubble)
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const tabElement = elements.find(el => el.getAttribute('data-tab-id'));
      if (tabElement) {
        const tabId = tabElement.getAttribute('data-tab-id');
        if (tabId) setHoveredTab(tabId);
      }
    }
  };

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
            <div 
              ref={navRef}
              className="flex max-w-fit rounded-full bg-card shadow-sm shadow-secondary-foreground/5 p-1 items-center justify-center touch-none select-none"
              onPointerDown={(e) => {
                setIsTouching(true);
                e.currentTarget.setPointerCapture(e.pointerId); // Capture pointer for scrubbing outside
              }}
              onPointerUp={(e) => {
                setIsTouching(false);
                e.currentTarget.releasePointerCapture(e.pointerId);
                
                // Navigate on release if we have a hovered tab and it's different from current
                if (hoveredTab && hoveredTab !== getActiveTab(pathname)) {
                  isNavigatingRef.current = true; // Set flag to prevent reset on leave
                  router.push(hoveredTab);
                }
              }}
              onPointerLeave={() => {
                // Only reset if we are NOT navigating and NOT currently touching (scrubbing)
                // If touching, we rely on pointer capture + move to handle state
                if (!isNavigatingRef.current && !isTouching) {
                  setHoveredTab(getActiveTab(pathname)); 
                }
              }}
              onPointerMove={handlePointerMove}
            >
                {navItems.map((navItem, idx) => {
                // Determine if this tab is visually active
                // If hovering/scrubbing, use hoveredTab. Otherwise use pathname.
                const isSelected = hoveredTab === navItem.link;
                const isActuallyActive = pathname === navItem.link || (navItem.link !== '/' && pathname?.startsWith(navItem.link));

                return (
                    <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    data-tab-id={navItem.link} // Identifier for elementFromPoint
                    className={cn(
                        "relative flex items-center justify-center w-14 sm:w-auto space-x-0 sm:space-x-1 px-4 py-3 rounded-full transition-all duration-200 group sm:justify-start",
                        isSelected
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setHoveredTab(navItem.link)} // Immediate feedback on click
                    >
                    {/* 아이콘 - 항상 표시 */}
                    <span className="relative z-20">
                      {navItem.icon}
                    </span>
                    {/* 텍스트 - 웹에서만 표시 */}
                    <span className="relative z-20 hidden sm:block text-sm font-medium">
                      {navItem.name}
                    </span>

                    {/* Active Pill Animation - Based on hoveredTab for sliding effect */}
                    {isSelected && (
                        <motion.span
                        layoutId="bubble"
                        className="absolute inset-0 bg-primary-foreground rounded-full z-10 border border-1.5 border-foreground/3"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
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
