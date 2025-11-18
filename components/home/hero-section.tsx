import Link from "next/link";
import { Button } from "@/components/button";
import { ArrowRight } from "lucide-react";
import React from "react";

interface HeroSectionProps {
  desktopBannerUrl: string;
  tabletBannerUrl: string;
  mobileBannerUrl: string;
}

export function HeroSection({ desktopBannerUrl, tabletBannerUrl, mobileBannerUrl }: HeroSectionProps) {
  return (
    <section className="relative flex items-center justify-center text-center overflow-hidden h-[60vh] md:h-[70vh] lg:h-[80vh] bg-primary">
      <div className="absolute inset-0 z-0">
        {desktopBannerUrl && (
          <>
            <picture>
              {mobileBannerUrl && <source media="(max-width: 767px)" srcSet={mobileBannerUrl} />}
              {tabletBannerUrl && <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={tabletBannerUrl} />}
              {desktopBannerUrl && <source media="(min-width: 1024px)" srcSet={desktopBannerUrl} />}
              <img
                key={desktopBannerUrl}
                src={desktopBannerUrl}
                alt="Doces São Fidélis"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-16 md:py-24 lg:py-32 animate-in fade-in duration-1000">
        <div className="max-w-3xl space-y-4 mx-auto">
          <h1 className="font-serif text-4xl lg:text-7xl font-bold text-white text-balance drop-shadow-lg">
            Tradição e Sabor em Cada Pedaço
          </h1>
          <p className="text-xl text-white/90 text-pretty drop-shadow-md">
            Fornecemos bananadas e gomas de amido artesanais de alta qualidade para lojistas e grandes redes em todo o Brasil.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="default" className="rounded-full">
              <Link href="/produtos">
                Conheça nossos produtos
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="default"
              className="rounded-full border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contato"><span>Entre em Contato</span></Link>
            </Button>
            <Button asChild size="default" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#newsletter-section"><span>Cadastre-se para receber novidades</span></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}