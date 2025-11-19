import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { Award, Package, Users, Calendar } from "lucide-react";

export function AboutSection() {
  const { ref, isInView } = useInView();
  const { ref: statsRef, isInView: statsInView } = useInView();
  
  const yearsCount = useCountUp({ end: 24, isInView: statsInView, duration: 2000 });
  const productsCount = useCountUp({ end: 50, isInView: statsInView, duration: 2500 });
  const clientsCount = useCountUp({ end: 500, isInView: statsInView, duration: 2500 });
  const qualityCount = useCountUp({ end: 100, isInView: statsInView, duration: 2000 });

  const stats = [
    { icon: Calendar, value: yearsCount, suffix: "+", label: "Anos de Experiência" },
    { icon: Package, value: productsCount, suffix: "+", label: "Produtos Diferentes" },
    { icon: Users, value: clientsCount, suffix: "+", label: "Clientes Satisfeitos" },
    { icon: Award, value: qualityCount, suffix: "%", label: "Qualidade Garantida" },
  ];
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

          {/* Estatísticas Animadas */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className={`text-center transition-all duration-700 ${
                    statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
