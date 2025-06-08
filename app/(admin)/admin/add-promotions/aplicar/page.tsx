"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Tag,
  X,
  Check,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { usePromotion } from "@/app/context/PromotionContext"; // tu hook

interface Subcategoria {
  id: number;
  nombre: string;
  subcategorias?: Subcategoria[];
}

interface Categoria {
  id: number;
  nombre: string;
  cantidad_productos?: number;
  subcategorias?: Subcategoria[];
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
  const {
    destino,
    setDestino,
    subcategoriasSeleccionadas,
    setSubcategoriasSeleccionadas,
    promotionDraft,
  } = usePromotion();

  // 2️⃣ estado local para datos a cargar
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // 3️⃣ búsquedas y UI
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarExclusiones, setMostrarExclusiones] = useState(false);

  // 4️⃣ estado para categorías expandidas
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Set<number>>(
    new Set()
  );

  // 5️⃣ Estados para confirmación y envío
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // 6️⃣ cargar categorías y productos desde la API
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

  // 7️⃣ Filtrar productos por texto
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  // 8️⃣ Helpers de toggle
  const toggleCategoria = (id: number) => {
    if (destino.tipo !== "CATEGORIA") return;

    // Solo toggle expansión de la categoría, NO la selección
    const nuevasExpandidas = new Set(categoriasExpandidas);
    if (nuevasExpandidas.has(id)) {
      nuevasExpandidas.delete(id);
    } else {
      nuevasExpandidas.add(id);
    }
    setCategoriasExpandidas(nuevasExpandidas);
  };

  const toggleSubcategoria = (subcategoriaId: number) => {
    const nuevasSubcategorias = new Set(subcategoriasSeleccionadas);
    if (nuevasSubcategorias.has(subcategoriaId)) {
      nuevasSubcategorias.delete(subcategoriaId);
    } else {
      nuevasSubcategorias.add(subcategoriaId);
    }
    setSubcategoriasSeleccionadas(nuevasSubcategorias);
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

  // Función para renderizar solo subcategorías de nivel 2
  const renderSubcategorias = (
    subcategorias: Subcategoria[],
    categoriaId: number
  ) => {
    return subcategorias.map((sub) => {
      return (
        <div key={`sub-${sub.id}`}>
          <div
            onClick={() => toggleSubcategoria(sub.id)}
            className={`p-3 border rounded cursor-pointer mb-2 ${
              subcategoriasSeleccionadas.has(sub.id)
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{sub.nombre}</span>
              {subcategoriasSeleccionadas.has(sub.id) && (
                <Check className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  // Función helper para encontrar una subcategoría por ID en todas las categorías
  const encontrarSubcategoria = (subcategoriaId: number) => {
    for (const categoria of categorias) {
      if (categoria.subcategorias) {
        const subcategoria = categoria.subcategorias.find(
          (s) => s.id === subcategoriaId
        );
        if (subcategoria) {
          return { subcategoria, categoria };
        }
      }
    }
    return null;
  };

  // productos que caen en las categorías seleccionadas
  const productosEnCats = productos.filter((p) => {
    const cat = categorias.find((c) => c.nombre === p.categoria);
    return cat && destino.ids.includes(cat.id);
  });

  const isValid = () =>
    (destino.tipo === "PRODUCTO" && destino.ids.length > 0) ||
    (destino.tipo === "CATEGORIA" && subcategoriasSeleccionadas.size > 0);

  // 9️⃣ navegación de pasos (si tú manejas pasos fuera de aquí)
  const [paso, setPaso] = useState(2); // este selector es el paso 2
  const goBack = () => setPaso(1);

  // Función para preparar datos de confirmación
  const prepararDatosConfirmacion = () => {
    // Obtener nombres de subcategorías seleccionadas
    const subcategoriasConNombres = Array.from(subcategoriasSeleccionadas)
      .map((subcategoriaId) => {
        const resultado = encontrarSubcategoria(subcategoriaId);
        return resultado
          ? {
              id: subcategoriaId,
              nombre: resultado.subcategoria.nombre,
              categoria_padre: resultado.categoria.nombre,
            }
          : null;
      })
      .filter(Boolean);

    // NOTA: destino.ids actualmente se usa para:
    // - Si tipo === "PRODUCTO": IDs de productos seleccionados
    // - Si tipo === "CATEGORIA": Parece que no se usa para categorías principales
    //   porque la selección real está en subcategoriasSeleccionadas

    // Obtener productos seleccionados (cuando tipo === "PRODUCTO")
    const productosSeleccionados =
      destino.tipo === "PRODUCTO"
        ? destino.ids
            .map((prodId) => {
              const prod = productos.find((p) => p.id === prodId);
              return prod
                ? { id: prodId, nombre: prod.nombre, precio: prod.precio }
                : null;
            })
            .filter(Boolean)
        : [];

    return {
      subcategoriasConNombres,
      productosSeleccionados,
    };
  };

  const goNext = () => {
    if (!isValid()) return alert("Selecciona al menos un ítem.");
    setMostrarConfirmacion(true);
  };

  // Función para confirmar y enviar
  const confirmarYEnviar = async () => {
    setEnviando(true);

    const { subcategoriasConNombres, productosSeleccionados } =
      prepararDatosConfirmacion();

    console.log("=== INFORMACIÓN COMPLETA DE LA PROMOCIÓN ===");
    console.log("📝 Datos básicos:");
    console.log("  - Nombre:", promotionDraft.nombre);
    console.log("  - Descripción:", promotionDraft.descripcion);
    console.log("  - Imagen:", promotionDraft.img_promocional);
    console.log("  - Fecha inicio:", promotionDraft.fecha_inicio);
    console.log("  - Fecha fin:", promotionDraft.fecha_fin);
    console.log(
      "  - Porcentaje descuento:",
      promotionDraft.porcentaje_descuento
    );

    console.log("\n🎯 Aplicación:");
    console.log("  - Tipo:", destino.tipo);

    if (destino.tipo === "CATEGORIA") {
      if (subcategoriasConNombres.length > 0) {
        console.log("  - Categorías seleccionadas:", subcategoriasConNombres);
      }
      if (subcategoriasConNombres.length > 0) {
        console.log(
          "  - Subcategorías seleccionadas:",
          subcategoriasConNombres
        );
      }
    } else {
      console.log("  - Productos seleccionados:", productosSeleccionados);
    }

    console.log("\n📊 Resumen IDs:");
    console.log("  - IDs destino:", destino.ids);
    console.log(
      "  - IDs subcategorías:",
      Array.from(subcategoriasSeleccionadas)
    );

    // Simular envío
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simular delay

      // Aquí iría tu llamada real a la API
      // const response = await fetch('/api/promociones', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...promotionDraft,
      //     destino,
      //     subcategorias: Array.from(subcategoriasSeleccionadas)
      //   })
      // });

      const response = await fetch("/api/promociones/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: promotionDraft.nombre,
          descripcion: promotionDraft.descripcion,
          fecha_inicio: promotionDraft.fecha_inicio,
          fecha_fin: promotionDraft.fecha_fin,
          img_promocional: promotionDraft.img_promocional,
          porcentaje_descuento: promotionDraft.porcentaje_descuento,
          destino,
          subcategorias: Array.from(subcategoriasSeleccionadas),
        }),
      });

      setEnviado(true);
      setTimeout(() => {
        setMostrarConfirmacion(false);
        setPaso(3);
      }, 1500);
    } catch (error) {
      alert("Error al crear la promoción");
    } finally {
      setEnviando(false);
    }
  };

  // Función para limpiar selecciones al cambiar de tipo
  const handleTipoChange = (nuevoTipo: "CATEGORIA" | "PRODUCTO") => {
    setDestino({ tipo: nuevoTipo, ids: [] });
    if (nuevoTipo === "PRODUCTO") {
      // Limpiar subcategorías cuando cambiamos a productos específicos
      setSubcategoriasSeleccionadas(new Set());
    }
    setCategoriasExpandidas(new Set());
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 mx-auto mb-4 border-b-2 border-blue-600 rounded-full" />
        Cargando…
      </div>
    );

  const { subcategoriasConNombres, productosSeleccionados } =
    prepararDatosConfirmacion();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
      <header className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">
          Seleccionar Productos para la Promoción
        </h2>
      </header>

      {/* Tipo */}
      <section className="flex mb-6 gap-4">
        <label className="flex items-center mr-6 gap-2">
          <input
            type="radio"
            checked={destino.tipo === "CATEGORIA"}
            onChange={() => handleTipoChange("CATEGORIA")}
            className="mr-2"
          />
          <Tag /> Por Categoría
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={destino.tipo === "PRODUCTO"}
            onChange={() => handleTipoChange("PRODUCTO")}
            className="mr-2"
          />
          <Package /> Productos Específicos
        </label>
      </section>

      {/* Categorías */}
      {destino.tipo === "CATEGORIA" && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">Selecciona Categorías</h3>
          <div className="space-y-0">
            {categorias.map((c) => (
              <div key={c.id} className="rounded-lg p-4">
                {/* Categoría principal */}
                <div
                  onClick={() => toggleCategoria(c.id)}
                  className={`p-4 border rounded cursor-pointer flex items-center justify-between ${
                    categoriasExpandidas.has(c.id)
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    {c.subcategorias &&
                      c.subcategorias.length > 0 &&
                      (categoriasExpandidas.has(c.id) ? (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      ))}
                    <span className="font-medium">{c.nombre}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {c.cantidad_productos ?? 0} productos
                  </p>
                </div>

                {/* Subcategorías */}
                {categoriasExpandidas.has(c.id) &&
                  c.subcategorias &&
                  c.subcategorias.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Subcategorías:
                      </h4>
                      {renderSubcategorias(c.subcategorias, c.id)}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Resumen de selecciones */}
          {subcategoriasSeleccionadas.size > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Subcategorías seleccionadas:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(subcategoriasSeleccionadas).map(
                  (subcategoriaId) => {
                    const resultado = encontrarSubcategoria(subcategoriaId);
                    if (!resultado) return null;

                    return (
                      <span
                        key={subcategoriaId}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                      >
                        {resultado.subcategoria.nombre}
                      </span>
                    );
                  }
                )}
              </div>
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
                {destino.ids.includes(p.id) && (
                  <Check className="ml-1 inline" />
                )}
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

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {!enviado ? (
              <>
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
                  <h3 className="text-xl font-bold">
                    Confirmar Creación de Promoción
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Datos básicos */}
                  <div className="border rounded p-4">
                    <h4 className="font-semibold mb-2 text-blue-600">
                      📝 Datos Básicos
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Nombre:</strong> {promotionDraft.nombre}
                      </div>
                      <div>
                        <strong>Descripción:</strong>{" "}
                        {promotionDraft.descripcion}
                      </div>
                      <div>
                        <strong>Imagen:</strong>{" "}
                        {promotionDraft.img_promocional || "No especificada"}
                      </div>
                      <div>
                        <strong>Fecha inicio:</strong>{" "}
                        {promotionDraft.fecha_inicio}
                      </div>
                      <div>
                        <strong>Fecha fin:</strong> {promotionDraft.fecha_fin}
                      </div>
                      <div>
                        <strong>Porcentaje descuento:</strong>{" "}
                        {promotionDraft.porcentaje_descuento}%
                      </div>
                    </div>
                  </div>

                  {/* Aplicación */}
                  <div className="border rounded p-4">
                    <h4 className="font-semibold mb-2 text-green-600">
                      🎯 Aplicación
                    </h4>
                    <div className="text-sm">
                      <div className="mb-2">
                        <strong>Tipo:</strong>{" "}
                        {destino.tipo === "CATEGORIA"
                          ? "Por Categoría"
                          : "Productos Específicos"}
                      </div>

                      {destino.tipo === "CATEGORIA" && (
                        <>
                          {subcategoriasConNombres.length > 0 && (
                            <div>
                              <strong>Subcategorías seleccionadas:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {subcategoriasConNombres.map((sub) => (
                                  <span
                                    key={sub!.id}
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                                  >
                                    {sub!.nombre} ({sub!.categoria_padre})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {destino.tipo === "PRODUCTO" &&
                        productosSeleccionados.length > 0 && (
                          <div>
                            <strong>Productos seleccionados:</strong>
                            <div className="mt-1 space-y-1">
                              {productosSeleccionados.map((prod) => (
                                <div
                                  key={prod!.id}
                                  className="flex justify-between text-xs bg-gray-50 p-2 rounded"
                                >
                                  <span>{prod!.nombre}</span>
                                  <span className="font-medium">
                                    ${prod!.precio}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Resumen IDs */}
                  <div className="border rounded p-4">
                    <h4 className="font-semibold mb-2 text-purple-600">
                      📊 Resumen Técnico
                    </h4>
                    <div className="text-sm">
                      {destino.ids.length > 0 && (
                        <div className="mb-2">
                          <strong>IDs seleccionados:</strong>{" "}
                          {destino.ids.join(", ")}
                        </div>
                      )}
                      {subcategoriasSeleccionadas.size > 0 && (
                        <div className="mb-2">
                          <strong>Subcategorías seleccionadas:</strong>{" "}
                          {Array.from(subcategoriasSeleccionadas).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setMostrarConfirmacion(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarYEnviar}
                    disabled={enviando}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                  >
                    {enviando ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full" />
                        Creando...
                      </>
                    ) : (
                      "Confirmar y Crear Promoción"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  ¡Promoción Creada Exitosamente!
                </h3>
                <p className="text-gray-600">
                  La promoción ha sido guardada correctamente.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
