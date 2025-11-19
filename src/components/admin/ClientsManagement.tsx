import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Client {
  id: string;
  company_name: string | null;
  contact_person: string;
  email: string;
  phone: string | null;
  cnpj: string | null;
  address: string | null;
  address_number: string | null;
  address_complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ClientsManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

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

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast.success("Cliente atualizado com sucesso!");
      setIsEditing(false);
      setSelectedClient(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar cliente: " + error.message);
    }
  });

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setEditForm(client);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedClient) {
      updateClientMutation.mutate({ id: selectedClient.id, updates: editForm });
    }
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(false);
  };

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
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(client)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedClient} onOpenChange={(open) => {
        if (!open) {
          setSelectedClient(null);
          setIsEditing(false);
          setEditForm({});
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditing ? "Editar Cliente" : `Cliente #${filteredClients.findIndex(c => c.id === selectedClient.id) + 1}`}
                    <Badge variant={isEditing ? "default" : (selectedClient.is_active ? "default" : "secondary")}>
                      {isEditing ? (editForm.is_active ? "Ativo" : "Inativo") : (selectedClient.is_active ? "Ativo" : "Inativo")}
                    </Badge>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => handleEdit(selectedClient)} variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </DialogTitle>
                {!isEditing && (
                  <p className="text-sm text-muted-foreground">
                    Cadastrado em {format(new Date(selectedClient.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                )}
              </DialogHeader>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editForm.is_active ?? true}
                      onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                    />
                    <Label>Cliente Ativo</Label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Contato *</Label>
                      <Input
                        value={editForm.contact_person || ""}
                        onChange={(e) => setEditForm({ ...editForm, contact_person: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <Input
                        value={editForm.cnpj || ""}
                        onChange={(e) => setEditForm({ ...editForm, cnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input
                      value={editForm.company_name || ""}
                      onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                      placeholder="Razão social"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-4">Endereço</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>CEP</Label>
                        <Input
                          value={editForm.cep || ""}
                          onChange={(e) => setEditForm({ ...editForm, cep: e.target.value })}
                          placeholder="00000-000"
                          maxLength={9}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Logradouro</Label>
                          <Input
                            value={editForm.address || ""}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="Rua, Avenida, etc"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Número</Label>
                          <Input
                            value={editForm.address_number || ""}
                            onChange={(e) => setEditForm({ ...editForm, address_number: e.target.value })}
                            placeholder="123"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Complemento</Label>
                          <Input
                            value={editForm.address_complement || ""}
                            onChange={(e) => setEditForm({ ...editForm, address_complement: e.target.value })}
                            placeholder="Apto, Sala, Bloco, etc"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bairro</Label>
                          <Input
                            value={editForm.neighborhood || ""}
                            onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                            placeholder="Bairro"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Cidade</Label>
                          <Input
                            value={editForm.city || ""}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            placeholder="Cidade"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Estado</Label>
                          <Input
                            value={editForm.state || ""}
                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                            placeholder="UF"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações Internas</Label>
                    <Textarea
                      value={editForm.notes || ""}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Notas ou informações adicionais sobre o cliente"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({});
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={!editForm.contact_person || !editForm.email}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              ) : (
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
                          <p className="font-medium">
                            {selectedClient.address}
                            {selectedClient.address_number && `, ${selectedClient.address_number}`}
                            {selectedClient.address_complement && ` - ${selectedClient.address_complement}`}
                          </p>
                        )}
                        {selectedClient.neighborhood && (
                          <p>{selectedClient.neighborhood}</p>
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

                  {selectedClient.notes && (
                    <div>
                      <h4 className="font-semibold mb-3">Observações Internas</h4>
                      <p className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap">{selectedClient.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
