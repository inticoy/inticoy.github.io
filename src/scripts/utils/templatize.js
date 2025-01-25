export function templatize(
  template,
  { emoji, title, categories, summary, date, tags, thumbnail, content }
) {
  const formattedDate = date
    ? new Date(date).toISOString().split("T")[0]
    : "Unknown Date";

  const formattedTags = Array.isArray(tags)
    ? tags.map((tag) => `#${tag}`).join(" ")
    : tags || "";

  return (
    template
      .replace(/<!-- EMOJI -->/g, emoji || "")
      .replace(/<!-- TITLE -->/g, title || "")
      .replace(/<!-- CATEGORY -->/g, categories || "")
      // .replace(/<!-- SUMMARY -->/g, summary)
      .replace(/<!-- PUBLISH_DATE -->/g, formattedDate)
      .replace(/<!-- TAG -->/g, formattedTags)
      // .replace(/<!-- THUMBNAIL -->/g, thumbnail)
      .replace(/<!-- CONTENT -->/g, content || "")
  );
}
