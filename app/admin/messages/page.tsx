"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string // Adicionado phone, que existe na tabela contact_forms
  message: string
  created_at: string
  // is_read: boolean // Removido, pois não existe na tabela contact_forms
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    // Alterado de contact_messages para contact_forms
    const { data } = await supabase.from("contact_forms").select("*").order("created_at", { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  // Função toggleRead removida, pois a coluna is_read não existe na tabela contact_forms
  // const toggleRead = async (id: number, currentStatus: boolean) => {
  //   const { error } = await supabase.from("contact_messages").update({ is_read: !currentStatus }).eq("id", id)

  //   if (error) {
  //     toast.error("Erro ao atualizar status")
  //   } else {
  //     fetchMessages()
  //     toast.success("Status atualizado")
  //   }
  // }

  const deleteMessage = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta mensagem?")) return

    // Alterado de contact_messages para contact_forms
    const { error } = await supabase.from("contact_forms").delete().eq("id", id)

    if (error) {
      toast.error("Erro ao excluir mensagem")
    } else {
      fetchMessages()
      toast.success("Mensagem excluída")
    }
  }

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || // Removido
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando...</div>
      </main>
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
              placeholder="Filtrar por nome, e-mail ou mensagem..." // Texto do placeholder atualizado
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */} {/* Removido */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th> {/* Adicionado */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assunto
                </th> */} {/* Removido */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRead(message.id, message.is_read)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        message.is_read ? "bg-[#4a4a4a] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {message.is_read ? "Lida" : "Nova"}
                    </button>
                  </td> */} {/* Removido */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{message.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{message.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{message.phone}</td> {/* Adicionado */}
                  {/* <td className="px-6 py-4 text-sm text-[#4a4a4a]">{message.subject}</td> */} {/* Removido */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Mensagem:\n\n${message.message}`)}
                        className="text-gray-600 hover:text-[#ff8800]"
                        title="Ver mensagem"
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
      </div>
    </main>
  )
}