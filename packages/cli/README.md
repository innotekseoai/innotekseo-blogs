# @innotekseo/blogs-migrate

> HTML-to-MDX migration CLI — crawl legacy HTML sites and convert pages to MDX content files with frontmatter.

Part of the **[Innotek Platform Toolkits](https://innotekseoai.com/platform-toolkits)** — open-source tools for AI-era content discoverability.

**GitHub:** [innotekseoai/innotekseo-blogs](https://github.com/innotekseoai/innotekseo-blogs) · `packages/cli`

## Install

```bash
npm install -g @innotekseo/blogs-migrate
```

Or use without installing:

```bash
npx @innotekseo/blogs-migrate --url https://old-blog.example.com
```

The binary name is `innotekseo-migrate`.

## CLI Usage

```bash
innotekseo-migrate --url <start-url> [options]

Options:
  --url <url>        Start URL to crawl (required)
  --output <dir>     Output directory (default: ./content)
  --depth <n>        Max crawl depth (default: 1)
  --delay <ms>       Delay between requests in ms (default: 500)
```

**Example:**

```bash
innotekseo-migrate \
  --url https://old-blog.example.com/posts \
  --output ./src/content \
  --depth 3 \
  --delay 1000
```

**Output** — for each crawled page, generates an `.mdx` file:

```markdown
---
title: "Original Page Title"
date: "2024-01-15T00:00:00.000Z"
source: "https://old-blog.example.com/posts/my-article"
---

Converted markdown content...

![Photo](./images/photo.jpg)
```

## Features

- **BFS crawling** with configurable depth limit
- **Smart content extraction** — tries `<article>`, `<main>`, common CSS classes before falling back to `<body>`
- **Noise removal** — strips `<script>`, `<style>`, `<nav>`, `<footer>`, `<header>`, `<aside>`, `<iframe>`
- **Image downloading** — saves remote images locally, rewrites paths in markdown
- **Rate limiting** between requests (default 500ms)
- **Slug deduplication** — appends `-1`, `-2` for duplicate URL slugs
- **Same-domain only** — only follows links within the source domain
- **SSRF protection** — blocks localhost, private IPs, IPv6 loopback, `file://`, `.local` hostnames
- **Path traversal protection** — output directory validated to stay within CWD

## Programmatic Usage

```typescript
import { migrate } from "@innotekseo/blogs-migrate";

const files = await migrate({
  url: "https://old-blog.example.com",
  output: "./content",
  depth: 2,
  delay: 500,
});
// files: string[] — paths to created .mdx files
```

Individual functions are also exported: `crawlPage`, `crawlSite`, `convertPage`, `slugify`, `toMdxString`, `downloadImages`.

## After Migration

The generated MDX files work directly with [`@innotekseo/blogs-core`](https://www.npmjs.com/package/@innotekseo/blogs-core) via `LocalAdapter`, and the [`@innotekseo/blogs-components`](https://www.npmjs.com/package/@innotekseo/blogs-components) layout components.

## Related Packages

| Package | Description |
|---|---|
| [`@innotekseo/cli`](https://www.npmjs.com/package/@innotekseo/cli) | Main GEO/SEO CLI — llms.txt, article scaffolding |
| [`@innotekseo/blogs-core`](https://www.npmjs.com/package/@innotekseo/blogs-core) | Content adapter library + REST API |
| [`@innotekseo/blogs-components`](https://www.npmjs.com/package/@innotekseo/blogs-components) | Astro UI components for MDX content |

→ **[Innotek Platform Toolkits](https://innotekseoai.com/platform-toolkits)**

## License

ISC — Innotek Solutions Ltd
