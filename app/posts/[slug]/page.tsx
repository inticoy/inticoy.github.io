import React from 'react'
import { getAllPosts, getPostBySlug, notion, NOTION_ROOT_PAGE_ID } from '@/lib/notion'
import { NotionRenderer } from '@/components/posts/notion-renderer'
import { notFound } from 'next/navigation'
import { SSR } from '@phosphor-icons/react'
const { ArrowLeft, CalendarBlank, Tag } = SSR
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const dynamicParams = false;

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch recordMap from Notion API
  // In a real scenario, we would use the post.id to fetch the page content
  // For now, using a placeholder or the root page ID if specific ID not available in mock
  let recordMap;
  try {
    // TODO: Use actual post ID when real data fetching is implemented
    // recordMap = await notion.getPage(post.id); 
    
    // Fallback for mock data to show *something* (using root page or a known public page)
    // This is just for demonstration if we don't have real IDs yet.
    // If we want to test the renderer, we need a valid public Notion page ID.
    // Let's assume the mock post IDs are NOT valid Notion IDs yet.
    // We will skip fetching real content if ID is '1' or '2' and show a placeholder message or empty map.
    
    if (post.id.length > 10) {
         recordMap = await notion.getPage(post.id);
    } else {
        // Mock recordMap or handle gracefully
        // For now, let's try to fetch the root page just to see the renderer working, 
        // OR just return null and handle it in renderer.
        // Let's try fetching the root page ID defined in lib/notion.ts
        recordMap = await notion.getPage(NOTION_ROOT_PAGE_ID);
    }

  } catch (error) {
    console.error('Failed to fetch notion page', error);
    // Handle error or show fallback
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <article className="max-w-4xl mx-auto p-8 md:p-24">
        <Link 
          href="/posts" 
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to posts
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="uppercase tracking-wider">
              {post.category}
            </Badge>
            {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-neutral-500">
                    #{tag}
                </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm">
            <CalendarBlank className="w-4 h-4 mr-2" weight="fill" />
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          {recordMap ? (
            <NotionRenderer recordMap={recordMap} />
          ) : (
            <div className="p-8 border border-dashed rounded-lg text-center text-neutral-500">
              <p>Content could not be loaded (Mock ID used).</p>
            </div>
          )}
        </div>
      </article>
    </main>
  )
}
