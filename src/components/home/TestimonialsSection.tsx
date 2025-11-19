import { MessageSquare } from "lucide-react";

const testimonials = [
  {
    quote: "As bananadas da Doces São Fidélis são incríveis! O sabor é único e nos toda a tradição que amamos.",
    author: "Maria Silva",
    role: "Cliente Satisfeita",
    initials: "MS",
  },
  {
    quote: "As gomas de amido são deliciosas e perfeitas para qualquer hora do dia. Qualidade impecável!",
    author: "João Pedro",
    role: "Comprador Frequente",
    initials: "JP",
  },
  {
    quote: "Recomendo a todos! Os doces são feitos com muito carinho e o sabor é de infância.",
    author: "Ana Ferreira",
    role: "Fã dos Doces",
    initials: "AF",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-foreground">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-muted-foreground text-lg">
            A satisfação dos nossos clientes é a nossa maior recompensa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <MessageSquare className="size-8 text-primary mb-4" />
              <blockquote className="text-muted-foreground italic mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
