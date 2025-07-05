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
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [editDirection, setEditDirection] = useState<Direccion | null>(null); // Dirección a editar

  // Función para obtener las direcciones
  const fetchDirections = async () => {
    if (!session?.user?.id) return;

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

  useEffect(() => {
    if (session?.user?.id) {
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
      address += `${direction.piso ? `Piso ${direction.piso}` : ""} ${
        direction.lote ? `Lote ${direction.lote}` : ""
      } ${direction.calle ? `Calle ${direction.calle}` : ""}, `;
    }
    address += `${direction.distrito || ""}, ${direction.provincia || ""}, ${
      direction.departamento || ""
    }`;
    return address.trim().replace(/,$/, "");
  };

  // Función para manejar el cambio de dirección principal
  const handleSetPrimary = async (direction: Direccion) => {
    if (!session?.user?.id || !direction.id) return;

    try {
      const response = await fetch("/api/direccion/set-default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: Number(session.user.id),
          direccion_id: direction.id,
        }),
      });

      if (response.ok) {
        // Actualizar las direcciones después de establecer como principal
        await fetchDirections();
      } else {
        const text = await response.text();
        console.error(
          "Error al establecer dirección principal",
          response.status,
          text
        );
        alert(`Error ${response.status}: ${text}`);
      }
    } catch (error: any) {
      console.error("Error en la solicitud:", error.message ?? error);
      alert(
        "Error al establecer la dirección como principal: " +
          (error.message ?? error)
      );
    }
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

  // Función para cerrar el modal y refrescar las direcciones
  const handleCloseModal = async (shouldRefresh = false) => {
    setIsModalOpen(false);
    setEditDirection(null);
    
    // Si se indica que se debe refrescar, volver a obtener las direcciones
    if (shouldRefresh) {
      setLoading(true);
      await fetchDirections();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-black-600" size={28} />
        Mis direcciones
      </h1>

      <div className="space-y-6">
        {directions.length > 0 ? (
          directions.map((direction) => (
            <div
              key={direction.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="radio"
                      name="direccion_principal"
                      checked={direction.isPrimary}
                      onChange={() => handleSetPrimary(direction)}
                      className="w-4 h-4 text-gray-700 focus:ring-gray-500 border-gray-300"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      {direction.isPrimary
                        ? "Dirección principal"
                        : "Establecer como principal"}
                    </label>
                  </div>

                  <p className="font-medium text-gray-800 mb-1">
                    {formatAddress(direction)}
                  </p>

                  {direction.codigo_postal && (
                    <p className="text-sm text-gray-500">
                      Código postal: {direction.codigo_postal}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditClick(direction)}
                    className="bg-ebony-800 text-white px-4 py-2 rounded-md hover:bg-ebony-900 transition-colors"
                  >
                    Editar
                  </button>

                  <button
                    onClick={async () => {
                      if (!session?.user?.id || !direction.id) return;

                      const confirmacion = confirm(
                        "¿Seguro que deseas eliminar esta dirección?"
                      );
                      if (!confirmacion) return;

                      const resultado = await deleteDireccionHandler(
                        direction.id,
                        Number(session.user.id)
                      );
                      if (resultado.ok) {
                        // Elimina visualmente la dirección de la lista sin recargar
                        setDirections((prev) =>
                          prev.filter((d) => d.id !== direction.id)
                        );
                      } else {
                        alert(resultado.mensaje);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes direcciones disponibles.</p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddClick}
          className="bg-ebony-900 text-white px-6 py-2 rounded-md hover:bg-ebony-800 cursor-pointer transition-colors"
        >
          Añadir nueva dirección
        </button>
      </div>

      {/* Modal de añadir/editar dirección */}
      {isModalOpen && (
        <FormularioDireccion
          direccion={editDirection}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}