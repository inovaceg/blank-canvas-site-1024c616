import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Heart, Users, Trophy, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Importar Image

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
                Doces São Fidélis: Tradição e Qualidade Desde 2000
              </h1>
              <p className="text-lg text-pretty">
                Uma jornada de mais de duas décadas dedicada à produção de doces artesanais de qualidade superior.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section - Início */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/traditional-banana-candy-bananada.jpg"
                  alt="Produção artesanal de bananadas"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Calendar className="size-4" />
                  Outubro de 2000
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  Uma Jornada de Sabor e Tradição
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Após duas décadas de experiência no setor de doces e confeitos, Roberto Porto, apaixonado pelas tradicionais mariolas desde sua infância, percebeu uma lacuna no mercado: a falta de uma bananada que combinasse qualidade superior, sabor autêntico e um custo acessível.
                  </p>
                  <p>
                    Com esse sonho, investiu todas as suas economias e, em outubro de 2000, nascia a Doces São Fidelis. O início foi em uma pequena cozinha no bairro Nova Divinéia, em São Fidélis/RJ, com uma equipe reduzida, focada na produção do nosso principal produto: a bananada.
                  </p>
                  <p>
                    A seleção rigorosa das melhores bananas, o cuidado especial na adição de cada ingrediente e a atenção minuciosa em cada etapa do processo refletiam-se na qualidade única dos nossos doces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section - Expansão e Excelência */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  Expansão e Compromisso com a Excelência
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Após o primeiro ano de operação, a crescente demanda exigiu uma expansão. As obras para a construção de uma fábrica começaram, e com a nova estrutura, conseguimos aumentar consideravelmente a produção da bananada e expandir nosso portfólio, com destaque para nossas deliciosas gomas de amido.
                  </p>
                  <p>
                    Desde o início, nosso compromisso tem sido com a excelência em cada detalhe. Nosso rigoroso padrão de qualidade, aliado a uma logística eficiente, tem nos permitido conquistar a confiança de clientes e parceiros e levar nossos doces para dentro de inúmeros lares.
                  </p>
                  <p>
                    Atualmente, contamos com cerca de 50 colaboradores que, com muito orgulho, são parte fundamental da nossa história. Mais do que produzir doces, preservamos memórias e criamos momentos de felicidade.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/assorted-fruit-starch-gummies-colorful.jpg"
                  alt="Gomas de amido coloridas"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section (Mantido) */}
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
                  <h3 className="font-serif text-xl font-bold text-foreground">Tradição Familiar</h3>
                  <p className="text-sm text-muted-foreground">
                    Após 25 anos, permanecemos fiéis às nossas raízes como uma empresa familiar.
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
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">Nossa Trajetória</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {[
                {
                  year: "2000",
                  title: "Fundação e Sonho",
                  description: "Nascimento da Doces São Fidelis em outubro, com o sonho de Roberto Porto de levar bananadas de qualidade superior ao mercado.",
                },
                {
                  year: "2001",
                  title: "Expansão da Produção",
                  description: "A crescente demanda exige a construção de uma fábrica maior, permitindo o aumento da produção e a expansão do portfólio com gomas de amido.",
                },
                {
                  year: "2010",
                  title: "Reconhecimento Regional",
                  description: "Conquistamos o reconhecimento pela qualidade e sabor autêntico, consolidando a marca no estado do Rio de Janeiro.",
                },
                {
                  year: "2024",
                  title: "Tradição e Logística",
                  description: "Com 25 anos de história, a empresa atende grandes mercados em RJ, MG, SP e BA, mantendo a excelência artesanal e a eficiência logística.",
                },
              ].map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
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

        {/* New Location Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                <MapPin className="size-8 text-primary" />
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Nossa Localização – Qualidade e Logística Eficiente
              </h2>
              
              {/* Imagem Aérea movida para cá */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mt-8">
                <Image
                  src="/vista-aerea-fabrica.jpg"
                  alt="Vista aérea da fábrica Doces São Fidélis"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-lg text-muted-foreground space-y-4 pt-6">
                <p>
                  A Doces São Fidelis está localizada na Rua Alsalga Tito de Azevedo, bairro Nova Divinéia, em São Fidélis/RJ.
                </p>
                <p>
                  Nossa localização estratégica no norte do estado do Rio de Janeiro nos permite o acesso a bananas frescas e de altíssima qualidade, provenientes da região serrana do Espírito Santo, uma das maiores referências no cultivo de banana no Brasil.
                </p>
                <p>
                  Com uma infraestrutura moderna e um rigoroso controle de qualidade, atendemos grandes mercados nos estados do Rio de Janeiro, Minas Gerais, São Paulo e Bahia, sempre priorizando agilidade, frescor e excelência em cada entrega.
                </p>
              </div>
              <div className="pt-6">
                <Button asChild size="lg" variant="default">
                  <Link href="/contato">
                    <span>Entre em Contato para Visitas</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6 text-primary-foreground">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-balance">
                Faça Parte da Nossa História
              </h2>
              <p className="text-lg text-primary-foreground/90 text-pretty">
                Conheça nossos produtos e descubra por que somos referência em doces artesanais há mais de 20 anos.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full">
                  <Link href="/produtos"><span>Ver Produtos</span></Link>
                </Button>
                {/* Adicionando bg-transparent para garantir que o fundo branco da variante 'outline' seja sobrescrito */}
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                >
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