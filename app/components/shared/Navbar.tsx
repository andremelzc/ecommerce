"use client";
import React, { useState } from "react";
import {
  Package,
  ShoppingBag,
  Tag,
  Menu,
  Search,
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
      <nav className="bg-ebony-950">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          {/*Izquierda*/}
          <div className="flex items-center space-x-8 sm:space-x-16 lg:space-x-24">
            <button className="flex space-x-4 items-center cursor-pointer">
              <div className="bg-white flex space-x-4 rounded-full w-14 h-14 items-center justify-center">
                <ShoppingBag className="text-ebony-950" size={40} />
              </div>
              <h1 className="text-white text-2xl font-bold">CompX</h1>
            </button>

            <button
              className="cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="text-white" size={40} />
            </button>
          </div>
          {/*Medio*/}
          <div className="flex-1 ml-8 mr-24 sm:mr-16 lg:mr-8">
            <Searchbar />
          </div>
          {/*Derecha*/}
          <div className="flex items-center space-x-6">
            <button
              className="flex items-center space-x-2 text-white text-lg cursor-pointer p-2 hover:bg-gray-800 rounded-lg "
              aria-label="Mi cuenta"
            >
              <User className="text-white" size={25} />
              <span>Iniciar Sesión</span>
            </button>
            <button
              className="flex items-center space-x-2 text-white p-2 text-lg cursor-pointer hover:bg-gray-800 rounded-lg"
              aria-label="Mi cesta"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="text-white" size={25} />
              <span>Mi carrito</span>
            </button>
          </div>
        </div>
      </nav>
      {/* Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
