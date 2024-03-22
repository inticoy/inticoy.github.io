import { showErrorPage404 } from "./view/errorPage.js";
import { showHome } from "./view/home.js";
import { showAbout } from "./view/about.js";
import { showPosts } from "./view/post.js";
import { showPost } from "./view/post.js";
import { showProjects } from "./view/project.js";
import { showSearch } from "./view/search.js";

const router = {
  "/": () => showHome(),
  "/index.html": () => showHome(),
  "/about": () => showAbout(),
  "/posts": () => showPosts(),
  "/post/:id": (id) => showPost(id),
  "/projects": () => showProjects(),
  "/search": () => showSearch(),
};

function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path);
  route();
}

function route() {
  const path = window.location.pathname;
  const route = Object.keys(router).find((r) =>
    path.match(new RegExp("^" + r.replace(/:\w+/g, "\\w+") + "$"))
  );

  if (route) {
    const match = path.match(new RegExp(route.replace(/:\w+/g, "(\\w+)")));
    const args = match ? match.slice(1) : null; // Capture groups로부터 인자 추출
    router[route].apply(null, args);
  } else {
    showErrorPage404();
  }
}

// 브라우저 뒤로 가기/앞으로 가기 대응
window.addEventListener("popstate", route);

// 초기 라우트 실행
document.addEventListener("DOMContentLoaded", route);

// 예시를 위한 링크 클릭 이벤트 핸들링 (실제 구현에서는 더 견고한 방법을 사용해야 할 수 있습니다)
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.href);
  }
});
