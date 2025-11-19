import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ClientArea() {
  const { user } = useAuth();

  const { data: clientData } = useQuery({
    queryKey: ["client-data", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .single();

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

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Área do Cliente
          </h1>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo!</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Nome:</strong> {clientData?.contact_person}</p>
              <p><strong>E-mail:</strong> {clientData?.email}</p>
              {clientData?.company_name && (
                <p><strong>Empresa:</strong> {clientData.company_name}</p>
              )}
              {clientData?.phone && (
                <p><strong>Telefone:</strong> {clientData.phone}</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-8">
            <h2 className="text-2xl font-semibold mb-4">Meus Pedidos</h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Pedido #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at!).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "pending"
                            ? "bg-accent/20 text-accent-foreground"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status === "pending"
                          ? "Pendente"
                          : order.status === "completed"
                          ? "Concluído"
                          : order.status}
                      </span>
                    </div>
                    {order.total_price && (
                      <p className="text-lg font-semibold text-primary">
                        R$ {Number(order.total_price).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
