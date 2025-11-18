"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog" // Importar o diálogo de detalhes (agora para pedidos/mensagens)
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatPhoneNumber } from "@/lib/utils"

interface ContactMessage {
  id: string // UUID
  user_id: string | null // Pode ser null para mensagens de contato anônimas
  company_name: string | null
  contact_name: string
  email: string
  phone: string
  address?: string | null
  city?: string | null
  state?: string | null
  product_details?: any[] | null // Será null para mensagens de contato gerais
  total_price?: number | null // Será null para mensagens de contato gerais
  status: string // Status do pedido/mensagem
  message: string | null
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    // Buscar da tabela 'orders', filtrando por mensagens que não são pedidos (sem product_details ou total_price)
    // Ou, mais robusto, buscar todos e filtrar no cliente se 'product_details' for null
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .is("product_details", null) // Filtra apenas as entradas que não são pedidos de produtos
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Erro ao buscar mensagens de contato do Supabase:", error);
      toast.error("Erro ao carregar mensagens de contato.");
      setMessages([]);
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta mensagem?")) return

    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) {
      toast.error("Erro ao excluir mensagem")
    } else {
      fetchMessages()
      toast.success("Mensagem excluída")
    }
  }

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message)
    setIsDetailsDialogOpen(true)
  }

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando mensagens...</div>
      </main>
    )
  )
  }

  return (
    <main className="p-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-4">Mensagens de Contato</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por empresa, contato, e-mail ou mensagem..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a] font-medium">{message.company_name || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{message.contact_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{message.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{formatPhoneNumber(message.phone)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(message)}
                          className="text-gray-600 hover:text-[#ff8800]"
                          title="Ver detalhes"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
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

            {filteredMessages.length === 0 && (
              <div className="text-center py-12 text-gray-500">Nenhuma mensagem encontrada</div>
            )}
          </div>
        </ScrollArea>
      </div>

      <OrderDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        order={selectedMessage}
      />
    </main>
  )
}