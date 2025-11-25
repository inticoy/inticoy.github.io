"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react'
import { getAllPosts } from '@/lib/notion'
import type { Post } from '@/lib/notion'
import './command-menu.css'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Load posts when menu opens
  useEffect(() => {
    if (open && posts.length === 0) {
      setLoading(true)
      getAllPosts().then((data) => {
        setPosts(data)
        setLoading(false)
      })
    }
  }, [open, posts.length])

  // Keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="command-dialog"
    >
      <div className="command-dialog-content">
        <div className="command-input-wrapper">
          <MagnifyingGlass className="command-search-icon" weight="bold" />
          <Command.Input 
            placeholder="Search posts..." 
            className="command-input"
          />
        </div>
        <Command.List className="command-list">
          <Command.Empty className="command-empty">
            {loading ? 'Loading...' : 'No results found.'}
          </Command.Empty>

          <Command.Group heading="Posts" className="command-group">
            {posts.map((post) => (
              <Command.Item
                key={post.id}
                value={`${post.title} ${post.summary} ${post.tags.join(' ')}`}
                onSelect={() => {
                  router.push(`/posts/${post.slug}`)
                  setOpen(false)
                }}
                className="command-item"
              >
                <div className="command-item-content">
                  <div className="command-item-header">
                    <span className="command-item-title">{post.title}</span>
                    <span className="command-item-category">{post.category.toUpperCase()}</span>
                  </div>
                  {post.summary && (
                    <p className="command-item-summary">{post.summary}</p>
                  )}
                </div>
                <ArrowRight className="command-item-icon" weight="bold" />
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        <div className="command-footer">
          <span className="command-footer-hint">
            <kbd>↑↓</kbd> Navigate <kbd>↵</kbd> Select <kbd>esc</kbd> Close
          </span>
        </div>
      </div>
    </Command.Dialog>
  )
}
