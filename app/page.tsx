import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArrowRight, Award, Heart, Leaf, ShoppingBag, Package, MessageSquareText } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { NewsletterForm } from "@/components/newsletter-form"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

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
  is_active?: boolean // Novo campo
  display_order?: number // Novo campo
  created_at: string
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true) // Filtrar apenas produtos ativos
    .order("display_order", { ascending: true }) // Ordenar por display_order
    .order("created_at", { ascending: false })

  if (productsError) {
    console.error("Error fetching featured products:", productsError)
  }
  console.log("Featured Products fetched for homepage:", featuredProducts); // Adicionado para depuração

  // Fetch banner URL from settings table
  const { data: bannerSetting, error: bannerError } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "homepage_banner_url")
    .single()

  const bannerImageUrl = bannerSetting?.value || "/banner.png" // Fallback to default image

  if (bannerError && bannerError.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error("Error fetching homepage banner URL:", bannerError)
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImageUrl}
            alt="Doces São Fidélis"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-3xl space-y-6 text-center mx-auto">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white text-balance">
              Doces São Fidélis: Sabor Autêntico que Atravessa Gerações
            </h1>
            <p className="text-lg text-white/90 text-pretty">
              Produzindo bananadas e gomas de amido desde 2000 com a tradição artesanal.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/produtos">
                  Veja Nosso Catálogo
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/contato">Entre em Contato</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="#newsletter-section">Cadastre-se para receber novidades</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nós Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Nossa História e Missão</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              A Doces São Fidélis nasceu em 2000, com o sonho de Roberto Porto de criar doces autênticos e deliciosos. A
              nossa missão é produzir bananadas e gomas de amido de qualidade excepcional, respeitando as tradições
              familiares e o sabor único do Brasil.
            </p>
            <Button asChild variant="link" className="text-primary hover:underline">
              <Link href="/nossa-historia">Saiba mais sobre nossa jornada <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios e Qualidade Section (Antiga Features Section) */}
      <section className="py-20 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">
              A Qualidade é o Nosso Maior Compromisso
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Usamos apenas ingredientes naturais, processos artesanais e controle rigoroso em cada etapa da produção.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="size-6 text-primary" />
                </div>
                <CardTitle>Ingredientes Selecionados</CardTitle>
                <CardDescription>
                  Utilizamos apenas ingredientes frescos e naturais, cuidadosamente selecionados para garantir o sabor
                  autêntico e a qualidade superior em cada doce. Sem aditivos artificiais.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="size-6 text-primary" />
                </div>
                <CardTitle>Processo Artesanal</CardTitle>
                <CardDescription>
                  Nossas receitas são passadas de geração em geração, preservando o modo artesanal de preparo que
                  confere um sabor caseiro e inesquecível, cheio de carinho e história.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="size-6 text-primary" />
                </div>
                <CardTitle>Compromisso com a Excelência</CardTitle>
                <CardDescription>
                  Com mais de duas décadas de experiência, somos referência na produção de doces artesanais,
                  conquistando a confiança e o paladar de nossos clientes com excelência e dedicação.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="size-6 text-primary" />
                </div>
                <CardTitle>Variedade de Produtos</CardTitle>
                <CardDescription>
                  Oferecemos uma ampla gama de bananadas e gomas de amido, com diferentes sabores e embalagens,
                  perfeitas para todas as ocasiões e para agradar a todos os gostos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Destaque de Produtos Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Nosso Catálogo de Produtos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça a nossa seleção de bananadas e gomas de amido, feitas com o carinho da tradição.
            </p>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
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
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription dangerouslySetInnerHTML={{ __html: product.description }} />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-6">
                <Package className="size-8 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Nenhum produto em destaque no momento
              </h2>
              <p className="text-muted-foreground mb-6">
                Em breve teremos novos produtos em destaque para você.
              </p>
            </div>
          )}

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

      {/* Depoimentos Section */}
      <section className="py-20 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">O Que Nossos Clientes Dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A satisfação dos nossos clientes é a nossa maior recompensa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="p-6 space-y-4">
                <MessageSquareText className="size-8 text-primary" />
                <p className="text-muted-foreground italic">
                  "As bananadas da Doces São Fidélis são incríveis! O sabor é único e traz toda a tradição que amamos."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                    MS
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">Cliente Satisfeita</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 space-y-4">
                <MessageSquareText className="size-8 text-primary" />
                <p className="text-muted-foreground italic">
                  "As gomas de amido são deliciosas e perfeitas para qualquer hora do dia. Qualidade impecável!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                    JP
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">João Pedro</p>
                    <p className="text-sm text-muted-foreground">Comprador Frequente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 space-y-4">
                <MessageSquareText className="size-8 text-primary" />
                <p className="text-muted-foreground italic">
                  "Recomendo a todos! Os doces são feitos com muito carinho e o sabor é de infância."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                    AF
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ana Ferreira</p>
                    <p className="text-sm text-muted-foreground">Fã dos Doces</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <div className="lg:sticky lg:top-24" id="newsletter-section">
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
                  {/* Removido o botão "Solicitar Orçamento" */}
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link href="/produtos">Ver Todos os Produtos</Link>
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