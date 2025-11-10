-- 1. Conceder explicitamente a permissão de INSERT para o papel anon na tabela public.quote_requests
GRANT INSERT ON public.quote_requests TO anon;

-- 2. Remover a política de INSERT existente para anon (se houver, para evitar conflitos)
DROP POLICY IF EXISTS "Allow anon insert for quote requests" ON public.quote_requests;

-- 3. Criar uma nova política RLS para permitir que usuários anônimos insiram dados
CREATE POLICY "Allow anon insert for quote requests" ON public.quote_requests
FOR INSERT TO anon WITH CHECK (true);

-- 4. Garantir que usuários autenticados possam ler todas as solicitações
DROP POLICY IF EXISTS "Allow authenticated users to read all quote requests" ON public.quote_requests;
CREATE POLICY "Allow authenticated users to read all quote requests" ON public.quote_requests
FOR SELECT TO authenticated USING (true);

-- 5. Garantir que usuários autenticados possam excluir todas as solicitações
DROP POLICY IF EXISTS "Allow authenticated users to delete quote requests" ON public.quote_requests;
CREATE POLICY "Allow authenticated users to delete all quote requests" ON public.quote_requests
FOR DELETE TO authenticated USING (true);