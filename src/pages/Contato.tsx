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
    address: "", // Campo único para endereço completo
    city: "",
    state: "",
    product_interest: "", // Campo para produtos de interesse
    quantity: "", // Campo para quantidade desejada
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
        address: validatedData.address || null,
        city: validatedData.city || null,
        state: validatedData.state || null,
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
        address: "",
        city: "",
        state: "",
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
        <div className="grid lg:grid-cols-1 gap-8 max-w-3xl mx-auto"> {/* Alterado para 1 coluna */}
          <div className="bg-primary text-white rounded-lg p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4">Entre em Contato</h1>
              <p className="text-white/90">
                Tem alguma dúvida ou quer fazer um pedido? Envie uma mensagem e entraremos em contato em breve.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 uppercase tracking-wide">Dados para Contato e Cotação</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="company_name" className="text-sm font-semibold uppercase tracking-wide">Nome da Empresa (Opcional)</label>
                  <Input
                    id="company_name"
                    name="company_name"
                    placeholder="Sua Empresa Ltda."
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.company_name ? 'border-destructive' : ''}`}
                  />
                  {errors.company_name && (
                    <p className="text-sm text-destructive mt-1">{errors.company_name}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="contact_name" className="text-sm font-semibold uppercase tracking-wide">Nome do Contato *</label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    placeholder="Seu nome completo"
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
                    <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wide">E-mail *</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
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
                    <label htmlFor="phone" className="text-sm font-semibold uppercase tracking-wide">Telefone / WhatsApp *</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(XX) XXXXX-XXXX"
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
                  <label htmlFor="address" className="text-sm font-semibold uppercase tracking-wide">Endereço Completo (CEP, Rua, Número, Bairro, Complemento)</label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Ex: 00000-000, Rua Exemplo, 123, Centro, Apto 101"
                    value={formData.address}
                    onChange={handleChange}
                    className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.address ? 'border-destructive' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="city" className="text-sm font-semibold uppercase tracking-wide">Cidade</label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Sua Cidade"
                      value={formData.city}
                      onChange={handleChange}
                      className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.city ? 'border-destructive' : ''}`}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="state" className="text-sm font-semibold uppercase tracking-wide">Estado (UF)</label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="UF"
                      value={formData.state}
                      onChange={handleChange}
                      maxLength={2}
                      className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.state ? 'border-destructive' : ''}`}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="product_interest" className="text-sm font-semibold uppercase tracking-wide">Produtos de Interesse</label>
                  <Input
                    id="product_interest"
                    name="product_interest"
                    placeholder="Ex: Bananada tradicional, Goma de amido"
                    value={formData.product_interest}
                    onChange={handleChange}
                    className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.product_interest ? 'border-destructive' : ''}`}
                  />
                  {errors.product_interest && (
                    <p className="text-sm text-destructive mt-1">{errors.product_interest}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="quantity" className="text-sm font-semibold uppercase tracking-wide">Quantidade Desejada</label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="Ex: 10 caixas, 50 unidades"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`bg-white border-0 text-foreground placeholder:text-muted-foreground ${errors.quantity ? 'border-destructive' : ''}`}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-semibold uppercase tracking-wide">Mensagem *</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Descreva sua solicitação ou dúvida..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
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
        </div>
      </div>
    </div>
  );
};

export default Contato;