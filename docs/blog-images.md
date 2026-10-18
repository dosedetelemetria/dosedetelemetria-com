# Imagens de abertura do blog

Cada artigo tem uma ilustração específica, usada uma vez na abertura e também no
destaque, nos cartões recentes, no arquivo e nas páginas por tema. As seis imagens
históricas ficam em `src/assets/blog/` e preservam o acervo. Astro gera WebP com
larguras responsivas; não copie os arquivos de `dist/` para o repositório.

## Direção para novas ilustrações

Use uma natureza-morta editorial 3D tátil: cerâmica ou pedra em carvão fosco,
latão quente e papel creme, com um acento amarelo da Dose. Paleta: preto
`#0A0A0A`, carvão `#1A1A1A`, amarelo `#FFC107` e creme `#FEF3C7`.
Escolha uma metáfora concreta da pergunta central do artigo, composição própria,
silhueta forte, respiro e iluminação lateral suave com sombras físicas.
Mantenha o assunto legível em miniaturas e na região central do recorte 3:2.

Para artigos traduzidos da Telemetry Drops, crie uma versão própria da ilustração
com a ferramenta integrada de edição de imagens; não copie o arquivo inglês sem
alterações. Preserve a metáfora, composição, enquadramento e iluminação; troque
laranja por amarelo `#FFC107` e cobre por latão, mantendo carvão e creme.
Salve o asset local conforme o contrato abaixo, ajuste o texto alternativo e
compare as duas versões na abertura e em miniaturas antes de publicar.

Evite letras, títulos, números, logos, marcas-d'água, controles de interface,
gradientes decorativos, halos e detalhes minúsculos. A arte não comprova uma
promessa técnica; mecanismos precisam de diagramas separados e texto explicativo.

Use a skill de geração de imagens disponível e a ferramenta integrada. Leia o
artigo primeiro e adapte o prompt:

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial blog lead illustration for Dose de Telemetria.
Primary request: [ONE CONCRETE METAPHOR FROM THE ARTICLE].
Style: tactile 3D editorial still life; matte charcoal ceramic,
brushed warm brass and cream paper; crafted objects, strong silhouette,
generous breathing room.
Palette: near-black #0A0A0A, charcoal #1A1A1A, yellow #FFC107,
and warm cream #FEF3C7.
Lighting: soft directional studio light, subtle physical shadows.
Composition: landscape, centered subject readable in small 3:2 thumbnails.
No text, letters, numbers, logos, watermarks, UI, glow or decorative gradients.
Metaphorical editorial art, not a technical diagram.
```

Inspecione o resultado ao lado do acervo. Corrija assunto ambíguo, cortes,
inconsistência de estilo ou sugestões técnicas falsas antes de publicar.

## Arquivos e frontmatter

Guarde o arquivo local em `src/assets/blog/<slug>.webp` com resolução suficiente
para a abertura de até 1200px. Use proporção 3:2 para novas imagens, compressão
sem perda perceptível e texto alternativo que descreva o assunto visível.

```yaml
heroImage: "../../assets/blog/seu-artigo.webp"
heroImageAlt: "Descrição da composição e de sua relação com o assunto."
```

A coleção usa `image()`. Os templates de artigo e `BlogPostCard.astro` usam
`Image` do Astro para gerar tamanhos responsivos; preserve esse contrato em vez
de copiar o esquema de caminhos públicos do website inglês. A abertura e o
destaque carregam imediatamente; os demais cartões usam lazy loading. Reserve
as dimensões e confira o recorte. Não insira a mesma imagem no corpo Markdown.

A ilustração não substitui o PNG social exclusivo de 1200 × 630 registrado em
`src/data/og-cards.json`. Use o renderizador em `scripts/og-image/` conforme
[CONTRIBUTING.md](../CONTRIBUTING.md).

## Verificação

Confira imagens grandes e pequenas, destaque, temas e abertura em desktop e
celular: texto alternativo, recorte, dimensões, seleção responsiva e ausência de
figuras duplicadas. Execute lint, type-check, build e test:seo; registre medição
móvel de desempenho, revisão do app atual e adaptações conforme
[DESIGN.md](../DESIGN.md). Confira URLs de imagem na prévia implantada.
