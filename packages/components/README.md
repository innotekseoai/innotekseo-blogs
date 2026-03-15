# @innotekseo/blogs-components

> Astro UI components for MDX blog content — Card, Grid, Tabs, Button, and PostLayout with full SEO metadata.

Part of the **[Innotek Platform Toolkits](https://innotekseoai.com/platform-toolkits)** — open-source tools for AI-era content discoverability.

**GitHub:** [innotekseoai/innotekseo-blogs](https://github.com/innotekseoai/innotekseo-blogs) · `packages/components`

## Install

```bash
npm install @innotekseo/blogs-components
```

**Peer dependency:** `astro ^4.0.0 || ^5.0.0`

## Components

| Component | Description |
|---|---|
| `Card.astro` | Content card with optional image, title, and link. Uses `<a>` when `href` is provided. |
| `Grid.astro` | Responsive grid layout (2/3/4 columns). Collapses to single column on mobile. |
| `Tabs.astro` | Interactive tabbed content. Full ARIA support, keyboard navigation (Arrow, Home/End). |
| `Button.astro` | Link or button element. Variants: `primary`, `secondary`, `outline`. Sizes: `sm`, `md`, `lg`. |
| `PostLayout.astro` | Full blog post layout — Open Graph, Twitter Card, JSON-LD Article schema, canonical URL, tag pills, prose typography. |

All components use **scoped CSS** with an `ib-` class prefix — no Tailwind or external CSS framework required.

## Usage in MDX

**Explicit imports:**

```mdx
---
layout: '@innotekseo/blogs-components/PostLayout.astro'
title: "My Post"
date: "2024-01-15"
tags: ["astro", "tutorial"]
---
import Card from '@innotekseo/blogs-components/Card.astro';
import Grid from '@innotekseo/blogs-components/Grid.astro';

<Grid columns={3}>
  <Card title="Fast" image="/img/fast.png">Built on Astro SSG</Card>
  <Card title="Flexible">Any CMS backend</Card>
  <Card title="Rich">MDX components</Card>
</Grid>
```

**Barrel import:**

```typescript
import { Card, Grid, Tabs, Button } from '@innotekseo/blogs-components/mdx';
```

## PostLayout Props

```typescript
interface Props {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  image?: string;
  author?: string;
  canonicalUrl?: string;
  siteName?: string;
}
```

## Export Paths

```
@innotekseo/blogs-components/Card.astro
@innotekseo/blogs-components/Grid.astro
@innotekseo/blogs-components/Tabs.astro
@innotekseo/blogs-components/Button.astro
@innotekseo/blogs-components/PostLayout.astro
@innotekseo/blogs-components/mdx        → { Card, Grid, Tabs, Button }
```

## Related Packages

| Package | Description |
|---|---|
| [`@innotekseo/cli`](https://www.npmjs.com/package/@innotekseo/cli) | Main GEO/SEO CLI — llms.txt, article scaffolding |
| [`@innotekseo/blogs-core`](https://www.npmjs.com/package/@innotekseo/blogs-core) | Content adapter library + REST API |
| [`@innotekseo/blogs-migrate`](https://www.npmjs.com/package/@innotekseo/blogs-migrate) | HTML-to-MDX migration CLI |

→ **[Innotek Platform Toolkits](https://innotekseoai.com/platform-toolkits)**

## License

ISC — Innotek Solutions Ltd
