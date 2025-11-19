import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: string;
  created_at: string;
  contact_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: string;
  total_price: number | null;
  product_details: OrderProduct[] | null;
  message: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  processing: "Em Processamento",
  completed: "Concluído",
  cancelled: "Cancelado"
};

export default function OrdersManagement() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status: " + error.message);
    }
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
          <p className="text-muted-foreground">Visualize e atualize o status dos pedidos</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processing">Em Processamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhum pedido encontrado
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Pedido #{order.id.slice(0, 8)}
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Em Processamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Nome:</strong> {order.contact_name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Telefone:</strong> {order.phone}</p>
                      {order.company_name && <p><strong>Empresa:</strong> {order.company_name}</p>}
                    </div>
                  </div>
                  {(order.address || order.city || order.state) && (
                    <div>
                      <h4 className="font-semibold mb-2">Endereço</h4>
                      <div className="text-sm space-y-1">
                        {order.address && <p>{order.address}</p>}
                        {(order.city || order.state) && (
                          <p>{order.city}{order.city && order.state && ", "}{order.state}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {order.message && (
                  <div>
                    <h4 className="font-semibold mb-2">Mensagem</h4>
                    <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{order.message}</p>
                  </div>
                )}
                {order.product_details && Array.isArray(order.product_details) && order.product_details.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Produtos</h4>
                    <div className="space-y-2">
                      {(order.product_details as unknown as OrderProduct[]).map((product, index) => (
                        <div key={`${product.id}-${index}`} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">Quantidade: {product.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold">R$ {(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {order.total_price && (
                  <div>
                    <h4 className="font-semibold">Total: <span className="text-primary">R$ {order.total_price.toFixed(2)}</span></h4>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
