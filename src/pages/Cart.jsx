import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems } = useCart();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>{/* Render cart items here */}</div>
      )}
    </div>
  );
}