import React from 'react'
import { getAboutContent } from '@/lib/notion'
import { NotionRenderer } from '@/components/posts/notion-renderer'

export default async function AboutPage() {
  const aboutPost = await getAboutContent();

  return (
    <main className="min-h-screen bg-background">
      <article className="">
        {aboutPost ? (
          <>
            <div className="w-full">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {aboutPost.recordMap ? (
                  <NotionRenderer recordMap={aboutPost.recordMap} fullPage />
                ) : (
                  <p className="text-neutral-500">About content could not be loaded.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <section className="mx-auto w-full max-w-3xl mb-16">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">About Me</h1>
            <p className="text-lg text-card-foreground leading-relaxed mb-6">
              Hello! I'm Inticoy, a developer who loves building things that live on the web.
              I have a strong background in backend development but I'm increasingly drawn to the creative possibilities of the frontend and design engineering.
            </p>
            <p className="text-lg text-card-foreground leading-relaxed">
              This archive is my digital garden—a place to document my learning, projects, and thoughts without the pressure of perfection.
            </p>
          </section>
        )}
      </article>
    </main>
  )
}
