# SEO & GEO setup

How the site is set up for search engines (Google, Bing) and AI answer engines
(ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews), and the manual steps
that keep it indexed.

Based on the [SEO + GEO tracker guide](https://vibha-ramprakash.github.io/seo-geo-tracker/).
The code changes are in commit `568ecd4` ("Make pages crawlable and add SEO/GEO metadata").

---

## What's in the code

| File | What it does |
|---|---|
| `src/components/RouteGuard.tsx` | Renders page content on the server. It used to send only a spinner until JavaScript ran, so crawlers that don't run JS (most AI crawlers) saw empty pages. |
| `src/components/seo.tsx` | Drop-in `Meta` and `Schema` replacing Once UI's. Adds a canonical URL to every page and renders JSON-LD into the HTML. Every page links to one Person entity (role, employer, Pune, education, topics, GitHub/LinkedIn). |
| `src/app/sitemap.ts` | Serves `/sitemap.xml`. Lists every enabled page, project and post, with cover images. Rebuilt on each deploy. |
| `src/app/robots.ts` | Serves `/robots.txt`. Allows all crawlers and names AI crawlers explicitly (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot and others). Blocks `/api/subscribe`. |
| `src/app/llms.txt/route.ts` | Serves `/llms.txt` ([llmstxt.org](https://llmstxt.org)): a plain-text summary of who you are plus every project and post. Built from site content. |
| `src/resources/content.tsx` | Page titles and meta descriptions. |

**Don't add `public/sitemap.xml` or `public/robots.txt`.** Next.js generates both,
and a static file would conflict with them.

### Things that update themselves

Adding a post (`src/app/blog/posts/*.mdx`) or a project
(`src/app/projects/projects/*.mdx`) updates `sitemap.xml`, `llms.txt` and the
RSS feed on the next deploy. Make sure the frontmatter has a good `title` and
`summary`. The `summary` becomes the meta description and the line in `llms.txt`.

### Keep in mind

- The canonical host is `https://www.devanshupatil.blog`, set as `baseURL` in
  `src/resources/once-ui.config.ts`. Every canonical tag, sitemap URL and
  JSON-LD `@id` is built from it.
- Location (Pune) and topic keywords for the Person schema live in `place` and
  `knowsAbout` in `src/components/seo.tsx`.
- No FAQ schema was added on purpose. Google shows FAQ results only for
  government and health sites, and the schema must match an FAQ that's visible
  on the page.

---

## One-time setup after deploying

### 1. Check the live files

- https://www.devanshupatil.blog/sitemap.xml
- https://www.devanshupatil.blog/robots.txt
- https://www.devanshupatil.blog/llms.txt

### 2. Redirect the bare domain to www (Vercel)

`https://devanshupatil.blog` currently returns the site directly (200) instead
of redirecting, so Google sees two copies of the site.

Vercel → Project → Settings → **Domains** → edit `devanshupatil.blog` →
**Redirect to `www.devanshupatil.blog`** (308 permanent).

### 3. Google Search Console

1. Go to https://search.google.com/search-console.
2. Add a **Domain** property for `devanshupatil.blog`.
3. Verify it with the **DNS TXT record** Google gives you. Add the record
   wherever the domain's DNS is managed (Vercel or the registrar).
4. Go to **Sitemaps** and submit `sitemap.xml`.
5. Request indexing for the key pages (see [URL Inspection](#url-inspection)
   below).

### 4. Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters.
2. Choose **Import from Google Search Console**. It's one click and reuses the
   verification.
3. Submit `https://www.devanshupatil.blog/sitemap.xml`.

Bing also powers Copilot and part of ChatGPT search.

### 5. Validate

- Rich Results Test: https://search.google.com/test/rich-results (paste a blog post URL)
- Schema validator: https://validator.schema.org
- Core Web Vitals: https://pagespeed.web.dev

---

## URL Inspection

This needs the Search Console property to be verified first (step 3 above).

### Steps

1. Open Search Console and select the `devanshupatil.blog` property.
2. Paste a URL into the **"Inspect any URL"** bar at the top and press Enter.
3. Wait for the result. A new site will usually say **"URL is not on Google"**.
4. Click **Test live URL** in the top right to test the version that's live now.
5. When it shows "URL is available to Google", click **Request indexing** and
   wait about a minute for the confirmation.
6. Repeat for the next URL.

Google allows about **10–12 requests per day**. On "Quota exceeded", continue
the next day.

### URLs, most important first

**Day 1**

```
https://www.devanshupatil.blog/
https://www.devanshupatil.blog/about
https://www.devanshupatil.blog/projects
https://www.devanshupatil.blog/blog
https://www.devanshupatil.blog/projects/neurorag
https://www.devanshupatil.blog/projects/advanced-overspeed-detection-system
https://www.devanshupatil.blog/blog/setting-up-claude-code-properly
https://www.devanshupatil.blog/blog/your-rag-system-is-failing-at-retrieval
https://www.devanshupatil.blog/blog/notes-on-agents-after-a-year-of-hype
https://www.devanshupatil.blog/work
```

**Day 2**

```
https://www.devanshupatil.blog/publications
https://www.devanshupatil.blog/blog/speed-from-video-is-a-geometry-problem
https://www.devanshupatil.blog/blog/five-things-i-got-wrong-building-an-offline-rag-system
https://www.devanshupatil.blog/projects/stock-price-prediction
https://www.devanshupatil.blog/projects/wine-quality-analysis
https://www.devanshupatil.blog/projects/nlp-langdetect
```

### What to check on each result

After **Test live URL**, click **View tested page**:

- **Screenshot:** the real page shows, not a blank page or spinner.
- **HTML:** contains `application/ld+json`, which confirms the structured data
  is in the HTML.
- **Page indexing → User-declared canonical:** matches the `https://www.…` URL
  you inspected.

If it says **"Duplicate, Google chose different canonical"**, it's the `www`
vs non-`www` issue. Fix the redirect (step 2) and request indexing again.

### Later

- Pages usually appear in Google within a few days to 2 weeks. Track progress
  in the **Pages** report.
- For each new post, inspect its URL and request indexing. The sitemap updates
  on its own, but this gets the post indexed faster.
- Don't re-request a URL that's already pending. It doesn't speed anything up.

---

## Ongoing (from the guide)

- **AI visibility check:** ask ChatGPT, Perplexity, Gemini and Copilot about
  your name and topics (for example "Who is Devanshu Patil?" or "offline RAG
  over ICD-10"), and note whether the site is cited. Free checkers from Ahrefs,
  Semrush and Omnia do the same.
- **Search Console data in Claude:** connect the
  [mcp-gsc](https://github.com/AminForou/mcp-gsc) MCP server so audits use real
  rankings, impressions and CTR.
- **Re-audit in about 2 weeks:** compare positions, impressions and AI
  citations against the first baseline. Look for "striking distance" queries
  (positions 8–20) and improve those pages first.
