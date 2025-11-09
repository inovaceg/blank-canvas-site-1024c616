import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Ensure Image is imported

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products from database
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Nossos Produtos
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
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
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden group">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      {product.image_url ? (
                        <Image // Changed from <img> to <Image>
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
                    <CardHeader>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-3">{product.description}</CardDescription>
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
                        <Button asChild className="w-full mt-4">
                          <Link href="/solicitar-orcamento">Solicitar Orçamento</Link>
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
                  Em breve teremos novos produtos para você. Entre em contato para mais informações.
                </p>
                <Button asChild>
                  <Link href="/contato">Fale Conosco</Link>
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
                <Button asChild size="lg">
                  <Link href="/solicitar-orcamento">Solicitar Orçamento</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contato">Fale Conosco</Link>
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