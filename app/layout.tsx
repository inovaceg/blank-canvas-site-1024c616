import React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Doces São Fidélis - Bananadas e Gomas Artesanais de Qualidade",
    template: "%s | Doces São Fidélis",
  },
  description: "Desde 2000, produzindo bananadas e gomas de amido artesanais com ingredientes naturais, sabor único e tradição. Ideal para revenda e consumo.",
  keywords: ["Doces São Fidélis", "Bananada artesanal", "Gomas de amido", "Doces caseiros", "Doces tradicionais", "Comprar bananada online", "Fábrica de doces São Fidélis", "Distribuidor de doces RJ", "Doces para revenda", "Mariola"],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo-doces-sao-fidelis-favicon.png", // Referência exclusiva para o novo favicon
        type: "image/png",
      },
    ],
    apple: "/logo-doces-sao-fidelis-favicon.png", // Usar a mesma imagem para o ícone da Apple
  },
  openGraph: {
    title: "Doces São Fidélis - Bananadas e Gomas Artesanais de Qualidade",
    description: "Desde 2000, produzindo bananadas e gomas de amido artesanais com ingredientes naturais, sabor único e tradição. Ideal para revenda e consumo.",
    url: "https://www.docessaofidelis.com.br", // Substitua pela URL real do seu site
    siteName: "Doces São Fidélis",
    images: [
      {
        url: "/logo-doces-sao-fidelis.png", // Imagem para Open Graph
        width: 800,
        height: 600,
        alt: "Logo Doces São Fidélis",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doces São Fidélis - Bananadas e Gomas Artesanais de Qualidade",
    description: "Desde 2000, produzindo bananadas e gomas de amido artesanais com ingredientes naturais, sabor único e tradição. Ideal para revenda e consumo.",
    images: ["/logo-doces-sao-fidelis.png"], // Imagem para Twitter Card
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <React.Fragment>
            {children}
            <Toaster position="top-center" />
            <Analytics />
          </React.Fragment>
        </CartProvider>
      </body>
    </html>
  )
}