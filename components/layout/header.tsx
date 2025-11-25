"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export const Header = () => {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Posts', href: '/posts' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-foreground">
            Inticoy
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}

          <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
            <Link href="/search">
              <MagnifyingGlass weight="bold" className="w-5 h-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
