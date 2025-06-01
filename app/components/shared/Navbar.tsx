"use client";
import React, { useState } from "react";
import { ShoppingBag, Menu, User, ShoppingCart, Search } from "lucide-react";
import Drawer from "../ui/Drawer";
import CartDrawer from "../ui/CartDrawer";
import Searchbar from "@/app/components/ui/Searchbar";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="bg-ebony-950 w-full sticky top-0 left-0 z-50 shadow-lg">
        <div className="container-padding">
          <div className="flex items-center justify-between py-3 sm:py-3 lg:py-4">
            {/* Izquierda */}
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
              <button
                className="flex items-center gap-3 sm:gap-4 lg:gap-6 cursor-pointer"
                aria-label="Inicio"
              >
                <div className="bg-white flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14">
                  <ShoppingBag className="text-ebony-950 w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10" />
                </div>
                <h1 className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                  CompX
                </h1>
              </button>

              <button
                className="cursor-pointer"
                onClick={() => setDrawerOpen(true)}
                aria-label="Menú"
              >
                <Menu className="text-white w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10" />
              </button>
            </div>

            {/* Centro - Buscador desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl px-4">
              <Searchbar />
            </div>

            {/* Derecha */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              {/* Botón búsqueda móvil */}
              <button
                className="lg:hidden flex items-center justify-center text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Buscar"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Usuario */}
              <button
                className="flex items-center gap-1 sm:gap-2 text-white text-sm sm:text-base lg:text-lg cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Mi cuenta"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
                <span className="hidden sm:inline lg:inline">
                  Iniciar Sesión
                </span>
              </button>

              {/* Carrito */}
              <button
                className="flex items-center gap-1 sm:gap-2 text-white text-sm sm:text-base lg:text-lg cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Mi cesta"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
                <span className="hidden sm:inline lg:inline">Mi carrito</span>
              </button>
            </div>
          </div>

          {/* Searchbar móvil expandible */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            searchOpen ? "max-h-20 pb-4" : "max-h-0"
          }`}>
            <div className="px-2">
              <Searchbar />
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