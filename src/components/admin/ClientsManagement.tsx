import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Client {
  id: string;
  company_name: string | null;
  contact_person: string;
  email: string;
  phone: string | null;
  cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ClientsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Client[];
    }
  });

  const filteredClients = clients.filter(client => 
    client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
        <p className="text-muted-foreground">Visualize informações dos clientes cadastrados</p>
      </div>

      <Input
        placeholder="Buscar por nome, email ou empresa..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhum cliente encontrado
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {client.contact_person}
                      {!client.is_active && <Badge variant="secondary">Inativo</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {client.company_name || "Sem empresa"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    {client.phone && (
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                      </div>
                    )}
                    {client.cnpj && (
                      <div>
                        <p className="text-sm font-medium">CNPJ</p>
                        <p className="text-sm text-muted-foreground">{client.cnpj}</p>
                      </div>
                    )}
                  </div>
                  {(client.address || client.city || client.state || client.cep) && (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Endereço</p>
                        {client.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
                        {(client.city || client.state) && (
                          <p className="text-sm text-muted-foreground">
                            {client.city}{client.city && client.state && ", "}{client.state}
                          </p>
                        )}
                        {client.cep && <p className="text-sm text-muted-foreground">CEP: {client.cep}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
