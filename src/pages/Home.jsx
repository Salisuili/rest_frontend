// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[500px] flex items-center" 
               style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/restaurant-hero.jpg')" }}>
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Restaurant</h1>
          <p className="text-xl md:text-2xl mb-8">Delicious food delivered to your doorstep</p>
          <Link 
            to="/menu" 
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Browse Menu
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🍔</div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p>We use only the freshest ingredients sourced from local farms</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p>Get your food delivered in under 30 minutes or it's free</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p>Our chefs have over 20 years of culinary experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img src="/dish1.jpg" alt="Special Dish 1" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Jollof Rice with Chicken</h3>
                <p className="text-gray-600 mb-4">Our signature dish with secret recipe</p>
                <Link to="/menu" className="text-orange-500 hover:text-orange-600 font-medium">
                  View Details →
                </Link>
              </div>
            </div>
            {/* Repeat for other dishes */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to order?</h2>
          {user ? (
            <Link 
              to="/menu" 
              className="inline-block bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Order Now
            </Link>
          ) : (
            <div>
              <Link 
                to="/register" 
                className="inline-block bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 mr-4"
              >
                Sign Up
              </Link>
              <Link 
                to="/menu" 
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-orange-500 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Browse as Guest
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;