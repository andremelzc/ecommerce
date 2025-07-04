// app/meteto-pago/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreditCard } from "lucide-react";
import {
  getTarjetas,
  saveTarjeta,
  deleteTarjeta,
  SaveTarjetaParams,
} from "@/app/utils/tarjetaActions";
import FormularioMetodoPago from "@/app/components/ui/FormularioMetodoPago";
import { MetodoPagoRow } from "@/app/types/metodoPago";

export default function MisMetodosPagoPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id as number | undefined;

  const [tarjetas, setTarjetas] = useState<MetodoPagoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarjeta, setEditTarjeta] = useState<SaveTarjetaParams | null>(
    null
  );

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getTarjetas(userId)
      .then((data) => setTarjetas(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Cargando métodos de pago…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const formatCard = (t: MetodoPagoRow) =>
    `${t.tipo || "Tarjeta"} •••• ${t.numero_cuenta.slice(
      -4
    )} – ${t.fecha_vencimiento.slice(5, 7)}/${t.fecha_vencimiento
      .slice(0, 4)
      .slice(-2)}`;

  const handleAdd = () => {
    if (!userId) return;
    setEditTarjeta({
      userId,
      tipoPagoId: 0,
      proveedor: "",
      numeroCuenta: "",
      fechaVencimiento: new Date().toISOString().slice(0, 10),
      isPrimary: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (t: MetodoPagoRow) => {
    setEditTarjeta({
      id: t.id,
      userId: t.id_usuario,
      tipoPagoId: t.id_tipo_pago,
      proveedor: t.proveedor,
      numeroCuenta: t.numero_cuenta,
      fechaVencimiento: t.fecha_vencimiento,
      isPrimary: t.es_predeterminado === 1,
    });
    setIsModalOpen(true);
  };

  const onSave = async (tarjeta: SaveTarjetaParams) => {
    try {
      const saved = await saveTarjeta(tarjeta);
      setTarjetas((prev) => {
        // Si este método se guarda como predeterminado, desmarcar todos los demás primero
        if (saved.es_predeterminado === 1) {
          // Asignar '0' al flag predeterminado y forzar tipo con assertion
          const cleared: MetodoPagoRow[] = prev.map(
            (t) => ({ ...t, es_predeterminado: 0 } as MetodoPagoRow)
          );
          const idx = cleared.findIndex((t) => t.id === saved.id);
          if (idx !== -1) {
            cleared[idx] = saved;
            return cleared;
          }
          return [saved, ...cleared];
        }
        // Si no es predeterminado, actualizar o agregar normalmente
        if (tarjeta.id) {
          return prev.map((t) => (t.id === saved.id ? saved : t));
        }
        return [saved, ...prev];
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar este método de pago?")) return;
    const result = await deleteTarjeta(id);
    if (result.ok) {
      setTarjetas((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CreditCard className="text-black-600" size={20} />
        Mis Métodos de Pago
      </h1>

      <div className="space-y-4">
        {tarjetas.length > 0 ? (
          tarjetas.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 
            bg-ebony-50 border border-blue-200 
            rounded-lg shadow 
            hover:bg-ebony-100
            transition-colors duration-200"
            >
              <div>
                <p className="font-medium">{formatCard(t)}</p>
                {t.es_predeterminado === 1 && (
                  <span className="text-sm text-green-500">Principal</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes métodos de pago registrados.</p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Añadir Método
        </button>
      </div>

      {isModalOpen && editTarjeta && (
        <FormularioMetodoPago
          tarjeta={editTarjeta}
          onClose={() => setIsModalOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
