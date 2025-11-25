import React from 'react'
import { Post } from '@/lib/notion'
import { PostCard } from './post-card'

interface PostListProps {
  posts: Post[]
}

export const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 dark:text-neutral-400">No posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
