import { useCart } from '../../context/CartContext';

const CartSummary = ({ onCheckout }) => {
  const { cartTotal, itemCount } = useCart();

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title h5 mb-3 fw-bold">Order Summary</h3>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <span>Items ({itemCount})</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          
          <div className="d-flex justify-content-between border-top pt-2 fw-bold">
            <span>Total</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          className="btn btn-success w-100 py-2"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;