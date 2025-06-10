"use client";
import React, { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import type { DrawerProps } from "@/app/types/props";

const CartDrawer = ({ isOpen, onClose }: DrawerProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const subtotal = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const handleCloseDrawer = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed h-full inset-0 bg-black/40 z-[60]"
        onClick={handleCloseDrawer}
      ></div>

      {/* Panel */}
      <aside>
        <div
          className={`fixed right-0 top-0 w-full max-w-full sm:max-w-sm lg:max-w-lg h-full bg-white shadow-lg z-[70] flex flex-col px-6 py-8 transform transition-transform duration-300 ease-in-out ${
            isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Mi carrito</h2>
            <button
              className="hover:scale-110 transition-transform"
              onClick={handleCloseDrawer}
            >
              <X size={28} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="h-full flex justify-center items-center flex-col gap-4">
              <ShoppingBag size={80} strokeWidth={1} />
              <p className="font-bold text-lg">Tu carrito está vacío</p>
              <p className="text-center text-sm px-4">
                Explora productos desde nuestra página principal
              </p>
              <Link href="/">
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                  Explorar productos
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Productos del carrito */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <Link href={`/productos/${item.productId}`} prefetch={true}>
                        <img
                          src={item.image_producto}
                          alt={item.nombre}
                          className="w-full h-full object-contain rounded-md"
                        />
                      </Link>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.nombre}</h3>
                      <p className="text-xs text-gray-500">{item.descripcion}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="text-sm font-medium">{item.cantidad}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.cantidad + 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold block">
                        {formatPrice(item.precio)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-1 p-1 hover:bg-red-100 rounded-full"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-base">Subtotal</span>
                  <span className="text-base font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <Link href="/cart">
                  <button className="mt-4 w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Ir al carrito
                  </button>
                </Link>
                <button
                  onClick={clearCart}
                  className="mt-3 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
};

export default CartDrawer;
