"use client";
import React from "react";
import { useState } from "react";
import { X, Trash, SearchX } from "lucide-react";
import type { DrawerProps } from "@/app/types/props";
import { createPortal } from "react-dom";

const CartDrawer = ({ isOpen, onClose }: DrawerProps) => {
  const cartItems = []; // Cambiar por un array que venga de la API
  const handleCloseDrawer = () => {
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed h-full inset-0 flex bg-black/40 flex-1 z-20"
        onClick={handleCloseDrawer}
      ></div>
      {/* Panel */}
      <aside>
        <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-30 flex flex-col px-8 py-10 px-8 py-10 shadow-lg flex flex-col">
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
            <div className="flex py-10 justify-center items-center flex-col gap-4 ">
              <SearchX size={100} strokeWidth={0.8}/>
              <p className="font-bold text-lg">Tu carrito está vacío</p>
              <p className="px-5 text-center">Explora multitud de productos a buen precio desde nuestra página principal</p>
              <button className="bg-ebony-950 text-white w-[calc(100%-3rem)] max-w-xs px-4 py-3 rounded-lg hover:bg-ebony-800 transition-colors cursor-pointer">
                <span className="text-lg">Explorar productos</span>
              </button>
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
