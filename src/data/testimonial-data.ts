export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  productIds?: string[]; // Para vincular depoimentos a produtos específicos
}

export const testimonialData: Testimonial[] = [
  {
    id: "willian",
    quote: "Sou SRE a 6 anos, a imersão foi fenomenal. O Juraci é uma das mentes por trás do OpenTelemetry, é muito detalhado, ele vai destrinchando ponto a ponto. Sendo um dos criadores, ele consegue aprofundar bem. Expectativas superadas com sucesso!",
    author: "Willian Saavedra",
    role: "Site Reliability Engineer",
    company: "Itaú",
    avatarUrl: "/testimonials/willian.webp",
    productIds: ["trilha", "especializacao"]
  },
  {
    id: "claudio",
    quote: "Muito instrutivo, bem alinhado com minhas perspectivas de futuro, tanto na parte técnica quanto gerencial. O futuro da observabilidade amadureceu em um padrão, e este padrão é o OpenTelemetry.",
    author: "Cláudio Bastos",
    role: "CTO",
    company: "Mensis Tecnologia",
    avatarUrl: "/testimonials/claudio.webp",
    productIds: ["especializacao"]
  },
  {
    id: "mateus",
    quote: "Eu pude aprofundar e tirar dúvidas, superou minhas expectativas, tive vários insights a partir do que o Juraci trouxe.",
    author: "Mateus Santos",
    role: "CTO",
    company: "Vericode",
    avatarUrl: "/testimonials/mateus.webp",
    productIds: ["trilha", "especializacao"]
  },
  {
    id: "rafael",
    quote: "Eu já tinha experiência com OpenTelemetry, mais específico no Collector, mas foi interessante pra poder aprofundar os conhecimentos na parte de instrumentação. Estou saindo com um conhecimento muito maior do que esperava.",
    author: "Rafael Gumiero",
    role: "Principal Engineer",
    company: "PicPay",
    avatarUrl: "/testimonials/rafael.webp",
    productIds: ["trilha"]
  },
  {
    id: "ezequiel",
    quote: "O curso vai muito além da teoria. Desde os fundamentos de observabilidade até tópicos avançados como instrumentação manual, OpenTelemetry Operator e entendimento da API do OTel - cada módulo tem aplicação direta no meu trabalho diário. Todo dia uso algo que aprendi, seja implementando o Collector em escala, ajustando pipelines de telemetria ou ajudando outras equipes com instrumentação. Este curso está transformando minha mentalidade sobre observabilidade e como aplicá-la na prática para resultados reais.",
    author: "Ezequiel de Souza Barros",
    role: "Especialista em Observabilidade",
    company: "PagBank",
    avatarUrl: "/testimonials/ezequiel.webp",
    productIds: ["trilha"]
  },
  {
    id: "kaio",
    quote: "Trabalhando em AIOps, eu precisava de conhecimento profundo em OpenTelemetry para nossa implementação. Depois de fazer vários cursos que apenas arranhavam a superfície, descobri o Dose de Telemetria no YouTube. Apenas um vídeo me mostrou que o conteúdo era muito mais rico que qualquer curso que eu tinha feito. Quando descobri sobre o curso de vocês, soube imediatamente que tinha encontrado exatamente o que procurava. O conteúdo é incrível!",
    author: "Kaio Fonseca",
    role: "Especialista em AIOps",
    company: "Bradesco",
    avatarUrl: "/testimonials/kaio.webp",
    productIds: ["trilha"]
  },
  {
    id: "diogo",
    quote: "O curso de especialização fez total diferença para avançar minha carreira para uma empresa internacional com OpenTelemetry em seu núcleo. O conteúdo técnico profundo vai além do superficial - agora sou a Referência Técnica para OpenTelemetry na minha empresa. Ter acesso direto ao conhecimento de alguém conectado à fonte do OpenTelemetry transformou minha capacidade de resolver problemas complexos e ser referência para outros. Este curso possibilitou diretamente minha mudança de carreira internacional.",
    author: "Diogo Amaral",
    role: "Site Reliability Engineer",
    company: "dLocal",
    avatarUrl: "/testimonials/diogo.webp",
    productIds: ["trilha", "especializacao"]
  },
  {
    id: "marcos",
    quote: "Procurando conteúdo profundo e prático sobre OpenTelemetry em português me levou a este curso. O currículo bem estruturado progride dos fundamentos através de API, SDK, Collector e Operator com exemplos claros e aplicações reais. Estou implementando OpenTelemetry no trabalho, e poder fazer perguntas específicas na plataforma - que frequentemente geram conteúdo adicional - é um verdadeiro diferencial. Estou aplicando o novo conhecimento imediatamente e evoluindo significativamente.",
    author: "Marcos Muniz",
    role: "Engenheiro de Software",
    productIds: ["trilha"]
  }
];

// Funções auxiliares para obter depoimentos
export const getProductTestimonials = (productId: string, limit?: number): Testimonial[] => {
  const filtered = testimonialData.filter(t => !t.productIds || t.productIds.includes(productId));
  return limit ? filtered.slice(0, limit) : filtered;
};

export const getRandomTestimonials = (limit: number): Testimonial[] => {
  const shuffled = [...testimonialData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};