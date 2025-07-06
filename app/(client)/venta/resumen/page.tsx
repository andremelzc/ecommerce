/*
Paso 4 de 4
Resumen de la compra
Esta página muestra un resumen de la compra, incluyendo los detalles del usuario, dirección de envío,
 método de pago y los productos seleccionados.
*/
"use client";
import React from "react";
import { useState } from 'react';
import { useCheckout } from "@/app/context/CheckoutContext";

export default function ResumenPage() {
    // Aquí puedes usar el contexto de checkout para obtener la orden
    const { orden, setOrden } = useCheckout();

    return (
        <div className="min-h-screen bg-gradient-to-br from-ebony-50 to-ebony-100/30 py-4 sm:py-6">
            {/* Debug: mostrar datos del context de checkout */}
            <pre className="bg-yellow-50 text-xs text-yellow-900 border border-yellow-200 rounded p-2 mb-4 overflow-x-auto">
                <strong>orden (CheckoutContext):</strong>\n{JSON.stringify(orden, null, 2)}
            </pre>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ebony-900 mb-6">Resumen de la compra</h1>
                <pre className="bg-gray-50 text-xs text-gray-900 border border-gray-200 rounded p-2 mb-4 overflow-x-auto">
                    {JSON.stringify(orden, null, 2)}
                </pre>
            </div>
        </div>
    );
}