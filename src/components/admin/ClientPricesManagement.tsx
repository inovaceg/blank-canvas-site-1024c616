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
  is_custom?: boolean; // Flag para indicar se é preço personalizado ou padrão
}

export default function ClientPricesManagement() {
  const [selectedClientId, setSelectedClientId] = useState<string>("default");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  
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

  // Busca preços do cliente selecionado (ou todos produtos para default)
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
          products: { name: product.name, price: product.price },
          is_custom: false
        })) as ClientProductPrice[];
      }
      
      // Para clientes específicos, busca TODOS os produtos e seus preços (customizados ou padrão)
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('is_active', true)
        .order('name');
      
      if (productsError) throw productsError;
      if (!allProducts) return [];

      // Busca preços personalizados do cliente
      const { data: customPrices } = await supabase
        .from('client_product_prices')
        .select('id, product_id, price')
        .eq('client_id', selectedClientId);

      // Cria um mapa de preços personalizados
      const customPricesMap = new Map(
        customPrices?.map(cp => [cp.product_id, { id: cp.id, price: cp.price }]) || []
      );

      // Retorna todos os produtos com preço personalizado (se existir) ou padrão
      return allProducts.map(product => {
        const customPrice = customPricesMap.get(product.id);
        return {
          id: customPrice?.id || product.id, // ID do registro de preço personalizado ou do produto
          client_id: selectedClientId,
          product_id: product.id,
          price: customPrice?.price || product.price || 0,
          products: { name: product.name, price: product.price },
          is_custom: !!customPrice // Flag para saber se é preço personalizado ou padrão
        };
      }) as ClientProductPrice[];
    }
  });

  // Mutation para atualizar ou criar preço
  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price, isDefault, productId, clientId, isCustom }: { 
      id: string; 
      price: number; 
      isDefault: boolean;
      productId: string;
      clientId: string;
      isCustom: boolean;
    }) => {
      if (isDefault) {
        // Atualiza o preço padrão na tabela products
        const { error } = await supabase
          .from('products')
          .update({ price })
          .eq('id', id);
        if (error) throw error;
      } else {
        // Se já existe preço personalizado, atualiza
        if (isCustom) {
          const { error } = await supabase
            .from('client_product_prices')
            .update({ price })
            .eq('id', id);
          if (error) throw error;
        } else {
          // Se não existe, cria um novo preço personalizado
          const { error } = await supabase
            .from('client_product_prices')
            .insert({ client_id: clientId, product_id: productId, price });
          if (error) throw error;
        }
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

  // Mutation para adicionar novo preço personalizado (removido - agora todos produtos aparecem na lista)
  // Mantido apenas para evitar quebrar referências legadas
  const addPriceMutation = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {},
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

  const handleSaveEdit = (clientPrice: ClientProductPrice) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast.error("Preço inválido");
      return;
    }
    updatePriceMutation.mutate({ 
      id: clientPrice.id, 
      price, 
      isDefault: isDefaultPricing,
      productId: clientPrice.product_id,
      clientId: selectedClientId,
      isCustom: clientPrice.is_custom || false
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Preços por Cliente</CardTitle>
          <CardDescription>
            Selecione "Preços Padrão" para definir preços base de todos os produtos, ou escolha um cliente específico para personalizar preços individuais
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
              {/* Lista de preços - aparece tanto para default quanto para clientes */}
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : clientPrices.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border rounded-lg">
                  Nenhum produto cadastrado. Cadastre produtos na aba 'Produtos' primeiro.
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
                        <TableRow key={`${clientPrice.product_id}-${clientPrice.client_id}`}>
                          <TableCell className="font-medium">
                            {clientPrice.products.name}
                            {!isDefaultPricing && !clientPrice.is_custom && (
                              <span className="ml-2 text-xs text-muted-foreground">(usando padrão)</span>
                            )}
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
                              <Badge variant={
                                isDefaultPricing 
                                  ? (clientPrice.price > 0 ? "default" : "secondary")
                                  : (clientPrice.is_custom ? "default" : "secondary")
                              }>
                                {clientPrice.price > 0 
                                  ? `R$ ${clientPrice.price.toFixed(2)}`
                                  : isDefaultPricing 
                                    ? "Sem preço" 
                                    : `R$ ${clientPrice.products.price?.toFixed(2) || '0.00'}`}
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
                                    onClick={() => handleSaveEdit(clientPrice)}
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
                                    title={
                                      isDefaultPricing 
                                        ? "Definir/Editar preço padrão" 
                                        : clientPrice.is_custom
                                          ? "Editar preço personalizado"
                                          : "Criar preço personalizado para este cliente"
                                    }
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  {!isDefaultPricing && clientPrice.is_custom && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deletePriceMutation.mutate(clientPrice.id)}
                                      disabled={deletePriceMutation.isPending}
                                      title="Remover preço personalizado (voltará ao padrão)"
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
