import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArrowRight, Award, Heart, Leaf, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { NewsletterForm } from "@/components/newsletter-form"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/artisanal-banana-candy-bananadas-on-wooden-table.jpg"
            alt="Bananadas artesanais"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-3xl space-y-6 text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              <Award className="size-4" />
              Tradição desde 2000
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white text-balance">
              Sabor Autêntico que Atravessa Gerações
            </h1>
            <p className="text-lg text-white/90 text-pretty">
              Bananadas e gomas de amido produzidas artesanalmente com a tradição e o carinho de uma empresa familiar
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/produtos">
                  Veja nosso catálogo
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/contato">Entre em contato</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">
              Por Que Escolher Nossos Produtos?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Qualidade, tradição e sabor em cada mordida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="size-6 text-primary" />
                </div>
                <CardTitle>Ingredientes Naturais</CardTitle>
                <CardDescription>
                  Utilizamos apenas ingredientes naturais e de alta qualidade em todas as nossas receitas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="size-6 text-primary" />
                </div>
                <CardTitle>Receitas Tradicionais</CardTitle>
                <CardDescription>
                  Mantemos viva a tradição da culinária artesanal com receitas passadas de geração em geração
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="size-6 text-primary" />
                </div>
                <CardTitle>Mais de 20 Anos</CardTitle>
                <CardDescription>
                  Desde 2000, conquistando clientes com produtos de qualidade superior e sabor incomparável
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="size-6 text-primary" />
                </div>
                <CardTitle>Variedade</CardTitle>
                <CardDescription>
                  Oferecemos bananadas e gomas de amido em diversos sabores e embalagens para todos os gostos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Nossos Produtos em Destaque</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça alguns dos nossos produtos mais populares
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Bananada Tradicional",
                description:
                  "Nossa bananada clássica, feita com bananas selecionadas e açúcar. Sabor autêntico e textura perfeita.",
                image: "/traditional-banana-candy-bananada.jpg",
              },
              {
                name: "Goma de Amido Sortida",
                description:
                  "Mix de gomas de amido em diversos sabores: morango, laranja, limão e uva. Deliciosas e naturais.",
                image: "/assorted-fruit-starch-gummies-colorful.jpg",
              },
              {
                name: "Bananada com Coco",
                description: "A combinação perfeita de banana e coco ralado. Uma explosão de sabores tropicais.",
                image: "/banana-candy-with-coconut-tropical.jpg",
              },
            ].map((product, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/produtos">
                Ver Todos os Produtos
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <div className="space-y-4 mb-8">
                <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Entre em Contato</h2>
                <p className="text-lg text-muted-foreground">
                  Tem alguma dúvida ou quer fazer um pedido? Envie uma mensagem e entraremos em contato em breve.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Newsletter */}
            <div className="lg:sticky lg:top-24">
              <Card className="bg-primary text-primary-foreground border-0">
                <CardContent className="p-8 lg:p-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl lg:text-3xl font-bold">Receba Nossas Novidades</h3>
                      <p className="text-primary-foreground/90">
                        Cadastre-se em nossa newsletter e fique por dentro de promoções, novos produtos e receitas
                        exclusivas!
                      </p>
                    </div>
                    <NewsletterForm />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-12 lg:p-16">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="font-serif text-3xl lg:text-5xl font-bold text-balance">
                  Pronto para Experimentar Nossos Doces?
                </h2>
                <p className="text-lg text-primary-foreground/90 text-pretty">
                  Entre em contato conosco e solicite um orçamento personalizado para o seu pedido. Atendemos pequenas e
                  grandes quantidades.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-background text-foreground hover:bg-background/90"
                  >
                    <Link href="/solicitar-orcamento">
                      Solicitar Orçamento
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link href="/contato">Fale Conosco</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
