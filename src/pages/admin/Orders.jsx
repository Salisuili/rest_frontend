// frontend/src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; // For notifications
import { getAdminOrders } from '../../api/orderApi'; 
import LoadingSpinner from '../../components/ui/LoadingSpinner'; 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Move fetchOrders inside useEffect
  useEffect(() => {
    const fetchOrders = async () => { // <--- Function moved here
      setLoading(true);
      setError(null);
      try {
        // Call the new function for admin orders
        const data = await getAdminOrders(currentPage);
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders.');
        toast.error(err.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Call the function here

  }, [currentPage]); // <--- Now, only currentPage is a dependency. fetchOrders is defined inside, so it's not external.

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders Management</h2>
        <div className="btn-group">
          <button className="btn btn-outline-secondary">Export</button>
          <button className="btn btn-outline-secondary">Filter</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {orders.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No orders found.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.order_number || order.id?.substring(0, 8) || 'N/A'}</td>
                        <td>{order.customer_name}</td>
                        <td>₦{order.total_amount ? order.total_amount.toLocaleString('en-US') : '0'}</td>
                        <td>
                          <span className={`badge ${
                            order.status === 'completed' ? 'bg-success' :
                            order.status === 'pending' ? 'bg-warning text-dark' :
                            order.status === 'cancelled' ? 'bg-danger' :
                            'bg-info'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.created_at).toLocaleDateString('en-US')}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            View
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;