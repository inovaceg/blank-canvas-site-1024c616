import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  subscribed_at: string;
}

export default function NewsletterManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      if (error) throw error;
      return data as Subscriber[];
    }
  });

  const filteredSubscribers = subscribers.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Newsletter</h2>
        <p className="text-muted-foreground">Assinantes da newsletter ({subscribers.length})</p>
      </div>

      <Input
        placeholder="Buscar por nome, email ou cidade..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4">
        {filteredSubscribers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhum assinante encontrado
            </CardContent>
          </Card>
        ) : (
          filteredSubscribers.map((subscriber) => (
            <Card key={subscriber.id}>
              <CardHeader>
                <CardTitle>{subscriber.name}</CardTitle>
                <CardDescription>
                  Inscrito em {format(new Date(subscriber.subscribed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{subscriber.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-muted-foreground">{subscriber.whatsapp}</p>
                  </div>
                  <div>
                    <p className="font-medium">Cidade</p>
                    <p className="text-muted-foreground">{subscriber.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
