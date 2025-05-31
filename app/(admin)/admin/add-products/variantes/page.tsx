'use client';

import { useState, useEffect } from 'react';
import { useProduct, ProductoEspecifico } from '@/app/context/ProductContext';

interface Variacion {
  id: number;
  nombre: string;
}

interface ValorVariacion {
  id: number;
  valor: string;
  id_variacion: number;
}

export default function VariantesPage() {
  const { productosEspecificos, setProductosEspecificos, productoGeneral } = useProduct();

  const [variacionesDisponibles, setVariacionesDisponibles] = useState<Variacion[]>([]);
  const [valoresPorVariacion, setValoresPorVariacion] = useState<Record<number, ValorVariacion[]>>({});

  // Estado local para edición y sincronización con contexto
  const [productos, setProductos] = useState<ProductoEspecifico[]>(productosEspecificos);

  useEffect(() => {
    setProductos(productosEspecificos);
  }, [productosEspecificos]);

  // Traer variaciones cuando cambien las categorías
  useEffect(() => {
    const { categoria1, categoria2, categoria3 } = productoGeneral;
    if (!categoria1) return;

    const params = new URLSearchParams();
    params.append('id_categoria_1', categoria1);
    if (categoria2) params.append('id_categoria_2', categoria2);
    if (categoria3) params.append('id_categoria_3', categoria3);

    fetch(`/api/variaciones?${params.toString()}`)
      .then(res => res.json())
      .then((data: Variacion[]) => setVariacionesDisponibles(data))
      .catch(() => setVariacionesDisponibles([]));
  }, [productoGeneral]);

  // Cargar valores para variación
  const cargarValoresVariacion = (tipoNombre: string) => {
    const variacion = variacionesDisponibles.find(v => v.nombre === tipoNombre);
    if (!variacion) return;

    if (!valoresPorVariacion[variacion.id]) {
      fetch(`/api/variacion-valores?id_variacion=${variacion.id}`)
        .then(res => res.json())
        .then((data: ValorVariacion[]) => {
          setValoresPorVariacion(prev => ({ ...prev, [variacion.id]: data }));
        })
        .catch(() => {
          setValoresPorVariacion(prev => ({ ...prev, [variacion.id]: [] }));
        });
    }
  };

  // Manejo cambios productos
  const handleProductoChange = (i: number, field: 'sku' | 'precio' | 'stock' | 'imagen', value: string) => {
    const nuevos = [...productos];
    nuevos[i][field] = value;
    setProductos(nuevos);
    setProductosEspecificos(nuevos);
  };

  // Manejo cambios variaciones
  const handleVariacionChange = (i: number, j: number, field: 'tipo' | 'valor', value: string) => {
    const nuevos = [...productos];
    if (field === 'tipo') {
      nuevos[i].variaciones[j].tipo = value;
      nuevos[i].variaciones[j].valor = '';
      const tipoId = variacionesDisponibles.find(v => v.nombre === value)?.id;
      nuevos[i].variaciones[j].tipoId = tipoId;
      nuevos[i].variaciones[j].id_variacion_opcion = undefined;
      cargarValoresVariacion(value);
    } else {
      nuevos[i].variaciones[j].valor = value;
      const tipoId = nuevos[i].variaciones[j].tipoId;
      if (tipoId && valoresPorVariacion[tipoId]) {
        const opcion = valoresPorVariacion[tipoId].find(val => val.valor === value);
        if (opcion) {
          nuevos[i].variaciones[j].id_variacion_opcion = opcion.id;
        }
      }
    }
    setProductos(nuevos);
    setProductosEspecificos(nuevos);
  };

  // Agregar y eliminar productos específicos
  const agregarProducto = () => {
    if (productos.length < 10) {
      const nuevos = [...productos, { sku: '', precio: '', stock: '', imagen: '', variaciones: [{ tipo: '', valor: '' }] }];
      setProductos(nuevos);
      setProductosEspecificos(nuevos);
    }
  };

  const eliminarProducto = (i: number) => {
    if (productos.length > 1) {
      const nuevos = productos.filter((_, idx) => idx !== i);
      setProductos(nuevos);
      setProductosEspecificos(nuevos);
    }
  };

  // Agregar variación a producto específico
  const agregarVariacion = (i: number) => {
    if (productos[i].variaciones.length < 10) {
      const nuevos = [...productos];
      nuevos[i].variaciones.push({ tipo: '', valor: '' });
      setProductos(nuevos);
      setProductosEspecificos(nuevos);
    }
  };

  // Guardar producto y variaciones (llamada fetch)
  const guardarProducto = async () => {
    try {
      const res = await fetch('/api/productos/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoGeneral,
          productosEspecificos: productos
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Producto guardado correctamente. ID: ${data.idProducto}`);
        // Aquí podrías limpiar el formulario o redirigir
      } else {
        alert('Error al guardar producto: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error en la conexión al guardar el producto.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">Variaciones del producto</h1>

      {productos.map((producto, i) => (
        <div key={i} className="border rounded p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Producto #{i + 1}</h2>
            {productos.length > 1 && (
              <button
                onClick={() => eliminarProducto(i)}
                className="text-red-500 text-sm hover:underline"
              >
                🗑️ Eliminar producto
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="SKU"
            value={producto.sku}
            onChange={e => handleProductoChange(i, 'sku', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            value={producto.precio}
            onChange={e => handleProductoChange(i, 'precio', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={producto.stock}
            onChange={e => handleProductoChange(i, 'stock', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="url"
            placeholder="Imagen (URL)"
            value={producto.imagen}
            onChange={e => handleProductoChange(i, 'imagen', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="space-y-4">
            {producto.variaciones.map((v, j) => {
              const variacionSeleccionada = variacionesDisponibles.find(vari => vari.nombre === v.tipo);
              const valores = variacionSeleccionada ? valoresPorVariacion[variacionSeleccionada.id] || [] : [];

              return (
                <div key={j}>
                  <div className="flex gap-4">
                    <select
                      value={v.tipo}
                      onChange={e => handleVariacionChange(i, j, 'tipo', e.target.value)}
                      className="w-1/2 border px-3 py-2 rounded"
                    >
                      <option value="">Selecciona una variación</option>
                      {variacionesDisponibles.map(variacion => (
                        <option key={variacion.id} value={variacion.nombre}>
                          {variacion.nombre}
                        </option>
                      ))}
                    </select>

                    {valores.length > 0 && (
                      <select
                        value={v.valor}
                        onChange={e => handleVariacionChange(i, j, 'valor', e.target.value)}
                        className="w-1/2 border px-3 py-2 rounded"
                      >
                        <option value="">Selecciona un valor</option>
                        {valores.map(valor => (
                          <option key={valor.id} value={valor.valor}>
                            {valor.valor}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}

            {producto.variaciones.length < 10 && (
              <button
                onClick={() => agregarVariacion(i)}
                className="text-sm text-blue-600 hover:underline"
              >
                ➕ Agregar variación
              </button>
            )}
          </div>
        </div>
      ))}

      {productos.length < 10 && (
        <button
          onClick={agregarProducto}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Agregar otro producto específico
        </button>
      )}

      {/* Botón para guardar todo */}
      <button
        onClick={guardarProducto}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
      >
        Guardar producto
      </button>
    </div>
  );
}
