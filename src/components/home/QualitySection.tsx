import { CheckCircle, Sparkles, Award } from "lucide-react";
export function QualitySection() {
  const benefits = [{
    icon: CheckCircle,
    title: "Ingredientes Selecionados",
    description: "Utilizamos apenas ingredientes frescos e naturais, cuidadosamente selecionados para garantir o sabor autêntico e a qualidade superior em cada doce."
  }, {
    icon: Sparkles,
    title: "Processo Artesanal",
    description: "Nossos doces são produzidos artesanalmente, seguindo receitas tradicionais que preservam o sabor e a textura únicos."
  }, {
    icon: Award,
    title: "Controle de Qualidade",
    description: "Cada lote passa por rigoroso controle de qualidade, garantindo que apenas os melhores produtos cheguem até você."
  }];
  return <section className="py-20 lg:py-32 bg-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">
            A Qualidade é o Nosso Maior Compromisso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Usamos apenas ingredientes naturais, processos artesanais e controle rigoroso em cada etapa da produção.
          </p>
        </div>

        {/* Imagem da produção */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mb-12">
          
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="size-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>;
        })}
        </div>
      </div>
    </section>;
}