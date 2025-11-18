"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { formatPhoneNumber } from "@/lib/utils"

interface ProductDetail {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  weight?: string;
  units_per_package?: number;
  image_url?: string;
}

interface Order {
  id: string
  user_id: string | null
  company_name: string | null
  contact_name: string
  email: string
  phone: string
  address?: string | null
  city?: string | null
  state?: string | null
  product_details?: ProductDetail[] | null // JSONB com detalhes dos produtos
  total_price?: number | null
  status: string
  message?: string | null
  created_at: string
}

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function OrderDetailsDialog({ open, onOpenChange, order }: OrderDetailsDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido</DialogTitle>
          <DialogDescription>
            Informações completas do pedido feito por {order.contact_name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid grid-cols-1 gap-4 py-4">
            <div>
              <Label className="font-semibold">Data do Pedido:</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <Label className="font-semibold">Contato:</Label>
              <p className="text-sm text-muted-foreground">{order.contact_name}</p>
            </div>
            {order.company_name && (
              <div>
                <Label className="font-semibold">Empresa:</Label>
                <p className="text-sm text-muted-foreground">{order.company_name}</p>
              </div>
            )}
            <div>
              <Label className="font-semibold">E-mail:</Label>
              <p className="text-sm text-muted-foreground">{order.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Telefone:</Label>
              <p className="text-sm text-muted-foreground">{formatPhoneNumber(order.phone)}</p>
            </div>
            {(order.address || order.city || order.state) && (
              <div>
                <Label className="font-semibold">Endereço:</Label>
                <p className="text-sm text-muted-foreground">
                  {order.address}{order.address && (order.city || order.state) ? ", " : ""}
                  {order.city}{order.city && order.state ? " - " : ""}
                  {order.state}
                </p>
              </div>
            )}

            {order.product_details && order.product_details.length > 0 && (
              <div>
                <Label className="font-semibold mb-2 block">Produtos do Pedido:</Label>
                <ul className="space-y-1">
                  {order.product_details.map((product, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{product.name}:</span> {product.quantity} und.
                      {product.price !== undefined && product.price !== null && ` (R$ ${product.price.toFixed(2)}/und.)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {order.total_price !== undefined && order.total_price !== null && (
              <div>
                <Label className="font-semibold">Preço Total do Pedido:</Label>
                <p className="text-lg font-bold text-primary">R$ {order.total_price.toFixed(2)}</p>
              </div>
            )}

            <div>
              <Label className="font-semibold">Status do Pedido:</Label>
              <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
            </div>

            {order.message && (
              <div>
                <Label className="font-semibold">Mensagem Adicional:</Label>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.message}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}