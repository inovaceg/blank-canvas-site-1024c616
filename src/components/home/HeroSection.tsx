import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { ParallaxSection } from "@/components/ParallaxSection";

interface HeroSectionProps {
  bannerUrl?: string;
}

export function HeroSection({ bannerUrl }: HeroSectionProps) {
  const { ref, isInView } = useInView();
  const defaultBanner = "/hero-banner.jpg";
  const imageSrc = bannerUrl || defaultBanner;

  return (
    <ParallaxSection imageUrl={imageSrc} speed={0.5} className="relative flex items-center justify-center text-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl space-y-6 md:space-y-8 mx-auto">
          <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-balance drop-shadow-lg transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Tradição e Sabor em Cada Pedaço
          </h1>
          <p className={`text-base sm:text-lg md:text-xl text-white/90 text-pretty drop-shadow-md transition-all duration-1000 delay-200 max-w-2xl mx-auto ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Fornecemos bananadas e gomas de amido artesanais de alta qualidade para lojistas e grandes redes em todo o Brasil.
          </p>
          <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center pt-4 transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <Link to="/produtos">
                CONHEÇA NOSSOS PRODUTOS
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-background/95 text-foreground hover:bg-background border-2 border-background w-full sm:w-auto"
            >
              <Link to="/contato">ENTRE EM CONTATO</Link>
            </Button>
          </div>
          <div className={`flex justify-center transition-all duration-1000 delay-400 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              <Link to="#newsletter">CADASTRE-SE PARA RECEBER NOVIDADES</Link>
            </Button>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
