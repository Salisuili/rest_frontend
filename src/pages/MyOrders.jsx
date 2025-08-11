// frontend/src/pages/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orderApi'; 
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const fetchedOrders = await getMyOrders(); // Call getMyOrders
          setOrders(fetchedOrders);
        } catch (err) {
          console.error('Error fetching my orders:', err.response?.data?.error || err.message);
          setError(err.response?.data?.error || 'Failed to load your orders.');
          toast.error(err.response?.data?.error || 'Failed to load your orders.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // No user, no orders to load
      }
    };

    fetchOrders();
  }, [user]); // Re-fetch if user changes

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

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <div className="alert alert-warning" role="alert">
          Please log in to view your orders.
        </div>
        <Link to="/login" className="btn btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          You haven't placed any orders yet. <Link to="/menu">Browse our menu</Link>!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Delivery Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>₦{order.total_amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'pending' ? 'bg-warning text-dark' :
                      order.status === 'processing' ? 'bg-info text-dark' :
                      order.status === 'shipped' ? 'bg-primary' :
                      order.status === 'delivered' ? 'bg-success' :
                      order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {order.user_addresses ?
                      `${order.user_addresses.street_address}, ${order.user_addresses.city}` : 'N/A'}
                  </td>
                  <td>
                    <Link to={`/order-confirmation/${order.id}`} className="btn btn-sm btn-outline-primary">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
