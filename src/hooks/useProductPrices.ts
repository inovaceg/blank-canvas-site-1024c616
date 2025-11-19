import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ProductWithPrice {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  weight: string | null;
  units_per_package: number | null;
  is_featured: boolean | null;
  is_active: boolean;
  display_order: number | null;
  default_price: number | null;
  custom_price: number | null;
  final_price: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Hook para buscar produtos com preços personalizados para o cliente logado
 * Se o usuário estiver logado e for um cliente, retorna preços personalizados quando existirem
 * Caso contrário, retorna os preços padrão
 */
export const useProductPrices = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['products-with-prices', user?.id],
    queryFn: async () => {
      // Primeiro busca o client_id do usuário logado
      let clientId: string | null = null;
      
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        clientId = clientData?.id || null;
      }

      // Busca produtos básicos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (productsError) throw productsError;
      if (!products) return [];

      // Se não há cliente logado, retorna produtos com preço padrão
      if (!clientId) {
        return products.map(product => ({
          ...product,
          default_price: product.price,
          custom_price: null,
          final_price: product.price,
        })) as ProductWithPrice[];
      }

      // Busca preços personalizados do cliente
      const { data: customPrices } = await supabase
        .from('client_product_prices')
        .select('product_id, price')
        .eq('client_id', clientId);

      const customPricesMap = new Map(
        customPrices?.map(cp => [cp.product_id, cp.price]) || []
      );

      // Combina produtos com preços personalizados
      return products.map(product => ({
        ...product,
        default_price: product.price,
        custom_price: customPricesMap.get(product.id) || null,
        final_price: customPricesMap.get(product.id) || product.price,
      })) as ProductWithPrice[];
    },
  });
};

/**
 * Hook para buscar um produto específico com seu preço personalizado
 */
export const useProductPrice = (productId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['product-price', productId, user?.id],
    enabled: !!productId,
    queryFn: async () => {
      if (!productId) return null;

      // Busca o produto
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (productError) throw productError;
      if (!product) return null;

      // Se não há usuário logado, retorna preço padrão
      if (!user) {
        return {
          ...product,
          default_price: product.price,
          custom_price: null,
          final_price: product.price,
        } as ProductWithPrice;
      }

      // Busca o client_id do usuário
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!clientData) {
        return {
          ...product,
          default_price: product.price,
          custom_price: null,
          final_price: product.price,
        } as ProductWithPrice;
      }

      // Busca preço personalizado
      const { data: customPrice } = await supabase
        .from('client_product_prices')
        .select('price')
        .eq('product_id', productId)
        .eq('client_id', clientData.id)
        .maybeSingle();

      return {
        ...product,
        default_price: product.price,
        custom_price: customPrice?.price || null,
        final_price: customPrice?.price || product.price,
      } as ProductWithPrice;
    },
  });
};
