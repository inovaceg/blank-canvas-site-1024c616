-- 1. Desabilita RLS temporariamente para limpar todas as políticas existentes
ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;

-- 2. Remove todas as políticas existentes para a tabela quote_requests para evitar conflitos
DROP POLICY IF EXISTS "Allow anon insert for quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to delete quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "contact_forms_insert_public" ON public.quote_requests;
DROP POLICY IF EXISTS "contact_forms_delete_auth" ON public.quote_requests;
DROP POLICY IF EXISTS "contact_forms_select_auth" ON public.quote_requests;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.quote_requests;
DROP POLICY IF EXISTS "authenticated_select_policy" ON public.quote_requests;
DROP POLICY IF EXISTS "authenticated_delete_policy" ON public.quote_requests;


-- 3. Reabilita RLS na tabela
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 4. Concede explicitamente o privilégio de INSERT para o papel 'anon' na tabela
GRANT INSERT ON public.quote_requests TO anon;

-- 5. Cria a política para permitir que usuários anônimos insiram dados
CREATE POLICY "Allow anon insert for quote requests" ON public.quote_requests
FOR INSERT TO anon WITH CHECK (true);

-- 6. Concede explicitamente os privilégios de SELECT e DELETE para o papel 'authenticated' na tabela
GRANT SELECT, DELETE ON public.quote_requests TO authenticated;

-- 7. Cria a política para permitir que usuários autenticados excluam dados
CREATE POLICY "Allow authenticated users to delete quote requests" ON public.quote_requests
FOR DELETE TO authenticated USING (true);

-- 8. Cria a política para permitir que usuários autenticados leiam todos os dados
CREATE POLICY "Allow authenticated users to read all quote requests" ON public.quote_requests
FOR SELECT TO authenticated USING (true);