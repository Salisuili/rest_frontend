import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/menu" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 font-semibold">
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 p-4 border-b items-center">
                  <div className="col-span-5 flex items-center space-x-4">
                    <img 
                      src={item.image_url || '/placeholder-food.jpg'} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm mt-1 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center">
                    {formatCurrency(item.price)}
                  </div>
                  
                  <div className="col-span-3 flex justify-center">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              
              <div className="p-4 flex justify-end">
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({itemCount}):</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{cartTotal > 5000 ? 'FREE' : formatCurrency(1000)}</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(cartTotal > 5000 ? cartTotal : cartTotal + 1000)}</span>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="block w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg transition"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                to="/menu"
                className="block w-full mt-4 text-center text-blue-600 hover:text-blue-800"
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