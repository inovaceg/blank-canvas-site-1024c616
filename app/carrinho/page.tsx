"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, clearCart, getTotalItems } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    // Aqui você pode adicionar lógica para preparar os dados do carrinho
    // e talvez passá-los para a página de contato ou uma nova página de checkout.
    // Por enquanto, vamos apenas redirecionar para a página de contato.
    router.push("/contato")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8 text-center">
              Seu Carrinho
            </h1>

            {getTotalItems() === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="size-24 text-muted-foreground/30 mx-auto mb-6" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Seu carrinho está vazio
                </h2>
                <p className="text-muted-foreground mb-6">
                  Adicione alguns de nossos deliciosos doces para começar seu pedido!
                </p>
                <Button asChild size="lg">
                  <Link href="/produtos">Ver Produtos</Link>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="flex items-center p-4">
                      <div className="relative size-24 shrink-0 rounded-md overflow-hidden bg-muted mr-4">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center size-full text-muted-foreground/50">
                            <Package className="size-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        {item.weight && (
                          <p className="text-sm text-muted-foreground mt-1">Peso: {item.weight}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="size-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="md:col-span-1">
                  <Card className="p-6 space-y-6">
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total de Itens:</span>
                        <span>{getTotalItems()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Os preços serão informados após a finalização do pedido e contato da nossa equipe.
                      </p>
                      <Button onClick={handleCheckout} className="w-full" size="lg">
                        Finalizar Pedido
                      </Button>
                      <Button variant="outline" onClick={clearCart} className="w-full">
                        Limpar Carrinho
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}