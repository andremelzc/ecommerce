import React from "react";
import { Menu, Search, User, ShoppingCart } from "lucide-react";
import Searchbar from "@/app/components/ui/Searchbar";

const Navbar = () => {
  return (
    <nav className="bg-ebony-950">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        {/*Izquierda*/}
        <div className="flex items-center space-x-8 sm:space-x-16 lg:space-x-24">
          <h1 className="text-white text-3xl">PCComponentes</h1>
          <Menu className="text-white" size={40} />
        </div>
        {/*Medio*/}
        <div className="flex-1 ml-8 mr-24">
          <Searchbar />
        </div>
        {/*Derecha*/}
        <div className="flex items-center space-x-6">
          <button
            className="flex items-center space-x-2 text-white text-lg cursor-pointer"
            aria-label="Mi cuenta"
          >
            <User className="text-white" size={25} />
            <span>Iniciar Sesión</span>
          </button>
          <button
            className="flex items-center space-x-2 text-white text-lg cursor-pointer"
            aria-label="Mi cesta"
          >
            <ShoppingCart className="text-white" size={25} />
            <span>Mi cesta</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
