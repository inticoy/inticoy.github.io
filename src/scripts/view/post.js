var dirStructure;
var categories = [];
var posts = [];

async function loadDirStructure() {
  try {
    const response = await fetch("/content/contents.json");
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

function showPosts2() {
  document.getElementById("content").innerHTML = "";
  for (const e of posts) {
    var item = document.createElement("div");
    item.className = "abc";
    item.innerText = e["title"] + " " + e["date"] + " " + e["category"];
    document.getElementById("content").appendChild(item);
  }
}

function showPostsList() {
  loadDirStructure()
    .then(loadCategories)
    .then(loadPosts)
    .then(sortPosts)
    .then(showPosts2);
}

function showPostsListOf(category) {
  document.getElementById(
    "content"
  ).innerHTML = `<h1>Post ${category}</h1><p>Post content for post ${category} category</p>`;
}

function showPost(category, id) {
  document.getElementById(
    "content"
  ).innerHTML = `<h1>Post ${id}</h1><p>Post content for post ${id}... in ${category}</p>`;
}
export function showPosts(...args) {
  if (args.length === 0) {
    showPostsList();
  } else if (args.length === 1) {
    const [category] = args;
    showPostsListOf(category);
  } else if (args.length === 2) {
    const [category, id] = args;
    showPost(category, id);
  }
}
