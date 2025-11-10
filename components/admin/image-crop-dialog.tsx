"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  onCropComplete: (croppedImageBlob: Blob) => void
  aspectRatio?: number // Adicionado: proporção de aspecto para o canvas de corte
}

export function ImageCropDialog({ open, onOpenChange, imageUrl, onCropComplete, aspectRatio }: ImageCropDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImage(img)
        setZoom(100)
        setRotation(0)
        setPosition({ x: 0, y: 0 })
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const drawImage = useCallback(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const canvasWidth = 800 // Largura máxima para o canvas no diálogo
    const canvasHeight = aspectRatio ? canvasWidth / aspectRatio : canvasWidth // Calcula a altura com base na proporção ou padrão quadrado

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    ctx.save()
    ctx.translate(canvasWidth / 2 + position.x, canvasHeight / 2 + position.y) // Ajusta a translação para a nova altura
    ctx.rotate((rotation * Math.PI) / 180)

    const scale = zoom / 100
    const scaledWidth = image.width * scale
    const scaledHeight = image.height * scale

    ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
    ctx.restore()
  }, [image, zoom, rotation, position, aspectRatio])

  useEffect(() => {
    if (image && canvasRef.current) {
      drawImage()
    }
  }, [image, zoom, rotation, position, drawImage]) // drawImage agora está declarado antes de ser usado aqui

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    if (!canvasRef.current) return

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
          onOpenChange(false)
        }
      },
      "image/jpeg",
      0.95,
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ajustar Imagem</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center bg-gray-100 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto cursor-move border border-gray-300 rounded"
              style={{ maxHeight: "500px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ZoomOut className="size-4 text-gray-600" />
                <span className="text-sm text-gray-600 min-w-12">Zoom:</span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={50}
                max={300}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-12 text-right">{zoom}%</span>
              <ZoomIn className="size-4 text-gray-600" />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="gap-2"
              >
                <RotateCw className="size-4" />
                Rotacionar 90°
              </Button>
              <span className="text-sm text-gray-600">Arraste a imagem para reposicionar</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleCrop} className="bg-[#ff8800] hover:bg-[#e67700]">
            Aplicar e Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}