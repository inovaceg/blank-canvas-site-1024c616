import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

export default function BannerManagement() {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: bannerUrl, isLoading } = useQuery({
    queryKey: ["homepage-banner-admin"],
    queryFn: async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "homepage_banner_url_desktop")
        .maybeSingle();
      return data?.value || "";
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (url: string) => {
      const { error } = await supabase
        .from("settings")
        .upsert({
          key: "homepage_banner_url_desktop",
          value: url,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-banner-admin"] });
      queryClient.invalidateQueries({ queryKey: ["homepage-banner"] });
      toast.success("Banner atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar banner");
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      await updateBannerMutation.mutateAsync(publicUrl);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner da Página Inicial</CardTitle>
          <CardDescription>
            Gerencie a imagem do banner exibida no topo da página inicial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bannerUrl && (
            <div className="space-y-2">
              <Label>Banner Atual</Label>
              <div className="aspect-[21/9] w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={bannerUrl}
                  alt="Banner atual"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="banner-upload">Atualizar Banner</Label>
            <div className="flex gap-2">
              <Input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button disabled={uploading} size="icon" asChild>
                <label htmlFor="banner-upload" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </label>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Recomendado: imagem em formato paisagem (ex: 1920x820px)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
