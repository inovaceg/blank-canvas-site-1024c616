import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

export function VisitFactorySection() {
  const { ref: titleRef, isInView: titleInView } = useInView();
  const { ref: mapRef, isInView: mapInView } = useInView();
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <h2 className={`font-serif text-3xl lg:text-5xl font-bold text-foreground transition-all duration-700 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            Visite Nossa Fábrica
          </h2>
          <p className={`text-muted-foreground text-lg transition-all duration-700 delay-150 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Estamos localizados em São Fidélis, RJ. Venha nos fazer uma visita e conhecer de perto a tradição e a qualidade dos nossos doces.
          </p>
        </div>

        <div ref={mapRef} className="max-w-4xl mx-auto">
          <div className={`aspect-video rounded-lg overflow-hidden shadow-lg mb-8 transition-all duration-700 ${
            mapInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3721.584738648679!2d-41.732340!3d-21.637652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDM4JzE1LjYiUyA0McKwNDMnNTYuNCJX!5e1!3m2!1spt-BR!2sbr!4v1234567890&z=18"
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
