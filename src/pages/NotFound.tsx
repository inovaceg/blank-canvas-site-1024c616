import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Página não encontrada</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button asChild variant="outline" className="h-auto flex-col py-6 gap-2">
            <Link to="/">
              <Home className="h-6 w-6" />
              <span className="text-sm">Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col py-6 gap-2">
            <Link to="/produtos">
              <Search className="h-6 w-6" />
              <span className="text-sm">Produtos</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col py-6 gap-2">
            <Link to="/carrinho">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-sm">Carrinho</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col py-6 gap-2">
            <Link to="/contato">
              <Phone className="h-6 w-6" />
              <span className="text-sm">Contato</span>
            </Link>
          </Button>
        </div>

        <Button asChild size="lg" className="rounded-full">
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
