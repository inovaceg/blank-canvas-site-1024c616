import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nossa História e Missão
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A Doces São Fidelis nasceu em outubro de 2000, movida por um sonho: levar doces artesanais de qualidade a todo o Brasil. 
            Após duas décadas de experiência no setor, Roberto Porto, apaixonado pelas tradicionais mariolas desde sua infância, 
            percebeu que havia uma lacuna no mercado: a falta de uma bananada que combinasse qualidade superior, sabor autêntico 
            a cada mordida e um custo acessível.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            O início foi em uma pequena cozinha no bairro Nova Divinéia, em São Fidélis/RJ, com uma equipe reduzida, focada na 
            produção do nosso principal produto: a bananada.
          </p>
          <Button asChild size="lg" variant="outline" className="rounded-full mt-4">
            <Link to="/nossa-historia">Saiba mais sobre nossa jornada</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
