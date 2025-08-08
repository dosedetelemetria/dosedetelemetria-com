
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ProductFeature {
  text: string;
}

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  features: ProductFeature[];
  price: string;
  ctaText: string;
  ctaLink: string;
  available: boolean;
  popular?: boolean;
}

const ProductCard = ({
  id,
  title,
  description,
  features,
  price,
  ctaText,
  ctaLink,
  available,
  popular,
}: ProductCardProps) => {
  // Check if the link is external (starts with http or https)
  const isExternalLink = ctaLink.startsWith('http');

  return (
    <div
      id={id}
      className={cn(
        "relative rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200",
        popular
          ? "border-telemetria-yellow/50 scale-[1.02] shadow-xl shadow-telemetria-yellow/10"
          : "border-border hover:border-telemetria-yellow/30 hover:shadow-lg"
      )}
    >

      <div className="flex flex-col space-y-6 h-full">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="text-3xl font-bold">{price}</div>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-telemetria-yellow" />
                <span className="text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6">
          <Button
            asChild
            className={cn(
              "w-full font-medium text-base transition-all duration-300",
              popular
                ? "bg-telemetria-yellow text-telemetria-dark hover:bg-telemetria-yellow/90"
                : available
                ? ctaText === "Lista de espera" 
                  ? "bg-white/20 text-white hover:bg-telemetria-yellow hover:text-telemetria-dark"
                  : "bg-secondary hover:bg-telemetria-yellow hover:text-telemetria-dark"
                : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
            )}
            disabled={!available}
          >
            {available ? (
              isExternalLink ? (
                <a href={ctaLink} target="_blank" rel="noopener noreferrer">{ctaText}</a>
              ) : (
                <Link to={ctaLink}>{ctaText}</Link>
              )
            ) : (
              <span>{ctaText}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
