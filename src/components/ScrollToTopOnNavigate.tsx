import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "Scrolla" a janela para o topo (0,0) em cada mudança de rota
    window.scrollTo(0, 0);
  }, [pathname]); // O efeito é re-executado sempre que o pathname (rota) muda

  return null; // Este componente não renderiza nada visualmente
}