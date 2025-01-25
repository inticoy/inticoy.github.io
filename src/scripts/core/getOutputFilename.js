import path from "path";

export function getOutputFilename(filename, outPath) {
  const basename = path.basename(filename);
  let newfilename;

  switch (basename) {
    case "_index.md":
      newfilename = "index.html";
      break;
    case "404.md":
      newfilename = "404.html";
      break;
    default:
      // "YYYY-MM-DD-something.md" 형태에서 "something.html" 로 변환하는 예시
      newfilename = basename.substring(11, basename.length - 3) + ".html";
      break;
  }

  return path.join(outPath, newfilename);
}
