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
      console.log("Attempting signInWithPassword for email:", data.email); // Log 1
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        console.error("Erro durante signInWithPassword:", signInError); // Log 2
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

      console.log("signInWithPassword successful. Attempting to get user session."); // Log 3
      // Após o login bem-sucedido, buscar o papel do usuário
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Erro ao obter informações do usuário após o login:", userError); // Log 4 (Este é o erro que você está vendo)
        toast.error("Erro ao obter informações do usuário após o login.");
        router.push("/admin/login"); // Redireciona de volta para o login
        return;
      }

      console.log("User session obtained, user ID:", user.id); // Log 5
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.error("Erro ao buscar perfil do usuário:", profileError); // Log 6
        toast.error("Erro ao carregar perfil do usuário. Tente novamente.");
        router.push("/admin/login");
        return;
      }

      console.log("User profile role:", profile.role); // Log 7
      toast.success("Login realizado com sucesso!")
      if (profile.role === 'admin') {
        router.push("/admin")
      } else if (profile.role === 'client') {
        router.push("/client/dashboard") // Redireciona para o dashboard do cliente
      } else {
        // Caso o papel não seja reconhecido, redireciona para uma página padrão ou login
        router.push("/admin/login")
      }
      router.refresh()
    } catch (error) {
      console.error("Unexpected error during login:", error); // Log 8
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