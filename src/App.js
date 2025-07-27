import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import MenuItems from './pages/admin/MenuItems';
import Categories from './pages/admin/Categories';
import AddCategory from './pages/admin/AddCategory';
import AddMenuItem from './pages/admin/AddMenuItem';
import UserManagement from './pages/admin/UserManagement';
import AdminOrderDetail from './pages/admin/AdminOrderDetail'; // Import the new component
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  {/* Admin Routes nested under AdminLayout */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/:id" element={<AdminOrderDetail />} /> {/* NEW ROUTE for Order Details */}
                    <Route path="menu" element={<MenuItems />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/new" element={<AddCategory />} />
                    <Route path="menu/new" element={<AddMenuItem />} />
                    <Route path="users" element={<UserManagement />} />
                  </Route>
                  {/* User-specific protected routes */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  {/* Catch-all for protected routes not found */}
                  <Route path="*" element={<NotFound />} />
                </Route>
                {/* Catch-all for non-protected routes not found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
