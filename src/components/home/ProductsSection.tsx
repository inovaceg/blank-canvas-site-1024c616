import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nossos Produtos em Destaque
          </h2>
          <p className="text-muted-foreground text-lg">
            Conheça nossa linha de produtos artesanais
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-secondary/20">
                <img
                  src={product.image_url || "https://placehold.co/400x400?text=Produto"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                {product.price && (
                  <p className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </p>
                )}
                <Button 
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price || 0, image_url: product.image_url })}
                  className="w-full" 
                  size="sm"
                >
                  <ShoppingCart className="size-4 mr-2" />
                  Adicionar
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
    </section>
  );
}
