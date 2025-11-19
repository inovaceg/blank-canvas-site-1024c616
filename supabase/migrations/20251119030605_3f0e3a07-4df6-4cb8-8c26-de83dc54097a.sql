-- Função para obter o preço correto de um produto para um cliente específico
-- Retorna o preço personalizado se existir, caso contrário retorna o preço padrão
CREATE OR REPLACE FUNCTION public.get_product_price_for_client(
  p_product_id UUID,
  p_client_id UUID DEFAULT NULL
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price NUMERIC;
BEGIN
  -- Se client_id foi fornecido, tenta buscar preço personalizado
  IF p_client_id IS NOT NULL THEN
    SELECT price INTO v_price
    FROM client_product_prices
    WHERE product_id = p_product_id
      AND client_id = p_client_id
    LIMIT 1;
    
    -- Se encontrou preço personalizado, retorna ele
    IF v_price IS NOT NULL THEN
      RETURN v_price;
    END IF;
  END IF;
  
  -- Caso contrário, retorna o preço padrão do produto
  SELECT price INTO v_price
  FROM products
  WHERE id = p_product_id;
  
  RETURN v_price;
END;
$$;

-- View para facilitar consulta de produtos com preços personalizados
CREATE OR REPLACE VIEW public.products_with_client_prices AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.image_url,
  p.category,
  p.weight,
  p.units_per_package,
  p.is_featured,
  p.is_active,
  p.display_order,
  p.price as default_price,
  cpp.client_id,
  cpp.price as custom_price,
  COALESCE(cpp.price, p.price) as final_price,
  p.created_at,
  p.updated_at
FROM products p
LEFT JOIN client_product_prices cpp ON p.id = cpp.product_id
WHERE p.is_active = true;

-- Comentários para documentação
COMMENT ON FUNCTION public.get_product_price_for_client IS 'Retorna o preço de um produto para um cliente específico. Se houver preço personalizado, retorna ele, caso contrário retorna o preço padrão.';
COMMENT ON VIEW public.products_with_client_prices IS 'View que mostra todos os produtos com seus preços padrão e personalizados por cliente.';