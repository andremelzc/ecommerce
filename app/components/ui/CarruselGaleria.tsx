'use client';

import { useEffect, useState } from 'react';
import { Producto } from '@/app/types/producto';

export default function CarruselGaleria() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % productos.length);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev - 1 + productos.length) % productos.length);
  };

  if (productos.length === 0) {
    return <p>Cargando productos...</p>;
  }

  const producto = productos[indiceActual];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <img src={producto.imagen_producto} alt={producto.nombre} className="w-64 h-64 object-cover rounded-lg shadow" />
      <h2 className="text-xl font-bold">{producto.nombre}</h2>
      <p className="text-gray-600">{producto.descripcion}</p>
      <div className="flex gap-4 mt-2">
        <button onClick={anterior} className="px-4 py-2 bg-blue-500 text-white rounded">Anterior</button>
        <button onClick={siguiente} className="px-4 py-2 bg-blue-500 text-white rounded">Siguiente</button>
      </div>
    </div>
  );
}
