'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/app/context/CartContext';
import { useCheckout } from '@/app/context/CheckoutContext';
import { enviarDatosBoletaApi } from '@/lib/boleta';
import { ItemPayload, GenerarBoletaPayload } from "@/app/types/GenerarBoletaPayload";

export function useBoleta() {
  const { data: session } = useSession();
  const { cart, clearCart } = useCart();
  const { orden } = useCheckout();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function generar() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!session?.user?.id) {
      setError('Debes iniciar sesión para continuar.');
      setLoading(false);
      return;
    }

    // Prueba manual: asigna aquí tus valores
    const usuarioId        = 3;
    const metodoPagoId     = 1;
    const direccionEnvioId = 2;
    const metodoEnvioId    = 1;
    const estadoOrdenId    = 1;

    // Descomenta para volver al valor real
    // const usuarioId        = session?.user.id!;
    // const {
    //   metodoPagoId     = null,
    //   direccionEnvioId = null,
    //   metodoEnvioId    = null,
    //   estadoOrdenId    = null,
    //   subtotal         = 0,
    //   costoEnvio       = 0,
    //   total            = 0
    // } = orden;

    // Para el subtotal, costoEnvio y total, puedes seguir usando orden o hardcodearlos igual:
    const subtotal   = orden.subtotal   ?? 0;
    const costoEnvio = orden.costoEnvio ?? 0;
    const total      = orden.total      ?? 0;

    // Prepara los items
    const items: ItemPayload[] = cart.map(i => ({
      nombre:         i.nombre,
      cantidad:       i.cantidad,
      precioUnitario: typeof i.precio === 'string'
        ? parseFloat(i.precio)
        : i.precio,
    }));

    // Construye el payload con valores de prueba
    const payload: GenerarBoletaPayload = {
      usuarioId:        session.user.id!,
      metodoPagoId,
      direccionEnvioId,
      metodoEnvioId,
      estadoOrdenId:1,
      items,
      subtotal,
      costoEnvio,
      total: subtotal + costoEnvio,
    };

    try {
      await enviarDatosBoletaApi(payload);
      setSuccess(true);
      //clearCart();
    } catch (err: any) {
      setError(err.message || 'Error generando boleta');
    } finally {
      setLoading(false);
    }
  }

  return { generar, loading, error, success };
}
