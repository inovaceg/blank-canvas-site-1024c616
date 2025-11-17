CREATE TABLE public.zoho_tokens (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      scope TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE public.zoho_tokens ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow authenticated users to manage their own Zoho tokens" ON public.zoho_tokens
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Opcional: Trigger para atualizar 'updated_at' automaticamente
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.zoho_tokens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();