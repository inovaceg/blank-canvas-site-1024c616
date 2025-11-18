"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutForm } from "@/components/checkout-form" // Importar o formulário de checkout

export default function ClientCheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8 text-center">
              Finalizar Pedido
            </h1>

            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl">Seus Dados para o Pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CheckoutForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}