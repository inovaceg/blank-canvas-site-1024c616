"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Package, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedQuantities, setRelatedQuantities] = useState<{ [key: string]: number }>({})
  const [userPrices, setUserPrices] = useState<{ [key: string]: number }>({}); // Preços específicos do cliente
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    fetchProductAndPrices()
  }, [params.id])

  const fetchProductAndPrices = async () => {
    setLoading(true)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id as string)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      toast.error("Erro ao carregar detalhes do produto.")
      router.push("/produtos")
      return
    }

    if (!data.is_active) {
      toast.error("Este produto não está disponível no momento.")
      router.push("/produtos")
      return
    }

    setProduct(data)
    setQuantity(1)
    fetchRelatedProducts(data.category, data.id)

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

  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .neq("id", currentProductId)
      .limit(5)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching related products:", error)
      setRelatedProducts([])
      return
    }
    setRelatedProducts(data || [])
    const initialRelatedQuantities: { [key: string]: number } = {}
    data?.forEach(p => {
      initialRelatedQuantities[p.id] = 1
    })
    setRelatedQuantities(initialRelatedQuantities)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    setQuantity(newQuantity)
  }

  const handleRelatedQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    setRelatedQuantities(prev => ({
      ...prev,
      [productId]: newQuantity,
    }))
  }

  const getProductPrice = (productItem: Product) => {
    if (isLoggedIn && userPrices[productItem.id] !== undefined) {
      return userPrices[productItem.id];
    }
    return productItem.price; // Fallback to base price if no client-specific price
  }

  const handleAddToCart = () => {
    if (product) {
      const displayPrice = getProductPrice(product);
      addItem({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        weight: product.weight,
        units_per_package: product.units_per_package,
        price: displayPrice, // Passa o preço correto
      }, quantity)
    }
  }

  const handleAddRelatedToCart = (relatedProduct: Product, quantityToAdd: number) => {
    const displayPrice = getProductPrice(relatedProduct);
    addItem({
      id: relatedProduct.id,
      name: relatedProduct.name,
      image_url: relatedProduct.image_url,
      weight: relatedProduct.weight,
      units_per_package: relatedProduct.units_per_package,
      price: displayPrice, // Passa o preço correto
    }, quantityToAdd)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando detalhes do produto...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Produto não encontrado.</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const productDisplayPrice = getProductPrice(product);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
            >
              <span>
                <ArrowLeft className="size-4" />
                Voltar para o Catálogo
              </span>
            </Link>

            <Card className="grid md:grid-cols-2 gap-8 p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  {product.name}
                </h1>
                <div className="text-lg text-muted-foreground whitespace-pre-wrap prose" dangerouslySetInnerHTML={{ __html: product.description }} />

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
                  {productDisplayPrice !== null && productDisplayPrice !== undefined ? (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Preço:</p>
                      <p className="text-lg font-bold text-primary">R$ {productDisplayPrice.toFixed(2)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Preço sob consulta</p>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                    Adicionar ao Pedido <ShoppingCart className="size-5 ml-2" />
                  </Button>
                </div>
              </div >
            </Card >

            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8 text-center">
                  Outros produtos que você pode gostar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {relatedProducts.map((relatedProduct) => {
                    const relatedDisplayPrice = getProductPrice(relatedProduct);
                    return (
                      <Card key={relatedProduct.id} className="overflow-hidden group">
                        <Link href={`/produtos/${relatedProduct.id}`} className="block">
                          <div className="aspect-square relative overflow-hidden bg-muted">
                            {relatedProduct.image_url ? (
                              <Image
                                src={relatedProduct.image_url}
                                alt={relatedProduct.name}
                                fill
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="size-12 text-muted-foreground/30" />
                              </div>
                            )}
                            {relatedProduct.is_featured && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-primary text-primary-foreground text-xs">Destaque</Badge>
                              </div>
                            )}
                          </div>
                        </Link>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base line-clamp-2">{relatedProduct.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2" dangerouslySetInnerHTML={{ __html: relatedProduct.description }} />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {relatedDisplayPrice !== null && relatedDisplayPrice !== undefined ? (
                            <p className="text-sm font-bold text-primary mb-2">R$ {relatedDisplayPrice.toFixed(2)}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground mb-2">Preço sob consulta</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleRelatedQuantityChange(relatedProduct.id, relatedQuantities[relatedProduct.id] - 1)}
                              disabled={relatedQuantities[relatedProduct.id] <= 1}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <Input
                              type="number"
                              value={relatedQuantities[relatedProduct.id]}
                              onChange={(e) => handleRelatedQuantityChange(relatedProduct.id, parseInt(e.target.value))}
                              className="w-12 text-center h-8 text-sm"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleRelatedQuantityChange(relatedProduct.id, relatedQuantities[relatedProduct.id] + 1)}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          <Button
                            className="w-full mt-3 text-xs h-8"
                            onClick={() => handleAddRelatedToCart(relatedProduct, relatedQuantities[relatedProduct.id])}
                          >
                            Adicionar ao Pedido <ShoppingCart className="size-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div >
        </div >
      </main >

      <SiteFooter />
    </div >
  )
}