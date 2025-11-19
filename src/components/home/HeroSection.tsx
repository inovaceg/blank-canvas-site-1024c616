import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  bannerUrl?: string;
}

export function HeroSection({ bannerUrl }: HeroSectionProps) {
  const defaultBanner = "/hero-banner.jpg";
  const imageSrc = bannerUrl || defaultBanner;

  return (
    <section className="relative flex items-center justify-center text-center overflow-hidden h-[60vh] md:h-[70vh] lg:h-[80vh] bg-primary">
      <div className="absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt="Doces São Fidélis"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl space-y-6 mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white text-balance drop-shadow-lg">
            Tradição e Sabor em Cada Pedaço
          </h1>
          <p className="text-lg md:text-xl text-white/90 text-pretty drop-shadow-md">
            Fornecemos bananadas e gomas de amido artesanais de alta qualidade para lojistas e grandes redes em todo o Brasil.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/produtos">
                Conheça nossos produtos
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link to="/contato">Entre em Contato</Link>
            </Button>
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/#newsletter">Cadastre-se para novidades</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
