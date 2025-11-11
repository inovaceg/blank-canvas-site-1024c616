import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import React from "react" // Importar React para usar React.Fragment se necessário

export default async function HomePage() {
  // Conteúdo da página inicial drasticamente simplificado para depuração
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <p>Página inicial simplificada para depuração. Se você vir este texto, o erro não está aqui.</p>
      </main>
      <SiteFooter />
    </div>
  )
}