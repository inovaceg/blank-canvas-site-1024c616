import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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

      <Card>
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum cliente encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client, index) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>{client.contact_person}</TableCell>
                    <TableCell>{client.company_name || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                    <TableCell>
                      <Badge variant={client.is_active ? "default" : "secondary"}>
                        {client.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(client)}
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

      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Cliente #{filteredClients.findIndex(c => c.id === selectedClient.id) + 1}
                  <Badge variant={selectedClient.is_active ? "default" : "secondary"}>
                    {selectedClient.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Cadastrado em {format(new Date(selectedClient.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Informações do Contato</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nome:</span>
                        <p className="font-medium">{selectedClient.contact_person}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{selectedClient.email}</p>
                      </div>
                      {selectedClient.phone && (
                        <div>
                          <span className="text-muted-foreground">Telefone:</span>
                          <p className="font-medium">{selectedClient.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Informações da Empresa</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Empresa:</span>
                        <p className="font-medium">{selectedClient.company_name || "-"}</p>
                      </div>
                      {selectedClient.cnpj && (
                        <div>
                          <span className="text-muted-foreground">CNPJ:</span>
                          <p className="font-medium">{selectedClient.cnpj}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(selectedClient.address || selectedClient.city || selectedClient.state || selectedClient.cep) && (
                  <div>
                    <h4 className="font-semibold mb-3">Endereço</h4>
                    <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-md">
                      {selectedClient.address && (
                        <p className="font-medium">{selectedClient.address}</p>
                      )}
                      {(selectedClient.city || selectedClient.state) && (
                        <p>
                          {selectedClient.city}{selectedClient.city && selectedClient.state && ", "}{selectedClient.state}
                        </p>
                      )}
                      {selectedClient.cep && (
                        <p>CEP: {selectedClient.cep}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
