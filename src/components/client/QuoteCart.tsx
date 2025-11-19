import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface QuoteCartProps {
  onRequestQuote: () => void;
  isLoading?: boolean;
}

export function QuoteCart({ onRequestQuote, isLoading = false }: QuoteCartProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Seu orçamento está vazio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Meu Orçamento</CardTitle>
            <CardDescription>
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.name}</h4>
              <p className="text-sm text-muted-foreground">
                R$ {item.price.toFixed(2)} / unidade
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) updateQuantity(item.id, value);
                  }}
                  className="h-8 w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="flex-col gap-4 pt-6">
        <div className="w-full flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">
            R$ {getTotalPrice().toFixed(2)}
          </span>
        </div>
        <Button 
          onClick={onRequestQuote} 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Solicitar Orçamento"}
        </Button>
      </CardFooter>
    </Card>
  );
}
