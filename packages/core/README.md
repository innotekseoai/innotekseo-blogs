# @innotekseo/blogs-core

> Content adapter library and REST API for Astro blog systems — supports local files, Strapi, and Contentful.

Part of the **[Innotek Platform Toolkits](https://innotekseoai.com/platform-toolkits)** — open-source tools for AI-era content discoverability.

**GitHub:** [innotekseoai/innotekseo-blogs](https://github.com/innotekseoai/innotekseo-blogs) · `packages/core`

## Install

```bash
npm install @innotekseo/blogs-core
```

**Requires:** Node.js 20+

## What it does

Provides a unified `ContentAdapter` interface for fetching blog content from any source, a `ContentService` wrapper, a Hono-based REST API server, RSS feed generation, and client-side search indexing.

## Quick Start

```typescript
import { LocalAdapter, ContentService } from "@innotekseo/blogs-core";

const adapter = new LocalAdapter("./src/content/posts");
const service = new ContentService(adapter);

const posts = await service.getPosts();
const post = await service.getPost("hello-world");
```

## Export Paths

```
@innotekseo/blogs-core                      → ContentService, all adapters, types, RSS, search
@innotekseo/blogs-core/adapters/local       → LocalAdapter
@innotekseo/blogs-core/adapters/strapi      → StrapiAdapter
@innotekseo/blogs-core/adapters/contentful  → ContentfulAdapter
@innotekseo/blogs-core/rss                  → generateRss()
@innotekseo/blogs-core/search               → buildSearchIndex(), searchIndex()
@innotekseo/blogs-core/server               → createApi(), startServer(), validateMarkdown()
```

## Adapters

### LocalAdapter — filesystem `.md/.mdx`

```typescript
import { LocalAdapter } from "@innotekseo/blogs-core/adapters/local";

const adapter = new LocalAdapter("./src/content");
const posts = await adapter.getPosts();
const post = await adapter.getPost("hello-world");

// With custom TTL cache
const adapter = new LocalAdapter("./src/content", { cacheTtlMs: 10000 });
```

### StrapiAdapter — Strapi CMS (read-only)

```typescript
import { StrapiAdapter } from "@innotekseo/blogs-core/adapters/strapi";

const adapter = new StrapiAdapter({
  url: process.env.STRAPI_URL,
  token: process.env.STRAPI_TOKEN,
});
```

### ContentfulAdapter — Contentful CMS (read-only)

```typescript
import { ContentfulAdapter } from "@innotekseo/blogs-core/adapters/contentful";

const adapter = new ContentfulAdapter({
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  contentType: "blogPost",
});
```

## ContentAdapter Interface

Implement this interface to add any content source:

```typescript
interface ContentAdapter {
  getPosts(): Promise<PostMeta[]>;
  getPost(slug: string): Promise<Post>;
  getAllTags(): Promise<string[]>;
  getPostsByTag(tag: string): Promise<PostMeta[]>;
  savePost(slug: string, content: string): Promise<SaveResult>;
  deletePost(slug: string): Promise<DeleteResult>;
  postExists(slug: string): Promise<boolean>;
}
```

## REST API Server

Built with [Hono](https://hono.dev):

```typescript
import { startServer } from "@innotekseo/blogs-core/server";
import { LocalAdapter } from "@innotekseo/blogs-core/adapters/local";

startServer({
  adapter: new LocalAdapter("./content"),
  port: 3001,
  apiKey: process.env.API_KEY,       // optional — protects write endpoints
  webhookUrl: process.env.WEBHOOK,   // optional — fires on content changes
  cors: true,
});
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/posts` | List posts (paginated, filterable by tag/search/sort) |
| `GET` | `/api/posts/:slug` | Get post with full content |
| `POST` | `/api/posts` | Create post (409 on duplicate slug) |
| `PUT` | `/api/posts/:slug` | Update post |
| `DELETE` | `/api/posts/:slug` | Delete post |
| `GET` | `/api/tags` | List all tags |
| `GET` | `/api/tags/:tag` | Posts by tag (paginated) |
| `GET` | `/api/health` | Health check |

## RSS Feed Generation

```typescript
import { LocalAdapter, generateRss } from "@innotekseo/blogs-core";

const rss = await generateRss(new LocalAdapter("./content"), {
  title: "My Blog",
  description: "A blog about things",
  siteUrl: "https://example.com",
});
// Returns RSS 2.0 XML string
```

## Client-Side Search

```typescript
import { LocalAdapter, buildSearchIndex } from "@innotekseo/blogs-core";
import { searchIndex } from "@innotekseo/blogs-core/search";

// Build index at build time
const index = await buildSearchIndex(new LocalAdapter("./content"));

// Search at runtime (client-side)
const results = searchIndex(index, "astro tutorial");
// [{ post: { slug, title, ... }, score: 5 }, ...]
```

## Data Types

```typescript
interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  [key: string]: unknown;
}

interface Post extends PostMeta {
  content: string; // raw markdown body
}
```

## Related Packages

| Package | Description |
|---|---|
| [`@innotekseo/cli`](https://www.npmjs.com/package/@innotekseo/cli) | Main GEO/SEO CLI — llms.txt, article scaffolding |
| [`@innotekseo/blogs-components`](https://www.npmjs.com/package/@innotekseo/blogs-components) | Astro UI components for MDX content |
| [`@innotekseo/blogs-migrate`](https://www.npmjs.com/package/@innotekseo/blogs-migrate) | HTML-to-MDX migration CLI |

→ **[Innotek Platform Toolkits](https://innotekseoai.com/platform-toolkits)**

## License

ISC — Innotek Solutions Ltd
