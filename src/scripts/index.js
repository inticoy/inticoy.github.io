import { copyDirectory } from "./utils/fileUtils.js";
import { generateAllPages } from "./core/generate.js";

async function main() {
  try {
    // 1. 정적 파일 복사
    await copyDirectory("./public", "./build");

    // 2. 전체 페이지 생성
    generateAllPages();
  } catch (err) {
    console.error("SSG 빌드 오류 발생:", err);
    process.exit(1); // 빌드 실패 시 종료
  }
}

main();
