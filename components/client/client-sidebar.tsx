"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, Package, FileText, User, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/client", icon: LayoutDashboard },
  { name: "Catálogo", href: "/client/products", icon: Package },
  { name: "Meus Pedidos", href: "/client/orders", icon: FileText },
  { name: "Meu Perfil", href: "/client/profile", icon: User },
]

export function ClientSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error during logout:", error);
      toast.error("Erro ao sair. Tente novamente.");
    } else {
      router.push("/") // Redireciona para a página inicial
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#e8e3dc] rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div
        className={cn(
          "w-64 bg-[#e8e3dc] flex flex-col border-r border-[#d4cfc7] transition-transform duration-300 ease-in-out",
          "fixed md:relative inset-y-0 left-0 z-40",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-[#d4cfc7]">
          <div className="flex items-center gap-3">
            <div className="relative size-10">
              <Image
                src="/logo-doces-sao-fidelis.png"
                alt="Doces São Fidélis"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-semibold text-[#4a4a4a] text-sm">Portal do Cliente</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white text-[#2d2d2d] shadow-sm"
                        : "text-[#6b6b6b] hover:bg-[#ddd8d0] hover:text-[#2d2d2d]",
                    )}
                  >
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#d4cfc7]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4a4a4a] text-white rounded-lg text-sm font-medium hover:bg-[#3a3a3a] transition-colors"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </div>
    </>
  )
}