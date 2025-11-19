import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const Contato = () => {
  const [formData, setFormData] = useState({
    contact_name: "",
    email: "",
    phone: "",
    company_name: "",
    city: "",
    state: "",
    product_interest: "",
    quantity: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
      
      setFormData({
        contact_name: "",
        email: "",
        phone: "",
        company_name: "",
        city: "",
        state: "",
        product_interest: "",
        quantity: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para atender você e seu negócio
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Solicite um Orçamento</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="contact_name"
                  placeholder="Nome completo *"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="E-mail *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Telefone/WhatsApp *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="company_name"
                  placeholder="Nome da empresa"
                  value={formData.company_name}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="city"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <Input
                    name="state"
                    placeholder="Estado"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  name="product_interest"
                  placeholder="Produto de interesse"
                  value={formData.product_interest}
                  onChange={handleChange}
                />
                <Input
                  name="quantity"
                  placeholder="Quantidade estimada"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                <Textarea
                  name="message"
                  placeholder="Mensagem"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                />
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="size-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
                      São Fidélis, RJ - Brasil
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="size-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <p className="text-muted-foreground">(32) 98848-4644</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="size-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">E-mail</h3>
                    <p className="text-muted-foreground">contato@docessaofidelis.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Atendimento via WhatsApp</h3>
              <p className="text-muted-foreground mb-4">
                Fale diretamente conosco pelo WhatsApp para um atendimento mais rápido!
              </p>
              <Button asChild className="w-full" size="lg">
                <a href="https://wa.me/5532988484644" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-5 mr-2" />
                  Conversar no WhatsApp
                </a>
              </Button>
            </div>

            <div className="bg-secondary/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Horário de Atendimento</h3>
              <p className="text-muted-foreground">
                Segunda a Sexta: 8h às 18h<br />
                Sábado: 8h às 12h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;