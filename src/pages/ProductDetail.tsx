import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductPrice } from "@/hooks/useProductPrices";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { LazyImage } from "@/components/LazyImage";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, error } = useProductPrice(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">Erro ao carregar produto</h1>
        <p className="text-muted-foreground mb-6">O produto que você está procurando não foi encontrado ou houve um erro.</p>
        <Button asChild>
          <Link to="/produtos">Voltar para o Catálogo</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.id || !product.name || !product.final_price) {
      toast.error("Não foi possível adicionar o produto ao carrinho.");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.final_price,
      image_url: product.image_url || undefined,
    }, quantity);
    toast.success(`${quantity}x ${product.name} adicionado ao orçamento`);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <>
      <SEO
        title={product.name}
        description={product.description || `Detalhes do produto ${product.name} da Doces São Fidélis.`}
        image={product.image_url || undefined}
        url={`${window.location.origin}/produtos/${product.id}`}
        type="product"
      />
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/produtos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Catálogo
            </Link>
          </Button>

          <Card className="overflow-hidden">
            <CardHeader className="p-0">
              {product.image_url && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <LazyImage
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
                {product.name}
              </h1>

              {product.description && (
                <div>
                  <h2 className="font-semibold text-xl mb-2">Descrição</h2>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 py-4 border-y border-border">
                {product.weight && (
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="font-medium">{product.weight}</p>
                  </div>
                )}
                {product.units_per_package && (
                  <div>
                    <p className="text-sm text-muted-foreground">Embalagem</p>
                    <p className="font-medium">{product.units_per_package} unidades</p>
                  </div>
                )}
                {product.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Quantidade</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
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
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-sm text-muted-foreground mb-2">Preço unitário</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(product.final_price || 0)}
                    </p>
                    {product.custom_price && product.default_price !== product.custom_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.default_price || 0)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency((product.final_price || 0) * quantity)}
                    </p>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Adicionar ao Orçamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;