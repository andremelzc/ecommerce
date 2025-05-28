'use client';

import { useEffect, useState, useRef } from 'react';
import { Promocion } from '@/app/types/promocion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarruselPromociones() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const res = await fetch('/api/promociones');
        const data = await res.json();
        setPromociones(data);
      } catch (error) {
        console.error('Error al obtener promociones:', error);
      }
    };
    fetchPromociones();
  }, []);

  useEffect(() => {
    if (!promociones.length) return;
    intervaloRef.current = setInterval(
      () => setIndiceActual((prev) => (prev + 1) % promociones.length),
      4000
    );
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [promociones]);

  const siguiente = () =>
    setIndiceActual((prev) => (prev + 1) % promociones.length);
  const anterior = () =>
    setIndiceActual((prev) => (prev - 1 + promociones.length) % promociones.length);

  if (!promociones.length) {
    return <p className="text-center text-gray-500 mt-10">Cargando promociones...</p>;
  }

  const promo = promociones[indiceActual];

  return (
    <div className="w-[90vw] max-w-8xl mx-auto mt-10 select-none font-rubik">
      {/* Título arriba */}
      <h2 className="text-3xl font-semibold text-ebony-900 text-center">
        {promo.nombre}
      </h2>

      <div className="relative mt-4">
        {/* Contenedor con fondo azul */}
        <div className="w-full h-[70vh] max-h-[90vh] rounded-xl shadow-lg overflow-hidden bg-ebony-50 flex items-center justify-center">
          {/* Imagen que llena toda la altura y mantiene relación de aspecto */}
          <img
            src={promo.img_promocional}
            alt={promo.nombre}
            draggable={false}
            className="h-full w-auto object-contain rounded-xl"
            style={{
              maskImage: 'linear-gradient(to bottom, white 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, white 60%, transparent 100%)',
            }}
          />
        </div>

        {/* Flechas fuera del contenedor */}
        <button
          onClick={anterior}
          aria-label="Anterior"
          className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 bg-ebony-200 bg-opacity-50 hover:bg-opacity-80 text-ebony-900 rounded-full p-2 shadow-md transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={siguiente}
          aria-label="Siguiente"
          className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 bg-ebony-200 bg-opacity-50 hover:bg-opacity-80 text-ebony-900 rounded-full p-2 shadow-md transition"
        >
          <ChevronRight size={24} />
        </button>

        {/* Botón "Ver Todo" */}
        <button
          onClick={() => {
            /* Navegar a “Ver Todo” */
          }}
          className="absolute bottom-4 left-4 z-10 bg-ebony-200 bg-opacity-80 hover:bg-opacity-100 text-ebony-900 font-medium rounded-full px-4 py-2 shadow-md transition"
        >
          Ver Todo
        </button>
      </div>

      {/* Descripción y fechas debajo */}
      <div className="mt-4 text-center">
        <p className="text-ebony-700 max-w-xl mx-auto">{promo.descripcion}</p>
        <p className="mt-1 text-sm text-ebony-600">
          Vigencia:{' '}
          {new Date(promo.fecha_inicio).toLocaleDateString()} –{' '}
          {new Date(promo.fecha_final).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
