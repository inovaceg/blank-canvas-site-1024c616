"use client" // Adicionado "use client" para garantir que o componente seja um Client Component

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Leaf, Shield, Award, Thermometer, Users2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Importar Image para usar o componente otimizado
// import type { Metadata } from "next" // Removido o import Metadata

// A exportação de metadata foi movida para app/qualidade/layout.tsx
// export const metadata: Metadata = {
//   title: "Qualidade Doces São Fidélis - Bananadas e Gomas Artesanais",
//   description: "Nosso compromisso com a qualidade: ingredientes naturais, processo produtivo rigoroso e segurança alimentar. Descubra a excelência dos doces São Fidélis.",
//   keywords: ["Qualidade doces", "Segurança alimentar", "Ingredientes naturais", "Processo artesanal", "Certificações doces", "Doces São Fidélis"],
// };

export default function QualityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 text-balance">
                Compromisso com a Qualidade
              </h1>
              <p className="text-lg text-pretty">
                Nosso processo produtivo garante produtos seguros, saborosos e de qualidade superior em cada lote.
              </p>
            </div>
          </div>
        </section>

        {/* Quality Process Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  Processo de Produção Rigoroso
                </h2>
                <p className="text-muted-foreground">
                  Cada etapa do nosso processo é cuidadosamente monitorada para garantir a máxima qualidade do produto
                  final. Da seleção das matérias-primas até o empacotamento, seguimos rigorosos padrões de qualidade.
                </p>
                <ul className="space-y-4">
                  {[
                    "Seleção criteriosa de ingredientes naturais",
                    "Produção artesanal com técnicas tradicionais",
                    "Controle de qualidade em todas as etapas",
                    "Higienização e sanitização constantes",
                    "Empacotamento cuidadoso e seguro",
                    "Rastreabilidade completa do produto",
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle className="size-6 text-primary shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/producao-bananada-1.jpg"
                  alt="Controle de qualidade na produção de bananadas Doces São Fidélis"
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quality Pillars */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Pilares da Qualidade</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os fundamentos que garantem a excelência dos nossos produtos
              </p>
            </div>

            {/* Nova imagem adicionada aqui */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mb-12">
              <Image
                src="/producao-bananada-2.jpg"
                alt="Equipe Doces São Fidélis trabalhando na produção de doces"
                fill
                className="object-cover"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <Leaf className="size-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Ingredientes Naturais</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilizamos apenas ingredientes frescos e naturais, cuidadosamente selecionados para garantir o sabor
                    autêntico e a qualidade superior em cada doce. Sem aditivos artificiais.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <Shield className="size-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Segurança Alimentar</h3>
                  <p className="text-sm text-muted-foreground">
                    Seguimos todas as normas de segurança alimentar vigentes. Nossa produção é realizada em ambiente
                    higienizado com protocolos rigorosos de controle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <Award className="size-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Padrão de Excelência</h3>
                  <p className="text-sm text-muted-foreground">
                    Mantemos o mesmo padrão de qualidade há mais de 20 anos. Cada lote é cuidadosamente inspecionado
                    antes de ser liberado para venda.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <Thermometer className="size-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Controle de Temperatura</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitoramento constante da temperatura durante todo o processo de produção e armazenamento,
                    garantindo a consistência e segurança do produto.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <Users2 className="size-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Equipe Qualificada</h3>
                  <p className="text-sm text-muted-foreground">
                    Nossa equipe é treinada continuamente nas melhores práticas de produção artesanal e segurança
                    alimentar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <CheckCircle className="size-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Testes Rigorosos</h3>
                  <p className="text-sm text-muted-foreground">
                    Realizamos testes de qualidade em diferentes etapas do processo para garantir sabor, textura e
                    aparência perfeitos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                <Award className="size-8 text-primary" />
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Certificações e Conformidade
              </h2>
              <p className="text-lg text-muted-foreground">
                Estamos em conformidade com todas as regulamentações sanitárias e de segurança alimentar vigentes. Nossa
                produção segue os padrões estabelecidos pela vigilância sanitária e boas práticas de fabricação.
              </p>
              <div className="pt-6">
                <Card className="bg-muted/30">
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground">
                      Todos os nossos produtos são fabricados seguindo as diretrizes da Agência Nacional de Vigilância
                      Sanitária (ANVISA) e legislações municipais e estaduais aplicáveis à produção de alimentos
                      artesanais.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground text-balance">
                Qualidade Que Você Pode Confiar
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Experimente nossos produtos e comprove o compromisso com a qualidade que mantemos há mais de duas
                décadas.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/produtos">Ver Produtos</Link>
                </Button>
                {/* Removido o botão "Solicitar Orçamento" */}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}