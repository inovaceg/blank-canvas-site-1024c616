import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contato Doces São Fidélis - Fale Conosco",
  description: "Entre em contato com a Doces São Fidélis para dúvidas, orçamentos ou visitas. Estamos em São Fidélis, RJ. Telefone, e-mail e formulário de contato disponíveis.",
  keywords: ["Contato Doces São Fidélis", "Telefone Doces São Fidélis", "E-mail Doces São Fidélis", "Endereço Doces São Fidélis", "Fábrica de doces RJ", "Orçamento doces"],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}