export function showErrorPage404() {
  console.error("404 error: No route matching");
  document.getElementById("content").innerHTML =
    "<h1>404 Not Found</h1><p>The page you requested does not exist.</p>";
}
