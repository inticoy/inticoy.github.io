---
emoji: 👨🏻‍💻
title: "About me"
description: "Introducing Inticoy."
date: 2023-01-20 14:00:00
author: "Inticoy"
categories: "About"
thumbnail: "/path/to/thumbnail.jpg"
---

## 안녕하세요, 윤건우입니다.

> 안녕하세요.대단히 반갑습니다. 상당히 고맙습니다.

---

## Achievements

### 2024

- ‘22-’24 42 Seoul Cadet 7th 활동

### 2023

- 2023 메타버스 개발자 경진대회 퀄컴 부문 우수상

### 2022

- 서울대병원 주최 Sleep AI Challenge ver.3 2위

### 2021

- IT 커뮤니티 연합 해커톤 UNITHON 8회 특별상
- 한양대학교 앱개발 동아리 EOS 학술제 대상

---

## Education

- 한양대학교 컴퓨터소프트웨어학부 (2019.03 - 현재)

```js
export const StandardPage = async ({ path }) => {
  let matter;

  switch (path) {
    case "/":
      matter = getHome();
      break;
    case "/about":
      matter = getAbout();
      break;
    case "/posts":
      matter = getPosts();
      break;
    case "/projects":
      matter = getProjects();
      break;
    default:
      notFound();
  }
```

$r$ : Number base

$M$ : Information Quantity

$n$ : Number of digits ($n=\log_r M$)

$C_r$ : Circuit cost per digit ($C_r = k \cdot r$ 가정)

$C$ : Total circuit cost

$$
\begin{array}{rcl}
C & = & C_r \cdot n \\
 & = & k \cdot r \cdot \log_r M \\
 & = & k \cdot \ln M \cdot \frac{r}{\ln r}
\end{array}
$$

C의 최소값을 찾기 위해서 미분하여 0이 되는 지점을 찾으면,

$$
\frac{dC}{dr} = k \cdot \ln M \cdot \frac{\ln r - 1}{(\ln r)^2}
$$
