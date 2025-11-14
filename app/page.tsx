import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArrowRight, Award, Heart, Leaf, ShoppingBag, Package, MessageSquareText } from "lucide-react"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { NewsletterForm } from "@/components/newsletter-form"
import { createClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { unstable_noStore } from 'next/cache';
import { Badge } from "@/components/ui/badge"
import { MapEmbed } from "@/components/MapEmbed"; // Importação do MapEmbed

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
  is_active?: boolean
  display_order?: number
  created_at: string
}

export const revalidate = 0; // Força a renderização dinâmica, desabilita o cache para esta página

// URL de fallback para o banner, caso o Supabase não retorne nada
const FALLBACK_BANNER_URL = "/traditional-banana-candy-bananada.jpg"; 

export default async function HomePage() {
  unstable_noStore(); // Força a renderização dinâmica para este componente de servidor
  cookies() // Esta chamada também força a página a ser renderizada dinamicamente

  console.log("HomePage rendered at:", new Date().toISOString());

  const supabase = await createClient()

  const { data: featuredProducts, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(8)

  if (productsError) {
    console.error("Error fetching featured products:", productsError)
  }

  const { data: bannerSettings, error: bannerError } = await supabase
    .from("settings")
    .select("key, value, updated_at")
    .in("key", ["homepage_banner_url_desktop", "homepage_banner_url_tablet", "homepage_banner_url_mobile"]);

  console.log("Raw banner settings from Supabase:", JSON.stringify(bannerSettings, null, 2));

  const bannerUrls: Record<string, string> = {};
  const bannerTimestamps: Record<string, string> = {};

  bannerSettings?.forEach(setting => {
    bannerUrls[setting.key] = setting.value ?? "";
    // Usar o timestamp de atualização para cache-busting
    bannerTimestamps[setting.key] = setting.updated_at ? new Date(setting.updated_at).getTime().toString() : '';
  });

  console.log("Processed banner URLs:", JSON.stringify(bannerUrls, null, 2));
  console.log("Processed banner Timestamps:", JSON.stringify(bannerTimestamps, null, 2));

  const getCacheBustedUrl = (urlKey: string, fallbackUrl: string) => {
    const baseUrl = bannerUrls[urlKey];
    const timestamp = bannerTimestamps[urlKey];
    
    const effectiveBaseUrl = (baseUrl && baseUrl.trim() !== "") ? baseUrl : fallbackUrl;

    if (effectiveBaseUrl && effectiveBaseUrl.trim() !== "") {
      // Se houver um timestamp de atualização, use-o. Caso contrário, use o timestamp atual para garantir que o cache seja ignorado.
      const effectiveTimestamp = timestamp || Date.now().toString();
      // Adiciona o parâmetro de cache-busting apenas se a URL não for a de fallback estática (que não precisa de cache-busting)
      if (effectiveBaseUrl !== fallbackUrl) {
        return `${effectiveBaseUrl}?v=${effectiveTimestamp}`;
      }
      return effectiveBaseUrl;
    }
    return "";
  };

  const desktopBannerUrl = getCacheBustedUrl("homepage_banner_url_desktop", FALLBACK_BANNER_URL);
  const tabletBannerUrl = getCacheBustedUrl("homepage_banner_url_tablet", desktopBannerUrl); // Usa desktop como fallback para tablet
  const mobileBannerUrl = getCacheBustedUrl("homepage_banner_url_mobile", desktopBannerUrl); // Usa desktop como fallback para mobile

  console.log("Final desktop banner URL being used:", desktopBannerUrl);
  console.log("Final tablet banner URL being used:", tabletBannerUrl);
  console.log("Final mobile banner URL being used:", mobileBannerUrl);


  if (bannerError && bannerError.code !== 'PGRST116') {
    console.error("Error fetching homepage banner URLs:", bannerError)
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center text-center overflow-hidden h-[60vh] md:h-[70vh] lg:h-[80vh] bg-primary">
          <div className="absolute inset-0 z-0">
            {desktopBannerUrl && (
              <>
                <picture>
                  {mobileBannerUrl && <source media="(max-width: 767px)" srcSet={mobileBannerUrl} />}
                  {tabletBannerUrl && <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={tabletBannerUrl} />}
                  {desktopBannerUrl && <source media="(min-width: 1024px)" srcSet={desktopBannerUrl} />}
                  <img
                    key={desktopBannerUrl} // Adicionando key dinâmica para React
                    src={desktopBannerUrl} // Fallback src
                    alt="Doces São Fidélis"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/40" /> {/* ALTERADO: de bg-black/60 para bg-black/40 */}
              </>
            )}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-16 md:py-24 lg:py-32 animate-in fade-in duration-1000">
            <div className="max-w-3xl space-y-4 mx-auto">
              <h1 className="font-serif text-3xl lg:text-6xl font-bold text-white text-balance drop-shadow-lg">
                Doces São Fidélis: Sabor Autêntico que Atravessa Gerações
              </h1>
              <p className="text-base text-white/90 text-pretty drop-shadow-md">
                Produzindo bananadas e gomas de amido desde 2000 com a tradição artesanal.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="default" className="rounded-full">
                  <Link href="/produtos">
                    Veja Nosso Catálogo
                    <ArrowRight />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="rounded-full border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/contato"><span>Entre em Contato</span></Link>
                </Button>
                <Button asChild size="default" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="#newsletter-section"><span>Cadastre-se para receber novidades</span></Link>
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
                A Doces São Fidelis nasceu em outubro de 2000, movida por um sonho: levar doces artesanais de qualidade a todo o Brasil. Após duas décadas de experiência no setor, Roberto Porto, apaixonado pelas tradicionais mariolas desde sua infância, percebeu que havia uma lacuna no mercado: a falta de uma bananada que combinasse qualidade superior, sabor autêntico a cada mordida e um custo acessível. Com isso, decidiu investir todas as suas economias em um novo empreendimento. O início foi em uma pequena cozinha no bairro Nova Divinéia, em São Fidélis/RJ, com uma equipe reduzida, focada na produção do nosso principal produto: a bananada.
              </p>
              <Button asChild size="lg">
                <Link href="/nossa-historia">
                  Saiba mais sobre nossa jornada <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefícios e Qualidade Section (Antiga Features Section) */}
        <section className="py-20 lg:py-32 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">
                A Qualidade é o Nosso Maior Compromisso
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Usamos apenas ingredientes naturais, processos artesanais e controle rigoroso em cada etapa da produção.
              </p>
            </div>

            <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-6">
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
              <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <Link key={product.id} href={`/produtos/${product.id}`} className="block">
                    <Card className="overflow-hidden">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
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
                        <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: product.description }} />
                      </CardHeader>
                    </Card>
                  </Link>
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
              {/* Card "Entre em Contato" */}
              <div>
                <Card className="bg-primary text-primary-foreground border-0">
                  <CardContent className="p-8 lg:p-12">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="font-serif text-3xl lg:text-5xl font-bold">Entre em Contato</h2>
                        <p className="text-primary-foreground/90">
                          Tem alguma dúvida ou quer fazer um pedido? Envie uma mensagem e entraremos em contato em breve.
                        </p>
                      </div>
                      <ContactForm />
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      <Link href="/produtos"><span>Ver Todos os Produtos</span></Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --------------------------------------------------------------
          NOVA SEÇÃO – MAPA DE LOCALIZAÇÃO (ajustada)
        -------------------------------------------------------------- */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6"> {/* Adicionado max-w-4xl mx-auto text-center space-y-6 */}
              <h3 className="text-center text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Visite Nossa Fábrica
              </h3>
              <p className="text-lg text-muted-foreground text-pretty mb-8">
                Estamos localizados em São Fidélis, RJ. Venha nos fazer uma visita e conhecer de perto a tradição e a qualidade dos nossos doces.
              </p>

              <MapEmbed lat={-21.637652323862493} lng={-41.732340334072234} zoom={15} />

              <div className="pt-6">
                <Button asChild size="lg">
                  <Link href="/contato">
                    <span>Entre em Contato para Visitas</span>
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
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