// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Ensure this import is correct and toast is rendered

// Define the initial empty state for the form
const initialFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  // Initialize formData with the empty state
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register({
      full_name: formData.fullName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      password: formData.password
    });

    if (result.success) {
      toast.success('Registration successful!');
      // Clear the form only on successful registration
      setFormData(initialFormData);
      // Give a small delay before navigating to allow the toast to be seen
      setTimeout(() => {
        navigate('/');
      }, 1500); // Navigate after 1.5 seconds
    } else {
      // For failure, display the error and keep the form data
      toast.error(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow p-4">
          <div className="card-body">
            <h2 className="text-center h3 mb-4">
              Create an account
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="visually-hidden">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="visually-hidden">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-control"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="visually-hidden">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="visually-hidden">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="visually-hidden">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;