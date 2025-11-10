"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  image_url: z.string().optional().or(z.literal("")),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export function BannerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
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
      image_url: "",
    },
  });

  const watchedImageUrl = watch("image_url");

  useEffect(() => {
    fetchBannerUrl();
  }, []);

  const fetchBannerUrl = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "homepage_banner_url")
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error fetching banner URL:", error);
      toast.error("Erro ao carregar a URL do banner.");
    } else if (data) {
      setImagePreview(data.value || "");
      setValue("image_url", data.value || "");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setTempImageUrl(url);
    setCropDialogOpen(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    try {
      const file = new File([croppedBlob], selectedFile?.name || "banner.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      setImagePreview(url);
      setValue("image_url", url);
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
    if (imagePreview) {
      setTempImageUrl(imagePreview);
      setCropDialogOpen(true);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setValue("image_url", "");
    setSelectedFile(null);
  };

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "homepage_banner_url", value: data.image_url || "" }, { onConflict: "key" });

      if (error) throw error;

      toast.success("Banner atualizado com sucesso!");
      router.refresh(); // Refresh the page to show the updated banner
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Erro ao atualizar o banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 max-w-4xl">
        <div className="space-y-2">
          <Label>Imagem do Banner</Label>
          {imagePreview ? (
            <div className="relative w-full max-w-xl aspect-video">
              <Image
                src={imagePreview}
                alt="Preview do Banner"
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="banner-upload"
                disabled={isUploading}
              />
              <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center gap-2">
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
                      <span className="text-xs text-gray-500">PNG, JPG ou WEBP (máx. 5MB)</span>
                    </p>
                  </>
                )}
              </label>
            </div>
          )}
          {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
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
              "Salvar Banner"
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
        />
      )}
    </>
  );
}