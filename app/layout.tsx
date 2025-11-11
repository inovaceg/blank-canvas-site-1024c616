import React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next" // Ainda comentado para depuração
// import { Toaster } from "sonner" // Ainda comentado para depuração
import "./globals.css"
import { CartProvider } from "@/components/cart-provider" // Reintroduzido CartProvider

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Doces São Fidélis - Bananadas e Gomas Artesanais",
  description: "Desde 2000, produzindo bananadas e gomas de amido artesanais com ingredientes naturais e sabor único.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
        <CartProvider> {/* Reintroduzido CartProvider */}
          {children}
        </CartProvider>
        {/* Toaster e Analytics ainda comentados para depuração */}
      </body>
    </html>
  )
}