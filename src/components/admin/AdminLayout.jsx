import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is loaded for offcanvas

const AdminLayout = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false); // Controls the mobile offcanvas state
  const location = useLocation();

  // Effect to close the offcanvas when the route changes (for small screens)
  useEffect(() => {
    if (showOffcanvas) {
      // Small delay to allow offcanvas transition to complete smoothly
      setTimeout(() => setShowOffcanvas(false), 300);
    }
  }, [location, showOffcanvas]);

  const handleLinkClick = () => {
    // Only close the offcanvas if it's currently open (on small screens)
    // This is useful for navigation within the offcanvas
    if (showOffcanvas) {
      setShowOffcanvas(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* 1. Offcanvas Toggle Button (visible only on small screens) */}
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 m-3"
        type="button"
        onClick={() => setShowOffcanvas(!showOffcanvas)}
        aria-controls="adminOffcanvas"
        aria-expanded={showOffcanvas}
        aria-label="Toggle navigation"
        style={{ zIndex: 1050 }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* 2. Fixed Sidebar (visible on medium screens and up) */}
      <div
        className="d-none d-md-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
        style={{ width: '250px', position: 'fixed', top: 0, bottom: 0, zIndex: 1000 }} // Ensure it's fixed and occupies full height
      >
        <h3 className="mb-4 text-center">Admin Panel</h3>
        <ul className="nav nav-pills flex-column mb-auto"> {/* nav-pills for active state */}
          <li className="nav-item">
            <Link to="/admin/dashboard" className={`nav-link text-white ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/orders" className={`nav-link text-white ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/menu" className={`nav-link text-white ${location.pathname === '/admin/menu' ? 'active' : ''}`}>
              Menu Items
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/categories" className={`nav-link text-white ${location.pathname === '/admin/categories' ? 'active' : ''}`}>
              Categories
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className={`nav-link text-white ${location.pathname === '/admin/users' ? 'active' : ''}`}>
              Users
            </Link>
          </li>
          {/* Add more admin links here */}
        </ul>
      </div>

      {/* 3. Offcanvas for Small Screens */}
      {/* Bootstrap's offcanvas JS will handle adding/removing 'show' class here */}
      <div
        className={`offcanvas offcanvas-start bg-dark text-white`} // Note: no d-none d-md-block here
        tabIndex="-1"
        id="adminOffcanvas" // This ID is linked to the toggle button via aria-controls
        aria-labelledby="adminOffcanvasLabel"
        style={{ width: '250px' }} // Standard offcanvas width
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="adminOffcanvasLabel">Admin Panel</h3>
          <button
            type="button"
            className="btn-close btn-close-white text-reset"
            data-bs-dismiss="offcanvas" // This attribute tells Bootstrap to close it
            aria-label="Close"
            onClick={() => setShowOffcanvas(false)} // Manually update state for consistency
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link text-white" onClick={handleLinkClick}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link text-white" onClick={handleLinkClick}>
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/menu" className="nav-link text-white" onClick={handleLinkClick}>
                Menu Items
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/categories" className="nav-link text-white" onClick={handleLinkClick}>
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className="nav-link text-white" onClick={handleLinkClick}>
                Users
              </Link>
            </li>
            {/* Add more admin links here */}
          </ul>
        </div>
      </div>

      {/* 4. Main Content Area */}
      {/*
        - ms-md-250: margin-left for medium screens and up to accommodate the fixed sidebar.
          This will only apply when the fixed sidebar is visible (d-md-flex).
      */}
      <div className="flex-grow-1 p-4 ms-md-250">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;