import { productData, type Product } from './product-data';

export function courseSchema(product: Product) {
  const url = `https://dosedetelemetria.com/products/${product.slug}/`;
  return {
    '@context': 'https://schema.org', '@type': 'Course',
    name: product.title, description: product.fullDescription, inLanguage: 'pt-BR', url,
    provider: { '@type': 'Organization', '@id': 'https://dosedetelemetria.com/#organization', name: 'Dose de Telemetria', url: 'https://dosedetelemetria.com/' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', duration: product.id === 'trilha' ? 'P365D' : 'P8W' },
    offers: { '@type': 'Offer', url, price: String(Number(product.price.replace(/[^\d,]/g, '').replace(',', '.'))), priceCurrency: 'BRL', availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  };
}

export const seoData = {
  blog: {
    title: 'Blog de OpenTelemetry e observabilidade',
    description: 'Artigos em português sobre OpenTelemetry, telemetria, monitoramento e engenharia de observabilidade.',
    keywords: 'OpenTelemetry, observabilidade, Collector, instrumentação',
  },
  home: {
    title: "Cursos de OpenTelemetry em português",
    description: "Aprenda OpenTelemetry com cursos em português, projetos práticos e orientação de contribuidores do projeto.",
    keywords: "treinamento OpenTelemetry, curso OTel, treinamento observabilidade, curso rastreamento distribuído, instrumentação telemetria, certificação OpenTelemetry",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://dosedetelemetria.com/#organization",
"name": "Dose de Telemetria",
      "url": "https://dosedetelemetria.com",
      "logo": "https://dosedetelemetria.com/logo.svg",
      "description": "Treinamento e educação especializada em OpenTelemetry",
      "sameAs": [
        "https://www.youtube.com/@DoseDeTelemetria",
        "https://www.linkedin.com/company/dosetelemetria"
      ]
    }
  },
  products: {
    title: "Cursos e especialização em OpenTelemetry",
    description: "Compare os cursos de OpenTelemetry em português: conteúdo, preços e situação das matrículas.",
    keywords: "curso OpenTelemetry, especialização OTel, certificação observabilidade, programa treinamento OpenTelemetry",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Cursos de Treinamento OpenTelemetry",
      "description": "Programas abrangentes de treinamento em OpenTelemetry",
      itemListElement: productData.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: `https://dosedetelemetria.com/products/${product.slug}/`, item: courseSchema(product) }))
    }
  },
  otelTrack: {
    title: "Trilha OTel: curso de OpenTelemetry",
    description: "Aprenda OpenTelemetry no seu ritmo: API, SDK, Collector e projetos práticos. Curso em português. Em breve.",
    keywords: "curso OpenTelemetry, trilha OTel, aprendizado próprio ritmo, curso observabilidade, treinamento telemetria, certificação OpenTelemetry"
  },
  otelSpecialization: {
    title: "Especialização em OpenTelemetry",
    description: "Programa de 8 semanas com mentoria e projetos práticos de OpenTelemetry. Matrículas encerradas.",
    keywords: "especialização OpenTelemetry, treinamento intensivo OTel, mentoria observabilidade, treinamento especialista OpenTelemetry"
  }
};
