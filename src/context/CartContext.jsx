import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ecoroots-cart';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { item, qty } = action;
      const existing = state.items.find((i) => i.variantId === item.variantId);
      const items = existing
        ? state.items.map((i) => (i.variantId === item.variantId ? { ...i, qty: i.qty + qty } : i))
        : [...state.items, { ...item, qty }];
      return { ...state, items, open: true };
    }
    case 'qty':
      return {
        ...state,
        items: state.items
          .map((i) => (i.variantId === action.variantId ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      };
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.variantId !== action.variantId) };
    case 'open':
      return { ...state, open: action.open };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ items: load(), open: false }));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* storage unavailable – cart just won't persist */
    }
  }, [state.items]);

  // lock page scroll while the drawer is open (same as the theme's .scroll-locked)
  useEffect(() => {
    document.documentElement.classList.toggle('scroll-locked', state.open);
  }, [state.open]);

  const value = useMemo(() => {
    const count = state.items.reduce((n, i) => n + i.qty, 0);
    const subtotal = state.items.reduce((n, i) => n + i.qty * i.price, 0);
    return {
      ...state,
      count,
      subtotal,
      add: (item, qty = 1) => dispatch({ type: 'add', item, qty }),
      setQty: (variantId, qty) => dispatch({ type: 'qty', variantId, qty }),
      remove: (variantId) => dispatch({ type: 'remove', variantId }),
      setOpen: (open) => dispatch({ type: 'open', open }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
