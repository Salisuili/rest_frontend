// frontend/src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth to access user information

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // Get user and isAuthenticated from AuthContext
  const [cartItems, setCartItems] = useState([]);

  // Function to get cart from localStorage based on user ID
  const getCartFromLocalStorage = useCallback((userId) => {
    if (userId) {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return []; // Return empty array if no user ID
  }, []);

  // Function to save cart to localStorage based on user ID
  const saveCartToLocalStorage = useCallback((userId, items) => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    }
  }, []);

  // Effect to load cart when user changes or component mounts
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Load the cart specific to this user
      setCartItems(getCartFromLocalStorage(user.id));
    } else {
      // If no user is authenticated, clear the cart
      setCartItems([]);
    }
  }, [isAuthenticated, user?.id, getCartFromLocalStorage]); // Depend on user.id and isAuthenticated

  // Effect to save cart whenever cartItems change for the current user
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      saveCartToLocalStorage(user.id, cartItems);
    }
  }, [cartItems, isAuthenticated, user?.id, saveCartToLocalStorage]);


  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId);
      }
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    // Also clear from localStorage for the current user
    if (user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
