"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Package, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  category: string
  description: string
  ingredients?: string
  weight?: string
  price?: number // Este será o preço padrão, o preço do cliente será buscado separadamente
  image_url?: string
  is_featured?: boolean
  units_per_package?: number
  is_active?: boolean
  display_order?: number
  created_at: string
}

interface ClientProduct extends Product {
  client_price?: number; // Preço específico para o cliente
}

export default function ClientProductsPage() {
  const [products, setProducts] = useState<ClientProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const supabase = createClient()
  const { addItem } = useCart()

  useEffect(() => {
    fetchClientProducts()
  }, [])

  const fetchClientProducts = async () => {
    setLoading(true)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error("Erro: Usuário não autenticado.");
      setLoading(false);
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
      return;
    }

    const clientId = clientData.id;

    // Busca todos os produtos ativos
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error("Erro ao buscar produtos:", productsError);
      toast.error("Erro ao carregar produtos.");
      setLoading(false);
      return;
    }

    // Busca os preços específicos para este cliente
    const { data: clientPricesData, error: clientPricesError } = await supabase
      .from("client_product_prices")
      .select("product_id, price")
      .eq("client_id", clientId);

    if (clientPricesError) {
      console.error("Erro ao buscar preços específicos do cliente:", clientPricesError);
      // Não é um erro crítico, pode continuar com preços padrão
    }

    const clientPricesMap = new Map(clientPricesData?.map(cp => [cp.product_id, cp.price]));

    const productsWithClientPrices: ClientProduct[] = (productsData || []).map(product => ({
      ...product,
      client_price: clientPricesMap.get(product.id) || product.price, // Usa preço do cliente se existir, senão o padrão
    }));

    setProducts(productsWithClientPrices);
    const initialQuantities: { [key: string]: number } = {};
    productsWithClientPrices.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
    setLoading(false);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando catálogo de produtos...</div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/client"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
        >
          <span>
            <ArrowLeft className="size-4" />
            Voltar para o Dashboard
          </span>
        </Link>

        <h2 className="text-2xl font-bold text-[#4a4a4a] mb-6">Nosso Catálogo</h2>
        <p className="text-[#6b6b6b] mb-8">
          Explore nossos produtos e adicione ao seu orçamento. Os preços exibidos são os seus preços especiais.
        </p>

        {products && products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <Link href={`/produtos/${product.id}`} className="block">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="size-16 text-muted-foreground/30" />
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground">Destaque</Badge>
                      </div>
                    )}
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: product.description }} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.weight && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Peso:</p>
                        <p className="text-sm text-muted-foreground">{product.weight}</p>
                      </div>
                    )}
                    {product.units_per_package !== null && product.units_per_package !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Unidades por Embalagem:</p>
                        <p className="text-sm text-muted-foreground">{product.units_per_package}</p>
                      </div>
                    )}
                    {product.client_price !== null && product.client_price !== undefined ? (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Seu Preço:</p>
                        <p className="text-lg font-bold text-primary">R$ {product.client_price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Preço sob consulta</p>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                        disabled={quantities[product.id] <= 1}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantities[product.id]}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        image_url: product.image_url,
                        weight: product.weight,
                        units_per_package: product.units_per_package,
                        price: product.client_price, // Passa o preço correto do cliente
                      }, quantities[product.id])}
                    >
                      Adicionar ao Pedido <ShoppingCart className="size-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-6">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Nenhum produto disponível no momento
            </h2>
            <p className="text-muted-foreground mb-6">
              Entre em contato para mais informações sobre nosso catálogo.
            </p>
            <Button asChild>
              <Link href="/contato"><span>Fale Conosco</span></Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}