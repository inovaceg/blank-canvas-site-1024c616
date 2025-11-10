"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area" // Importar ScrollArea
import { Label } from "@/components/ui/label"
import { formatPhoneNumber, parseQuoteMessage } from "@/lib/utils" // Importar a função de formatação e parseQuoteMessage

interface QuoteRequest {
  id: string
  company_name: string | null
  contact_name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  product_interest?: string
  quantity?: string
  message?: string
  created_at: string
}

interface QuoteDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: QuoteRequest | null
}

export function QuoteDetailsDialog({ open, onOpenChange, quote }: QuoteDetailsDialogProps) {
  if (!quote) return null

  const { products, additionalMessage } = parseQuoteMessage(quote.message);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col"> {/* Removido max-h-[90vh] */}
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação de Orçamento</DialogTitle>
          <DialogDescription>
            Informações completas da solicitação enviada por {quote.contact_name}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid grid-cols-1 gap-4 py-4">
            <div>
              <Label className="font-semibold">Data da Solicitação:</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(quote.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <Label className="font-semibold">Contato:</Label>
              <p className="text-sm text-muted-foreground">{quote.contact_name}</p>
            </div>
            {quote.company_name && (
              <div>
                <Label className="font-semibold">Empresa:</Label>
                <p className="text-sm text-muted-foreground">{quote.company_name}</p>
              </div>
            )}
            <div>
              <Label className="font-semibold">E-mail:</Label>
              <p className="text-sm text-muted-foreground">{quote.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Telefone:</Label>
              <p className="text-sm text-muted-foreground">{formatPhoneNumber(quote.phone)}</p>
            </div>
            {(quote.address || quote.city || quote.state) && (
              <div>
                <Label className="font-semibold">Endereço:</Label>
                <p className="text-sm text-muted-foreground">
                  {quote.address}{quote.address && (quote.city || quote.state) ? ", " : ""}
                  {quote.city}{quote.city && quote.state ? " - " : ""}
                  {quote.state}
                </p>
              </div>
            )}

            {products.length > 0 && (
              <div>
                <Label className="font-semibold mb-2 block">Produtos Solicitados:</Label>
                <ul className="space-y-1">
                  {products.map((product, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{product.name}:</span> {product.quantity} und.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {additionalMessage && (
              <div>
                <Label className="font-semibold">Mensagem Adicional:</Label>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{additionalMessage}</p>
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