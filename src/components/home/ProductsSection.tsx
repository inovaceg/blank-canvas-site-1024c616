import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useInView } from "@/hooks/useInView";
import { LazyImage } from "@/components/LazyImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

// Remove HTML tags from description
const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

interface Product {
  id: string;
  name: string;
  price?: number;
  image_url?: string;
  description?: string;
}

interface ProductsSectionProps {
  products: Product[];
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const { addItem } = useCart();
  const { ref: titleRef, isInView: titleInView } = useInView();
  const { ref: cardsRef, isInView: cardsInView } = useInView();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product: Product, qty: number) => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price || 0, 
      image_url: product.image_url 
    }, qty);
    toast.success(`${qty}x ${product.name} adicionado ao orçamento`);
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center space-y-4 mb-16">
          <h2 className={`font-serif text-3xl lg:text-5xl font-bold text-foreground transition-all duration-700 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            Nosso Catálogo de Produtos
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-150 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Conheça a nossa seleção de bananadas e gomas de amido, feitas com o carinho da tradição.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <Card 
              key={product.id} 
              className={`group overflow-hidden hover:shadow-xl transition-all duration-500 ${
                cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square relative bg-secondary/20 overflow-hidden">
                <LazyImage
                  src={product.image_url || "https://placehold.co/400x400?text=Produto"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(product.description)}</p>
                )}
                {product.price && (
                  <p className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </p>
                )}
                <Button 
                  onClick={() => setSelectedProduct(product)}
                  className="w-full" 
                  size="sm"
                >
                  <ShoppingCart className="size-4 mr-2" />
                  Solicitar Orçamento
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/produtos">Ver Catálogo Completo</Link>
          </Button>
        </div>
      </div>

      {/* Modal de Quantidade */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => {
        if (!open) {
          setSelectedProduct(null);
          setQuantity(1);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {selectedProduct.image_url && (
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
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

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {((selectedProduct.price || 0) * quantity).toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(selectedProduct, quantity)}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
