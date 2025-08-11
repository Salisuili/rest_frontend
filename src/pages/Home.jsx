// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCategories } from '../api/categoryApi'; 
import LoadingSpinner from '../components/ui/LoadingSpinner'; 

const API_URL = process.env.REACT_APP_API_URL; // Get API URL for image paths

// Helper function to get an emoji based on category name
const getCategoryEmoji = (categoryName) => {
  switch (categoryName.toLowerCase()) {
    case 'pizza': return '🍕';
    case 'burgers': return '🍔';
    case 'drinks': return '🥤';
    case 'desserts': return '🍰';
    case 'nigerian dishes': return '🍲';
    case 'soups': return '🥣';
    case 'swallow': return '🍚';
    case 'rice': return '🍚'; 
    case 'pasta': return '🍝';
    case 'salads': return '🥗';
    case 'breakfast': return '�';
    default: return '🍽️'; 
  }
};

const Home = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoadingCategories(true);
      setError(null);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories for Home page:', err);
        setError('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategoriesData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="position-relative d-flex align-items-center text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/restaurant-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Welcome to Our Restaurant</h1>
          <p className="lead mb-5">Delicious food delivered to your doorstep</p>
          <Link
            to="/menu"
            className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-3"
          >
            Browse Menu
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="h2 fw-bold text-center mb-5">Why Choose Us</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card shadow-sm p-4 text-center h-100">
                <div className="fs-1 mb-3">🍔</div>
                <h3 className="h5 fw-semibold mb-2">Fresh Ingredients</h3>
                <p className="card-text">We use only the freshest ingredients sourced from local farms</p>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm p-4 text-center h-100">
                <div className="fs-1 mb-3">⏱️</div>
                <h3 className="h5 fw-semibold mb-2">Fast Delivery</h3>
                <p className="card-text">Get your food delivered in under 30 minutes or it's free</p>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm p-4 text-center h-100">
                <div className="fs-1 mb-3">👨‍🍳</div>
                <h3 className="h5 fw-semibold mb-2">Expert Chefs</h3>
                <p className="card-text">Our chefs have over 20 years of culinary experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Specialties (Dynamic Categories) */}
      <section className="py-5">
        <div className="container">
          <h2 className="h2 fw-bold text-center mb-5">Explore Our Categories</h2>
          {loadingCategories ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : categories.length === 0 ? (
            <div className="alert alert-info text-center">No categories available.</div>
          ) : (
            
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
              {categories.map(category => (
                <div className="col" key={category.id}>
                  <div className="card shadow-sm overflow-hidden h-100 rounded-lg">
                    {category.image_url ? (
                      <img
                        src={`${API_URL}${category.image_url.startsWith('/uploads/') ? category.image_url : `/uploads/${category.image_url}`}`}
                        alt={category.name}
                        className="card-img-top object-cover"
                        style={{ height: '12rem', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = 'https://placehold.co/400x300/e0e0e0/555555?text=No+Image'; // Fallback to a generic placeholder
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex flex-column justify-content-center align-items-center text-white p-3"
                        style={{
                          height: '12rem',
                          background: 'linear-gradient(45deg, #FF6B6B, #FFD166)', // A vibrant gradient
                          fontSize: '4rem', 
                          borderRadius: '0.375rem 0.375rem 0 0', 
                          textAlign: 'center'
                        }}
                      >
                        {getCategoryEmoji(category.name)}
                        <span className="fs-6 fw-bold mt-2">{category.name}</span>
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <h3 className="h5 fw-semibold mb-2">{category.name}</h3>
                      <p className="card-text text-muted mb-3 flex-grow-1">
                        {category.description || 'Explore delicious items in this category.'}
                      </p>
                      <Link to={`/menu?category=${category.id}`} className="link-warning fw-medium text-decoration-none mt-auto">
                        View Items &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-warning text-white">
        <div className="container text-center">
          <h2 className="h2 fw-bold mb-4">Ready to order?</h2>
          {user ? (
            <Link
              to="/menu"
              className="btn btn-light btn-lg fw-bold px-5 py-3 rounded-3"
            >
              Order Now
            </Link>
          ) : (
            <div>
              <Link
                to="/register"
                className="btn btn-light btn-lg fw-bold px-5 py-3 rounded-3 me-3"
              >
                Sign Up
              </Link>
              <Link
                to="/menu"
                className="btn btn-outline-light btn-lg fw-bold px-5 py-3 rounded-3"
              >
                Browse as Guest
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
