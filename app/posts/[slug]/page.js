import { notFound } from "next/navigation";
import { getBlogPosts } from "@/app/utils/markdown";
import { MDXRemote } from "next-mdx-remote/rsc";

const baseUrl = "https://inticoy.github.io";

export default async function Page({ params }) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) notFound();

  return (
    <section className="flex flex-col space-y-16">
      <header>
        <div>
          <div className="flex flex-col">
            <span className="text-7xl m-0 mt-[-0.5em]">
              {post.metadata.emoji}
            </span>
            <p className="text-md  m-0 mt-8 font-semibold">
              {post.metadata.categories}
            </p>
            <p className="text-4xl m-0 mt-4 font-extrabold">
              {post.metadata.title}
            </p>
            <p className="text-sm m-0 mt-4">{post.metadata.tags}</p>
            <p className="text-sm m-0 mt-4">{post.metadata.date}</p>
          </div>
        </div>
      </header>
      <article className="prose dark:prose-invert max-w-none">
        <MDXRemote source={post.content}></MDXRemote>
      </article>
    </section>
  );
}

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) return;

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  const ogImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/posts/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const dynamicParams = false;
