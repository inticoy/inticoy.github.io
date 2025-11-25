"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/lib/notion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarBlank, Tag } from '@phosphor-icons/react'

interface PostCardProps {
  post: Post
}

// Generate a consistent random gradient based on post ID
const getGradientForPost = (id: string) => {
  const gradients = [
    'from-blue-400 to-purple-500',
    'from-green-400 to-cyan-500',
    'from-pink-400 to-rose-500',
    'from-orange-400 to-red-500',
    'from-indigo-400 to-blue-500',
    'from-teal-400 to-green-500',
    'from-purple-400 to-pink-500',
    'from-amber-400 to-orange-500',
  ]

  // Simple hash function to get consistent index
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
    hash = hash & hash
  }

  return gradients[Math.abs(hash) % gradients.length]
}

export const PostCard = ({ post }: PostCardProps) => {
  const gradient = getGradientForPost(post.id)

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <Card className="h-full overflow-hidden transition-all duration-200 border-border bg-card flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <div className="text-white text-6xl font-bold opacity-20">
                {post.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs uppercase tracking-wider font-medium">
              {post.category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarBlank className="w-3.5 h-3.5 mr-1" weight="fill" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>
          <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.summary || 'No summary available'}
          </p>
        </CardContent>
        <CardFooter className="p-4 md:p-6 pt-0 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <div key={tag} className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <Tag className="w-3 h-3 mr-1" weight="fill" />
              {tag}
            </div>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
