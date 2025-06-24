"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MapPin } from "lucide-react";
import FormularioDireccion from "../../../components/ui/FormularioDireccion"; // Importa el componente del modal
import { deleteDireccionHandler } from "../../../utils/deleteDireccionHandler";



// Definimos la interfaz para la dirección
interface Direccion {
  id?: number;
  piso: string | null;
  lote: string | null;
  calle: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  codigo_postal: string | null;
  isPrimary: boolean;
}

export default function MisDireccionesPage() {
  const { data: session } = useSession();
  const [directions, setDirections] = useState<Direccion[]>([]); // Estado para las direcciones
  const [loading, setLoading] = useState(true);  // Estado para la carga
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [editDirection, setEditDirection] = useState<Direccion | null>(null); // Dirección a editar

  useEffect(() => {
    if (session?.user?.id) {
      const fetchDirections = async () => {
        try {
          const usuario_id = session.user.id;
          const res = await fetch(`/api/direccion?usuario_id=${usuario_id}`);

          if (res.ok) {
            const data = await res.json();
            setDirections(data);
          } else {
            console.error("Error al obtener las direcciones");
            setError("Error al obtener las direcciones.");
          }
        } catch (error) {
          console.error("Hubo un problema con la solicitud:", error);
          setError("Hubo un problema con la solicitud.");
        } finally {
          setLoading(false);
        }
      };

      fetchDirections();
    }
  }, [session]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const formatAddress = (direction: Direccion) => {
    let address = "";
    if (direction.piso || direction.lote || direction.calle) {
      address += `${direction.piso ? `Piso ${direction.piso}` : ""} ${direction.lote ? `Lote ${direction.lote}` : ""} ${direction.calle ? `Calle ${direction.calle}` : ""}, `;
    }
    address += `${direction.distrito || ""}, ${direction.provincia || ""}, ${direction.departamento || ""}`;
    return address.trim().replace(/,$/, "");
  };

  // Abrir el modal para añadir una nueva dirección
  const handleAddClick = () => {
    setEditDirection({
      id: undefined,
      piso: "",
      lote: "",
      calle: "",
      distrito: "",
      provincia: "",
      departamento: "",
      codigo_postal: "",
      isPrimary: false,
    }); // Resetear la dirección para añadir una nueva
    setIsModalOpen(true); // Abrir el modal
  };

  // Abrir el modal para editar una dirección
  const handleEditClick = (direction: Direccion) => {
    setEditDirection(direction); // Establecer los datos de la dirección para editar
    setIsModalOpen(true); // Abrir el modal
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-red-600" size={28} />
        Mis direcciones
      </h1>

      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">¡Hola! Soy la página de direcciones 📍</p>
        <p className="text-gray-500">Aquí podrás gestionar todas tus direcciones de entrega</p>
      </div>

      <div className="space-y-6">
        {directions.length > 0 ? (
          directions.map((direction) => (
            <div key={direction.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">{formatAddress(direction)}</p>
                {direction.isPrimary && <span className="text-sm text-green-500">Dirección principal</span>}
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEditClick(direction)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                  Editar
                </button>
                <button
                  onClick={async () => {
                    if (!session?.user?.id || !direction.id) return;

                    const confirmacion = confirm("¿Seguro que deseas eliminar esta dirección?");
                    if (!confirmacion) return;

                    const resultado = await deleteDireccionHandler(direction.id, Number(session.user.id));
                    if (resultado.ok) {
                      // Elimina visualmente la dirección de la lista sin recargar
                      setDirections(prev => prev.filter(d => d.id !== direction.id));
                    } else {
                      alert(resultado.mensaje);
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                  >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes direcciones disponibles.</p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleAddClick} className="bg-ebony-900 text-white px-6 py-2 rounded-md hover:bg-ebony-800 cursor-pointer transition-colors">
          Añadir nueva dirección
        </button>
      </div>

      {/* Modal de añadir/editar dirección */}
      {isModalOpen && <FormularioDireccion direccion={editDirection} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
