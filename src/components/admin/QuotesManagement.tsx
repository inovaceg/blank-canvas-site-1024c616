import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface QuoteRequest {
  id: string;
  contact_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  product_interest: string | null;
  quantity: string | null;
  message: string | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
}

interface ProductMatch {
  product: Product;
  quantity: string;
}

export default function QuotesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<ProductMatch[]>([]);

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quote-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as QuoteRequest[];
    }
  });

  const filteredQuotes = quotes.filter(quote => 
    quote.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!selectedQuote?.product_interest) {
        setMatchedProducts([]);
        return;
      }

      const { data: products } = await supabase
        .from('products')
        .select('id, name, image_url')
        .eq('is_active', true);

      if (products) {
        const matches: ProductMatch[] = [];
        const interestText = selectedQuote.product_interest.toLowerCase();
        
        // Parse the product interest text to extract products and quantities
        // Format example: "Bananada Tradicional (x1); Bananada Banacaxi (x1)"
        const items = selectedQuote.product_interest.split(/[;,]/);
        
        items.forEach(item => {
          const trimmedItem = item.trim();
          // Extract quantity from patterns like (x1), (x2), etc.
          const quantityMatch = trimmedItem.match(/\(x(\d+)\)/i);
          const quantity = quantityMatch ? `x${quantityMatch[1]}` : '1';
          
          // Find matching product
          const matchedProduct = products.find(product => 
            trimmedItem.toLowerCase().includes(product.name.toLowerCase())
          );
          
          if (matchedProduct) {
            matches.push({ product: matchedProduct, quantity });
          }
        });
        
        setMatchedProducts(matches);
      }
    };

    fetchRelatedProducts();
  }, [selectedQuote]);

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Solicitações de Cotação</h2>
        <p className="text-muted-foreground">Visualize as cotações solicitadas ({quotes.length})</p>
      </div>

      <Input
        placeholder="Buscar por nome, email ou empresa..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <Card>
        <CardContent className="p-0">
          {filteredQuotes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma cotação encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote, index) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{quote.contact_name}</TableCell>
                    <TableCell>{quote.company_name || '-'}</TableCell>
                    <TableCell>{quote.product_interest || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(quote.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedQuote(quote)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Cotação</DialogTitle>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Solicitado em {format(new Date(selectedQuote.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Nome do Contato</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.phone}</p>
                  </div>
                  {selectedQuote.company_name && (
                    <div>
                      <p className="text-sm font-medium">Empresa</p>
                      <p className="text-sm text-muted-foreground">{selectedQuote.company_name}</p>
                    </div>
                  )}
                </div>
                
                {(selectedQuote.address || selectedQuote.city || selectedQuote.state) && (
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    {selectedQuote.address && <p className="text-sm text-muted-foreground">{selectedQuote.address}</p>}
                    {(selectedQuote.city || selectedQuote.state) && (
                      <p className="text-sm text-muted-foreground">
                        {selectedQuote.city}{selectedQuote.city && selectedQuote.state && ", "}{selectedQuote.state}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedQuote.product_interest && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Produtos de Interesse</p>
                  </div>
                  
                  {matchedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {matchedProducts.map((match, index) => (
                        <div key={`${match.product.id}-${index}`} className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-muted/20">
                          {match.product.image_url ? (
                            <img 
                              src={match.product.image_url} 
                              alt={match.product.name}
                              className="w-full h-24 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">Sem foto</span>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-tight">{match.product.name}</p>
                            <p className="text-xs text-muted-foreground">Quantidade: {match.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedQuote.product_interest}</p>
                  )}
                </div>
              )}
              
              {selectedQuote.quantity && (
                <div>
                  <p className="text-sm font-medium">Quantidade</p>
                  <p className="text-sm text-muted-foreground">{selectedQuote.quantity}</p>
                </div>
              )}
              
              {selectedQuote.message && (
                <div>
                  <p className="text-sm font-medium">Mensagem</p>
                  <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-md">
                    {selectedQuote.message}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
