"use client"
import { Button } from "@/components/button"
import Link from "next/link"
import { Store, Menu, X, ShoppingCart, Instagram } from "lucide-react" // Alterado: Phone removido, Store adicionado
import { useState, useEffect } from "react"
import { useCart } from "@/components/cart-provider"
// import { formatPhoneNumber } from "@/lib/utils" // Removido: formatPhoneNumber não é mais necessário

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { getTotalItems } = useCart()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-center text-sm"> {/* Alterado para justify-center */}
            <div className="flex items-center gap-2 font-medium"> {/* Adicionado font-medium */}
              <Store className="size-4" /> {/* Novo ícone de loja */}
              <span>Vendas Exclusivas para Lojistas e Grandes Redes de Varejo</span> {/* Novo texto */}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-doces-sao-fidelis.png"
                  alt="Doces São Fidélis"
                  className="h-12 w-auto"
                />
                <span className="text-xl font-bold text-primary">Doces São Fidélis</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/nossa-historia"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Nossa História
              </Link>
              <Link
                href="/produtos"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/qualidade"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Qualidade
              </Link>
              <Link
                href="/contato"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contato
              </Link>
              <Button asChild size="sm" variant="outline" className="rounded-full bg-transparent">
                <Link href="/admin/login">Login</Link>
              </Button>
              <Button asChild size="icon-sm" variant="ghost" className="relative">
                <Link href="/carrinho">
                  <span>
                    <ShoppingCart className="size-5" />
                    {isMounted && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full size-4 flex items-center justify-center text-xs font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </span>
                </Link>
              </Button>
            </nav>

            <div className="flex items-center md:hidden gap-2">
              <Button asChild size="icon-sm" variant="ghost" className="relative">
                <Link href="/carrinho">
                  <span>
                    <ShoppingCart className="size-5" />
                    {isMounted && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full size-4 flex items-center justify-center text-xs font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </span>
                </Link>
              </Button>
              <button
                className="p-2 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-4 border-t">
              <Link
                href="/"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/nossa-historia"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nossa História
              </Link>
              <Link
                href="/produtos"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/qualidade"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Qualidade
              </Link>
              <Link
                href="/contato"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </Link>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full rounded-full bg-transparent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/admin/login">Login</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}