"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/lib/notion'
import { CalendarBlank } from '@phosphor-icons/react'

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
      <div className="flex flex-col gap-3">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-muted">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-lg font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {/* Category */}
            <span className="font-medium text-foreground/80 capitalize">
              {post.category}
            </span>

            <span className="text-muted-foreground/30">•</span>

            {/* Date */}
            <div className="flex items-center">
              <CalendarBlank className="w-3.5 h-3.5 mr-1" weight="fill" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags.slice(0, 3).map((tag) => (
                <div key={tag} className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <span className="opacity-50 mr-0.5">#</span>
                  {tag}
                </div>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
