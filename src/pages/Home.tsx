import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center">Doces São Fidélis</h1>
          <p className="text-center mt-4 text-muted-foreground">
            Bananadas e Gomas Artesanais de Qualidade desde 2000
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
