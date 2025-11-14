"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Upload, Pencil, X } from "lucide-react"
import { ImageCropDialog } from "@/components/admin/image-crop-dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const bannerSchema = z.object({
  desktop_image_url: z.string().optional().or(z.literal("")),
  tablet_image_url: z.string().optional().or(z.literal("")),
  mobile_image_url: z.string().optional().or(z.literal("")),
});

type BannerFormData = z.infer<typeof bannerSchema>;

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const ASPECT_RATIOS: Record<DeviceType, number> = {
  desktop: 16 / 9,
  tablet: 4 / 3,
  mobile: 9 / 16,
};

const DEVICE_LABELS: Record<DeviceType, string> = {
  desktop: "Desktop (16:9)",
  tablet: "Tablet (4:3)",
  mobile: "Celular (9:16)",
};

const DEVICE_KEYS: Record<DeviceType, keyof BannerFormData> = {
  desktop: "desktop_image_url",
  tablet: "tablet_image_url",
  mobile: "mobile_image_url",
};

export function BannerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop'); // Estado para controlar o dispositivo ativo
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      desktop_image_url: "",
      tablet_image_url: "",
      mobile_image_url: "",
    },
  });

  const watchedDesktopImageUrl = watch("desktop_image_url");
  const watchedTabletImageUrl = watch("tablet_image_url");
  const watchedMobileImageUrl = watch("mobile_image_url");

  const currentImageUrl = watch(DEVICE_KEYS[activeDevice]);

  useEffect(() => {
    fetchBannerUrls();
  }, []);

  const fetchBannerUrls = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["homepage_banner_url_desktop", "homepage_banner_url_tablet", "homepage_banner_url_mobile"]);

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching banner URLs:", error);
      toast.error("Erro ao carregar as URLs dos banners.");
    } else if (data) {
      data.forEach(setting => {
        if (setting.key === "homepage_banner_url_desktop") setValue("desktop_image_url", setting.value || "");
        if (setting.key === "homepage_banner_url_tablet") setValue("tablet_image_url", setting.value || "");
        if (setting.key === "homepage_banner_url_mobile") setValue("mobile_image_url", setting.value || "");
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Aumentado para 10MB
      toast.error("A imagem deve ter no máximo 10MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setTempImageUrl(url);
    setCropDialogOpen(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    try {
      const file = new File([croppedBlob], `banner_${activeDevice}.jpg`, { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      setValue(DEVICE_KEYS[activeDevice], url);
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      console.error("[v0] Upload error:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
      if (tempImageUrl) URL.revokeObjectURL(tempImageUrl);
    }
  };

  const handleEditImage = () => {
    if (currentImageUrl) {
      setTempImageUrl(currentImageUrl);
      setCropDialogOpen(true);
    }
  };

  const handleRemoveImage = () => {
    setValue(DEVICE_KEYS[activeDevice], "");
  };

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);

    try {
      const updates = [
        { key: "homepage_banner_url_desktop", value: data.desktop_image_url || "" },
        { key: "homepage_banner_url_tablet", value: data.tablet_image_url || "" },
        { key: "homepage_banner_url_mobile", value: data.mobile_image_url || "" },
      ];

      const { error } = await supabase
        .from("settings")
        .upsert(updates, { onConflict: "key" });

      if (error) throw error;

      // Chamar a API de revalidação da homepage
      await fetch("/api/revalidate-homepage");

      toast.success("Banners atualizados com sucesso!");
      router.refresh(); // Revalida a página atual do admin
    } catch (error) {
      console.error("Error updating banners:", error);
      toast.error("Erro ao atualizar os banners.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 max-w-4xl">
        <div className="flex space-x-2 mb-6">
          {Object.keys(DEVICE_LABELS).map((device) => (
            <Button
              key={device}
              type="button"
              variant={activeDevice === device ? "default" : "outline"}
              onClick={() => setActiveDevice(device as DeviceType)}
              className="flex-1"
            >
              {DEVICE_LABELS[device as DeviceType]}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Imagem do Banner ({DEVICE_LABELS[activeDevice]})</Label>
          {currentImageUrl ? (
            <div className="relative w-full max-w-xl" style={{ aspectRatio: ASPECT_RATIOS[activeDevice] }}>
              <Image
                src={currentImageUrl}
                alt={`Preview do Banner ${activeDevice}`}
                fill
                className="object-cover w-full h-full rounded-lg border border-gray-300"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleEditImage}
                  className="p-1.5 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="Editar imagem"
                >
                  <Pencil className="size-3 md:size-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="Remover imagem"
                >
                  <X className="size-3 md:size-4 text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-gray-400 transition-colors" style={{ aspectRatio: ASPECT_RATIOS[activeDevice] }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`banner-upload-${activeDevice}`}
                disabled={isUploading}
              />
              <label htmlFor={`banner-upload-${activeDevice}`} className="cursor-pointer flex flex-col items-center gap-2 h-full justify-center">
                {isUploading ? (
                  <>
                    <Loader2 className="size-6 md:size-8 text-gray-400 animate-spin" />
                    <p className="text-xs md:text-sm text-gray-600">Enviando imagem...</p>
                  </>
                ) : (
                  <>
                    <Upload className="size-6 md:size-8 text-gray-400" />
                    <p className="text-xs md:text-sm text-gray-600">
                      Clique para fazer upload ou arraste uma imagem
                      <br />
                      <span className="text-xs text-gray-500">PNG, JPG ou WEBP (máx. 10MB)</span>
                      <br />
                      <span className="text-xs text-gray-500 font-semibold">
                        Recomendado: {DEVICE_LABELS[activeDevice]}
                      </span>
                    </p>
                  </>
                )}
              </label>
            </div>
          )}
          {errors[DEVICE_KEYS[activeDevice]] && <p className="text-sm text-red-600">{errors[DEVICE_KEYS[activeDevice]]?.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 px-4 py-2.5 text-sm md:text-base bg-[#ff8800] text-white rounded-lg hover:bg-[#e67700] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin size-4" />
                Salvando...
              </>
            ) : (
              "Salvar Banners"
            )}
          </Button>
        </div>
      </form>

      {cropDialogOpen && tempImageUrl && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={ASPECT_RATIOS[activeDevice]} // Passando a proporção correta
        />
      )}
    </>
  );
}