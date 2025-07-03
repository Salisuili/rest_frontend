// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section
        className="position-relative d-flex align-items-center text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/restaurant-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px', // Specific height, consider using vh units if truly responsive needed
        }}
      >
        <div className="container text-center py-5"> {/* py-5 for top/bottom padding within hero */}
          <h1 className="display-4 fw-bold mb-4">Welcome to Our Restaurant</h1> {/* display-4 for large text, fw-bold */}
          <p className="lead mb-5">Delicious food delivered to your doorstep</p> {/* lead for larger paragraph text */}
          <Link
            to="/menu"
            className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-3" // Bootstrap warning button (often orange-yellow), large size, bold, custom padding, more rounded
          >
            Browse Menu
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light"> {/* py-5 for vertical padding, bg-light for gray background */}
        <div className="container">
          <h2 className="h2 fw-bold text-center mb-5">Why Choose Us</h2> {/* h2, bold, centered, mb-5 for spacing */}
          <div className="row row-cols-1 row-cols-md-3 g-4"> {/* Bootstrap grid: 1 column on small, 3 on md+, g-4 for gutter */}
            <div className="col"> {/* Column wrapper for each feature */}
              <div className="card shadow-sm p-4 text-center h-100"> {/* Card with shadow, padding, centered text, full height */}
                <div className="fs-1 mb-3">🍔</div> {/* fs-1 for larger emoji size */}
                <h3 className="h5 fw-semibold mb-2">Fresh Ingredients</h3> {/* h5, semi-bold */}
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

      {/* Popular Dishes */}
      <section className="py-5"> {/* py-5 for vertical padding */}
        <div className="container">
          <h2 className="h2 fw-bold text-center mb-5">Our Specialties</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card shadow-sm overflow-hidden h-100"> {/* Card with shadow, hidden overflow, full height */}
                <img
                  src="/dish1.jpg"
                  alt="Special Dish 1"
                  className="card-img-top"
                  style={{ height: '12rem', objectFit: 'cover' }} // Specific height and object-fit
                />
                <div className="card-body"> {/* card-body for padding */}
                  <h3 className="h5 fw-semibold mb-2">Jollof Rice with Chicken</h3>
                  <p className="card-text text-muted mb-3">Our signature dish with secret recipe</p>
                  <Link to="/menu" className="link-warning fw-medium text-decoration-none"> {/* Link with warning color, no underline */}
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
            {/* Repeat for other dishes - you'll add similar `col` divs here */}
            {/* Example for a second dish: */}
            <div className="col">
              <div className="card shadow-sm overflow-hidden h-100">
                <img
                  src="/dish2.jpg" // Assuming you have dish2.jpg
                  alt="Special Dish 2"
                  className="card-img-top"
                  style={{ height: '12rem', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h3 className="h5 fw-semibold mb-2">Amala and Ewedu</h3>
                  <p className="card-text text-muted mb-3">A traditional local delicacy</p>
                  <Link to="/menu" className="link-warning fw-medium text-decoration-none">
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
            {/* Example for a third dish: */}
            <div className="col">
              <div className="card shadow-sm overflow-hidden h-100">
                <img
                  src="/dish3.jpg" // Assuming you have dish3.jpg
                  alt="Special Dish 3"
                  className="card-img-top"
                  style={{ height: '12rem', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h3 className="h5 fw-semibold mb-2">Grilled Fish with Fries</h3>
                  <p className="card-text text-muted mb-3">Perfectly grilled for a healthy choice</p>
                  <Link to="/menu" className="link-warning fw-medium text-decoration-none">
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-warning text-white"> {/* py-5, bg-warning (often maps to orange), white text */}
        <div className="container text-center">
          <h2 className="h2 fw-bold mb-4">Ready to order?</h2>
          {user ? (
            <Link
              to="/menu"
              className="btn btn-light btn-lg fw-bold px-5 py-3 rounded-3" // Light button for contrast, large, bold, padding, rounded
            >
              Order Now
            </Link>
          ) : (
            <div>
              <Link
                to="/register"
                className="btn btn-light btn-lg fw-bold px-5 py-3 rounded-3 me-3" // Light button, spacing on right
              >
                Sign Up
              </Link>
              <Link
                to="/menu"
                className="btn btn-outline-light btn-lg fw-bold px-5 py-3 rounded-3" // Outlined light button
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