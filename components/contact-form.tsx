"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// Esquema de validação para o formulário de contato
const contactFormSchema = z.object({
  companyName: z.string().optional().or(z.literal("")), // Tornar opcional
  contactName: z.string().min(2, "Nome do contato deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone inválido (ex: 22-9-8888-8888)").max(14, "Telefone inválido (ex: 22-9-8888-8888)"), // Atualizado para 14 caracteres
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"), // Novo campo CEP
  address: z.string().optional().or(z.literal("")), // Rua/Avenida do CEP
  neighborhood: z.string().optional().or(z.literal("")), // Bairro do CEP
  city: z.string().optional().or(z.literal("")), // Cidade do CEP
  state: z.string().min(2, "Estado inválido").max(2, "Estado inválido").optional().or(z.literal("")), // Estado do CEP
  message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const watchedCep = watch("cep") // Agora observamos o campo 'cep'

  // Efeito para preencher o endereço automaticamente ao digitar o CEP
  useEffect(() => {
    const fetchAddress = async () => {
      const cepValue = watchedCep?.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (cepValue && cepValue.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
          const data: ViaCepResponse = await response.json()

          if (!data.erro) {
            setValue("address", data.logradouro)
            setValue("neighborhood", data.bairro)
            setValue("city", data.localidade)
            setValue("state", data.uf)
            toast.success("Endereço preenchido automaticamente!")
          } else {
            toast.error("CEP não encontrado. Por favor, digite o endereço manualmente.")
            // Limpa os campos se o CEP não for encontrado
            setValue("address", "")
            setValue("neighborhood", "")
            setValue("city", "")
            setValue("state", "")
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error)
          toast.error("Erro ao buscar CEP. Tente novamente.")
        }
      }
    }
    fetchAddress()
  }, [watchedCep, setValue])

  // Função para mascarar o telefone
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove todos os caracteres não numéricos
    let cleanedValue = value.replace(/\D/g, '');

    // Aplica a máscara: XX-X-XXXX-XXXX
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.substring(0, 2); // XX
      if (cleanedValue.length > 2) {
        formattedValue += '-' + cleanedValue.substring(2, 3); // X
      }
      if (cleanedValue.length > 3) {
        formattedValue += '-' + cleanedValue.substring(3, 7); // XXXX
      }
      if (cleanedValue.length > 7) {
        formattedValue += '-' + cleanedValue.substring(7, 11); // XXXX
      }
    }
    setValue('phone', formattedValue, { shouldValidate: true });
  };


  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // Constrói o endereço completo para enviar ao banco de dados
      const fullAddress = [data.address, data.neighborhood].filter(Boolean).join(', ');

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: data.companyName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          address: fullAddress, // Envia o endereço completo
          city: data.city,
          state: data.state,
          product_interest: null, // Removido do formulário, enviar null
          quantity: null, // Removido do formulário, enviar null
          message: data.message,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar mensagem de contato")

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.")
      reset()
    } catch (error) {
      toast.error("Erro ao enviar mensagem de contato. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nome da Empresa (Opcional)</Label>
        <Input id="companyName" placeholder="Nome da sua empresa" {...register("companyName")} aria-invalid={!!errors.companyName} />
        {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactName">Nome do Contato *</Label>
        <Input id="contactName" placeholder="Seu nome completo" {...register("contactName")} aria-invalid={!!errors.contactName} />
        {errors.contactName && <p className="text-sm text-destructive">{errors.contactName.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone / WhatsApp *</Label>
          <Input
            id="phone"
            placeholder="XX-X-XXXX-XXXX"
            {...register("phone")}
            onChange={handlePhoneInputChange} // Usando a função de mascaramento
            aria-invalid={!!errors.phone}
            maxLength={14} // Definindo o comprimento máximo para o formato mascarado
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cep">CEP *</Label>
        <Input id="cep" placeholder="00000-000" {...register("cep")} aria-invalid={!!errors.cep} maxLength={9} />
        {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço (Rua, Avenida, etc.)</Label>
        <Input id="address" placeholder="Rua, Avenida, etc." {...register("address")} aria-invalid={!!errors.address} />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input id="neighborhood" placeholder="Seu bairro" {...register("neighborhood")} aria-invalid={!!errors.neighborhood} />
        {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" placeholder="Sua cidade" {...register("city")} aria-invalid={!!errors.city} />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado (UF)</Label>
          <Input id="state" placeholder="RJ" {...register("state")} aria-invalid={!!errors.state} maxLength={2} />
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          placeholder="Descreva sua solicitação ou dúvida..."
          rows={6}
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Enviando Mensagem...
          </>
        ) : (
          "Enviar Mensagem"
        )}
      </Button>
    </form>
  )
}