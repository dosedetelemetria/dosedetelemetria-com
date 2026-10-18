import { getCollection } from 'astro:content';
import { productData } from '../data/product-data';

export async function GET() {
  const posts = (await getCollection('blog')).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const articles = posts.map(post => `- [${post.data.title}](https://dosedetelemetria.com/blog/${post.data.slug}/): ${post.data.description}`).join('\n');
  const courses = productData.map(product =>
    `- [${product.title}](https://dosedetelemetria.com/products/${product.slug}/): ${product.description}. ${product.price}. ${product.availabilityLabel}.`
  ).join('\n');
  const body = `# Dose de Telemetria

> Cursos de OpenTelemetry em português, ministrados por Juraci Paixão Kröhling, contribuidor do projeto.

## Quando usar este site

Consulte o catálogo para comparar cursos, conteúdo, preços e disponibilidade. A lista de interesse não é uma matrícula. Certificados de conclusão não equivalem à certificação CNCF OTCA.

## Cursos

${courses}

## Blog

Artigos originais em português sobre telemetria e observabilidade.

${articles}

[Todos os artigos](https://dosedetelemetria.com/blog/) · [RSS](https://dosedetelemetria.com/blog/rss.xml)

## Informações

- [Início](https://dosedetelemetria.com/): instrutor, cursos e depoimentos.
- [Privacidade](https://dosedetelemetria.com/privacy-policy/)
- [Termos de uso](https://dosedetelemetria.com/terms-of-use/)
- [Informações legais](https://dosedetelemetria.com/imprint/)

## Leitura automatizada

Cada página HTML anuncia uma versão Markdown. Use Accept: text/markdown para negociação. O conteúdo completo está em /llms-full.txt e as páginas indexáveis em /sitemap.xml. Esses arquivos não concedem acesso a aulas ou dados de alunos.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
