import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

export default function QuotesManagement() {
  const [searchTerm, setSearchTerm] = useState("");

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

      <div className="grid gap-4">
        {filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhuma cotação encontrada
            </CardContent>
          </Card>
        ) : (
          filteredQuotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader>
                <CardTitle>{quote.contact_name}</CardTitle>
                <CardDescription>
                  Solicitado em {format(new Date(quote.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Contato</p>
                      <p className="text-sm text-muted-foreground">{quote.email}</p>
                      <p className="text-sm text-muted-foreground">{quote.phone}</p>
                    </div>
                    {quote.company_name && (
                      <div>
                        <p className="text-sm font-medium">Empresa</p>
                        <p className="text-sm text-muted-foreground">{quote.company_name}</p>
                      </div>
                    )}
                  </div>
                  {(quote.address || quote.city || quote.state) && (
                    <div>
                      <p className="text-sm font-medium">Endereço</p>
                      {quote.address && <p className="text-sm text-muted-foreground">{quote.address}</p>}
                      {(quote.city || quote.state) && (
                        <p className="text-sm text-muted-foreground">
                          {quote.city}{quote.city && quote.state && ", "}{quote.state}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {quote.product_interest && (
                  <div>
                    <p className="text-sm font-medium">Produto de Interesse</p>
                    <p className="text-sm text-muted-foreground">{quote.product_interest}</p>
                  </div>
                )}
                {quote.quantity && (
                  <div>
                    <p className="text-sm font-medium">Quantidade</p>
                    <p className="text-sm text-muted-foreground">{quote.quantity}</p>
                  </div>
                )}
                {quote.message && (
                  <div>
                    <p className="text-sm font-medium">Mensagem</p>
                    <p className="text-sm text-muted-foreground">{quote.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
