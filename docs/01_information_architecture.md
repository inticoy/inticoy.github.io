# Information Architecture

이 문서는 블로그의 정보 구조, 라우팅, 섹션 역할, 화면 간 동선을 정의한다.  
데이터 스키마(Notion DB 등)는 별도 문서 `02_content_model.md`에서 다룬다.

---

## 1. Top-level Sections & Routes

### 1.1 Sections

- **Home** – `/`
- **Posts**
  - List: `/posts`
  - Detail: `/posts/[slug]`
- **About** – `/about`
- **Search** – `/search` (또는 전역 search overlay에서 진입)

### 1.2 Principles

- 글(콘텐츠)의 **주제(topic)** 가 아니라,  
  **형태/코너(form)** 기준으로 섹션/카테고리를 나눈다.
- dev / product / design / blockchain 같은 주제는 **Tag**로만 다루고,  
  섹션/카테고리는 “이 글을 어디 선반에 꽂을지”만 결정한다.
- Desktop에서는 풍부한 레이아웃과 인터랙션,  
  Mobile에서는 **간편함 + 가독성**을 우선한다.

---

## 2. Categories & Tags (Conceptual)

### 2.1 Category (coarse-grain “corner”)

카테고리는 **Posts 섹션 안에서의 코너/형태**를 나타낸다.  
한 글당 **category는 정확히 하나**를 갖는다.

v1 Category set:

- **`writing`**
  - 어느 정도 정리된 글 전반
  - dev, product, design, meta 등 주제와 무관하게 “글”이면 여기로 들어온다.
- **`project`**
  - 사이드 프로젝트, 개인 서비스, 실험적인 앱 등 **프로젝트 중심** 글
  - 소개, 설계, 회고, 런칭 후기 등
- **`note`**
  - 짧은 메모, 로그, 아이디어 조각
  - 길이 짧고 덜 정제된 글
- **`life`**
  - 일상/경험/감정/커리어 등 “삶”에 가까운 글
- **`about`**
  - `/about` 페이지용 특수 카테고리
  - 일반 `/posts` 리스트에는 기본적으로 노출하지 않는다.

### 2.2 Tag (fine-grain “topic”)

Tag는 글의 **주제/도메인/기술/프로젝트 이름**을 표현한다.

- 예시:
  - `dev`, `backend`, `architecture`, `product`, `design`
  - `nextjs`, `typescript`, `tailwind`, `threejs`
  - 특정 프로젝트 이름: `my-blog`, `habit-tracker`, `casual-game`
  - `career`, `work`, `study`, `life`, `meta`
- 한 글당 Tag는 여러 개 (3–6개 정도 권장).
- 네이밍 규칙:
  - 소문자
  - 필요시 `kebab-case` (`tailwind-css`, `job-hunting` 등)

### 2.3 Category × Tag 예시

- 프로젝트 포스트모템
  - category: `project`
  - tags: `dev`, `web`, `frontend`, `my-side-project`
- 서비스 설계/아키텍처 글
  - category: `writing`
  - tags: `dev`, `backend`, `architecture`, `product-thinking`
- 짧은 메모
  - category: `note`
  - tags: `meta`, `life`, `dev`
- 커리어/일하는 방식에 대한 글
  - category: `life` 또는 `writing`
  - tags: `career`, `work`, `reflection`

---

## 3. Home (`/`) – Personal Desktop

### 3.1 Role

- 블로그/아카이브의 **표지 페이지**이자 “Personal Desktop/Bento”.
- 방문자가 3초 안에 다음을 이해할 수 있어야 한다.
  - 이 사람이 어떤 분야에서 일하거나 활동하는지
  - 어떤 종류의 프로젝트/글을 만드는지
  - 어떤 분위기/취향을 가진 사람인지

### 3.2 Layout

- **Desktop**
  - Draggable Bento-style grid
  - 카드마다 subtle 3D tilt, hover spotlight, drop 느낌 인터랙션  
    (상세 인터랙션은 Design 문서에서 정의)
- **Mobile**
  - 드래그 없이 **위→아래 스택형 레이아웃**
  - 필요시 1~2열 간단 grid, 카드 크기는 축소

### 3.3 Cards

v1 기준 Home에 배치할 카드들:

- **Profile Card**
  - 짧은 한 줄 소개  
    (예: “Backend-leaning developer who loves playful web & AI experiments.”)
  - 프로필 이미지
  - `View more → /about`

- **Posts Card**
  - 최신 posts 1–3개
  - 각 항목: title + date (+ optional category)
  - `See all posts → /posts`

- **Projects Card**
  - category = `project` 중 대표 프로젝트 몇 개
  - 제목 + 한 줄 설명
  - `View all → /posts?category=project`

- **Links / SNS Card**
  - GitHub, LinkedIn, Email 등 외부 링크

- **Search Card**
  - 간단한 search input 또는 search 버튼
  - 동작: `/search`로 이동하거나 전역 search overlay 호출

- **Theme Card**
  - Dark/Light 모드 토글
  - 1/2 사이즈 정사각형 카드로 배치하여 playful한 느낌 유지

---

## 4. Posts

### 4.1 Routes

- List: `/posts`
- Detail: `/posts/[slug]`

연도나 카테고리를 URL path에 넣지 않는다.  
연도/카테고리별 뷰는 query param 또는 별도 archive route로 처리한다.

예:

- `/posts?category=project`
- `/posts?tag=dev`
- `/posts?year=2025` (향후 확장)

### 4.2 List Page (`/posts`)

#### 4.2.1 Default behavior

- 기본 정렬: `published_at` 내림차순 (최신 글 우선).
- v1에서는 pagination 없이 한 페이지에 일정 개수(예: 최신 20~30개)를 노출.
  - 글이 충분히 쌓이면 `/posts/page/[page]` 형태 pagination 도입 고려.

#### 4.2.2 Layout

- **Desktop**
  - 2–3열 카드형 grid
- **Mobile**
  - 1열 카드 feed (stacked cards)

각 카드에는 다음 정보가 들어간다.

- 썸네일 이미지
- Category label (`WRITING`, `PROJECT`, `NOTE`, `LIFE`)
- Title
- Date (`YYYY.MM.DD`)
- Summary (최대 2줄)
- Tags (최대 2–3개만 노출, 나머지는 상세 페이지에서)

#### 4.2.3 Thumbnail rules

- **Primary**: Notion에서 지정한 `thumbnail` 이미지를 사용한다.
- **Fallback**: `thumbnail`이 없으면 category별 기본 그래픽을 사용한다.
  - `project`: 다이내믹하고 컬러풀한 추상 그래픽
  - `writing`: 타이포/그리드, “에세이/책 표지” 느낌
  - `note`: 메모/포스트잇 느낌
  - `life`: 따뜻한 톤의 그래픽

(실제 이미지 스타일/디자인은 Design System 문서에서 정의.)

#### 4.2.4 Filters (UI)

Posts 상단에 category 필터바를 둔다.

- `All · Writing · Project · Note · Life`
- 클릭 시 `/posts?category=writing` 등으로 필터링
- Tag 필터, 연도 필터 등은 v1에서는 UI로 드러내지 않고,  
  향후 필요 시 `/posts?tag=dev`, `/posts?year=2025` route로 확장.

### 4.3 Detail Page (`/posts/[slug]`)

#### 4.3.1 Layout

- Content column:
  - ~65–70ch width
  - 편안한 line-height
- 데스크탑:
  - 우측 또는 좌측에 TOC(Heading 기반), 클릭 시 smooth scroll
- 모바일:
  - 상단에 TOC 버튼 or 접히는 섹션으로 단순화

#### 4.3.2 Elements

- 상단:
  - Title
  - Date
  - Category
  - Optional: reading time
- 본문:
  - Notion 블록을 최대한 “있는 그대로” 렌더링
    - headings, lists, quotes, callouts, code blocks, math 등
- 하단:
  - Tags list
  - `Back to posts` 링크 (또는 버튼)
- v1:
  - 댓글 시스템 없음
  - 추후 `Comments` 컴포넌트 추가 가능 (현재는 placeholder로만 존재)

---

## 5. About (`/about`)

### 5.1 Role

- Home/Profile Card를 확장한 **자세한 자기소개 페이지**.
- 목표:
  - “이 사람이 어떤 사람인지, 어떤 일을 해왔는지, 어떤 취향을 가졌는지”를  
    한 번에 파악할 수 있는 소개 + 타임라인.

### 5.2 Content Structure

- 짧은 소개 문단 1–2개
- 타임라인
  - 연도/기간 + 학교/회사/프로젝트/수상 등 주요 이벤트
- Links 섹션
  - GitHub, LinkedIn, 포트폴리오, Email 등

### 5.3 Routing & Navigation

- Route: `/about`
- Header에서 항상 접근 가능 (`About` 메뉴)

(About의 실제 데이터 소스/관리 방식은 `02_content_model.md`에서 정의.)

---

## 6. Search

### 6.1 Scope

- Search 대상:
  - `status = published`인 **모든 posts**
  - category(`writing`, `project`, `note`, `life`)와 무관하게 검색
- About, Home 등 static page는 v1 검색 대상에서 제외.

### 6.2 Routes & Entry Points

- Route: `/search`
- Header:
  - Desktop:
    - Search icon 클릭 → `/search` 또는 search overlay
    - `Cmd + K`로 빠른 search 진입
  - Mobile:
    - 상단바 Search icon → `/search` (fullscreen search 화면)

### 6.3 Result UI

- 상단: 검색어 input
- 결과 리스트:
  - Title
  - Snippet (본문/summary에서 검색어가 등장하는 한 줄, highlight)
  - Date
  - Category
- 정렬:
  - 기본: 최신순
  - v1에서는 관련도 정렬은 고려하지 않는다.

(구체적인 검색 인덱스/구현 방식은 개발 단계에서 결정.  
예: static JSON index + client-side search 등.)

---

## 7. Navigation

### 7.1 Header

**Desktop**

- Left
  - Logo / 블로그 이름 텍스트 → `/`
- Right
  - `Posts` → `/posts`
  - `About` → `/about`
  - Search icon → `/search` 또는 search overlay

**Mobile**

- Top bar:
  - Left: Logo → `/`
  - Right: Search icon + Hamburger menu
- Hamburger menu:
  - `Posts`, `About`
  - 필요시 외부 링크(GitHub, LinkedIn)는 Footer 중심으로 두되, 필요하면 메뉴에도 추가

### 7.2 Footer

- GitHub, LinkedIn 아이콘 링크
- Stack line:
  - `Built with Next.js, Notion, Vercel`
- Copyright:
  - `© 20XX Your Name` (연도/이름은 실제 런칭 시점 기준)

---

## 8. Future Extensions (Not in v1)

아래 항목들은 v1 IA에는 포함되지 않지만, 구조적으로 여지를 남겨둔다.

- `/tags/[tag]`
  - 특정 Tag 기반 아카이브 페이지
- `/archive`
  - 연도/월별 posts 아카이브
- `/notes`
  - category = `note`만 모은 별도 뷰  
  - 현재는 `/posts?category=note`로 대체 가능
- Comments
  - v1: 미도입
  - 추후 giscus / Hyvor / Commento / Cusdis / custom implementation 등을  
    `/posts/[slug]`의 `Comments` 컴포넌트에 플러그인 형태로 추가 가능
