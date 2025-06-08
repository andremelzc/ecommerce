// app/add-promotions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePromotion, PromotionDraft } from '@/app/context/PromotionContext';

export default function PromotionForm() {
  const router = useRouter();
  const { promotionDraft, setPromotionDraft } = usePromotion();

  // Local form state initializes from context draft
  const [form, setForm] = useState<PromotionDraft>(promotionDraft);
  const [errorFecha, setErrorFecha] = useState<string>('');

  useEffect(() => {
    setForm(promotionDraft);
  }, [promotionDraft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'fecha_inicio' || name === 'fecha_fin') {
      const updated = { ...form, [name]: value };
      if (updated.fecha_inicio && updated.fecha_fin) {
        const start = new Date(updated.fecha_inicio).getTime();
        const end = new Date(updated.fecha_fin).getTime();
        setErrorFecha(start >= end ? 'La fecha de inicio debe ser anterior a la fecha de fin' : '');
      } else {
        setErrorFecha('');
      }
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation final
    const start = new Date(form.fecha_inicio).getTime();
    const end = new Date(form.fecha_fin).getTime();
    if (start >= end) {
      alert('❌ Error: La fecha final debe ser posterior a la fecha de inicio.');
      return;
    }

    // Save to context
    console.log('Saving promotion draft:', form);
    setPromotionDraft(form);
    // Navigate to step 2
    router.push('/admin/add-promotions/aplicar');
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Promoción</h1>
      <form className="space-y-6" onSubmit={handleNext}>
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block mb-2 font-semibold">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-4 py-2"
          />
        </div>
        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block mb-2 font-semibold">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={2}
            className="w-full rounded-md border px-4 py-2"
          />
        </div>
        {/* Imagen URL */}
        <div>
          <label htmlFor="img_promocional" className="block mb-2 font-semibold">
            Imagen (URL)
          </label>
          <input
            id="img_promocional"
            name="img_promocional"
            type="url"
            value={form.img_promocional}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-4 py-2"
          />
        </div>
        {/* Fecha Inicio */}
        <div>
          <label htmlFor="fecha_inicio" className="block mb-2 font-semibold">
            Fecha Inicio
          </label>
          <input
            id="fecha_inicio"
            name="fecha_inicio"
            type="date"
            value={form.fecha_inicio}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-4 py-2"
          />
        </div>
        {/* Fecha Fin */}
        <div>
          <label htmlFor="fecha_fin" className="block mb-2 font-semibold">
            Fecha Fin
          </label>
          <input
            id="fecha_fin"
            name="fecha_fin"
            type="date"
            value={form.fecha_fin}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-4 py-2"
          />
          {errorFecha && <p className="text-red-500 text-sm mt-1">{errorFecha}</p>}
        </div>

        <button
          type="submit"
          disabled={
            !!errorFecha ||
            !form.nombre ||
            !form.descripcion ||
            !form.img_promocional ||
            !form.fecha_inicio ||
            !form.fecha_fin
          }
          className="w-full mt-8 py-3 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </form>
    </div>
  );
}
