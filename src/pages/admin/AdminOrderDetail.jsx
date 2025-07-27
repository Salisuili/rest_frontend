// frontend/src/pages/admin/AdminOrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../api/orderApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers'; // Assuming you have this helper

const AdminOrderDetail = () => {
  const { id: orderId } = useParams(); // Get order ID from the URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const validStatuses = [
    'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded',
    'payment_pending', 'payment_failed', 'payment_discrepancy', 'payment_reversed'
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder);
        setCurrentStatus(fetchedOrder.status); // Set initial status for dropdown
      } catch (err) {
        console.error('Error fetching admin order details:', err);
        setError(err.response?.data?.error || 'Failed to load order details.');
        toast.error(err.response?.data?.error || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError('No order ID provided.');
    }
  }, [orderId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}"!`);
      // No need to refetch the whole order, just update local state if needed
      setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.response?.data?.error || 'Failed to update order status.');
      // Revert status if update fails
      setCurrentStatus(order.status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button onClick={() => navigate('/admin/orders')} className="btn btn-primary mt-3">
          Back to All Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-4 text-center">
        <div className="alert alert-info" role="alert">
          Order not found.
        </div>
        <button onClick={() => navigate('/admin/orders')} className="btn btn-primary mt-3">
          Back to All Orders
        </button>
      </div>
    );
  }

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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold">Order Details: {order.order_number || order.id.substring(0, 8)}</h1>
        <button onClick={() => navigate('/admin/orders')} className="btn btn-outline-secondary">
          Back to All Orders
        </button>
      </div>

      <div className="row g-4">
        {/* Order Information Column */}
        <div className="col-lg-7">
          <div className="card shadow-sm p-4 mb-4">
            <h3 className="h5 fw-semibold mb-3">Order Summary</h3>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order ID: <span>{order.id}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order Number: <span><strong>{order.order_number}</strong></span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order Date: <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Subtotal: <span>{formatCurrency(order.subtotal)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Delivery Fee: <span>{formatCurrency(order.delivery_fee)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                Total Amount: <span>{formatCurrency(order.total_amount)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Payment Status: <span className={`badge ${getStatusBadgeClass(order.payment_status)}`}>
                  {order.payment_status?.replace(/_/g, ' ') || 'N/A'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Order Type: <span>{order.is_pickup ? 'Pickup' : 'Delivery'}</span>
              </li>
              {order.delivery_notes && (
                <li className="list-group-item">
                  Special Instructions: <p className="mb-0">{order.delivery_notes}</p>
                </li>
              )}
            </ul>

            <h3 className="h5 fw-semibold mb-3">Customer Information</h3>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Name: <span>{order.users?.full_name || 'N/A'}</span>
              </li>
              <li className="list-group-item">
                Email: <span>{order.users?.email || 'N/A'}</span>
              </li>
              {order.is_pickup ? (
                <li className="list-group-item">
                  Pickup Order: Customer will pick up from restaurant.
                </li>
              ) : (
                <li className="list-group-item">
                  Delivery Address:
                  <p className="mb-0">
                    {order.user_addresses ?
                      `${order.user_addresses.street_address}, ${order.user_addresses.city}, ${order.user_addresses.state ? `${order.user_addresses.state}, ` : ''}${order.user_addresses.country}` : 'N/A'}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Order Items & Status Update Column */}
        <div className="col-lg-5">
          <div className="card shadow-sm p-4 mb-4">
            <h3 className="h5 fw-semibold mb-3">Order Items</h3>
            <ul className="list-group mb-3">
              {order.order_items && order.order_items.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {item.menu_items?.name} (x{item.quantity})
                    {item.special_instructions && <small className="text-muted d-block"> ({item.special_instructions})</small>}
                  </div>
                  <span>{formatCurrency(item.price_at_order * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card shadow-sm p-4">
            <h3 className="h5 fw-semibold mb-3">Update Order Status</h3>
            <div className="mb-3">
              <label htmlFor="orderStatus" className="form-label">Current Status: <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span></label>
              <select
                id="orderStatus"
                className="form-select"
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                {validStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {isUpdatingStatus && <small className="text-muted d-block mt-2">Updating status...</small>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
