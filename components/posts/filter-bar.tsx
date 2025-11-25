"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const FilterBar = () => {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')
  const categories = ['writing', 'project', 'note', 'life']

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button 
        variant={!currentCategory ? "default" : "outline"} 
        size="sm" 
        asChild
        className="rounded-full"
      >
        <Link href="/posts">All</Link>
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={currentCategory === cat ? "default" : "outline"}
          size="sm"
          asChild
          className="rounded-full capitalize"
        >
          <Link href={`/posts?category=${cat}`}>{cat}</Link>
        </Button>
      ))}
    </div>
  )
}
