import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, name, whatsapp, city }]);

      if (error) throw error;

      toast({
        title: "Cadastro realizado!",
        description: "Você receberá nossas novidades em breve.",
      });
      
      setEmail("");
      setName("");
      setWhatsapp("");
      setCity("");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Cadastre-se para Receber Novidades
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Fique por dentro de lançamentos, promoções e novidades exclusivas!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white text-foreground"
            />
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white text-foreground"
            />
            <Input
              type="tel"
              placeholder="WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              className="bg-white text-foreground"
            />
            <Input
              type="text"
              placeholder="Sua cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="bg-white text-foreground"
            />
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
