'use client';

import { useState } from 'react';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando producto:', formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Agregar nuevo producto</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: 'Nombre', name: 'name', type: 'text' },
          { label: 'Descripción', name: 'description', type: 'textarea' },
          { label: 'Precio', name: 'price', type: 'number' },
          { label: 'Categoría', name: 'category', type: 'text' },
          { label: 'Stock', name: 'stock', type: 'number' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium text-gray-700 mb-1">{label}</label>
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar producto
        </button>
      </form>
    </div>
  );
}
