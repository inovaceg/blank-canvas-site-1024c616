import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Nossa História - Tradição e Qualidade Doces São Fidélis",
  description: "Conheça a jornada da Doces São Fidélis desde 2000, nossa paixão por doces artesanais, compromisso com a qualidade e a tradição familiar em São Fidélis, RJ.",
  keywords: ["História Doces São Fidélis", "Tradição doces", "Fábrica de doces RJ", "Doces artesanais", "Roberto Porto"],
};

export default function OurHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}