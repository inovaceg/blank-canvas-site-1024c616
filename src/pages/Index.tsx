import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { QualitySection } from "@/components/home/QualitySection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ContactCTASection } from "@/components/home/ContactCTASection";
import { VisitFactorySection } from "@/components/home/VisitFactorySection";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  // A query para bannerUrl não é mais necessária aqui, pois HeroSection a busca internamente.
  // const { data: bannerUrl } = useQuery({
  //   queryKey: ['homepage-banner'],
  //   queryFn: async () => {
  //     const { data } = await supabase
  //       .from('settings')
  //       .select('value')
  //       .eq('key', 'homepage_banner_url_desktop')
  //       .maybeSingle();
      
  //     return data?.value;
  //   },
  // });

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Doces São Fidélis",
    "url": "https://docessaofidelis.com.br",
    "logo": "https://docessaofidelis.com.br/logo-doces-sao-fidelis.png",
    "description": "Fornecemos bananadas e gomas de amido artesanais de alta qualidade para lojistas e grandes redes em todo o Brasil.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "sameAs": []
  };

  return (
    <>
      <SEO jsonLd={organizationSchema} />
      <div className="min-h-screen">
        <HeroSection /> {/* Removida a prop bannerUrl */}
        <AboutSection />
        <QualitySection />
        <ProductsSection products={products} />
        <TestimonialsSection />
        <NewsletterSection />
        <ContactCTASection />
        <VisitFactorySection />
      </div>
    </>
  );
};

export default Index;