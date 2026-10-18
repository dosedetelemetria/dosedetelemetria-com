import migratedPosts from '../src/data/blog-migration.json' with { type: 'json' };
import previewImages from '../src/lib/preview-images.mjs';
import markdownResponse from '../src/lib/markdown-response.mjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'blog.dosedetelemetria.com') {
      const path = url.pathname.replace(/\/$/, '');
      const slug = path.slice(1).replace(/\.md$/, '');
      let destination;
      if (['', '/archive', '/recommendations', '/members'].includes(path)) destination = '/blog/';
      else if (path === '/rss.xml') destination = '/blog/rss.xml';
      else if (['/sitemap.xml', '/robots.txt'].includes(path)) destination = path;
      else if (migratedPosts.some(post => post.slug === slug)) destination = `/blog/${slug}/${path.endsWith('.md') ? 'index.md' : ''}`;
      else if (path.startsWith('/tag/') && migratedPosts.some(post => post.tags.includes(path.slice(5)))) destination = `/blog/tags/${path.slice(5)}/`;
      if (!destination) return new Response('Página não encontrada. Visite https://dosedetelemetria.com/blog/', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
      return Response.redirect(`https://dosedetelemetria.com${destination}${url.search}`, 301);
    }
    if (url.hostname === 'www.dosedetelemetria.com') {
      url.protocol = 'https:';
      url.hostname = 'dosedetelemetria.com';
      url.port = '';
      return Response.redirect(url.href, 301);
    }
    const response = await markdownResponse(
      request,
      { next: () => env.ASSETS.fetch(request) },
      (assetUrl) => env.ASSETS.fetch(assetUrl),
    ) ?? await env.ASSETS.fetch(request);
    return previewImages(request, response);
  },
};
