import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Catálogo de Produtos - Bananadas e Gomas de Amido",
  description: "Explore nosso catálogo completo de bananadas artesanais, gomas de amido e doces tradicionais. Produtos frescos e de alta qualidade da Doces São Fidélis.",
  keywords: ["Catálogo de doces", "Bananada", "Goma de amido", "Doces para revenda", "Doces São Fidélis", "Comprar doces", "Mariola"],
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}