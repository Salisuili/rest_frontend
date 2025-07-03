import { useCart } from '../../context/CartContext';

const CartSummary = ({ onCheckout }) => {
  const { cartTotal, itemCount } = useCart();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Items ({itemCount})</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;