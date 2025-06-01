'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { formatPrice } from '@/app/utils/formatPrice';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const subtotal = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <div className="flex flex-col lg:flex-row container-padding gap-6">
      {/* Lista de productos */}
      <section className="flex-1 space-y-4">
        {cart.length === 0 ? (
          <p>
            Tu carrito está vacío.{" "}
            <Link href="/" className="text-blue-600">
              Volver al catálogo
            </Link>
          </p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.productId} className="flex items-center bg-gray-100 p-4 rounded-xl">
                <img
                  src={item.image_producto}
                  alt={item.nombre}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.nombre}</h3>
                  <p className="text-sm text-gray-600">{item.descripcion}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => updateQuantity(item.productId, item.cantidad + 1)}>
                    ＋
                  </button>
                </div>
                <span className="ml-6 font-semibold">{formatPrice(item.precio)}</span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-4"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Resumen de la compra */}
      <aside className="w-full lg:w-1/3 p-6 border rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <hr className="my-4"/>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          onClick={() => {
            /* TODO: invocar tu API de checkout aquí */
          }}
          className="mt-6 w-full py-3 bg-red-600 text-white rounded-lg"
        >
          Comprar
        </button>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="mt-2 text-sm text-gray-500 hover:underline"
          >
            Vaciar carrito
          </button>
        )}
      </aside>
    </div>
  );
}
