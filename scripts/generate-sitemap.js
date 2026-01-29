const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = process.cwd();
const toolsDir = path.join(ROOT, 'src', 'pages', 'tools');
const publicDir = path.join(ROOT, 'public');
const articlesJson = path.join(__dirname, 'articles.sitemap.json');

function toSlug(folder) {
  return folder.replace(/_/g, '-').replace(/^Mortgage/, 'mortgage');
}

async function main() {
  const urls = [
    { loc: 'https://www.finworld.live/', priority: 0.8, changefreq: 'weekly' },
    { loc: 'https://www.finworld.live/articles', priority: 0.7, changefreq: 'weekly' },
  ];

  // Tools
  if (fs.existsSync(toolsDir)) {
    const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    for (const folder of dirs) {
      const slug = toSlug(folder);
      urls.push({ loc: `https://www.finworld.live/tools/${slug}`, priority: 0.9, changefreq: 'weekly' });
    }
  }

  // Articles from JSON (CommonJS-safe)
  if (fs.existsSync(articlesJson)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(articlesJson, 'utf8'));
      const slugs = Array.isArray(parsed.articles) ? parsed.articles : [];
      slugs.forEach((slug) => {
        if (typeof slug === 'string' && slug.trim()) {
          urls.push({
            loc: `https://www.finworld.live/articles/${slug.trim()}`,
            priority: 0.8,
            changefreq: 'weekly',
          });
        }
      });
    } catch (err) {
      console.error('⚠️ Unable to load articles.sitemap.json for sitemap:', err.message);
    }
  } else {
    console.warn('⚠️ articles.sitemap.json not found; article URLs will be missing from sitemap.');
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`),
    '</urlset>'
  ].join('\n');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`Generated sitemap with ${urls.length} URLs`);
}

main();
