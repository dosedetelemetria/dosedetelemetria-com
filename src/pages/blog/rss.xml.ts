import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  return rss({
    title: "Dose de Telemetria Blog",
    description: "OpenTelemetry e engenharia de observabilidade na prática",
    site: context.site ?? "https://dosedetelemetria.com",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      link: `/blog/${post.data.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>pt-br</language>`,
  });
}
