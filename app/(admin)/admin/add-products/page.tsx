'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categorias } from '../../../../lib/categorias'; // 👈 Importación externa

export default function AddProductPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen_producto: '',
    categoria1: '',
    categoria2: '',
    categoria3: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoria1' && { categoria2: '', categoria3: '' }),
      ...(name === 'categoria2' && { categoria3: '' }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Producto:', formData);
    alert('Formulario preparado con selección de categoría encadenada');
  };

  const handleNext = () => {
    console.log('Datos a pasar (no guardados aún):', formData);
    router.push('/admin/add-products/variantes');
  };

  const selectedCat1 = categorias.find((c) => c.id.toString() === formData.categoria1);
  const selectedCat2 = selectedCat1?.subcategorias.find(
    (s) => s.id.toString() === formData.categoria2
  );
  const hasSub2 = selectedCat1?.subcategorias || [];
  const hasSub3 = selectedCat2?.subsubcategorias || [];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear producto</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Imagen (URL)</label>
          <input
            type="url"
            name="imagen_producto"
            value={formData.imagen_producto}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* CATEGORÍA 1 */}
        <div>
          <label className="block mb-1 font-medium">Categoría</label>
          <select
            name="categoria1"
            value={formData.categoria1}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORÍA 2 */}
        {hasSub2.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Subcategoría</label>
            <select
              name="categoria2"
              value={formData.categoria2}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecciona una subcategoría</option>
              {hasSub2.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CATEGORÍA 3 */}
        {hasSub3.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Sub-subcategoría</label>
            <select
              name="categoria3"
              value={formData.categoria3}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecciona una opción</option>
              {hasSub3.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        
      </form>
      <button
        type="button"
        onClick={handleNext}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Siguiente
      </button>
    </div>
  );
}
