import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';
  import { Navigate, useLocation } from 'react-router-dom';
  import { useAuth } from './context/AuthContext';

  function RequireAdmin({ children }) {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
  
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>    
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="mx-auto max-w-6xl px-4 pb-16">
              <Header />
              <Routes>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                 <Route path="/admin/users" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;