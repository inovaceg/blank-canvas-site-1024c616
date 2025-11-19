import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCatalogProps {
  clientId?: string | null;
}

export function ProductCatalog({ clientId }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addItem } = useCart();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["client-products", clientId],
    queryFn: async () => {
      if (clientId) {
        const { data, error } = await supabase
          .from("products_with_client_prices")
          .select("*")
          .eq("client_id", clientId)
          .eq("is_active", true)
          .order("display_order");

        if (error) throw error;
        return data;
      } else {
        // Se não tem clientId, busca produtos com preços padrão
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        if (error) throw error;
        return data.map(product => ({
          ...product,
          final_price: product.price,
          default_price: product.price,
          custom_price: null,
          client_id: null,
        }));
      }
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id!,
      name: product.name!,
      price: product.final_price || 0,
      image_url: product.image_url || undefined,
    });
    toast.success(`${product.name} adicionado ao orçamento`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoadingProducts ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="p-0">
                {product.image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name || "Produto"}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                {product.description && (
                  <div 
                    className="text-sm text-muted-foreground line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
                <div className="space-y-1">
                  {product.weight && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Peso:</strong> {product.weight}
                    </p>
                  )}
                  {product.units_per_package && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Unidades/Caixa:</strong> {product.units_per_package}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    R$ {(product.final_price || 0).toFixed(2)}
                  </p>
                  {product.custom_price && product.default_price !== product.custom_price && (
                    <p className="text-xs text-muted-foreground line-through">
                      R$ {(product.default_price || 0).toFixed(2)}
                    </p>
                  )}
                </div>
                <Button onClick={() => handleAddToCart(product)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
