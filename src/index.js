import fs from "fs";
import { promises as fsPromises } from "fs";
import matter from "gray-matter";
import path from "path";
import { glob } from "glob";
import { marked } from "marked";
import { mkdirp } from "mkdirp";

const readFile = (filename) => {
  const rawFile = fs.readFileSync(filename, "utf8");
  const parsed = matter(rawFile);
  const html = marked(parsed.content);

  return { ...parsed, html };
};

const templatize = (
  template,
  { categories, title, summary, date, tags, thumbnail, content }
) =>
  template
    .replace(/<!-- CATEGORY -->/g, categories)
    .replace(/<!-- TITLE -->/g, title)
    .replace(/<!-- SUMMARY -->/g, summary)
    .replace(/<!-- PUBLISH_DATE -->/g, date)
    // .replace(/<!-- TAG -->/g, tags)
    // .replace(/<!-- THUMBNAIL -->/g, thumbnail)
    .replace(/<!-- CONTENT -->/g, content);

const saveFile = (filename, contents) => {
  const dir = path.dirname(filename);
  mkdirp.sync(dir);
  fs.writeFileSync(filename, contents);
};

const getOutputFilename = (filename, outPath) => {
  const basename = path.basename(filename);
  const newfilename =
    basename === "_index.md"
      ? "index.html"
      : basename.substring(11, basename.length - 3) + ".html";
  const outfile = path.join(outPath, newfilename);
  return outfile;
};

const processFile = (filename, template, outPath) => {
  const file = readFile(filename);
  const outfilename = getOutputFilename(filename, outPath);

  const templatized = templatize(template, {
    categories: file.data.categories,
    title: file.data.title,
    summary: file.data.summary,
    date: file.data.date,
    tags: file.data.tags,
    thumbnail: file.data.thumbnail,
    content: file.html,
  });

  saveFile(outfilename, templatized);
  console.log(`📝 ${outfilename}`);
};

async function copyStaticFiles(files) {
  try {
    await Promise.all(
      files.map(async ({ source, destination }) => {
        // 복사할 디렉터리 존재 여부 확인 후 생성
        const dir = path.dirname(destination);
        mkdirp.sync(dir);

        // 파일 복사
        await fsPromises.copyFile(source, destination);
        console.log(`복사 성공: ${source} → ${destination}`);
      })
    );
    console.log("모든 파일 복사가 완료되었습니다!");
  } catch (err) {
    console.error("파일 복사 중 오류 발생:", err);
  }
}

async function copyDirectory(source, destination) {
  try {
    const files = await fsPromises.readdir(source, { withFileTypes: true });

    // 디렉터리 생성
    await mkdirp(destination); // mkdirp 사용하여 디렉터리 생성

    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.join(source, file.name);
        const destPath = path.join(destination, file.name);

        if (file.isDirectory()) {
          // 하위 디렉터리 복사
          await copyDirectory(srcPath, destPath);
        } else {
          // 파일 복사
          await fsPromises.copyFile(srcPath, destPath);
          console.log(`파일 복사: ${srcPath} → ${destPath}`);
        }
      })
    );
    console.log("디렉터리 및 모든 파일 복사 완료!");
  } catch (err) {
    console.error("디렉터리 복사 중 오류 발생:", err);
  }
}

const main = () => {
  const staticFiles = [
    { source: "./src/tailwind.css", destination: "./build/src/tailwind.css" },
    { source: "./src/app.js", destination: "./build/src/app.js" },
  ];

  copyStaticFiles(staticFiles);
  copyDirectory("./src", "./build/src");
  copyDirectory("./asset", "./build/asset");

  const contentPath = path.resolve("content");
  const contentPostsPath = path.join(contentPath, "posts");
  const templatePath = path.resolve("template");
  const outPath = path.resolve("build");
  const outPostsPath = path.join(outPath, "posts");

  // read template
  const template = fs.readFileSync(
    path.join(templatePath, "template.html"),
    "utf8"
  );

  // index.html
  processFile(path.join(contentPath, "_index.md"), template, outPath);

  // posts
  const filenames = glob
    .sync(contentPostsPath + "/*.md")
    .filter((filename) => !filename.includes("_index.md"));

  // posts/index.html
  processFile(path.join(contentPostsPath, "_index.md"), template, outPostsPath);

  // posts/title.html
  filenames.forEach((filename) => {
    processFile(filename, template, outPostsPath);
  });
};

main();
