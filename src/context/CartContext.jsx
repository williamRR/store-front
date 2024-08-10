import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cart: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newCart = [...state.cart, action.payload];
      const newTotalAmount = newCart.reduce((acc, item) => acc + item.price, 0);
      return { ...state, cart: newCart, totalAmount: newTotalAmount };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(
        (item) => item.id !== action.payload.id,
      );
      const newTotalAmount = newCart.reduce((acc, item) => acc + item.price, 0);
      return { ...state, cart: newCart, totalAmount: newTotalAmount };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], totalAmount: 0 };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
