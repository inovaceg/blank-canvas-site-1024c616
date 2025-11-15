import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Qualidade Doces São Fidélis - Bananadas e Gomas Artesanais",
  description: "Nosso compromisso com a qualidade: ingredientes naturais, processo produtivo rigoroso e segurança alimentar. Descubra a excelência dos doces São Fidélis.",
  keywords: ["Qualidade doces", "Segurança alimentar", "Ingredientes naturais", "Processo artesanal", "Certificações doces", "Doces São Fidélis"],
};

export default function QualityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}