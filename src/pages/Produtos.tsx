import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCatalog } from "@/components/client/ProductCatalog"; // Importar ProductCatalog

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // A lógica de busca de produtos e categorias será movida para dentro do ProductCatalog
  // No entanto, ainda precisamos das categorias para o filtro de categoria aqui.
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEO
        title="Catálogo de Bananadas, Doces de Banana e Gomas Artesanais"
        description="Explore nossa linha completa de bananadas, doces de banana, bananadas açucaradas, bananadas com açaí e gomas de amido artesanais de alta qualidade para atacado."
        keywords="catálogo de doces, bananada atacado, doce de banana preço, goma de amido preço, comprar doces artesanais, bananada com açaí, bananada açucarada"
      />
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Bananadas, Doces de Banana e Gomas Artesanais</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa linha completa de bananadas, doces de banana, bananadas açucaradas, bananadas com açaí e gomas de amido artesanais
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-5" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Renderiza o ProductCatalog com os filtros */}
          <ProductCatalog 
            searchTerm={searchTerm} 
            selectedCategory={selectedCategory} 
            categories={categories} 
            isLoadingCategories={categoriesLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Produtos;