import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { z } from "zod";

const Contato = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    contact_name: "",
    email: "",
    phone: "",
    company_name: "",
    city: "",
    state: "",
    address: "",
    product_interest: "",
    quantity: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateField = (name: keyof ContactFormData, value: string) => {
    try {
      const fieldSchema = contactFormSchema.shape[name];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0]?.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields
      const validatedData = contactFormSchema.parse(formData);

      // Prepare data for Supabase
      const quoteData = {
        contact_name: validatedData.contact_name,
        email: validatedData.email,
        phone: validatedData.phone,
        company_name: validatedData.company_name || null,
        city: validatedData.city || null,
        state: validatedData.state || null,
        address: validatedData.address || null,
        product_interest: validatedData.product_interest || null,
        quantity: validatedData.quantity || null,
        message: validatedData.message || null,
      };

      const { error } = await supabase
        .from('quote_requests')
        .insert([quoteData]);

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
        address: "",
        product_interest: "",
        quantity: "",
        message: ""
      });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Erro de validação",
          description: "Por favor, corrija os campos destacados.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name as keyof ContactFormData, value);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="bg-primary text-white rounded-lg p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4">Entre em Contato</h1>
              <p className="text-white/90">
                Tem alguma dúvida ou quer fazer um pedido? Envie uma mensagem e entraremos em contato em breve.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Nome da Empresa (Opcional)</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="company_name"
                  placeholder="NOME DA SUA EMPRESA"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.company_name ? 'border-destructive' : ''}`}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive mt-1">{errors.company_name}</p>
                )}
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold uppercase tracking-wide">Nome do Contato *</label>
                  <Input
                    name="contact_name"
                    placeholder="SEU NOME COMPLETO"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                    className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.contact_name ? 'border-destructive' : ''}`}
                  />
                  {errors.contact_name && (
                    <p className="text-sm text-destructive mt-1">{errors.contact_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold uppercase tracking-wide">E-mail *</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="SEU@EMAIL.COM"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.email ? 'border-destructive' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold uppercase tracking-wide">Telefone / WhatsApp *</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="XX-XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.phone ? 'border-destructive' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold uppercase tracking-wide">CEP *</label>
                  <Input
                    name="address"
                    placeholder="00000-000"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold uppercase tracking-wide">Endereço (Rua, Avenida, etc.)</label>
                  <Input
                    name="product_interest"
                    placeholder="RUA, AVENIDA, ETC."
                    value={formData.product_interest}
                    onChange={handleChange}
                    className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold uppercase tracking-wide">Bairro</label>
                  <Input
                    name="quantity"
                    placeholder="SEU BAIRRO"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold uppercase tracking-wide">Cidade</label>
                    <Input
                      name="city"
                      placeholder="SUA CIDADE"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold uppercase tracking-wide">Estado (UF)</label>
                    <Input
                      name="state"
                      placeholder="SP"
                      value={formData.state}
                      onChange={handleChange}
                      className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold uppercase tracking-wide">Mensagem *</label>
                  <Textarea
                    name="message"
                    placeholder="DESCREVA SUA SOLICITAÇÃO OU DÚVIDA..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`bg-white border-0 text-foreground placeholder:text-muted-foreground resize-none ${errors.message ? 'border-destructive' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-white text-primary hover:bg-white/90 font-semibold uppercase tracking-wide" 
                  size="lg"
                >
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>
          </div>

          <div className="bg-primary text-white rounded-lg p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">Receba Nossas Novidades</h2>
              <p className="text-white/90">
                Cadastre-se em nossa newsletter e fique por dentro de promoções, novos produtos e receitas exclusivas!
              </p>
            </div>
            
            <form className="space-y-4">
              <Input
                type="text"
                placeholder="SEU NOME COMPLETO *"
                className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                type="email"
                placeholder="SEU E-MAIL *"
                className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                type="tel"
                placeholder="SEU WHATSAPP (XX-XXXXXXXXX) *"
                className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="SUA CIDADE *"
                className="bg-white border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold uppercase tracking-wide" 
                size="lg"
              >
                Cadastrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;