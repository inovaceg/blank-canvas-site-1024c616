import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  created_at: string;
  status: string;
  tracking_status?: string;
  tracking_code?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  total_price?: number;
  product_details?: any;
  company_name?: string;
  contact_name: string;
}

interface OrderHistoryProps {
  clientId: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5" />;
    case "processing":
      return <Package className="h-5 w-5" />;
    case "shipped":
      return <Truck className="h-5 w-5" />;
    case "delivered":
      return <CheckCircle className="h-5 w-5" />;
    case "cancelled":
      return <XCircle className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Pendente",
    processing: "Em Processamento",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export function OrderHistory({ clientId }: OrderHistoryProps) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Você ainda não possui pedidos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.tracking_status || order.status)}
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <Badge variant={getStatusVariant(order.tracking_status || order.status)}>
                  {getStatusLabel(order.tracking_status || order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.tracking_code && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Código de Rastreamento</p>
                  <p className="text-sm font-mono">{order.tracking_code}</p>
                </div>
              )}

              {order.estimated_delivery && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Entrega prevista:</span>
                  <span className="font-semibold">
                    {format(new Date(order.estimated_delivery), "dd/MM/yyyy")}
                  </span>
                </div>
              )}

              {order.delivered_at && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Entregue em:</span>
                  <span className="font-semibold">
                    {format(new Date(order.delivered_at), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}

              {order.total_price && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold">
                    R$ {order.total_price.toFixed(2)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
