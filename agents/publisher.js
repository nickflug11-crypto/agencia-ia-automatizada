const fs = require("fs");
const path = require("path");

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function publishArticle(topic, markdownBody) {
  const date = new Date().toISOString().split("T")[0];
  const slug = `${date}-${slugify(topic)}`;
  const postsDir = path.join(__dirname, "..", "site", "posts");
  fs.mkdirSync(postsDir, { recursive: true });

  const frontMatter = `---\ntitle: "${topic.replace(/"/g, "'")}"\ndate: "${date}"\nslug: "${slug}"\n---\n\n`;
  const filePath = path.join(postsDir, `${slug}.md`);
  fs.writeFileSync(filePath, frontMatter + markdownBody, "utf-8");

  return slug;
}

module.exports = { publishArticle };
