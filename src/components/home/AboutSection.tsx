import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

export function AboutSection() {
  const { ref, isInView } = useInView();
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className={`font-serif text-3xl lg:text-5xl font-bold text-foreground transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            Nossa História e Missão
          </h2>
          <p className={`text-muted-foreground text-lg leading-relaxed transition-all duration-700 delay-150 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            A Doces São Fidelis nasceu em outubro de 2000, movida por um sonho: levar doces artesanais de qualidade a todo o Brasil. 
            Após duas décadas de experiência no setor, Roberto Porto, apaixonado pelas tradicionais mariolas desde sua infância, 
            percebeu que havia uma lacuna no mercado: a falta de uma bananada que combinasse qualidade superior, sabor autêntico 
            a cada mordida e um custo acessível.
          </p>
          <p className={`text-muted-foreground text-lg leading-relaxed transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            O início foi em uma pequena cozinha no bairro Nova Divinéia, em São Fidélis/RJ, com uma equipe reduzida, focada na 
            produção do nosso principal produto: a bananada.
          </p>
          <Button asChild size="lg" variant="outline" className={`rounded-full mt-4 transition-all duration-700 delay-500 ${
            isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <Link to="/nossa-historia">Saiba mais sobre nossa jornada</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
