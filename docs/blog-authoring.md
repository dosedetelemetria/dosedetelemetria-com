# Blog em português

Os artigos ficam em `src/content/blog/` e usam a coleção de
`src/content.config.ts`. O site publica `/blog/`, páginas por tema e
`/blog/rss.xml`. A navegação principal, o rodapé, o sitemap e os guias para agentes
permitem descobrir os artigos sem JavaScript.

## Conteúdo e autoria

Cada Markdown declara título, slug, descrição de até 125 caracteres, data de
publicação, autor, temas, imagem de abertura local e texto alternativo. `seoTitle`
permite um título de busca de até 60 caracteres sem encurtar o título visível.
`updatedAt` indica uma revisão real do conteúdo; a migração de hospedagem não
altera as datas editoriais. O autor `juraci` corresponde à identidade em
`src/data/author-data.ts`. Os temas válidos estão em `src/data/tag-data.ts`.

Imagens de abertura ficam em `src/assets/blog/`; Astro gera WebP e tamanhos
responsivos. Imagens dentro do texto também usam arquivos locais. Cada artigo e
página de tema precisa de sua imagem social em `src/data/og-cards.json`, conforme
[CONTRIBUTING.md](../CONTRIBUTING.md). Verifique links, formatação de código,
quebras de verso, imagens e leitura no celular.

## Artigos importados

Os seis artigos de janeiro de 2024 preservam o texto e as datas de Hashnode.
O H1 vem do template, os embeds de YouTube são links comuns e o atributo de
alinhamento específico de Hashnode é substituído por Markdown portátil. Os
arquivos originais de imagem estão no repositório; o site não depende do CDN
de Hashnode para exibi-los. Não há importação de comentários ou dados de membros.

`src/data/blog-migration.json` registra as URLs originais, datas, temas, fragmentos
e checksums dos corpos após essas conversões de formato. Os testes verificam a
integridade da importação. Uma revisão editorial deliberada de um artigo deve
atualizar sua data e os dados de integridade correspondentes.

Os exemplos antigos do artigo sobre custos de logs têm uma nota de contexto
histórico. Sua preservação não significa validação contra versões atuais do
OpenTelemetry. Novos exemplos e revisões técnicas devem citar a versão usada e
ser validados antes da publicação.

`src/lib/rehype-legacy-headings.mjs` preserva os fragmentos `heading-*` em links
antigos. Não remova esses IDs ao revisar os títulos. O Worker usa o mesmo inventário
para redirecionar os artigos, temas e Markdown do host antigo.

## Verificação

Siga a sequência de [CONTRIBUTING.md](../CONTRIBUTING.md). Os testes adicionais
conferem os seis artigos, datas em HTML/schema/RSS, temas, arquivos de imagem,
fragmentos legados, integridade dos corpos e redirecionamentos. Confira também o
índice, sumário, navegação por teclado, apresentação sem JavaScript e a prévia
Cloudflare. `publishedAt` não agenda publicação: o build inclui todos os arquivos
da coleção.
