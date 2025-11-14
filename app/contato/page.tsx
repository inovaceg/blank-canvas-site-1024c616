import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { MapEmbed } from "@/components/MapEmbed"; // Importar MapEmbed
import type { Metadata } from "next" // Importar Metadata

export const metadata: Metadata = {
  title: "Contato Doces São Fidélis - Fale Conosco",
  description: "Entre em contato com a Doces São Fidélis para dúvidas, orçamentos ou visitas. Estamos em São Fidélis, RJ. Telefone, e-mail e formulário de contato disponíveis.",
  keywords: ["Contato Doces São Fidélis", "Telefone Doces São Fidélis", "E-mail Doces São Fidélis", "Endereço Doces São Fidélis", "Fábrica de doces RJ", "Orçamento doces"],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 text-balance">
                Entre em Contato
              </h1>
              <p className="text-lg text-pretty">
                Estamos prontos para atender você. Envie sua mensagem ou utilize um de nossos canais de contato.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 mb-4">
                      <MapPin className="size-6 text-primary" />
                    </div>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>
                      Rua Alsalga Tito de Azevedo, Nova Divinéia
                      <br />
                      São Fidélis, RJ - Brasil
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 mb-4">
                      <Phone className="size-6 text-primary" />
                    </div>
                    <CardTitle>Telefone</CardTitle>
                    <CardDescription>
                      (32) 98848-4644
                      <br />
                      WhatsApp disponível
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 mb-4">
                      <Mail className="size-6 text-primary" />
                    </div>
                    <CardTitle>E-mail</CardTitle>
                    <CardDescription>contato@docessaofidelis.com.br</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 mb-4">
                      <Clock className="size-6 text-primary" />
                    </div>
                    <CardTitle>Horário de Atendimento</CardTitle>
                    <CardDescription>
                      Segunda a Sexta: 8h às 18h
                      <br />
                      Sábado: 8h às 12h
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="bg-primary text-primary-foreground border-0"> {/* Aplicando as classes aqui */}
                  <CardHeader>
                    <CardTitle className="text-2xl">Envie uma Mensagem</CardTitle>
                    <CardDescription className="text-primary-foreground"> {/* Adicionado text-primary-foreground aqui */}
                      Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
                {/* Mapa de localização na página de contato */}
                <div className="mt-8">
                  <h2 className="text-center text-2xl font-semibold text-foreground mb-4">Nossa Localização</h2>
                  <MapEmbed lat={-21.637652323862493} lng={-41.732340334072234} zoom={15} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}