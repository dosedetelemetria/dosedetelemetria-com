# Blog em português

Para selecionar uma pauta, use [o guia de candidatos](blog-candidates.md).
[Validação e revisão](blog-validation.md) detalha a evidência técnica;
[o guia de imagens](blog-images.md) define ilustrações e descoberta.

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
responsivos. A mesma imagem aparece na abertura, no destaque, nos cartões recentes,
no arquivo e nas páginas por tema; não a repita no corpo do Markdown. Imagens dentro do texto também usam arquivos locais. Cada artigo e
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

## Evidência técnica e escrita

Comece com um problema concreto, as consequências e um resultado verificável.
Explique a decisão, demonstre o procedimento e explicite os limites. Tutoriais
novos incluem resumo, conclusões práticas e pré-requisitos no texto; os artigos
históricos mantêm seu contrato de migração. Links para cursos devem corresponder
a lições reais e à disponibilidade de `src/data/product-data.ts`.

Use o catálogo e os manifests de `telemetrydrops/dropzone-docs` para referências
a cursos, `telemetrydrops/ai-context` para orientação técnica e
`jpkrohling/content` para inspiração editorial. Inspiração e gravações antigas
não comprovam comportamento atual. Consulte apenas os arquivos pertinentes e
verifique afirmações técnicas em fontes primárias da versão usada.

Execute os comandos publicados, incluindo compilação de código gerado. Para
Collector, confira a release estável ao preparar e antes de publicar; registre
data da consulta, distribuição, versão, digest imutável e versões reais dos
componentes. Extraia os exemplos do próprio artigo para a execução, sem redigir
uma configuração parecida. `validate` comprova aceitação, não entrega ou
sobrevivência dos dados. Siga [os testes comportamentais](blog-validation.md).
Nunca apresente saída esperada como observada.

Use cercas com linguagem e contexto de arquivo. Confira código longo e YAML
multilinha no celular: a rolagem fica no bloco. Teste cópia exata, foco, anúncio
de sucesso e orientação para cópia manual quando o clipboard falhar. Sem
JavaScript, o código permanece selecionável.

## Busca, agentes e publicação

`seoTitle` controla o título de HTML, Open Graph e Twitter; `title` permanece no
H1, RSS e headline do schema. Confira o resultado final de até 60 caracteres,
sem truncamento mecânico ou perda de contexto. O componente compartilhado
acrescenta a marca apenas quando cabe. Metadados sociais devem concordar com o
HTML e apontar para imagens recuperáveis na implantação em revisão.

Explique relações técnicas também em texto e legendas. Ilustrações editoriais
não substituem diagramas com rótulos selecionáveis. Confira o Markdown anunciado
pelo HTML, a resposta a `Accept: text/markdown` e a seção do artigo em
`/llms-full.txt`: títulos, links, tabelas, código, linguagem, espaços, datas e
explicações das figuras precisam sobreviver. Controles de cópia e sumários
duplicados ficam fora da exportação. Uma cerca precisa ser maior que as crases
contidas no exemplo.

Para publicar depois, mantenha o PR aberto e programe uma ação com data, horário
e fuso explícitos. Antes de mesclar, confira escopo, conflitos, testes e revisões;
depois confira artigo, imagens, datas e RSS no domínio público. Não use uma data
futura no frontmatter como agendamento: todos os posts entram no build. Se a
publicação estiver bloqueada, registre a causa e a ação necessária.
