"use client";

import React, { useState, useEffect } from "react";
import { Search, Package, Tag, X, Check, ArrowLeft } from "lucide-react";
import { usePromotion } from "@/app/context/PromotionContext"; // tu hook

interface Categoria {
  id: number;
  nombre: string;
  cantidad_productos?: number;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  sku?: string;
  imagen?: string;
}

export default function PromocionProductSelector() {
  // 1️⃣ contexto para la selección
  const { destino, setDestino } = usePromotion();

  // 2️⃣ estado local para datos a cargar
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos]   = useState<Producto[]>([]);
  const [loading, setLoading]       = useState(true);

  // 3️⃣ búsquedas y UI
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarExclusiones, setMostrarExclusiones] = useState(false);

  // 4️⃣ cargar categorías y productos desde la API
  useEffect(() => {
    async function cargar() {
      setLoading(true);
      try {
        const [r1, r2] = await Promise.all([
          fetch("/api/categorias"),
          fetch("/api/productos"),
        ]);
        setCategorias(await r1.json());
        setProductos(await r2.json());
      } catch {
        alert("Error cargando datos.");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // 5️⃣ Filtrar productos por texto
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  // 6️⃣ Helpers de toggle
  const toggleCategoria = (id: number) => {
    if (destino.tipo !== "CATEGORIA") return;
    const ids = destino.ids.includes(id)
      ? destino.ids.filter((x) => x !== id)
      : [...destino.ids, id];
    setDestino({ tipo: "CATEGORIA", ids });
  };

  const toggleProducto = (id: number) => {
    if (destino.tipo === "PRODUCTO") {
      // selección directa
      const ids = destino.ids.includes(id)
        ? destino.ids.filter((x) => x !== id)
        : [...destino.ids, id];
      setDestino({ tipo: "PRODUCTO", ids });
    } else {
      // exclusiones cuando elegimos por categoría
      const ids = destino.ids.includes(id)
        ? destino.ids.filter((x) => x !== id)
        : [...destino.ids, id];
      setDestino({ tipo: "CATEGORIA", ids });
    }
  };

  // productos que caen en las categorías seleccionadas
  const productosEnCats = productos.filter((p) => {
    const cat = categorias.find((c) => c.nombre === p.categoria);
    return cat && destino.ids.includes(cat.id);
  });

  const isValid = () =>
    destino.ids.length > 0;

  // 7️⃣ navegación de pasos (si tú manejas pasos fuera de aquí)
  const [paso, setPaso] = useState(2); // este selector es el paso 2
  const goBack = () => setPaso(1);
  const goNext = () => {
    if (!isValid()) return alert("Selecciona al menos un ítem.");
    setPaso(3);
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 mx-auto mb-4 border-b-2 border-blue-600 rounded-full" />
        Cargando…
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
      <header className="flex items-center mb-6">
        <button onClick={goBack} className="mr-4">
          <ArrowLeft /> Volver
        </button>
        <h2 className="text-2xl font-bold">Aplicar Promoción</h2>
      </header>

      {/* Tipo */}
      <section className="mb-6">
        <label className="mr-6">
          <input
            type="radio"
            checked={destino.tipo === "CATEGORIA"}
            onChange={() => setDestino({ tipo: "CATEGORIA", ids: [] })}
            className="mr-2"
          />
          <Tag /> Por Categoría
        </label>
        <label>
          <input
            type="radio"
            checked={destino.tipo === "PRODUCTO"}
            onChange={() => setDestino({ tipo: "PRODUCTO", ids: [] })}
            className="mr-2"
          />
          <Package /> Productos Específicos
        </label>
      </section>

      {/* Categorías */}
      {destino.tipo === "CATEGORIA" && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">Selecciona Categorías</h3>
          <div className="grid grid-cols-3 gap-4">
            {categorias.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleCategoria(c.id)}
                className={`p-4 border rounded cursor-pointer ${
                  destino.ids.includes(c.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{c.nombre}</span>
                {destino.ids.includes(c.id) && <Check className="ml-2 inline" />}
                <p className="text-sm text-gray-500">
                  {c.cantidad_productos ?? 0} productos
                </p>
              </div>
            ))}
          </div>

          {/* exclusiones */}
          {destino.ids.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setMostrarExclusiones(!mostrarExclusiones)}
                className="text-sm text-red-600 underline"
              >
                {mostrarExclusiones ? "Ocultar exclusiones" : "Mostrar exclusiones"}
              </button>

              {mostrarExclusiones && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {productosEnCats.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => toggleProducto(p.id)}
                      className={`p-2 border rounded cursor-pointer ${
                        destino.ids.includes(p.id)
                          ? "border-red-500 bg-red-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span>{p.nombre}</span>
                      {destino.ids.includes(p.id) && <X className="ml-1 inline" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Productos específicos */}
      {destino.tipo === "PRODUCTO" && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">Selecciona Productos</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 py-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 max-h-80 overflow-auto">
            {productosFiltrados.map((p) => (
              <div
                key={p.id}
                onClick={() => toggleProducto(p.id)}
                className={`p-4 border rounded cursor-pointer ${
                  destino.ids.includes(p.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{p.nombre}</span>
                <p className="text-sm text-gray-500">${p.precio}</p>
                {destino.ids.includes(p.id) && <Check className="ml-1 inline" />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="flex justify-end space-x-3">
        <button
          onClick={goBack}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Volver
        </button>
        <button
          onClick={goNext}
          disabled={!isValid()}
          className={`px-4 py-2 text-white rounded ${
            isValid() ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      </footer>
    </div>
  );
}
