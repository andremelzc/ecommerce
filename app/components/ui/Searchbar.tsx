"use client";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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

const Searchbar = () => {
  const router = useRouter(); // Para redireccionar a la página de productos
  const [productos, setProductos] = useState<Producto[]>([]); // Para almacenar los productos obtenidos de la API
  const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga
  const [isError, setIsError] = useState(false); // Para manejar errores al obtener productos

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Manejar selección de producto con navegación
  const handleSelectedProduct = (producto: Producto | null) => {
    if (producto) {
      setSelectedProduct(producto);
      console.log(producto);
      setBusqueda("");
      // Redireccionar a la página del producto seleccionado
      router.push(`/productos/${producto.producto_id}`);
    }
  };

  // Filtrar los productos según la búsqueda
  const filteredProductos = useMemo(
    () =>
      busqueda === ""
        ? productos
        : productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
          ),
    [productos, busqueda]
  );

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

          <ComboboxOptions className="flex flex-col absolute z-10 w-full bg-white rounded-lg shadow-lg max-h-60 p-5 gap-2 top-full mt-2 overflow-auto">
            {busqueda === "" ? (
              <div>
                <p className="text-gray-600 text-sm font-bold">Ingrese algo</p>
              </div>
            ) : filteredProductos.length > 0 ? (
              <div className="flex flex-col gap-4">
                <p className="text-ebony-900 text-sm font-bold">
                  Productos para "{busqueda}" ({filteredProductos.length})
                </p>
                {filteredProductos.slice(0, 3).map((producto) => (
                  <ComboboxOption
                    key={producto.producto_id}
                    value={producto}
                    className="flex rounded-lg cursor-pointer items-center gap-4 px-2 py-1 hover:bg-gray-200"
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
