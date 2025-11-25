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
    <main className="min-h-screen p-8 md:p-24 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Posts</h1>
          <p className="text-muted-foreground">
            Writing, projects, and thoughts.
          </p>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
           <FilterBar />
           <FilteredPostList initialPosts={posts} />
        </Suspense>
      </div>
    </main>
  )
}

import { FilteredPostList } from '@/components/posts/filtered-post-list'

