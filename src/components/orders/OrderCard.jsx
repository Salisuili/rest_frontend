import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const OrderCard = ({ order }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white'; 
      case 'cancelled':
        return 'bg-danger text-white';   
      case 'pending':
      default:
        return 'bg-warning text-dark';  
    }
  };

  return (
    <div className="card shadow-sm mb-3"> 
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">Order #{order.order_number}</h5> 
            <p className="card-text text-muted small"> 
              {format(new Date(order.created_at), 'MMM dd, yyyy - h:mm a')}
            </p>
          </div>
          <div className="d-flex flex-column align-items-end"> 
            <span className="fw-bold mb-1">₦{order.total_amount.toLocaleString()}</span> 
            <span
              className={`badge rounded-pill ${getStatusBadgeClass(order.status)}`} 
              style={{ minWidth: '80px', textAlign: 'center' }} 
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="mt-3"> 
          <p className="card-text small mb-1"> 
            {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
          </p>
          <Link
            to={`/order-confirmation/${order.id}`}
            className="btn btn-link p-0 pt-1" 
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;