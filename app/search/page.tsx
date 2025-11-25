"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Post } from '@/lib/notion'
import { PostList } from '@/components/posts/post-list'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { getAllPosts } from '@/lib/notion' // Note: This won't work directly in client component if it calls Node APIs. 
// For static export search, we usually need to fetch a search index JSON or pass data from a parent server component.
// Since this is a page, we can't easily pass props from server to it if it's a client component page.
// Better approach: Make the page a Server Component that fetches all posts, then passes them to a Client Search Component.

export default function SearchPage() {
    // This is a client component placeholder. 
    // We will refactor this to be a Server Component that passes data to a client SearchInterface.
    return (
        <SearchInterfaceWrapper />
    )
}

function SearchInterfaceWrapper() {
    // In a real app, we'd fetch the search index here.
    // For this v1 with mock data, we can just import the mock data if it was in a shared pure JS file, 
    // but getAllPosts is async and might be server-only.
    // Let's assume we fetch from an API route or just use a hardcoded list for now to demonstrate UI.
    
    // MOCK DATA for client side search demo
    const [posts, setPosts] = useState<Post[]>([])
    
    useEffect(() => {
        // Simulate fetching
        const mockPosts: Post[] = [
            {
                id: '1',
                title: 'Hello World',
                slug: 'hello-world',
                status: 'Published',
                category: 'writing',
                tags: ['dev', 'nextjs'],
                summary: 'This is a sample post.',
                publishedAt: new Date().toISOString(),
            },
            {
                id: '2',
                title: 'My Side Project',
                slug: 'my-side-project',
                status: 'Published',
                category: 'project',
                tags: ['project', 'web'],
                summary: 'A cool project I built.',
                publishedAt: new Date().toISOString(),
            }
        ]
        setPosts(mockPosts)
    }, [])

    return <SearchInterface posts={posts} />
}

interface SearchInterfaceProps {
    posts: Post[]
}

function SearchInterface({ posts }: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  
  const filteredPosts = posts.filter(post => {
    const searchContent = `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLowerCase()
    return searchContent.includes(query.toLowerCase())
  })

  return (
    <main className="min-h-screen p-8 md:p-24 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6 text-foreground">Search</h1>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" weight="bold" />
            <Input
              type="text"
              placeholder="Search posts..."
              className="pl-10 h-12 text-lg bg-card"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-8">
            {query && (
                <p className="text-sm text-muted-foreground mb-4">
                    Found {filteredPosts.length} results for "{query}"
                </p>
            )}
            <PostList posts={filteredPosts} />
        </div>
      </div>
    </main>
  )
}
