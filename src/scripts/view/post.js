const content = document.getElementById("content");

function jsonToList(dirStructure) {
  var categories = [];
  for (var key in dirStructure) {
    categories.push(key);
  }

  var posts = [];
  for (var key in dirStructure) {
    posts = posts.concat(dirStructure[key]);
  }
  posts.sort(function (a, b) {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  content.innerHTML = "";

  var list = document.createElement("div");
  list.className = "list";

  for (const e of posts) {
    var item = document.createElement("div");
    item.className = "list__item";

    var title = document.createElement("h1");
    title.innerText = e["title"];

    var date = document.createElement("p");
    date.innerText = e["date"];

    var category = document.createElement("p");
    category.innerText = e["category"];

    item.appendChild(title);
    item.appendChild(date);
    item.appendChild(category);
    list.appendChild(item);
    list.addEventListener(
      "click",
      () => {
        const temp = new Date(e["date"]);
        location.href =
          "/posts/" +
          e["category"] +
          "/" +
          temp.getFullYear() +
          "/" +
          (temp.getMonth() + 1) +
          "/" +
          temp.getDay() +
          "/" +
          e["title"].slice(0, -3);
      },
      false
    );
  }
  content.appendChild(list);
}

function showPostsList() {
  fetch("/content/contents.json")
    .then((response) => response.json())
    .catch((reason) => {
      console.log(reason);
    })
    .then(jsonToList);
}

function showPostsListOf(category) {
  document.getElementById(
    "content"
  ).innerHTML = `<h1>Post ${category}</h1><p>Post content for post ${category} category</p>`;
}

function showPost(category, year, month, day, title) {
  content.innerHTML = "";

  fetch(
    "/content" +
      "/" +
      category +
      "/" +
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      title +
      ".md"
  )
    .then((res) => res.text())
    .then((text) => {
      content.innerHTML = marked(text);
    })
    .catch((e) => console.error(e));
  // document.getElementById(
  //   "content"
  // ).innerHTML = `<h1>Post ${id}</h1><p>Post content for post ${id}... in ${category}</p>`;
}
export function showPosts(...args) {
  if (args.length === 0) {
    showPostsList();
  } else if (args.length === 1) {
    const [category] = args;
    showPostsListOf(category);
  } else if (args.length === 5) {
    const [category, year, month, day, title] = args;
    showPost(category, year, month, day, title);
  }
}
