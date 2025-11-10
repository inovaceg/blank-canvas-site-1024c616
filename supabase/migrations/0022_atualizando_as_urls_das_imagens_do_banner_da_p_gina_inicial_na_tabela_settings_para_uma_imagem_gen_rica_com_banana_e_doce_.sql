-- Atualiza a URL do banner para desktop
INSERT INTO public.settings (key, value)
VALUES ('homepage_banner_url_desktop', '/traditional-banana-candy-bananada.jpg')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Atualiza a URL do banner para tablet
INSERT INTO public.settings (key, value)
VALUES ('homepage_banner_url_tablet', '/traditional-banana-candy-bananada.jpg')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Atualiza a URL do banner para celular
INSERT INTO public.settings (key, value)
VALUES ('homepage_banner_url_mobile', '/traditional-banana-candy-bananada.jpg')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;