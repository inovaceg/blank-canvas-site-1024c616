import { SEO } from "@/components/SEO";
import { LazyImage } from "@/components/LazyImage";

const NossaHistoria = () => {
  return (
    <>
      <SEO
        title="Nossa História"
        description="Conheça a trajetória da Doces São Fidélis, desde a fundação até os dias atuais, mantendo a tradição e qualidade."
        keywords="história doces, doces são fidélis, tradição, qualidade, bananada, goma de amido"
      />
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossa História</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desde 2000, cultivando a tradição e o sabor em cada doce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Nossas Raízes</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Doces São Fidélis nasceu do sonho de levar o sabor autêntico dos doces caseiros para mais pessoas. Fundada em 2000, na charmosa cidade de São Fidélis, no interior do Rio de Janeiro, nossa jornada começou com a paixão por ingredientes frescos e receitas que atravessam gerações.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Desde o início, nosso compromisso foi com a qualidade e a tradição. Cada bananada e goma de amido é produzida com o mesmo carinho e dedicação que nossas avós dedicavam em suas cozinhas, garantindo um sabor inesquecível que remete à infância.
              </p>
            </div>
            <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden">
              <LazyImage
                src="/images/2.jpg"
                alt="Produção de doces Doces São Fidélis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="aspect-video bg-secondary/20 rounded-lg overflow-hidden order-2 md:order-1">
              <LazyImage
                src="/images/vista-aerea.jpg" // Caminho da nova imagem
                alt="Vista aérea da Fábrica Doces São Fidélis" // Alt text atualizado
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold text-foreground">Crescimento e Inovação</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao longo dos anos, a Doces São Fidélis cresceu, mas sem perder a essência artesanal. Investimos em tecnologia para otimizar nossa produção, mantendo sempre o respeito pelos processos tradicionais que garantem a textura e o sabor únicos de nossos produtos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Expandimos nossa linha de produtos e conquistamos o paladar de clientes em diversas regiões, tornando-nos sinônimo de doces de qualidade e confiança. Nossa fábrica, moderna e equipada, segue rigorosos padrões de higiene e segurança alimentar, assegurando a excelência em cada etapa.
              </p>
            </div>
          </div>

          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground">Nosso Futuro</h2>
            <p className="text-muted-foreground leading-relaxed">
              Olhamos para o futuro com a mesma paixão que nos trouxe até aqui. Continuaremos a inovar, aprimorar nossos produtos e a buscar novas formas de adoçar a vida de nossos clientes, sempre com a qualidade e a tradição que são a marca registrada da Doces São Fidélis. Agradecemos a cada um que faz parte da nossa doce história!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NossaHistoria;