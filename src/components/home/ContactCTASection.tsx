import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export function ContactCTASection() {
  const { ref, isInView } = useInView();
  return (
    <section className="py-20 lg:py-32 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className={`font-serif text-3xl lg:text-5xl font-bold text-white transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            Pronto para Fazer Parceria?
          </h2>
          <p className={`text-lg text-white/90 transition-all duration-700 delay-150 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Entre em contato conosco pelo WhatsApp e descubra como nossos produtos podem agregar valor ao seu negócio.
          </p>
          
          <div className={`flex justify-center transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
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
