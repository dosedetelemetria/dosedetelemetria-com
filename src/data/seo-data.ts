export const seoData = {
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
    description: "Compare a Trilha OTel e a Especialização em OTel: cursos em português com projetos práticos. Em breve.",
    keywords: "curso OpenTelemetry, especialização OTel, certificação observabilidade, programa treinamento OpenTelemetry",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Cursos de Treinamento OpenTelemetry",
      "description": "Programas abrangentes de treinamento em OpenTelemetry"
    }
  },
  otelTrack: {
    title: "Trilha OTel: curso de OpenTelemetry",
    description: "Aprenda OpenTelemetry no seu ritmo: API, SDK, Collector e projetos práticos. Curso em português. Em breve.",
    keywords: "curso OpenTelemetry, trilha OTel, aprendizado próprio ritmo, curso observabilidade, treinamento telemetria, certificação OpenTelemetry",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Trilha OTel",
      "description": "Curso completo para aprender OpenTelemetry no seu próprio ritmo",
      "provider": {
        "@type": "Organization",
"name": "Dose de Telemetria"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "duration": "P365D"
      },
      "offers": {
        "@type": "Offer",
        "price": "2397",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/OutOfStock"
      }
    }
  },
  otelSpecialization: {
    title: "Especialização em OpenTelemetry",
    description: "Programa intensivo de 8 semanas com conversas semanais, projetos práticos e feedback personalizado. Em breve.",
    keywords: "especialização OpenTelemetry, treinamento intensivo OTel, mentoria observabilidade, treinamento especialista OpenTelemetry",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Especialização OTel",
      "description": "Treinamento intensivo com conversas semanais e projetos práticos",
      "provider": {
        "@type": "Organization",
        "name": "Dose de Telemetria"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "duration": "P8W"
      },
      "offers": {
        "@type": "Offer",
        "price": "5997",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/OutOfStock"
      }
    }
  }
};
