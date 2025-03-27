import fs from "fs";
import path from "path";
import matter from "gray-matter";

const HOME_DIR = path.join(process.cwd(), "content");
const ABOUT_DIR = path.join(process.cwd(), "content", "about");
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function getPostSlugs() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((folder) =>
      fs.statSync(path.join(POSTS_DIR, folder)).isDirectory()
    );
}

function readPost(slug) {
  const postDir = path.join(POSTS_DIR, slug);
  const filePath = path.join(postDir, "index.md");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data: metadata, content } = matter(rawContent);

  const images = fs
    .readdirSync(postDir)
    .filter((file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
    .map((img) => `/posts/${slug}/${img}`); // ✅ 이미지 경로를 상대 경로로 변환

  return {
    slug,
    metadata: {
      ...metadata,
      images,
    },
    content,
  };
}

export function getBlogPosts() {
  return getPostSlugs()
    .map((slug) => readPost(slug))
    .filter(Boolean);
}

export function getIndex(dir) {
  const filePath = path.join(dir, "index.md");
  const rawContent = fs.readFileSync(filePath, "utf-8");

  const { data: metadata, content } = matter(rawContent);

  const images = fs
    .readdirSync(ABOUT_DIR)
    .filter((file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
    .map((img) => `/about/${img}`); // ✅ 이미지 경로를 상대 경로로 변환

  return {
    metadata: {
      ...metadata,
      images,
    },
    content,
  };
}

export function getHome() {
  return getIndex(HOME_DIR);
}

export function getAbout() {
  return getIndex(ABOUT_DIR);
}

export function getPosts() {
  return getIndex(POSTS_DIR);
}

export function getProjects() {
  return getIndex(PROJECTS_DIR);
}
