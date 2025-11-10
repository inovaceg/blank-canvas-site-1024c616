-- Remove a política existente que só permite usuários autenticados inserirem
DROP POLICY IF EXISTS "Allow public insert for quote requests" ON public.quote_requests;

-- Cria uma nova política que permite usuários anônimos inserirem
CREATE POLICY "Allow anon insert for quote requests" ON public.quote_requests
FOR INSERT TO anon WITH CHECK (true);