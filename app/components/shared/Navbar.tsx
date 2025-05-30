"use client";
import React, { useState } from "react";
import {
  ShoppingBag,
  Menu,
  User,
  ShoppingCart,
} from "lucide-react";
import Drawer from "../ui/Drawer";
import CartDrawer from "../ui/CartDrawer";
import Searchbar from "@/app/components/ui/Searchbar";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="bg-ebony-950 w-full top-0 left-0 z-50 shadow-lg">
        {/* Using consistent container class - Tailwind v4 */}
        <div className="container-padding">
          <div className="flex items-center justify-between py-6">
            {/* Izquierda */}
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
              <button className="flex items-center gap-4 cursor-pointer" aria-label="Inicio">
                <div className="bg-white flex items-center justify-center rounded-full w-14 h-14">
                  <ShoppingBag className="text-ebony-950" size={40} />
                </div>
                <h1 className="text-white text-2xl font-bold">CompX</h1>
              </button>

              <button
                className="cursor-pointer"
                onClick={() => setDrawerOpen(true)}
                aria-label="Menú"
              >
                <Menu className="text-white" size={40} />
              </button>
            </div>

            {/* Centro */}
            <div className="flex-1 max-w-xl px-4">
              <Searchbar />
            </div>

            {/* Derecha */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                className="flex items-center gap-2 text-white text-lg cursor-pointer p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Mi cuenta"
              >
                <User size={25} />
                <span>Iniciar Sesión</span>
              </button>
              <button
                className="flex items-center gap-2 text-white text-lg cursor-pointer p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Mi cesta"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={25} />
                <span>Mi carrito</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cajones laterales */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;