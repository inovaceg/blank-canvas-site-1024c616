import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "sonner"

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login") // Redireciona para o login se não houver usuário
  }

  // Opcional: Verificar o papel do usuário para garantir que é um 'client' ou 'admin'
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || (profile?.role !== 'client' && profile?.role !== 'admin')) {
    console.error("User is not a client or admin, redirecting:", profileError);
    // toast.error("Acesso negado. Você não tem permissão para acessar esta área."); // Não usar toast em Server Components
    redirect("/admin/login"); // Redireciona se o papel não for adequado
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}