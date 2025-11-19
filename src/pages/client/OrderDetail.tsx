import { useParams } from "react-router-dom";

export default function ClientOrderDetailPage() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Detalhes do Pedido</h1>
      <p className="mt-4 text-muted-foreground">Pedido ID: {id}</p>
    </div>
  );
}
