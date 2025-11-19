import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Address {
  id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  neighborhood?: string;
  city: string;
  state: string;
  cep: string;
  is_default: boolean;
}

interface AddressManagementProps {
  clientId: string;
}

export function AddressManagement({ clientId }: AddressManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    address_line1: "",
    address_line2: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("client_id", clientId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newAddress: typeof formData) => {
      const { error } = await supabase.from("addresses").insert([
        {
          ...newAddress,
          client_id: clientId,
          is_default: addresses.length === 0, // Primeiro endereço é padrão
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", clientId] });
      toast({ title: "Endereço adicionado com sucesso!" });
      setIsOpen(false);
      setFormData({
        label: "",
        address_line1: "",
        address_line2: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar endereço",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await supabase.from("addresses").delete().eq("id", addressId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", clientId] });
      toast({ title: "Endereço removido com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao remover endereço",
        variant: "destructive",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (addressId: string) => {
      // Primeiro, remove o padrão de todos
      await supabase.from("addresses").update({ is_default: false }).eq("client_id", clientId);

      // Define o novo padrão
      const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", addressId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", clientId] });
      toast({ title: "Endereço padrão atualizado!" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Endereços de Entrega</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Endereço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Endereço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Nome do Endereço *</Label>
                <Input
                  id="label"
                  placeholder="Ex: Casa, Trabalho, Depósito"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address_line1">Endereço *</Label>
                <Input
                  id="address_line1"
                  placeholder="Rua, Avenida, etc"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address_line2">Complemento</Label>
                <Input
                  id="address_line2"
                  placeholder="Número, apartamento, etc"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    placeholder="UF"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Salvando..." : "Salvar Endereço"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum endereço cadastrado. Adicione um endereço de entrega.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={address.is_default ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {address.is_default && <Star className="h-4 w-4 text-primary fill-primary" />}
                    {address.label}
                  </div>
                  <div className="flex gap-2">
                    {!address.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(address.id)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  {address.neighborhood && <p>{address.neighborhood}</p>}
                  <p>
                    {address.city} - {address.state}
                  </p>
                  <p>CEP: {address.cep}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
