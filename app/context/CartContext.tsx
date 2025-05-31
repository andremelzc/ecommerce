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
        const res = await fetch('/api/cart');
        if (!res.ok) throw new Error('Error cargando carrito');
        const data = await res.json();
        dispatch({ type: 'SET_ITEMS', payload: data.items });
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
    // 3.1. Optimistic update: despachamos inmediatamente
    dispatch({ type: 'ADD_ITEM', payload: item });

    try {
      // 3.2. Llamamos al endpoint para que persista en DB
      await fetch('/api/cart/addOrUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      // Opcional: podrías chequear la respuesta JSON para ver si hubo error
    } catch (err) {
      console.error('Error agregando ítem en backend:', err);
      // Aquí podrías revertir el cambio local si lo deseas (rollback),
      // o simplemente notificar al usuario y mantener el estado local.
    }
  };

  // 4) Función para eliminar un ítem
  const removeItem = async (productId: number) => {
    // 4.1. Optimistic update
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });

    try {
      await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error eliminando ítem en backend:', err);
      // Opcional rollback si se desea
    }
  };

  // 5) Función para actualizar cantidad
  const updateQuantity = async (productId: number, quantity: number) => {
    // 5.1. Optimistic update
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });

    try {
      await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
    } catch (err) {
      console.error('Error actualizando cantidad en backend:', err);
      // Opcional rollback
    }
  };

  // 6) Función para vaciar el carrito (solo en memoria; si quieres persistir, habría que crear un endpoint adicional)
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    // Si quieres eliminar todo en BD, tendrías que crear un DELETE /api/cart/all
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
