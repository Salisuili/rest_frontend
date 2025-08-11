// frontend/src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); 
  const [cartItems, setCartItems] = useState([]);

  const getCartFromLocalStorage = useCallback((userId) => {
    if (userId) {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return []; 
  }, []);

  const saveCartToLocalStorage = useCallback((userId, items) => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setCartItems(getCartFromLocalStorage(user.id));
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user?.id, getCartFromLocalStorage]); 

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
