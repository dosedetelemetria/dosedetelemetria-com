
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import Testimonial from "@/components/Testimonial";
import { productData } from "@/data/product-data";
import { getRandomTestimonials } from "@/data/testimonial-data";

const Products = () => {
  // Obtém dois depoimentos aleatórios
  const testimonials = getRandomTestimonials(2);
  
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-telemetria-darker">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-telemetria-dark">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.1),transparent_70%)]"></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-telemetria-yellow/30 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Nossos <span className="text-telemetria-yellow">Produtos</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Cursos e especializações de alta qualidade em OpenTelemetry (OTel) para impulsionar sua carreira em observabilidade
              </p>
              <div className="mt-8 flex justify-center">
                <a href="#produtos" className="text-white/70 hover:text-telemetria-yellow transition-colors animate-bounce">
                  <ArrowDown className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeading
            title="Conheça nossos produtos"
            subtitle="Desenvolvidos por especialistas para atender às suas necessidades de aprendizado"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {productData.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                features={product.features}
                price={product.price}
                ctaText={product.available ? "Ver detalhes" : "Lista de espera"}
                ctaLink={`/produtos/${product.slug}`}
                available={true} // Always true since we're linking to product detail
                popular={product.popular}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section-padding bg-telemetria-darker">
        <div className="container-custom">
          <SectionHeading
            title="O que nossos alunos dizem"
            subtitle="Veja como nossos cursos estão transformando carreiras"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <Testimonial
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                avatarUrl={testimonial.avatarUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparativo */}
      <section className="section-padding bg-telemetria-dark">
        <div className="container-custom">
          <SectionHeading
            title="Qual é o curso ideal para você?"
            subtitle="Compare nossas ofertas e escolha a que melhor atende às suas necessidades"
            centered
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-spacing-0 max-w-4xl mx-auto">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-left"></th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">Especialização em OTel</th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">Trilha OTel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Formato</td>
                  <td className="py-4 px-6 text-center text-white/80">Turma com datas definidas</td>
                  <td className="py-4 px-6 text-center text-white/80">Auto-estudo</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-white">Duração</td>
                  <td className="py-4 px-6 text-center text-white/80">8 semanas</td>
                  <td className="py-4 px-6 text-center text-white/80">Seu ritmo</td>
                </tr>
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Mentorias</td>
                  <td className="py-4 px-6 text-center text-white/80">Sim, semanais</td>
                  <td className="py-4 px-6 text-center text-white/80">Não</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-white">Projetos práticos</td>
                  <td className="py-4 px-6 text-center text-white/80">Sim, com feedback</td>
                  <td className="py-4 px-6 text-center text-white/80">Sim, guiados</td>
                </tr>
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Certificado</td>
                  <td className="py-4 px-6 text-center text-white/80">Sim</td>
                  <td className="py-4 px-6 text-center text-white/80">Sim</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-white">Preço</td>
                  <td className="py-4 px-6 text-center font-semibold text-white">R$ 5.997,00</td>
                  <td className="py-4 px-6 text-center font-semibold text-white">R$ 2.397,00</td>
                </tr>
                <tr className="bg-telemetria-dark/50">
                  <td className="py-4 px-6 text-white">Disponibilidade</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      Em breve
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Disponível
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Ainda com dúvidas?</h3>
            <p className="text-white/80 mb-8">
              Entre em contato conosco e ficaremos felizes em ajudar você a escolher o produto mais adequado para o seu momento e objetivos.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-telemetria-yellow text-telemetria-dark hover:bg-telemetria-yellow/90"
            >
              <a href="mailto:contato@dosedetelemetria.com">
                Fale conosco
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
