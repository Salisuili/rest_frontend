import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand text-primary fw-bold"> {/* text-primary and fw-bold for branding */}
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> {/* ms-auto pushes nav items to the right */}
            <li className="nav-item">
              <Link to="/menu" className="nav-link">Menu</Link>
            </li>

            <li className="nav-item position-relative"> {/* position-relative for the cart badge */}
              <Link to="/cart" className="nav-link d-flex align-items-center">
                Cart
                {itemCount > 0 && (
                  <span className="badge rounded-pill bg-primary ms-1"> {/* Bootstrap badge for count */}
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <> {/* Use a React Fragment to group conditional elements */}
                <li className="nav-item">
                  <Link to="/my-orders" className="nav-link">My Orders</Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-link text-danger nav-link" // Use btn-link for a link-style button, text-danger for red
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