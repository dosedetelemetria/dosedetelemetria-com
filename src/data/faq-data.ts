import { productData, type Product } from './product-data';
import { author } from './author-data';
export interface FaqEntry { question: string; answer: string; link?: { href: string; label: string }; }
const comparison: FaqEntry = {
  question: 'Qual é a diferença entre a Trilha e a Especialização em OTel?',
  answer: 'A Trilha OTel é um curso autoguiado, com aulas gravadas, exercícios e um ano de acesso. A Especialização em OTel é um programa de oito semanas, com conversas semanais e feedback personalizado nos projetos.',
  link: { href: '/products/', label: 'Compare os cursos' },
};
const certificate: FaqEntry = {
  question: 'O certificado de conclusão equivale à certificação OTCA?',
  answer: 'Não. O certificado de conclusão da Dose de Telemetria é separado da credencial OpenTelemetry Certified Associate (OTCA) da CNCF. O simulado em inglês é uma preparação independente e não concede certificação.',
};
const language: FaqEntry = { question: 'Em que idioma são os cursos?', answer: 'Os cursos da Dose de Telemetria são em português. O simulado OTCA e o podcast vinculados neste site estão em inglês.' };
const instructor: FaqEntry = { question: 'Quem ensina os cursos?', answer: `${author.name} é contribuidor do OpenTelemetry e instrutor dos cursos.`, link: { href: '/#instrutor', label: 'Conheça o instrutor' } };
const courseHelp: FaqEntry = { question: 'Como tirar dúvidas sobre um curso?', answer: 'Escreva para contato@dosedetelemetria.com com o curso de interesse e suas dúvidas sobre o conteúdo ou acesso.', link: { href: 'mailto:contato@dosedetelemetria.com', label: 'Entre em contato' } };
const availability: FaqEntry = { question: 'Quais cursos estão disponíveis para compra?', answer: productData.map(p => `${p.title}: ${p.price}; ${p.available ? 'disponível para compra' : 'matrículas fechadas, com lista de interesse'}.`).join(' '), link: { href: '/products/', label: 'Veja os detalhes dos cursos' } };
export const homeFaq: FaqEntry[] = [
  { question: 'Para quem é a Dose de Telemetria?', answer: 'Oferecemos cursos de OpenTelemetry para profissionais de engenharia de software, SRE e DevOps que querem aprender instrumentação e pipelines de telemetria. O blog também oferece conteúdo gratuito em português.' },
  comparison, availability, courseHelp,
];
export const productsFaq: FaqEntry[] = [comparison, availability, language, instructor, certificate, courseHelp];
export function courseFaq(product: Product): FaqEntry[] {
  return [
    { question: `Posso me matricular em ${product.title} agora?`, answer: product.available ? `${product.title} está disponível por ${product.price}. A matrícula é realizada na plataforma externa indicada no link.` : `As matrículas em ${product.title} estão fechadas. O preço informado é ${product.price}. Entre na lista de interesse para receber novidades.`, link: product.available ? { href: product.ctaLink, label: 'Ver matrícula' } : { href: '#waitlist', label: 'Entrar na lista de interesse' } },
    { question: product.id === 'trilha' ? 'Por quanto tempo tenho acesso? A Trilha inclui mentoria?' : 'Quanto dura o programa e como funciona a mentoria?', answer: product.id === 'trilha' ? 'A Trilha inclui um ano de acesso a aulas autoguiadas e exercícios. Conversas semanais e feedback personalizado nos projetos fazem parte da Especialização.' : 'A Especialização dura oito semanas, com conversas semanais, projetos práticos e feedback personalizado.' },
    language, instructor, certificate,
    { question: 'Quais assuntos o curso cobre?', answer: 'Instrumentação, sinais, modelo de dados, API, SDK, Collector, Operator, arquitetura, migração e cultura de observabilidade. Consulte a lista de módulos e aulas nesta página.' },
    { question: 'Onde estão os termos e condições de cancelamento?', answer: 'Consulte os termos de uso para conhecer as condições aplicáveis antes da compra. Entre em contato se precisar de esclarecimentos.', link: { href: '/terms-of-use/', label: 'Leia os termos de uso' } },
    courseHelp,
  ];
}
