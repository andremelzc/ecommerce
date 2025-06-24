"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function MiPerfilPage() {
  const [toggleEdit, setToggleEdit] = useState(false);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    surname: session?.user?.surname || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
  });

  // Actualizar formData cuando session cambie
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        surname: session.user.surname || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, [session]);

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejar cancelar edición
  const handleCancel = () => {
    // Restaurar valores originales
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        surname: session.user.surname || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
    setToggleEdit(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/usuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?.id, // Asegúrate que exista
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al guardar");
      }

      const data = await response.json();
      console.log("Usuario actualizado:", data.message);
      setToggleEdit(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Hubo un error al guardar los cambios");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi perfil</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500 ${
                !toggleEdit ? "bg-ebony-50" : "bg-white"
              }`}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={session?.user?.name || "Tu nombre"}
              disabled={toggleEdit === false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500 ${
                !toggleEdit ? "bg-ebony-50" : "bg-white"
              }`}
              value={formData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              placeholder={session?.user?.surname || "Tu apellido"}
              disabled={toggleEdit === false}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500 ${
              !toggleEdit ? "bg-ebony-50" : "bg-white"
            }`}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={session?.user?.email || "Tu correo electrónico"}
            disabled={toggleEdit === false}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500 ${
                !toggleEdit ? "bg-ebony-50" : "bg-white"
              }`}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              disabled={toggleEdit === false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documento de identidad
            </label>
            <input
              type="tel"
              className="w-full px-3 bg-ebony-50 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              disabled={true}
            />
          </div>
        </div>

        <div className="flex justify-end">
          {!toggleEdit ? (
            <button
              className="bg-ebony-900 text-white px-6 py-2 rounded-md hover:bg-ebony-800 cursor-pointer transition-colors"
              onClick={() => setToggleEdit(!toggleEdit)}
            >
              Editar información
            </button>
          ) : (
            <div className="flex gap-6">
              <button
                className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 cursor-pointer transition-colors"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="bg-ebony-900 text-white px-6 py-2 rounded-md hover:bg-ebony-800 cursor-pointer transition-colors"
                onClick={() => setToggleEdit(!toggleEdit)}
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
