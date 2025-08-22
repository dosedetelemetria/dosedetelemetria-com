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