import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow access to login page without authentication
  if (!user) {
    return <>{children}</>
  }

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