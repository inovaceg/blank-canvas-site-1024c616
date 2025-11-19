import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart-provider";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import HomePage from "@/pages/Home";
import NossaHistoriaPage from "@/pages/NossaHistoria";
import ProdutosPage from "@/pages/Produtos";
import ProdutoDetailPage from "@/pages/ProdutoDetail";
import QualidadePage from "@/pages/Qualidade";
import ContatoPage from "@/pages/Contato";
import AdminLoginPage from "@/pages/admin/Login";
import AdminRegisterPage from "@/pages/admin/Register";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProductsPage from "@/pages/admin/Products";
import AdminProductNewPage from "@/pages/admin/ProductNew";
import AdminProductEditPage from "@/pages/admin/ProductEdit";
import AdminOrdersPage from "@/pages/admin/Orders";
import AdminBannerPage from "@/pages/admin/Banner";
import AdminMessagesPage from "@/pages/admin/Messages";
import AdminNewsletterPage from "@/pages/admin/Newsletter";
import ClientDashboard from "@/pages/client/Dashboard";
import ClientProductsPage from "@/pages/client/Products";
import ClientProfilePage from "@/pages/client/Profile";
import ClientCartPage from "@/pages/client/Cart";
import ClientCheckoutPage from "@/pages/client/Checkout";
import ClientOrdersPage from "@/pages/client/Orders";
import ClientOrderDetailPage from "@/pages/client/OrderDetail";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";
import ClientLayout from "@/layouts/ClientLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <CartProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/nossa-historia" element={<NossaHistoriaPage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/produtos/:id" element={<ProdutoDetailPage />} />
              <Route path="/qualidade" element={<QualidadePage />} />
              <Route path="/contato" element={<ContatoPage />} />

              {/* Admin auth routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/register" element={<AdminRegisterPage />} />

              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductNewPage />} />
                <Route path="products/:id" element={<AdminProductEditPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="banner" element={<AdminBannerPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="newsletter" element={<AdminNewsletterPage />} />
              </Route>

              {/* Protected client routes */}
              <Route
                path="/client"
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/client/dashboard" replace />} />
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="products" element={<ClientProductsPage />} />
                <Route path="profile" element={<ClientProfilePage />} />
                <Route path="cart" element={<ClientCartPage />} />
                <Route path="checkout" element={<ClientCheckoutPage />} />
                <Route path="orders" element={<ClientOrdersPage />} />
                <Route path="orders/:id" element={<ClientOrderDetailPage />} />
              </Route>

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" />
          </CartProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
