"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { X, Trash, SearchX, ShoppingBag } from "lucide-react";
import type { DrawerProps } from "@/app/types/props";
import { createPortal } from "react-dom";
import Link from "next/link";

const CartDrawer = ({ isOpen, onClose }: DrawerProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const cartItems = []; // Cambiar por un array que venga de la API

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
        className="fixed h-full inset-0 flex bg-black/40 flex-1 z-[60]"
        onClick={handleCloseDrawer}
      ></div>
      {/* Panel */}
      <aside>
        <div
          className={`fixed right-0 top-0 w-full max-w-full sm:max-w-sm lg:max-w-lg h-full bg-white shadow-lg z-[70] flex flex-col px-8 py-10 transform transition-transform duration-300 ease-in-out ${
            isAnimating ? "translate-x-0" : "translate-x-full"
          } `}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold pl-2">Mi carrito</h2>
            <button
              className="hover:scale-110 transition-transform cursor-pointer"
              onClick={handleCloseDrawer}
            >
              <X size={30} />
            </button>
          </div>
          {cartItems.length === 0 ? (
            <div className="h-full flex justify-center items-center flex-col gap-4 ">
              <ShoppingBag size={100} strokeWidth={0.8} />
              <p className="font-bold text-lg">Tu carrito está vacío</p>
              <p className="max-w-xs mx-auto px-5 text-center">
                Explora multitud de productos a buen precio desde nuestra página
                principal
              </p>
              <Link href="/cart">
                <button
                  className="bg-ebony-950 text-white  max-w-xs px-4 py-3 rounded-lg hover:bg-ebony-800 transition-colors cursor-pointer"
                  aria-label="Ir a la página de productos"
                >
                  <span className="text-lg">Explorar productos</span>
                </button>
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
};

export default CartDrawer;
