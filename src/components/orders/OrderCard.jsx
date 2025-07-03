import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Order #{order.order_number}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(order.created_at), 'MMM dd, yyyy - h:mm a')}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold">₦{order.total_amount.toLocaleString()}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
        </p>
        <Link 
          to={`/order-confirmation/${order.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;