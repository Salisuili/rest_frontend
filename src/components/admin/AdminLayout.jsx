import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap's JS bundle for Offcanvas

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false); // State to control sidebar visibility

  const handleLinkClick = () => {
    // Hide sidebar on small screens after clicking a link
    if (window.innerWidth < 768) { // Assuming 768px as the breakpoint for small screens (md breakpoint)
      setShowSidebar(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Toggler Button (visible on small screens) */}
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 m-3 z-100" // Hide on md and larger, fix position
        type="button"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-controls="adminSidebar"
        aria-expanded={showSidebar}
        aria-label="Toggle navigation"
        style={{ zIndex: 1050 }} // Ensure it's above other content
      >
        <span className="navbar-toggler-icon"></span> {/* Hamburger icon */}
      </button>

      {/* Sidebar (Offcanvas for small screens, always visible for medium+ screens) */}
      <div
        className={`offcanvas offcanvas-start bg-dark text-white p-3 ${showSidebar ? 'show' : ''} d-md-block`}
        tabIndex="-1"
        id="adminSidebar"
        aria-labelledby="adminSidebarLabel"
        style={{ width: '250px' }} // Fixed width for the sidebar
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="adminSidebarLabel">Admin Panel</h3>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setShowSidebar(false)}
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
            {/* Add more nav items as needed */}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: window.innerWidth >= 768 ? '250px' : '0' }}>
        {/* Adjusted margin for main content to account for sidebar on larger screens */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;