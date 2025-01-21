document
  .getElementById("hamburger-menu")
  .addEventListener("click", function () {
    document.getElementById("mobile-menu").classList.toggle("hidden");
    console.log(1);
  });

document
  .getElementById("close-mobile-menu")
  .addEventListener("click", function () {
    document.getElementById("mobile-menu").classList.toggle("hidden");
    console.log(1);
  });

const toggleButton = document.getElementById("toggle-dark-mode");

// 다크 모드 상태 저장
const darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {
  document.documentElement.classList.add("dark");
}

// 버튼 클릭 시 다크 모드 토글
toggleButton.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});
