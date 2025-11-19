const NossaHistoria = () => {
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