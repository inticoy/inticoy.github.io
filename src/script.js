document.getElementById("header__title").innerHTML =
  "Welcome to Inticoy's Blog";
document.getElementById("header__date").innerHTML = "2024.03.01";

fetch("/README.md")
  .then((res) => res.text())
  .then((text) => {
    document.getElementById("content").innerHTML = marked(text);
  })
  .catch((e) => console.error(e));
