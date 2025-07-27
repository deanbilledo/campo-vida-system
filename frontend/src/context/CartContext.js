import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  SET_CART_OPEN: 'SET_CART_OPEN',
  LOAD_CART: 'LOAD_CART',
};

// Helper functions
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const saveCartToStorage = (items) => {
  localStorage.setItem('campo-vida-cart', JSON.stringify(items));
};

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('campo-vida-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product._id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '/images/placeholder.jpg',
          quantity,
          maxStock: product.stock,
          category: product.category,
          unit: product.unit,
        };
        newItems = [...state.items, newItem];
      }

      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);
      
      saveCartToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.id !== productId);
      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);
      
      saveCartToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, {
          type: CART_ACTIONS.REMOVE_ITEM,
          payload: { productId },
        });
      }

      const newItems = state.items.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      );
      
      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);
      
      saveCartToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      saveCartToStorage([]);
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    case CART_ACTIONS.TOGGLE_CART: {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case CART_ACTIONS.SET_CART_OPEN: {
      return {
        ...state,
        isOpen: action.payload,
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      const items = action.payload;
      const total = calculateTotal(items);
      const itemCount = calculateItemCount(items);
      
      return {
        ...state,
        items,
        total,
        itemCount,
      };
    }

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: savedItems,
      });
    }
  }, []);

  // Add item to cart
  const addItem = (product, quantity = 1) => {
    // Check stock availability
    const existingItem = state.items.find(item => item.id === product._id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;

    if (newTotalQuantity > product.stock) {
      toast.error(`Sorry, only ${product.stock} items available in stock`);
      return false;
    }

    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity },
    });

    toast.success(`${product.name} added to cart`);
    return true;
  };

  // Remove item from cart
  const removeItem = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId },
    });
    toast.success('Item removed from cart');
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const item = state.items.find(item => item.id === productId);
    
    if (!item) return false;

    if (quantity > item.maxStock) {
      toast.error(`Sorry, only ${item.maxStock} items available in stock`);
      return false;
    }

    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });

    return true;
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success('Cart cleared');
  };

  // Toggle cart sidebar
  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART });
  };

  // Set cart open state
  const setCartOpen = (isOpen) => {
    dispatch({
      type: CART_ACTIONS.SET_CART_OPEN,
      payload: isOpen,
    });
  };

  // Get item by product ID
  const getItem = (productId) => {
    return state.items.find(item => item.id === productId);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = getItem(productId);
    return item ? item.quantity : 0;
  };

  // Calculate shipping cost (could be moved to a separate context/service)
  const calculateShipping = () => {
    if (state.total >= 1000) {
      return 0; // Free shipping for orders over ₱1000
    }
    return 50; // Standard shipping fee
  };

  // Calculate final total including shipping
  const getFinalTotal = () => {
    return state.total + calculateShipping();
  };

  // Get cart summary
  const getCartSummary = () => {
    const shipping = calculateShipping();
    const finalTotal = getFinalTotal();
    
    return {
      subtotal: state.total,
      shipping,
      total: finalTotal,
      itemCount: state.itemCount,
      freeShippingThreshold: 1000,
      amountForFreeShipping: Math.max(0, 1000 - state.total),
    };
  };

  // Validate cart before checkout
  const validateCart = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    // Check if all items are still in stock (this would need API call in real app)
    const outOfStockItems = state.items.filter(item => item.quantity > item.maxStock);
    if (outOfStockItems.length > 0) {
      toast.error('Some items in your cart are out of stock');
      return false;
    }

    return true;
  };

  // Context value
  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getItem,
    isInCart,
    getItemQuantity,
    calculateShipping,
    getFinalTotal,
    getCartSummary,
    validateCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
