
import { Link } from "react-router-dom";
import { Youtube, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-telemetria-darker border-t border-white/5 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/680a09b6-29f2-4dee-8b6a-c9b075517152.png" 
                alt="Dose de Telemetria" 
                className="h-10 w-10"
              />
              <span className="font-bold text-xl tracking-tight">Dose de Telemetria</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Oferecemos produtos digitais relacionados a OpenTelemetry (OTel) 
              para profissionais que buscam aprimorar seus conhecimentos em monitoramento 
              e observabilidade.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://youtube.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-telemetria-yellow transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-telemetria-yellow transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contato@dosedetelemetria.com"
                className="text-white/70 hover:text-telemetria-yellow transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  Produtos
                </Link>
              </li>
              <li>
                <a 
                  href="https://blog.dosedetelemetria.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm flex items-center"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos#especializacao" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  Especialização em OTel
                </Link>
              </li>
              <li>
                <Link to="/produtos#trilha" className="text-white/70 hover:text-telemetria-yellow transition-colors text-sm">
                  Trilha OTel
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Dose de Telemetria. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/politica-de-privacidade" className="text-sm text-white/70 hover:text-telemetria-yellow transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-de-uso" className="text-sm text-white/70 hover:text-telemetria-yellow transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
