-- Desabilita RLS temporariamente para limpar todas as políticas existentes
ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;

-- Remove todas as políticas existentes para a tabela quote_requests
DROP POLICY IF EXISTS "Allow anon insert for quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to delete quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read all quote requests" ON public.quote_requests;

-- Reabilita RLS na tabela
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Recria a política para permitir que usuários anônimos insiram dados
CREATE POLICY "Allow anon insert for quote requests" ON public.quote_requests
FOR INSERT TO anon WITH CHECK (true);

-- Recria a política para permitir que usuários autenticados excluam dados
CREATE POLICY "Allow authenticated users to delete quote requests" ON public.quote_requests
FOR DELETE TO authenticated USING (true);

-- Recria a política para permitir que usuários autenticados leiam todos os dados
CREATE POLICY "Allow authenticated users to read all quote requests" ON public.quote_requests
FOR SELECT TO authenticated USING (true);