import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Correct named import (context)
import { CartProvider } from './context/CartContext';  // Correct named import (context)
import Home from './pages/Home';                      // Correct default import
import Menu from './pages/Menu';                      // Correct default import
import Cart from './pages/Cart';                      // Correct default import
import Checkout from './pages/Checkout';              // Correct default import
import OrderConfirmation from './pages/OrderConfirmation'; // Correct default import
import MyOrders from './pages/MyOrders';              // Correct default import
import Login from './pages/Login';                    // Correct default import
import Register from './pages/Register';              // Correct default import
import ProtectedRoute from './components/ui/ProtectedRoute'; // Correct default import
import Header from './components/ui/Header';          // Correct default import
import Footer from './components/ui/Footer';          // Correct default import

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
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                </Route>
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