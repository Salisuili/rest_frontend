import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Restaurant App
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/menu" className="hover:text-blue-600">Menu</Link>
          
          <div className="relative">
            <Link to="/cart" className="hover:text-blue-600 flex items-center">
              Cart
              {itemCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/my-orders" className="hover:text-blue-600">My Orders</Link>
              <button 
                onClick={logout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;