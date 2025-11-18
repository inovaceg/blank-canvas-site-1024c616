import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, History, User } from "lucide-react" // Adicionado User para 'Meu Perfil'
import Link from "next/link"

export default async function ClientDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let clientName = "Cliente";
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();
    if (profile && !error) {
      clientName = profile.first_name || "Cliente";
    }
  }

  // Fetch last order (example)
  const { data: lastOrder, error: orderError } = await supabase
    .from('orders')
    .select('created_at')
    .eq('user_id', user?.id) // Use user?.id para evitar erro se user for null
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const lastOrderDate = lastOrder ? new Date(lastOrder.created_at).toLocaleDateString('pt-BR') : 'Nenhum pedido recente';


  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#4a4a4a] mb-8">Bem-vindo, {clientName}!</h2>
        <p className="text-[#6b6b6b] mb-8">Aqui você pode gerenciar seus pedidos e explorar nosso catálogo.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/client/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ver Catálogo</CardTitle>
                <Package className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Produtos</div>
                <p className="text-xs text-muted-foreground">Explore nossos doces</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meus Pedidos</CardTitle>
                <History className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Histórico</div>
                <p className="text-xs text-muted-foreground">Acompanhe seus pedidos</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meu Perfil</CardTitle>
                <User className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Dados Cadastrais</div>
                <p className="text-xs text-muted-foreground">Atualize suas informações</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}