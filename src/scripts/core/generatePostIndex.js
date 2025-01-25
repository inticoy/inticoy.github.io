import path from "path";
import { readFile } from "../utils/fileUtils.js";
import { templatize } from "../utils/templatize.js";
import { getOutputFilename } from "./getOutputFilename.js";
import { saveFile } from "../utils/fileUtils.js";

export function generatePostIndex(filenames, template, outPath) {
  // 1. 목록 HTML 생성
  const postLinks = filenames.map((filename) => {
    const { data } = readFile(filename);
    const emoji = data.emoji || "🗒️";
    const title = data.title || "Untitled";
    const summary = data.summary || "No summary available.";
    const date = data.date || "Unknown Date";
    const categories = data.categories || "Uncategorized";

    const url = "./" + path.basename(getOutputFilename(filename, outPath));
    return `
      <div class="flex flex-col cursor-pointer" onclick="location.href='${url}'">
        <div class="text-sm font-semibold">${categories}</div>
        <div class="text-md font-bold">${emoji} ${title}</div>
        <div class="text-md">${summary}</div>
        <div class="text-sm">${new Date(date).toISOString().split("T")[0]}</div>
      </div>
    `;
  });

  // 2. 템플릿에 삽입
  const listHtml = `<div class="flex flex-col space-y-12">${postLinks.join(
    "\n"
  )}</div>`;
  const finalHtml = templatize(template, {
    emoji: "📚",
    categories: "Posts",
    title: "Posts",
    date: filenames.length,
    content: listHtml,
    summary: "",
    tags: "",
    thumbnail: "",
  });

  // 3. 파일 저장
  const outFile = path.join(outPath, "index.html");
  saveFile(outFile, finalHtml);
  console.log(`📂 Index file created at: ${outFile}`);
}
