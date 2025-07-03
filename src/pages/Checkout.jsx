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
        // Direct browser navigation for external payment gateway
        window.location.href = payment.authorization_url;
      } else {
        // Handle other payment methods (e.g., Cash on Delivery)
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during checkout');
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

  // Redirects if user or cart is empty
  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="container py-5"> {/* Bootstrap container with vertical padding */}
      {/* max-w-6xl mx-auto equivalent with Bootstrap's container-fluid and row/col */}
      <div className="row justify-content-center"> {/* Center content */}
        <div className="col-12 col-xl-10"> {/* Use col-xl-10 to approximate max-w-6xl for wider screens */}
          <h1 className="h2 fw-bold mb-4">Checkout</h1> {/* Bootstrap heading, bold, margin-bottom */}

          <div className="row g-4"> {/* Bootstrap row with gutters */}
            <div className="col-md-8"> {/* Takes 2/3 width on medium screens and up */}
              <form onSubmit={handleSubmit} className="card shadow-sm p-4"> {/* Bootstrap card with shadow and padding */}
                <h2 className="h4 fw-semibold mb-4">Delivery Information</h2> {/* Smaller heading, semi-bold */}

                <div className="mb-3"> {/* Margin bottom for form group */}
                  <label htmlFor="deliveryAddress" className="form-label">Delivery Address</label>
                  <textarea
                    id="deliveryAddress"
                    name="address"
                    className="form-control" // Bootstrap form control for textarea
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4"> {/* Slightly larger margin for this group */}
                  <label htmlFor="specialNotes" className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    id="specialNotes"
                    name="notes"
                    className="form-control" // Bootstrap form control
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-5"> {/* Generous margin before the button */}
                  <h3 className="h5 fw-semibold mb-3">Payment Method</h3> {/* Smaller heading, semi-bold */}
                  <div className="form-check"> {/* Bootstrap radio button styling */}
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paymentMethodPaystack"
                      value="paystack"
                      checked={formData.paymentMethod === 'paystack'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paymentMethodPaystack">
                      Pay with Paystack (Online Payment)
                    </label>
                  </div>
                  {/* You can add more radio buttons here for other payment methods like Cash on Delivery */}
                  {/* <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paymentMethodCOD"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paymentMethodCOD">
                      Cash on Delivery
                    </label>
                  </div> */}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-3" // Bootstrap primary button, full width, generous padding
                >
                  {loading ? <LoadingSpinner /> : 'Complete Order'}
                </button>
              </form>
            </div>

            <div className="col-md-4"> {/* Takes 1/3 width on medium screens and up */}
              <CartSummary onCheckout={handleSubmit} /> {/* Assuming CartSummary is already converted or styled independently */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;