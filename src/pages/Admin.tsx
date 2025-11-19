import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsManagement from "@/components/admin/ProductsManagement";
import OrdersManagement from "@/components/admin/OrdersManagement";
import ClientsManagement from "@/components/admin/ClientsManagement";
import NewsletterManagement from "@/components/admin/NewsletterManagement";
import QuotesManagement from "@/components/admin/QuotesManagement";
import ClientPricesManagement from "@/components/admin/ClientPricesManagement";
import BannerManagement from "@/components/admin/BannerManagement";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.email}
            </p>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="prices">Preços</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="quotes">Cotações</TabsTrigger>
              <TabsTrigger value="banner">Banner</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsManagement />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersManagement />
            </TabsContent>

            <TabsContent value="clients">
              <ClientsManagement />
            </TabsContent>

            <TabsContent value="prices">
              <ClientPricesManagement />
            </TabsContent>

            <TabsContent value="newsletter">
              <NewsletterManagement />
            </TabsContent>

            <TabsContent value="quotes">
              <QuotesManagement />
            </TabsContent>

            <TabsContent value="banner">
              <BannerManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
