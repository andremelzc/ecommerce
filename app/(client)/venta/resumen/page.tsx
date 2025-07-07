'use client';

import React from 'react';
import { useCheckout } from '@/app/context/CheckoutContext';
import { useBoleta } from '@/app/hooks/useBoleta';

export default function ResumenPage() {
  const { orden } = useCheckout();
  const { generar, loading, error, success } = useBoleta();

  // Valores seguros con default 0
  const subtotal   = orden.subtotal   ?? 0;
  const costoEnvio = orden.costoEnvio ?? 0;
  const total      = orden.total      ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ebony-50 to-ebony-100/30 py-4 sm:py-6">
      {/* Debug: mostrar datos del context de checkout */}
      <pre className="bg-yellow-50 text-xs text-yellow-900 border border-yellow-200 rounded p-2 mb-4 overflow-x-auto">
        <strong>orden (CheckoutContext):</strong>
        {'\n'}{JSON.stringify(orden, null, 2)}
      </pre>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ebony-900 mb-6">
          Resumen de la compra
        </h1>
        <pre className="bg-gray-50 text-xs text-gray-900 border border-gray-200 rounded p-2 mb-4 overflow-x-auto">
          {JSON.stringify(orden, null, 2)}
        </pre>
      </div>

      {/* Nuevo bloque: detalle y botón de envío de boleta */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 bg-white border border-gray-200 rounded p-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Detalles de Pedido
        </h2>
        <p><strong>Subtotal:</strong> S/ {subtotal.toFixed(2)}</p>
        <p><strong>Costo de envío:</strong> S/ {costoEnvio.toFixed(2)}</p>
        <p><strong>Total:</strong> S/ {total.toFixed(2)}</p>

        <button
          onClick={generar}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {loading ? 'Procesando…' : 'Confirmar compra'}
        </button>

        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mt-2">Boleta enviada con éxito.</p>
        )}
      </div>
    </div>
  );
}
