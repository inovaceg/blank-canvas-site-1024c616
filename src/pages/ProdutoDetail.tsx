import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useParams } from "react-router-dom";

export default function ProdutoDetailPage() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold">Detalhes do Produto</h1>
          <p className="mt-4 text-muted-foreground">Produto ID: {id}</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
