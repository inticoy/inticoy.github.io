import React, { Suspense } from 'react'
import { getAllPosts } from '@/lib/notion'
import { PostList } from '@/components/posts/post-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FilterBar } from '@/components/posts/filter-bar'

// This is a Server Component that fetches data at build time
export default async function PostsPage() {
  const allPosts = await getAllPosts();
  // Filter out 'about' category posts - those belong on /about page
  const posts = allPosts.filter(post => post.category !== 'about');

  return (
    <main className="min-h-screen mt-30 px-8 md:px-24 bg-background flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <Suspense fallback={<div>Loading filters...</div>}>
           <FilterBar />
           <FilteredPostList initialPosts={posts} />
        </Suspense>
      </div>
    </main>
  )
}

import { FilteredPostList } from '@/components/posts/filtered-post-list'

