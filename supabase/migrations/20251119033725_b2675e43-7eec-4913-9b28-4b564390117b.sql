-- Permitir que usuários autenticados criem pedidos mesmo sem registro em clients
DROP POLICY IF EXISTS "Authenticated users can insert their own orders" ON orders;

CREATE POLICY "Authenticated users can insert orders" 
ON orders 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND (
    client_id IS NULL 
    OR EXISTS (
      SELECT 1 FROM clients 
      WHERE clients.id = orders.client_id 
      AND clients.user_id = auth.uid()
    )
  )
);