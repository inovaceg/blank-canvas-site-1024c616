import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, History, User } from "lucide-react"
import Link from "next/link"
import { unstable_noStore } from 'next/cache'; // Importar unstable_noStore

export default async function ClientDashboardPage() {
  unstable_noStore(); // Garante que esta página seja renderizada dinamicamente

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("[ClientDashboardPage] Erro ao obter usuário autenticado:", userError);
    // O layout já deve ter redirecionado, mas é bom ter uma verificação aqui também.
    // Em um componente de página, você pode lançar um erro ou retornar um fallback.
    return <div className="text-center py-12 text-red-500">Erro: Usuário não autenticado.</div>;
  }

  let clientName = "Cliente";
  try {
    const { data: profile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();
    if (profileFetchError) {
      console.error("[ClientDashboardPage] Erro ao buscar first_name do perfil:", profileFetchError);
    } else if (profile) {
      clientName = profile.first_name || "Cliente";
    }
  } catch (e) {
    console.error("[ClientDashboardPage] Exceção ao buscar first_name do perfil:", e);
  }

  // Fetch last order (example)
  let lastOrderDate = 'Nenhum pedido recente';
  try {
    const { data: lastOrder, error: orderError } = await supabase
      .from('orders')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (orderError && orderError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("[ClientDashboardPage] Erro ao buscar último pedido:", orderError);
    } else if (lastOrder) {
      lastOrderDate = new Date(lastOrder.created_at).toLocaleDateString('pt-BR');
    }
  } catch (e) {
    console.error("[ClientDashboardPage] Exceção ao buscar último pedido:", e);
  }


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