// frontend/src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/orderApi'; // Changed from getOrderDetails to getOrderById
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const OrderConfirmation = () => {
  const { id } = useParams(); // Get order ID from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOrder = await getOrderById(id); // Call getOrderById
        setOrder(fetchedOrder);
      } catch (err) {
        console.error('Error fetching order details:', err.response?.data?.error || err.message);
        setError(err.response?.data?.error || 'Failed to load order details.');
        toast.error(err.response?.data?.error || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    } else {
      setLoading(false);
      setError('No order ID provided.');
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-4 text-center">
        <div className="alert alert-info" role="alert">
          Order not found.
        </div>
        <Link to="/my-orders" className="btn btn-primary">Back to My Orders</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm p-4">
            <h1 className="h2 fw-bold text-center mb-4 text-success">Order Confirmed!</h1>
            <p className="lead text-center mb-4">Thank you for your order. We've received it and it's being processed.</p>

            <div className="mb-4">
              <h3 className="h5 fw-semibold mb-3">Order Details</h3>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Order Number: <span><strong>{order.order_number}</strong></span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Order Date: <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Total Amount: <span>₦{order.total_amount.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Status: <span>
                    <span className={`badge ${
                      order.status === 'pending' ? 'bg-warning text-dark' :
                      order.status === 'processing' ? 'bg-info text-dark' :
                      order.status === 'shipped' ? 'bg-primary' :
                      order.status === 'delivered' ? 'bg-success' :
                      order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </span>
                </li>
                <li className="list-group-item">
                  Delivery Address:
                  <p className="mb-0">
                    {order.user_addresses ?
                      `${order.user_addresses.street_address}, ${order.user_addresses.city}, ${order.user_addresses.state ? `${order.user_addresses.state}, ` : ''}${order.user_addresses.country}` : 'N/A'}
                  </p>
                </li>
                {order.delivery_notes && (
                  <li className="list-group-item">
                    Special Instructions: <p className="mb-0">{order.delivery_notes}</p>
                  </li>
                )}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="h5 fw-semibold mb-3">Items Ordered</h3>
              <ul className="list-group">
                {order.order_items && order.order_items.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      {item.menu_items?.name} (x{item.quantity})
                      {item.special_instructions && <small className="text-muted d-block"> ({item.special_instructions})</small>}
                    </div>
                    <span>₦{(item.price_at_order * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center mt-4">
              <Link to="/my-orders" className="btn btn-outline-primary me-2">View All My Orders</Link>
              <Link to="/menu" className="btn btn-primary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
