import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers'; // Assuming this helper is still available

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    itemCount,
    clearCart
  } = useCart();

  return (
    <div className="container py-5"> {/* Bootstrap container with vertical padding */}
      <h1 className="h2 fw-bold mb-4">Your Shopping Cart</h1> {/* Bootstrap heading, bold, margin-bottom */}

      {cartItems.length === 0 ? (
        <div className="text-center py-5"> {/* Centered text, vertical padding */}
          <p className="lead text-muted mb-4">Your cart is empty</p> {/* Lead text, muted color, margin-bottom */}
          <Link
            to="/menu"
            className="btn btn-primary btn-lg" // Bootstrap primary button, large size
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="row g-4"> {/* Bootstrap row for main layout, g-4 for gutters */}
          {/* Cart Items */}
          <div className="col-lg-8"> {/* Takes 2/3 width on large screens */}
            <div className="card shadow-sm overflow-hidden"> {/* Card with shadow, hidden overflow */}
              {/* Table Header for larger screens */}
              <div className="d-none d-md-grid align-items-center bg-light p-3 fw-semibold text-muted"
                   style={{ gridTemplateColumns: '5fr 2fr 3fr 2fr' }}> {/* Custom grid for 12-column equivalent */}
                <div>Item</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-end">Total</div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="d-grid align-items-center p-3 border-bottom"
                     style={{ gridTemplateColumns: '5fr 2fr 3fr 2fr' }}> {/* Custom grid for 12-column equivalent */}
                  <div className="d-flex align-items-center me-3"> {/* Flex for image and text, margin-end */}
                    <img
                      src={item.image_url || '/placeholder-food.jpg'}
                      alt={item.name}
                      className="rounded me-3" // Bootstrap rounded corners, margin-end
                      style={{ width: '5rem', height: '5rem', objectFit: 'cover' }} // Specific size and fit
                    />
                    <div>
                      <h5 className="h6 fw-medium mb-1">{item.name}</h5> {/* Smaller heading, medium font weight */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-link text-danger p-0" // Link-style button, red text, no padding
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-center d-flex d-md-block justify-content-center"> {/* Centered price, flex on mobile */}
                    {formatCurrency(item.price)}
                  </div>

                  <div className="d-flex justify-content-center"> {/* Centered quantity controls */}
                    <div className="input-group input-group-sm w-auto"> {/* Small input group for quantity */}
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-outline-secondary" // Outlined button
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center px-2" // Centered text, reduced horizontal padding
                        value={item.quantity}
                        readOnly
                        style={{ width: '4rem' }} // Fixed width for quantity input
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-outline-secondary"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-end fw-medium d-flex d-md-block justify-content-end"> {/* End-aligned total, flex on mobile */}
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <div className="p-3 d-flex justify-content-end"> {/* Padding, flex to end */}
                <button
                  onClick={clearCart}
                  className="btn btn-link text-danger" // Link-style button, red text
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4"> {/* Takes 1/3 width on large screens */}
            <div className="card shadow-sm p-4"> {/* Card with shadow and padding */}
              <h2 className="h4 fw-semibold mb-4">Order Summary</h2> {/* Smaller heading, semi-bold */}

              <div className="d-grid gap-3 mb-4"> {/* Bootstrap grid for summary lines, gap between lines */}
                <div className="d-flex justify-content-between">
                  <span>Items ({itemCount}):</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Delivery Fee:</span>
                  <span>{cartTotal > 5000 ? 'FREE' : formatCurrency(1000)}</span>
                </div>

                <div className="border-top pt-3 d-flex justify-content-between fw-bold fs-5"> {/* Border top, padding top, bold, larger font size */}
                  <span>Total:</span>
                  <span>{formatCurrency(cartTotal > 5000 ? cartTotal : cartTotal + 1000)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn btn-success w-100 mb-3" // Success button, full width, margin bottom
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/menu"
                className="btn btn-link w-100 text-primary" // Link button, full width, primary color
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