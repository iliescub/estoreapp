  import { Link, useNavigate } from 'react-router-dom';
  import { useCart } from '../context/CartContext';
  import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { itemCount } = useCart();
    const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Online Store
          </Link>
          <nav className="flex gap-6 items-center">
              <Link to="/" className="hover:text-blue-200">Products</Link>
              <Link to="/cart" className="hover:text-blue-200 relative">
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center
            justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {user && (
                <Link to="/orders" className="hover:text-blue-200">
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin/users')}
                  className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold hover:bg-white/30"
                >
                  Admin
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                      {user && (
                        <button onClick={() => navigate('/profile')} className="text-sm hover:underline">
                          Hi, <strong>{user.firstName}</strong>
                        </button>
                      )}
                  </span>
                  <button
                    onClick={logout}
                    className="rounded-full border border-white/50 px-4 py-1 text-sm hover:bg-white hover:text-blue-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Login
                </button>
              )}
            </nav>
        </div>
      </div>
    </header>
  );
}
