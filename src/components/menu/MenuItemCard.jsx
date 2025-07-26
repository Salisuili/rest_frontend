// frontend/src/components/menu/MenuItemCard.jsx
import React from 'react';
import { useCart } from '../../context/CartContext'; // Assuming cart context is used
import { toast } from 'react-hot-toast'; // For consistent toast notifications

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  // Define a placeholder image URL
  // This uses a placeholder service. You could also use a local image asset:
  // const placeholderImage = '/path/to/your/placeholder-image.png';
  const placeholderImage = 'https://placehold.co/400x300/e0e0e0/555555?text=No+Image';

  // Construct the full image URL. If item.image_url is a relative path (e.g., /uploads/...),
  // prepend the backend API URL. If it's already a full URL (e.g., from Supabase Storage), use it directly.
  // Assuming API_URL is defined in your frontend's .env (e.g., http://localhost:5001)
  const API_URL = process.env.REACT_APP_API_URL;
  const fullImageUrl = item.image_url 
    ? (item.image_url.startsWith('/uploads/') ? `${API_URL}${item.image_url}` : item.image_url)
    : placeholderImage;

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden">
      {/* Image with fallback */}
      <img
        src={fullImageUrl}
        className="card-img-top object-cover" // object-cover to maintain aspect ratio
        alt={item.name}
        style={{ height: '200px', width: '100%' }} // Fixed height for consistent card appearance
        onError={(e) => {
          // Fallback if the image fails to load (e.g., broken URL)
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = placeholderImage;
        }}
      />
      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title fw-bold text-truncate mb-1">{item.name}</h5>
        <p className="card-text text-muted small flex-grow-1 mb-2 overflow-hidden" style={{ maxHeight: '3em' }}>
          {item.description || 'No description available.'}
        </p>
        <p className="card-text fw-bold fs-5 text-primary mb-3">₦{item.price.toFixed(2)}</p>
        <button
          className="btn btn-primary w-100 mt-auto rounded-pill py-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
