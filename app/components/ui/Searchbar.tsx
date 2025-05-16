"use client";
import React from "react";
import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
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
            className="w-full bg-white h-11 pl-4 border rounded-lg outline-none text-ebony-950 focus:shadow-lg focus:border-ebony-950"
            placeholder="¿Qué estás buscando?"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
            }}
            displayValue={(producto: Producto | null) => producto?.nombre ?? ""}
          />
          <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hover:scale-110 transition-transform cursor-pointer">
            <Search className="text-ebony-950" size={30} />
          </ComboboxButton>

          <ComboboxOptions className="flex flex-col absolute z-10 w-full bg-white rounded-lg shadow-lg max-h-60 p-4 gap-2 top-full mt-2 overflow-auto">
            {busqueda === "" ? (
              <div>
                <p className="text-ebony-900 text-sm font-bold">
                  Términos más buscados
                </p>
              </div>
            ) : filteredProductos.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-ebony-900 text-sm font-bold">
                  Productos para {busqueda}
                </p>
                {filteredProductos.map((producto) => (
                  <ComboboxOption
                    key={producto.id}
                    value={producto}
                    className="flex rounded-lg cursor-pointer items-center  hover:bg-gray-200"
                  >
                    <img
                      src={producto.imagen_producto}
                      alt="."
                      className="h-6 w-6 rounded"
                    ></img>
                    <span>{producto.nombre}</span>
                  </ComboboxOption>
                ))}
                <a href="/productos" className="text-center underline">
                  Ver todos los {filteredProductos.length} productos
                </a>
              </div>
            ) : (
              <div>
                <p className="text-ebony-900 text-sm font-bold">
                  Sin sugerencias
                </p>
              </div>
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};

export default Searchbar;
