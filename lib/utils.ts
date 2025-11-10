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

interface ParsedProductItem {
  name: string;
  quantity: number;
  weight?: string;
  unitsPerPackage?: string;
}

interface ParsedQuoteContent {
  products: ParsedProductItem[];
  additionalMessage?: string;
}

export function parseQuoteMessage(message: string | undefined | null): ParsedQuoteContent {
  if (!message) {
    return { products: [] };
  }

  const products: ParsedProductItem[] = [];
  let additionalMessage: string | undefined;

  // Divide a mensagem em duas partes: lista de produtos e detalhes adicionais do cliente
  const parts = message.split('\n\nDetalhes adicionais do cliente:\n');
  const productListPart = parts[0];
  additionalMessage = parts.length > 1 ? `Detalhes adicionais do cliente:\n${parts[1]}` : undefined;

  // Filtra as linhas que representam produtos
  const productLines = productListPart.split('\n').filter(line => line.startsWith('- '));

  // Regex para extrair nome, quantidade, peso e unidades por embalagem
  const productRegex = /^- (.+) \(x(\d+)(?:, (.+?))?(?:, (.+?))?\)$/;

  productLines.forEach(line => {
    const match = line.match(productRegex);
    if (match) {
      const name = match[1].trim();
      const quantity = parseInt(match[2], 10);
      const weight = match[3] ? match[3].trim() : undefined;
      const unitsPerPackage = match[4] ? match[4].trim() : undefined;

      products.push({ name, quantity, weight, unitsPerPackage });
    }
  });

  return { products, additionalMessage };
}