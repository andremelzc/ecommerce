'use client';

import { useEffect, useState, useRef } from 'react';
import { Promocion } from '@/app/types/promocion';

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
    if (promociones.length === 0) return;

    intervaloRef.current = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % promociones.length);
    }, 4000);

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [promociones]);

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % promociones.length);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev - 1 + promociones.length) % promociones.length);
  };

  if (promociones.length === 0) {
    return <p className="text-center text-gray-500 mt-10">Cargando promociones...</p>;
  }

  const promo = promociones[indiceActual];

  return (
    <div className="relative w-[90vw] h-[70vh] max-w-4xl max-h-[90vh] mx-auto mt-10 select-none font-rubik">
      {/* Contenedor de imagen con 90% ancho y alto relativo al contenedor */}
      <div className="w-full h-full rounded-xl shadow-lg overflow-hidden bg-ebony-50 flex items-center justify-center">
        <img
          src={promo.img_promocional}
          alt={promo.nombre}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Botones a los costados */}
      <button
        onClick={anterior}
        aria-label="Anterior"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-ebony-200 bg-opacity-50 hover:bg-opacity-80 text-ebony-900 rounded-full p-2 shadow-md transition"
      >
        ‹
      </button>
      <button
        onClick={siguiente}
        aria-label="Siguiente"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-ebony-200 bg-opacity-50 hover:bg-opacity-80 text-ebony-900 rounded-full p-2 shadow-md transition"
      >
        ›
      </button>

      {/* Texto descriptivo abajo */}
      <div className="mt-4 text-center">
        <h2 className="text-3xl font-semibold text-ebony-900">{promo.nombre}</h2>
        <p className="mt-2 text-ebony-700 max-w-xl mx-auto">{promo.descripcion}</p>
        <p className="mt-1 text-sm text-ebony-600">
          Vigencia: {new Date(promo.fecha_inicio).toLocaleDateString()} -{' '}
          {new Date(promo.fecha_final).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
