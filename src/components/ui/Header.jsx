import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct
import { useCart } from '../../context/CartContext'; // Make sure this path is correct

const Header = () => {
  // Destructure 'isAdmin' from useAuth()
  const { user, logout, isAdmin } = useAuth(); // <--- ADD isAdmin HERE
  const { itemCount } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand text-primary fw-bold">
          Restaurant App
        </Link>

        {/* Navbar Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/menu" className="nav-link">Menu</Link>
            </li>

            {/* Conditionally render Dashboard link for admins */}
            {isAdmin && ( // <--- Conditional rendering based on isAdmin
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              </li>
            )}

            <li className="nav-item position-relative">
              <Link to="/cart" className="nav-link d-flex align-items-center">
                Cart
                {itemCount > 0 && (
                  <span className="badge rounded-pill bg-primary ms-1">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/my-orders" className="nav-link">My Orders</Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-link text-danger nav-link"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;