import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phoneNumber: string | undefined | null): string {
  if (!phoneNumber) return "-";
  // Remove todos os caracteres não numéricos
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Aplica a máscara (XX-X-XXXX-XXXX)
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
  }
  return phoneNumber; // Retorna o original se não conseguir formatar
}

// A função parseQuoteMessage foi removida, pois os detalhes dos produtos serão armazenados de forma estruturada em JSONB.
// A nova estrutura de pedidos usará um campo 'product_details' do tipo JSONB.