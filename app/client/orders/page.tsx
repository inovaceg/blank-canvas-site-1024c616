"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Search, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ProductDetail {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  weight?: string;
  units_per_package?: number;
  image_url?: string;
}

interface Order {
  id: string
  client_id: string // Adicionado client_id à interface
  status: string
  total_price?: number
  message?: string | null
  created_at: string
  product_details?: ProductDetail[] | null;
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("[ClientOrdersPage] Erro: Usuário não autenticado.", userError);
      toast.error("Erro: Usuário não autenticado.");
      setLoading(false);
      return;
    }
    console.log("[ClientOrdersPage] User ID:", userData.user.id);

    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (clientError || !clientData) {
      console.error("[ClientOrdersPage] Erro ao buscar dados do cliente:", clientError);
      toast.error("Erro ao carregar dados do cliente. Verifique seu cadastro.");
      setLoading(false);
      return;
    }
    const clientId = clientData.id;
    console.log("[ClientOrdersPage] Client ID:", clientId);


    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        client_id,
        status,
        total_price,
        message,
        created_at,
        product_details
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[ClientOrdersPage] Erro ao buscar pedidos:", error)
      toast.error("Erro ao carregar histórico de pedidos.")
      setOrders([]);
    } else {
      console.log("[ClientOrdersPage] Pedidos carregados:", data);
      setOrders((data || []) as unknown as Order[])
    }
    setLoading(false)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "outline";
      case "completed":
        return "default"; // Pode ser um verde mais escuro
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "processing":
        return "Em Processamento";
      case "shipped":
        return "Enviado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_details?.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) // Ajustado para JSONB
  )

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando histórico de pedidos...</div>
      </main>
    )
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <Link
            href="/client"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
          >
            <span>
              <ArrowLeft className="size-4" />
              Voltar para o Dashboard
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-4">Meus Pedidos</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por ID do pedido, status ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800]"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data do Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{order.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">
                      {order.total_price ? `R$ ${order.total_price.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4a4a4a]">
                      {order.product_details?.map((item: any) => item.name).join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/client/orders/${order.id}`} className="text-gray-600 hover:text-[#ff8800]" title="Ver detalhes">
                          <Eye className="size-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">Nenhum pedido encontrado</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </main>
  )
}