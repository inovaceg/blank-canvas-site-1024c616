import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Package, History, User } from "lucide-react"

export default async function ClientDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Este caso já é tratado pelo layout, mas é um bom fallback
    return (
      <main className="p-8">
        <div className="text-center py-12">Acesso negado. Por favor, faça login.</div>
      </main>
    )
  }

  // Fetch user profile to display name
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Cliente';

  // Fetch last order (example)
  const { data: lastOrder, error: orderError } = await supabase
    .from('orders')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const lastOrderDate = lastOrder ? new Date(lastOrder.created_at).toLocaleDateString('pt-BR') : 'Nenhum pedido recente';

  return (
    <main className="p-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Bem-vindo de volta, {userName}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/produtos">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novo Pedido</CardTitle>
                <Package className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Fazer um novo pedido</div>
                <p className="text-xs text-muted-foreground">Explore nosso catálogo de produtos.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/orders">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Histórico de Pedidos</CardTitle>
                <History className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ver pedidos anteriores</div>
                <p className="text-xs text-muted-foreground">Seu último pedido foi em {lastOrderDate}.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/profile">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meus Dados</CardTitle>
                <User className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gerenciar informações</div>
                <p className="text-xs text-muted-foreground">Atualize seus dados cadastrais.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}