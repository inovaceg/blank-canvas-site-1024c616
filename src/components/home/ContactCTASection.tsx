import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";

export function ContactCTASection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pronto para Fazer seu Pedido?
          </h2>
          <p className="text-lg text-muted-foreground">
            Entre em contato conosco e descubra como nossos produtos podem enriquecer seu negócio.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/contato">
                <Mail className="size-5 mr-2" />
                Entre em Contato
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="https://wa.me/5532988484644" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-5 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
