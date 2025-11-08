import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';


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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
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