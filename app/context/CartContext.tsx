// app/context/CartContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { CartItem } from '@/app/types/itemCarrito';

import {
  addOrUpdateItem,
  removeItemById,
  updateItemQuantity,
  fetchCartItems,
  clearAllCartItems,
} from '@/app/utils/cartActions';


type CartState = CartItem[];

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.payload;

    case 'ADD_ITEM': {
      const existing = state.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        return state.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
            : item
        );
      }
      return [...state, action.payload];
    }

    case 'REMOVE_ITEM':
      return state.filter(
        (item) => item.productId !== action.payload.productId
      );

    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, cantidad: action.payload.quantity }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

interface CartContextValue {
  cart: CartState;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  cart: [],
  // Las funciones devuelven Promesas vacías por defecto
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // 1) Cargar inicialmente los items desde la API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await fetchCartItems();
        dispatch({ type: 'SET_ITEMS', payload: items });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);


  // 2) (Opcional) Guardar en localStorage para persistencia rápida
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // 3) Función para agregar (o sumar) un ítem
  const addItem = async (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });

    try {
      await addOrUpdateItem(item);
    } catch (err) {
      console.error('Error agregando ítem en backend:', err);
    }
  };

  // 4) Función para eliminar un ítem
  const removeItem = async (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });

    try {
      await removeItemById(productId);
    } catch (err) {
      console.error('Error eliminando ítem en backend:', err);
    }
  };

  // 5) Función para actualizar cantidad
const updateQuantity = async (productId: number, quantity: number) => {
  try {
    const res = await updateItemQuantity(productId, quantity);

    if (res?.success) {
      // Solo actualizamos estado si el backend lo acepta
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    } else {
      // El backend rechazó la cantidad (por falta de stock u otro error)
      alert(res?.error || 'No se pudo actualizar la cantidad');
    }
  } catch (err) {
    console.error('Error actualizando cantidad en backend:', err);
    alert('Error del servidor al actualizar el carrito');
  }
};


  // 6) Función para vaciar el carrito
  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    try {
      await clearAllCartItems();
    } catch (err) {
      console.error('Error vaciando carrito en backend:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
