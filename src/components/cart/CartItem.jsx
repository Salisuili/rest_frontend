import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const fullImageUrl = item.image_url 
    ? (item.image_url.startsWith('/uploads/') ? `${API_URL}${item.image_url}` : item.image_url)
    : placeholderImage;

  return (
    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
      <div className="d-flex align-items-center me-3">
        <img 
          src={fullImageUrl} 
          alt={item.name}
          className="rounded me-3"
          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
        />
        <div>
          <h5 className="mb-0 fw-normal">{item.name}</h5>
          <p className="text-muted mb-0">₦{item.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <button 
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="btn btn-outline-secondary px-2 py-1"
        >
          -
        </button>
        <span className="mx-2">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="btn btn-outline-secondary px-2 py-1"
        >
          +
        </button>
        <button 
          onClick={() => removeFromCart(item.id)}
          className="btn btn-link text-danger ms-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;