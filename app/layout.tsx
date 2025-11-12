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
  title: "Doces São Fidélis - Bananadas e Gomas Artesanais",
  description: "Desde 2000, produzindo bananadas e gomas de amido artesanais com ingredientes naturais e sabor único.",
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