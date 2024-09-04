import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cart: [],
  totalAmount: 0,
  isOpen: false, // Estado para manejar si el carrito está abierto o cerrado
};

const cartReducer = (state, action) => {
  console.log('Action:', action);
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === action.payload._id,
      );
      console.log('Existing item index:', existingItemIndex);
      let newCart;

      if (existingItemIndex !== -1) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        newCart = [...state.cart];
        newCart[existingItemIndex].quantity += action.payload.quantity || 1;
      } else {
        // Si el producto no está en el carrito, lo agregamos con su cantidad
        newCart = [
          ...state.cart,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ];
      }

      const newTotalAmount = newCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      return { ...state, cart: newCart, totalAmount: newTotalAmount };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(
        (item) => item._id !== action.payload._id,
      );
      const newTotalAmount = newCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      return { ...state, cart: newCart, totalAmount: newTotalAmount };
    }

    case 'UPDATE_QUANTITY': {
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (existingItemIndex !== -1) {
        const newCart = [...state.cart];
        newCart[existingItemIndex].quantity += action.payload.amount;

        if (newCart[existingItemIndex].quantity < 1) {
          newCart[existingItemIndex].quantity = 1;
        }

        const newTotalAmount = newCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        return { ...state, cart: newCart, totalAmount: newTotalAmount };
      }

      return state;
    }

    case 'SET_QUANTITY': {
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (existingItemIndex !== -1) {
        const newCart = [...state.cart];
        newCart[existingItemIndex].quantity = action.payload.quantity;

        const newTotalAmount = newCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        return { ...state, cart: newCart, totalAmount: newTotalAmount };
      }

      return state;
    }

    case 'CLEAR_CART':
      return { ...state, cart: [], totalAmount: 0 };

    case 'TOGGLE_CART': {
      return { ...state, isOpen: !state.isOpen };
    }
    case 'UPDATE_PRICE': {
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (existingItemIndex !== -1) {
        const newCart = [...state.cart];
        newCart[existingItemIndex].price = action.payload.price;

        const newTotalAmount = newCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        return { ...state, cart: newCart, totalAmount: newTotalAmount };
      }

      return state;
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    console.log(state.cart),
    (
      <CartContext.Provider value={{ state, dispatch }}>
        {children}
      </CartContext.Provider>
    )
  );
};

export const useCart = () => useContext(CartContext);
