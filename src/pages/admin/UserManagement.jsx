// frontend/src/admin/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAllUsers,      // Import the specific API function
  deleteUser,       // Import the specific API function
  updateUserRole    // Import the specific API function
} from '../../api/userApi'; // Corrected import path (now it's userApi.js)
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // Assuming this exists
import { useAuth } from '../../context/AuthContext'; // To get current user's ID for disabling self-actions

const UserManagement = () => {
    const { user: currentUser } = useAuth(); // Get the currently logged-in user from AuthContext
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Fetch Users ---
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllUsers(); // Use the imported API function
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err.response?.data?.error || err.message);
                setError(err.response?.data?.error || 'Failed to fetch users.');
                toast.error(err.response?.data?.error || 'Failed to load users.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // --- Handle User Deletion ---
    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            try {
                setLoading(true);
                await deleteUser(userId); // Use the imported API function
                setUsers(users.filter(user => user.id !== userId)); // Remove deleted user from state
                toast.success(`User "${userName}" deleted successfully!`);
            } catch (err) {
                console.error('Error deleting user:', err.response?.data?.error || err.message);
                toast.error(err.response?.data?.error || 'Failed to delete user.');
            } finally {
                setLoading(false);
            }
        }
    };

    // --- Handle User Role Update ---
    const handleUpdateUserRole = async (userId, newRole, userName) => {
        try {
            setLoading(true);
            const response = await updateUserRole(userId, newRole); // Use the imported API function
            setUsers(users.map(user => user.id === userId ? response.user : user)); // Update user with response.user (from backend)
            toast.success(`Role for "${userName}" updated to ${newRole}!`);
        } catch (err) {
            console.error('Error updating user role:', err.response?.data?.error || err.message);
            toast.error(err.response?.data?.error || 'Failed to update user role.');
        } finally {
            setLoading(false);
        }
    };

    // --- Conditional Rendering for Loading/Error States ---
    if (loading && users.length === 0) {
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

    // --- Main Component Render ---
    return (
        <div className="container-fluid mt-4">
            <h2 className="mb-4">User Management</h2>

            {users.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No users found.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                                <th>Joined At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id.substring(0, 8)}...</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone_number || 'N/A'}</td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={user.role}
                                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value, user.full_name)}
                                            // Disable if current user is trying to change their own role
                                            // or if the user being edited is the only admin
                                            disabled={user.id === currentUser?.id || (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1)}
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                            {/* Add other roles if applicable, e.g., <option value="driver">Driver</option> */}
                                        </select>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteUser(user.id, user.full_name)}
                                            disabled={user.id === currentUser?.id || (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1)}
                                        >
                                            Delete
                                        </button>
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

export default UserManagement;