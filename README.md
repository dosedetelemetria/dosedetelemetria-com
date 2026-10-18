# Dose de Telemetria

Website de cursos de OpenTelemetry em português da Dose de Telemetria.
Construído com Astro 6, React 19, TypeScript 6 e Tailwind CSS 4.

## Desenvolvimento

Use Bun para instalar dependências e executar os comandos:

```sh
bun install --frozen-lockfile
bun run dev
```

O servidor local atende em `http://localhost:4321`.

| Comando | Finalidade |
| --- | --- |
| `bun run lint` | Diagnósticos do Astro |
| `bun run type-check` | Verificação de TypeScript |
| `bun run build` | Site estático, sitemap e versões Markdown |
| `bun run test:seo` | Metadados, imagens, sitemap, exportações e respostas do Worker |
| `bun run preview` | Prévia do HTML estático |
| `bun run deploy` | Build e publicação no Cloudflare Workers |

## Estrutura

- `src/pages/`: páginas Astro, blog, feed RSS e guia `/llms.txt`.
- `src/content/blog/`: artigos em Markdown; veja [o guia do blog](docs/blog-authoring.md).
- `src/layouts/Layout.astro`: idioma, navegação, acessibilidade e metadados.
- `src/components/astro/SEO.astro`: URLs canônicas, imagens sociais e dados estruturados.
- `src/data/product-data.ts`: catálogo, preços e disponibilidade dos cursos.
- `src/data/seo-data.ts`: textos de busca e dados estruturados dos cursos.
- `src/data/og-cards.json` e `public/og/`: catálogo e imagens sociais de cada página.
- `scripts/`: geração e validação das exportações, renderização das imagens sociais.
- `worker/index.js`: negociação de HTML/Markdown e redirecionamento de www.
- `wrangler.jsonc`: configuração do Cloudflare Worker e seus arquivos estáticos.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para mudanças públicas e
[docs/deployment.md](docs/deployment.md) para publicação, prévias e rollback.
