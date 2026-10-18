import { productData } from '../data/product-data';

export function GET() {
  const courses = productData.map(product =>
    `- [${product.title}](https://dosedetelemetria.com/products/${product.slug}/): ${product.description}. ${product.price}. ${product.available ? 'Disponível' : 'Em breve'}.`
  ).join('\n');
  const body = `# Dose de Telemetria

> Cursos de OpenTelemetry em português, ministrados por Juraci Paixão Kröhling, contribuidor do projeto.

## Quando usar este site

Consulte o catálogo para comparar cursos, conteúdo, preços e disponibilidade. A lista de interesse não é uma matrícula. Certificados de conclusão não equivalem à certificação CNCF OTCA.

## Cursos

${courses}

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
