const fs = require("fs");
const path = require("path");
const readline = require("readline");

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0"); // 1월이 0이므로 +1
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("📌 새 글의 제목을 입력하세요: ", (title) => {
  if (!title.trim()) {
    console.log("❌ 제목이 필요합니다.");
    rl.close();
    return;
  }

  const dirName = title.trim().toLowerCase().replace(/\s+/g, "-");
  const dirPath = path.join(__dirname, "..", "content", "posts", dirName);

  fs.mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, "index.md");

  const template = `---
emoji: ✍🏻
title: "${title}"
description: "description"
date: "${year}-${month}-${day} ${hours}:${minutes}:${seconds}"
author: 윤건우
categories: Develop
tags: 
thumbnail: "/path/to/thumbnail.jpg"
---

여기에 본문을 작성하세요.
`;

  fs.writeFileSync(filePath, template, "utf8");
  console.log(`✅ 새 글이 생성되었습니다: ${filePath}`);

  rl.close();
});
