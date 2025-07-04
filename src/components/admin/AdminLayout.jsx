import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h3 className="text-center mb-4">Admin Panel</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/orders" className="nav-link text-white">
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/menu" className="nav-link text-white">
              Menu Items
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/categories" className="nav-link text-white">
              Categories
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link text-white">
              Users
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;