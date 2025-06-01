'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { formatPrice } from '@/app/utils/formatPrice';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const subtotal = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row container-padding pt-8 gap-6">
      {/* Lista de productos */}
      <section className="flex-1 ">
        {cart.length === 0 ? (
          <p className="text-center">
            Tu carrito está vacío.{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Volver al catálogo
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {cart.map(item => (
              <li
                key={item.productId}
                className="flex items-center bg-gray-100 p-4 rounded-xl"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image_producto}
                    alt={item.nombre}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-lg">{item.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.descripcion}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mx-4">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1}
                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="text-base font-medium">{item.cantidad}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.cantidad + 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <span className="ml-6 font-semibold text-lg">
                  {formatPrice(item.precio)}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-4 p-1 rounded-full hover:bg-red-100"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Resumen de la compra */}
      <aside className="flex-none self-center w-full lg:w-1/3 max-w-sm p-6 border rounded-xl flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
        <div className="flex justify-between mb-2">
          <span className="text-base">Subtotal</span>
          <span className="text-base">{formatPrice(subtotal)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          onClick={() => {
            /* TODO: invocar tu API de checkout aquí */
          }}
          className="mt-6 w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Comprar
        </button>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="mt-4 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Vaciar carrito
          </button>
        )}
      </aside>
    </div>
  );
}
