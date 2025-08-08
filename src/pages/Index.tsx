
import { Link } from "react-router-dom";
import { ArrowRight, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import VideoEmbed from "@/components/VideoEmbed";

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-telemetria-darker">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-telemetria-dark">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.1),transparent_70%)]"></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-telemetria-yellow/30 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="inline-block mb-4">
                <img 
                  src="/logo.png" 
                  alt="Dose de Telemetria Logo" 
                  className="h-24 w-24 animate-pulse-subtle"
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Torne-se especialista em <span className="text-telemetria-yellow">OpenTelemetry</span> na sua empresa.
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Aprenda todos os aspectos do OpenTelemetry, incluindo as principais convenções semânticas, a API, SDK, Collector, Operator, e muito mais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-telemetria-yellow text-telemetria-dark hover:bg-telemetria-yellow/90"
                >
                  <Link to="/produtos">
                    Conheça nossos produtos
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/20 hover:border-white/30 text-white hover:text-white"
                >
                  <a href="https://blog.dosedetelemetria.com" target="_blank" rel="noopener noreferrer">
                    Veja nosso blog
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <a href="#produtos" className="text-white/50 hover:text-white transition-colors">
            <ArrowRight className="h-6 w-6 rotate-90" />
          </a>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section id="produtos" className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeading
            title="Nossos Produtos"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass-morphism rounded-xl p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4">Especialização em OTel</h3>
              <div className="inline-block ml-0 mb-4 px-3 py-1 bg-telemetria-yellow/10 border border-telemetria-yellow/20 text-xs rounded-full text-telemetria-yellow">
                Em breve
              </div>
              <p className="text-white/80 mb-6">
                Formação intensiva com turmas fechadas, mentorias ao vivo e projetos práticos. Desenvolva 
                habilidades avançadas em OpenTelemetry com acompanhamento especializado.
              </p>
              <div className="mt-auto">
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-telemetria-yellow/30 text-telemetria-yellow hover:bg-telemetria-yellow hover:text-telemetria-dark hover:border-telemetria-yellow"
                >
                  <Link to="/produtos#especializacao">
                    Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="glass-morphism rounded-xl p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4">Trilha OTel</h3>
              <p className="text-white/80 mb-6">
                Curso completo disponível no seu ritmo, com aulas gravadas, exercícios práticos e acesso vitalício. 
                Do básico ao avançado em observabilidade e instrumentação.
              </p>
              <div className="mt-auto">
                <Button 
                  asChild
                  className="w-full bg-telemetria-yellow text-telemetria-dark hover:bg-telemetria-yellow/90"
                >
                  <Link to="/produtos#trilha">
                    Conhecer curso <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Canal YouTube */}
      <section className="section-padding bg-telemetria-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="animate-fade-in-right">
                <SectionHeading
                  title="Nosso Canal no YouTube"
                  subtitle="Live toda sexta-feira, 10:00 de Brasília."
                />
                <div className="space-y-6">
                  <p className="text-white/80">
                    Inscreva-se em nosso canal e receba notificações de novos vídeos, com conteúdo aprofundado, atualizado e em português sobre Monitoramento, Observabilidade, Telemetria e OpenTelemetry.
                  </p>
                  <div className="flex space-x-4">
                    <Button 
                      asChild
                      className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white"
                    >
                      <a href="https://www.youtube.com/@DoseDeTelemetria" target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-5 w-5" /> Inscrever-se
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <VideoEmbed 
                videoId="spdwPokz01w" 
                title="" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn */}
      <section className="section-padding bg-telemetria-darker border-t border-white/5">
        <div className="container-custom text-center">
          <SectionHeading
            title="Conecte-se Conosco"
            subtitle="Siga-nos no LinkedIn para atualizações, dicas e oportunidades"
            centered
          />
          <Button 
            asChild
            size="lg" 
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
          >
            <a href="https://www.linkedin.com/company/dosetelemetria" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              <Linkedin className="mr-2 h-5 w-5" /> Seguir no LinkedIn
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
