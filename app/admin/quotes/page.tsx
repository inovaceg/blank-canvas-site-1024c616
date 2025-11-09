"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface QuoteRequest {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  address?: string // Adicionado, pois existe no DB
  city?: string    // Adicionado, pois existe no DB
  state?: string   // Adicionado, pois existe no DB
  product_interest?: string // Corrigido para singular, como no DB
  quantity?: string
  message?: string
  created_at: string
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching quote requests:", error);
      toast.error("Erro ao carregar solicitações de orçamento.");
    }
    
    setQuotes(data || [])
    setLoading(false)
  }

  const deleteQuote = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta solicitação?")) return

    const { error } = await supabase.from("quote_requests").delete().eq("id", id)

    if (error) {
      toast.error("Erro ao excluir solicitação")
    } else {
      fetchQuotes()
      toast.success("Solicitação excluída")
    }
  }

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.product_interest && quote.product_interest.toLowerCase().includes(searchTerm.toLowerCase())), // Usar product_interest
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
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-4">Solicitações de Orçamento</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por empresa, contato, e-mail ou produtos..."
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
                  Produtos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a] font-medium">
                    {quote.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{quote.contact_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{quote.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{quote.phone}</td>
                  <td className="px-6 py-4 text-sm text-[#4a4a4a]">{quote.product_interest || "-"}</td> {/* Usar product_interest */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          alert(
                            `Empresa: ${quote.company_name}\nContato: ${quote.contact_name}\nTelefone: ${quote.phone}\nE-mail: ${quote.email}\nProdutos de Interesse: ${quote.product_interest || "-"}\nQuantidade: ${quote.quantity || "-"}\nEndereço: ${quote.address || "-"}, ${quote.city || "-"} - ${quote.state || "-"}\n\nMensagem:\n${quote.message || "Nenhuma mensagem adicional"}`,
                          )
                        }
                        className="text-gray-600 hover:text-[#ff8800]"
                        title="Ver detalhes"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => deleteQuote(quote.id)}
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

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12 text-gray-500">Nenhuma solicitação encontrada</div>
          )}
        </div>
      </div>
    </main>
  )
}