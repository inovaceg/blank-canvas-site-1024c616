"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      console.log("Attempting signInWithPassword for email:", data.email);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        console.error("Erro durante signInWithPassword:", signInError);
        let errorMessage = "Erro ao fazer login. Verifique suas credenciais."
        if (signInError.message.includes("Email not confirmed")) {
          errorMessage = "Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada."
        } else if (signInError.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha."
        } else {
          errorMessage = `Erro: ${signInError.message}`
        }
        toast.error(errorMessage)
        return
      }

      // Login bem-sucedido. Agora, apenas redirecionamos e deixamos o middleware/layout
      // lidar com a busca do papel do usuário e o redirecionamento final.
      toast.success("Login realizado com sucesso!")
      router.push("/admin"); // Redireciona para o caminho base do admin
      router.refresh(); // Força um refresh para reavaliar o middleware e o layout
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@docessaofidelis.com.br"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" {...register("password")} aria-invalid={!!errors.password} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
      <p className="mt-4 text-center text-sm text-[#6b6b6b]">
        Não tem uma conta?{" "}
        <Link href="/admin/register" className="text-[#ff8800] hover:underline">
          Cadastre-se aqui
        </Link>
      </p>
    </form>
  )
}