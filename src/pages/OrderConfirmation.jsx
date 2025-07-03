import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderDetails } from '../api/orders';
import LoadingSpinner from '../components/ui/LoadingSpinner'; // Assuming this is Bootstrap-ready

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
        // If order details fail to load, navigate to the homepage or a relevant error page
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]); // Add navigate to dependency array as it's used in useEffect

  // Display a loading spinner while order details are being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  // If order is null after loading (e.g., failed to fetch and navigate didn't kick in immediately)
  if (!order) {
    return (
      <div className="container py-5 text-center">
        <p className="lead text-danger">Order details could not be loaded.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-3">
          Go to Homepage
        </button>
      </div>
    );
  }

  // Helper function to get Bootstrap badge classes based on order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white'; // Bootstrap's success background, white text
      case 'cancelled':
        return 'bg-danger text-white';   // Bootstrap's danger background, white text
      default:
        return 'bg-warning text-dark';   // Bootstrap's warning background, dark text
    }
  };

  return (
    <div className="container py-4"> {/* Bootstrap container with vertical padding */}
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '800px' }}> {/* Card with shadow, padding, and centered max-width */}
        <h1 className="h3 fw-bold mb-4">Order Confirmation</h1> {/* Bootstrap heading, bold, margin-bottom */}

        <div className="alert alert-success p-3 mb-4" role="alert"> {/* Bootstrap alert for success message */}
          <h2 className="h5 alert-heading">Thank you for your order!</h2> {/* Smaller heading for alert */}
          <p className="mb-0">
            Your order #<strong>{order.order_number}</strong> has been placed successfully.
          </p>
        </div>

        <div className="row g-4"> {/* Bootstrap row with gutters for main content layout */}
          <div className="col-md-6"> {/* Takes half width on medium screens and up */}
            <h2 className="h5 fw-semibold mb-3">Order Summary</h2> {/* Smaller heading, semi-bold */}
            <div className="d-grid gap-3"> {/* Bootstrap grid for spacing between order items */}
              {order.order_items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-baseline">
                  <div>
                    <p className="mb-0">{item.menu_items.name} &times; {item.quantity}</p>
                  </div>
                  <p className="mb-0 fw-bold">₦{(item.price_at_order * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-top pt-3 mt-3 d-grid gap-2"> {/* Border top, padding top, margin top */}
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery Fee:</span>
                <span>₦{order.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top mt-2"> {/* Bold text, larger font size */}
                <span>Total:</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="col-md-6"> {/* Takes half width on medium screens and up */}
            <h2 className="h5 fw-semibold mb-3">Delivery Information</h2> {/* Smaller heading, semi-bold */}
            <div className="d-grid gap-2"> {/* Bootstrap grid for spacing */}
              <p className="mb-0"><strong>Address:</strong> {order.delivery_address}</p>
              <p className="mb-0">
                <strong>Status:</strong>
                <span className={`badge rounded-pill ms-2 ${getStatusBadgeClass(order.status)}`}> {/* Bootstrap badge */}
                  {order.status}
                </span>
              </p>
              <p className="mb-0"><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              {order.delivery_notes && (
                <p className="mb-0"><strong>Special Notes:</strong> {order.delivery_notes}</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-5"> {/* Center content, margin top */}
          <button
            onClick={() => navigate('/menu')}
            className="btn btn-primary px-4 py-2" // Bootstrap primary button
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;