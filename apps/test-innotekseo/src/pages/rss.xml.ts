import { LocalAdapter, generateRss } from "@innotekseo-blogs/core";

export async function GET() {
  const adapter = new LocalAdapter("./src/content/posts");
  const rss = await generateRss(adapter, {
    title: "innotekseo-blogs Demo",
    description: "A demo blog built with innotekseo-blogs",
    siteUrl: "https://example.com",
  });

  return new Response(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
