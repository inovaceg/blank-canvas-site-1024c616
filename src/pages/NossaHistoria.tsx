import { useInView } from "@/hooks/useInView";
import { Calendar, Factory, TrendingUp, Award, Users, Package, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NossaHistoria = () => {
  const { ref: timelineRef, isInView: timelineInView } = useInView();
  const { ref: testimonialsRef, isInView: testimonialsInView } = useInView();

  const milestones = [
    {
      year: "2000",
      icon: Calendar,
      title: "Fundação da Empresa",
      description: "Roberto Porto fundou a Doces São Fidélis com o sonho de levar doces artesanais de qualidade a todo o Brasil.",
    },
    {
      year: "2005",
      icon: Factory,
      title: "Primeira Expansão",
      description: "Ampliação da fábrica e início da distribuição para outros estados do Brasil.",
    },
    {
      year: "2010",
      icon: TrendingUp,
      title: "Crescimento Acelerado",
      description: "Expansão da linha de produtos e conquista de novos mercados em todo o território nacional.",
    },
    {
      year: "2015",
      icon: Award,
      title: "Certificação de Qualidade",
      description: "Conquistamos importantes certificações de qualidade e segurança alimentar.",
    },
    {
      year: "2020",
      icon: Users,
      title: "Parcerias Estratégicas",
      description: "Estabelecimento de parcerias com grandes redes de varejo em todo o Brasil.",
    },
    {
      year: "2024",
      icon: Package,
      title: "Inovação Contínua",
      description: "Lançamento de novos produtos e investimento em tecnologia para melhor atender nossos clientes.",
    },
  ];

  const teamTestimonials = [
    {
      name: "Carlos Mendes",
      role: "Gerente de Produção",
      testimonial: "Trabalhar na Doces São Fidélis é uma experiência única. Aqui, valorizamos a qualidade em cada etapa do processo e isso me motiva todos os dias.",
      initials: "CM",
    },
    {
      name: "Juliana Santos",
      role: "Coordenadora de Qualidade",
      testimonial: "É gratificante fazer parte de uma empresa que se preocupa tanto com a excelência. O ambiente é colaborativo e todos trabalham com paixão.",
      initials: "JS",
    },
    {
      name: "Roberto Lima",
      role: "Operador de Produção",
      testimonial: "Estou aqui há 10 anos e posso dizer que é como uma segunda família. A empresa investe no nosso crescimento e valoriza cada colaborador.",
      initials: "RL",
    },
  ];

  return <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossa História</h1>
            <p className="text-xl text-muted-foreground">
              Uma jornada de tradição, qualidade e paixão pelos doces artesanais
            </p>
          </div>

          <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden">
            
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

          {/* Timeline Section */}
          <div ref={timelineRef} className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12">Nossa Trajetória</h2>
            
            {/* Desktop Timeline */}
            <div className="hidden md:block relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border"></div>
              
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <div
                    key={milestone.year}
                    className={`relative mb-12 transition-all duration-700 ${
                      timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-1/2 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                          <div className="flex items-center gap-3 mb-3" style={{ justifyContent: isLeft ? 'flex-end' : 'flex-start' }}>
                            <Icon className="size-6 text-primary" />
                            <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden relative pl-8">
              <div className="absolute left-0 top-0 w-0.5 h-full bg-border"></div>
              
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                
                return (
                  <div
                    key={milestone.year}
                    className={`relative mb-8 transition-all duration-700 ${
                      timelineInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="size-6 text-primary" />
                        <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Testimonials Section */}
          <div ref={testimonialsRef} className="mt-20">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 transition-all duration-700 ${
                testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}>
                Depoimentos da Equipe
              </h2>
              <p className={`text-muted-foreground text-lg transition-all duration-700 delay-150 ${
                testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Conheça as histórias de quem faz a Doces São Fidélis acontecer todos os dias.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {teamTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className={`bg-card p-8 rounded-lg shadow-sm border border-border transition-all duration-700 ${
                    testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Quote className="size-8 text-primary mb-4" />
                  <blockquote className="text-muted-foreground italic mb-6">
                    "{testimonial.testimonial}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default NossaHistoria;