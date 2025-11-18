import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { unstable_noStore } from 'next/cache'; // Importar unstable_noStore

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  unstable_noStore(); // Garante que esta página seja renderizada dinamicamente

  const supabase = await createClient()

  const {
    data: { user },
    error: userAuthError,
  } = await supabase.auth.getUser()

  if (userAuthError) {
    console.error("[AdminLayout] Erro ao obter usuário autenticado:", userAuthError);
    // Se houver um erro de autenticação (ex: sessão expirada, token inválido), redireciona para o login
    redirect("/admin/login");
  }

  // Se não há usuário, permite que o login/registro seja renderizado
  if (!user) {
    // Isso permite que /admin/login e /admin/register funcionem
    // Se o path atual não for login/register, redireciona para login
    // (O middleware já deve ter lidado com isso, mas é uma segurança extra)
    return <>{children}</>
  }

  // Se há um usuário, verifica o papel
  let userRole: string | null = null;
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("[AdminLayout] Erro ao buscar perfil do usuário:", profileError);
      redirect("/admin/login"); // Redireciona se houver erro ao buscar o perfil
    }

    if (profile) {
      userRole = profile.role;
    }
  } catch (e) {
    console.error("[AdminLayout] Exceção ao buscar perfil do usuário:", e);
    redirect("/admin/login");
  }

  // Se o usuário não é um admin, redireciona para o dashboard do cliente
  if (userRole !== 'admin') {
    console.log(`[AdminLayout] Usuário ${user.id} (role: ${userRole}) tentou acessar /admin. Redirecionando para /client/dashboard.`);
    redirect("/client/dashboard");
  }

  // Se o usuário é um admin, renderiza o layout administrativo
  return (
    <div className="flex h-screen bg-[#f5f1ed] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-white px-4 md:px-8 py-4">
          <h1 className="text-lg md:text-xl font-semibold text-[#4a4a4a]">Área Administrativa</h1>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}