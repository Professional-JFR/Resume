// Lightweight site checks: local links resolve, pages have basics, dist is built.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pages = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
const errors = [];

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  if (!/<html[^>]*\slang=/.test(html)) errors.push(`${page}: missing html lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing title`);
  if (!/name="description"/.test(html)) errors.push(`${page}: missing meta description`);
  for (const [, ref] of html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)) {
    if (!fs.existsSync(path.join(root, ref))) errors.push(`${page}: broken local reference ${ref}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: OK`);
