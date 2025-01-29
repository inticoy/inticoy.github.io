import { BlogPosts } from "../components/layout/BlogPosts";
import { StandardPage } from "../components/layout/StandardPage";

export const metadata = {
  title: "Blog Posts",
  description: "Explore my lastest blog posts.",
};

export default function Page() {
  return (
    <>
      <StandardPage path="/posts" />
      <BlogPosts />
    </>
  );
}
