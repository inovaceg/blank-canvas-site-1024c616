-- 1. Revogar todas as permissões existentes para anon e authenticated na tabela quote_requests
REVOKE ALL ON public.quote_requests FROM anon;
REVOKE ALL ON public.quote_requests FROM authenticated;

-- 2. Conceder as permissões básicas necessárias
GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;

-- 3. Desativar e reativar o RLS na tabela para limpar qualquer estado residual
ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 4. Remover todas as políticas RLS existentes para quote_requests
DROP POLICY IF EXISTS "Allow anon insert for quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to delete all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to delete quote requests" ON public.quote_requests; -- Pode haver uma política com nome ligeiramente diferente

-- 5. Recriar as políticas RLS essenciais
CREATE POLICY "Allow anon insert for quote requests" ON public.quote_requests
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read all quote requests" ON public.quote_requests
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert all quote requests" ON public.quote_requests
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update all quote requests" ON public.quote_requests
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete all quote requests" ON public.quote_requests
FOR DELETE TO authenticated USING (true);