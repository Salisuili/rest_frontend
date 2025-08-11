import { useState, useEffect } from 'react'; 
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers'; 

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal, 
    cartItemCount, 
    clearCart
  } = useCart();

  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold mb-4">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead text-muted mb-4">Your cart is empty</p>
          <Link
            to="/menu"
            className="btn btn-primary btn-lg"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm overflow-hidden">
              <div className="d-none d-md-grid align-items-center bg-light p-3 fw-semibold text-muted"
                   style={{ gridTemplateColumns: '5fr 2fr 3fr 2fr' }}>
                <div>Item</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-end">Total</div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="d-grid align-items-center p-3 border-bottom"
                     style={{ gridTemplateColumns: '5fr 2fr 3fr 2fr' }}>
                  <div className="d-flex align-items-center me-3">
                    <img
                      src={item.image_url || '/placeholder-food.jpg'} 
                      alt={item.name}
                      className="rounded me-3"
                      style={{ width: '5rem', height: '5rem', objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className="h6 fw-medium mb-1">{item.name}</h5>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-link text-danger p-0"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-center d-flex d-md-block justify-content-center">
                    {formatCurrency(item.price)}
                  </div>

                  <div className="d-flex justify-content-center">
                    <div className="input-group input-group-sm w-auto">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-outline-secondary"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center px-2"
                        value={item.quantity}
                        readOnly
                        style={{ width: '4rem' }}
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-outline-secondary"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-end fw-medium d-flex d-md-block justify-content-end">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <div className="p-3 d-flex justify-content-end">
                <button
                  onClick={clearCart}
                  className="btn btn-link text-danger"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-4">
              <h2 className="h4 fw-semibold mb-4">Order Summary</h2>

              <div className="d-grid gap-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span>Items ({cartItemCount}):</span> 
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                
                <div className="border-top pt-3 d-flex justify-content-between fw-bold fs-5">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <p className="text-muted small mt-2">Delivery fees will be calculated at checkout based on your delivery option and address.</p>
              </div>

              <Link
                to="/checkout"
                className="btn btn-success w-100 mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/menu"
                className="btn btn-link w-100 text-primary"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
