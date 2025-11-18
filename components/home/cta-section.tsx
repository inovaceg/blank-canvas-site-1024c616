import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react"; // Importar o ícone de telefone
import React from "react";

export function CtaSection() {
  // Número de WhatsApp para o link (DDD + número, sem formatação)
  const whatsappNumber = "5532988484644"; // Exemplo: 55 (código do Brasil) + 32 (DDD) + 988484644 (número)
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-12 lg:p-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-balance">
                Pronto para Fazer Parceria?
              </h2>
              <p className="text-lg text-primary-foreground/90 text-pretty">
                Entre em contato conosco pelo WhatsApp e descubra como nossos produtos podem agregar
                valor ao seu negócio.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  // Estilo do botão: fundo branco, texto na cor primária, hover suave
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Phone className="size-4" /> {/* Ícone de telefone */}
                    <span>Falar no WhatsApp</span>
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}