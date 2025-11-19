import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";

export function ContactCTASection() {
  return (
    <section className="py-20 lg:py-32 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white">
            Pronto para Fazer Parceria?
          </h2>
          <p className="text-lg text-white/90">
            Entre em contato conosco pelo WhatsApp e descubra como nossos produtos podem agregar valor ao seu negócio.
          </p>
          
          <div className="flex justify-center">
            <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90">
              <a href="https://wa.me/5532988484644" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-5 mr-2" />
                FALAR NO WHATSAPP
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
