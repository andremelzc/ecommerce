// /app/components/ui/VariationBox.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CategoryBox from "@/app/components/ui/CategoryBox"; // Ajusta esta ruta si tu CategoryBox está en otro sitio
import { Categoria, Variacion, Valor } from "@/app/types/valorVariacion";

// Interfaces 
interface VariationBoxProps {
  categoryLevel: number;
  categoryId: number;
  setSelectedVariations: React.Dispatch<React.SetStateAction<number[]>>; // Para pasar las variaciones seleccionadas al parent
}

const VariationBox: React.FC<VariationBoxProps> = ({ categoryLevel, categoryId, setSelectedVariations }) => {
  const [variations, setVariations] = useState<Variacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar cuáles variaciones están “abiertas” (colapsadas) en el UI
  const [openVars, setOpenVars] = useState<{ [key: number]: boolean }>({});
  const [selectedValues, setSelectedValues] = useState<{ [key: number]: number | undefined }>({});
  
  useEffect(() => {
    async function fetchVariations() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/variacion/${categoryLevel}/${categoryId}`
        );
        if (!res.ok) {
          throw new Error("Error al cargar variaciones");
        }
        const data: Categoria[] = await res.json();
        // Si la API devuelve al menos un objeto, tomamos data[0].variaciones
        if (Array.isArray(data) && data.length > 0) {
          setVariations(data[0].variaciones);
        } else {
          setVariations([]);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar variaciones");
        setVariations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVariations();
  }, [categoryLevel, categoryId]);

  const toggle = (id: number) => {
    setOpenVars((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVariationSelect = (variacionId: number, valueId: number) => {
    setSelectedVariations((prev) => {
      // Si el valor ya está seleccionado, lo deseleccionamos (undefined), sino lo seleccionamos
        const newValue = prev[variacionId] === valueId ? undefined : valueId;
      // Creamos el nuevo estado de selecciones
        const newSelections = {
          ...prev,
          [variacionId]: newValue
        };
        // Convertimos a array de IDs para el componente padre
        const selectedIds = Object.values(newSelections)
          .filter((val): val is number => val !== undefined);
        
        setSelectedVariations(selectedIds);
        
        return newSelections;
    });
  };

  // ● Mientras carga, mostramos un “Cargando…”
  if (loading) {
    return (
      <aside className="w-64 p-4 bg-white border-r border-gray-200">
        <div className="text-center">Cargando variaciones…</div>
      </aside>
    );
  }

  // ● Si hubo error de fetch, mostramos el mensaje (podrías reemplazar con otro UI más elaborado)
  if (error) {
    return (
      <aside className="w-64 p-4 bg-white border-r border-gray-200">
        <div className="text-red-500 text-sm text-center">{error}</div>
      </aside>
    );
  }

  // ● Si no hay variaciones (array vacío), renderizamos CategoryBox en su lugar
  if (variations.length === 0) {
    return <CategoryBox />;
  }

  // ● Si hay variaciones, las presentamos
  return (
    <aside className="w-64 p-4 bg-white border-r border-gray-200">
      <h2 className="text-white bg-red-600 px-2 py-1 font-bold mb-4">
        Variaciones
      </h2>
      {variations.map((vario) => (
        <div key={vario.id_variacion} className="mb-4">
          {/* Título colapsable */}
          <button
            onClick={() => toggle(vario.id_variacion)}
            className="flex justify-between items-center w-full text-left font-semibold"
          >
            {vario.nombre_variacion}{" "}
            {openVars[vario.id_variacion] ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {/* Lista de valores con checkboxes, solo si está “abierto” */}
          {openVars[vario.id_variacion] && (
            <ul className="mt-2 ml-2 space-y-1">
              {vario.valores.map((val) => (
                <li key={val.id_valor} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`val-${val.id_valor}`}
                    className="mr-2 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    onChange={() => handleVariationSelect(val.id_valor)}
                  />
                  <label
                    htmlFor={`val-${val.id_valor}`}
                    className="text-sm text-gray-700"
                  >
                    {val.nombre_valor}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
};

export default VariationBox;
