import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

type BannerKey = 'homepage_banner_url_desktop' | 'homepage_banner_url_tablet' | 'homepage_banner_url_mobile';

export default function BannerManagement() {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: bannerUrls, isLoading } = useQuery({
    queryKey: ["homepage-banners-admin"],
    queryFn: async () => {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in('key', ['homepage_banner_url_desktop', 'homepage_banner_url_tablet', 'homepage_banner_url_mobile']);
      
      const urls = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<BannerKey, string | null>);

      return {
        homepage_banner_url_desktop: urls?.homepage_banner_url_desktop || "",
        homepage_banner_url_tablet: urls?.homepage_banner_url_tablet || "",
        homepage_banner_url_mobile: urls?.homepage_banner_url_mobile || "",
      };
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ key, url }: { key: BannerKey; url: string }) => {
      const { error } = await supabase
        .from("settings")
        .upsert({
          key: key,
          value: url,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-banners-admin"] });
      queryClient.invalidateQueries({ queryKey: ["homepage-banners"] }); // Invalida o cache da HeroSection
      toast.success("Banner atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar banner");
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: BannerKey) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${key.replace(/homepage_banner_url_/, '')}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("product-images") // Usando o bucket de imagens de produto
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      await updateBannerMutation.mutateAsync({ key, url: publicUrl });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Erro ao fazer upload do banner");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const bannerTypes: { key: BannerKey; label: string; recommendation: string }[] = [
    { key: 'homepage_banner_url_desktop', label: 'Banner Desktop', recommendation: 'Recomendado: imagem em formato paisagem (ex: 1920x820px)' },
    { key: 'homepage_banner_url_tablet', label: 'Banner Tablet', recommendation: 'Recomendado: imagem em formato quadrado/paisagem (ex: 1024x768px)' },
    { key: 'homepage_banner_url_mobile', label: 'Banner Mobile', recommendation: 'Recomendado: imagem em formato retrato (ex: 768x1024px)' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banners da Página Inicial</CardTitle>
          <CardDescription>
            Gerencie as imagens do banner exibidas no topo da página inicial para diferentes dispositivos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {bannerTypes.map((banner) => (
            <div key={banner.key} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-semibold">{banner.label}</h3>
              {bannerUrls?.[banner.key] && (
                <div className="space-y-2">
                  <Label>Banner Atual</Label>
                  <div className="aspect-[21/9] w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={bannerUrls[banner.key] || ""}
                      alt={`Banner atual ${banner.label}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`banner-upload-${banner.key}`}>Atualizar {banner.label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={`banner-upload-${banner.key}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, banner.key)}
                    disabled={uploading}
                  />
                  <Button disabled={uploading} size="icon" asChild>
                    <label htmlFor={`banner-upload-${banner.key}`} className="cursor-pointer">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </label>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {banner.recommendation}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}