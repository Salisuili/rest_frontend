// frontend/src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, initiatePayment } from '../api/orderApi';
import { getUserAddresses, addUserAddress } from '../api/userApi';
import CartSummary from '../components/cart/CartSummary'; // Assuming CartSummary might be updated or removed
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast'; // Ensure this is react-hot-toast

const Checkout = () => {
  const { cartItems, clearCart, cartTotal } = useCart(); // Get cartTotal from CartContext
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    selectedAddressId: '',
    newStreetAddress: '',
    newCity: '',
    newState: '',
    newPostalCode: '',
    newCountry: 'Nigeria',
    deliveryNotes: '',
    paymentMethod: 'paystack',
    deliveryOption: 'delivery' // New state: 'delivery' or 'pickup'
  });

  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [calculatedDeliveryFee, setCalculatedDeliveryFee] = useState(0); // State to hold calculated delivery fee

  // --- ALL HOOK CALLS GO HERE, BEFORE ANY CONDITIONAL RETURNS ---
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        setAddressLoading(true);
        try {
          const addresses = await getUserAddresses();
          setUserAddresses(addresses);
          if (addresses.length > 0 && !formData.selectedAddressId) {
            const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
            setFormData(prev => ({
              ...prev,
              selectedAddressId: defaultAddress.id
            }));
          }
        } catch (error) {
          console.error("Error fetching user addresses:", error);
          toast.error("Failed to load delivery addresses.");
        } finally {
          setAddressLoading(false);
        }
      } else {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, [user, formData.selectedAddressId]);

  // Effect to calculate delivery fee whenever relevant data changes
  useEffect(() => {
    let fee = 0;
    if (formData.deliveryOption === 'delivery' && formData.selectedAddressId) {
      const selectedAddress = userAddresses.find(addr => addr.id === formData.selectedAddressId);
      if (selectedAddress) {
        // Apply your delivery fee logic here, consistent with backend
        if (selectedAddress.city.toLowerCase() === 'zaria') {
          fee = cartTotal >= 5000 ? 0 : 500;
        } else {
          fee = 1000;
        }
      }
    }
    setCalculatedDeliveryFee(fee);
  }, [formData.deliveryOption, formData.selectedAddressId, userAddresses, cartTotal]);


  // --- Early returns now come AFTER all hook calls ---
  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/menu');
    toast("Your cart is empty. Please add items to proceed to checkout.", { icon: 'ℹ️' });
    return null;
  }

  // --- Rest of your component logic and JSX ---

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newAddressData = {
        street_address: formData.newStreetAddress,
        city: formData.newCity,
        state: formData.newState,
        postal_code: formData.newPostalCode,
        country: formData.newCountry,
        is_default: userAddresses.length === 0
      };

      const addedAddress = await addUserAddress(newAddressData);
      setUserAddresses(prev => [...prev, addedAddress]);
      setFormData(prev => ({
        ...prev,
        selectedAddressId: addedAddress.id,
        newStreetAddress: '', newCity: '', newState: '', newPostalCode: '', newCountry: 'Nigeria'
      }));
      setShowNewAddressForm(false);
      toast.success('New address added successfully!');
    } catch (error) {
      console.error('Error adding new address:', error);
      toast.error(error.message || 'Failed to add new address.');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.deliveryOption === 'delivery' && !formData.selectedAddressId) {
      toast.error('Please select a delivery address or add a new one for delivery.');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          special_instructions: item.special_instructions || null
        })),
        // Only include address_id if delivery is selected
        address_id: formData.deliveryOption === 'delivery' ? formData.selectedAddressId : null,
        delivery_notes: formData.deliveryNotes,
        is_pickup: formData.deliveryOption === 'pickup' // Pass this flag to the backend
      };

      const order = await createOrder(orderPayload);

      if (formData.paymentMethod === 'paystack') {
        const payment = await initiatePayment(order.id, user.email);
        window.location.href = payment.authorization_url;
      } else {
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (addressLoading) {
    return <LoadingSpinner />;
  }

  const totalAmount = cartTotal + calculatedDeliveryFee;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <h1 className="h2 fw-bold mb-4">Checkout</h1>

          <div className="row g-4">
            <div className="col-md-8">
              <form onSubmit={handleSubmitOrder} className="card shadow-sm p-4">
                <h2 className="h4 fw-semibold mb-4">Delivery Options</h2>
                <div className="mb-4">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="deliveryOption"
                      id="deliveryOptionDelivery"
                      value="delivery"
                      checked={formData.deliveryOption === 'delivery'}
                      onChange={handleFormChange}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="deliveryOptionDelivery">
                      Delivery
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="deliveryOption"
                      id="deliveryOptionPickup"
                      value="pickup"
                      checked={formData.deliveryOption === 'pickup'}
                      onChange={handleFormChange}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="deliveryOptionPickup">
                      Pickup (No Delivery Fee)
                    </label>
                  </div>
                </div>

                {formData.deliveryOption === 'delivery' && (
                  <>
                    <h2 className="h4 fw-semibold mb-4">Delivery Information</h2>
                    <div className="mb-3">
                      <label htmlFor="deliveryAddressSelect" className="form-label">Select Delivery Address</label>
                      {userAddresses.length === 0 && !showNewAddressForm ? (
                        <div className="alert alert-info" role="alert">
                          No addresses found. Please add a new address.
                        </div>
                      ) : (
                        <select
                          id="deliveryAddressSelect"
                          name="selectedAddressId"
                          className="form-select"
                          value={formData.selectedAddressId}
                          onChange={handleFormChange}
                          required={formData.deliveryOption === 'delivery'} // Required only for delivery
                          disabled={loading}
                        >
                          <option value="">Select an address</option>
                          {userAddresses.map(address => (
                            <option key={address.id} value={address.id}>
                              {address.street_address}, {address.city}, {address.state ? `${address.state}, ` : ''}{address.country}
                              {address.is_default && ' (Default)'}
                            </option>
                          ))}
                        </select>
                      )}

                      {!showNewAddressForm && (
                        <button
                          type="button"
                          className="btn btn-link mt-2"
                          onClick={() => setShowNewAddressForm(true)}
                          disabled={loading}
                        >
                          Add New Address
                        </button>
                      )}
                    </div>

                    {showNewAddressForm && (
                      <div className="card bg-light p-3 mb-4">
                        <h5 className="mb-3">Add New Address</h5>
                        <div className="mb-3">
                          <label htmlFor="newStreetAddress" className="form-label">Street Address</label>
                          <input type="text" className="form-control" id="newStreetAddress" name="newStreetAddress" value={formData.newStreetAddress} onChange={handleFormChange} required={showNewAddressForm} disabled={loading} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newCity" className="form-label">City</label><br />
                          <small>Any location within kaduna state put zaria</small>
                          <input type="text" className="form-control" id="newCity" name="newCity" value={formData.newCity} onChange={handleFormChange} required={showNewAddressForm} disabled={loading} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newState" className="form-label">State</label>
                          <input type="text" className="form-control" id="newState" name="newState" value={formData.newState} onChange={handleFormChange} disabled={loading} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newPostalCode" className="form-label">Postal Code (Optional)</label>
                          <input type="text" className="form-control" id="newPostalCode" name="newPostalCode" value={formData.newPostalCode} onChange={handleFormChange} disabled={loading} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newCountry" className="form-label">Country</label>
                          <input type="text" className="form-control" id="newCountry" name="newCountry" value={formData.newCountry} onChange={handleFormChange} required={showNewAddressForm} disabled={loading} />
                        </div>
                        <button type="button" className="btn btn-success" onClick={handleAddNewAddress} disabled={loading}>
                          {loading ? 'Adding...' : 'Save New Address'}
                        </button>
                        <button type="button" className="btn btn-secondary mt-2" onClick={() => setShowNewAddressForm(false)} disabled={loading}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                )}

                <div className="mb-4">
                  <label htmlFor="deliveryNotes" className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    id="deliveryNotes"
                    name="deliveryNotes"
                    className="form-control"
                    rows="2"
                    value={formData.deliveryNotes}
                    onChange={handleFormChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-5">
                  <h3 className="h5 fw-semibold mb-3">Payment Method</h3>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paymentMethodPaystack"
                      value="paystack"
                      checked={formData.paymentMethod === 'paystack'}
                      onChange={handleFormChange}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="paymentMethodPaystack">
                      Pay with Paystack (Online Payment)
                    </label>
                  </div>
                </div>

                <div className="card shadow-sm p-4 mb-4">
                  <h2 className="h4 fw-semibold mb-4">Order Summary</h2>
                  <div className="d-grid gap-3 mb-4">
                    <div className="d-flex justify-content-between">
                      <span>Items Total:</span>
                      <span>₦{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Delivery Fee:</span>
                      <span>{calculatedDeliveryFee === 0 ? 'FREE' : `₦${calculatedDeliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="border-top pt-3 d-flex justify-content-between fw-bold fs-5">
                      <span>Grand Total:</span>
                      <span>₦{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (formData.deliveryOption === 'delivery' && !formData.selectedAddressId)}
                  className="btn btn-primary w-100 py-3"
                >
                  {loading ? <LoadingSpinner /> : 'Complete Order'}
                </button>
              </form>
            </div>

            <div className="col-md-4">
              {/* CartSummary can be removed or simplified if its logic is now in this form */}
              {/* <CartSummary /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
