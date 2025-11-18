import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientSidebar } from "@/components/client/client-sidebar" // Será criado em breve

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login") // Redireciona para o login se não autenticado
  }

  // Em um cenário real, você também verificaria o 'role' aqui para garantir que é um 'client'
  // O middleware já faz isso, mas é bom ter uma camada extra aqui se necessário.

  return (
    <div className="flex h-screen bg-[#f5f1ed] overflow-hidden">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-white px-4 md:px-8 py-4">
          <h1 className="text-lg md:text-xl font-semibold text-[#4a4a4a]">Portal do Cliente</h1>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}