"use client";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const password = watch("contrasena");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">Registro</h2>

      <input
        type="text"
        placeholder="Nombre"
        {...register("nombre", { required: true })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Apellido"
        {...register("apellido", { required: true })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        {...register("tipo_identificacion", { required: true })}
        className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecciona tipo de identificación</option>
        <option value="DNI">DNI</option>
        <option value="Carnet de extranjeria">Carnet de extranjería</option>
      </select>
      <input
        type="text"
        placeholder="Número de Identificación"
        {...register("identificacion", { required: true })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        {...register("email", { required: true })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="tel"
        placeholder="Teléfono"
        {...register("telefono", {
          required: true,
          minLength: 9,
          maxLength: 9,
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Contraseña"
        {...register("contrasena", { required: true })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        {...register("confirmPassword", {
          required: true,
          validate: (value) => value === password || "Las contraseñas no coinciden",
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Registrarse
      </button>
    </form>
  );
}
 