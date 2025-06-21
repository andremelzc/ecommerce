"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function MiPerfilPage() {
  const [toggleEdit, setToggleEdit] = useState(false);
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi perfil</h1>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ebony-500"
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
                className="bg-ebony-900 text-white px-6 py-2 rounded-md hover:bg-ebony-800 cursor-pointer transition-colors"
                onClick={() => setToggleEdit(!toggleEdit)}
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
