"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Package, ShoppingCart, Minus, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header" // Importado
import { SiteFooter } from "@/components/site-footer" // Importado

interface Product {
  id: string
  name: string
  category: string
  description: string
  ingredients?: string
  weight?: string
  price?: number // Preço base do produto
  image_url?: string
  is_featured?: boolean
  units_per_package?: number
  is_active?: boolean
  display_order?: number
  created_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [userPrices, setUserPrices] = useState<{ [key: string]: number }>({}); // Preços específicos do cliente
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient()
  const { addItem } = useCart()

  useEffect(() => {
    fetchProductsAndPrices()
  }, [])

  const fetchProductsAndPrices = async () => {
    setLoading(true)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);

    // Fetch all active products
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (productsError) {
      console.error("Error fetching products:", productsError)
      setProducts([])
      setLoading(false)
      return
    }
    setProducts(productsData || [])

    // Initialize quantities
    const initialQuantities: { [key: string]: number } = {}
    productsData?.forEach(product => {
      initialQuantities[product.id] = 1
    })
    setQuantities(initialQuantities)

    // Fetch client-specific prices if logged in
    if (user) {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (clientError || !clientData) {
        console.warn("Client data not found for logged-in user, using default prices.", clientError);
      } else {
        const { data: pricesData, error: pricesError } = await supabase
          .from("client_product_prices")
          .select("product_id, price")
          .eq("client_id", clientData.id);

        if (pricesError) {
          console.error("Error fetching client prices:", pricesError);
        } else {
          const clientPricesMap: { [key: string]: number } = {};
          pricesData?.forEach(p => {
            clientPricesMap[p.product_id] = p.price;
          });
          setUserPrices(clientPricesMap);
        }
      }
    }
    setLoading(false)
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity,
    }))
  }

  const getProductPrice = (product: Product) => {
    if (isLoggedIn && userPrices[product.id] !== undefined) {
      return userPrices[product.id];
    }
    return product.price; // Fallback to base price if no client-specific price
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando produtos...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 text-balance">
                Nossos Produtos
              </h1>
              <p className="text-lg text-pretty">
                Descubra nossa linha completa de bananadas e gomas de amido artesanais. Cada produto é feito com
                ingredientes selecionados e muito carinho.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {products && products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const displayPrice = getProductPrice(product);
                  return (
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
                          {product.ingredients && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Ingredientes:</p>
                              <p className="text-sm text-muted-foreground">{product.ingredients}</p>
                            </div>
                          )}
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
                          {displayPrice !== null && displayPrice !== undefined ? (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Preço:</p>
                              <p className="text-lg font-bold text-primary">R$ {displayPrice.toFixed(2)}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Preço sob consulta</p>
                          )}
                          
                          {/* Seletor de Quantidade */}
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
                              price: displayPrice, // Passa o preço correto
                            }, quantities[product.id])}
                          >
                            Adicionar ao Pedido <ShoppingCart className="size-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
                  Em breve teremos novos produtos para você. Entre em contato para mais informações.
                </p>
                <Button asChild>
                  <Link href="/contato"><span>Fale Conosco</span></Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground text-balance">
                Interessado em Grandes Quantidades?
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Oferecemos condições especiais para atacadistas e grandes pedidos. Entre em contato para um orçamento
                personalizado.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/contato"><span>Fale Conosco</span></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}