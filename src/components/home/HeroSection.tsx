import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react"; // Importar useState e useEffect

export function HeroSection() {
  const { ref, isInView } = useInView();
  const [currentBannerUrl, setCurrentBannerUrl] = useState<string | null>(null);

  const { data: bannerUrls, isLoading: isLoadingBanners } = useQuery({
    queryKey: ['homepage-banners'],
    queryFn: async () => {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['homepage_banner_url_desktop', 'homepage_banner_url_tablet', 'homepage_banner_url_mobile']);
      
      const urls = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string | null>);

      return {
        desktop: urls?.homepage_banner_url_desktop || "/hero-banner.jpg",
        tablet: urls?.homepage_banner_url_tablet || urls?.homepage_banner_url_desktop || "/hero-banner.jpg",
        mobile: urls?.homepage_banner_url_mobile || urls?.homepage_banner_url_tablet || urls?.homepage_banner_url_desktop || "/hero-banner.jpg",
      };
    },
  });

  // Efeito para determinar qual URL de banner usar com base na largura da tela
  useEffect(() => {
    if (!bannerUrls) return;

    const updateBanner = () => {
      const width = window.innerWidth;
      if (width >= 1024) { // Desktop (lg breakpoint)
        setCurrentBannerUrl(bannerUrls.desktop);
      } else if (width >= 768) { // Tablet (md breakpoint)
        setCurrentBannerUrl(bannerUrls.tablet);
      } else { // Mobile
        setCurrentBannerUrl(bannerUrls.mobile);
      }
    };

    updateBanner(); // Define o banner inicial
    window.addEventListener('resize', updateBanner); // Atualiza no redimensionamento

    return () => window.removeEventListener('resize', updateBanner);
  }, [bannerUrls]); // Depende de bannerUrls para re-executar se as URLs mudarem

  // Adicionado console.log para depuração
  console.log("Banner URLs:", bannerUrls);
  console.log("Current Banner URL:", currentBannerUrl);


  if (isLoadingBanners || !bannerUrls) {
    return (
      <div className="relative flex items-center justify-center text-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-gray-200 dark:bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl space-y-6 md:space-y-8 mx-auto">
            <div className="h-12 w-3/4 mx-auto bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-6 w-1/2 mx-auto bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center pt-4">
              <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="flex justify-center">
              <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className={`relative flex items-center justify-center text-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-cover bg-center`}
      style={{ backgroundImage: currentBannerUrl ? `url('${currentBannerUrl}')` : 'none' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl space-y-6 md:space-y-8 mx-auto">
          <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-balance drop-shadow-lg`}>
            Tradição e Sabor em Cada Pedaço
          </h1>
          <p className={`text-base sm:text-lg md:text-xl text-white/90 text-pretty drop-shadow-md max-w-2xl mx-auto`}>
            Fornecemos bananadas e gomas de amido artesanais de alta qualidade para lojistas e grandes redes em todo o Brasil.
          </p>
          <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center pt-4`}>
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <Link to="/produtos">
                CONHEÇA NOSSOS PRODUTOS
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-background/95 text-foreground hover:bg-background border-2 border-background w-full sm:w-auto"
            >
              <Link to="/contato">ENTRE EM CONTATO</Link>
            </Button>
          </div>
          <div className={`flex justify-center`}>
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              <Link to="#newsletter">CADASTRE-SE PARA RECEBER NOVIDADES</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}