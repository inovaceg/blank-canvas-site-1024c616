import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function VisitFactorySection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">
            Visite Nossa Fábrica
          </h2>
          <p className="text-muted-foreground text-lg">
            Estamos localizados em São Fidélis, RJ. Venha nos fazer uma visita e conhecer de perto a tradição e a qualidade dos nossos doces.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.5847386486785!2d-41.74356!3d-21.64417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM4JzM5LjAiUyA0McKwNDQnMzYuOCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Doces São Fidélis"
            />
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/contato">
                Entre em Contato para Visitas
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
