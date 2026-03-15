# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**innotekseo-blogs** is a modular monorepo (npm workspaces) for building blog systems with Astro. It provides content adapters (local files, Strapi CMS, Contentful CMS), UI components for MDX, a migration CLI, and a REST API for content injection.

- **GitHub:** `https://github.com/innotekseoai/innotekseo-blogs`
- **Live demo:** `https://blogs.innotekseoai.com` (GitHub Pages, deployed from `apps/test-innotekseo`)
- **Origin:** Rebranded from `astro-blogs` (`D:/repos/astro-blogs` is the source)

---

## Common Commands

```bash
# Root — install all workspace deps
npm install

# Build all packages (--if-present skips components which has no build step)
npm run build

# Run all workspace tests (301 tests across 16 files)
npm test

# Build a single package
cd packages/core && npm run build    # TypeScript -> dist/
cd packages/cli && npm run build

# Run tests for a single package
cd packages/core && npx vitest run
cd packages/cli && npx vitest run
cd packages/components && npx vitest run

# Migration CLI (after build)
npx innotekseo-migrate --url <url> --output ./content --depth 2 --delay 500

# Run demo app (build packages first)
npm run build && cd apps/test-innotekseo && npm run dev
```

---

## File Structure

```
innotekseo-blogs/
├── packages/
│   ├── core/                          @innotekseo/blogs-core
│   │   ├── src/
│   │   │   ├── adapters/
│   │   │   │   ├── local.adapter.ts   LocalAdapter — filesystem r/w, TTL cache
│   │   │   │   ├── strapi.adapter.ts  StrapiAdapter — read-only, Bearer auth
│   │   │   │   └── contentful.adapter.ts  ContentfulAdapter — read-only
│   │   │   ├── server/
│   │   │   │   ├── api.ts             Hono REST API — all routes, auth, webhooks
│   │   │   │   ├── validate.ts        validateMarkdown() — frontmatter validation
│   │   │   │   ├── sanitize.ts        escapeHtml() / sanitizeMeta() — XSS prevention
│   │   │   │   └── index.ts           createApi(), startServer() exports
│   │   │   ├── __tests__/
│   │   │   │   ├── api.test.ts        69 tests — all REST endpoints + auth + CRUD
│   │   │   │   ├── webhook.test.ts    6 tests — webhook delivery + failure resilience
│   │   │   │   ├── local.adapter.test.ts   27 tests
│   │   │   │   ├── strapi.adapter.test.ts  27 tests
│   │   │   │   ├── contentful.adapter.test.ts  18 tests
│   │   │   │   ├── validate.test.ts   21 tests
│   │   │   │   ├── content-service.test.ts  8 tests
│   │   │   │   ├── rss.test.ts        13 tests
│   │   │   │   └── search.test.ts     12 tests
│   │   │   ├── types.ts               All shared TypeScript interfaces
│   │   │   ├── slug.ts                isValidSlug() / assertValidSlug()
│   │   │   ├── rss.ts                 generateRss()
│   │   │   ├── search.ts              buildSearchIndex() / searchIndex()
│   │   │   ├── content-service.ts     ContentService wrapper
│   │   │   └── index.ts               Main barrel export
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts           Excludes dist/**
│   ├── components/                    @innotekseo/blogs-components
│   │   ├── src/
│   │   │   ├── Card.astro             ib-card, ib-card-body, ib-card-title, ib-card-image
│   │   │   ├── Grid.astro             ib-grid, ib-grid--2/3/4
│   │   │   ├── Tabs.astro             ib-tabs, ib-tab-btn, ib-tab-panel (ARIA + keyboard)
│   │   │   ├── Button.astro           ib-btn, ib-btn--{primary,secondary,outline}, ib-btn--{sm,md,lg}
│   │   │   ├── PostLayout.astro       ib-post, ib-post-header/title/meta/content/tags (SEO layout)
│   │   │   ├── mdx-components.ts      Barrel: exports Card, Grid, Tabs, Button
│   │   │   └── __tests__/
│   │   │       └── components.test.ts  34 tests — static source analysis
│   │   ├── package.json               Ships as source .astro (no build step)
│   │   └── vitest.config.ts
│   └── cli/                           @innotekseo/blogs-migrate
│       ├── src/
│       │   ├── bin.ts                 CLI entrypoint, parseArgs(), validateOutputPath()
│       │   ├── crawler.ts             crawlPage(), content extraction
│       │   ├── migrate.ts             crawlSite(), orchestrator
│       │   ├── converter.ts           convertPage(), slugify(), toMdxString()
│       │   ├── images.ts              downloadImages(), extension validation
│       │   ├── types.ts               MigrateOptions, CrawlResult, etc.
│       │   └── __tests__/
│       │       ├── bin.test.ts        23 tests — arg parsing, SSRF, path traversal
│       │       ├── crawler.test.ts    7 tests
│       │       ├── crawl-site.test.ts 7 tests
│       │       ├── migrate.test.ts    6 tests
│       │       ├── images.test.ts     10 tests
│       │       └── converter.test.ts  13 tests
│       ├── package.json               bin: innotekseo-migrate
│       └── tsconfig.json
├── apps/
│   └── test-innotekseo/               Demo Astro app → blogs.innotekseoai.com
│       ├── src/pages/
│       │   ├── index.astro            Post list with Grid + Card
│       │   ├── posts/[slug].astro     Post page with PostLayout
│       │   ├── rss.xml.ts             RSS feed endpoint
│       │   ├── search.astro           Client-side search page
│       │   ├── search.json.ts         Search index endpoint
│       │   └── tags/
│       │       ├── index.astro        All tags listing
│       │       └── [tag].astro        Posts by tag
│       ├── src/content/posts/         Sample .mdx files (hello-world, using-components)
│       ├── public/CNAME               blogs.innotekseoai.com
│       └── astro.config.mjs           site: https://blogs.innotekseoai.com
├── docs/
│   ├── guide-core-api.md              Core library & API usage guide
│   ├── guide-migration.md             Migration CLI guide
│   └── ArchReview.md                  Technical architecture review (grade B+)
├── .github/workflows/
│   ├── ci.yml                         Test on Node 20 + 22 matrix (push + PR)
│   └── deploy.yml                     Build + deploy to GitHub Pages (push to master)
├── .nvmrc                             Node 20
├── package.json                       npm workspaces root
└── tsconfig.json                      Shared TypeScript config
```

---

## Architecture

### ContentAdapter Interface (`packages/core/src/types.ts`)

The core abstraction — a TypeScript interface (not a base class) with 7 methods:

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

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  [key: string]: unknown;   // extensible frontmatter
}

interface Post extends PostMeta { content: string; }
interface SaveResult   { success: boolean; slug: string; }
interface DeleteResult { success: boolean; slug: string; }
interface PaginatedResult<T> { data: T[]; total: number; page: number; limit: number; totalPages: number; }
```

### LocalAdapter (`packages/core/src/adapters/local.adapter.ts`)

```typescript
const adapter = new LocalAdapter("./content");
const adapter = new LocalAdapter("./content", { cacheTtlMs: 10000 });
```

- Reads `.md` and `.mdx` files; resolveFile() tries `.mdx` first, then `.md`
- TTL cache (default 5s) — `CacheEntry { posts, timestamp }` — avoids redundant fs scans
- Cache invalidated on every `savePost()` / `deletePost()` via `invalidateCache()`
- `getPosts()` returns posts sorted by date descending
- `assertValidSlug()` called on `getPost`, `savePost`, `deletePost`, `postExists`
- `savePost()` calls `fs.mkdir(contentDir, { recursive: true })` — creates dir on first write
- `postExists()` swallows all errors and returns false (never throws)
- `deletePost()` throws if file not found (caught by API layer → 404)

### StrapiAdapter (`packages/core/src/adapters/strapi.adapter.ts`)

- Read-only: `savePost()` and `deletePost()` throw descriptive errors
- Bearer token auth via `Authorization: Bearer <token>`
- Distinguishes 401 (unauthorized) from 403 (forbidden) from 404 (not found)
- Maps Strapi relational `tags` field to flat `string[]`
- Injectable `fetchFn` for testability — no `vi.mock()` needed
- `assertValidSlug()` enforced on all read operations

### ContentfulAdapter (`packages/core/src/adapters/contentful.adapter.ts`)

- Read-only: `savePost()` and `deletePost()` throw descriptive errors
- Config: `{ spaceId, accessToken, environment?, contentType?, host? }`
- Defaults: `environment = "master"`, `contentType = "blogPost"`
- Falls back to `sys.id` when `slug` field is missing from entry
- Injectable `fetchFn` for testability

### ContentService (`packages/core/src/content-service.ts`)

Thin wrapper enabling runtime adapter swapping:

```typescript
const service = new ContentService(new LocalAdapter("./content"));
service.setAdapter(new StrapiAdapter({ url: "...", token: "..." }));
```

---

## Export Paths (core)

```
@innotekseo/blogs-core                      → ContentService, all adapters, types, slug utils
@innotekseo/blogs-core/adapters/local       → LocalAdapter
@innotekseo/blogs-core/adapters/strapi      → StrapiAdapter
@innotekseo/blogs-core/adapters/contentful  → ContentfulAdapter
@innotekseo/blogs-core/rss                  → generateRss()
@innotekseo/blogs-core/search               → buildSearchIndex(), searchIndex()
@innotekseo/blogs-core/server               → createApi(), startServer(), validateMarkdown()
```

---

## Key Patterns & Gotchas

- **No axios** — all HTTP is native `fetch` (Node 20+ required)
- **Hono HEAD routes** — use `.on("HEAD", path, handler)`, NOT `.head()` (doesn't exist in Hono)
- **`createApi()` returns Hono app** — testable with `app.fetch(new Request(...))`, no port binding needed
- **Injectable fetchFn** — StrapiAdapter, ContentfulAdapter, and CLI crawler all accept `fetchFn?` as constructor/function arg; pass a mock function in tests instead of `vi.mock()`
- **CSS prefix is `ib-`** (not `ab-`) — all component classes: `ib-card`, `ib-grid`, `ib-tabs`, `ib-tab-btn`, `ib-tab-panel`, `ib-btn`, `ib-post`
- **Tabs class pitfall** — the button class is `ib-tab-btn` (NOT `ib-tabs-btn`). The sed rebrand from `ab-tab-btn` initially mangled it to `*tib-btn` due to substring collision; was fixed manually.
- **`dist/` excluded** from vitest via config — prevents double-running compiled tests
- **Slug validation regex** — `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase alphanumeric + hyphens, no leading/trailing hyphens
- **Webhooks are fire-and-forget** — `fireWebhook()` calls `fetch()` but never awaits it in the request path; failures are console.error'd only
- **bin.ts execution guard** — `process.argv[1]?.replace(/\.ts$/, ".js").endsWith("bin.js")` — prevents `process.exit()` when imported in tests

---

## API Routes (`packages/core/src/server/api.ts`)

```
GET    /api/health              → { status: "ok", timestamp }
GET    /api/posts               → PaginatedResult<PostMeta>  (+ query params below)
GET    /api/posts/:slug         → Post (with content field)
HEAD   /api/posts/:slug         → 200 or 404, no body
POST   /api/posts               → 201 created | 409 conflict | 400 validation  [auth*]
PUT    /api/posts/:slug         → 200 updated | 404 not found | 400 validation  [auth*]
DELETE /api/posts/:slug         → 200 deleted | 404 not found                  [auth*]
GET    /api/tags                → string[] sorted alphabetically
GET    /api/tags/:tag           → PaginatedResult<PostMeta>
POST   /api/inject              → 201 upsert (no conflict check)               [auth*]
```

*Auth required only when `apiKey` is configured on `createApi()`.

### Query params for `GET /api/posts`

| Param | Default | Behaviour |
|---|---|---|
| `page` | 1 | Clamped to valid range (never errors on out-of-range) |
| `limit` | 20 | Min 1, max 100. Invalid/zero → falls back to 20. Negative → clamped to 1. |
| `tag` | — | Calls `adapter.getPostsByTag(tag)` instead of `adapter.getPosts()` |
| `search` | — | Case-insensitive filter on `title` and `description` (after tag filter) |
| `sort` | `desc` | `asc` re-sorts slice by date ascending. Default is already desc from adapter. |

### Authentication

```typescript
createApi({ adapter, apiKey: "secret" })
```

- When `apiKey` set: POST/PUT/DELETE on `/api/posts`, `/api/posts/*`, and `/api/inject` require auth
- GET and HEAD are always public
- Accepted headers: `Authorization: Bearer <key>` OR `x-api-key: <key>`
- Wrong/missing key → `401 { error: "Unauthorized" }`
- When `apiKey` not set: all mutations are open (local dev default)

### POST/PUT request body

```json
{ "slug": "my-post", "markdown": "---\ntitle: \"...\"\ndate: \"...\"\n---\n\nBody." }
```

PUT only needs `markdown` (slug from URL). POST needs both.

### Error response shapes

```json
{ "error": "Description" }
{ "error": "Validation failed", "details": ["Missing required frontmatter field: \"title\""] }
```

| Status | When |
|---|---|
| 400 | Missing/invalid slug, missing markdown, frontmatter validation failure |
| 401 | Missing/wrong API key on mutation |
| 404 | Post not found (GET single, PUT, DELETE) |
| 409 | Slug already exists on POST /api/posts |
| 500 | Unhandled adapter error |

---

## Validation (`packages/core/src/server/validate.ts`)

`validateMarkdown(markdown: string): ValidationResult`

Rules checked in order:
1. Must be a non-empty string
2. Max 10MB (10 × 1024 × 1024 bytes)
3. Parseable by `gray-matter` (valid YAML frontmatter delimiters)
4. Frontmatter must exist (non-empty `data` object)
5. `title` field required
6. `date` (if present) must pass `Date.parse()` — NaN → error
7. `tags` (if present) must be an array
8. Markdown body (after frontmatter) must be non-empty after `.trim()`

Returns `{ valid, errors[], data?, content? }`.

---

## Sanitization (`packages/core/src/server/sanitize.ts`)

`escapeHtml(str)` — replaces `& < > " '` with HTML entities.

`sanitizeMeta(data)` — iterates all keys of a PostMeta/Post object, escapes string values except the `content` field (MDX body is intentionally raw).

Applied to every API response that returns post data.

---

## Slug Validation (`packages/core/src/slug.ts`)

```typescript
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
isValidSlug(slug): boolean
assertValidSlug(slug): void   // throws on invalid
```

Enforced at:
- API layer: `validateSlugInput()` in `POST /api/posts` and `POST /api/inject`
- LocalAdapter: `getPost`, `savePost`, `deletePost`, `postExists`
- StrapiAdapter: all read methods
- ContentfulAdapter: all read methods

Valid: `hello`, `hello-world`, `post-123`, `a1b2c3`
Invalid: `UPPER`, `has spaces`, `hello_world`, `-leading`, `trailing-`, `hello--double`

---

## Webhooks

Fired on: `content.created` (POST), `content.updated` (PUT), `content.deleted` (DELETE), `content.injected` (POST /api/inject).

Payload:
```json
{ "event": "content.created", "slug": "my-post", "timestamp": "2024-01-15T00:00:00.000Z" }
```

- 10-second timeout via `AbortSignal.timeout(10000)`
- Fire-and-forget: errors are `console.error`'d, never block the response
- Not fired when `webhookUrl` is undefined
- Tests mock `globalThis.fetch` directly (not `vi.mock`) and use `await new Promise(r => setTimeout(r, 50))` to let the microtask queue drain

---

## Components (`packages/components/src/`)

All use scoped CSS with `ib-` prefix. Ships as source `.astro` files — no build step, Astro's pipeline processes them.

| Component | Key CSS classes | Notes |
|---|---|---|
| `Card.astro` | `ib-card`, `ib-card-body`, `ib-card-title`, `ib-card-image` | Renders `<a>` when `href` prop provided |
| `Grid.astro` | `ib-grid`, `ib-grid--2`, `ib-grid--3`, `ib-grid--4` | Responsive, collapses at 768px |
| `Tabs.astro` | `ib-tabs`, `ib-tabs-headers`, `ib-tab-btn`, `ib-tab-panel`, `ib-tabs-slot` | Full ARIA: `role=tab/tabpanel`, `aria-controls`, `aria-selected`, `aria-labelledby`. Keyboard: ArrowRight/Left/Home/End. `focus-visible` styles. Vanilla JS. |
| `Button.astro` | `ib-btn`, `ib-btn--{primary,secondary,outline}`, `ib-btn--{sm,md,lg}` | |
| `PostLayout.astro` | `ib-post`, `ib-post-header`, `ib-post-title`, `ib-post-meta`, `ib-post-content`, `ib-post-tags`, `ib-post-tag`, `ib-post-author` | Open Graph, Twitter Card, JSON-LD Article schema, canonical URL, `<time datetime>`, `<article>` semantic |

PostLayout SEO meta outputs: `og:title`, `og:type`, `og:description`, `og:image`, `og:url`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `article:published_time`, `article:tag` (per tag), `application/ld+json` with `schema.org/Article`.

---

## Security Layers

### API
- **Slug validation** — `^[a-z0-9]+(?:-[a-z0-9]+)*$` at API + all adapter layers (path traversal prevention)
- **Frontmatter validation** — required fields, type checks
- **Size limit** — 10MB max markdown (DoS prevention)
- **HTML sanitization** — `escapeHtml()` on all string frontmatter fields in responses (XSS)
- **Optional API key** — Bearer + x-api-key on mutations; GET/HEAD always public

### CLI (`packages/cli/src/bin.ts` — `parseArgs()`)

SSRF blocklist checked on `--url` hostname:
- `localhost`, `127.0.0.1`, `0.0.0.0`
- `::1`, `0:0:0:0:0:0:0:1` (IPv6 loopback, brackets stripped before check)
- `file://` and any non-http/https protocol
- `192.168.*`, `10.*`, `172.16.*`–`172.31.*`, `169.254.*` (private ranges)
- `*.local` hostnames

Path traversal: `validateOutputPath()` — `path.resolve(outputDir)` must start with `process.cwd()`

Image validation (`packages/cli/src/images.ts`): extension allowlist `[jpg, png, gif, webp, svg, avif, ico]`, 50MB size limit.

---

## CLI Internals (`packages/cli/src/`)

```
crawlPage(url, fetchFn?)         → CrawlResult { title, content, links[], images[] }
crawlSite(options, onPage, fetchFn?)  → BFS traversal, depth limit, URL dedup, trailing slash normalization
convertPage(page)                → { slug, mdx } — cheerio strips noise, turndown converts
downloadImages(images, dir, fetchFn?) → validates + downloads + rewrites paths
migrate(options)                 → orchestrates all above, writes .mdx files, returns file paths[]
```

Content extraction priority: `<article>` → `<main>` → `.post-content`, `.entry-content`, `.content` → `<body>`

Noise stripped before conversion: `<script>`, `<style>`, `<nav>`, `<footer>`, `<header>`, `<aside>`, `<iframe>`

Slug deduplication: appends `-1`, `-2` for duplicate URLs.

---

## Testing (301 tests, 16 files)

### Test counts

| Package | File | Tests |
|---|---|---|
| core | api.test.ts | 69 |
| core | webhook.test.ts | 6 |
| core | local.adapter.test.ts | 27 |
| core | strapi.adapter.test.ts | 27 |
| core | contentful.adapter.test.ts | 18 |
| core | validate.test.ts | 21 |
| core | content-service.test.ts | 8 |
| core | rss.test.ts | 13 |
| core | search.test.ts | 12 |
| cli | converter.test.ts | 13 |
| cli | crawler.test.ts | 7 |
| cli | crawl-site.test.ts | 7 |
| cli | migrate.test.ts | 6 |
| cli | images.test.ts | 10 |
| cli | bin.test.ts | 23 |
| components | components.test.ts | 34 |

### Testing patterns

**API tests** (`api.test.ts`):
```typescript
// Setup: real LocalAdapter on temp dir, real createApi()
tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "innotekseo-blogs-api-"));
app = createApi({ adapter: new LocalAdapter(tmpDir) });

// Helper: builds Request objects
function req(method, urlPath, body?) { ... }

// Helper: builds valid mdx strings with frontmatter
function mdx(title, { date, tags, description, body } = {}) { ... }

// Call pattern — no running server
const res = await app.fetch(req("GET", "/api/posts"));
const data = await res.json();
```

**Webhook tests** (`webhook.test.ts`):
```typescript
// Mock globalThis.fetch directly
globalThis.fetch = vi.fn(async (input, init) => { ... });

// Fire-and-forget — must drain microtask queue
await app.fetch(req("POST", "/api/posts", { slug, markdown }));
await new Promise(r => setTimeout(r, 50));

expect(webhookCalls[0].body).toMatchObject({ event: "content.created", slug: "test-post" });
```

**Adapter tests**: inject mock `fetchFn` — no `vi.mock()`.

**Filesystem tests**: `os.tmpdir()` + `mkdtemp()` in `beforeEach`, `fs.rm(tmpDir, { recursive: true })` in `afterEach`.

**Component tests**: `fs.readFileSync(componentPath, "utf-8")` → `expect(src).toContain("...")`.

---

## Complex API Test Scenarios

### Pagination edge cases
- `page=999` with 1 post → clamped to `totalPages=1`, returns the 1 post (never errors)
- `limit=500` → clamped to 100
- `limit=0` → falls back to 20 (default)
- `limit=-5` → clamped to 1
- `page=abc&limit=xyz` → both fall back to defaults (parseInt NaN → default)

### Filtering + sorting combinations
- `?tag=js&search=astro` — tag filter applied first (via adapter), then search filter on result
- `?sort=asc` — adapter returns desc by default; API re-sorts ascending via `.slice().sort()`
- Tag filter + pagination: `?tag=astro&search=astro&page=2&limit=3` — all work together

### CRUD lifecycle
1. POST `/api/posts` → 201 (file created on disk)
2. GET `/api/posts/:slug` → 200 with content field
3. GET `/api/posts` → appears in list
4. PUT `/api/posts/:slug` → 200 (file overwritten)
5. GET reflects update (tags, title changed)
6. GET `/api/tags` reflects new tags
7. DELETE `/api/posts/:slug` → 200 (file removed from disk)
8. GET `/api/posts/:slug` → 404
9. GET `/api/posts` → empty list
10. GET `/api/tags` → empty array

### POST /api/inject vs POST /api/posts
- `/api/posts` → 409 if slug exists
- `/api/inject` → always 201, overwrites existing (upsert semantics, no existence check)
- Both run same slug validation and frontmatter validation
- Both fire webhook (different event: `content.created` vs `content.injected`)

### Slug validation (API layer)
Rejected with 400: `UPPER-CASE`, `has spaces`, `hello_world!`, `-leading`, `trailing-`
Accepted: `hello`, `hello-world`, `post-123`, `a1b2c3`, `my-long-post-title`

### Auth scenarios
```
apiKey = "secret-key-123"

GET  /api/posts              → 200  (always public)
HEAD /api/posts/:slug        → 404  (always public, not 401)
POST /api/posts (no header)  → 401
POST /api/posts (Bearer wrong-key) → 401
POST /api/posts (Authorization: Bearer secret-key-123) → 201
POST /api/posts (x-api-key: secret-key-123) → 201
POST /api/inject (no header) → 401

No apiKey configured:
POST /api/posts              → 201  (open, no auth check)
```

### Webhook scenarios
```
webhookUrl set + POST create  → fires { event: "content.created", slug, timestamp }
webhookUrl set + PUT update   → fires { event: "content.updated", slug, timestamp }
webhookUrl set + DELETE       → fires { event: "content.deleted", slug, timestamp }
webhookUrl set + POST inject  → fires { event: "content.injected", slug, timestamp }
webhookUrl not set            → globalThis.fetch NOT called at all
webhook throws network error  → API still returns 201, error console.error'd
```

---

## CI/CD

### CI (`ci.yml`) — runs on push + PR to `master`
- Node 20 and 22 matrix
- `npm ci` → `npm run build` → `npm test`
- Verifies clean working directory after build (no uncommitted artifacts)

### Deploy (`deploy.yml`) — runs on push to `master`
- `npm ci` → `npm run build` (packages) → `cd apps/test-innotekseo && npm run build`
- Uploads `apps/test-innotekseo/dist` to GitHub Pages
- Custom domain: `blogs.innotekseoai.com` (CNAME file in `public/`)
- GitHub Pages setting: Source = GitHub Actions

---

## Dependencies (5 total)

| Package | Where | Purpose |
|---|---|---|
| `hono` | core | REST API routing |
| `@hono/node-server` | core | HTTP server wrapper for Node |
| `gray-matter` | core | Frontmatter parsing (YAML) |
| `cheerio` | cli | Server-side HTML parsing |
| `turndown` | cli | HTML-to-Markdown conversion |

All packages: `"type": "module"`, `"engines": { "node": ">=20.0.0" }`, Vitest v4.

---

## Rebrand Notes (astro-blogs → innotekseo-blogs)

This repo was cloned and rebranded from `D:/repos/astro-blogs`. Changes applied:
- `@astro-blogs/` → `@innotekseo-blogs/` → `@innotekseo/blogs-*` (all package scopes)
- `astro-blogs-migrate` → `innotekseo-migrate` (CLI binary)
- `ab-` → `ib-` (CSS class prefix in all `.astro` files and test assertions)
- `apps/test-local/` → `apps/test-innotekseo/`

**Known sed collision fixed manually:** `ab-tab-btn` was mangled to `*tib-btn` because the sed pattern `s|ab-btn|ib-btn|g` matched the substring `ab-btn` inside `tab-btn`. Correct class is `ib-tab-btn` in `Tabs.astro` and `components.test.ts`.
