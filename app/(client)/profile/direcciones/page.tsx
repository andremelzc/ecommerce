import React from 'react';
import { MapPin } from 'lucide-react';

export default function MisDireccionesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-red-600" size={28} />
        Mis direcciones
      </h1>
      
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">
          ¡Hola! Soy la página de direcciones 📍
        </p>
        <p className="text-gray-500">
          Aquí podrás gestionar todas tus direcciones de entrega
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Próximamente: agregar, editar y eliminar direcciones
        </p>
      </div>
    </div>
  );
}