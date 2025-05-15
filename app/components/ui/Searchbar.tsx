"use client";
import React from "react";
import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Search } from "lucide-react";
import type { Producto } from "@/app/types/producto";

// Cambiar por un array que venga de la API
const productos: Producto[] = [
  {
    id: 1,
    nombre: "Teclado mecánico compacto 65% con Bluetooth y USB-C",
    descripcion:
      "Teclado mecánico compacto 65% con retroiluminación RGB y conectividad Bluetooth y USB-C. Ideal para gamers y programadores.",
    imagen_producto: "keychron_k6.png",
  },
  {
    id: 2,
    nombre: "Teclado mecánico TKL con retroiluminación RGB",
    descripcion:
      "Teclado mecánico TKL con retroiluminación RGB y conectividad USB-C. Ideal para gamers y programadores.",
    imagen_producto: "keychron_k8.png",
  },
  {
    id: 3,
    nombre: "Teclado mecánico tamaño completo con conectividad inalámbrica",
    descripcion:
      "Teclado mecánico tamaño completo con retroiluminación RGB y conectividad inalámbrica. Ideal para gamers y programadores.",
    imagen_producto: "keychron_k10.png",
  },
];

const Searchbar = () => {
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(
    productos[0]
  );
  const [busqueda, setBusqueda] = useState("");

  // Para probar el producto seleccionado
  const handleSelectedProduct = (producto: Producto | null) => {
    setSelectedProduct(producto);
    console.log(producto);
  };

  // Filtrar los productos según la búsqueda
  const filteredProductos =
    busqueda === ""
      ? productos
      : productos.filter((producto) => {
          return producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
        });

  return (
    <div className="w-full relative">
      {/* Checar el onChange, puede llegar a dar errores en el futuro*/}
      <Combobox<Producto | null>
        value={selectedProduct}
        onChange={handleSelectedProduct}
        onClose={() => setBusqueda("")}
      >
        <div className="relative">
          <ComboboxInput
            className="w-full bg-white h-11 pl-4 border rounded-lg text-ebony-950"
            placeholder="¿Qué estás buscando?"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
            }}
            displayValue={(producto: Producto | null) => producto?.nombre ?? ""}
          />
          <button
            type="button"
            onClick={() => {
              console.log("hola");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
          >
            <Search
              className="text-ebony-950"
              size={30}
            />
          </button>

          <ComboboxOptions className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredProductos.map((producto) => (
              <ComboboxOption key={producto.id} value={producto}>
                {producto.nombre}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};

export default Searchbar;
