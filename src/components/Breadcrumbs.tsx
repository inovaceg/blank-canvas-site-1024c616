import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const routeNames: Record<string, string> = {
  "/": "Home",
  "/produtos": "Produtos",
  "/nossa-historia": "Nossa História",
  "/qualidade": "Qualidade",
  "/contato": "Contato",
  "/carrinho": "Carrinho",
  "/area-do-cliente": "Área do Cliente",
  "/admin": "Administração",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Hook para buscar o nome do produto dinamicamente
  const { data: productName } = useQuery({
    queryKey: ['product-name', pathnames[1]], // pathnames[1] seria o ID do produto
    queryFn: async () => {
      if (pathnames[0] === 'produtos' && pathnames[1]) {
        const { data, error } = await supabase
          .from('products')
          .select('name')
          .eq('id', pathnames[1])
          .maybeSingle();
        if (error) throw error;
        return data?.name;
      }
      return null;
    },
    enabled: pathnames[0] === 'produtos' && !!pathnames[1],
  });

  if (location.pathname === "/") return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            
            let name = routeNames[routeTo] || pathname;

            // Se for a rota de produto e for o último item, usa o nome do produto
            if (pathnames[0] === 'produtos' && index === 1 && productName) {
              name = productName;
            }

            return (
              <div key={routeTo} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}