import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCatalog } from "@/components/client/ProductCatalog";
import { QuoteCart } from "@/components/client/QuoteCart";
import { ClientProfileForm } from "@/components/client/ClientProfileForm";
import { AddressManagement } from "@/components/client/AddressManagement";
import { OrderHistory } from "@/components/client/OrderHistory";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShoppingCart, Package, History, User, MapPin } from "lucide-react";
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
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("orders")
        .insert([{
          client_id: clientData?.id || null,
          user_id: user.id,
          contact_name: clientData?.contact_person || user.email?.split("@")[0] || "Cliente",
          email: clientData?.email || user.email || "",
          phone: clientData?.phone || "",
          company_name: clientData?.company_name || null,
          address: clientData?.address || null,
          city: clientData?.city || null,
          state: clientData?.state || null,
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
    onError: (error: any) => {
      console.error("Erro ao criar pedido:", error);
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
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Meus Dados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <ProductCatalog clientId={clientData?.id} />
            </TabsContent>

            <TabsContent value="cart">
              <QuoteCart onRequestQuote={handleRequestQuote} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrderHistory clientId={clientData?.id || ""} />
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6">
              <div className="bg-card rounded-lg shadow-sm border border-border p-8">
                <AddressManagement clientId={clientData?.id || ""} />
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <ClientProfileForm clientData={clientData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
