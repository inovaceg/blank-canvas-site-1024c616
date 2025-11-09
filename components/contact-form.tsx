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

// Esquema de validação para o formulário de solicitação de orçamento
const quoteRequestSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  contactName: z.string().min(2, "Nome do contato deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(3, "Endereço inválido").optional().or(z.literal("")),
  city: z.string().min(2, "Cidade inválida").optional().or(z.literal("")),
  state: z.string().min(2, "Estado inválido").max(2, "Estado inválido").optional().or(z.literal("")),
  productInterest: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres"),
})

type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>

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
  } = useForm<QuoteRequestFormData>({
    resolver: zodResolver(quoteRequestSchema),
  })

  const watchedCep = watch("address") // Usaremos o campo 'address' para simular o CEP para preenchimento automático

  // Efeito para preencher o endereço automaticamente ao digitar o CEP
  useEffect(() => {
    const fetchAddress = async () => {
      // Assumindo que o usuário digita o CEP no campo de endereço temporariamente
      // Ou podemos adicionar um campo de CEP separado se for mais claro
      const cepValue = watchedCep?.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (cepValue && cepValue.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
          const data: ViaCepResponse = await response.json()

          if (!data.erro) {
            setValue("address", data.logradouro)
            setValue("city", data.localidade)
            setValue("state", data.uf)
            toast.success("Endereço preenchido automaticamente!")
          } else {
            toast.error("CEP não encontrado. Por favor, digite o endereço manualmente.")
            // Limpa os campos se o CEP não for encontrado
            setValue("address", "")
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


  const onSubmit = async (data: QuoteRequestFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: data.companyName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          product_interest: data.productInterest,
          quantity: data.quantity,
          message: data.message,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar solicitação de orçamento")

      toast.success("Solicitação de orçamento enviada com sucesso! Entraremos em contato em breve.")
      reset()
    } catch (error) {
      toast.error("Erro ao enviar solicitação de orçamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nome da Empresa *</Label>
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
          <Input id="phone" placeholder="(XX) XXXXX-XXXX" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço (com CEP para preenchimento automático)</Label>
        <Input id="address" placeholder="Digite o CEP (ex: 00000000) ou o endereço completo" {...register("address")} aria-invalid={!!errors.address} />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="productInterest">Produtos de Interesse (Opcional)</Label>
          <Input id="productInterest" placeholder="Ex: Bananada, Goma de Amido" {...register("productInterest")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade Desejada (Opcional)</Label>
          <Input id="quantity" placeholder="Ex: 100kg, 500 unidades" {...register("quantity")} />
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
            Enviando Solicitação...
          </>
        ) : (
          "Enviar Solicitação de Orçamento"
        )}
      </Button>
    </form>
  )
}