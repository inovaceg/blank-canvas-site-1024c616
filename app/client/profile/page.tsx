"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatPhoneNumber } from "@/lib/utils"

const clientProfileSchema = z.object({
  company_name: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  cnpj: z.string().optional().nullable(),
  contact_person: z.string().min(3, "Nome do contato deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone/WhatsApp inválido (ex: 22-9-8888-8888)").max(14, "Telefone/WhatsApp inválido (ex: 22-9-8888-8888)"),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  cep: z.string().optional().nullable(),
});

type ClientProfileFormData = z.infer<typeof clientProfileSchema>;

export default function ClientProfilePage() {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClientProfileFormData>({
    resolver: zodResolver(clientProfileSchema),
  });

  useEffect(() => {
    fetchClientProfile()
  }, [])

  const fetchClientProfile = async () => {
    setLoading(true)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error("Erro: Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const { data: clientProfile, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    if (clientError || !clientProfile) {
      console.error("Erro ao buscar perfil do cliente:", clientError);
      toast.error("Erro ao carregar seu perfil. Verifique seu cadastro.");
      setLoading(false);
      return;
    }

    reset(clientProfile); // Preenche o formulário com os dados do perfil
    setLoading(false);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.substring(0, 2);
      if (cleanedValue.length > 2) {
        formattedValue += '-' + cleanedValue.substring(2, 3);
      }
      if (cleanedValue.length > 3) {
        formattedValue += '-' + cleanedValue.substring(3, 7);
      }
      if (cleanedValue.length > 7) {
        formattedValue += '-' + cleanedValue.substring(7, 11);
      }
    }
    setValue('phone', formattedValue, { shouldValidate: true });
  };

  const handleCepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.substring(0, 5);
      if (cleanedValue.length > 5) {
        formattedValue += '-' + cleanedValue.substring(5, 8);
      }
    }
    setValue('cep', formattedValue, { shouldValidate: true });
  };

  const onSubmit = async (data: ClientProfileFormData) => {
    setIsSubmitting(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error("Erro: Usuário não autenticado.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          company_name: data.company_name,
          cnpj: data.cnpj || null,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          cep: data.cep || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userData.user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(error.message || "Erro ao atualizar perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12 flex flex-col items-center justify-center">
          <Loader2 className="size-8 animate-spin text-gray-500 mb-4" />
          <p>Carregando seu perfil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/client"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
        >
          <span>
            <ArrowLeft className="size-4" />
            Voltar para o Dashboard
          </span>
        </Link>

        <Card className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl">Gerenciar Perfil da Empresa</CardTitle>
            <CardDescription>Atualize as informações da sua empresa e contato.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nome da Empresa *</Label>
                <Input id="company_name" {...register("company_name")} aria-invalid={!!errors.company_name} />
                {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                <Input id="cnpj" {...register("cnpj")} aria-invalid={!!errors.cnpj} />
                {errors.cnpj && <p className="text-sm text-destructive">{errors.cnpj.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_person">Pessoa de Contato *</Label>
                <Input id="contact_person" {...register("contact_person")} aria-invalid={!!errors.contact_person} />
                {errors.contact_person && <p className="text-sm text-destructive">{errors.contact_person.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                <Input
                  id="phone"
                  placeholder="XX-X-XXXX-XXXX"
                  {...register("phone")}
                  onChange={handlePhoneInputChange}
                  aria-invalid={!!errors.phone}
                  maxLength={14}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP (Opcional)</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  {...register("cep")}
                  onChange={handleCepInputChange}
                  aria-invalid={!!errors.cep}
                  maxLength={9}
                />
                {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço (Opcional)</Label>
                <Input id="address" {...register("address")} aria-invalid={!!errors.address} />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade (Opcional)</Label>
                  <Input id="city" {...register("city")} aria-invalid={!!errors.city} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado (UF) (Opcional)</Label>
                  <Input id="state" {...register("state")} aria-invalid={!!errors.state} maxLength={2} />
                  {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}