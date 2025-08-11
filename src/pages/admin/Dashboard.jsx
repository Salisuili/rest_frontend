// frontend/src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; 
import { getDashboardData } from '../../api/adminApi'; 
import LoadingSpinner from '../../components/ui/LoadingSpinner'; 

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardData(); 
        
        const formattedStats = [
          { title: 'Total Orders', value: data.stats[0].value, icon: '📦' },
          { title: 'Total Revenue', value: `₦${data.stats[1].value.toLocaleString('en-US')}`, icon: '💰' },
          { title: 'Pending Orders', value: data.stats[2].value, icon: '⏱️' },
          { title: 'Menu Items', value: data.stats[3].value, icon: '🍔' }
        ];

        setDashboardStats(formattedStats);
        setRecentOrders(data.recentOrders);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data.');
        toast.error(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []); 

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Dashboard Stats Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        {dashboardStats.map((stat, index) => (
          <div className="col" key={index}>
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="display-4 mb-2">{stat.icon}</div>
                <h3 className="h5">{stat.title}</h3>
                <p className="h2">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="h5 mb-0">Recent Orders</h3>
        </div>
        <div className="card-body">
          {recentOrders.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No recent orders found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.order_number || order.id.substring(0, 8)}</td> 
                      <td>{order.users?.full_name || 'N/A'}</td> 
                      <td>₦{order.total_amount.toLocaleString('en-US')}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'completed' ? 'bg-success' :
                          order.status === 'pending' ? 'bg-warning' :
                          'bg-info' 
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('en-US')}</td>
                      <td>
                        {/* <button className="btn btn-sm btn-outline-primary">View</button> */}
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

export default Dashboard;