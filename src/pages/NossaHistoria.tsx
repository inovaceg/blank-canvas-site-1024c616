import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NossaHistoriaPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold">Nossa História</h1>
          <p className="mt-4 text-muted-foreground">
            Conheça a história da Doces São Fidélis...
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
