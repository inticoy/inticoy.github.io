"use client"

import React, { useState, useEffect } from 'react'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import { cn } from '@/lib/utils'
import 'react-grid-layout/css/styles.css'
import './bento-grid.css'

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
      { i: 'profile', x: 0, y: 0, w: 2, h: 1, minW: 2, maxW: 2, minH: 1, maxH: 1 },
      { i: 'theme', x: 0, y: 1, w: 1, h: 1 },
      { i: 'spotify', x: 1, y: 1, w: 1, h: 1 },
      { i: 'tech', x: 0, y: 2, w: 1, h: 1 },
      { i: 'map', x: 1, y: 2, w: 1, h: 1 },
      { i: 'snapshoot', x: 0, y: 3, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 2 },
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
          isDraggable={true}
          isResizable={false}
          compactType="vertical"
          preventCollision={false}
          margin={GRID_MARGIN}
          containerPadding={[0, 0]}
          useCSSTransforms={mounted}
          // We remove 'layout' prop here to let data-grid take precedence
        >
          {childArray.map((child, index) => {
            const key = (child as React.ReactElement).key || `item-${index}`
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
  )
}

interface BentoItemProps {
  className?: string
  children?: React.ReactNode
  id: string
}

export const BentoItem = ({ className, children, id }: BentoItemProps) => {
  return (
    <div
      className={cn(
        "h-full rounded-3xl transition duration-200 p-6 bg-card flex flex-col relative overflow-hidden cursor-move",
        className
      )}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
