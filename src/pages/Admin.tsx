import { useAuth } from "@/contexts/AuthContext";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Painel Administrativo
          </h1>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo, Administrador</h2>
            <p className="text-muted-foreground mb-4">
              E-mail: {user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-xl font-semibold mb-2">Produtos</h3>
              <p className="text-muted-foreground mb-4">
                Gerencie o catálogo de produtos
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-xl font-semibold mb-2">Clientes</h3>
              <p className="text-muted-foreground mb-4">
                Visualize e gerencie clientes
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-xl font-semibold mb-2">Pedidos</h3>
              <p className="text-muted-foreground mb-4">
                Acompanhe todos os pedidos
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-xl font-semibold mb-2">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Gerencie assinantes da newsletter
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-xl font-semibold mb-2">Cotações</h3>
              <p className="text-muted-foreground mb-4">
                Visualize solicitações de cotação
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-xl font-semibold mb-2">Configurações</h3>
              <p className="text-muted-foreground mb-4">
                Ajuste configurações do site
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
