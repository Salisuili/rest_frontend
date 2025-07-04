import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../api/orderApi';
import OrderCard from '../components/orders/OrderCard'; // Assuming this component is already Bootstrap-ready
import LoadingSpinner from '../components/ui/LoadingSpinner'; // Assuming this component is already Bootstrap-ready

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          const ordersData = await getOrders(user.id);
          setOrders(ordersData);
        } catch (error) {
          console.error('Error fetching orders:', error);
          // You might want to add a toast notification here for the user
        } finally {
          setLoading(false);
        }
      } else {
        // If no user, stop loading and show no orders message
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Display a loading spinner while orders are being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container py-4"> {/* Bootstrap container with vertical padding */}
      <h1 className="h3 fw-bold mb-4">My Orders</h1> {/* Bootstrap heading, bold, margin-bottom */}
      {orders.length === 0 ? (
        <p className="text-muted">You haven't placed any orders yet.</p> 
      ) : (
        <div className="d-grid gap-3"> {/* Bootstrap grid for consistent spacing between cards */}
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;