"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog" // Importar o novo diálogo
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatPhoneNumber } from "@/lib/utils"

interface Order {
  id: string
  user_id: string | null // ID do usuário que fez o pedido
  company_name: string | null
  contact_name: string
  email: string
  phone: string
  address?: string | null
  city?: string | null
  state?: string | null
  product_details?: any[] | null // JSONB com detalhes dos produtos
  total_price?: number | null
  status: string
  message?: string | null
  created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.error("Erro ao buscar pedidos do Supabase:", error);
      toast.error("Erro ao carregar pedidos.");
      setOrders([]);
    } else {
      setOrders(data || []);
    }
    setLoading(false)
  }

  const deleteOrder = async (id: string) => {
    if (!confirm("Deseja realmente excluir este pedido?")) return

    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) {
      toast.error("Erro ao excluir pedido")
    } else {
      fetchOrders()
      toast.success("Pedido excluído")
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsDialogOpen(true)
  }

  const filteredOrders = orders.filter(
    (order) =>
      (order.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_details?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando pedidos...</div>
      </main>
    )
  }

  return (
    <main className="p-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-4">Pedidos</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por empresa, contato, e-mail, produtos ou status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800]"
            />
          </div>
        </div>

        {/* Table */}
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a] font-medium">
                      {order.company_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{order.contact_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{order.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{formatPhoneNumber(order.phone)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">
                      {order.total_price !== null && order.total_price !== undefined ? `R$ ${order.total_price.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a] capitalize">{order.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-gray-600 hover:text-[#ff8800]"
                          title="Ver detalhes"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="size-4" />
                        </button>
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

      <OrderDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        order={selectedOrder}
      />
    </main>
  )
}