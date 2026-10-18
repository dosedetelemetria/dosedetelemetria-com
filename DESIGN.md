# Sistema visual da Dose de Telemetria

O site compartilha a base visual do Dropzone com a marca portuguesa Dose de
Telemetria: superfícies escuras, amarelo com texto escuro e rótulos em creme.
O catálogo e os artigos mantêm seus dados e conteúdo próprios.

## Referências

A adaptação usa Telemetry Drops `933e357` e o app
`telemetrydrops/dropzone-app` na revisão
`e829cc4be88237ea044ac832ee4edee8f925b20a`. As fontes são
`src/styles/globals.css`, `src/styles/brands.css` e o Storybook do app com
`locale: pt` e `brand: dose`. O catálogo não é publicado pela release do app.
As referências renderizadas são Foundations/Design Tokens, UI/Button,
UI/Forms e Course/CourseCard, incluindo conteúdo longo e estados desabilitados.

## Paleta e componentes

`src/styles/global.css` contém os tokens e as utilidades compartilhadas.

| Papel | Valor |
| --- | --- |
| Base / superfície / elevada | `#0A0A0A` / `#121212` / `#1A1A1A` |
| Sobreposição / hover / campos | `#242424` / `#2A2A2A` / `#1E1E1E` |
| Texto / texto secundário | `#FAFAFA` / `#A1A1AA` |
| Marca / rótulos de apoio | `#FFC107` / `#FEF3C7` |
| Bordas / bordas fortes | Branco a 8% / 16% |
| Ação principal | Amarelo com texto escuro; hover com mistura de 10% de branco |
| Foco | Contorno amarelo com separação do controle |
| Tipografia | Inter variável local; fonte do sistema como fallback |
| Cantos | Controles de 10px e cartões de 12px |

O token `primary` do website significa ação; no app, `--color-primary` significa
texto principal. A semântica dos componentes shadcn do website é preservada.
A paleta amarela já tem contraste com texto escuro; não usa o laranja escurecido
necessário para ações com texto claro no website inglês.

`site-button` e suas variantes alinham links Astro aos controles React de
`src/components/ui/button.tsx`. Os cartões usam superfícies sólidas, sem blur
ou halo decorativo. As imagens sociais e ilustrações dos artigos têm seus
próprios assets e permanecem independentes dos tokens de interface.

Inter é servido em `public/fonts/inter-latin.woff2`, com a licença SIL OFL ao
lado. O subconjunto cobre os caracteres usados pelo português. Os títulos de
marketing são maiores que os títulos do app; o conteúdo técnico tem largura
restrita e código com rolagem horizontal. Metadados mantêm contraste de leitura.

## Navegação e leitura

A navegação principal contém Início, Produtos e Blog. O menu compacto atende
larguras abaixo de 1024px, mantém o foco dentro dos controles abertos e fecha
com Escape ou ao entrar no layout desktop. Os links sociais permanecem nas
seções de contato e no rodapé.

O formulário da lista de interesse é renderizado no HTML e hidratado quando
visível, inclusive por links diretos a `#waitlist`. A submissão fica desabilitada
até a hidratação; matrícula e lista de interesse têm estados distintos.

`BlogCodeBlocks.astro` adiciona um único controle de cópia por bloco, com retorno
anunciado e orientação para cópia manual em caso de falha. Sem JavaScript, o
código continua legível e selecionável. As exportações Markdown preservam
linguagem, recuos e quebras de linha, com cercas que não colidem com o conteúdo.
O sumário de navegação é omitido dessas exportações.


## Descoberta de artigos

O blog destaca o post mais novo, seguido por três artigos recentes e um arquivo
completo por data. O filtro por tema atua somente no arquivo, anuncia a contagem
e mantém links para páginas de tema quando JavaScript está desabilitado.
`BlogPostCard.astro` compartilha imagem e conteúdo entre destaque, cartões e
linhas; as seções usam H2 e os artigos dentro delas usam H3.

As imagens históricas permanecem locais e preservadas. O pipeline `Image` do
Astro produz WebP responsivo em vez de exigir os pares de arquivos públicos do
website inglês. Novas ilustrações seguem [o guia de imagens](docs/blog-images.md).
O amarelo da Dose substitui os acentos laranja do blog inglês; o favicon usa a
mesma cor da marca. As diferenças intencionais incluem tipografia maior para
leitura e foco com contorno, em vez de depender do halo do app.
