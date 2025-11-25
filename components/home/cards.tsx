"use client"

import React from 'react'
import { BentoItem } from './bento-grid'
import { ArrowRight, MapPin, SpotifyLogo, AppleLogo, Code, PenNib, Sun, Moon } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import Map, { Marker } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export const ProfileCard = () => {
  return (
    <BentoItem id="profile" className="bg-card">
      <div className="relative flex h-full flex-col justify-between gap-4 pr-2">
		<Link 
		  href="/posts?category=project" 
		  className="absolute right-2 top-2 text-xs text-muted-foreground hover:text-foreground transition"
		  >
            View all
          </Link>
        <div className="flex flex-col gap-2">
          <div className="relative h-12 w-12 md:h-18 md:w-18 lg:h-24 lg:w-24 overflow-hidden rounded-full border border-border/50">
            <Image
              src="https://avatars.githubusercontent.com/u/55380241?s=400&u=c093891ceb333c878e0a1835986ac79357bd0381&v=4"
              alt="Inticoy avatar"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground font-[family-name:var(--font-poppins)]">inticoy</p>
            <p className="text-sm text-muted-foreground">
              Backend developer in Korea. I’m interested in AI, games, and building from scratch.
            </p>
          </div>
        </div>
      </div>
    </BentoItem>
  )
}

export const ProjectsCard = () => {
  return (
    <BentoItem id="projects" className="bg-card">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code weight="bold" className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Projects</h3>
          </div>
          <Link href="/posts?category=project" className="text-xs text-muted-foreground hover:text-foreground transition">
            View all
          </Link>
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
            <span className="text-sm font-medium text-foreground">Inticoy.io</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Live</span>
          </div>
          <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
            <span className="text-sm font-medium text-foreground">SnapShoot</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">Beta</span>
          </div>
        </div>
      </div>
    </BentoItem>
  )
}

export const WritingCard = () => {
  return (
    <BentoItem id="writing" className="bg-card">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenNib weight="bold" className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Writing</h3>
          </div>
          <Link href="/posts?category=writing" className="text-xs text-muted-foreground hover:text-foreground transition">
            View all
          </Link>
        </div>
        
        <div className="mt-2">
          <p className="text-sm font-medium text-foreground line-clamp-1">Decoding playful systems</p>
          <p className="text-xs text-muted-foreground mt-1">2025.01.12</p>
        </div>
      </div>
    </BentoItem>
  )
}

export const TechStackCard = () => {
  const stack = ['Next.js', 'React', 'TS', 'Node', 'Go', 'AWS']
  
  return (
    <BentoItem id="tech" className="bg-card">
      <div className="flex h-full flex-col justify-between">
        <h3 className="text-md font-semibold text-foreground">Stack</h3>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span key={tech} className="text-[10px] font-medium border border-border px-2 py-1 rounded-md text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </BentoItem>
  )
}

export const MapCard = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  return (
    <BentoItem id="map" className="!p-0 overflow-hidden bg-card relative">
        <div className="absolute inset-0">
            <Map
              mapLib={maplibregl}
              initialViewState={{
                longitude: 127.107438,
                latitude: 37.324366,
                zoom: 8
              }}
              style={{width: '100%', height: '100%'}}
              mapStyle={isDark 
                ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" 
                : "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
              }
              attributionControl={false}
            >
                <Marker longitude={127.107438} latitude={37.324366} anchor="bottom">
                    <div className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
                    </div>
                </Marker>
            </Map>
        </div>
        <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 flex items-center gap-2 z-10">
            <MapPin weight="fill" className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">Yongin, KR</span>
        </div>
    </BentoItem>
  )
}

export const SpotifyCard = () => {
  return (
    <BentoItem id="spotify" className="bg-card">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
			<Image
			  src='/apple_music_icon.png' 
			  alt='apple music icon'
			  width={48}
			  height={48}
			/>
            <div className="flex items-end h-5 space-x-0.5">
				{[1, 2, 3, 4].map((bar) => (
					<motion.div
					key={bar}
					className="w-1 bg-[#FA243C] rounded-full"
					animate={{
						height: ["20%", "80%", "40%", "100%", "20%"], // 높이 변화 배열
					}}
					transition={{
						duration: 1.2,
						repeat: Infinity,
						repeatType: "loop",
						ease: "easeInOut",
						delay: Math.random() * 0.5, // 랜덤 딜레이
					}}
				/>
				))}
			</div>
        </div>
        <a 
          href="https://music.apple.com/kr/playlist/year-2025/pl.u-Ymb00v0sgN16xjg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity" // 클릭 가능하다는 느낌을 주기 위한 효과 추가
        >
            <p className="text-md font-medium text-foreground line-clamp-1">Now Playing</p>
            <p className="text-xs text-muted-foreground">Year 2025</p>
        </a>
      </div>
    </BentoItem>
  )
}

export const SnapshootCard = () => {
  return (
    <BentoItem id="snapshoot" className="!p-0 !bg-transparent overflow-hidden">
      <div className="relative h-full w-full">
        <Image
          src="/snapshoot.png"
          alt="Snapshoot preview"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 text-white">
		  <p className="text-lg font-bold text-white font-[family-name:var(--font-poppins)]">SnapShoot!</p>
          <p className="text-xs text-white/80">Swipe up to SnapShoot!</p>
        </div>
      </div>
    </BentoItem>
  )
}

export const ThemeCard = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const isDark = theme === 'dark'

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  if (!mounted) {
    return (
      <BentoItem id="theme" className="bg-secondary/80 flex items-center justify-center text-center">
        <span className="text-sm font-medium text-foreground">Theme</span>
      </BentoItem>
    )
  }

  return (
    <BentoItem id="theme" className="bg-card flex items-center justify-center">
      <button
        onClick={toggleTheme}
        className="flex h-full items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="relative flex h-10 w-18 items-center rounded-full bg-primary px-3">
          <div className="pointer-events-none flex w-full items-center justify-between text-muted-foreground">
            <Sun
              weight='fill'
              className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-50' : 'opacity-100'}`}
            />
            <Moon
              weight='fill'
              className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-50'}`}
            />
          </div>
          <div
            className={`absolute top-1 left-1 h-8 w-8 rounded-full bg-card shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              isDark ? 'translate-x-8' : 'translate-x-0'
            }`}
          >
            <div className="flex h-full w-full items-center justify-center">
              {isDark ? (
                <Moon weight="fill" className="h-4 w-4 text-yellow-500 transition-transform duration-300" />
              ) : (
                <Sun weight="fill" className="h-4 w-4 text-yellow-500 transition-transform duration-300" />
              )}
            </div>
          </div>
        </div>
      </button>
    </BentoItem>
  )
}
