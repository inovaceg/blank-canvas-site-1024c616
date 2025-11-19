import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Store, Menu, X, ShoppingCart, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/components/cart-provider";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { getTotalItems } = useCart();

  useEffect(() => {
    setIsMounted(true);
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setIsLoggedIn(true);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setIsLoggedIn(true);
        const fetchRole = async () => {
          if (session?.user) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            if (profile && !profileError) {
              setUserRole(profile.role);
            }
          }
        };
        fetchRole();
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
            <Link to="/" className="flex items-center gap-3">
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
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/nossa-historia" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Nossa História
              </Link>
              <Link to="/produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Catálogo
              </Link>
              <Link to="/qualidade" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Qualidade
              </Link>
              <Link to="/contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/client/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="size-5" />
                  {isMounted && getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </Link>

              {isLoggedIn ? (
                userRole === "admin" ? (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon">
                      <Shield className="size-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/client/dashboard">
                    <Button variant="ghost" size="icon">
                      <User className="size-5" />
                    </Button>
                  </Link>
                )
              ) : (
                <Link to="/admin/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/nossa-historia" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Nossa História
            </Link>
            <Link to="/produtos" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Catálogo
            </Link>
            <Link to="/qualidade" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Qualidade
            </Link>
            <Link to="/contato" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Contato
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
