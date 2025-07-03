import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, initiatePayment } from '../api/orders';
import CartSummary from '../components/cart/CartSummary';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    notes: '',
    paymentMethod: 'paystack'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const order = await createOrder({
        user_id: user.id,
        items: cartItems.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity
        })),
        delivery_address: formData.address,
        delivery_notes: formData.notes
      });

      // Process payment
      if (formData.paymentMethod === 'paystack') {
        const payment = await initiatePayment(order.id, user.email);
        window.location.href = payment.authorization_url;
      } else {
        // Handle other payment methods
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Delivery Address</label>
                <textarea
                  name="address"
                  className="w-full p-3 border rounded"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  name="notes"
                  className="w-full p-3 border rounded"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={formData.paymentMethod === 'paystack'}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <span>Pay with Paystack</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : 'Complete Order'}
              </button>
            </form>
          </div>

          <div className="md:w-1/3">
            <CartSummary onCheckout={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;