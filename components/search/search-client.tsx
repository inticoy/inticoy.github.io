"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Post } from '@/lib/notion'
import { PostList } from '@/components/posts/post-list'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface SearchClientProps {
  posts: Post[]
}

export function SearchClient({ posts }: SearchClientProps) {
  const [query, setQuery] = useState('')

  const filteredPosts = posts.filter(post => {
    const searchContent = `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLowerCase()
    return searchContent.includes(query.toLowerCase())
  })

  return (
    <main className="min-h-screen mt-30 px-8 md:px-24 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-card rounded-full px-2 h-12 border border-border/30">
                <MagnifyingGlass 
                className="ml-3 text-muted-foreground w-5 h-5" 
                weight="bold" 
                />
                <Input
                type="text"
                placeholder="Search posts..."
                className="flex-1 h-full text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                />
            </div>
          </div>
        </div>

        <div className="mt-8">
            {query && (
                <p className="text-sm text-muted-foreground mb-6 text-center">
                    Found {filteredPosts.length} results for "{query}"
                </p>
            )}
            <PostList posts={filteredPosts} />
        </div>
      </div>
    </main>
  )
}
