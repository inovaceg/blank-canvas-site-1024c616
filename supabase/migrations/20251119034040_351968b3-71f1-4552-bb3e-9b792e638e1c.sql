-- Permitir que usuários autenticados criem seu próprio registro de cliente
CREATE POLICY "Clients can insert their own data" 
ON clients 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);