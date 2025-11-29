"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CategoryChip } from '@/components/ui/category-chip'

export const FilterBar = () => {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')
  const categories = ['writing', 'project', 'note', 'life']

  return (
    <div className="flex flex-wrap gap-1.5 mb-8">
      <CategoryChip 
        category="All" 
        isActive={!currentCategory} 
        href="/posts" 
      />
      {categories.map((cat) => (
        <CategoryChip
          key={cat}
          category={cat}
          isActive={currentCategory === cat}
          href={`/posts?category=${cat}`}
        />
      ))}
    </div>
  )
}
