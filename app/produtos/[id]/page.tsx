"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Package, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  category: string
  description: string
  ingredients?: string
  weight?: string
  price?: number
  image_url?: string
  is_featured?: boolean
  units_per_package?: number
  created_at: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id as string)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      toast.error("Erro ao carregar detalhes do produto.")
      router.push("/produtos") // Redireciona se o produto não for encontrado
      return
    }

    setProduct(data)
    setLoading(false)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        weight: product.weight,
        units_per_package: product.units_per_package,
      }, quantity)
    }
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
              <ArrowLeft className="size-4" />
              Voltar para o Catálogo
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
                <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>

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
                  {product.price !== null && product.price !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Preço:</p>
                      <p className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                    </div>
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
                    <ShoppingCart className="size-5 mr-2" /> Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}