"use client"

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import { NotionRenderer as ReactNotionX } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { defaultMapImageUrl } from 'notion-utils'
import clsx from 'clsx'
import { CategoryChip } from '@/components/ui/category-chip'
import { CalendarBlank, Tag } from '@phosphor-icons/react'

// Core styles are required
import 'react-notion-x/src/styles.css'

// Optional: Code block syntax highlighting
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)

// Optional: Equation (math)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)

// Optional: PDF
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)

// Optional: Modal
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)

// Optional: Collection (Database)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)

const FALLBACK_PAGE_COVER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480"></svg>
`.trim()

const DEFAULT_PAGE_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_PAGE_COVER_SVG)}`

interface NotionRendererProps {
  recordMap: ExtendedRecordMap
  fullPage?: boolean
  className?: string
  post?: any // Using any temporarily to avoid import issues, will fix with type import
}

export const NotionRenderer = ({ recordMap, fullPage = false, className, post }: NotionRendererProps) => {
  const { theme } = useTheme()
  const rendererRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!post || !rendererRef.current) return

    // Find the title element
    const titleElement = rendererRef.current.querySelector('.notion-title')
    if (!titleElement) return

    // Check if metadata is already injected
    if (titleElement.nextElementSibling?.classList.contains('post-metadata-injected')) return

    // Create container for metadata
    const metadataContainer = document.createElement('div')
    metadataContainer.className = 'w-full post-metadata-injected pb-12 flex flex-col gap-4'
    
    // Insert after title
    titleElement.insertAdjacentElement('afterend', metadataContainer)

    // Render metadata component into the container
    const root = createRoot(metadataContainer)
    root.render(
      <>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {/* Category */}
          {post.category && (
            <CategoryChip category={post.category} href={`/posts?category=${post.category}`} />
          )}

          {/* Divider */}
          <span className="text-muted-foreground/30">|</span>

          {/* Date */}
          {post.publishedAt && (
            <div className="flex items-center">
              <CalendarBlank className="w-4 h-4 mr-1.5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          )}

          {/* Divider */}
          {post.tags && post.tags.length > 0 && (
            <span className="text-muted-foreground/30">|</span>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="hover:text-foreground transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {post.summary && (
          <div className="text-lg text-muted-foreground italic leading-relaxed">
            {post.summary}
          </div>
        )}

        {/* Separator */}
        {/* <hr className="border-t border-border mt-8" /> */}
      </>
    )

    // Cleanup function to unmount root when component unmounts or post changes
    return () => {
        // We can't easily "unmount" the DOM node insertion cleanly without potentially messing up 
        // if the parent re-renders, but we should try to unmount the react root.
        // However, since we are modifying the DOM managed by another library, strict cleanup might be tricky.
        // For now, we'll just unmount the root. The div might stay if we don't remove it, 
        // but checking for existence prevents duplicates.
        setTimeout(() => root.unmount(), 0)
        metadataContainer.remove()
    }
  }, [post])

  return (
    <div className={className} ref={rendererRef}>
      <ReactNotionX
        recordMap={recordMap}
        fullPage={fullPage} // Always use fullPage as requested (or passed prop)
        darkMode={theme === 'dark'}
        defaultPageCover={DEFAULT_PAGE_COVER}
        components={{
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
          nextImage: Image,
          nextLink: Link,
        }}
        className="notion-renderer"
      />
    </div>
  )
}

