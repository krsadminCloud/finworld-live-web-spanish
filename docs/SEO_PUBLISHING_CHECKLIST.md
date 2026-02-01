# Publishing Checklist (Articles)

Use this checklist whenever you add a new article to `src/data/articles.js`.

## A) Content requirements
- [ ] H1 title is intent-based, specific, no fluff.
- [ ] Excerpt (meta description) is 140–160 chars, unique, benefit-driven.
- [ ] Summary bullets: 4–6 max, concise.
- [ ] Sections: 7–10 max; short paragraphs; scannable bullets where useful.
- [ ] Include 1–3 internal CTAs to existing tools only if intent-aligned.

## B) SEO requirements (SPA + Helmet)
- [ ] Only one `<meta name="description">` (ArticlePage uses `article.excerpt`).
- [ ] Canonical is `https://www.finworld.live/articles/{slug}`.
- [ ] JSON-LD renders (Article + BreadcrumbList) via ArticlePage.
- [ ] /articles hub lists it (ArticlesIndex pulls from `articles.js`).

## C) Internal linking requirements
- [ ] Add `relatedSlugs` pointing to 2–3 relevant articles.
- [ ] Add reciprocal links in those related articles’ `relatedSlugs` for a consistent cluster.

## D) Sitemap requirements
- [ ] Add the slug to `scripts/articles.sitemap.json`.
- [ ] Run `npm run build` and confirm `dist/sitemap.xml` includes:
  - `/articles`
  - `/articles/{slug}`

## E) Final QA
- [ ] TOC anchors scroll correctly on the article page.
- [ ] CTA links work (internal routes only).
- [ ] No console errors.
- [ ] (Optional) Quick Lighthouse pass for SEO/accessibility.

---

## Article object template (copy/paste into `src/data/articles.js`)
```js
{
  slug: "your-article-slug",
  title: "Intent-based H1 title",
  excerpt:
    "140–160 char meta description that states the benefit and intent.",
  image:
    "https://existing-image-url.example", // optional; reuse existing only
  category: "Category", // optional
  readTime: "X min read", // optional
  summary: [
    "Bullet 1",
    "Bullet 2",
    "Bullet 3"
  ],
  sections: [
    {
      title: "Section title",
      paragraphs: [
        "Short paragraph 1.",
        "Short paragraph 2."
      ],
      // optional CTAs per section:
      // ctas: [{ label: "CTA text", to: "/tools/your-tool" }]
    }
  ],
  relatedSlugs: ["other-article-slug-a", "other-article-slug-b"]
}
```

## SEO validation commands
- Start dev: `npm run dev` → open `/articles/{slug}` and inspect `<title>`, meta description, canonical.
- Check JSON-LD scripts are present in the DOM (Article + BreadcrumbList).
- Build & sitemap: `npm run build` → verify `dist/sitemap.xml` includes `/articles` and `/articles/{slug}`.
