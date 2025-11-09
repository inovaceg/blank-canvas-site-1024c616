-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Allow authenticated users to read all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "quote_requests_delete_auth" ON public.quote_requests;
DROP POLICY IF EXISTS "quote_requests_insert_public" ON public.quote_requests;

-- Habilitar RLS na tabela (se já não estiver habilitado)
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 1. Política para permitir que qualquer pessoa (público) insira solicitações de orçamento
CREATE POLICY "Allow public insert for quote requests" ON public.quote_requests
FOR INSERT WITH CHECK (true);

-- 2. Política para permitir que usuários autenticados leiam todas as solicitações de orçamento
CREATE POLICY "Allow authenticated users to read all quote requests" ON public.quote_requests
FOR SELECT TO authenticated USING (true);

-- 3. Política para permitir que usuários autenticados excluam solicitações de orçamento
CREATE POLICY "Allow authenticated users to delete quote requests" ON public.quote_requests
FOR DELETE TO authenticated USING (true);