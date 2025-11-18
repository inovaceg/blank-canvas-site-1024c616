"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

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
  status: string
  total_price?: number // Corrigido: Usar total_price
  message?: string | null // Corrigido: Usar message
  created_at: string
  product_details: ProductDetail[];
}

export default function ClientOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchOrderDetails()
  }, [params.id])

  const fetchOrderDetails = async () => {
    setLoading(true)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error("Erro: Usuário não autenticado.");
      setLoading(false);
      router.push("/admin/login"); // Redireciona para login
      return;
    }

    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (clientError || !clientData) {
      console.error("Erro ao buscar dados do cliente:", clientError);
      toast.error("Erro ao carregar dados do cliente. Verifique seu cadastro.");
      setLoading(false);
      router.push("/client"); // Redireciona para o dashboard do cliente
      return;
    }

    const clientId = clientData.id;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_price,
        message,
        created_at,
        product_details
      `)
      .eq("id", params.id as string)
      .eq("client_id", clientId) // Garante que o cliente só veja seus próprios pedidos
      .single()

    if (error) {
      console.error("Erro ao buscar detalhes do pedido:", error)
      toast.error("Erro ao carregar detalhes do pedido.")
      router.push("/client/orders") // Redireciona para a lista de pedidos
      return
    }
    // Ajuste na conversão de tipo para evitar o erro de TypeScript
    setOrder(data as unknown as Order)
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
        return "default";
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

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando detalhes do pedido...</div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Pedido não encontrado ou você não tem permissão para visualizá-lo.</div>
      </main>
    )
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/client/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
        >
          <span>
            <ArrowLeft className="size-4" />
            VOLTAR PARA MEUS PEDIDOS
          </span>
        </Link>

        <Card className="p-6">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">DETALHES DO PEDIDO #{order.id.substring(0, 8)}</CardTitle>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-base px-3 py-1">
                {getStatusText(order.status)}
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground uppercase">
              PEDIDO REALIZADO EM {new Date(order.created_at).toLocaleString("pt-BR")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 uppercase">INFORMAÇÕES GERAIS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground uppercase">DATA DO PEDIDO:</p>
                  <p className="font-medium uppercase">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase">STATUS:</p>
                  <p className="font-medium uppercase">{getStatusText(order.status)}</p>
                </div>
                {order.total_price && (
                  <div>
                    <p className="text-muted-foreground uppercase">VALOR TOTAL:</p>
                    <p className="font-medium uppercase">R$ {order.total_price.toFixed(2)}</p>
                  </div>
                )}
                {order.message && (
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground uppercase">OBSERVAÇÕES:</p>
                    <p className="font-medium whitespace-pre-wrap uppercase">{order.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 uppercase">ITENS DO PEDIDO</h3>
              <div className="space-y-4">
                {order.product_details?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="relative size-16 shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center size-full text-muted-foreground/50">
                          <Package className="size-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground uppercase">{item.name}</p>
                      <p className="text-sm text-muted-foreground uppercase">QUANTIDADE: {item.quantity}</p>
                      {item.price !== undefined && item.price !== null && (
                        <p className="text-sm text-muted-foreground uppercase">PREÇO UNITÁRIO: R$ {item.price.toFixed(2)}</p>
                      )}
                      {item.price !== undefined && item.price !== null && (
                        <p className="text-sm text-muted-foreground uppercase">TOTAL: R$ {(item.quantity * item.price).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}