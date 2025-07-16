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
      const existing = state.find((item) => item.productId === action.payload.productId);
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
      return state.filter((item) => item.productId !== action.payload.productId);
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
  setCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue>({
  cart: [],
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: () => {},
  setCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const setCart = (items: CartItem[]) => {
    dispatch({ type: 'SET_ITEMS', payload: items });
  };

  // Auxiliar para traer los descuentos desde la API
  async function applyDiscounts(items: CartItem[]): Promise<CartItem[]> {
  try {
    const res = await fetch('/api/descuentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: items.map(i => i.productId) }),
    });
    const descuentos = await res.json();

    // Mapear id → descuento (parseFloat!)
    const descuentosMap = new Map<number, number>();
    descuentos.forEach((d: { id: number; descuento: string }) => {
      descuentosMap.set(d.id, parseFloat(d.descuento));
    });

    // Aplicar a los items
    return items.map((item) => {
      const descuento = descuentosMap.get(item.productId) ?? 0;
      const precioOriginal = item.precio;
      const precioConDescuento = parseFloat(
        (precioOriginal * (1 - descuento)).toFixed(2)
      );

      return {
        ...item,
        precioOriginal,
        descuento,
        precio: precioConDescuento,
      };
    });
  } catch (err) {
    console.error('Error aplicando descuentos:', err);
    return items;
  }
}


  // 1) Cargar inicialmente los items desde la API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await fetchCartItems();
        const updatedItems = await applyDiscounts(items);
        dispatch({ type: 'SET_ITEMS', payload: updatedItems });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  // 2) Guardar en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // 3) Agregar ítem
  const addItem = async (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    try {
      await addOrUpdateItem(item);
    } catch (err) {
      console.error('Error agregando ítem en backend:', err);
    }
  };

  // 4) Eliminar ítem
  const removeItem = async (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    try {
      await removeItemById(productId);
    } catch (err) {
      console.error('Error eliminando ítem en backend:', err);
    }
  };

  // 5) Actualizar cantidad
  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const res = await updateItemQuantity(productId, quantity);
      if (res?.success) {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      } else {
        alert(res?.error || 'No se pudo actualizar la cantidad');
      }
    } catch (err) {
      console.error('Error actualizando cantidad en backend:', err);
      alert('Error del servidor al actualizar el carrito');
    }
  };

  // 6) Vaciar carrito
  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    try {
      await clearAllCartItems();
    } catch (err) {
      console.error('Error vaciando carrito en backend:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
