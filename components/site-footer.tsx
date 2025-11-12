import Link from "next/link"
import { MapPin, Phone, Mail, Instagram } from "lucide-react"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-[#3A1F24] text-white"> {/* Cor de fundo alterada para vinho escuro */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="relative w-[120px] h-[120px] mb-4"> {/* Contêiner para a imagem */}
              <Image
                src="/logo-doces-sao-fidelis.png"
                alt="Doces São Fidélis"
                fill // Usar fill para preencher o contêiner
                className="object-contain" // Manter a proporção dentro do contêiner
              />
            </div>
            <p className="text-sm leading-relaxed">
              Desde 2000 produzindo bananadas e gomas de amido com tradição e qualidade que atravessam gerações.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-[#8C2F43] transition-colors"> {/* Cor de destaque alterada */}
                  Home
                </Link>
              </li>
              <li>
                <Link href="/nossa-historia" className="hover:text-[#8C2F43] transition-colors"> {/* Cor de destaque alterada */}
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-[#8C2F43] transition-colors"> {/* Cor de destaque alterada */}
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/qualidade" className="hover:text-[#8C2F43] transition-colors"> {/* Cor de destaque alterada */}
                  Qualidade
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#8C2F43] transition-colors"> {/* Cor de destaque alterada */}
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
                  <MapPin className="size-5 text-[#8C2F43] flex-shrink-0 mt-0.5" /> {/* Cor de destaque alterada */}
                  <span>São Fidélis, RJ - Brasil</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="size-5 text-[#8C2F43] flex-shrink-0 mt-0.5" /> {/* Cor de destaque alterada */}
                  <span>(32) 98848-4644 (WhatsApp)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="size-5 text-[#8C2F43] flex-shrink-0 mt-0.5" /> {/* Cor de destaque alterada */}
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
                className="inline-flex items-center justify-center size-10 rounded-full bg-[#8C2F43] hover:bg-[#7A2A3A] transition-colors"
                aria-label="Instagram"
              >
                {/* Cor de fundo alterada */}
                <Instagram className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} Doces São Fidélis. Todos os direitos reservados.</p>
          <Link href="/admin/login" className="text-[#8C2F43] hover:underline"> {/* Cor de destaque alterada */}
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}