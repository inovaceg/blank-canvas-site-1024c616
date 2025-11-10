"use client"
import { Button } from "@/components/button"
import Link from "next/link"
import { Phone, Mail, Menu, X, ShoppingCart } from "lucide-react" // Adicionado ShoppingCart
import { useState } from "react"
import { useCart } from "@/components/cart-provider" // Importar useCart

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCart() // Usar o hook do carrinho para obter o total de itens

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-sm">
            <a href="tel:+553498484644" className="flex items-center gap-2 hover:underline">
              <Phone className="size-4" />
              <span>(34) 98484-4644</span>
            </a>
            <a
              href="mailto:contato@docessaofidelis.com.br"
              className="hidden sm:flex items-center gap-2 hover:underline"
            >
              <Mail className="size-4" />
              <span>contato@docessaofidelis.com.br</span>
            </a>
            <div className="hidden sm:block font-medium">Tradição desde 2000</div>
          </div>
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome%20%281%29%20%281%29-vqBz106SPSsejO2YFogjWyruHk8EV4.png"
                alt="Doces São Fidélis"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-primary">Doces São Fidélis</span>
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
              {/* Ícone do Carrinho */}
              <Button asChild size="icon-sm" variant="ghost" className="relative">
                <Link href="/carrinho">
                  {/* Envolver o ícone e o span condicional em um único span */}
                  <span>
                    <ShoppingCart className="size-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full size-4 flex items-center justify-center text-xs font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </span>
                </Link>
              </Button>
            </nav>

            <div className="flex items-center md:hidden gap-2">
              {/* Ícone do Carrinho para Mobile */}
              <Button asChild size="icon-sm" variant="ghost" className="relative">
                <Link href="/carrinho">
                  {/* Envolver o ícone e o span condicional em um único span */}
                  <span>
                    <ShoppingCart className="size-5" />
                    {getTotalItems() > 0 && (
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