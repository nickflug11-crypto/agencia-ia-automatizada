const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");
const config = require("../config");

const POSTS_DIR = path.join(__dirname, "..", "site", "posts");
const OUT_DIR = path.join(__dirname, "..", "site", "dist");

function layout({ title, body }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | ${config.SITE_NAME}</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header><a href="/" class="logo">${config.SITE_NAME}</a></header>
<main>${body}</main>
<footer>
  <p>${config.SITE_NAME} — <a href="${config.PRODUCT_URL}">${config.PRODUCT_NAME}</a></p>
</footer>
</body>
</html>`;
}

function build() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))
    : [];

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...data, html: marked.parse(content) };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  // Gera página de cada post
  for (const post of posts) {
    const page = layout({ title: post.title, body: `<article><h1>${post.title}</h1>${post.html}</article>` });
    fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.html`), page, "utf-8");
  }

  // Gera índice
  const list = posts
    .map((p) => `<li><a href="/${p.slug}.html">${p.title}</a> <span class="date">${p.date}</span></li>`)
    .join("\n");
  const indexBody = `
    <section class="hero">
      <h1>${config.SITE_NAME}</h1>
      <p>Conteúdo sobre ${config.NICHE}.</p>
      <a class="cta" href="${config.PRODUCT_URL}">Conheça o ${config.PRODUCT_NAME}</a>
    </section>
    <ul class="post-list">${list || "<li>Nenhum artigo publicado ainda.</li>"}</ul>
  `;
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), layout({ title: "Início", body: indexBody }), "utf-8");

  // Copia o CSS
  fs.copyFileSync(path.join(__dirname, "..", "site", "style.css"), path.join(OUT_DIR, "style.css"));

  console.log(`Site gerado em ${OUT_DIR} com ${posts.length} artigo(s).`);
}

build();
