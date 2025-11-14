-- 1. Cria uma função que será executada pelo gatilho
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Remove qualquer gatilho antigo para evitar conflitos
DROP TRIGGER IF EXISTS on_settings_update ON public.settings;

-- 3. Cria o novo gatilho que executa a função antes de qualquer atualização na tabela 'settings'
CREATE TRIGGER on_settings_update
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();