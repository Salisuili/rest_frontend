import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const AdminLayout = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const location = useLocation();

  // Close offcanvas when route changes
  useEffect(() => {
    if (showOffcanvas) {
      setShowOffcanvas(false);
    }
  }, [location]);

  // Toggle offcanvas manually
  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Offcanvas Toggle Button - Mobile only */}
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 m-3"
        type="button"
        onClick={toggleOffcanvas}
        aria-controls="adminOffcanvas"
        aria-label="Toggle navigation"
        style={{ 
          zIndex: 1050,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span className="navbar-toggler-icon d-flex flex-column justify-content-between">
          <span className="bg-white" style={{height: '2px', width: '100%'}}></span>
          <span className="bg-white" style={{height: '2px', width: '100%'}}></span>
          <span className="bg-white" style={{height: '2px', width: '100%'}}></span>
        </span>
      </button>

      {/* Sidebar - Desktop only */}
      <div
        className="d-none d-md-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
        style={{ 
          width: '250px',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        <Link to="/" className="text-decoration-none text-white">
          <h3 className="mb-4 text-center">Admin Panel</h3>
        </Link>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link text-white`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/dashboard" 
              className={`nav-link text-white ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/orders" 
              className={`nav-link text-white ${location.pathname === '/admin/orders' ? 'active' : ''}`}
            >
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/menu" 
              className={`nav-link text-white ${location.pathname === '/admin/menu' ? 'active' : ''}`}
            >
              Menu Items
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/categories" 
              className={`nav-link text-white ${location.pathname === '/admin/categories' ? 'active' : ''}`}
            >
              Categories
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/admin/users" 
              className={`nav-link text-white ${location.pathname === '/admin/users' ? 'active' : ''}`}
            >
              Users
            </Link>
          </li>
        </ul>
      </div>

      {/* Offcanvas - Mobile only */}
      <div
        className={`offcanvas offcanvas-start bg-dark text-white ${showOffcanvas ? 'show' : ''}`}
        tabIndex="-1"
        id="adminOffcanvas"
        aria-labelledby="adminOffcanvasLabel"
        style={{ 
          width: '250px',
          visibility: showOffcanvas ? 'visible' : 'hidden'
        }}
      >
        <div className="offcanvas-header">
          <Link to="/admin" className="text-decoration-none text-white" onClick={toggleOffcanvas}>
            <h3 className="offcanvas-title" id="adminOffcanvasLabel">Admin Panel</h3>
          </Link>
          <button
            type="button"
            className="btn-close btn-close-white text-reset"
            onClick={toggleOffcanvas}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link text-white `}
                onClick={toggleOffcanvas}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/dashboard" 
                className={`nav-link text-white ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                onClick={toggleOffcanvas}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/orders" 
                className={`nav-link text-white ${location.pathname === '/admin/orders' ? 'active' : ''}`}
                onClick={toggleOffcanvas}
              >
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/menu" 
                className={`nav-link text-white ${location.pathname === '/admin/menu' ? 'active' : ''}`}
                onClick={toggleOffcanvas}
              >
                Menu Items
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/categories" 
                className={`nav-link text-white ${location.pathname === '/admin/categories' ? 'active' : ''}`}
                onClick={toggleOffcanvas}
              >
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/users" 
                className={`nav-link text-white ${location.pathname === '/admin/users' ? 'active' : ''}`}
                onClick={toggleOffcanvas}
              >
                Users
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <main 
        className="flex-grow-1 p-4" 
        style={{ 
          marginLeft: '0',
          width: '100%',
          transition: 'margin 0.3s ease',
          '@media (minWidth: 768px)': {
            marginLeft: '250px'
          }
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;