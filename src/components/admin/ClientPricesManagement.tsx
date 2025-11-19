import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  company_name: string | null;
  contact_person: string;
}

interface Product {
  id: string;
  name: string;
  price: number | null;
}

interface ClientProductPrice {
  id: string;
  client_id: string;
  product_id: string;
  price: number;
  products: { name: string; price: number | null };
}

export default function ClientPricesManagement() {
  const [selectedClientId, setSelectedClientId] = useState<string>("default");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [newProductId, setNewProductId] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  
  const queryClient = useQueryClient();
  const isDefaultPricing = selectedClientId === "default";

  // Busca clientes
  const { data: clients = [] } = useQuery({
    queryKey: ['clients-for-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, company_name, contact_person')
        .eq('is_active', true)
        .order('company_name');
      if (error) throw error;
      return data as Client[];
    }
  });

  // Busca produtos
  const { data: products = [] } = useQuery({
    queryKey: ['products-for-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Product[];
    }
  });

  // Busca preços personalizados do cliente selecionado OU preços padrão
  const { data: clientPrices = [], isLoading } = useQuery({
    queryKey: ['client-prices', selectedClientId],
    enabled: !!selectedClientId,
    queryFn: async () => {
      // Se for "default", retorna TODOS os produtos (com ou sem preço)
      if (selectedClientId === 'default') {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, category')
          .eq('is_active', true)
          .order('name');
        if (error) throw error;
        // Adapta o formato para ser compatível com ClientProductPrice
        return (data || []).map(product => ({
          id: product.id,
          client_id: 'default',
          product_id: product.id,
          price: product.price || 0,
          products: { name: product.name, price: product.price }
        })) as ClientProductPrice[];
      }
      
      // Caso contrário, busca preços personalizados do cliente
      const { data, error } = await supabase
        .from('client_product_prices')
        .select('*, products(name, price)')
        .eq('client_id', selectedClientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ClientProductPrice[];
    }
  });

  // Mutation para atualizar preço
  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price, isDefault }: { id: string; price: number; isDefault: boolean }) => {
      if (isDefault) {
        // Atualiza o preço padrão na tabela products
        const { error } = await supabase
          .from('products')
          .update({ price })
          .eq('id', id);
        if (error) throw error;
      } else {
        // Atualiza o preço personalizado
        const { error } = await supabase
          .from('client_product_prices')
          .update({ price })
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-prices'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Preço atualizado com sucesso!");
      setEditingPriceId(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar preço");
    }
  });

  // Mutation para adicionar novo preço personalizado
  const addPriceMutation = useMutation({
    mutationFn: async ({ client_id, product_id, price }: { client_id: string; product_id: string; price: number }) => {
      const { error } = await supabase
        .from('client_product_prices')
        .insert({ client_id, product_id, price });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-prices'] });
      toast.success("Preço personalizado adicionado!");
      setNewProductId("");
      setNewPrice("");
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error("Já existe um preço personalizado para este produto");
      } else {
        toast.error("Erro ao adicionar preço personalizado");
      }
    }
  });

  // Mutation para deletar preço personalizado
  const deletePriceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_product_prices')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-prices'] });
      toast.success("Preço personalizado removido!");
    },
    onError: () => {
      toast.error("Erro ao remover preço personalizado");
    }
  });

  const handleSaveEdit = (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast.error("Preço inválido");
      return;
    }
    updatePriceMutation.mutate({ id, price, isDefault: isDefaultPricing });
  };

  const handleAddPrice = () => {
    if (!newProductId || !newPrice) {
      toast.error("Selecione um produto e informe o preço");
      return;
    }
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      toast.error("Preço inválido");
      return;
    }
    addPriceMutation.mutate({
      client_id: selectedClientId,
      product_id: newProductId,
      price
    });
  };

  const availableProducts = products.filter(
    product => !clientPrices.some(cp => cp.product_id === product.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Preços por Cliente</CardTitle>
          <CardDescription>
            Defina preços personalizados para produtos específicos de cada cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecione o Cliente</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <span className="font-semibold">📋 Preços Padrão (Todos os Clientes)</span>
                </SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.company_name || client.contact_person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClientId && (
            <>
              {/* Adicionar novo preço personalizado - só para clientes específicos */}
              {!isDefaultPricing && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                  <h3 className="text-sm font-medium">Adicionar Preço Personalizado</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Select value={newProductId} onValueChange={setNewProductId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (Padrão: R$ {product.price?.toFixed(2) || '0.00'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Preço personalizado"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                    <Button onClick={handleAddPrice} disabled={addPriceMutation.isPending}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de preços - aparece tanto para default quanto para clientes */}
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : clientPrices.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border rounded-lg">
                  {isDefaultPricing 
                    ? "Nenhum produto cadastrado. Cadastre produtos na aba 'Produtos' primeiro." 
                    : "Nenhum preço personalizado configurado para este cliente"}
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        {!isDefaultPricing && <TableHead>Preço Padrão</TableHead>}
                        <TableHead>{isDefaultPricing ? "Preço" : "Preço Personalizado"}</TableHead>
                        <TableHead className="w-24">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientPrices.map((clientPrice) => (
                        <TableRow key={clientPrice.id}>
                          <TableCell className="font-medium">
                            {clientPrice.products.name}
                          </TableCell>
                          {!isDefaultPricing && (
                            <TableCell>
                              <Badge variant="outline">
                                R$ {clientPrice.products.price?.toFixed(2) || '0.00'}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            {editingPriceId === clientPrice.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-32"
                              />
                            ) : (
                              <Badge variant={isDefaultPricing ? (clientPrice.price > 0 ? "default" : "secondary") : "secondary"}>
                                {clientPrice.price > 0 
                                  ? `R$ ${clientPrice.price.toFixed(2)}`
                                  : isDefaultPricing 
                                    ? "Sem preço" 
                                    : "R$ 0.00"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {editingPriceId === clientPrice.id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleSaveEdit(clientPrice.id)}
                                    disabled={updatePriceMutation.isPending}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingPriceId(null);
                                      setEditPrice("");
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingPriceId(clientPrice.id);
                                      setEditPrice(clientPrice.price > 0 ? clientPrice.price.toString() : "");
                                    }}
                                    title={isDefaultPricing ? "Definir/Editar preço padrão" : "Editar preço personalizado"}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  {!isDefaultPricing && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deletePriceMutation.mutate(clientPrice.id)}
                                      disabled={deletePriceMutation.isPending}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
