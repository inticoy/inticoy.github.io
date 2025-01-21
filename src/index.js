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

  // {
  //   content: "This is the body content of the article.",
  //   data: { title: "My Article", date: "2025-01-01" },
  //   isEmpty: false,
  //   excerpt: "",
  //   html: "<p>This is the body content of the article.</p>"
  // }
  return { ...parsed, html };
};

const saveFile = (filename, contents) => {
  const dir = path.dirname(filename);
  mkdirp.sync(dir);
  fs.writeFileSync(filename, contents);
};

const templatize = (
  template,
  { emoji, title, categories, summary, date, tags, thumbnail, content }
) =>
  template
    .replace(/<!-- EMOJI -->/g, emoji)
    .replace(/<!-- TITLE -->/g, title)
    .replace(/<!-- CATEGORY -->/g, categories)
    // .replace(/<!-- SUMMARY -->/g, summary)
    .replace(/<!-- PUBLISH_DATE -->/g, date)
    // .replace(/<!-- TAG -->/g, tags)
    // .replace(/<!-- THUMBNAIL -->/g, thumbnail)
    .replace(/<!-- CONTENT -->/g, content);

const getOutputFilename = (filename, outPath) => {
  const basename = path.basename(filename);
  var newfilename;
  switch (basename) {
    case "_index.md":
      newfilename = "index.html";
      break;
    case "404.md":
      newfilename = "404.html";
      break;
    default:
      newfilename = basename.substring(11, basename.length - 3) + ".html";
      break;
  }
  const outfile = path.join(outPath, newfilename);
  return outfile;
};

const processFile = (filename, template, outPath) => {
  const file = readFile(filename);
  const outfilename = getOutputFilename(filename, outPath);

  // date: new Date(file.data.date).toISOString().split("T")[0],
  const templatized = templatize(template, {
    emoji: file.data.emoji,
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

const generatePostIndex = (filenames, template, outPath) => {
  // 목록 생성
  const postLinks = filenames.map((filename) => {
    const { data } = readFile(filename); // 파일에서 메타데이터 읽기
    const emoji = data.emoji || "🗒️";
    const title = data.title || "Untitled"; // 제목이 없으면 기본값 사용
    const summary = data.summary || "No summary available."; // 요약이 없으면 기본값 사용
    const date = data.date || "Unknown Date"; // 날짜가 없으면 기본값 사용
    const categories = data.categories || "Uncategorized"; // 카테고리가 없으면 기본값 사용
    const url = "./" + path.basename(getOutputFilename(filename, outPath)); // 파일 경로 생성

    // HTML 항목 생성
    return `
      <div class="flex flex-col cursor-pointer" onclick="location.href ='${url}'">
          <div class="text-sm font-semibold">${categories}</div>
          <div class="text-md font-bold">${emoji} ${title}</div>
          <div class="text-md">${summary}</div>
          <div class="text-sm">${
            new Date(date).toISOString().split("T")[0]
          }</div>
      </div>
    `;
  });

  // 목록 HTML로 병합
  const listHtml = `<div class="flex flex-col space-y-12">${postLinks.join(
    "\n"
  )}</div>`;

  // 템플릿에 삽입
  const templatized = templatize(template, {
    emoji: "📚",
    categories: "Posts",
    title: "Posts Index",
    summary: "List of all posts",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    thumbnail: "",
    content: listHtml,
  });

  // 파일 저장
  saveFile(path.join(outPath, "index.html"), templatized);
  console.log(`📂 Index file created at: ${path.join(outPath, "index.html")}`);
};

const main = () => {
  const staticFiles = [
    { source: "./src/tailwind.css", destination: "./build/src/tailwind.css" },
    { source: "./src/app.js", destination: "./build/src/app.js" },
  ];

  copyStaticFiles(staticFiles);
  copyDirectory("./src", "./build/src");
  copyDirectory("./asset", "./build/asset");

  const contentPath = path.resolve("content");
  const contentAboutPath = path.join(contentPath, "about");
  const contentPostsPath = path.join(contentPath, "posts");
  const templatePath = path.resolve("template");
  const outPath = path.resolve("build");
  const outAboutPath = path.join(outPath, "about");
  const outPostsPath = path.join(outPath, "posts");

  // read template
  const template = fs.readFileSync(
    path.join(templatePath, "template.html"),
    "utf8"
  );

  // index.html
  processFile(path.join(contentPath, "_index.md"), template, outPath);

  // 404.html
  processFile(path.join(contentPath, "404.md"), template, outPath);

  // about/index.html
  processFile(path.join(contentAboutPath, "_index.md"), template, outAboutPath);

  // posts
  const filenames = glob
    .sync(contentPostsPath + "/*.md")
    .filter((filename) => !filename.includes("_index.md"));

  // posts/index.html
  generatePostIndex(filenames, template, outPostsPath);

  // posts/title.html
  filenames.forEach((filename) => {
    processFile(filename, template, outPostsPath);
  });
};

main();
