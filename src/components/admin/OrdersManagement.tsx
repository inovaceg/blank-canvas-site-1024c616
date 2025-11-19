import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { formatCurrency } from "@/lib/utils";

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
  product_details: Json | null;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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

      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum pedido encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.contact_name}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}</p>
                        <p className="text-muted-foreground">{format(new Date(order.created_at), "HH:mm", { locale: ptBR })}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Pedido #{orders.findIndex(o => o.id === selectedOrder.id) + 1}
                  <Badge className={statusColors[selectedOrder.status]}>
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedOrder.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Status do Pedido</label>
                  <Select 
                    value={selectedOrder.status} 
                    onValueChange={(value) => {
                      handleStatusChange(selectedOrder.id, value);
                      setSelectedOrder({ ...selectedOrder, status: value });
                    }}
                  >
                    <SelectTrigger>
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Informações do Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nome:</span>
                        <p className="font-medium">{selectedOrder.contact_name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Telefone:</span>
                        <p className="font-medium">{selectedOrder.phone}</p>
                      </div>
                      {selectedOrder.company_name && (
                        <div>
                          <span className="text-muted-foreground">Empresa:</span>
                          <p className="font-medium">{selectedOrder.company_name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(selectedOrder.address || selectedOrder.city || selectedOrder.state) && (
                    <div>
                      <h4 className="font-semibold mb-3">Endereço</h4>
                      <div className="space-y-2 text-sm">
                        {selectedOrder.address && (
                          <div>
                            <span className="text-muted-foreground">Rua:</span>
                            <p className="font-medium">{selectedOrder.address}</p>
                          </div>
                        )}
                        {(selectedOrder.city || selectedOrder.state) && (
                          <div>
                            <span className="text-muted-foreground">Cidade/Estado:</span>
                            <p className="font-medium">
                              {selectedOrder.city}{selectedOrder.city && selectedOrder.state && ", "}{selectedOrder.state}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedOrder.message && (
                  <div>
                    <h4 className="font-semibold mb-3">Mensagem</h4>
                    <p className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap">{selectedOrder.message}</p>
                  </div>
                )}

                {selectedOrder.product_details && Array.isArray(selectedOrder.product_details) && selectedOrder.product_details.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Produtos</h4>
                    <div className="space-y-3">
                      {(selectedOrder.product_details as unknown as OrderProduct[]).map((product, index) => (
                        <div key={`${product.id}-${index}`} className="flex items-center justify-between bg-muted/50 p-4 rounded-md">
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">Quantidade: {product.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold">{formatCurrency(product.price * product.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.total_price && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">Total</h4>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(selectedOrder.total_price)}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
