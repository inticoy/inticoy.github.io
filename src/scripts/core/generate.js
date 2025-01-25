import fs from "fs";
import path from "path";
import { glob } from "glob";
import { processFile } from "./processFile.js";
import { generatePostIndex } from "./generatePostIndex.js";

export function generateAllPages() {
  // 1. 템플릿 읽기
  const templatePath = path.resolve("src/template/template.html");
  const template = fs.readFileSync(templatePath, "utf8");

  // 2. 경로 설정
  const contentPath = path.resolve("content");
  const contentAboutPath = path.join(contentPath, "about");
  const contentPostsPath = path.join(contentPath, "posts");

  const outPath = path.resolve("build");
  const outAboutPath = path.join(outPath, "about");
  const outPostsPath = path.join(outPath, "posts");

  // 3. 메인 index.html
  processFile(path.join(contentPath, "_index.md"), template, outPath);

  // 4. 404.html
  processFile(path.join(contentPath, "404.md"), template, outPath);

  // 5. about/index.html
  processFile(path.join(contentAboutPath, "_index.md"), template, outAboutPath);

  // 6. posts/*.md
  const filenames = glob
    .sync(`${contentPostsPath}/*.md`)
    .filter((filename) => !filename.includes("_index.md"));

  // 7. posts/index.html
  generatePostIndex(filenames, template, outPostsPath);

  // 8. posts/title.html
  filenames.forEach((filename) => {
    processFile(filename, template, outPostsPath);
  });
}
