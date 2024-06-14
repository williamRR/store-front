import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.payload.id);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    setTotalAmount(total);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
