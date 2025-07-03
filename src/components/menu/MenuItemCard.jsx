import { useCart } from '../../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="card h-100">
      <img 
        src={item.image_url || '/placeholder-food.jpg'} 
        alt={item.name}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text text-muted">{item.description}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="h5 mb-0">₦{item.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart(item)}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;