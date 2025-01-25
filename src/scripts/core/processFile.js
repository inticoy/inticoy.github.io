import { readFile, saveFile } from "../utils/fileUtils.js";
import { getOutputFilename } from "./getOutputFilename.js";
import { templatize } from "../utils/templatize.js";

export function processFile(filename, template, outPath) {
  // 1. 파일 읽어서 Markdown + FrontMatter 파싱
  const file = readFile(filename);

  // 2. 아웃풋 파일명 결정
  const outfilename = getOutputFilename(filename, outPath);

  // 3. 템플릿 치환
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

  // 4. 파일 저장
  saveFile(outfilename, templatized);
  console.log(`📝 ${outfilename}`);
}
