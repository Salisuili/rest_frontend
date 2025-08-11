// frontend/src/pages/admin/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi'; 
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers'; 
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  const validStatuses = [
    'all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded',
    'payment_pending', 'payment_failed', 'payment_discrepancy', 'payment_reversed'
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllOrders();
        setOrders(data || []); 
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.error || 'Failed to load orders.');
        toast.error(err.response?.data?.error || 'Failed to load orders.');
        setOrders([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // Empty dependency array means this runs once on mount

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status of Order ${orderId.substring(0, 8)} to "${newStatus}"?`)) {
      return; 
    }
    try {
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order ${orderId.substring(0, 8)} status updated to "${newStatus}"!`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.response?.data?.error || 'Failed to update order status.');
      // Revert optimistic update on error
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: prevOrders.find(o => o.id === orderId).status } : order
      ));
    }
  };

  const filteredOrders = (orders || []).filter(order => { 
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
                          order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.users?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
      case 'payment_pending':
        return 'bg-warning text-dark';
      case 'processing':
        return 'bg-info text-dark';
      case 'shipped':
        return 'bg-primary';
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
      case 'payment_failed':
      case 'payment_reversed':
        return 'bg-danger';
      case 'refunded':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">All Orders</h2>

      {/* Filters and Search */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order ID, Customer Name, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {validStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h3 className="h5 mb-0">Order List ({filteredOrders.length} found)</h3>
        </div>
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No orders found matching your criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/admin/orders/${order.id}`} className="text-decoration-none fw-bold">
                          {order.order_number || order.id.substring(0, 8)}
                        </Link>
                      </td>
                      <td>{order.users?.full_name || 'N/A'}</td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.payment_status)}`}>
                          {order.payment_status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>{order.is_pickup ? 'Pickup' : 'Delivery'}</td>
                      <td>{new Date(order.created_at).toLocaleDateString('en-US')}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary me-2">
                            View
                          </Link>
                          <select
                            className="form-select form-select-sm"
                            value={order.status} // Bind to individual order's status
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={loading}
                          >
                            {validStatuses.filter(s => s !== 'all').map(status => ( // Exclude 'all' from update options
                              <option key={status} value={status}>
                                {status.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
