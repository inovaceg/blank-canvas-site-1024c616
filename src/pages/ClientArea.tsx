import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCatalog } from "@/components/client/ProductCatalog";
import { QuoteCart } from "@/components/client/QuoteCart";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShoppingCart, Package, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientArea() {
  const { user } = useAuth();
  const { items, clearCart, getTotalItems } = useCart();
  const queryClient = useQueryClient();

  const { data: clientData } = useQuery({
    queryKey: ["client-data", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["client-orders", clientData?.id],
    queryFn: async () => {
      if (!clientData) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientData,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!clientData) throw new Error("Cliente não encontrado");

      const { data, error } = await supabase
        .from("orders")
        .insert([{
          client_id: clientData.id,
          user_id: user?.id,
          contact_name: clientData.contact_person,
          email: clientData.email,
          phone: clientData.phone || "",
          company_name: clientData.company_name,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          product_details: items as any,
          total_price: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Orçamento enviado com sucesso!");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["client-orders"] });
    },
    onError: () => {
      toast.error("Erro ao enviar orçamento. Tente novamente.");
    },
  });

  const handleRequestQuote = () => {
    if (items.length === 0) {
      toast.error("Adicione produtos ao orçamento primeiro");
      return;
    }
    createOrderMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Área do Cliente
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">Bem-vindo, {clientData?.contact_person}</span>
            </div>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products" className="relative">
                <Package className="h-4 w-4 mr-2" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="cart" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orçamento
                {getTotalItems() > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <ProductCatalog clientId={clientData?.id} />
            </TabsContent>

            <TabsContent value="cart">
              <QuoteCart onRequestQuote={handleRequestQuote} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="bg-card rounded-lg shadow-sm border border-border p-8">
                <h2 className="text-2xl font-semibold mb-6">Meus Orçamentos</h2>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Você ainda não solicitou nenhum orçamento.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-lg">
                              Orçamento #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at!).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "pending"
                                ? "secondary"
                                : order.status === "completed"
                                ? "default"
                                : "outline"
                            }
                          >
                            {order.status === "pending"
                              ? "Pendente"
                              : order.status === "completed"
                              ? "Concluído"
                              : order.status}
                          </Badge>
                        </div>
                        {order.product_details && (
                          <div className="mb-4 text-sm text-muted-foreground">
                            {Array.isArray(order.product_details) &&
                              `${order.product_details.length} ${
                                order.product_details.length === 1 ? "produto" : "produtos"
                              }`}
                          </div>
                        )}
                        {order.total_price && (
                          <p className="text-2xl font-bold text-primary">
                            R$ {Number(order.total_price).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
