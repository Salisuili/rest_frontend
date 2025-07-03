import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center space-x-4">
        <img 
          src={item.image_url || '/placeholder-food.jpg'} 
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-gray-600">₦{item.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
        <button 
          onClick={() => removeFromCart(item.id)}
          className="ml-4 text-red-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;