import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { unstable_noStore } from 'next/cache'; // Importar unstable_noStore

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  unstable_noStore(); // Garante que esta página seja renderizada dinamicamente
  console.log("[ClientLayout] Starting rendering.");

  const supabase = await createClient()

  const {
    data: { user },
    error: userAuthError, // Captura erros de autenticação
  } = await supabase.auth.getUser()

  if (userAuthError) {
    console.error("[ClientLayout] Erro ao obter usuário autenticado:", userAuthError);
    redirect("/admin/login");
  }

  if (!user) {
    console.log("[ClientLayout] Usuário não autenticado, redirecionando para login.");
    redirect("/admin/login")
  }
  console.log(`[ClientLayout] User ID: ${user.id}`);

  // Opcional: Verificar o papel do usuário para garantir que é um 'client' ou 'admin'
  let userRole: string | null = null;
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("[ClientLayout] Erro ao buscar perfil do usuário:", profileError);
      redirect("/admin/login"); // Redireciona se houver erro ao buscar o perfil
    }

    if (profile) {
      userRole = profile.role;
    }
    console.log(`[ClientLayout] User role: ${userRole}`);
  } catch (e) {
    console.error("[ClientLayout] Exceção ao buscar perfil do usuário:", e);
    redirect("/admin/login");
  }

  // Se o usuário não é um cliente nem um admin, redireciona para o login
  if (userRole !== 'client' && userRole !== 'admin') {
    console.error(`[ClientLayout] Usuário ${user.id} (role: ${userRole}) não tem permissão para acessar a área do cliente. Redirecionando para login.`);
    redirect("/admin/login");
  }

  console.log("[ClientLayout] User is authorized. Rendering children.");
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}