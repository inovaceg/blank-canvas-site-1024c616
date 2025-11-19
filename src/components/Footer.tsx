import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#3A1F24] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <img
              src="/logo-doces-sao-fidelis.png"
              alt="Doces São Fidélis"
              className="h-[120px] w-[120px] object-contain mb-4"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/120x120?text=Logo";
              }}
            />
            <p className="text-sm leading-relaxed">
              Desde 2000 produzindo bananadas e gomas de amido com tradição e qualidade que atravessam gerações.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-[#8C2F43] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/nossa-historia" className="hover:text-[#8C2F43] transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="hover:text-[#8C2F43] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/qualidade" className="hover:text-[#8C2F43] transition-colors">
                  Qualidade
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-[#8C2F43] transition-colors">
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
                  <MapPin className="size-5 text-[#8C2F43] flex-shrink-0 mt-0.5" />
                  <span>São Fidélis, RJ - Brasil</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="size-5 text-[#8C2F43] flex-shrink-0 mt-0.5" />
                  <a 
                    href="https://wa.me/5532988484644" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[#8C2F43] transition-colors"
                  >
                    (32) 98848-4644 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="size-5 text-[#8C2F43] flex-shrink-0 mt-0.5" />
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
                <Instagram className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} Doces São Fidélis. Todos os direitos reservados.</p>
          <Link to="/admin" className="text-[#8C2F43] hover:underline">
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}