// frontend/src/components/menu/MenuItemCard.jsx
import { useCart } from '../../context/CartContext'; 
import { toast } from 'react-hot-toast'; 

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  const placeholderImage = 'https://placehold.co/400x300/e0e0e0/555555?text=No+Image';

 
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
        className="card-img-top object-cover" 
        alt={item.name}
        style={{ height: '200px', width: '100%' }} 
        onError={(e) => {
          e.target.onerror = null; 
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
