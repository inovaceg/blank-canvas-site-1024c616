import { useParams } from "react-router-dom";

export default function AdminProductEditPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold">Editar Produto</h1>
      <p className="mt-4 text-muted-foreground">Editando produto ID: {id}</p>
    </div>
  );
}
