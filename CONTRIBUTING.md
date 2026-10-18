# Contribuindo com Dose de Telemetria

Atualize sua referência de `origin/main` antes de começar. Preserve mudanças
locais não relacionadas e use Bun para dependências e scripts.

## Conteúdo e metadados

- Preserve os textos em português, os preços em BRL e a disponibilidade do catálogo.
  Certificado de conclusão não significa certificação CNCF OTCA.
- Mantenha informações importantes e links no HTML, legíveis sem JavaScript.
- Use o layout compartilhado com título único de até 60 caracteres e descrição
  única de até 125 caracteres. Esses limites são editoriais do site.
- Use URLs canônicas HTTPS em `dosedetelemetria.com`, sem parâmetros ou fragmentos
  e com barra final. Atualize links internos e redirecionamentos ao mover páginas.
- Declare `noindex` para exclusões intencionais. A página 404 deve manter o status
  HTTP 404 e ficar fora do sitemap. Não use um fallback de SPA para páginas ausentes.
- Dados estruturados devem descrever conteúdo visível. Não invente notas, avaliações,
  credenciais, preços ou disponibilidade.
- O sitemap e as versões Markdown são gerados do HTML em `bun run build`.
  Não edite `dist/`. Confira links, tabelas e o conteúdo de `/llms-full.txt`.

## Imagens sociais

Cada página HTML, inclusive a 404, precisa de uma entrada em `src/data/og-cards.json`
e de um PNG exclusivo de 1200 × 630 em `public/og/`. Inclua texto alternativo útil.
O renderizador usa a marca amarela, o logo e a fonte Inter incluídos no repositório.

```sh
python3 scripts/og-image/render.py setup
python3 scripts/og-image/render.py batch
```

Para renderizar uma imagem isolada, use `render --headline 'Título *em destaque*'
--body 'Descrição curta' --label 'TEMA' --out public/og/exemplo.png`.
O ambiente Python padrão fica em `/tmp/dosedetelemetria-og-venv`; `OG_IMAGE_VENV`
permite escolher um diretório persistente. Verifique as imagens em tamanho real
e como pequenas prévias, incluindo acentos, legibilidade e ausência de cortes.

## Acessibilidade e desempenho

Use um H1 por página, títulos sequenciais, controles rotulados, foco visível e
navegação por teclado. Preserve o link de pular para o conteúdo e o menu móvel.
Imagens devem reservar espaço; não atrase a imagem principal com lazy loading.
Respeite a preferência por movimento reduzido. Verifique desktop e celular.
Para mudanças de layout, fontes, imagens ou hidratação, registre uma medição
móvel de Lighthouse, as condições e as limitações da medição.

## Validação e revisão

Execute na ordem:

```sh
bun install --frozen-lockfile
bun run lint
bun run type-check
bun run build
bun run test:seo
bunx wrangler deploy --dry-run --outdir /tmp/dosedetelemetria-worker
```

Os testes conferem metadados, idioma, imagens sociais, identidade do site,
sitemap, Markdown, preços e matrícula fechada. Não substituem revisão editorial,
acessibilidade ou teste de envio real dos formulários.

Antes do commit, faça uma revisão de simplicidade e uma revisão independente.
Use Conventional Commits e registre os resultados e limitações no pull request.
Verifique na prévia Cloudflare os status HTTP, redirecionamentos, imagens,
negociação por `Accept: text/markdown`, `Vary: Accept` e formulários. A prévia
Astro não executa o Worker. Nunca inclua credenciais privilegiadas, dados de alunos
ou leads no repositório.
