import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Páginas públicas
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Páginas de administração
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductForm from "./pages/admin/ProductForm";
import OrderManagement from "./pages/admin/OrderManagement";

// Componente protetor de rota
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Rotas protegidas */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Rotas de administração */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/new"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/edit/:id"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#FFFFFF",
                color: "#333333",
              },
              success: {
                iconTheme: {
                  primary: "#6F4E37",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
