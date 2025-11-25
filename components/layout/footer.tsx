"use client"

import React from 'react'
import Link from 'next/link'
import { GithubLogo, LinkedinLogo, EnvelopeSimpleOpen } from '@phosphor-icons/react'

export const Footer = () => {
  return (
    <footer className="border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 text-center md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start md:justify-self-start">
          <span className="text-lg font-bold text-foreground font-[family-name:var(--font-poppins)]">inticoy</span>
        </div>

        <div className="flex items-center justify-center gap-4 md:justify-self-center">
          <Link href="https://github.com/inticoy" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <GithubLogo weight="fill" className="w-5 h-5" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <LinkedinLogo weight="fill" className="w-5 h-5" />
          </Link>
		  <Link href="mailto:inticoy0406@gmail.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
			<EnvelopeSimpleOpen weight="fill" className="w-5 h-5" />
		  </Link>
        </div>

        <div className="text-xs text-muted-foreground md:justify-self-end md:text-right">
          © {new Date().getFullYear()} Inticoy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
