var dirStructure;
var categories = [];
var posts = [];

async function loadDirStructure() {
  try {
    const response = await fetch("/contents/contents.json");
    if (!response.ok) {
      throw new Error("fetching file list failed");
    }
    dirStructure = await response.json();
  } catch (e) {
    console.error(e);
  }
}

function loadCategories() {
  for (var key in dirStructure) {
    categories.push(key);
  }
}

function loadPosts() {
  for (var key in dirStructure) {
    posts = posts.concat(dirStructure[key]);
  }
}

function sortPosts() {
  posts.sort(function (a, b) {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

function showPosts() {
  document.getElementById("content").innerHTML = "";
  for (const e of posts) {
    var item = document.createElement("div");
    item.innerText = e["title"] + " " + e["date"] + " " + e["category"];
    document.getElementById("content").appendChild(item);
  }
}

loadDirStructure()
  .then(loadCategories)
  .then(loadPosts)
  .then(sortPosts)
  .then(showPosts);

// document.getElementById("content").innerHTML = marked(
//   "# Marked in browser\n\nRendered by **marked**." +
//     "\n\n![hi](asset/logo/logo_inticoy_darkmode.svg)\n\n```c\nint a = b;```\n\n`a` is a "
// );
