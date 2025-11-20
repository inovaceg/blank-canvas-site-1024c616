import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  jsonLd?: any;
}

const defaultSEO = {
  title: "Doces São Fidélis - Bananadas, Doces de Banana e Gomas Artesanais",
  description:
    "Fornecemos bananadas, doces de banana, bananadas açucaradas, bananadas com açaí e gomas de amido artesanais de alta qualidade para lojistas e grandes redes em todo o Brasil. Tradição e sabor há mais de 20 anos.",
  keywords:
    "bananada, doce de banana, bananada açucarada, bananada com açaí, goma de amido, doces artesanais, doces tradicionais, atacado de doces, fornecedor de doces, São Fidélis",
  image: "/logo-doces-sao-fidelis.png",
  url: "https://docessaofidelis.com.br",
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  jsonLd,
}: SEOProps) {
  const seo = {
    title: title ? `${title} | Doces São Fidélis` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
  };

  // Absolute URL for image
  const absoluteImage = seo.image.startsWith("http")
    ? seo.image
    : `${window.location.origin}${seo.image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={seo.url} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}