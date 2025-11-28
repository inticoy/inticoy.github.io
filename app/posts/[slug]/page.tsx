import React from 'react'
import { getAllPosts, getPostBySlug } from '@/lib/notion'
import { NotionRenderer } from '@/components/posts/notion-renderer'
import { notFound } from 'next/navigation'

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
  params: { slug: string }
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="">
        {post.recordMap ? (
          <div className="w-full">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <NotionRenderer recordMap={post.recordMap} fullPage post={post} />
            </div>
          </div>
        ) : (
          <section className="mx-auto w-full max-w-3xl mb-16">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">{post.title}</h1>
            <p className="text-lg text-card-foreground leading-relaxed">
              Post content could not be loaded.
            </p>
          </section>
        )}
      </article>
    </main>
  )
}
