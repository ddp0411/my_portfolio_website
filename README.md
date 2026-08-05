# Devanshu Vijay Patil — Portfolio

Personal portfolio of **Devanshu Vijay Patil**, Data Scientist — projects, work
experience, publications, and a blog. Built with Next.js and Once UI.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Once UI** (`@once-ui-system/core`) for the design system
- **MDX** content for projects and blog posts
- **Buttondown** newsletter via a server-side `/api/subscribe` route
- Deployed on **Vercel**

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Environment

Copy `.env.example` → `.env.local` and fill in:

- `BUTTONDOWN_API_KEY` — Buttondown API key for the newsletter (server-side only)

`.env.local` is gitignored; never commit real secrets. On Vercel, set the same
variable under Project → Settings → Environment Variables.

## Where content lives

- Site config (routes, theme, base URL): `src/resources/once-ui.config.ts`
- Identity, copy, experience, skills: `src/resources/content.tsx`
- Projects: `src/app/projects/projects/*.mdx`
- Blog posts: `src/app/blog/posts/*.mdx`
- Publications: `src/app/publications/page.tsx`

## Build

```bash
npm run build
```

---

Built on the [Magic Portfolio](https://once-ui.com/products/magic-portfolio)
template by Once UI (CC BY-NC 4.0).
