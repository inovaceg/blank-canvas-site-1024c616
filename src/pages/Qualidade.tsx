import { CheckCircle, Sparkles, Award, Shield } from "lucide-react";

const Qualidade = () => {
  const qualityPoints = [
    {
      icon: CheckCircle,
      title: "Ingredientes Selecionados",
      description: "Utilizamos apenas ingredientes frescos e naturais, cuidadosamente selecionados de fornecedores certificados. Sem aditivos artificiais ou conservantes prejudiciais à saúde."
    },
    {
      icon: Sparkles,
      title: "Processo Artesanal",
      description: "Nossos doces são produzidos artesanalmente, seguindo receitas tradicionais que preservam o sabor e a textura únicos. Cada lote é preparado com dedicação e cuidado."
    },
    {
      icon: Award,
      title: "Controle de Qualidade Rigoroso",
      description: "Cada lote passa por rigoroso controle de qualidade em todas as etapas de produção. Garantimos que apenas os melhores produtos cheguem até você."
    },
    {
      icon: Shield,
      title: "Certificações e Segurança",
      description: "Nossa produção segue todas as normas sanitárias e de segurança alimentar vigentes. Trabalhamos constantemente para manter os mais altos padrões de qualidade."
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nosso Compromisso com a Qualidade</h1>
            <p className="text-xl text-muted-foreground">
              A excelência em cada etapa do processo produtivo
            </p>
          </div>

          <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden mb-12">
            <img
              src="/producao-geral.jpg"
              alt="Equipe Doces São Fidélis trabalhando na produção de doces artesanais"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-8 mb-12">
            {qualityPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="size-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Nossa Promessa</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Desde o início, em 2000, nosso compromisso tem sido claro: produzir doces artesanais de 
              qualidade superior, mantendo o sabor autêntico e a tradição que conquistou o paladar de 
              clientes em todo o Brasil.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cada produto que sai de nossa fábrica carrega mais de duas décadas de experiência, dedicação 
              e paixão pelo que fazemos. Esse é o nosso diferencial e nossa garantia de qualidade para você.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qualidade;