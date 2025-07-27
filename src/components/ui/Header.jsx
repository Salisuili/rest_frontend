// frontend/src/components/ui/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Import useCart to get cart count
import { toast } from 'react-hot-toast';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemCount } = useCart(); // Get cartItemCount from CartContext

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  return (
    <header className="bg-warning text-white py-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">
          Tripple S Restaurant 
        </Link>

        {/* Navigation Links */}
        <nav className="d-flex align-items-center">
          <ul className="nav me-3">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-white" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/menu" className="nav-link text-white">Menu</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link text-white position-relative">
                Cart
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                    <span className="visually-hidden">cart items</span>
                  </span>
                )}
              </NavLink>
            </li>
            {isAuthenticated && user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className="nav-link text-white">Admin</NavLink>
              </li>
            )}
          </ul>

          {/* Auth Buttons/User Info */}
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Hi, {user?.full_name || user?.email || 'User'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li><Link to="/my-orders" className="dropdown-item">My Orders</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button onClick={handleLogout} className="dropdown-item btn btn-danger">Logout</button></li>
              </ul>
            </div>
          ) : (
            <div>
              <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
              <Link to="/register" className="btn btn-light">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
