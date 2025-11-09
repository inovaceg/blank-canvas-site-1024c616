import Link from "next/link"
import { MapPin, Phone, Mail, Instagram } from "lucide-react"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-[#4A3527] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome%20%281%29%20%281%29-vqBz106SPSsejO2YFogjWyruHk8EV4.png"
              alt="Doces São Fidélis"
              width={120}
              height={120}
              className="mb-4"
            />
            <p className="text-sm leading-relaxed">
              Desde 2000 produzindo bananadas e gomas de amido com tradição e qualidade que atravessam gerações.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-[#FF8C00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/nossa-historia" className="hover:text-[#FF8C00] transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-[#FF8C00] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/qualidade" className="hover:text-[#FF8C00] transition-colors">
                  Qualidade
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#FF8C00] transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Contato</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="size-5 text-[#FF8C00] flex-shrink-0 mt-0.5" />
                  <span>São Fidélis, RJ - Brasil</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="size-5 text-[#FF8C00] flex-shrink-0 mt-0.5" />
                  <span>(32) 98848-4644 (WhatsApp)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="size-5 text-[#FF8C00] flex-shrink-0 mt-0.5" />
                  <span>contato@docessaofidelis.com.br</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Redes Sociais</h3>
              <p className="text-sm mb-3">Siga-nos nas redes sociais e fique por dentro das novidades!</p>
              <a
                href="https://instagram.com/docessaofidelis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center size-10 rounded-full bg-[#FF8C00] hover:bg-[#FF7A00] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} Doces São Fidélis. Todos os direitos reservados.</p>
          <Link href="/admin/login" className="text-[#FF8C00] hover:underline">
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}
