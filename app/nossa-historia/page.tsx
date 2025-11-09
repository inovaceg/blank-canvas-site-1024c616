import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Heart, Users, Trophy } from "lucide-react"
import Link from "next/link"

export default function OurHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 text-balance">
                Nossa História
              </h1>
              <p className="text-lg text-pretty">
                Uma jornada de mais de duas décadas dedicada à produção de doces artesanais de qualidade superior.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/artisanal-banana-candy-bananadas-on-wooden-table.jpg"
                  alt="Produção artesanal de bananadas"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Calendar className="size-4" />
                  Desde 2000
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Como Tudo Começou</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    A Doces São Fidélis nasceu no ano 2000, na cidade de São Fidélis, Rio de Janeiro, com o sonho de
                    preservar as receitas tradicionais de bananadas e gomas de amido que faziam parte da cultura local
                    há gerações.
                  </p>
                  <p>
                    O que começou como uma pequena produção familiar rapidamente ganhou reconhecimento pela qualidade
                    excepcional dos produtos e pelo sabor autêntico que conquistava a todos que experimentavam.
                  </p>
                  <p>
                    Mantendo a tradição artesanal e utilizando apenas ingredientes naturais selecionados, crescemos e
                    nos tornamos referência em doces de qualidade, sem nunca perder nossa essência.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Nossos Valores</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os princípios que guiam nosso trabalho todos os dias
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                    <Heart className="size-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Paixão</h3>
                  <p className="text-sm text-muted-foreground">
                    Fazemos cada produto com amor e dedicação, como se fosse para nossa própria família
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                    <Trophy className="size-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Qualidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Não abrimos mão da excelência em cada etapa do processo produtivo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                    <Users className="size-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Tradição</h3>
                  <p className="text-sm text-muted-foreground">
                    Preservamos receitas e métodos tradicionais que atravessam gerações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                    <Calendar className="size-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Compromisso</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprometidos em entregar sempre o melhor para nossos clientes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Nossa Trajetória</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  year: "2000",
                  title: "Fundação",
                  description: "Início da produção artesanal de bananadas e gomas em São Fidélis, RJ",
                },
                {
                  year: "2005",
                  title: "Expansão",
                  description: "Ampliação da linha de produtos e início das vendas para outras cidades",
                },
                {
                  year: "2010",
                  title: "Reconhecimento",
                  description: "Conquistamos o reconhecimento regional pela qualidade dos nossos produtos",
                },
                {
                  year: "2015",
                  title: "Modernização",
                  description: "Investimento em equipamentos mantendo os processos artesanais",
                },
                {
                  year: "2020",
                  title: "Crescimento",
                  description: "Expansão da capacidade produtiva e novos canais de distribuição",
                },
                {
                  year: "2024",
                  title: "Atualidade",
                  description: "Mais de duas décadas de tradição, qualidade e sabor incomparável",
                },
              ].map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < 5 && <div className="w-0.5 h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground text-balance">
                Faça Parte da Nossa História
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Conheça nossos produtos e descubra por que somos referência em doces artesanais há mais de 20 anos.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/produtos">Ver Produtos</Link>
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