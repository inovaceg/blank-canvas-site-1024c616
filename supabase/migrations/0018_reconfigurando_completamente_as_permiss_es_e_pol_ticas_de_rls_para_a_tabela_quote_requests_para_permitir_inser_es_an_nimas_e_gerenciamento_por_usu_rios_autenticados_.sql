-- 1. Conceder USAGE no esquema public para o papel anon
GRANT USAGE ON SCHEMA public TO anon;

-- 2. Conceder explicitamente a permissão de INSERT para o papel anon na tabela public.quote_requests
GRANT INSERT ON public.quote_requests TO anon;

-- 3. Desativar e reativar o RLS na tabela para limpar qualquer estado residual
ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 4. Remover todas as políticas RLS existentes para quote_requests
DROP POLICY IF EXISTS "Allow anon insert for quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to insert all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to update all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to delete all quote requests" ON public.quote_requests;

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