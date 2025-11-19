import { z } from "zod";

export const contactFormSchema = z.object({
  contact_name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(20, "Telefone muito longo"),
  company_name: z.string().max(100, "Nome da empresa muito longo").optional().or(z.literal("")),
  city: z.string().max(100, "Nome da cidade muito longo").optional().or(z.literal("")),
  state: z.string().max(50, "Nome do estado muito longo").optional().or(z.literal("")),
  address: z.string().max(200, "Endereço muito longo").optional().or(z.literal("")),
  product_interest: z.string().max(200, "Descrição muito longa").optional().or(z.literal("")),
  quantity: z.string().max(50, "Quantidade muito longa").optional().or(z.literal("")),
  message: z
    .string()
    .max(1000, "Mensagem muito longa")
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
