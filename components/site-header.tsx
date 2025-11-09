"use client"
import { Button } from "@/components/button"
import Link from "next/link"
import { Phone, Mail, Menu, X } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-auto sm:h-10 flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-0 text-xs sm:text-sm">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <a href="tel:+553498484644" className="flex items-center gap-1.5 sm:gap-2 hover:underline">
                <Phone className="size-3 sm:size-4 flex-shrink-0" />
                <span>(34) 98484-4644</span>
              </a>
              <a
                href="mailto:contato@docessaofidelis.com.br"
                className="flex items-center gap-1.5 sm:gap-2 hover:underline"
              >
                <Mail className="size-3 sm:size-4 flex-shrink-0" />
                <span className="break-all">contato@docessaofidelis.com.br</span>
              </a>
            </div>
            <div className="font-medium text-xs sm:text-sm">Tradição desde 2000</div>
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
              <Button asChild size="sm" className="rounded-full">
                <Link href="/solicitar-orcamento">Solicitar Orçamento</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full bg-transparent">
                <Link href="/admin/login">Login</Link>
              </Button>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
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
              <Button asChild size="sm" className="w-full rounded-full" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/solicitar-orcamento">Solicitar Orçamento</Link>
              </Button>
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
