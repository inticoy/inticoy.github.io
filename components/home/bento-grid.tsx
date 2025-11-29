"use client"

import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import { cn } from '@/lib/utils'
import 'react-grid-layout/css/styles.css'
import './bento-grid.css'

// Context for Edit Mode
interface BentoGridContextType {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

const BentoGridContext = createContext<BentoGridContextType>({
  isEditing: false,
  setIsEditing: () => {},
})

const ResponsiveGridLayout = WidthProvider(GridLayout)

interface BentoGridProps {
  className?: string
  children: React.ReactNode
}

const GRID_MARGIN: [number, number] = [16, 16]
const CELL_SIZES: Record<number, number> = {
  4: 220, // desktop
  3: 200, // tablet
  2: 180, // mobile
}
const DEFAULT_CELL_SIZE = 200

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  const [cols, setCols] = useState(4)
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // ... (previous code remains the same until layouts definition)

  // Define layouts for different column counts with strict constraints
  // Define layouts for different column counts with strict constraints
  const layouts = {
    4: [ // Desktop
      { i: 'profile', x: 0, y: 0, w: 2, h: 1, minW: 2, maxW: 2, minH: 1, maxH: 1 },
      { i: 'theme', x: 1, y: 1, w: 1, h: 1 },
      { i: 'snapshoot', x: 3, y: 0, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 2 },
      { i: 'tech', x: 2, y: 1, w: 1, h: 1 },
      { i: 'map', x: 2, y: 0, w: 1, h: 1 },
      { i: 'spotify', x: 0, y: 1, w: 1, h: 1 },
      { i: 'projects', x: 0, y: 2, w: 2, h: 1 },
      { i: 'writing', x: 2, y: 2, w: 2, h: 1 },
    ],
    3: [ // Tablet
      { i: 'profile', x: 0, y: 0, w: 2, h: 1, minW: 2, maxW: 2, minH: 1, maxH: 1 },
      { i: 'theme', x: 2, y: 0, w: 1, h: 1 },
      { i: 'tech', x: 0, y: 1, w: 1, h: 1 },
      { i: 'map', x: 1, y: 1, w: 1, h: 1 },
      { i: 'spotify', x: 2, y: 1, w: 1, h: 1 },
      { i: 'snapshoot', x: 0, y: 2, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 2 },
      { i: 'projects', x: 1, y: 2, w: 2, h: 1 },
      { i: 'writing', x: 1, y: 3, w: 2, h: 1 },
    ],
    2: [ // Mobile
      { i: 'profile', x: 0, y: 0, w: 2, h: 1 },
      { i: 'map', x: 0, y: 1, w: 1, h: 1 },
      { i: 'spotify', x: 1, y: 1, w: 1, h: 1 },
      { i: 'snapshoot', x: 0, y: 2, w: 2, h: 2 },
      { i: 'theme', x: 0, y: 4, w: 1, h: 1 },
      { i: 'tech', x: 1, y: 4, w: 1, h: 1 },
      { i: 'projects', x: 0, y: 5, w: 2, h: 1 },
      { i: 'writing', x: 0, y: 6, w: 2, h: 1 },
    ]
  }

  useEffect(() => {
    setMounted(true)
    
    const updateCols = () => {
      const width = window.innerWidth
      let newCols = 4
      if (width < 768) { 
        newCols = 2
      } else if (width < 1024) {
        newCols = 3
      } else {
        newCols = 4
      }
      
      setCols(newCols)
    }
    
    updateCols()
    window.addEventListener('resize', updateCols)
    return () => window.removeEventListener('resize', updateCols)
  }, [])

  // We don't need complex layout state management here anymore
  // We will pass data-grid directly to children based on current cols

  // Convert children array to elements with proper keys
  const childArray = React.Children.toArray(children)

  if (!mounted) return null

  const currentLayout = layouts[cols as keyof typeof layouts] || layouts[4]
  const cellSize = CELL_SIZES[cols] ?? DEFAULT_CELL_SIZE
  const gridWidth = cellSize * cols + GRID_MARGIN[0] * Math.max(cols - 1, 0)

  return (
    <BentoGridContext.Provider value={{ isEditing, setIsEditing }}>
      <div className="flex justify-center w-full px-4 md:px-8">
        <div
          className="max-w-full"
          style={{ width: `${gridWidth}px` }}
        >
          <ResponsiveGridLayout
            key={cols} // Keep key to force remount on col change for safety
            className={cn("layout", className)}
            cols={cols}
            rowHeight={cellSize}
            isDraggable={isEditing}
            isResizable={false}
            compactType="vertical"
            preventCollision={false}
            margin={GRID_MARGIN}
            containerPadding={[0, 0]}
            useCSSTransforms={mounted}
            draggableCancel=".no-drag"
            // We remove 'layout' prop here to let data-grid take precedence
          >
            {childArray.map((child, index) => {
              let key = (child as React.ReactElement).key || `item-${index}`
              
              // Strip the .$ prefix added by React.Children.toArray
              if (typeof key === 'string' && key.startsWith('.$')) {
                key = key.substring(2)
              }

              // Find layout for this item
              // Assuming child key matches 'i' in layout config (e.g. 'profile', 'sns')
              // If keys don't match exactly, we might need a mapping strategy
              // But based on previous code, keys seem to be set on BentoItem
              
              // Fallback: Try to find by index if key doesn't match 'i'
              const itemLayout = currentLayout.find(l => l.i === key) || currentLayout[index]

              return (
                <div key={key} data-grid={itemLayout}>
                  {child}
                </div>
              )
            })}
          </ResponsiveGridLayout>
        </div>
      </div>

      {isEditing && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-foreground text-background px-6 py-2.5 rounded-full font-bold shadow-xl hover:scale-105 transition-transform active:scale-95"
          >
            Done
          </button>
        </div>
      )}
    </BentoGridContext.Provider>
  )
}

import { motion } from 'framer-motion'
import { useLongPress } from '@/hooks/use-long-press'

// ... (keep existing imports)

// ... (keep BentoGrid implementation)

interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  id: string
}

export const BentoItem = ({ className, children, id, ...props }: BentoItemProps) => {
  const { isEditing, setIsEditing } = useContext(BentoGridContext)
  
  const { handlers, isPressing } = useLongPress(() => {
    if (isEditing) return
    setIsEditing(true)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, {
    threshold: 10,
    delay: 500
  })

  const eventHandlers = isEditing ? {} : handlers

  // Filter out drag handlers from props to prevent conflict with Framer Motion's drag system
  const { onDragStart, onDragEnd, ...validProps } = props as any

  return (
    <motion.div
      className={cn(
        "h-full rounded-3xl p-6 bg-card flex flex-col relative overflow-hidden bento-item transition-colors duration-200 select-none touch-manipulation", // Added select-none touch-manipulation
        isPressing && !isEditing ? "bg-accent/50" : "",
        className
      )}
      {...eventHandlers}
      {...validProps}
      onContextMenu={(e) => e.preventDefault()}
      animate={isEditing ? { 
        rotate: [0, -0.8, 0.8, -0.8, 0],
        scale: 1,
        transition: { 
          rotate: {
            duration: 0.4, // Slower duration (0.3 -> 0.4)
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 0.2
          },
          scale: { duration: 0.2 }
        }
      } : { 
        rotate: 0,
        scale: isPressing ? 0.95 : 1,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Overlay to prevent clicks in edit mode */}
      {isEditing && (
        <div className="absolute inset-0 z-50 bg-transparent cursor-grab active:cursor-grabbing" />
      )}
    </motion.div>
  )
}
