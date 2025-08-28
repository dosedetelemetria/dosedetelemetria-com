export interface ProductFeature {
  text: string;
}

export interface DetailedFeature {
  title: string;
  description: string;
}

export interface CurriculumModule {
  title: string;
  lessons: string[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  features: ProductFeature[];
  detailedFeatures: DetailedFeature[];
  curriculum: CurriculumModule[];
  price: string;
  originalPrice?: string;
  discount?: {
    percentage: number;
    label: string;
    couponCode?: string;
  };
  ctaText: string;
  ctaLink: string;
  available: boolean;
  popular?: boolean;
}

export const productData: Product[] = [
  {
    id: "especializacao",
    slug: "especializacao-otel",
    title: "Especialização em OTel",
    description: "Formação intensiva com conversas semanais e projetos práticos",
    fullDescription: "Nossa especialização em OpenTelemetry é um programa imersivo de 8 semanas com conversas semanais, projetos práticos e feedback personalizado dos melhores especialistas do mercado.",
    features: [
      { text: "Turmas com vagas limitadas" },
      { text: "Conversas semanais com especialistas" },
      { text: "Projetos práticos e feedback personalizado" },
      { text: "Certificado de conclusão" },
      { text: "Acesso ao grupo privado de alunos" },
      { text: "Material complementar exclusivo" }
    ],
    detailedFeatures: [
      {
        title: "Conversas semanais",
        description: "Sessões semanais com especialistas onde você pode tirar dúvidas e receber orientação personalizada."
      },
      {
        title: "Projetos práticos",
        description: "Desenvolva projetos reais que simulam ambientes de produção e receba feedback detalhado."
      },
      {
        title: "Comunidade exclusiva",
        description: "Acesso a um grupo privado onde você pode interagir com outros alunos e trocar experiências."
      },
      {
        title: "Certificado reconhecido",
        description: "Ao completar o curso, você recebe um certificado que atesta suas habilidades em OpenTelemetry."
      },
      {
        title: "Material exclusivo",
        description: "Acesso a conteúdos, artigos e recursos que não estão disponíveis em nenhum outro lugar."
      },
      {
        title: "Suporte prioritário",
        description: "Canal direto com os instrutores para resolver dúvidas técnicas durante todo o programa."
      }
    ],
    curriculum: [
      {
        title: "O Básico em 3 Aulas",
        lessons: [
          "Instrumentando uma aplicação",
          "Visualizando a telemetria",
          "Colocando um Collector no meio"
        ]
      },
      {
        title: "Fundamentos",
        lessons: [
          "Problemas que resolvemos",
          "Audiências",
          "Filosofia do projeto",
          "Instrumentação",
          "Telemetria",
          "Observabilidade",
          "Monitoramento",
          "OpenTelemetry",
          "Bônus: Observabilidade 2.0"
        ]
      },
      {
        title: "Sinais da observabilidade",
        lessons: [
          "Logs",
          "Métricas",
          "Rastros",
          "Perfis",
          "Eventos"
        ]
      },
      {
        title: "OTel na prática",
        lessons: [
          "O que vamos observar?",
          "Quais as nossas dores?",
          "Adicionando OTel SDK",
          "Instrumentando nossa inicialização",
          "Observando as chamadas HTTP",
          "Propagando contexto manualmente",
          "Novos trechos, ou eventos?",
          "Entendendo a latência normal entre serviços",
          "Repositório GitHub"
        ]
      },
      {
        title: "Modelo de dados",
        lessons: [
          "Introdução",
          "Atributos",
          "Escopo",
          "Recursos",
          "Contexto",
          "Bagagem",
          "Rastros",
          "Métricas",
          "Logs",
          "Perfis",
          "Bônus: Entidades"
        ]
      },
      {
        title: "OpenTelemetry API",
        lessons: [
          "Eventos",
          "Audiência",
          "Rastreamento",
          "Métricas",
          "Perfis",
          "Log Bridge"
        ]
      },
      {
        title: "OpenTelemetry SDK",
        lessons: [
          "SDKs em detalhes",
          "O básico para sobreviver",
          "Recursos",
          "Rastreamento distribuído",
          "Métricas",
          "Logs",
          "Usando um arquivo de configuração"
        ]
      },
      {
        title: "OpenTelemetry Collector",
        lessons: [
          "Introdução",
          "Tipos de componentes",
          "Obtendo o Collector",
          "Configuração",
          "Agentes vs. Gateways vs. Coletores",
          "Monitorando Collectors",
          "OTTL",
          "Técnicas de resiliência - Filas",
          "Técnicas de resiliência - WAL",
          "Técnicas de resiliência - Mensageria",
          "Segurança - TLS",
          "Segurança - Autenticação",
          "Construindo seu Collector",
          "Connectors: Span Metrics"
        ]
      },
      {
        title: "Extendendo o Collector",
        lessons: [
          "Introdução",
          "Receivers",
          "Processors",
          "Exporters",
          "Extensions",
          "Connectors"
        ]
      },
      {
        title: "OpenTelemetry Operator",
        lessons: [
          "Introdução",
          "Operadores para Kubernetes",
          "CRD - Collector",
          "Modos de operação dos Collectors",
          "Instalação",
          "CRD - Auto-Instrumentação",
          "Target Allocator"
        ]
      },
      {
        title: "OpAMP",
        lessons: [
          "OpAMP"
        ]
      },
      {
        title: "Arquitetura",
        lessons: [
          "Arquitetura - Instrumentação",
          "Arquitetura - Pipeline"
        ]
      },
      {
        title: "Interoperabilidade",
        lessons: [
          "Em breve"
        ]
      },
      {
        title: "Migração",
        lessons: [
          "Em breve"
        ]
      },
      {
        title: "Cultura de observabilidade",
        lessons: [
          "Cultura de observabilidade"
        ]
      }
    ],
    price: "R$ 5.997,00",
    ctaText: "Lista de espera",
    ctaLink: "/waiting-list",
    available: false
  },
  {
    id: "trilha",
    slug: "trilha-otel",
    title: "Trilha OTel",
    description: "Curso completo para aprender no seu ritmo",
    fullDescription: "A Trilha OTel é um curso completo e autoguiado que permite você dominar OpenTelemetry no seu próprio ritmo. Os últimos módulos serão finalizados até o fim de abril.",
    features: [
      { text: "Acesso por um ano às aulas" },
      { text: "Certificado de conclusão" },
      { text: "Conteúdo aprofundado" },
      { text: "Atualizações do conteúdo" }
    ],
    detailedFeatures: [
      {
        title: "Aprenda no seu ritmo",
        description: "Estude quando e onde quiser, com acesso por um ano a todo o conteúdo do curso."
      },
      {
        title: "Conteúdo aprofundado",
        description: "Mais de 50 aulas cobrindo tudo sobre OpenTelemetry."
      },
      {
        title: "Forte base teórica",
        description: "Entenda o 'porquê', além do 'como'."
      },
      {
        title: "Certificado digital",
        description: "Ao completar o curso, você recebe um certificado que pode adicionar ao seu currículo e LinkedIn."
      },
      {
        title: "Além dos aspectos técnicos",
        description: "Saiba sobre arquitetura, migração, cultura de observabilidade."
      },
      {
        title: "Atualizações constantes",
        description: "O curso é atualizado regularmente para acompanhar as novidades do OpenTelemetry."
      }
    ],
    curriculum: [
      {
        title: "O Básico em 3 Aulas",
        lessons: [
          "Instrumentando uma aplicação",
          "Visualizando a telemetria",
          "Colocando um Collector no meio"
        ]
      },
      {
        title: "Fundamentos",
        lessons: [
          "Problemas que resolvemos",
          "Audiências",
          "Filosofia do projeto",
          "Instrumentação",
          "Telemetria",
          "Observabilidade",
          "Monitoramento",
          "OpenTelemetry",
          "Bônus: Observabilidade 2.0"
        ]
      },
      {
        title: "Sinais da observabilidade",
        lessons: [
          "Logs",
          "Métricas",
          "Rastros",
          "Perfis",
          "Eventos"
        ]
      },
      {
        title: "OTel na prática",
        lessons: [
          "O que vamos observar?",
          "Quais as nossas dores?",
          "Adicionando OTel SDK",
          "Instrumentando nossa inicialização",
          "Observando as chamadas HTTP",
          "Propagando contexto manualmente",
          "Novos trechos, ou eventos?",
          "Entendendo a latência normal entre serviços",
          "Repositório GitHub"
        ]
      },
      {
        title: "Modelo de dados",
        lessons: [
          "Introdução",
          "Atributos",
          "Escopo",
          "Recursos",
          "Contexto",
          "Bagagem",
          "Rastros",
          "Métricas",
          "Logs",
          "Perfis",
          "Bônus: Entidades"
        ]
      },
      {
        title: "OpenTelemetry API",
        lessons: [
          "Eventos",
          "Audiência",
          "Rastreamento",
          "Métricas",
          "Perfis",
          "Log Bridge"
        ]
      },
      {
        title: "OpenTelemetry SDK",
        lessons: [
          "SDKs em detalhes",
          "O básico para sobreviver",
          "Recursos",
          "Rastreamento distribuído",
          "Métricas",
          "Logs",
          "Usando um arquivo de configuração"
        ]
      },
      {
        title: "OpenTelemetry Collector",
        lessons: [
          "Introdução",
          "Tipos de componentes",
          "Obtendo o Collector",
          "Configuração",
          "Agentes vs. Gateways vs. Coletores",
          "Monitorando Collectors",
          "OTTL",
          "Técnicas de resiliência - Filas",
          "Técnicas de resiliência - WAL",
          "Técnicas de resiliência - Mensageria",
          "Segurança - TLS",
          "Segurança - Autenticação",
          "Construindo seu Collector",
          "Connectors: Span Metrics"
        ]
      },
      {
        title: "Extendendo o Collector",
        lessons: [
          "Introdução",
          "Receivers",
          "Processors",
          "Exporters",
          "Extensions",
          "Connectors"
        ]
      },
      {
        title: "OpenTelemetry Operator",
        lessons: [
          "Introdução",
          "Operadores para Kubernetes",
          "CRD - Collector",
          "Modos de operação dos Collectors",
          "Instalação",
          "CRD - Auto-Instrumentação",
          "Target Allocator"
        ]
      },
      {
        title: "OpAMP",
        lessons: [
          "OpAMP"
        ]
      },
      {
        title: "Arquitetura",
        lessons: [
          "Arquitetura - Instrumentação",
          "Arquitetura - Pipeline"
        ]
      },
      {
        title: "Interoperabilidade",
        lessons: [
          "Em breve"
        ]
      },
      {
        title: "Migração",
        lessons: [
          "Em breve"
        ]
      },
      {
        title: "Cultura de observabilidade",
        lessons: [
          "Cultura de observabilidade"
        ]
      }
    ],
    price: "R$ 2.397,00",
    ctaText: "Lista de espera",
    ctaLink: "/waiting-list",
    available: false
  }
];

// For linking testimonials to specific products
export const productTestimonialMapping = {
  "especializacao": ["claudio", "willian", "rafael"],
  "trilha": ["mateus", "willian", "claudio"]
};

// Helper functions to get testimonials
export function getTestimonialsForProduct(productId: string): string[] {
  return productTestimonialMapping[productId as keyof typeof productTestimonialMapping] || [];
}

export function getRandomTestimonialIds(count: number): string[] {
  const allTestimonials = Object.values(productTestimonialMapping).flat();
  const uniqueTestimonials = Array.from(new Set(allTestimonials));
  return uniqueTestimonials.sort(() => Math.random() - 0.5).slice(0, count);
}
