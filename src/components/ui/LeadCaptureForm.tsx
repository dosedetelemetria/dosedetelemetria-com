import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, User, Check, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeadCaptureFormProps {
  productId: string;
  productName: string;
}

const LeadCaptureForm = ({ productId, productName }: LeadCaptureFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 1. Store in Supabase
      const { error: dbError } = await supabase
        .from("waitlist")
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message || null,
          product_id: productId,
          product_name: productName,
        });

      if (dbError) throw dbError;

      // 2. Send email notification
      const response = await supabase.functions.invoke('send-waitlist-notification', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          productId,
          productName,
        },
      });

      if (response.error) throw new Error(response.error.message);

      setIsSubmitted(true);
      
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Obrigado pelo seu interesse. Entraremos em contato em breve.",
      });
      
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "Ocorreu um erro ao processar sua inscrição. Tente novamente.");
      toast({
        title: "Erro ao processar inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-telemetria-dark/50 p-8 border border-white/10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Inscrição realizada!</h3>
        <p className="text-white/80 mb-4">
          Obrigado por demonstrar interesse em {productName}. Entraremos em contato assim que novas vagas ficarem disponíveis.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-telemetria-dark/50 p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-2">Entrar na lista de espera</h3>
      <p className="text-white/80 mb-6">
        Preencha seus dados abaixo para ser notificado quando abrirmos novas vagas para este curso.
      </p>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-white rounded-md p-3 mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white/80 mb-1.5">
            Nome completo
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email" className="text-white/80 mb-1.5">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu melhor email"
              required
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="message" className="text-white/80 mb-1.5">
            Mensagem (opcional)
          </Label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Conte-nos por que está interessado neste curso"
              className="pl-10 min-h-[100px]"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-telemetria-yellow text-telemetria-dark hover:bg-telemetria-yellow/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Entrar na lista"}
        </Button>
        
        <p className="text-xs text-white/60 text-center mt-4">
          Ao se inscrever, você concorda em receber emails sobre este curso e outras ofertas relacionadas. Você pode cancelar a inscrição a qualquer momento.
        </p>
      </form>
    </div>
  );
};

export default LeadCaptureForm;