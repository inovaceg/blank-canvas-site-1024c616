import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gerenciar E-mails Zoho - Área Administrativa",
  description: "Crie, edite e gerencie contas de e-mail da sua organização Zoho Mail.",
};

export default function ZohoMailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}