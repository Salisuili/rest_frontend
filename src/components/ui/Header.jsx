// frontend/src/components/ui/Header.jsx
import React, { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemCount } = useCart();
  const location = useLocation();

  // Determine if the current path is an admin page
  const isAdminPath = location.pathname.startsWith('/admin');

  // Function to close the Bootstrap offcanvas programmatically
  const closeOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    if (offcanvasElement) {
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      } else {
        // If no instance exists, hide it manually
        offcanvasElement.classList.remove('show');
        document.body.classList.remove('offcanvas-backdrop');
      }
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    closeOffcanvas();
  };

  // Close offcanvas when location changes
  useEffect(() => {
    closeOffcanvas();
  }, [location]);

  // If on an admin page, render a simplified header
  if (isAdminPath) {
    return (
      <header className="bg-secondary text-white py-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/admin/dashboard" className="text-white text-decoration-none fs-4 fw-bold d-none d-md-block">
            Admin Panel
          </Link>
          <span className="d-md-none"></span>

          {isAuthenticated && user?.role === 'admin' ? (
            <div className="d-flex align-items-center">
              <span className="me-3">Welcome, {user?.full_name || user?.email || 'Admin'}</span>
              <button onClick={handleLogout} className="btn btn-outline-light">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-light">Login</Link>
          )}
        </div>
      </header>
    );
  }

  // Default header for public pages (responsive)
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-warning py-3 shadow-sm">
      <div className="container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand fs-4 fw-bold">
          Tripple S Restaurant
        </Link>

        {/* Navbar Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Offcanvas for mobile menu */}
        <div
          className="offcanvas offcanvas-end bg-warning text-white"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Navigation</h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <NavLink 
                  to="/" 
                  className="nav-link" 
                  end 
                  onClick={closeOffcanvas}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/menu" 
                  className="nav-link" 
                  onClick={closeOffcanvas}
                >
                  Menu
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/cart" 
                  className="nav-link position-relative" 
                  onClick={closeOffcanvas}
                >
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
                  <NavLink 
                    to="/admin/dashboard" 
                    className="nav-link" 
                    onClick={closeOffcanvas}
                  >
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Auth Buttons/User Info for public pages */}
            <div className="d-lg-none mt-3">
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle w-100"
                    type="button"
                    id="dropdownMenuButtonMobile"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hi, {user?.full_name || user?.email || 'User'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonMobile">
                    <li>
                      <Link 
                        to="/my-orders" 
                        className="dropdown-item" 
                        onClick={closeOffcanvas}
                      >
                        My Orders
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        onClick={handleLogout} 
                        className="dropdown-item btn btn-danger"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <Link 
                    to="/login" 
                    className="btn btn-outline-light mb-2" 
                    onClick={closeOffcanvas}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-light" 
                    onClick={closeOffcanvas}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="d-none d-lg-block ms-auto">
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="dropdownMenuButtonDesktop"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Hi, {user?.full_name || user?.email || 'User'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButtonDesktop">
                <li>
                  <Link to="/my-orders" className="dropdown-item">
                    My Orders
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item btn btn-danger">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <Link to="/login" className="btn btn-outline-light me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-light">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}