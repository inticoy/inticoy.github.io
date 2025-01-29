import Link from "next/link";
import { getBlogPosts } from "@/app/utils/markdown";

export function BlogPosts() {
  const posts = getBlogPosts();

  return (
    <div className="space-y-8">
      {posts
        .sort((a, b) => {
          return new Date(b.metadata.date) - new Date(a.metadata.date);
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col no-underline text-inherit"
            href={`/posts/${post.slug}`}
          >
            <div className="flex flex-col cursor-pointer">
              <div className="text-sm font-semibold">
                {post.metadata.categories}
              </div>
              <div className="text-md font-bold">
                {post.metadata.emoji} {post.metadata.title}
              </div>
              {/* <div class="text-md">${summary}</div> */}
              <div className="text-sm">{post.metadata.date.split(" ")[0]}</div>
            </div>
          </Link>
        ))}
    </div>
  );
}
