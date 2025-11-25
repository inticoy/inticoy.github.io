"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/lib/notion'
import { PostList } from './post-list'

interface FilteredPostListProps {
  initialPosts: Post[]
}

export const FilteredPostList = ({ initialPosts }: FilteredPostListProps) => {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  const filteredPosts = category 
    ? initialPosts.filter(post => post.category === category)
    : initialPosts

  return <PostList posts={filteredPosts} />
}
