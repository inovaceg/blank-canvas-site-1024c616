import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate"; // Importar o novo componente
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import NossaHistoria from "./pages/NossaHistoria";
import Qualidade from "./pages/Qualidade";
import Contato from "./pages/Contato";
import Carrinho from "./pages/Carrinho";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ClientArea from "./pages/ClientArea";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Header />
                <Breadcrumbs />
                <ScrollToTopOnNavigate /> {/* Adicionado aqui para rolar para o topo em cada navegação */}
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/produtos/:productId" element={<ProductDetail />} />
                    <Route path="/nossa-historia" element={<NossaHistoria />} />
                    <Route path="/qualidade" element={<Qualidade />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/carrinho" element={<Carrinho />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <Admin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/area-do-cliente" 
                      element={
                        <ProtectedRoute>
                          <ClientArea />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
                <Footer />
                <ScrollToTop />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;