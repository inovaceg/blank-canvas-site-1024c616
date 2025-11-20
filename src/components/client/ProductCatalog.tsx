import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom"; // Importar Link

interface ProductCatalogProps {
  clientId?: string | null;
  searchTerm?: string; // Adicionar prop para termo de busca
  selectedCategory?: string; // Adicionar prop para categoria selecionada
  categories?: { id: string; name: string }[]; // Adicionar prop para categorias
  isLoadingCategories?: boolean; // Adicionar prop para estado de carregamento das categorias
}

export function ProductCatalog({ 
  clientId, 
  searchTerm = "", 
  selectedCategory = "all", 
  categories = [], 
  isLoadingCategories = false 
}: ProductCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const { addItem } = useCart();

  const getProductQuantity = (productId: string) => productQuantities[productId] || 1;
  
  const setProductQuantity = (productId: string, qty: number) => {
    setProductQuantities(prev => ({ ...prev, [productId]: Math.max(1, qty) }));
  };

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any, qty: number = 1) => {
    addItem({
      id: product.id!,
      name: product.name!,
      price: product.final_price || 0,
      image_url: product.image_url || undefined,
    }, qty);
    toast.success(`${qty}x ${product.name} adicionado ao orçamento`);
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div className="space-y-6">
      {/* Os campos de busca e filtro de categoria foram movidos para a página Produtos.tsx */}
      {/* Este componente agora apenas renderiza a lista de produtos filtrados */}

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
            <Card 
              key={product.id} 
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader 
                className="p-0 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
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
                <CardTitle 
                  className="text-lg mb-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.name}
                </CardTitle>
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
                      <strong>{product.units_per_package} unidades por embalagem</strong>
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 pt-0">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(product.final_price || 0)}
                    </p>
                    {product.custom_price && product.default_price !== product.custom_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.default_price || 0)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild // Adicionado asChild para permitir Link
                  >
                    <Link to={`/produtos/${product.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
                <div className="w-full flex items-center gap-2">
                  <div className="flex items-center gap-1 flex-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setProductQuantity(product.id, getProductQuantity(product.id) - 1)}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={getProductQuantity(product.id)}
                      onChange={(e) => setProductQuantity(product.id, parseInt(e.target.value) || 1)}
                      className="h-8 w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setProductQuantity(product.id, getProductQuantity(product.id) + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(product, getProductQuantity(product.id))}
                    className="flex-1"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Produto */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {selectedProduct.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
              )}

              <div className="space-y-4">
                {selectedProduct.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                    <div 
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 py-4 border-y">
                  {selectedProduct.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-medium">{selectedProduct.weight}</p>
                    </div>
                  )}
                  {selectedProduct.units_per_package && (
                    <div>
                      <p className="text-sm text-muted-foreground">Embalagem</p>
                      <p className="font-medium">{selectedProduct.units_per_package} unidades</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Quantidade</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Preço unitário</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(selectedProduct.final_price || 0)}
                      </p>
                      {selectedProduct.custom_price && selectedProduct.default_price !== selectedProduct.custom_price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatCurrency(selectedProduct.default_price || 0)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency((selectedProduct.final_price || 0) * quantity)}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(selectedProduct, quantity)}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Adicionar ao Orçamento
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}