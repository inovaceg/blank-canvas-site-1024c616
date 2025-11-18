"use client"
import { Button } from "@/components/button"
import Link from "next/link"
import { Store, Menu, X, ShoppingCart, User } from "lucide-react" // Adicionado User para 'Área do Cliente'
import { useState, useEffect } from "react"
import { useCart } from "@/components/cart-provider"
import { createClient } from "@/lib/supabase/client" // Importar cliente Supabase para verificar autenticação

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null);
  const { getTotalItems } = useCart()
  const supabase = createClient()

  useEffect(() => {
    setIsMounted(true)
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setIsLoggedIn(true);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile && !profileError) {
          setUserRole(profile.role);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setIsLoggedIn(true);
        const fetchRole = async () => {
          if (session?.user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            if (profile && !profileError) {
              setUserRole(profile.role);
            }
          }
        };
        fetchRole();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-center text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Store className="size-4" />
              <span>Vendas Exclusivas para Lojistas e Grandes Redes de Varejo</span>
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
              {isLoggedIn ? (
                <Button asChild size="sm" variant="outline" className="rounded-full bg-transparent">
                  <Link href={userRole === 'admin' ? "/admin" : "/client/dashboard"}>
                    <User className="size-4 mr-2" />
                    {userRole === 'admin' ? "Admin" : "Área do Cliente"}
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline" className="rounded-full bg-transparent">
                  <Link href="/admin/login">Login</Link>
                </Button>
              )}
              <Button asChild size="icon-sm" variant="ghost" className="relative">
                <Link href="/client/cart"> {/* Link para o novo carrinho do cliente */}
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
                <Link href="/client/cart"> {/* Link para o novo carrinho do cliente */}
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
              {isLoggedIn ? (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full rounded-full bg-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={userRole === 'admin' ? "/admin" : "/client/dashboard"}>
                    <User className="size-4 mr-2" />
                    {userRole === 'admin' ? "Admin" : "Área do Cliente"}
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full rounded-full bg-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/admin/login">Login</Link>
                </Button>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}