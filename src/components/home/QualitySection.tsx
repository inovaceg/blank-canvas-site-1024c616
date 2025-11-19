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
          <img 
            src="/producao-geral.jpg" 
            alt="Equipe de produção artesanal trabalhando" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return <div key={index} className="bg-card border border-border/50 p-10 rounded-2xl shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="p-4 bg-primary/5 rounded-full border-2 border-primary/20">
                    <Icon className="size-10 text-primary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>;
        })}
        </div>
      </div>
    </section>;
}