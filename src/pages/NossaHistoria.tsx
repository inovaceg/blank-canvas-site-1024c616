import { useInView } from "@/hooks/useInView";
import { Calendar, Factory, TrendingUp, Award, Users, Package } from "lucide-react";

const NossaHistoria = () => {
  const { ref: timelineRef, isInView: timelineInView } = useInView();
  
  const milestones = [
    {
      year: "2000",
      icon: Calendar,
      title: "Fundação da Empresa",
      description: "Doces São Fidelis nasce em outubro, em uma pequena cozinha no bairro Nova Divinéia, São Fidélis/RJ."
    },
    {
      year: "2005",
      icon: Factory,
      title: "Primeira Expansão",
      description: "Ampliação da estrutura produtiva e aumento da capacidade de produção para atender a demanda crescente."
    },
    {
      year: "2010",
      icon: TrendingUp,
      title: "Expansão Nacional",
      description: "Início do fornecimento para grandes redes de varejo em diversos estados brasileiros."
    },
    {
      year: "2015",
      icon: Award,
      title: "Certificações de Qualidade",
      description: "Obtenção de certificações que comprovam nosso compromisso com a qualidade e segurança alimentar."
    },
    {
      year: "2020",
      icon: Users,
      title: "Mais de 500 Clientes",
      description: "Alcançamos a marca de 500 clientes satisfeitos em todo o Brasil, consolidando nossa presença no mercado."
    },
    {
      year: "2024",
      icon: Package,
      title: "Nova Linha de Produtos",
      description: "Lançamento de novos sabores e variedades, mantendo sempre a tradição e qualidade que nos consagrou."
    }
  ];
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossa História</h1>
            <p className="text-xl text-muted-foreground">
              Uma jornada de tradição, qualidade e paixão pelos doces artesanais
            </p>
          </div>

          <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556910110-a5a63dfd393c?q=80&w=2070"
              alt="Fábrica Doces São Fidélis"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Timeline Section */}
          <div ref={timelineRef} className="py-12">
            <h2 className="text-3xl font-bold text-center mb-12">Nossa Trajetória</h2>
            
            {/* Desktop Timeline */}
            <div className="relative hidden md:block">
              {/* Linha vertical */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  const isLeft = index % 2 === 0;
                  
                  return (
                    <div 
                      key={index}
                      className={`relative flex items-center ${
                        isLeft ? 'flex-row' : 'flex-row-reverse'
                      } transition-all duration-700 ${
                        timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      {/* Conteúdo */}
                      <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <div className={`bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${
                          isLeft ? 'mr-auto' : 'ml-auto'
                        }`}>
                          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                            {isLeft && (
                              <>
                                <h3 className="text-2xl font-bold text-primary">{milestone.year}</h3>
                                <div className="p-2 bg-primary/10 rounded-full">
                                  <Icon className="size-5 text-primary" />
                                </div>
                              </>
                            )}
                            {!isLeft && (
                              <>
                                <div className="p-2 bg-primary/10 rounded-full">
                                  <Icon className="size-5 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-primary">{milestone.year}</h3>
                              </>
                            )}
                          </div>
                          <h4 className="text-lg font-semibold mb-2">{milestone.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      {/* Ponto central */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden relative pl-8">
              {/* Linha vertical */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-primary/20"></div>
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  
                  return (
                    <div 
                      key={index}
                      className={`relative transition-all duration-700 ${
                        timelineInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      {/* Ponto lateral */}
                      <div className="absolute -left-[1.3rem] top-3 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                      
                      {/* Conteúdo */}
                      <div className="bg-card border border-border rounded-lg p-5 shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Icon className="size-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-primary">{milestone.year}</h3>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">{milestone.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl font-bold">O Começo</h2>
            <p className="text-muted-foreground leading-relaxed">
              A Doces São Fidelis nasceu em outubro de 2000, movida por um sonho: levar doces artesanais 
              de qualidade a todo o Brasil. Após duas décadas de experiência no setor, Roberto Porto, 
              apaixonado pelas tradicionais mariolas desde sua infância, percebeu que havia uma lacuna no 
              mercado: a falta de uma bananada que combinasse qualidade superior, sabor autêntico a cada 
              mordida e um custo acessível.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Com isso, decidiu investir todas as suas economias em um novo empreendimento. O início foi em 
              uma pequena cozinha no bairro Nova Divinéia, em São Fidélis/RJ, com uma equipe reduzida, focada 
              na produção do nosso principal produto: a bananada.
            </p>

            <h2 className="text-3xl font-bold mt-12">Crescimento e Expansão</h2>
            <p className="text-muted-foreground leading-relaxed">
              Com o passar dos anos, o compromisso com a qualidade e o sabor autêntico conquistou o paladar 
              de clientes em todo o Brasil. O que começou como uma pequena produção artesanal cresceu e se 
              tornou referência no mercado de doces tradicionais.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Hoje, fornecemos nossos produtos para lojistas e grandes redes de varejo em todo o território 
              nacional, mantendo sempre o compromisso com a qualidade e a tradição que nos trouxe até aqui.
            </p>

            <h2 className="text-3xl font-bold mt-12">Nossos Valores</h2>
            <div className="grid md:grid-cols-3 gap-6 not-prose mt-6">
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Qualidade</h3>
                <p className="text-muted-foreground">
                  Compromisso absoluto com ingredientes selecionados e processos rigorosos de produção.
                </p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Tradição</h3>
                <p className="text-muted-foreground">
                  Receitas tradicionais preservadas e aperfeiçoadas ao longo de mais de duas décadas.
                </p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Inovação</h3>
                <p className="text-muted-foreground">
                  Constante busca por melhorias e novos produtos que encantam nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NossaHistoria;