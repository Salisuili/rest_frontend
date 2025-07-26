// frontend/src/admin/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Directly import axios
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Define API_URL and getAuthHeaders directly in this file
// REACT_APP_API_URL is expected to be http://localhost:5000 or your base Render URL
const API_URL = process.env.REACT_APP_API_URL; 

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // State for status filter

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: Added '/api' prefix to the endpoint path
      const response = await axios.get(`${API_URL}/api/orders`, { 
        headers: getAuthHeaders(),
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching admin orders:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Failed to load orders.');
      toast.error(err.response?.data?.error || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // FIX: Added '/api' prefix to the endpoint path
      await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus }, { 
        headers: getAuthHeaders(),
      });
      // Update the status in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order ${orderId.substring(0, 8)}... status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Error updating order status:', err.response?.data?.error || err.message);
      toast.error(err.response?.data?.error || 'Failed to update order status.');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') {
      return true;
    }
    return order.status === filterStatus;
  });

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

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Order Management</h2>

      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
        <select
          id="statusFilter"
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="payment_pending">Payment Pending</option>
          <option value="payment_failed">Payment Failed</option>
          <option value="payment_discrepancy">Payment Discrepancy</option>
          <option value="payment_reversed">Payment Reversed</option>
          {/* Add other statuses as defined in your backend */}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No orders found for the selected filter.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Order Date</th>
                <th>Delivery Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.users?.full_name || 'N/A'} ({order.users?.email || 'N/A'})</td>
                  <td>₦{order.total_amount.toFixed(2)}</td>
                  <td>
                    <select
                      className={`form-select form-select-sm ${
                        order.status === 'pending' ? 'bg-warning text-dark' :
                        order.status === 'processing' ? 'bg-info text-dark' :
                        order.status === 'shipped' ? 'bg-primary text-white' :
                        order.status === 'delivered' ? 'bg-success text-white' :
                        order.status === 'cancelled' ? 'bg-danger text-white' : 'bg-secondary text-white'
                      }`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={loading}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="payment_pending">Payment Pending</option>
                      <option value="payment_failed">Payment Failed</option>
                      <option value="payment_discrepancy">Payment Discrepancy</option>
                      <option value="payment_reversed">Payment Reversed</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${
                      order.payment_status === 'pending' || order.payment_status === 'initiated' ? 'bg-warning text-dark' :
                      order.payment_status === 'paid' ? 'bg-success' :
                      order.payment_status === 'failed' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {order.payment_status?.replace(/_/g, ' ') || 'N/A'}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-info">
                      View
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

export default AdminOrders;
