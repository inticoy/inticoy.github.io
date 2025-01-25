import fs from "fs";
import { mkdirp } from "mkdirp";
import path from "path";
import { promises as fsPromises } from "fs";
import matter from "gray-matter";
import { marked } from "marked";

export function readFile(filename) {
  const rawFile = fs.readFileSync(filename, "utf8");
  const parsed = matter(rawFile); // YAML frontmatter 파싱
  const html = marked(parsed.content); // Markdown -> HTML 변환
  return { ...parsed, html };
}

export function saveFile(filename, contents) {
  const dir = path.dirname(filename);
  mkdirp.sync(dir);
  fs.writeFileSync(filename, contents);
}

export async function copyDirectory(source, destination) {
  try {
    const files = await fsPromises.readdir(source, { withFileTypes: true });
    await mkdirp(destination);

    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.join(source, file.name);
        const destPath = path.join(destination, file.name);

        if (file.isDirectory()) {
          await copyDirectory(srcPath, destPath);
        } else {
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
