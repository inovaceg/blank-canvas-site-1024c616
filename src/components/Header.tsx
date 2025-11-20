import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Store, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, userRole, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-center text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Store className="size-4" />
              <span>Doces São Fidélis – Bananadas e Gomas Artesanais: Tradição e Qualidade Desde 2000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-doces-sao-fidelis.png"
                alt="Doces São Fidélis"
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/120x120?text=Logo";
                }}
              />
              <span className="text-base sm:text-lg font-bold text-primary">Doces São Fidélis</span>
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
              <ThemeToggle />
              {user ? (
                <>
                  {userRole === 'admin' && (
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                      <Link to="/admin">
                        <User className="size-4 mr-2" />
                        ADMIN
                      </Link>
                    </Button>
                  )}
                  {userRole === 'client' && (
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                      <Link to="/area-do-cliente">
                        <User className="size-4 mr-2" />
                        ÁREA DO CLIENTE
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="hidden sm:flex"
                  >
                    <LogOut className="size-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild className="hidden sm:flex rounded-full">
                  <Link to="/auth">LOGIN</Link>
                </Button>
              )}
              
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/carrinho">
                  <ShoppingCart className="size-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full size-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/nossa-historia"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nossa História
            </Link>
            <Link
              to="/produtos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              to="/qualidade"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Qualidade
            </Link>
            <Link
              to="/contato"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            {!user && (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
            {user && userRole === 'admin' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="size-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            {user && userRole === 'client' && (
              <Link to="/area-do-cliente" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="size-4 mr-2" />
                  Minha Área
                </Button>
              </Link>
            )}
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="size-4 mr-2" />
                Sair
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}