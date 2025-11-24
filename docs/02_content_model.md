
# Content Model

이 문서는 블로그의 콘텐츠가 Notion DB에 어떻게 저장되고,  
어떤 필드들이 어떤 역할을 하는지 정의한다.

- 상위 구조 / 라우팅 / 섹션 역할: `01_information_architecture.md`
- 이 문서: **Notion Posts DB 스키마 + 제약조건 + 코드 매핑**

---

## 1. Overview

### 1.1 Single Posts Database

- 콘텐츠는 **단일 Notion Database** `Posts` 에서 관리한다.
- 다음을 모두 한 곳에서 다룬다.
  - 일반 글 (`writing`)
  - 프로젝트 글 (`project`)
  - 짧은 메모 (`note`)
  - 삶/경험 글 (`life`)
  - About 페이지용 데이터 (`about`)

### 1.2 Status-driven Visibility

- 글의 노출 여부는 `status` 필드로 제어한다.
- 빌드/렌더링 시, `status` 값에 따라:
  - `Draft` → 블로그에 노출하지 않음
  - `Published` → `/posts`, `/posts/[slug]`, `/search`에 노출
  - `Hide` → 완전히 숨김 (URL로도 접근 불가)

---

## 2. Posts DB Fields

### 2.1 Summary Table

> 아래는 **실제 Notion 필드 이름 기준** 정의다.

| Property       | Notion Type      | Required (for `Published`) | Description                                      |
|----------------|------------------|----------------------------|--------------------------------------------------|
| `Title`        | Title            | ✅                         | 글 제목                                          |
| `slug`         | Text             | ✅ (unique)                | URL 식별자 (`/posts/[slug]`)                     |
| `status`       | Select           | ✅                         | `Hide / Draft / Published`                       |
| `Category`     | Select           | ✅                         | `writing / project / note / life / about`        |
| `Tags`         | Multi-select     | ❌                         | 주제/기술/프로젝트 이름                          |
| `Summary`      | Text             | ✅                         | 리스트/SEO용 짧은 요약 (1–3문장)                 |
| `Thumbnail`    | Files & media    | ❌                         | 카드 썸네일 이미지                               |
| `Published At` | Date             | ✅                         | 게시일 (리스트 정렬 + UI 표시 기준)              |
| `Created At`   | Created time     | 시스템                     | Notion 자동 생성 (초안 생성 시점)                |
| `isPinned`     | Checkbox         | ❌                         | 홈/리스트 상단 고정 여부                         |

> `Published At`은 “이 글을 언제 게시된 것으로 볼 것인가”의 **유일한 기준 날짜**다.  
> UI에 보이는 날짜, `/posts` 정렬, 연도별 아카이브 등은 모두 이 값을 기준으로 한다.

---

## 3. Field Details & Rules

### 3.1 `Title` (Title)

- Notion의 기본 Title property.
- 블로그에서:
  - `/posts` 카드의 제목
  - `/posts/[slug]` 상단 제목
  - `<title>` 메타 태그의 기본 값으로 사용
- **Rule**
  - `status = Published`인 레코드는 `Title`이 비어 있으면 안 된다.

---

### 3.2 `slug` (Text)

- 영문, 소문자, 숫자, `-` 만 사용.
  - 예: `my-first-post`, `thoughts-on-side-projects`, `project-retro-2025`
- URL 패턴: `/posts/[slug]`
- **Rule**
  - `status = Published`일 때:
    - `slug`는 **필수**이며, **유일(unique)** 해야 한다.
  - Draft/Hide 단계에서는 비어 있어도 허용하지만,  
    Published로 바꾸기 전에 반드시 채운다.

---

### 3.3 `status` (Select)

- Notion 옵션 값:
  - `Draft`
  - `Published`
  - `Hide`
- 의미:

  - `Draft`
    - 작성 중인 글
    - `/posts` 리스트, `/posts/[slug]`, `/search`에서 제외
  - `Published`
    - 공개된 글
    - `/posts`, `/posts/[slug]`, `/search`에 포함
  - `Hide`
    - 과거 글을 숨기거나, 실험적 글을 보관할 때 사용
    - 모든 뷰에서 제외됨

- 코드에서 사용할 때는 소문자 enum 등으로 매핑할 수 있다:
  - `"Draft"` → `"draft"`
  - `"Published"` → `"published"`
  - `"Hide"` → `"hide"`

**Rule**

- 빌드/데이터 변환 시:
  - `status != "Published"` 인 항목은 **프론트엔드 렌더링에서 제외**한다.

---

### 3.4 `Category` (Select)

- **역할**: 글의 **코너/형태(form)** 를 나타낸다.
- 값 (v1 기준):

  - `writing`
    - 일반적인 글 (에세이, 정리, dev/product/design 관련 긴 글 등)
  - `project`
    - 프로젝트나 서비스 중심 글 (소개, 설계, 회고, 런칭 후기)
  - `note`
    - 짧은 메모, 실험 로그, 아이디어 조각
  - `life`
    - 일상/경험/감정/커리어 등 “삶”에 가까운 글
  - `about`
    - `/about` 페이지용 특수 카테고리 (1개 또는 소수의 레코드)

- **사용처**
  - `/posts` 상단 필터바 버튼 (`All · Writing · Project · Note · Life`)
  - 카드 상단 Category 라벨 (`WRITING`, `PROJECT`, …)
  - Home의 Projects Card에서 `Category = project` 필터링

- **Rule**
  - `status = Published`이면 `Category`는 필수.
  - `Category = about` 인 항목은:
    - 기본 `/posts` 목록/검색에서는 제외하거나, `/about`에서만 사용 (구현 시 결정).

---

### 3.5 `Tags` (Multi-select)

- 글의 **주제/도메인/기술/프로젝트 이름** 표현.
- 예시:
  - `dev`, `backend`, `frontend`, `architecture`, `testing`
  - `product`, `design`, `ux`
  - `nextjs`, `typescript`, `tailwind`, `threejs`
  - `my-blog`, `habit-tracker`, `casual-game`
  - `career`, `work`, `study`, `life`, `meta`
- **Rules**
  - 네이밍: 소문자, 필요시 `kebab-case` (`tailwind-css`, `job-hunting` 등)
  - 1개 글당 0개 이상 허용, 하지만 3–6개 정도를 권장.
- **사용처**
  - 카드/상세 페이지 하단 Tag chip
  - `/posts?tag=…` 필터링
  - 연관 글 기능 (향후 확장)에서 활용

---

### 3.6 `Summary` (Text)

- 글의 짧은 요약 (1–3 문장).
- **사용처**
  - `/posts` 카드 설명
  - `meta description` 태그
  - `/search` 결과 snippet
- **Rules**
  - `status = Published`인 글에서는 되도록 채운다.
  - 스타일:
    - “이 글을 읽으면 무엇을 알게 되는지” 중심으로 요약.

---

### 3.7 `Thumbnail` (Files & media)

- 카드 상단에 표시되는 썸네일 이미지.
- Notion에서는 `Files & media` 타입 필드.
- **Fallback 로직 (IA 연동)**

  - `Thumbnail`이 비어 있는 경우:
    - `Category` 값에 따라 기본 그래픽을 사용:
      - `project`: 다이내믹한 추상 그래픽
      - `writing`: 타이포/책 표지 느낌
      - `note`: 메모/포스트잇 느낌
      - `life`: 따뜻한 톤 그래픽

- **Rule**
  - 없어도 동작하지만, 대표 글/프로젝트에는 썸네일 지정 권장.

---

### 3.8 `Published At` (Date)

- 글이 **게시된 날짜**를 명시하는 수동 Date 필드.
- 이 프로젝트에서 사용하는 **유일한 기준 날짜**다.
- **사용처**
  - `/posts` 정렬 기준 (최신순)
  - 카드/상세 페이지에서 날짜 표시
  - `/posts?year=YYYY` 같은 연도별 아카이브 필터
- **Rules**
  - `status = Published`일 때 **필수**.
  - 초안 단계에서는 비어 있어도 상관없지만,  
    실제 공개 전에 반드시 설정한다.
  - “수정일”이 아니라 “공개일” 기준으로 유지하는 것을 원칙으로 한다.

---

### 3.9 `Created At` (Created time)

- Notion 자동 생성 필드.
- 글 초안을 처음 만든 시점.
- **사용처**
  - 작성 히스토리 참고용.
  - 빌드/동기화 로직에서 “새로 생성된 글만 필터링” 등에 활용 가능.
- UI에는 기본적으로 노출하지 않는다.

---

### 3.10 `isPinned` (Checkbox)

- 특정 글을 Home 또는 `/posts` 상단에 고정하고 싶을 때 사용.
- **사용처 예시**
  - Home의 Posts 카드 영역에서:
    - `isPinned = true` 인 글을 우선 노출
  - `/posts`에서 별도 “Pinned” 섹션 (향후 확장)
- **Rule**
  - 필수는 아니지만, 항상 보여주고 싶은 글이 있다면 1~3개의 글에 체크.

---

## 4. Derivatives in Code (Not Stored in Notion)

다음 값들은 Notion에 별도 필드로 저장하지 않고, 코드에서 계산한다.

- `path`: string  
  - 예: `/posts/${slug}`
- `canonical_url`: string  
  - 예: `${SITE_URL}/posts/${slug}`
- `reading_time`: number  
  - 본문 텍스트 길이를 기반으로 코드에서 계산 (예: 200자/분 or 200단어/분 기준)
- `og_image_url`:
  - v1: 사이트 공통 OG 이미지 사용
  - v2: slug/title 기반 dynamic OG 생성 시 코드/OG API에서 계산

---

## 5. Data Flow (High-level)

1. **Authoring (작성)**
   - Notion `Posts` DB에서 새 페이지 생성.
   - `Title`, `Summary`, `Category`, `Tags`, `status`, `slug`(선택), `Published At`(선택) 등을 채운다.
   - 초안 단계에서는 `status = Draft` 로 두고 내용 작성.

2. **Publishing (공개)**
   - 공개 준비가 되면:
     - `slug` 설정 (영문 고유 식별자)
     - `Published At` 설정 (게시일)
     - `Category` 확인
     - `Summary` 확인
     - `status` → `Published` 로 변경

3. **Build / Fetch**
   - Next.js에서 Notion 클라이언트로 `Posts` DB를 조회.
   - `status = "Published"` 인 레코드만 필터링.
   - 각 레코드를 내부 `Post` 타입으로 변환:
     - Notion property → TypeScript interface (예: `Post`)

4. **Rendering**
   - `/posts`:
     - `Category`, `Tags`, `Published At` 기준으로 필터/정렬.
   - `/posts/[slug]`:
     - `slug`로 단일 포스트 조회.
   - `/search`:
     - Title, Summary, 본문(content) 텍스트 기반 검색 인덱스 구성.

---

## 6. Recommended Notion Views

Notion에서 글 관리가 편하도록 기본 View를 만든다.

- **All**
  - 조건: 없음
  - 정렬: `Created At` 내림차순
- **Published**
  - 조건: `status = Published`
  - 정렬: `Published At` 내림차순
- **Drafts**
  - 조건: `status = Draft`
  - 정렬: `Created At` 또는 `Published At` 오름/내림차순
- **By Category (Board)**
  - Board view
  - Group by `Category`
- **By Status (Board)**
  - Board view
  - Group by `status`  
  - `Draft → Published` 로 옮겨가며 작업 상태를 시각적으로 관리

---

## 7. Validation Checklist (for `Published`)

`status = Published` 로 전환하기 전에 다음을 확인한다.

- [ ] `Title` 이 비어 있지 않다.
- [ ] `slug` 가 채워져 있고, 다른 글과 중복되지 않는다.
- [ ] `Category` 가 설정되어 있다 (`writing`, `project`, `note`, `life`, `about` 중 하나).
- [ ] `Summary` 가 1–3 문장 정도로 작성되어 있다.
- [ ] `Published At` 이 설정되어 있다.
- [ ] (선택) `Tags` 가 1개 이상 있다.
- [ ] (선택) 대표 글/프로젝트라면 `Thumbnail` 이 있다.

이 체크리스트는 Notion description이나 템플릿 페이지에 복붙해서 사용해도 좋다.

---
