import fs from "fs";
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

const templatize = (template, { date, title, content }) =>
  template
    .replace(/<!-- PUBLISH_DATE -->/g, date)
    .replace(/<!-- TITLE -->/g, title)
    .replace(/<!-- CONTENT -->/g, content);

const saveFile = (filename, contents) => {
  const dir = path.dirname(filename);
  mkdirp.sync(dir);
  fs.writeFileSync(filename, contents);
};

const getOutputFilename = (filename, outPath) => {
  const basename = path.basename(filename);
  const newfilename = basename.substring(0, basename.length - 3) + ".html";
  const outfile = path.join(outPath, newfilename);
  return outfile;
};

const processFile = (filename, template, outPath) => {
  const file = readFile(filename);
  const outfilename = getOutputFilename(filename, outPath);

  const templatized = templatize(template, {
    date: file.data.date,
    title: file.data.title,
    content: file.html,
  });

  saveFile(outfilename, templatized);
  console.log(`📝 ${outfilename}`);
};

const main = () => {
  const contentPath = path.resolve("content");
  const blogPath = path.join(contentPath, "blog");

  const templatePath = path.resolve("template");
  const outPath = path.resolve("posts");
  // const template = fs.readFileSync(path.join(srcPath, "template.html"), "utf8");
  const template = fs.readFileSync(
    path.join(templatePath, "template.html"),
    "utf8"
  );

  const filenames = glob.sync(blogPath + "/*.md");

  filenames.forEach((filename) => {
    processFile(filename, template, outPath);
  });
};

main();
