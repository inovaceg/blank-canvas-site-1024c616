"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const newsletterSchema = z.object({
  name: z.string().min(2, "Nome completo deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp deve ter no mínimo 10 caracteres (incluindo DDD)"),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erro ao cadastrar")

      toast.success("Cadastro realizado com sucesso! Você receberá nossas novidades.")
      reset()
    } catch (error) {
      toast.error("Erro ao cadastrar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input placeholder="Seu nome completo *" {...register("name")} aria-invalid={!!errors.name} className="bg-white text-foreground" />
        {errors.name && <p className="text-sm text-red-200">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Seu e-mail *"
          {...register("email")}
          aria-invalid={!!errors.email}
          className="bg-white text-foreground"
        />
        {errors.email && <p className="text-sm text-red-200">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Input placeholder="Seu WhatsApp (DDD + número) *" {...register("whatsapp")} aria-invalid={!!errors.whatsapp} className="bg-white text-foreground" />
        {errors.whatsapp && <p className="text-sm text-red-200">{errors.whatsapp.message}</p>}
      </div>

      <div className="space-y-2">
        <Input placeholder="Sua cidade *" {...register("city")} aria-invalid={!!errors.city} className="bg-white text-foreground" />
        {errors.city && <p className="text-sm text-red-200">{errors.city.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Cadastrando...
          </>
        ) : (
          "Cadastrar"
        )}
      </Button>
    </form>
  )
}