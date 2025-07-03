import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderDetails } from '../api/orders';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderDetails(id);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">
            Thank you for your order!
          </h2>
          <p className="mt-2">
            Your order #{order.order_number} has been placed successfully.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p>{item.menu_items.name} × {item.quantity}</p>
                  </div>
                  <p>₦{(item.price_at_order * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₦{order.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-2">
              <p><strong>Address:</strong> {order.delivery_address}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/menu')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;