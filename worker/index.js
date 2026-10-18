import markdownResponse from '../src/lib/markdown-response.mjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.dosedetelemetria.com') {
      url.protocol = 'https:';
      url.hostname = 'dosedetelemetria.com';
      url.port = '';
      return Response.redirect(url.href, 301);
    }
    return await markdownResponse(
      request,
      { next: () => env.ASSETS.fetch(request) },
      (assetUrl) => env.ASSETS.fetch(assetUrl),
    ) ?? env.ASSETS.fetch(request);
  },
};
