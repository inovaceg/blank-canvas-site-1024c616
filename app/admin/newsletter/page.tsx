"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search } from "lucide-react"
import { toast } from "sonner" // Importar toast para exibir erros de fetch

interface NewsletterSubscriber {
  id: number
  email: string
  name: string // Agora é obrigatório
  whatsapp: string // Agora é obrigatório
  city: string // Novo campo
  created_at: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching newsletter subscribers:", error);
      toast.error("Erro ao carregar inscrições da newsletter."); // Exibir toast em caso de erro
    }
    
    console.log("Fetched newsletter data:", data); // Adicionado para depuração
    setSubscribers(data || [])
    setLoading(false)
  }

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.whatsapp.includes(searchTerm) ||
      sub.city.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-4">Inscrições na Newsletter</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar e-mails, nomes, WhatsApp ou cidades..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Inscrição
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{subscriber.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{subscriber.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{subscriber.whatsapp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4a4a4a]">{subscriber.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12 text-gray-500">Nenhuma inscrição encontrada</div>
          )}
        </div>
      </div>
    </main>
  )
}