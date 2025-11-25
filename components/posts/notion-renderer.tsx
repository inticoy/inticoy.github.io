"use client"

import { NotionRenderer as ReactNotionX } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Core styles are required
import 'react-notion-x/src/styles.css'

// Optional: Code block syntax highlighting
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)

// Optional: Collection view (database)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
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

interface NotionRendererProps {
  recordMap: ExtendedRecordMap
}

export const NotionRenderer = ({ recordMap }: NotionRendererProps) => {
  const { theme } = useTheme()

  return (
    <ReactNotionX
      recordMap={recordMap}
      fullPage={false}
      darkMode={theme === 'dark'}
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
  )
}
