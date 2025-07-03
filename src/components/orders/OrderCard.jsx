import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const OrderCard = ({ order }) => {
  // Helper function to determine badge classes based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white'; // Bootstrap success for completed
      case 'cancelled':
        return 'bg-danger text-white';   // Bootstrap danger for cancelled
      case 'pending':
      default:
        return 'bg-warning text-dark';  // Bootstrap warning for pending/default
    }
  };

  return (
    <div className="card shadow-sm mb-3"> {/* Bootstrap card with shadow and bottom margin */}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">Order #{order.order_number}</h5> {/* Bootstrap card-title, reduced margin */}
            <p className="card-text text-muted small"> {/* Bootstrap card-text, muted text, smaller font */}
              {format(new Date(order.created_at), 'MMM dd, yyyy - h:mm a')}
            </p>
          </div>
          <div className="d-flex flex-column align-items-end"> {/* Bootstrap flexbox for columns, align-items-end */}
            <span className="fw-bold mb-1">₦{order.total_amount.toLocaleString()}</span> {/* fw-bold for font-bold, mb-1 for margin */}
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(order.status)}`} // Bootstrap badge
              style={{ minWidth: '80px', textAlign: 'center' }} // Optional: ensure consistent badge width
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)} {/* Capitalize first letter */}
            </span>
          </div>
        </div>
        <div className="mt-3"> {/* Bootstrap margin top */}
          <p className="card-text small mb-1"> {/* Bootstrap card-text, smaller font, reduced margin */}
            {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
          </p>
          <Link
            to={`/order-confirmation/${order.id}`}
            className="btn btn-link p-0 pt-1" // Bootstrap link button, remove padding, small top padding
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;