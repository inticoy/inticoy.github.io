import { MDXRemote } from "next-mdx-remote/rsc";
import { getAbout, getHome, getPosts, getProjects } from "@/app/utils/markdown";
import { notFound } from "next/navigation";

export const StandardPage = async ({ path }) => {
  let matter;

  switch (path) {
    case "/":
      matter = getHome();
      break;
    case "/about":
      matter = getAbout();
      break;
    case "/posts":
      matter = getPosts();
      break;
    case "/projects":
      matter = getProjects();
      break;
    default:
      notFound();
  }

  return (
    <section className="flex flex-col space-y-16">
      <header>
        <div>
          <div className="flex flex-col">
            <span className="text-7xl m-0 mt-[-0.5em]">
              {matter.metadata.emoji}
            </span>
            <p className="text-4xl m-0 mt-8 font-extrabold">
              {matter.metadata.title}
            </p>
            <p className="text-sm m-0 mt-4">{matter.metadata.description}</p>
          </div>
        </div>
      </header>
      <article className="prose dark:prose-invert max-w-none">
        <MDXRemote source={matter.content}></MDXRemote>
      </article>
    </section>
  );
};
